import React, {useState, useEffect} from 'react';

import {
  View,
  FlatList,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground,
} from 'react-native';
import moment from 'moment';
import {getNotification} from '../../../lib/api';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
const Notification = ({navigation}) => {
  const [notification, setNotification] = useState([]);
  const {userData, darkmode} = useSelector(({USER}) => USER);
  const render = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        item.type == 'post_like'
          ? navigation.navigate('PostDetails', {item: item.post})
          : item.type == 'post_dislike'
          ? navigation.navigate('PostDetails', {item: item.post})
          : item.type == 'post_comment'
          ? navigation.navigate('Comments', {id: item.post_id})
          : navigation.navigate('TabNavigator', {
              screen: 'Profile',
            });
      }}
      style={{
        flexDirection: 'row',
        marginTop: index == 0 ? 30 : 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 20,
        // justifyContent: 'space-between',
      }}>
      {item.type == 'post_like' ? (
        <>
          <Image
            source={
              item.user_data.image
                ? {uri: item.user_data.image}
                : require('../../../assets/Images/girl.jpg')
            }
            style={{height: 40, width: 40, borderRadius: 30}}
          />
          <View style={{width: '70%', marginLeft: 15}}>
            <Text
              style={{
                fontSize: 14,
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              {item.user_data.firstname}
              <Text style={{fontFamily: 'MontserratAlternates-Regular'}}>
                {' '}
                liked your post
              </Text>
            </Text>
            {/* <Text style={{color: 'grey', fontSize: 12, marginTop: 5}}>
              Commented on your post
            </Text> */}
            {/* <Text style={{color: 'black', marginTop: 5}}>
          "I am interested in taking you to see my place. Contact me at
          +92-333-XXXXXXX"
        </Text> */}
          </View>
          <Text
            style={{
              fontSize: 10,
              color: darkmode ? 'white' : 'black',
              fontFamily: 'MontserratAlternates-Regular',
            }}>
            {moment(item.date).format('MM/DD/YYYY')}
          </Text>
        </>
      ) : item.type == 'post_dislike' ? (
        <>
          <Image
            source={
              item.user_data.image
                ? {uri: item.user_data.image}
                : require('../../../assets/Images/girl.jpg')
            }
            style={{height: 40, width: 40, borderRadius: 30}}
          />
          <View style={{width: '70%', marginLeft: 15}}>
            <Text
              style={{
                fontSize: 14,
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              {item.user_data.firstname}
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-Regular',
                  color: darkmode ? 'white' : 'black',
                }}>
                {' '}
                disliked your post
              </Text>
            </Text>
            {/* <Text style={{color: 'grey', fontSize: 12, marginTop: 5}}>
              Commented on your post
            </Text> */}
            {/* <Text style={{color: 'black', marginTop: 5}}>
          "I am interested in taking you to see my place. Contact me at
          +92-333-XXXXXXX"
        </Text> */}
          </View>
          <Text
            style={{
              fontSize: 10,
              color: darkmode ? 'white' : 'black',
              fontFamily: 'MontserratAlternates-Regular',
            }}>
            {moment(item.date).format('MM/DD/YYYY')}
          </Text>
        </>
      ) : item.type == 'profile_dislike' ? (
        <>
          <Image
            source={
              item.user_data.image
                ? {uri: item.user_data.image}
                : require('../../../assets/Images/girl.jpg')
            }
            style={{height: 40, width: 40, borderRadius: 30}}
          />
          <View style={{width: '70%', marginLeft: 15}}>
            <Text
              style={{
                fontSize: 14,
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              {item.user_data.firstname}
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-Regular',
                  color: darkmode ? 'white' : 'black',
                }}>
                {' '}
                disliked your profile
              </Text>
            </Text>
            {/* <Text style={{color: 'grey', fontSize: 12, marginTop: 5}}>
              Commented on your post
            </Text> */}
            {/* <Text style={{color: 'black', marginTop: 5}}>
          "I am interested in taking you to see my place. Contact me at
          +92-333-XXXXXXX"
        </Text> */}
          </View>
          <Text
            style={{
              fontSize: 10,
              color: darkmode ? 'white' : 'black',
              fontFamily: 'MontserratAlternates-Regular',
            }}>
            {moment(item.date).format('MM/DD/YYYY')}
          </Text>
        </>
      ) : item.type == 'profile_like' ? (
        <>
          <Image
            source={
              item.user_data.image
                ? {uri: item.user_data.image}
                : require('../../../assets/Images/girl.jpg')
            }
            style={{height: 40, width: 40, borderRadius: 30}}
          />
          <View style={{width: '70%', marginLeft: 15}}>
            <Text
              style={{
                fontSize: 14,
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              {item.user_data.firstname}
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-Regular',
                  color: darkmode ? 'white' : 'black',
                }}>
                {' '}
                liked your profile
              </Text>
            </Text>
            {/* <Text style={{color: 'grey', fontSize: 12, marginTop: 5}}>
              Commented on your post
            </Text> */}
            {/* <Text style={{color: 'black', marginTop: 5}}>
          "I am interested in taking you to see my place. Contact me at
          +92-333-XXXXXXX"
        </Text> */}
          </View>
          <Text
            style={{
              fontSize: 10,
              color: darkmode ? 'white' : 'black',
              fontFamily: 'MontserratAlternates-Regular',
            }}>
            {moment(item.date).format('MM/DD/YYYY')}
          </Text>
        </>
      ) : (
        <>
          <Image
            source={
              item.user_data.image
                ? {uri: item.user_data.image}
                : require('../../../assets/Images/girl.jpg')
            }
            style={{height: 40, width: 40, borderRadius: 30}}
          />
          <View style={{width: '70%', marginLeft: 15}}>
            <Text
              style={{
                fontSize: 14,
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              {item.user_data.firstname}
            </Text>
            <Text
              style={{
                color: 'grey',
                fontSize: 12,
                fontFamily: 'MontserratAlternates-Medium',
                marginTop: 5,
              }}>
              Commented on your post
            </Text>
            <Text
              numberOfLines={2}
              style={{
                color: 'black',
                fontFamily: 'MontserratAlternates-Regular',
                marginTop: 5,
              }}>
              {item.message}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'MontserratAlternates-Regular',
              color: darkmode ? 'white' : 'black',
              fontSize: 10,
            }}>
            {moment(item.date).format('MM/DD/YYYY')}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
  useEffect(() => {
    getNotification({Auth: userData.token}).then(res => {
      console.log('res of notifications', res);
      setNotification(res.data.reverse());
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
  }, []);
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
      {/* <ImageBackground
        style={{flex: 1}}
        source={require('../../../assets/Images/back.png')}> */}
      <View
        style={{
          height: 80,

          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            height: 30,
            width: 30,
            borderRadius: 5,
            backgroundColor: '#ccc',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="arrowleft" size={20} color="black" />
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{marginLeft: 10}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'MontserratAlternates-SemiBold',
                color: darkmode ? 'white' : 'black',
              }}>
              Notifications
            </Text>
          </View>
        </View>
        <View style={{width: 30}} />
      </View>
      <View style={{paddingHorizontal: 15, flex: 1}}>
        <FlatList data={notification} renderItem={render} />
      </View>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
};
export default Notification;
