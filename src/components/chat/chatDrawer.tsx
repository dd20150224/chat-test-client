import { IUser } from './types'
import { ChatProvider } from './useChat'
import ChatPanel from './chatPanel';

interface IChatPanelPayload {
  users: IUser[]
  endpoint?: string
}

const ChatDrawer = ({ users, endpoint='' }: IChatPanelPayload) => {
  return (
    <ChatProvider>
      <ChatPanel users={users} endpoint={endpoint}/>
    </ChatProvider>
  )
}

export default ChatDrawer
