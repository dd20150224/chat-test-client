import { useCallback, useEffect, useState, useContext, createContext } from 'react';

// types
import { IUser, IRoom, IMessage } from './types';
import socketio from 'socket.io-client';

// import { icons } from 'react-icons/lib';

console.log('process.env: ', process.env);
console.log(
  'process.env[NX_CHAT_TEST_ENDPOINT] = ' + process.env['NX_CHAT_TEST_ENDPOINT']
)

export const socket = socketio(process.env['NX_CHAT_TEST_ENDPOINT'] as string)

socket.on('connect', () => {
  console.log('Socket connected.')
  socket.emit('get-users-status');
})

socket.connect();

interface IChatContext {
  users: IUser[];
  messages: IMessage[];
  rooms: IRoom[],

  socketId: string;
  currentUser: IUser | null;
  onlineUserIds: Set<string>;
  activeRoom: IRoom | null;

  enterUserRoom: (userIdPair: string[]) => void;
  enterGroupRoom: (roomId: string) => void;

  setCurrentUser: (user: IUser) => void;
  setUsers: (users: IUser[]) => void;
  saveRoom: (room: IRoom) => void;
  sendMessage: (message: string) => void;

  connect?: () => void;
  send?: (message: string) => void;
}

const DEFAULT_VALUE: IChatContext = {
  users: [],
  messages: [],
  rooms: [],

  socketId: '',
  currentUser: null,
  onlineUserIds: new Set(),
  activeRoom: null,

  enterUserRoom: (userIdPair: string[]) => {},
  enterGroupRoom: (roomId: string) => {},

  setCurrentUser: (user: IUser) => {},
  setUsers: (usres: IUser[]) => {},
  saveRoom: (room: IRoom) => {},
  sendMessage: (message: string) => {},
}

const ChatContext = createContext<IChatContext>(DEFAULT_VALUE);

const useChat = (): IChatContext => {
  const {
    users, 
    messages, 
    rooms,

    socketId,
    currentUser,
    onlineUserIds,
    activeRoom,
    
    enterUserRoom,
    enterGroupRoom,

    setCurrentUser,
    setUsers,
    saveRoom,
    sendMessage,
  } = useContext<IChatContext>(ChatContext);


  // useEffect(() => {
  //   console.log(
  //     'useChat useEffect[activeRoom]: activeRoom: ', 
  //     (activeRoom as IRoom)
  //   );
  // }, [activeRoom]);

  const send = (message: string) => {
    socket.emit('send_mesage', 'xxx');
  }
 
  const connect = useCallback(() => {
    console.log('useChat => connect');
    socket.emit('init');
  }, []);

  return {
    users,
    messages, 
    rooms,

    socketId,
    currentUser,
    onlineUserIds,
    activeRoom,

    enterUserRoom,
    enterGroupRoom,

    setCurrentUser,
    setUsers,
    saveRoom,
    sendMessage,
    
    connect,
    send,
  }
}



