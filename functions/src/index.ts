import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
admin.initializeApp();
export const notifyUser = functions.firestore
  .document('chats/{chatId}/conversations/{doc}')
  .onCreate((change, context) => {
    const text: any = change.data();

    const payload = {
      notification: {
        title: 'New Message',
        body: 'you have a new message from ' + text.senderName,
        icon: text.senderImage
      }
    };

    const recievedBy = text.recievedBy;

    return admin
      .firestore()
      .collection('fcmTokens')
      .doc(recievedBy)
      .get()
      .then((d: DocumentSnapshot) => {
        console.log(d.data());
        console.log(d.exists);
        const data: any = d.data();
        const token: any = Object.values(data) || [];
        console.log('token', token);
        return admin
          .messaging()
          .sendToDevice(token, payload)
          .catch(err => {
            console.log(err);
          });
      });
  });
