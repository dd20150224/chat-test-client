import { useMemo } from 'react';
import useChat from './useChat';
import { IRoom, IUser } from '@/types';
import { HiEllipsisHorizontal } from 'react-icons/hi2';

interface IChatRoomHeader {
  onCommand: (payload: any) => void;
}

const ChatRoomHeader = ({onCommand}: IChatRoomHeader) => {
  const { users, activeRoom, currentUser, onlineUserIds } = useChat();

  // useEffect(() => {
  //   console.log('chatRoomHeader: useEffect[activeRoom]: ', activeRoom);
  // }, [activeRoom]);
  
  const isUserRoom = useMemo(() => {
    console.log('isUserRoom.useMemo[activeRoom]');
    return (activeRoom as IRoom).ownerId === '';
  }, [activeRoom]);

  const userRoomName = useMemo(() => {
    console.log('userRoomName useMemo[activeRoom]: activeRoom: ', activeRoom);
    const roomUserIds = (activeRoom as IRoom).userIds
    console.log('userRoomName: currentUser!.id = ' + currentUser!.id);
    console.log('userRoomName: activeRoom: ', activeRoom);

    const i = roomUserIds.findIndex((userId) => userId !== currentUser?.id)
    let result = ''
    if (i >= 0) {
      const targetUser = users.find((user) => user.id === roomUserIds[i])
      if (targetUser) {
        result = targetUser.displayName
      }
    }
    return result
  }, [currentUser, users, activeRoom])

  const roomName = useMemo(() => {
    // console.log('roomName.useMemo: activeRoom: ', activeRoom);
    // console.log('roomName.useMemo: userRoomName = ' + userRoomName);
    // console.log('roomName.useMemo: isUserRoom = ' + (isUserRoom ? 'yes' : 'no'));

    if (isUserRoom) {
      return userRoomName
    } else {
      return activeRoom?.name
    }
  }, [isUserRoom, userRoomName, activeRoom])

  const roomUsers: IUser[] = useMemo(() => {
    let result: IUser[] = [];
    if (activeRoom && activeRoom.ownerId) {
      const roomUserIds = [activeRoom.ownerId, ...activeRoom.userIds];
      for (let i = 0; i < roomUserIds.length; i++) {
        const roomUserId = roomUserIds[i]
        const foundUser = users.find((user) => user.id === roomUserId)
        if (foundUser) {
          result.push(foundUser)
        }
      }
    }
    return result;
  }, [users, activeRoom])

  const editRoom = () => {
    console.log('chatRoomHeader.editRoom: activeRoom: ', activeRoom);
    onCommand({command: 'editActiveRoom'});
  };

  return (
    <div
      className={`flex flex-row items-center rounded-tl rounded-br grow-0 bg-teal-900 bg-opacity-80 text-white py-1 px-2 leading-none ${
        isUserRoom ? 'h-10' : 'h-10'
      }`}
    >
      <div className="grow flex flex-col h-full justify-center">
        <div className="grow-0" style={{ marginBottom: '2px' }}>
          {roomName}
          {/* #{activeRoom?.id} */}
        </div>
        {roomUsers.length > 0 && (
          <div className="flex flex-row flex-wrap gap-1 leading-none">
            {roomUsers.map((user) => (
              <div
                key={user.id}
                className={`text-xs py-0 px-1 rounded ${
                  onlineUserIds.has(user.id) ? 'bg-teal-500' : 'bg-slate-400'
                } text-white leading-none`}
              >
                {user.displayName}
              </div>
            ))}
          </div>
        )}
      </div>
      {!isUserRoom && (
        <div className="grow-0">
          <button
            onClick={() => editRoom()}
            className="p-1 text-2xl hover:bg-teal-600 transition-all duration-300 rounded-full"
          >
            <HiEllipsisHorizontal />
          </button>
        </div>
      )}
    </div>
  )
}

export default ChatRoomHeader;
