import React, {useState, useEffect} from 'react';

import {
  View,
  FlatList,
  TextInput,
  ScrollView,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground,
} from 'react-native';
import MyModal from '../../../Components/MyModal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Posts from '../../../Components/Posts';
import Group from '../../../Components/Group';
import MapView from 'react-native-maps';
import {viewGroup} from '../../../lib/api';
import LikeDislike from '../../../Components/LikeDislike';
import Comments from '../../../Components/Comments';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Entypo';
import {useSelector} from 'react-redux';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Hotel from '../../../Components/Hotel';
const GroupPage = ({navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const arr = [
    {},
    {name: 'Art', members: '70 members'},
    {name: 'Gaming', members: '70 members'},
    {name: 'Art', members: '70 members'},
    {name: 'Gaming', members: '70 members'},
  ];
  const {userData} = useSelector(({USER}) => USER);
  const [groups, setGroups] = useState([]);
  const render = ({item, index}) => (
    <View>
      {index == 0 ? (
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateGroup')}
          style={{
            height: 200,
            width: wp(40),
            marginTop: 20,
            marginHorizontal: 10,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#5F95F0',
          }}>
          <View
            style={{
              height: 50,
              width: 50,
              borderRadius: 40,
              alignItems: 'center',
              // marginBottom: 30,
              justifyContent: 'center',
              backgroundColor: '#005CFC',
            }}>
            <Icon name="plus" size={25} color={'white'} />
          </View>
          <Text
            style={{
              top: 30,
              color: 'white',
              fontSize: 16,
              fontFamily: 'MontserratAlternates-SemiBold',
            }}>
            Create Group
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => navigation.navigate('GroupDetails', {item})}
          style={{
            height: 200,
            marginTop: 20,
            marginHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            width: wp(40),
            backgroundColor: '#5F95F0',
          }}>
          <Image
            source={
              item.image
                ? {uri: item.image}
                : require('../../../assets/Images/girl.jpg')
            }
            style={{height: 80, width: 80, borderRadius: 40}}
          />
          <Text
            style={{
              marginTop: 20,
              color: 'white',
              fontSize: 16,
              fontFamily: 'MontserratAlternates-SemiBold',
            }}>
            {item.title}
          </Text>
          <Text
            style={{
              color: 'white',
              fontFamily: 'MontserratAlternates-Regular',
            }}>
            {item.member_count} members
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShowModal(true);
      viewGroup({Auth: userData.token})
        .then(res => {
          // console.log('res of group', res.data.data);
          setShowModal(false);
          setGroups([{}, ...res.data.data]);
        })
        .catch(err => {
          setShowModal(false);
          console.log('err', err);
        });
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  console.log('group', groups);
  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        style={{flex: 1}}
        source={require('../../../assets/Images/back.png')}>
        <View
          style={{
            height: 80,
            backgroundColor: 'white',
            elevation: 3,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon1 name="left" color="black" size={20} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 16,
                marginLeft: 20,
                fontFamily: 'MontserratAlternates-SemiBold',
                color: 'black',
              }}>
              Groups
            </Text>
          </View>
          {/* <Image
            source={require('../../../assets/Images/search.png')}
            style={{height: 20, width: 20}}
          /> */}
          {/* <Icon
            name="log-out"
            color={'#5F95F0'}
            size={20}
            onPress={() => navigation.navigate('Login')}
          /> */}
        </View>
        <View style={{flex: 1, paddingHorizontal: 15}}>
          <FlatList data={groups} numColumns={2} key={2} renderItem={render} />
        </View>
        {/* <Text>abc</Text> */}
      </ImageBackground>
      {MyModal(showModal)}
    </SafeAreaView>
  );
};
export default GroupPage;
