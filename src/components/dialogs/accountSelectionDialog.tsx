import { useState, useCallback } from 'react';
import { IUser } from '@/types';
import tw from 'tailwind-styled-components';

const OptionItem = tw.div<any>`
  transition-all
  duration-100
  m-0
  py-1
  px-2
`;

interface IAccountSelectionDialog {
  users: IUser[];
  currentUser: IUser|null;
  onlineUserIds: Set<string>;
  onClose: ()=>void;
  onConfirm: (user:IUser)=>void;
}

const AccountSelectionDialog = ({
  users=[], 
  currentUser=null, 
  onlineUserIds=new Set<string>(), 
  onClose, 
  onConfirm}: IAccountSelectionDialog) => {

  const [ activeUser, setActiveUser ] = useState<IUser|null>(currentUser);

  const isSelectedByOthers = useCallback((userId: string) => {
    let result = false;
    if (onlineUserIds.has(userId)) {
      result = true;
      if (currentUser && (currentUser.id === userId)) {
          result = false
      }
    }
    return result;
  }, [currentUser, onlineUserIds]);
  
  const getOptionClass = (userId: string) => {
    let result = [];

    // if current user id
    if (isSelectedByOthers(userId)) {
      result = ['bg-slate-200', 'text-slate-400'];
    } else {
      if (activeUser && (userId === activeUser.id)) {
        result = ['bg-teal-500', 'hover:bg-teal-600', 'text-white', 'cursor-pointer'];
      } else {
        result = ['bg-slate-200', 'hover:bg-slate-300', 'cursor-pointer']
      }
    }
    return result.join(' ');
  }

  const onSelected = useCallback((user: any) =>  {
    if (!isSelectedByOthers(user.id)) {
      setActiveUser(user);
    }
  }, [isSelectedByOthers]);

  return (
    <div className="z-50 transition-all duration-1000 fixed left-0 top-0 w-screen h-screen">
      <div
        id="overlay"
        className="z-40 w-full h-full insert-0 bg-gray-900 bg-opacity-60"
      ></div>
      <div className="flex flex-col fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-md p-0 drop-shadow-lg">
        <div className="py-2 px-4 rounded-tl-md rounded-tr-md bg-teal-900 text-white text-xl text-center">
          Select your account (DEMO)
        </div>

        <div className="grid grid-cols-3 gap-1 px-2 py-2 text-sm">
          {users.map((user) => (
            <OptionItem
              key={user.id}
              onClick={() => onSelected(user)}
              className={getOptionClass(user.id)}
            >
              {user.displayName}
            </OptionItem>
          ))}
        </div>
        <div className="flex flex-row p-2 justify-center gap-2">
          <button
            disabled={!activeUser}
            onClick={() => {
              if (activeUser) onConfirm(activeUser)
            }}
            className={`min-w-[96px] py-1 px-4 rounded ${
              activeUser
                ? 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white'
                : 'bg-slate-300 text-slate-100'
            } transition-all duration-100`}
          >
            OK
          </button>
          <button
            onClick={() => {
              onClose()
            }}
            className="min-w-[96px] outline outline-1 outline-solid  outline-slate-500 hover:bg-slate-500 hover:text-white py-1 px-4 rounded active:bg-slate-700 text-black transition-all duration-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountSelectionDialog;
