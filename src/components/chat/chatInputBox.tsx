import useChat from './useChat';
import { useRef, useState, useLayoutEffect } from 'react';
import { HiRocketLaunch } from 'react-icons/hi2';

const MIN_TEXTAREA_HEIGHT = 40;

const ChatInputBox = () => {
  const { sendMessage, resetMessageCount } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState('')
  const onChange = (event: any) => setValue(event.target.value)

  useLayoutEffect(() => {
    // Reset height - important to shrink on delete
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'inherit'
      // Set height
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        MIN_TEXTAREA_HEIGHT
      )}px`
    }
  }, [value]);


  const onSendMessage = () => {
    sendMessage(value);
    setValue('');
    if (textareaRef.current)
      textareaRef.current.focus();
  }

  const onKeyDownHandler = (e: any) => {
    const keyCode = e.which || e.keyCode;
    if (keyCode === 13) {
      if (!e.shiftKey) {
        e.preventDefault();
        onSendMessage();
      }
    }
  }

  return (
    <div className="rounded flex flex-row grow-0 p-1 bg-red-200 line-height-1 h-12 ">
      <div className="relative grow bg-blue-200">
        <textarea ref={textareaRef}
          onFocus={()=>resetMessageCount()}
          rows={1}
          onKeyDown={evt=>onKeyDownHandler(evt)}
          onChange={onChange}
          style={{
            minHeight: MIN_TEXTAREA_HEIGHT,
            resize: 'none'
          }}
          className="rounded absolute bottom-0 leading-none focus:outline-teal-500 px-2 py-3 w-full"
          value={value} />
        {/* <input className="max-h-30 rounded absolute bottom-0 line-height-1 focus:outline-teal-500 p-1 w-full" /> */}
      </div>
      <button onClick={()=>onSendMessage()}
        className="ml-1 text-white w-20 bg-teal-500 hover:bg-teal-600 rounded text-center text-2xl">
        <HiRocketLaunch className="mx-auto" />
      </button>
    </div>
  )
}

export default ChatInputBox;
