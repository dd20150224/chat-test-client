import 'react-chat-elements/dist/main.css'
import ChatDrawer from '@/components/chat/chatDrawer'
import { users } from '@/dummyData/data';
import NavbarLogo from '@/components/navbarLogo';

export default function Index() {
  const chatEndpoint = process.env.CHAT_ENDPOINT as string;
  users.sort((user1, user2) => {
    if (user2.displayName < user1.displayName) return 1
    else if(user2.displayName > user1.displayName) return -1
    else return 0;
  })
  return (
    <div className="w-full h-full bg-red-100">
      <div className="flex flex-col h-full">
        <div className="bg-slate-700 px-4 h-16 w-full flex flex-row items-center justify-between">
          <NavbarLogo/>
          {/* <div className="text-cyan-400 text-5xl p-4">YOOV</div> */}
        </div>
        <div className="grow w-100 grid grid-cols-2">
          <div></div>
          <div className="justify-content-stretch flex flex-col">
            <ChatDrawer users={users}
              endpoint={chatEndpoint}></ChatDrawer>
          </div>
        </div>
      </div>
    </div>
  )
}
