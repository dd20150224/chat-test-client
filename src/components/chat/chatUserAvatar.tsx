import { useMemo } from 'react';

// hooks
import useChat from './useChat';

const ChatUserAvatar = () => {
  const { currentUser } = useChat();

  const { avatarUrl, alt } = useMemo(() => {
    let result = {
      avatarUrl: '',
      alt: ''
    }
    if (currentUser) {
      result = {
        avatarUrl: currentUser.meta.avatarUrl,
        alt: currentUser.meta.alt
      }
    }
    return result
  }, [currentUser]);

  return (
    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" 
      src={avatarUrl} 
      alt={alt}/>
  )
}

export default ChatUserAvatar;
