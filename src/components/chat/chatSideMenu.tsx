import ChatTargetList from './chatTargetList';
import ChatSideMenuHeader from './chatSideMenuHeader';

interface IChatSideMenu {
  onCommand: (payload: any) => void;
}

const ChatSideMenu = ({onCommand}: IChatSideMenu) => {
  return (
    <div className="w-fit p-1 bg-white flex flex-col h-full rounded">
      <ChatSideMenuHeader onCommand={onCommand}></ChatSideMenuHeader>
      <div className="grow">
        <div className="h-0 min-h-full overflow-y-auto">
          <ChatTargetList />
        </div>
      </div>
    </div>
  )
}

export default ChatSideMenu;
