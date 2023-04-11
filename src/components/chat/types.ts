export interface IMeta {
  avatarUrl: string
  alt: string
  firstName: string
  lastName: string
  greeting?: string
  lastlyUpdatedAt: Date
  unread?: number
  muted?: boolean
}

// interface IChatUserAvatar {
//   avatarUrl: string
//   alt: string
// }

export interface IUser {
  id: string;
  displayName: string;
  meta: IMeta;
  newMessageCount?: number;
}

// interface ITargetMeta {
//   [key: string]: any;
// }

export interface IChatTarget {
  type: string; // [user|userGroup]
  id: string;
}

// Return/Submit from/to server
export interface IMessage {
  id: string;
  position: string;
  senderId: string;
  roomId: string;
  type: string;
  title: string;
  text: string;
  avatar?: string;
  letterItem?: string;
  titleColor?: string;
  createdAt?: Date;
}

// Based on requirement for plugin
export interface IShownMessage {
  id: string;
  position: string  ;
  type: string;
  title: string;
  text: string;
  avatar?: string;
  titleColor?: string;
  letterItem?: string;
  date?: Date;
}

export interface IRoom {
  id: string;
  ownerId: string;
  name: string;
  userIds: string[];
  newMessageCount?: number;
}

export interface IChatTargetProps {
  item: IChatTarget;
}