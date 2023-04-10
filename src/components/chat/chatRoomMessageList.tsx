import { useRef, useMemo, useEffect } from 'react';
import { MessageBox } from "react-chat-elements";
import { IUser, IShownMessage } from '@/types';
import useChat from './useChat';
import './chatRoomMessageList.css';

function ChatRoomMessageList() {
  const { messages, activeRoom, currentUser } = useChat();
  const messageList = useRef<HTMLDivElement>(document.createElement('div'));

  // const getSenderName = useCallback(
  //   (userId: string) => {
  //     const user = users.find((u) => u.id === userId)
  //     return user ? user.displayName : '(Unknown)'
  //   },
  //   [users]
  // )

  const shownMessages: IShownMessage[] = useMemo(() => {
    console.log('showMessages: messages: ', messages);
    return messages.map(message => {
      const position =
        (currentUser as IUser).id === message.senderId ? 'right' : 'left'
      const title = // message.avatar as string;
        activeRoom?.ownerId && position === 'left'
          ? message.title
          : ''
      const shownMessage: IShownMessage = {
        ...message,
        avatar: undefined,
        title, 
        position,
        date: message.createdAt
      }
      console.log('shownMessage: ', shownMessage);
      return shownMessage;
    })
  }, [activeRoom?.ownerId, currentUser, messages])

  useEffect(() => {
    if (messageList.current) {
      messageList.current.scroll({
        top: messageList.current.scrollHeight,
      })
    }
  }, [messages]);

  return (
    <div className="bg-teal-200 mb-1 grow p-2">
      <div 
        ref={messageList}
        className="h-0 min-h-full overflow-auto">
        {shownMessages.map((message: IShownMessage) => (
          // <div key={message.id}>{message.avatar}</div>
          // position={message.position}
          <MessageBox key={message.id} {...message} />
          // <MessageBox
          //   key={message.id}
          //   position={message.position}
          //   type={message.type}
          //   title={message.title}
          //   text={message.text}
          //   avatar={message.avatarUrl}
          //   titleColor={message.titleColor}
          //   date={message.date}
          // />
        ))}
      </div>
    </div>
  )
}

export default ChatRoomMessageList;
