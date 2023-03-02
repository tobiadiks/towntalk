import React, {useState} from 'react';

import {View, Text, Image, TouchableOpacity} from 'react-native';
const Comments = () => {
  const [show, setShow] = useState(false);
  return (
    <TouchableOpacity
      // onPress={() => {
      //   setLike(!like);
      //   setDislike(false);
      // }}
      style={{
        flexDirection: 'row',
        marginLeft: 10,
        alignItems: 'center',
      }}>
      <Image
        source={require('../assets/Images/comment.png')}
        style={{height: 10, width: 10}}
      />
      <Text
        style={{
          fontFamily: 'MontserratAlternates-Regular',
          marginLeft: 5,
          fontSize: 13,
        }}>
        Comments
      </Text>
    </TouchableOpacity>
  );
};

export default Comments;
