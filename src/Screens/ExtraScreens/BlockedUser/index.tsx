import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  FlatList,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import Icons from 'react-native-vector-icons/AntDesign';
import {unBlockUser, blockUserList} from '../../../lib/api';
const BlockedUser = ({navigation}) => {
  const {userData, darkmode} = useSelector(({USER}) => USER);
  const [alter, setAlter] = useState(false);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    blockUserList({Auth: userData.token}).then(res => {
      console.log('res', res);
      setUsers(res.data);
    });
  }, [alter]);
  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        // console.log('item', item);
        Alert.alert(
          'Unblock user',
          `Are you sure you want to unblock ${item.firstname}?`,
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                unBlockUser({Auth: userData.token, block_user_id: item.id})
                  .then(res => {
                    console.log('res of delte', res);
                    if (res.status == 'success') {
                      setAlter(!alter);
                    }
                  })
                  .catch(err => {
                    console.log('err', err.response.data);
                  });
                // logoutuser(false)(dispatch);
              },
            },
          ],
        );
      }}
      style={{
        flexDirection: 'row',
        borderBottomColor: 'grey',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        backgroundColor: darkmode ? '#242527' : 'white',
        marginTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={{height: 50, width: 50, borderRadius: 50}}
          source={
            item.image
              ? {uri: item.image}
              : require('../../../assets/Images/girl.jpg')
          }
        />
        <Text style={{marginLeft: 10, color: darkmode ? 'white' : 'black'}}>
          {item.firstname}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Unblock user',
            `Are you sure you want to unblock ${item.firstname}?`,
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                  unBlockUser({Auth: userData.token, block_user_id: item.id})
                    .then(res => {
                      console.log('res of delte', res);
                      if (res.status == 'success') {
                        setAlter(!alter);
                      }
                    })
                    .catch(err => {
                      console.log('err', err.response.data);
                    });
                  // logoutuser(false)(dispatch);
                },
              },
            ],
          );
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 50,
          // marginTop: 30,
          paddingHorizontal: 20,
          //   width: 100,
          borderRadius: 5,
          elevation: 2,
          backgroundColor: '#5F95F0',
        }}>
        <Text
          style={{
            fontFamily: 'MontserratAlternates-SemiBold',
            color: 'white',
          }}>
          Unblock
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
      {/* <ImageBackground
        style={{height: '100%'}}
        source={require('../../../assets/Images/back.png')}> */}
      <View
        style={{
          height: 80,
          backgroundColor: darkmode ? '#242527' : 'white',
          elevation: 3,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          // justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#ccc',
            borderRadius: 5,
            height: 30,
            width: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Icons name="left" size={20} color={'black'} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'MontserratAlternates-SemiBold',
            color: darkmode ? 'white' : 'black',
            marginLeft: 20,
          }}>
          Blocked Users
        </Text>
        {/* <Text style={{fontFamily: 'MontserratAlternates-Regular'}}>
                  Chicago, IL 60611, USA
                </Text> */}
      </View>
      <View style={{marginTop: 0, marginHorizontal: 10}}>
        <FlatList data={users} renderItem={renderItem} />
      </View>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
};
export default BlockedUser;
