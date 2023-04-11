import { useState, useEffect } from 'react';

// types
import { IRoom, IChatTarget } from './types';

// hooks
import useChat from './useChat';

// components
import ChatTargetItem from './chatTargetItem';

const ChatTargetList = () => {
  const { users, rooms, currentUser } = useChat();
  const [ items, setItems ] = useState<IChatTarget[]>([]);

  useEffect(() => {
    console.log('ChatTargetList users: ', users);
  }, [users]);

  useEffect(() => {
    console.log('chatTargetList: useEffect([users, rooms, currentUser]) user count = ' + users.length);
    let result: IChatTarget[] = []

    // rooms
    console.log('ChatTargetList: rooms: ', rooms)
    for (let i = 0; i < rooms.length; i++) {
      const loopRoom: IRoom = rooms[i];
      result.push({
        type: 'userGroup',
        id: loopRoom.id
      })
    }
    console.log('ChatTargetList rooms.length = ' + result.length);

    // users
    const userTargets = users.map(user => {
      return {
        type: 'user',
        id: user.id
      };
    });
    
    // exclude current user
    let filtered = userTargets;
    if (currentUser) {
      filtered = userTargets.filter(target => target.id !== currentUser.id);
    }
    console.log('CharTargetList users.length = ' + filtered.length);
    result = result.concat(filtered);

    console.log('ChatTargetList: result.length = ' + result.length);
    setItems(result);
  }, [users, rooms, currentUser]);

  return (
    <div className="flex flex-col">
      {/* <div>rooms: {rooms.length}</div> */}
      {items.map(item => (
        <ChatTargetItem key={item.id} item={item}/>
      ))}
    </div>
  );
}

export default ChatTargetList;
