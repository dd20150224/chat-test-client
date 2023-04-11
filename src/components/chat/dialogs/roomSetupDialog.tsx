import { useEffect, useMemo, useCallback } from 'react';
import { useState } from 'react';
import { IUser, IRoom } from '../types';
import useChat from '../useChat';

interface IRoomSetupDialog {
  roomId?: string;
  onClose: ()=>void;
  onConfirm: (room: IRoom)=>void;
}

const NEW_ROOM = {
  id: '',
  name: '',
  ownerId: '',
  userIds: []
};

const RoomSetupDialog = ({roomId='', onClose, onConfirm}: IRoomSetupDialog) => {
  const { users, rooms, currentUser } = useChat();
  // console.log('RoomSetupDialog starts');
  const [ activeRoom, SetActiveRoom ] = useState<IRoom>(NEW_ROOM);

  const getNextRoomName = useCallback(() => {
    let count = 1;
    let roomName:string = `Room #${count}`;
    let foundRoom = rooms.find(r => {
      return r.name === roomName
    });
    while (foundRoom) {
      count++;
      roomName = `Room #${count}`;
      foundRoom = undefined;
      for (let i = 0; i < rooms.length; i++) {
        const loopRoom = rooms[i];
        if (loopRoom.name === roomName) {
          foundRoom = loopRoom;
          break;
        }
      }
    }
    return roomName;
  }, [rooms]);

  useEffect(() => {
    let room: IRoom | undefined;
    if (roomId) {
      room = rooms.find( (r: IRoom) => r.id === roomId);
    } else {
      room = {
        id: '',
        ownerId: currentUser?.id as string,
        name: getNextRoomName(),
        userIds: []
      }
    }
    if (room) SetActiveRoom(room)
  }, [roomId, currentUser, rooms, getNextRoomName]);

  const isReadOnly = useMemo(() => {
    const rw = currentUser?.id === activeRoom?.ownerId;
    return !rw;
  }, [currentUser, activeRoom]);

  const title = useMemo(() => {
    // console.log('tite.userMemo()');
    return activeRoom ? `Room: ${activeRoom.name}` : 'New Room';
  }, [activeRoom]);

  const availableUsers = useMemo(() => {
    // console.log('availableUsers.useMemo');
    return users.filter( user => user.id !== (currentUser?.id));
  }, [users, currentUser]);

  const saveRoom = () => {
    // console.log('activeRoom: ', activeRoom);
    onConfirm(activeRoom);
  }

  const toggleUser = (user: IUser) => {
    if (!isReadOnly) {
      SetActiveRoom(prev => {
        const userIds = prev.userIds;
        const i = userIds.indexOf(user.id);
        return {
          ...prev,
          userIds: i >= 0
            ? userIds.filter(id => id !== user.id)
            : [...userIds, user.id]
        }
      })
    }
  };

  return (
    <div className="z-50 transition-all duration-1000 fixed left-0 top-0 w-screen h-screen">
      <div className="text-white">
        activeRoom.userIds: {activeRoom.userIds.length}
      </div>
      <div
        id="overlay"
        className="z-40 w-full h-full insert-0 bg-gray-900 bg-opacity-60"
      ></div>
      <div className="flex flex-col fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-md p-0 drop-shadow-lg">
        <div className="py-2 px-4 rounded-tl-md rounded-tr-md bg-teal-900 text-white text-xl text-center">
          {title}
        </div>
        <div className="flex flex-col w-full">
          <div className="px-2 pt-2">
            <div className="grid grid-cols-3 gap-1">
              <label className="text-right text-slate-400 pr-3">Owner</label>
              <div className="text-black col-span-2">
                {currentUser?.displayName}
              </div>
              <label className="self-center text-right text-slate-400 pr-3">
                Room Name
              </label>
              <div className="col-span-2">
                {isReadOnly ? (
                  <div>{activeRoom.name}</div>
                ) : (
                  <input
                    className="p-1  w-full focus:outline-teal-500 border border-1 border-slate-300 rounded"
                    value={activeRoom.name}
                    onChange={(evt) => {
                      console.log(
                        'onChange: evt.target.value = ' + evt.target.value
                      )
                      SetActiveRoom((prev) => {
                        return {
                          ...prev,
                          name: evt.target.value,
                        }
                      })
                    }}
                  />
                )}
              </div>
            </div>
            {/* <table className="w-full">
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <label className="text-slate-500">Room Name</label>
                  </td>
                  <td>
                  </td>
                </tr>
              </tbody>
            </table> */}
          </div>

          <div className="grid grid-cols-3 gap-1 px-2 py-2 text-sm">
            {availableUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => toggleUser(user)}
                className={`transition-all duration-100 cursor-pointer m-0 py-1 px-2 ${
                  activeRoom.userIds.includes(user.id)
                    ? (
                      isReadOnly
                      ? 'bg-teal-700 text-white cursor-default'
                      : 'bg-teal-500 hover:bg-teal-600 text-white'
                    )
                    : (
                      isReadOnly
                      ? 'bg-slate-200 cursor-default'
                      : 'bg-slate-200 hover:bg-slate-300'
                    )
                }`}
              >
                {user.displayName}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row p-2 justify-center gap-2">
          {!isReadOnly && (
            <button
              disabled={activeRoom.name === ''}
              onClick={() => saveRoom()}
              className={`min-w-[96px] py-1 px-4 rounded ${
                activeRoom.name !== ''
                  ? 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white'
                  : 'bg-slate-300 text-slate-100'
              } transition-all duration-300`}
            >
              OK
            </button>
          )}
          <button
            onClick={() => {
              onClose()
            }}
            className="min-w-[96px] border border-1 border-slate-500 rounded outline-solid  outline-slate-500 hover:bg-slate-500 hover:text-white py-1 px-4 rounded active:bg-slate-700 text-black transition-all duration-300"
          >
            {isReadOnly ? (
              <p>Close</p>
            ):(
              <p>Cancel</p>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomSetupDialog
