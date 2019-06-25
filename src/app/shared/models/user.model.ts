export interface User {
  key?: string;
  fullName: string;
  userName: string;
  mockMail: string;
  imageLink: string;
  mockers?: Mocker[];
}

export interface Mocker {
  chatId: string;
  mockerName: string;
  imageLink: string;
  newMessageCount?: number;
  lastMessage?: string;
  lastUpdated?: string;
}

export interface UserForm {
  fullName?: string;
  userName: string;
  password: string;
}
