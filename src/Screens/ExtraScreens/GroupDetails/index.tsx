import React, {useState, useEffect, useCallback, useRef} from 'react';
import {site_key} from '../../../../config';
import {
  View,
  FlatList,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground,
} from 'react-native';
import database from '@react-native-firebase/database';
import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
import {useSelector} from 'react-redux';
import Recaptcha from 'react-native-recaptcha-that-works';
import Posts from '../../../Components/Posts';
import Group from '../../../Components/Group';
import MapView from 'react-native-maps';
// import MyModal from '../../../Components/MyModal';
import LikeDislike from '../../../Components/LikeDislike';
import Comments from '../../../Components/Comments';
import Icon2 from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {singleGroup, joingroup} from '../../../lib/api';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Entypo';
import Hotel from '../../../Components/Hotel';
const GroupDetails = ({navigation, route}) => {
  const {item} = route.params;
  const {userData} = useSelector(({USER}) => USER);
  const [groupData, setGroupData] = useState({});
  const [show, setShow] = useState(false);
  const [mile, setMile] = useState('5 Miles');
  const [specific, setSpecific] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [select, setSelect] = useState('');
  const [change, setChange] = useState(false);
  const [showData, setShowData] = useState(false);
  const [list, setList] = useState([]);
  const alter = () => {
    // console.log('alter called');
    setChange(!change);
  };

  const onMessage = event => {
    if (event && event.nativeEvent.data) {
      if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
        this.captchaForm.hide();
        return;
      } else {
        console.log('Verified code from Google', event.nativeEvent.data);
        setTimeout(() => {
          this.captchaForm.hide();
          // do what ever you want here
        }, 1500);
      }
    }
  };
  const renders = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        setShowModal(false);
        navigation.navigate('SingleChat', {
          item: item.user,
          image: specific?.media[0]?.media
            ? specific?.media[0]?.media
            : specific.description,
          items: specific,
        });
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
        </View>
      </View>
      <View style={{alignItems: 'center'}}></View>
    </TouchableOpacity>
  );
  const _usersList = useCallback(async () => {
    try {
      // setLoading(true);
      database()
        .ref('users/' + userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .orderByChild('timestamp')
        .on('value', dataSnapshot => {
          let users = [];
          dataSnapshot.forEach(child => {
            users.push(child.val());
          });
          // console.log('users', users);
          setList(users.reverse());
          // setLoading(false);

          // console.log("user list in chat list ", JSON.stringify(users))
        });
    } catch (error) {}
  }, []);
  const MyModal = (show: boolean) => {
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
              height: '60%',
              width: '90%',
              borderRadius: 10,
              backgroundColor: 'white',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 15,
                marginRight: 15,
              }}>
              <Icon3
                name="circle-with-cross"
                size={20}
                color="black"
                onPress={() => setShowModal(false)}
              />
            </View>
            <View style={{paddingHorizontal: 10}}>
              <FlatList data={list} renderItem={renders} />
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  const render = ({item, index}) => (
    <Posts
      item={item}
      onShare={() => {
        setSpecific(item);
        setShowModal(true);
      }}
      onPress={() => {
        navigation.navigate('PostDetails', {item});
      }}
      press={alter}
      navigation={navigation}
      hashPress={text => {
        console.log('text of hash tag', text);
        navigation.navigate('Hashes', {text});
      }}
    />
  );
  const recaptcha = useRef();

  const send = () => {
    console.log('send!');
    recaptcha.current.open();
  };
  // console.log('key', site_key);
  const onVerify = token => {
    console.log('success!', token);
    joingroup({Auth: userData.token, group_id: item.id, role: 'Member'}).then(
      res => {
        console.log('res', res);
        alter();
      },
    );
  };

  const onExpire = () => {
    console.warn('expired!');
  };
  const myModal3 = () => (
    <Modal animationType="slide" transparent={true} visible={show}>
      <View
        style={{
          flex: 1,
          alignItems: 'flex-end',
          // justifyContent: 'center',
          backgroundColor: '#00000088',
        }}>
        <View
          style={{
            width: '70%',
            backgroundColor: 'white',
            padding: 20,
            marginRight: 30,
            borderRadius: 10,
            marginTop: 50,
          }}>
          <TouchableOpacity
            onPress={() => setMile('5 Miles')}
            style={{
              flexDirection: 'row',
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
              paddingBottom: 10,
              alignItems: 'center',
            }}>
            <Icon
              name={
                mile == '5 Miles'
                  ? 'radio-button-checked'
                  : 'radio-button-unchecked'
              }
              size={20}
              color={mile == '5 Miles' ? '#5F95F0' : 'grey'}
            />
            <Text
              style={{
                marginLeft: 5,
                color: 'black',
                fontFamily: 'MontserratAlternates-Regular',
              }}>
              Most People
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMile('10 Miles')}
            style={{
              flexDirection: 'row',
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
              paddingBottom: 10,
              marginTop: 10,
              alignItems: 'center',
            }}>
            <Icon
              name={
                mile == '10 Miles'
                  ? 'radio-button-checked'
                  : 'radio-button-unchecked'
              }
              size={20}
              color={mile == '10 Miles' ? '#5F95F0' : 'grey'}
            />
            <Text
              style={{
                marginLeft: 5,
                color: 'black',
                fontFamily: 'MontserratAlternates-Regular',
              }}>
              Most People
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMile('15 Miles')}
            style={{
              flexDirection: 'row',
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
              paddingBottom: 10,
              marginTop: 10,
              alignItems: 'center',
            }}>
            <Icon
              name={
                mile == '15 Miles'
                  ? 'radio-button-checked'
                  : 'radio-button-unchecked'
              }
              size={20}
              color={mile == '15 Miles' ? '#5F95F0' : 'grey'}
            />
            <Text
              style={{
                marginLeft: 5,
                color: 'black',
                fontFamily: 'MontserratAlternates-Regular',
              }}>
              Most People
            </Text>
          </TouchableOpacity>

          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setMile(mile);
                setShow(false);
              }}
              style={{
                height: 40,
                width: 150,
                alignItems: 'center',
                marginTop: 20,
                borderRadius: 10,
                justifyContent: 'center',
                backgroundColor: '#5F95F0',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View
          style={{
            backgroundColor: 'white',
            height: 100,
            width: 100,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color={'#5F95F0'} />
        </View> */}
      </View>
    </Modal>
  );
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      singleGroup({Auth: userData.token, id: item.id}).then(res => {
        // console.log('res of single group', JSON.stringify(res));
        setShowData(true);
        setGroupData(res.data);
      });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    _usersList();
    singleGroup({Auth: userData.token, id: item.id}).then(res => {
      setShowData(true);
      console.log('res of single group', JSON.stringify(res));
      setGroupData(res.data);
    });
  }, [change]);
  console.log('item', item);
  console.log('item', userData);

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
            <View style={{marginLeft: 20}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'MontserratAlternates-SemiBold',
                  color: 'black',
                }}>
                Group Detail
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {item.status === 'private' && (
                  <Icon2 name="locked" size={10} color={'#5F95F0'} />
                )}
                <Text style={{fontSize: 12, color: 'black', marginLeft: 5}}>
                  {item.status == 'private' ? 'Private' : 'Public'} Group
                </Text>
              </View>
            </View>
          </View>
          {groupData.is_member && (
            <TouchableOpacity
              onPress={() => navigation.navigate('GroupPost', {item})}>
              <Image
                source={require('../../../assets/Images/add.png')}
                style={{height: 30, width: 30}}
              />
            </TouchableOpacity>
          )}

          {/* <Icon
            name="log-out"
            color={'#5F95F0'}
            size={20}
            onPress={() => navigation.navigate('Login')}
          /> */}
        </View>
        <ScrollView>
          <View style={{flex: 1}}>
            <View style={{height: 250, width: '100%'}}>
              <Image
                resizeMode="cover"
                source={
                  item.image
                    ? {uri: item.image}
                    : require('../../../assets/Images/restaurants.jpg')
                }
                style={{height: 250, width: '100%'}}
              />
              <View
                style={{
                  position: 'absolute',
                  // backgroundColor: 'red',
                  height: 250,
                  width: '100%',
                  justifyContent: 'flex-end',
                  paddingHorizontal: 15,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'MontserratAlternates-SemiBold',
                        color: 'white',
                      }}>
                      {item.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        alignItems: 'center',
                      }}>
                      {groupData?.members?.slice(0, 5).map((element, index) => (
                        <View
                          // onPress={() => console.log('index', element)}
                          style={{
                            borderRadius: 30,
                            borderColor: 'white',
                            right: index * 15,
                            borderWidth: 1,
                          }}>
                          <Image
                            source={
                              element?.user?.image
                                ? {uri: element?.user?.image}
                                : require('../../../assets/Images/girl.jpg')
                            }
                            style={{
                              height: 30,
                              // marginLeft: 10,
                              // right: 15,
                              borderRadius: 20,
                              width: 30,
                            }}
                          />
                        </View>
                      ))}
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'MontserratAlternates-Medium',
                        color: 'white',
                      }}>
                      {item.member_count} Members
                    </Text>
                  </View>
                  {/* <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'MontserratAlternates-Regular',
                      color: 'white',
                    }}>
                    13 min Ago
                  </Text> */}
                </View>
              </View>
            </View>

            {/* <FlatList data={arr} numColumns={2} key={2} renderItem={render} /> */}
            {showData && (
              <View style={{marginTop: 20, paddingHorizontal: 15}}>
                {!groupData.is_member && (
                  <TouchableOpacity
                    onPress={() => {
                      send();
                    }}
                    style={{
                      height: 50,
                      backgroundColor: '#5F95F0',
                      alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 2,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'MontserratAlternates-SemiBold',
                        color: 'white',
                      }}>
                      Join Group
                    </Text>
                  </TouchableOpacity>
                )}

                {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    marginTop: 20,
                    color: '#5F95F0',
                    fontFamily: 'MontserratAlternates-Regular',
                  }}>
                  #fun #danger #helpful #adventure #hobby
                </Text>
              </View> */}

                <Text
                  style={{
                    marginTop: 20,
                    fontFamily: 'MontserratAlternates-Regular',
                    fontSize: 14,
                    color: 'black',
                  }}>
                  {groupData?.description}
                </Text>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: 'MontserratAlternates-SemiBold',
                    color: 'black',
                    marginTop: 30,
                  }}>
                  Groups Posts
                </Text>
                {!groupData.is_member && item.status === 'private' ? null : (
                  <FlatList data={groupData?.posts} renderItem={render} />
                )}
              </View>
            )}
          </View>
        </ScrollView>

        {/* <Text>abc</Text> */}
      </ImageBackground>
      <Recaptcha
        ref={recaptcha}
        // siteKey="6Lce8jwhAAAAAN8lc8HVPDk29xhcUn_bxaG1gJoO"
        // baseUrl="https://towntalk.com"
        siteKey={'6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
        baseUrl="https://www.recaptcha.net/recaptcha/api.js"
        onVerify={onVerify}
        onExpire={onExpire}
        // size="invisible"
      />
      {/* <ConfirmGoogleCaptcha
        ref={recaptcha}
        siteKey={site_key}
        baseUrl={'127.0.0.1'}
        languageCode="en"
        onMessage={onMessage}
      /> */}
      {myModal3()}
      {MyModal(showModal)}
    </SafeAreaView>
  );
};
export default GroupDetails;
