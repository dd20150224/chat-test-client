import { useState, useMemo, FC, useEffect } from 'react'
import { ChatItem } from 'react-chat-elements'
import useChat from './useChat'
import { IChatTargetProps, IRoom } from '@/types'
import './chatTargetItem.css'
import { HiUserGroup } from 'react-icons/hi2';

const ChatTargetItemGroup: FC<IChatTargetProps> = ({ item }: IChatTargetProps) => {
  const { rooms, onlineUserIds, enterGroupRoom } = useChat();
  const [ targetItem, setTargetItem ] = useState<IRoom|null>(null);

  console.log('ChatTargetItemGroup: targetItem: ')

  useEffect(() => {
    const targetRoom: IRoom|undefined = rooms.find((room) => room.id === item.id)
    if (targetRoom) setTargetItem(targetRoom)
  }, [item.id, rooms]);

  // const targetItem: IRoom | undefined = useMemo(() => {
  //   return rooms.find(
  //     (room) => room.id === item.id
  //   )
  // }, [rooms, item.id]);

  const onItemClicked = (evt: any) => {
    enterGroupRoom((targetItem as IRoom).id);
  }

  const unread: number = 0

  const meta = useMemo(() => {
    return {
      letterItem: {
        id: targetItem?.id as string,
        letter: <HiUserGroup className="text-3xl"/>,
      },
    }
  }, [targetItem])

  const title = useMemo(() => {
    if (targetItem) {
      let userIds = targetItem.userIds;
      const allUserIds = [...userIds];
      if (targetItem.ownerId) allUserIds.push(targetItem.ownerId);

      const userCountOnline = allUserIds.reduce<number>(
        (count: number, userId: string) => {
          return onlineUserIds.has(userId) ? count + 1 : count
        },
        0
      )
      return `${(targetItem as IRoom).name} [${userCountOnline}/${allUserIds.length}]`;
    }
    return '';
  }, [targetItem, onlineUserIds]);

  const subTitle = '';
  return (
    <div>
      {targetItem && (
        <ChatItem
          id={item.id}
          {...meta}
          onClick={onItemClicked}
          avatar=""
          className="active group-item"
          alt=""
          title={title}
          subtitle={subTitle}
          unread={unread}
          muted={false}
        />
        // subtitle={targetItem.meta.greeting}
      )}
    </div>
  )
}

export default ChatTargetItemGroup
