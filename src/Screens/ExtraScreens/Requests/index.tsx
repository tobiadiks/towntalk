import React, {useState, useCallback, useEffect} from 'react';

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
import {useSelector} from 'react-redux';
import moment from 'moment';
import {blockUserList, getfcm} from '../../../lib/api';
import database from '@react-native-firebase/database';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Feather';
import MyModal from '../../../Components/MyModal';
const Requests = ({navigation}) => {
  const [list, setList] = useState([]);
  const [block, setBlock] = useState([]);
  const [searched, setSearched] = useState([]);
  const [fb, setFb] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [db, setDb] = useState(false);
  const {userData, darkmode} = useSelector(({USER}) => USER);
  const searchTextGiven = e => {
    let filteredName = [];
    // if (e) {
    filteredName = list.filter(item => {
      return (
        item?.user?.firstname?.toLowerCase().includes(`${e.toLowerCase()}`) ||
        item?.latestMessage?.toLowerCase().includes(`${e.toLowerCase()}`)
      );
      //  ||
      // item?.vender?.business_specialty
      //   ?.toLowerCase()
      //   .includes(`${e.toLowerCase()}`)
      // return item.vender.fullname.toLowerCase().includes(`${e.toLowerCase()}`);
    });
    setSearched(filteredName);
    // filteredName = [];
    // }
  };
  useEffect(() => {
    console.log('only one ready');
    if (fb && db) {
      console.log('clients ready');
      // const toRemove = [1, 2];
      // const myArray = [1, 2, 3, 5];

      // const rray = myArray.filter(function (el) {
      //   return toRemove.indexOf(el) < 0;
      // });
      console.log('fb arry', list);
      console.log('block list', block);
      var myArray = list;
      var toRemove = block;

      for (var i = myArray.length - 1; i >= 0; i--) {
        for (var j = 0; j < toRemove.length; j++) {
          if (myArray[i] && myArray[i].user.email === toRemove[j].email) {
            myArray.splice(i, 1);
          }
        }
      }
      console.log('array', myArray);
      // alert(JSON.stringify(myArray));
    } else if (fb) {
      console.log('firebase ready');
    } else if (db) {
      console.log('database ready');
    }
  }, [fb, db]);
  // console.log('list', list);
  const render = ({item}) => {
    const check = word => {
      if (word.substring(word.length - 4) == '.jpg') {
        return true;
      }
    };
    return (
      <TouchableOpacity
        onPress={() => {
          setShowModal(true);
          getfcm({id: item.user.id})
            .then(res => {
              console.log('res of fcm', res);
              navigation.navigate('SingleChat', {
                item: item.user,
                fcm_token: res.token,
              });
              setShowModal(false);
            })
            .catch(err => {
              console.log('err', err);
              setShowModal(false);
              navigation.navigate('SingleChat', {
                item: item.user,
                fcm_token: '',
              });
            });
          //
        }}
        style={{
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          alignItems: 'center',
          paddingBottom: 20,
          borderBottomColor: '#ccc',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={
              item.user.image
                ? {uri: item.user.image}
                : require('../../../assets/Images/girl.jpg')
            }
            style={{height: 50, width: 50, borderRadius: 30}}
          />
          <View style={{marginLeft: 10}}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'MontserratAlternates-SemiBold',
                color: item.unread ? 'black' : 'black',
              }}>
              {`${item.user.firstname}`}
            </Text>
            {check(item.latestMessage) == true ? (
              <Text
                style={{
                  marginTop: 5,
                  color: '#EBEBEB',
                  fontFamily: 'MontserratAlternates-Regular',
                }}>
                Image
              </Text>
            ) : (
              <Text
                style={{
                  marginTop: 5,
                  color: 'grey',
                  fontFamily: 'MontserratAlternates-Regular',
                }}>
                {item.latestMessage.slice(0, 23)}
              </Text>
            )}
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          {item.counter ? (
            <>
              <View
                style={{
                  backgroundColor: '#5F95F0',
                  height: 20,
                  width: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 30,
                  marginBottom: 5,
                }}>
                <Text style={{color: 'white', fontSize: 12}}>
                  {item.counter}
                </Text>
                {/* <Text>{moment(item.timestamp).format('DD/MM/YYYY HH:MM')}</Text> */}
              </View>
              <Text style={{color: 'grey'}}>
                {moment(item.timestamp).format('MM/DD/YYYY hh:mm a')}
              </Text>
            </>
          ) : (
            <Text style={{fontSize: 12, color: 'grey'}}>
              {moment(item.timestamp).format('MM/DD/YYYY hh:mm a')}
            </Text>
          )}
          <Text
            style={{
              color: 'grey',
              fontFamily: 'MontserratAlternates-Regular',
              fontSize: 10,
            }}>
            {item.time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const blockUser = () => {
    blockUserList({Auth: userData.token}).then(res => {
      // console.log('res', res);
      setBlock(res.data);
      setDb(!db);
      console.log('block done');
    });
  };
  const _usersList = useCallback(async () => {
    try {
      // setLoading(true);
      database()
        .ref(
          'requestusers/' +
            userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
        )
        .orderByChild('timestamp')
        .on('value', dataSnapshot => {
          let users: any[] = [];
          dataSnapshot.forEach(child => {
            users.push(child.val());
          });
          // console.log('users', users);
          blockUserList({Auth: userData.token}).then(res => {
            // console.log('res', res);
            var myArray = users;
            var toRemove = res.data;
            for (var i = myArray.length - 1; i >= 0; i--) {
              for (var j = 0; j < toRemove.length; j++) {
                if (myArray[i] && myArray[i].user.email === toRemove[j].email) {
                  myArray.splice(i, 1);
                }
              }
            }
            setList(myArray.reverse());
            setSearched(myArray.reverse());
            // setBlock(res.data);
            // setDb(!db);
            // console.log('block done');
          });

          setFb(!fb);
          // setLoading(false);
          console.log('firebase done');
          // console.log("user list in chat list ", JSON.stringify(users))
        });
    } catch (error) {}
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      _usersList();
      blockUser();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
      {/* <ImageBackground
        style={{flex: 1}}
        source={require('../../../assets/Images/back.png')}> */}
      <View
        style={{
          height: 80,
          // elevation: 3,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#ccc',
            height: 30,
            width: 30,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Icon1 name="arrowleft" size={25} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 16,
            fontFamily: 'MontserratAlternates-SemiBold',
            color: darkmode ? 'white' : 'black',
          }}>
          My Requests
        </Text>
        <View style={{width: 25}} />
        {/* <Icon1 name="diff-added" size={25} color="black" /> */}
      </View>
      <View style={{paddingHorizontal: 15}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#EBEBEB',
            height: 50,
            borderRadius: 10,
            marginBottom: 10,
            paddingHorizontal: 10,
          }}>
          <Icon name="search" size={20} color="#5F95F0" />
          <TextInput
            value={search}
            onChangeText={text => {
              setSearch(text);
              searchTextGiven(text);
            }}
            placeholder="Search"
            placeholderTextColor={'grey'}
            style={{color: 'black', flex: 1}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 14,
              color: darkmode ? 'white' : 'black',
              fontFamily: 'MontserratAlternates-SemiBold',
            }}>
            Requests
          </Text>
          {/* <Text
            style={{
              fontSize: 14,
              color: '#5F95F0',
              textDecorationLine: 'underline',
              fontFamily: 'MontserratAlternates-Regular',
            }}>
            Requests
          </Text> */}
        </View>
        <FlatList data={searched} renderItem={render} />
      </View>
      {/* </ImageBackground> */}
      {MyModal(showModal)}
    </SafeAreaView>
  );
};
export default Requests;
