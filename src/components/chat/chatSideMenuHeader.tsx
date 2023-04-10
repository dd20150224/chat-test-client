import { useMemo } from 'react';
import {Avatar} from 'react-chat-elements';
import { 
  HiPlus, 
  HiUserGroup,
  HiArrowLongLeft, 
  HiArrowLongRight } from 'react-icons/hi2';
import useChat from './useChat';
import './chatSideMenuHeader.css';

// import { IUser } from '../../types';

interface IChatSideMenuHeader {
  onCommand: (payload: any) => void;
}

const ChatSideMenuHeader = ({onCommand}: IChatSideMenuHeader) => {
  const { currentUser } = useChat()

  const currentUserMeta = useMemo(() => {
    let result = ''
    if (currentUser?.meta) {
      result = `${currentUser.meta.firstName[0]}${currentUser.meta.lastName[0]}`
    }
    return {
      letterItem: {
        id: '000099',
        letter: <div className="leading-none">{result}</div>,
      },
    }
  }, [currentUser])
  
  const onShowSelection = () => {
    onCommand({command: 'showSelection'})
  }

  const newRoom = (evt: any) => {
    evt.stopPropagation();
    onCommand({command: 'newRoom'});
  }

  return (
    <>
      {currentUser ? (
        <div
          onClick={() => onShowSelection()}
          className="bg-teal-500 hover:bg-teal-600 active:bg-teal-700 transition=all duration-300 cursor-pointer rounded text-white grow-0 p-1 pl-2 w-full flex flex-row justify-between items-center"
        >
          {/* <ChatUserAvatar/> */}
          <div className="flex flex-row items-center">
            <Avatar size="xsmall" src="" alt="alt" {...currentUserMeta} />
            <div className="ml-2">{currentUser.displayName}</div>
          </div>
          <button
            onClick={(evt) => newRoom(evt)}
            className="flex flex-row items-center py-1 px-2 hover:bg-teal-500 bg-teal-400 rounded"
          >
            <HiPlus className="text-xl" />
            <HiUserGroup className="text-2xl" />
          </button>
        </div>
      ) : (
        <div
          style={{ height: '38px' }}
          className="gap-2 cursor-pointer justify-center text-center p-2 text-white bg-teal-500 hover:bg-teal-600 active:bg-teal-700 flex flex-row items-center"
          onClick={() => onShowSelection()}
        >
          <div className="w-9 flex flex-row justify-end">
            <HiArrowLongRight className="text-2xl left-to-right-motion" />
          </div>
          <div className="leading-none">Select your account</div>
          <div className="w-9 flex flex-row">
            <HiArrowLongLeft className="text-2xl right-to-left-motion" />
          </div>
        </div>
      )}
    </>
  )
}

export default ChatSideMenuHeader;
