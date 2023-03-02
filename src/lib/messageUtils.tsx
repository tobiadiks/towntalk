import database from '@react-native-firebase/database';

export const senderMsg = async (
  msgValue,
  currentUserId,
  guestUserId,
  date,
  items,
  // quote,
) => {
  // console.log('inside sender function');
  try {
    return await database()
      .ref('messeges/' + currentUserId)
      .child(guestUserId)
      .push({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          msg: msgValue,
          date,
          type: 'text',
          screen: items,
          // quote,
        },
      });
  } catch (error) {
    // console.log('error in send message', error);
    return error;
  }
};
export const senderImgMsg = async (
  msgValue,
  currentUserId,
  guestUserId,
  date,
) => {
  // console.log('inside sender function');
  try {
    return await database()
      .ref('messeges/' + currentUserId)
      .child(guestUserId)
      .push({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          msg: msgValue,
          date,
          type: 'image',
        },
      });
  } catch (error) {
    // console.log('error in send message', error);
    return error;
  }
};
export const imgSenderMsg = async (
  msgValue,
  currentUserId,
  guestUserId,
  date,
) => {
  // console.log('inside sender function');
  try {
    return await database()
      .ref('messeges/' + currentUserId)
      .child(guestUserId)
      .push({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          msg: msgValue,
          date,
        },
      });
  } catch (error) {
    // console.log('error in send message', error);
    return error;
  }
};

export const recieverMsg = async (
  msgValue,
  currentUserId,
  guestUserId,
  date,
  items,
  // quote,
) => {
  try {
    return await database()
      .ref('messeges/' + guestUserId)
      .child(currentUserId)
      .push({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          msg: msgValue,
          date,
          screen: items,
          // quote,
        },
      });
  } catch (error) {
    console.log('error in reciving message ', error);
    return error;
  }
};
export const senderLocation = async (
  msgValue,
  currentUserId,
  guestUserId,
  date,
  latitude,
  longitude,
  // quote,
) => {
  try {
    return await database()
      .ref('messeges/' + currentUserId)
      .child(guestUserId)
      .push({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          msg: msgValue,
          date,
          latitude,
          longitude,
          // quote,
        },
      });
  } catch (error) {
    console.log('error in reciving message ', error);
    return error;
  }
};
export const recieverLocation = async (
  msgValue,
  currentUserId,
  guestUserId,
  date,
  latitude,
  longitude,
  // quote,
) => {
  try {
    return await database()
      .ref('messeges/' + guestUserId)
      .child(currentUserId)
      .push({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          msg: msgValue,
          date,
          latitude,
          longitude,
          // quote,
        },
      });
  } catch (error) {
    console.log('error in reciving message ', error);
    return error;
  }
};
export const senderVoice = async (
  msgValue,
  currentUserId,
  guestUserId,
  date,
  // quote,
) => {
  try {
    return await database()
      .ref('messeges/' + currentUserId)
      .child(guestUserId)
      .push({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          audio: msgValue,
          date,

          // quote,
        },
      });
  } catch (error) {
    console.log('error in reciving message ', error);
    return error;
  }
};
export const recieverVoice = async (
  msgValue,
  currentUserId,
  guestUserId,
  date,

  // quote,
) => {
  try {
    return await database()
      .ref('messeges/' + guestUserId)
      .child(currentUserId)
      .push({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          audio: msgValue,
          date,

          // quote,
        },
      });
  } catch (error) {
    console.log('error in reciving message ', error);
    return error;
  }
};
