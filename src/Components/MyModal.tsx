import React from 'react';
import {Modal, ActivityIndicator, View} from 'react-native';

const MyModal = (show: boolean) => {
  //   console.log('show', show);
  return (
    <Modal animationType="slide" transparent={true} visible={show}>
      <View
        style={{
          flex: 1,
          // height: hp(100),
          backgroundColor: '#00000088',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          // position: 'absolute',
        }}>
        <View
          style={{
            height: 50,
            width: 50,
            // backgroundColor:"red",
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 25,
          }}>
          <ActivityIndicator size="small" color={'#5F95F0'} />
        </View>
      </View>
    </Modal>
  );
};

export default MyModal;
