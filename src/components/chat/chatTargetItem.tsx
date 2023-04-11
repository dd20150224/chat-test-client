import { IChatTarget } from './types'
import './chatTargetItem.css'
import ChatTargetItemUser from './chatTargetItemUser';
import ChatTargetItemGroup from './chatTargetItemGroup';

const ChatTargetItem = ({ item }: { item: IChatTarget }) => {
  return (
    <div>
      {item.type === 'user' ? (
        <ChatTargetItemUser item={item}/>
      ) : (
        <ChatTargetItemGroup item={item}/>
      )}
    </div>
  )
}

export default ChatTargetItem
