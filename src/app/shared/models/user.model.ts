export interface User {
  key?: string;
  firstName: string;
  lastName?: string;
  userName: string;
  uCode?: string;
}

export interface Mocker extends User {
  coMockers?: User[];
}
