import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import moment from 'moment';
import {useSelector} from 'react-redux';
const Message = ({item, navigation}) => {
  const {userData, darkmode} = useSelector(({USER}) => USER);
  const [show, setShow] = useState(false);
  return (
    <TouchableOpacity
      onPress={() =>
        item.screen
          ? navigation.navigate('PostDetails', {item: item.screen})
          : console.log('hello')
      }
      onLongPress={() => setShow(true)}
      style={{
        padding: 10,
        borderRadius: 5,
        maxWidth: '90%',
        // position: 'relative',
        zIndex: -1,
        // lineSpacing:1,

        backgroundColor:
          item.sendBy == userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, '')
            ? '#200E32'
            : '#EBEBEB',
      }}>
      {show && (
        <View
          style={{
            position: 'absolute',
            zIndex: 10,
            height: 50,
            // top: 50,
            left: 20,
            // bottom: 55,
            elevation: 5,
            width: 250,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            backgroundColor: '#ccc',
            borderRadius: 30,
          }}>
          <Text
            onPress={() => {
              setShow(false);
            }}>
            Laugh
          </Text>
          <Text onPress={() => setShow(false)}>Laugh</Text>
          <Text onPress={() => setShow(false)}>Laugh</Text>
        </View>
      )}

      <Text
        style={{
          lineHeight: 20,
          fontFamily: 'MontserratAlternates-Regular',
          color:
            item.sendBy == userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, '')
              ? 'white'
              : 'black',
        }}>
        {item.msg}
      </Text>
      <View style={{alignItems: 'flex-end'}}>
        <Text
          style={{
            fontSize: 10,
            fontFamily: 'MontserratAlternates-Regular',
            color:
              item.sendBy ==
              userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, '')
                ? 'white'
                : 'grey',
          }}>
          {moment(item.date).format('MM/DD/YYYY hh:mm a')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Message;
