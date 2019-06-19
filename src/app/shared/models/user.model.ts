export interface User {
  key?: string;
  fullName: string;
  userName: string;
  mockMail: string;
  mockers?: Mocker[];
}

export interface Mocker {
  chatId: string;
  lastMessage?: string;
}

export interface UserForm {
  fullName?: string;
  userName: string;
  password: string;
}
