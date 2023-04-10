import { FC, useMemo } from 'react';
import { ChatItem } from 'react-chat-elements';
import { IChatTarget, IChatTargetProps, IUser } from '@/types';
import useChat from './useChat';
import './chatTargetItem.css';

const ChatTargetItemUser: FC<IChatTargetProps> = ({ item }: {item: IChatTarget }) => {
  const { users, onlineUserIds, enterUserRoom, currentUser } = useChat()
  const targetItem: IUser | undefined = users.find(
    (user) => user.id === item.id
  )

  const unread: number = 0

  const meta = useMemo(() => {
    let result = ''
    if (targetItem?.meta) {
      result = `${targetItem.meta.firstName[0]}${targetItem.meta.lastName[0]}`
    }
    return {
      letterItem: {
        id: targetItem?.id as string,
        letter: <div className="leading-none">{result}</div>,
      },
    }
  }, [targetItem])

  const onItemClicked = (evt: any) => {
    if (currentUser) {
      console.log(
        'ChatTargetItemUser.onItemClicked: currentUser: ',
        currentUser
      )
      console.log('ChatTargetItemUser.onItemClicked: targetItem: ', targetItem)

      const userIdPair = [(currentUser as IUser).id, (targetItem as IUser).id]
      console.log('ChatTargetItemUser.onItemClicked: userIdPair: ', userIdPair)
      enterUserRoom(userIdPair)
    }
  }

  // useEffect(() => {
  //   console.log('chatTargetItem useEffect[onlineUserIds]: onlineUserIds: ', onlineUserIds);
  // }, [onlineUserIds]);

  return (
    <div>
      {targetItem && (
        <ChatItem
          id={item.id}
          {...meta}
          onClick={onItemClicked}
          avatar={targetItem.meta.avatarUrl}
          className={`${onlineUserIds.has(item.id) ? 'active' : 'in-active'} user-item`}
          alt={targetItem.meta.alt}
          title={targetItem.displayName}
          subtitle={targetItem.id}
          date={targetItem.meta.lastlyUpdatedAt}
          unread={unread}
          muted={targetItem.meta.muted}
        />
        // subtitle={targetItem.meta.greeting}
      )}
    </div>
  )
}

export default ChatTargetItemUser
