export interface Message {
  sentBy?: string;
  senderName?: string;
  recievedBy?: string;
  senderImage?: string;
  type?: string;
  message: string;
  date: object;
}
