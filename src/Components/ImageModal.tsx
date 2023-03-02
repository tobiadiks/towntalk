import React from 'react';

import {Modal, View, Text, Image} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';

const ImageModal = (show: boolean, image: String, alter: Function) => {
  console.log('image', image);
  return (
    <Modal
      animationType="slide"
      onRequestClose={alter}
      transparent={true}
      visible={show}>
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
        <View style={{height: '90%', width: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              marginRight: 10,
              marginBottom: 10,
              justifyContent: 'flex-end',
            }}>
            <Icon
              name="circle-with-cross"
              onPress={alter}
              color={'white'}
              size={20}
            />
          </View>
          <Image
            source={{uri: image}}
            style={{width: '100%', height: '100%'}}
          />
        </View>
      </View>
    </Modal>
  );
};
export default ImageModal;