export const ChatProvider = ({children}: {children:any}) => {
  const [ activeRoom, setActiveRoom ] = useState<IRoom|null>(null);
  const [ currentUser, setCurrentUser ] = useState<IUser|null>(null)
  const [ onlineUserIds, setOnlineUserIds ] = useState<Set<string>>(new Set());
  const [ rooms, setRooms ] = useState<IRoom[]>([]);
  const [ messages, setMessages ] = useState<IMessage[]>([]);
  const [ users, setUsers ] = useState<IUser[]>([]);

  // const getSenderName = useCallback((userId: string) => {
  //   const user = users.find(u => u.id === userId);
  //   return user ? user.displayName : '(Unknown)';
  // }, [users])

  useEffect(() => {
    socket.on('users-status', (data) => {
      console.log('users-status: data: ', data)

      // update online status
      setOnlineUserIds((prev) => {
        const newSet = new Set([...data.userIds])
        return newSet
      })

      // update new message count
      if (data.newMessagesInfo) {
        const roomMessagesInfo = data.newMessagesInfo.filter(info => info.type === 'room');
        const userMessagesInfo = data.newMessagesInfo.filter(info => info.type === 'user');

        // update rooms
        setRooms(prev => {
          let updated = [...prev];
          for (let i = 0; i < roomMessagesInfo.length; i++) {
            const loopInfo = roomMessagesInfo[i];
            const index = updated.findIndex(room => room.id === loopInfo.id);
            updated[index].newMessageCount = loopInfo.count;
          }
          return updated;
        })
        // update users
        setUsers(prev => {
          let updated = [...prev];
          for (let i = 0; i < userMessagesInfo.length; i++) {
            const loopInfo = userMessagesInfo[i];
            const index = updated.findIndex(user => user.id === loopInfo.id);
            updated[index].newMessageCount = loopInfo.count;
          }          
          return updated;
        })
      }
    })

    socket.on('rooms-status', (data) => {
      console.log('rooms-status: data: ', JSON.stringify(data))
      const groupRooms = data.rooms.filter(
        (room: { ownerId: any }) => (room.ownerId !== '')
      )
    
      // remove activeRoom if it is group room and not in groupRooms
      if (activeRoom && activeRoom.ownerId !== '') {
        const groupRoom = groupRooms.find((room: { id: string; }) => room.id === activeRoom.id);
        if (!groupRoom) {
          setActiveRoom(null);
        }
      }
      console.log('rooms-status: groupRooms.length: ', groupRooms.length);
      setRooms(groupRooms)
    })

    socket.on('room-status', ({room: updatedRoom}) => {
      console.log('room-status: updatedRoom: ', updatedRoom);
      if (activeRoom && (updatedRoom.id === activeRoom.id)) {
        setActiveRoom(updatedRoom)
      }
      setRooms(prev => {
        const index = rooms.findIndex(room => room.id === updatedRoom.id);
        if (index >= 0) {
          // update
          rooms.splice(index, 1, updatedRoom);
          return [...rooms];
        }
        return prev;
      })
      // console.log('room-status: data: ', data);
    })

    socket.on('user-status-update', (data) => {
      console.log('user-status-update: data: ', data)

      const newMessageCount = data.newMessageCount ? data.newMessageCount.length : 0;
      setUsers(prev => {
        const userIndex = users.findIndex( user => user.id===data.userId );
        const user = users[userIndex];
        user.newMessageCount = newMessageCount;
        const result = [...prev];
        result.splice(userIndex, 1, user);
        return result;
      })
      
      if (data.isOn) {
        setOnlineUserIds((prev) => {
          const newSet = new Set(prev)
          newSet.add(data.userId)
          console.log('user_status-update: newSet: ', newSet)
          return newSet
        })
      } else {
        setOnlineUserIds((prev) => {
          const newSet = new Set(prev)
          newSet.delete(data.userId)
          console.log('user_status-update: newSet: ', newSet)
          return newSet
        })
      }
      
    })

    socket.on('init-room', (payload) => {
      const room = payload.room;
      setMessages(payload.messages)
      setActiveRoom(room)
    })

    socket.on('message-count-update', () => {})

    socket.on('message', (data) => {
      console.log('on(message) data: ', data)
      const message = data.message
      // const sender = data.sender

      // const newMessage: IMessage = {
      //   ...message,
      //   title: message.senderDisplayName,
      //   senderLetterName: message.senderLetterName,
      //   senderAvatarUrl: message.senderAvatarUrl,
      // }
      // message = {
      //   id:
      //   type: 'text',
      //   text: textMessage,
      //   roomId: (activeRoom as IRoom).id,
      //   senderId: (currentUser as IUser).id,
      // }
      if (activeRoom && activeRoom.id === message.roomId) {
        
        setMessages((prev) => {
          return [
            ...prev,
            message
          ];
        })
        // const position =
        //   (currentUser as IUser).id === message.senderId ? 'right' : 'left'
        // const title =
        //   activeRoom.ownerId && position === 'left'
        //     ? getSenderName(message.senderId)
        //     : ''

        // const newMessage = {
        //   id: message.id,
        //   type: message.type,
        //   title,
        //   text: message.text,
        //   sentAt: message.createdAt,
        //   position,
        // }
        // console.log('append message: ', newMessage)
        // setMessages((prev) => {
        //   console.log('setMessages prev.length = ' + prev.length);
        //   return [...prev, newMessage]
        // })
      } else {
        console.log('on(message) activeRoom?.id = ' + activeRoom?.id)
        console.log('on(message) message.roomId = ' + message.roomId)
      }
    })

    socket.on('leave-room', () => {
      setMessages([])
      setActiveRoom(null)
    })

    return () => {
      socket.off('users-status');
      socket.off('rooms-status');
      socket.off('user-status-update');
      socket.off('init-room');
      socket.off('message-count-update');
      socket.off('message');
      socket.off('leave-room');
    };
  },[activeRoom, rooms]);

  useEffect(() => {
    if (currentUser) {
      console.log(
        'ChatProvider => useEffect[currentUser] => socket.connect displayName = ' +
          currentUser.displayName
      )
      console.log('connect-user: userId: ' + currentUser.id);
      socket.emit('connect-user', {
        userId: currentUser.id,
        displayName: currentUser.displayName,
        firstName: currentUser.meta?.firstName,
        lastName: currentUser.meta?.lastName,
        avatarUrl: currentUser.meta?.avatarUrl,
      });      
    }
  }, [currentUser])

  // const updateUsers = () => {}

  const sendMessage = (textMessage: string) => {
    console.log('ChatProvider sendMessage: message = ' + textMessage);
    console.log('ChatProvider sendMessage: activeRoom: ', activeRoom);
    const payload = {
      type: 'text',
      text: textMessage,
      roomId: (activeRoom as IRoom).id,
      senderId: (currentUser as IUser).id,
    }
    socket.emit('message', payload);
    // const newMessage = {
    //   id: `message-${messages.length+1}`,
    //   position: 'right',
    //   type: 'text',
    //   title: '',
    //   text: message,
    // };
    // setMessages(prev => {
    //   return [
    //     ...prev,
    //     newMessage
    //   ]
    // })
  }

  const saveRoom = (room: IRoom) => {
    console.log('saveRoom: room: ', room);
    socket.emit('save-room', {room});
  }

  const enterUserRoom = (userIdPair: string[]) => {
    socket.emit('enter-user-room', {userIdPair});
  }

  const enterGroupRoom = (roomId: string) => {
    socket.emit('enter-group-room', {roomId});
  }

  // const setUsers = (users: IUser[]) => {
  //   console.log('useChat: setUsers: ', users);
  //   setUsersx(users);
  // }
  const value = {
    users,
    messages,
    rooms,

    socketId: socket.id,
    currentUser,
    onlineUserIds,
    activeRoom,

    enterUserRoom,
    enterGroupRoom,

    setCurrentUser,
    setUsers,
    saveRoom,
    sendMessage,
  }
  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  )
}

export default useChat;