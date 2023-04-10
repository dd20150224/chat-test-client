import { useState, useCallback } from 'react';
import ChatTargetList from './chatTargetList';
// import AccountSelectionDialog from '../dialogs/accountSelectionDialog';
import { IUser, IRoom } from '@/types';
import ChatSideMenuHeader from './chatSideMenuHeader';
// import RoomSetupDialog from '@/components/dialogs/roomSetupDialog'

import useChat from './useChat';

interface IChatSideMenu {
  onCommand: (payload: any) => void;
}
const ChatSideMenu = ({onCommand}: IChatSideMenu) => {
  const { users, currentUser, onlineUserIds } = useChat();


  // const onShowSelection = useCallback(() => {
  //   setShowSelection(true);
  // }, [setShowSelection]);

  // const onSelectUser = (user: IUser) => {
  //   // console.log('onSelectUser');
  //   setShowSelection(false);
  //   console.log('chatSideMenu => setCurrentUser');
  //   setCurrentUser(user);
  // }

  // const onSaveRoom = (room: IRoom) => {
  //   setShowRoomSetup(false);
  //   saveRoom(room);
  // }
  // const onSaveRoom = (room: IRoom) => {
  //   setShowRoomSetup(false);
  //   saveRoom(room);
  // }

  // const onCommandHandler = useCallback( (payload: any ) => {
  //   switch (payload.command) {
  //     case 'showSelection':
  //       setShowSelection(true);
  //       break;
  //     case 'newRoom':
  //       setShowRoomSetup(true);
  //       break;
  //   }
  // }, [setShowSelection]);

  return (
    <div className="w-fit p-1 bg-white flex flex-col h-full rounded">
      <ChatSideMenuHeader onCommand={onCommand}></ChatSideMenuHeader>
      <div className="grow">
        <div className="h-0 min-h-full overflow-y-auto">
          <ChatTargetList />
        </div>
      </div>
      {/* {showSelection && (
        <AccountSelectionDialog
          users={users}
          currentUser={currentUser}
          onlineUserIds={onlineUserIds}
          onClose={() => setShowSelection(false)}
          onConfirm={onSelectUser}
        />
      )}
      {showRoomSetup && currentUser && (
        <RoomSetupDialog
          onClose={() => setShowRoomSetup(false)}
          onConfirm={onSaveRoom}
        />
      )} */}
      {/* users={users}
      owner={currentUser}
      onlineUserIds={onlineUserIds} */}
    </div>
  )
}

export default ChatSideMenu;
