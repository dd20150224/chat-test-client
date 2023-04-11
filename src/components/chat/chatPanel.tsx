import { useState, useEffect, useCallback } from 'react'
import tw from 'tailwind-styled-components'
import { HiChatBubbleLeftRight } from 'react-icons/hi2'

// types
import { IUser, IRoom } from './types';
import 'react-chat-elements/dist/main.css'

// components
import ChatRoomHeader from './chatRoomHeader';
import ChatSideMenu from './chatSideMenu'
import ChatRoomMessageList from './chatRoomMessageList'
import ChatInputBox from './chatInputBox'
// import ChatUserAvatar from './chatUserAvatar'

// hoots
import useChat from './useChat'
// import { IChatTarget } from '@/dummyData/users'

// dialogs
import AccountSelectionDialog from './dialogs/accountSelectionDialog'
import RoomSetupDialog from './dialogs/roomSetupDialog'


// import SplitterLayout from 'react-splitter-layout';
// import 'react-splitter-layout/lib/index.css'

// for (let i = 0; i < 10; i++) {
//   users.push({
//     id: `user-${i}`,
//     avatar: "https://www.gstatic.com/images/branding/product/1x/docs_2020q4_48dp.png",
//     name: `User #${i}`,
//     rooms: [],
//   })
// }

const ToggleButton = tw.div<any>`
  absolute
  text-white
  text-2xl
  cursor-pointer
  bg-teal-700 
  bg-opacity-50
  grid
  place-items-center 
  w-10
  h-20
  rounded-bl-3xl 
  rounded-tl-3xl 
  bottom-0
  right-full
`

interface IChatPanelPayload {
  users: IUser[];
  endpoint?: string;
}

const ChatPanel = ({users, endpoint}: IChatPanelPayload) => {
  const [show, setShow] = useState(false);
  const { currentUser, onlineUserIds, setUsers, activeRoom, setCurrentUser, saveRoom } = useChat();
  const [showSelection, setShowSelection] = useState(false)
  const [showRoomSetup, setShowRoomSetup] = useState(false)
  const [editRoomId, setEditRoomId] = useState('');
  
  useEffect(() => {
    console.log('ChatPanel useEffect[setUsers, users]: users: ', users);
    setUsers(users);
  }, [users, setUsers]);

  // useEffect(() => {
  //   console.log('chatPanel useEffect[activeRoom]: ', activeRoom);
  // }, [activeRoom]);

  useEffect(() => {
    console.log('useEffect[editRoomId]')
    setShowRoomSetup(editRoomId!=='');
  }, [editRoomId]);

  const onSelectUser = (user: IUser) => {
    // console.log('onSelectUser');
    setShowSelection(false)
    console.log('chatSideMenu => setCurrentUser')
    setCurrentUser(user)
  }

  const onSaveRoom = (room: IRoom) => {
    setEditRoomId('');
    setShowRoomSetup(false)
    saveRoom(room)
  }
  
  const editActiveRoom = useCallback(() => {
    console.log('editActiveRoom activeRoom: ', activeRoom);
    if (activeRoom) setEditRoomId(activeRoom?.id || '');
  }, [activeRoom]);

  const onCommandHandler = useCallback(
    (payload: any) => {
      console.log('chatPanel.onCommandHandler payload: ', payload);
      console.log('chatPanel.onCommandHandler activeRoom: ', activeRoom);
      console.log('editRoomId = ' + editRoomId);
      switch (payload.command) {
        case 'showSelection':
          setShowSelection(true);
          break
        case 'newRoom':
          setShowRoomSetup(true);
          break
        case 'editActiveRoom':
          editActiveRoom()
          break;
      }
    },
    [activeRoom, editActiveRoom, editRoomId]
  )

  const closeRoomSetupDialog = () => {
    setShowRoomSetup(false)
    setEditRoomId('');
  }
  
  return (
    <div
      style={{bottom: '50px'}}
      className={`transition-all duration-200 fixed top-20 right-0 ${
        show ? 'w-1/2' : 'w-0'
      }`}
    >
      <div className="relative h-full w-full">
        <div className="flex flex-row items-end h-full">
          <div className="rounded-tl bg-teal-700 bg-opacity-90 flex flex-row h-full w-full">
            {/* <SplitterLayout vertical={false}> */}
            <div className="z-20 p-2 h-full">
              <ChatSideMenu onCommand={onCommandHandler} />
            </div>
            <div className="z-10 p-2 flex flex-col h-full w-full">
              {activeRoom && (
                <div className="grow pl-0 flex flex-col h-full">
                  <ChatRoomHeader onCommand={onCommandHandler}/>
                  <ChatRoomMessageList />
                  <ChatInputBox />
                </div>
              )}
            </div>
            {/* </SplitterLayout> */}
          </div>
        </div>
        <ToggleButton
          onClick={() => {
            setShow(!show)
          }}
        >
          <HiChatBubbleLeftRight />
        </ToggleButton>
      </div>
      {showSelection && (
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
          roomId={editRoomId}
          onClose={() => closeRoomSetupDialog()}
          onConfirm={onSaveRoom}
        />
      )}
    </div>
  )
}

export default ChatPanel
