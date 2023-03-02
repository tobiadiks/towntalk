import React, {useState, useCallback, useEffect} from 'react';
import moment from 'moment';
import {
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Share,
  Modal,
  Keyboard,
  TextInput,
  Text,
  Platform,
  KeyboardAvoidingView,
  Alert,
  PermissionsAndroid,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import Axios from 'axios';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import VideoCompModal from '../../../Components/VideoCompModal';
import PushNotification from 'react-native-push-notification';
// import GooglePlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from 'react-google-places-autocomplete';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Feather';
import CrossIcon from 'react-native-vector-icons/Entypo';
import {useSelector, useDispatch} from 'react-redux';
import {updateToken} from '../../../lib/api';
import {
  viewAllPost,
  blockUser,
  reportUser,
  deletePostApi,
  hashTag,
  getCountiesList,
  updateLocation,
} from '../../../lib/api';
// import {logoutuser} from '../../../redux/actions';
import Geolocation from 'react-native-geolocation-service';
import Posts from '../../../Components/Posts';
import {lat, long, logoutuser} from '../../../redux/actions';
const Home = ({navigation}) => {
  const arr = ['fun', 'danger', 'helpful', 'adventure', 'hobby'];
  const [latitude, setlatitude] = useState(0);
  const dispatch = useDispatch();
  const [longitude, setlongitude] = useState(0);
  const [page, setPage] = useState(1);
  const [select, setSelect] = useState('');
  const [datas, setData] = useState([]);
  const [location, setLocation] = useState('');
  const [specific, setSpecific] = useState({});
  const [keyboardStatus, setKeyboardStatus] = useState('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [testArr, setTestArr] = useState([]);
  const [hash, setHash] = useState([]);
  const [focusMedia, setFocusMedia] = useState(false);
  const [media, setMedia] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showfilter, setShowFilter] = useState(false);
  const [reportId, setReportId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [blockuserId, setBlockuserId] = useState('');
  const [filter, setFilter] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const {userData, darkmode, Lat, Long} = useSelector(({USER}) => USER);
  const [change, setChange] = useState(false);
  const [list, setList] = useState([]);
  const [countyList, setCountyList] = useState([]);
  const [searchedCounty, setSearchedCounty] = useState([]);
  const [searchCounty, setSearchCounty] = useState('');
  const [countyModal, setCountyModal] = useState(false);
  // console.log('lat long in redux', countyList);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('Keyboard Shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('Keyboard Hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const onShare = async () => {
    try {
      const link = await dynamicLinks().buildLink({
        link:
          Platform.OS == 'ios'
            ? `https://towntalkapp.page.link/${specific.id}`
            : `https://towntalkapp.page.link/iGuj`,

        // domainUriPrefix is created in your Firebase console
        domainUriPrefix: 'https://towntalkapp.page.link',
        // optional setup which updates Firebase analytics campaign
        // "banner". This also needs setting up before hand
        analytics: {
          campaign: 'banner',
        },
      });
      console.log('::::----', link);

      const result = await Share.share({
        message: `TownTalk: Post link ${link}`,
      });
      // setShowModal(false);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  const searchTextGiven = e => {
    let filteredName = [];
    // if (e) {
    filteredName = countyList.filter(item => {
      return (
        item?.county?.toLowerCase().includes(`${e.toLowerCase()}`) ||
        item?.county_fips?.toLowerCase().includes(`${e.toLowerCase()}`)
      );
      // return item.vender.fullname.toLowerCase().includes(`${e.toLowerCase()}`);
    });
    setSearchedCounty(filteredName);
    // filteredName = [];
    // }
  };
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
  const alter = () => {
    // console.log('alter called');
    setChange(!change);
  };
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        cuRRentlocation();
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const locationChanger = (lats: string, lngs: string) => {
    updateLocation({Auth: userData.token, latitude: lats, longitude: lngs})
      .then(res => {
        console.log('res of update loacation', res);
        setlatitude(lats);
        setlongitude(lngs);
        lat(lats)(dispatch);
        long(lngs)(dispatch);
        // getPlace('40.6727', '-74.2152');
        getPlace(lats, lngs);
      })
      .catch(err => {
        console.log('error in update location', err);
      });
  };
  const cuRRentlocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        updateLocation({
          Auth: userData.token,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }).then(res => {
          setlatitude(position.coords.latitude);
          setlongitude(position.coords.longitude);
          lat(position.coords.latitude)(dispatch);
          long(position.coords.longitude)(dispatch);
          // getPlace('40.6727', '-74.2152');
          getPlace(position.coords.latitude, position.coords.longitude);
        });

        // viewAllPost({
        //   Auth: userData.token,
        //   page,
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,
        // })
        //   .then(res => {
        //     // console.log('res', res);
        //     setData(res.posts.data);
        //   })
        //   .catch(err => {
        //     console.log('err in home', err.response.data);
        //   });
        // getPlace('47.751076', '-120.740135');
        // console.log('users location', position.coords.longitude);

        // console.log('users location', position.coords.latitude);
        setChange(!change);
      },
      error => {
        console.log('error in loc', error);
      },
      {
        enableHighAccuracy: true,
        // timeout: 15000,
        // maximumAge: 10000
      },
    );
  };
  useEffect(() => {
    getToken();
    darkmode
      ? StatusBar.setBarStyle('light-content', true)
      : StatusBar.setBarStyle('dark-content', true);
    // PushNotification.cancelAllLocalNotifications();
  }, []);
  const getToken = async () => {
    let fcmToken = await messaging().getToken();
    updateToken({Auth: userData.token, fcm_token: fcmToken})
      .then(res => {
        if (res.status == 'success') {
          console.log('updated');
        }
      })
      .catch(err => {
        logoutuser(false)(dispatch);
      });
    messaging().onTokenRefresh(token => {
      updateToken({Auth: userData.token, fcm_token: token})
        .then(res => {
          if (res.status == 'success') {
            console.log('updated');
          }
        })
        .catch(err => {
          logoutuser(false)(dispatch);
        });
    });
  };
  useEffect(() => {
    // handleAddress('solo');
    // PushNotification.cancelAllLocalNotifications();
    Platform.OS == 'ios'
      ? Geolocation.requestAuthorization('always').then(res => {
          cuRRentlocation();
          // console.log('res', res);
        })
      : requestLocationPermission();
  }, []);
  const increasePage = () => {
    setRefreshing(true);
    viewAllPost({
      Auth: userData.token,
      page: page + 1,
      latitude: latitude ? latitude : Lat,
      longitude: longitude ? longitude : Long,
      filter_post: filter,
    })
      .then(res => {
        // console.log('res of pagination', res);
        setRefreshing(false);
        // setTestArr([...testArr, ...res.posts.data]);
        if (res.status == 'success') {
          setData([...datas, ...res.posts.data]);
          setPage(page + 1);
        }
      })
      .catch(err => {
        setRefreshing(false);
      });
  };
  useEffect(() => {
    // PushNotification.cancelAllLocalNotifications();
    hashTag({Auth: userData.token, latitude, longitude}).then(res => {
      // console.log('res of hash', res);
      setHash(res.hashtags);
    });
    _usersList();
    viewAllPost({
      Auth: userData.token,
      page: 1,
      latitude: latitude ? latitude : Lat,
      longitude: longitude ? longitude : Long,
      filter_post: filter,
    })
      .then(res => {
        console.log('res of changing on my own');
        setData(res.posts.data);
        setTestArr(res.posts.data);
      })
      .catch(err => {
        console.log('err in home', err.response.data);
      });
  }, [lat, change]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelect('');
      setPage(1);
      // PushNotification.cancelAllLocalNotifications();
      // setChange(!change);
      hashTag({Auth: userData.token, latitude, longitude}).then(res => {
        // console.log('res of hash', res);
        setHash(res.hashtags);
      });
      viewAllPost({
        Auth: userData.token,
        page: 1,
        latitude: latitude ? latitude : Lat,
        longitude: longitude ? longitude : Long,
        filter_post: filter,
      })
        .then(res => {
          // console.log('res of new api', res);
          setData(res.posts.data);
          setTestArr(res.posts.data);
        })
        .catch(err => {
          console.log('err in home', err.response.data);
        });
      getCountiesList({Auth: userData.token})
        .then(res => {
          console.log('res of counties', res);
          setCountyList(res.data);
          setSearchedCounty(res.data);
        })
        .catch(err => {
          console.log('err in counties', err);
        });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  const render = ({item}) => (
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
        paddingTop: 5,
        borderRadius: 5,
        paddingHorizontal: 5,
        alignItems: 'center',
        backgroundColor: darkmode ? '#242527' : 'white',
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
              color: darkmode ? 'white' : 'black',
            }}>
            {`${item.user.firstname}`}
          </Text>
          {/* <Text
            style={{
              marginTop: 5,
              color: 'black',
              fontFamily: 'MontserratAlternates-Regular',
            }}>
            {/* {item.latestMessage} 
          </Text> */}
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 30,
          width: 30,
          borderRadius: 20,
          backgroundColor: '#5F95F0',
        }}>
        <Icon3 name="send" color="white" size={18} />
      </View>
    </TouchableOpacity>
  );
  const renderCounty = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        setCountyModal(false);
        locationChanger(item.lat, item.lng);
        // navigation.navigate('SingleChat', {
        //   item: item.user,
        //   image: specific.media[0].media,
        //   items: specific,
        // });
      }}
      style={{
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingTop: 5,
        borderRadius: 5,
        paddingHorizontal: 5,
        alignItems: 'center',
        backgroundColor: darkmode ? '#242527' : 'white',
        paddingBottom: 20,
        borderBottomColor: '#ccc',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{marginLeft: 10}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'MontserratAlternates-SemiBold',
              color: darkmode ? 'white' : 'black',
            }}>
            {`${item.county}`}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'MontserratAlternates-SemiBold',
              color: 'grey',
            }}>
            {`${item.county_fips}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  const MyModal = (show: boolean) => {
    // console.log('show', latitude, longitude);
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={show}
        onRequestClose={() => setShowModal(!showModal)}>
        <TouchableOpacity
          onPress={() => setShowModal(!showModal)}
          style={{
            flex: 1,
            // height: hp(100),
            backgroundColor: '#00000088',
            alignItems: 'center',
            justifyContent: 'flex-end',
            zIndex: 200,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            // position: 'absolute',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => console.log('hello')}
            style={{
              // height: '45%',
              maxHeight: '50%',
              minHeight: '20%',
              width: '100%',
              borderRadius: 10,
              backgroundColor: darkmode ? 'black' : 'white',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 15,
                marginRight: 15,
              }}>
              {/* <Icon
                name="circle-with-cross"
                size={20}
                color="black"
                onPress={() => setShowModal(false)}
              /> */}
            </View>
            <TouchableOpacity
              onPress={() => onShare()}
              style={{
                width: '90%',
                height: 50,
                alignSelf: 'center',
                backgroundColor: '#5F95F0',
                marginTop: 15,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                Share
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: 10,
                marginTop: 10,
                fontSize: 16,
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Share with contacts
            </Text>
            <View style={{paddingHorizontal: 10, marginBottom: 20}}>
              <FlatList data={list} renderItem={render} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };
  const CountiesModal = (show: boolean) => {
    // console.log('show', latitude, longitude);
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={show}
        onRequestClose={() => setCountyModal(!countyModal)}>
        <TouchableOpacity
          onPress={() => setCountyModal(!countyModal)}
          style={{
            flex: 1,
            // height: hp(100),
            backgroundColor: '#00000088',
            alignItems: 'center',
            justifyContent:
              keyboardStatus == 'Keyboard Shown' && Platform.OS == 'ios'
                ? 'flex-start'
                : 'flex-end',
            zIndex: 200,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            // position: 'absolute',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => console.log('hello')}
            style={{
              // height: '45%',
              maxHeight: '90%',
              minHeight: '20%',
              width: '100%',
              borderRadius: 10,
              backgroundColor: darkmode ? 'black' : 'white',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 15,
                marginRight: 15,
              }}>
              {/* <Icon
                name="circle-with-cross"
                size={20}
                color="black"
                onPress={() => setShowModal(false)}
              /> */}
            </View>

            <Text
              style={{
                marginLeft: 10,
                fontSize: 16,
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Select location
            </Text>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 14,
                color: 'grey',
                marginTop: 10,
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Select neighbourhood which you want to checkout
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                marginHorizontal: 10,
                marginTop: 10,
                borderRadius: 10,
                backgroundColor: '#ccc',
                height: 50,
              }}>
              <Icon3 name="search" color={'#5F95F0'} size={25} />
              <TextInput
                value={searchCounty}
                onChangeText={text => {
                  searchTextGiven(text);
                  setSearchCounty(text);
                }}
                placeholder={'Search by name or zipcode'}
                placeholderTextColor="grey"
                style={{flex: 1}}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setCountyModal(false);
                cuRRentlocation();
                // navigation.navigate('SingleChat', {
                //   item: item.user,
                //   image: specific.media[0].media,
                //   items: specific,
                // });
              }}
              style={{
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                paddingTop: 5,
                borderRadius: 5,
                paddingHorizontal: 5,
                alignItems: 'center',
                backgroundColor: darkmode ? '#242527' : 'white',
                paddingBottom: 20,
                borderBottomColor: '#ccc',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    marginLeft: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Icon1 name="location" size={20} color={'#5F95F0'} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'MontserratAlternates-SemiBold',
                      color: darkmode ? 'white' : 'black',
                    }}>
                    Use Current Location
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={{paddingHorizontal: 10, marginBottom: 20}}>
              <FlatList data={searchedCounty} renderItem={renderCounty} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };
  // console.log('page', page);
  const handleReport = id => {
    setReportId(id);
    setShowReportModal(true);
  };
  const blockUserComp = id => {
    // console.log('block user id', id);
    setBlockuserId(id);
  };
  const deletePost = id => {
    setReportId(id);
    setDeleteModal(true);
  };
  const ReportModal = () => {
    const Wrapper = Platform.OS == 'ios' ? KeyboardAvoidingView : View;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showReportModal}
        onRequestClose={() => setShowReportModal(false)}>
        <TouchableOpacity
          onPress={() => setShowReportModal(false)}
          style={{
            flex: 1,
            // height: hp(100),
            backgroundColor: '#00000088',
            alignItems: 'center',
            justifyContent:
              keyboardStatus == 'Keyboard Shown' && Platform.OS == 'ios'
                ? 'center'
                : 'flex-end',
            zIndex: 200,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            // position: 'absolute',
          }}>
          {/* <ScrollView> */}
          <Wrapper
            // behavior="padding"
            behavior="padding"
            style={{
              height: '50%',
              width: '100%',
              backgroundColor: 'white',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              padding: 20,
            }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => console.log('hello')}>
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-SemiBold',
                  fontSize: 16,
                  color: 'black',
                }}>
                Report this post
              </Text>
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-Regular',
                  fontSize: 14,
                  color: 'grey',
                  marginTop: 10,
                }}>
                If someone is in immediate danger, get help before reporting to
                Towntalk. Don't wait.
              </Text>
              <TextInput
                value={reportReason}
                onChangeText={text => setReportReason(text)}
                style={{
                  backgroundColor: '#ccc',
                  height: 100,
                  borderRadius: 10,
                  color: 'black',
                  padding: 10,
                  marginTop: 15,
                }}
                placeholder="Why do you want to report this post?"
                placeholderTextColor="grey"
                numberOfLines={4}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity
                onPress={() => {
                  reportUser({
                    Auth: userData.token,
                    message: reportReason,
                    post_id: reportId,
                  })
                    .then(res => {
                      console.log('res of report', res);
                    })
                    .catch(err => {
                      console.log('err in report', err);
                    });
                  setShowReportModal(false);
                }}
                style={{
                  width: '100%',
                  height: 50,
                  backgroundColor: '#5F95F0',
                  marginTop: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'MontserratAlternates-SemiBold',
                  }}>
                  Report
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  reportUser({
                    Auth: userData.token,
                    message: reportReason,
                    post_id: reportId,
                  })
                    .then(res => {
                      console.log('res of report', res);
                    })
                    .catch(err => {
                      console.log('err in report', err);
                    });
                  blockUser({
                    Auth: userData.token,
                    block_user_id: blockuserId,
                  })
                    .then(res => {
                      console.log('res of block', res);
                      setChange(!change);
                    })
                    .catch(err => {
                      console.log('err in block', err);
                    });
                  setShowReportModal(false);
                }}
                style={{
                  width: '100%',
                  height: 50,
                  backgroundColor: '#200E32',
                  marginTop: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'MontserratAlternates-SemiBold',
                  }}>
                  Report & block user
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Wrapper>
          {/* </ScrollView> */}
        </TouchableOpacity>
      </Modal>
    );
  };
  const DeleteModal = () => {
    const Wrapper = Platform.OS == 'ios' ? KeyboardAvoidingView : View;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModal}
        onRequestClose={() => setDeleteModal(false)}>
        <TouchableOpacity
          onPress={() => setDeleteModal(false)}
          style={{
            flex: 1,
            // height: hp(100),
            backgroundColor: '#00000088',
            alignItems: 'center',
            justifyContent: 'flex-end',
            zIndex: 200,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            // position: 'absolute',
          }}>
          <Wrapper
            behavior="padding"
            style={{
              height: '50%',
              width: '100%',
              backgroundColor: 'white',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              padding: 20,
            }}>
            <Text
              style={{
                fontFamily: 'MontserratAlternates-SemiBold',
                fontSize: 16,
                color: 'black',
              }}>
              Delete this post
            </Text>
            <View style={{alignItems: 'center', marginVertical: 15}}>
              <Icon name="trash-bin-sharp" size={50} color="red" />
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                Are you sure?
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'MontserratAlternates-Regular',
                fontSize: 14,
                color: 'grey',
                marginTop: 0,
              }}>
              Once deleted, you will not be able to recover this Post!
            </Text>
            <TouchableOpacity
              onPress={() => {
                deletePostApi({
                  Auth: userData.token,
                  post_id: reportId,
                })
                  .then(res => {
                    console.log('res of delete', res);
                    setChange(!change);
                  })
                  .catch(err => {
                    console.log('err in delete', err);
                  });
                setDeleteModal(false);
              }}
              style={{
                width: '100%',
                height: 50,
                backgroundColor: 'red',
                marginTop: 15,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                Delete Post
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDeleteModal(false);
              }}
              style={{
                width: '100%',
                height: 50,
                backgroundColor: '#200E32',
                marginTop: 15,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </Wrapper>
        </TouchableOpacity>
      </Modal>
    );
  };
  const focusModalOpener = media => {
    setFocusMedia(!focusMedia);
    setMedia(media);
  };
  const renderItem1 = ({item}) => (
    <Posts
      item={item}
      onShare={() => {
        setSpecific(item);
        setShowModal(true);
      }}
      onPress={() => {
        navigation.navigate('PostDetails', {item});
      }}
      deletePost={deletePost}
      press={alter}
      navigation={navigation}
      tagPress={text => {
        navigation.navigate('Hashes', {tag: item.business_tag});
        console.log('tag press');
      }}
      focusMedia={text => {
        focusModalOpener(text);
      }}
      hashPress={text => {
        console.log('text of hash tag', text);
        navigation.navigate('Hashes', {text});
      }}
      handleReport={handleReport}
      blockuser={blockUserComp}
    />
  );
  const getPlace = (latitude, longitude) => {
    // console.log('inside get place fuction');
    // console.log('lat long', latitude, longitude);
    let radius = 100;
    // let myapikey = 'AIzaSyB_H2_55fkLI8-EyfYLUlJI4obywUd-KnE';
    // let mapKey = 'AIzaSyBC2R0hGR9kjgysDNUsOWHWF_oU0jc6DIg';
    let mapKey = 'AIzaSyCmhmQiZWqaMzKclPUY-mEshxF7Lj4T4NI';
    // let request = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${myapikey}`;
    let request = `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${mapKey}`;
    // let request = `https://maps.googleapis.com/maps/api/geocode/json?address=${lot},${logo}&key=${mapKey}`;
    return Axios.get(request)
      .then(({data, status}) => {
        // console.log('data', data.results[0].address_components);
        // setLocation("Rawalpindi")
        // console.log('whole responce', JSON.stringify(data));
        // const currentCity = data.results[0].address_components.filter(
        //   x =>
        //     x.types.filter(
        //       t =>
        //         t == 'administrative_area_level_2' ||
        //         'administrative_area_level_1',
        //     ).length > 0,
        // )[2].long_name;
        const currentCity = data.results[0].address_components.filter(
          x =>
            x.types.filter(
              t =>
                t == 'administrative_area_level_1' ||
                t == 'administrative_area_level_2',
            ).length > 0,
        )[0].long_name;
        // console.log('city current city', currentCity);

        setLocation(currentCity);
        setChange(!change);
        // console.log('place', JSON.stringify(data.results[0].name));
        // return status === 200 || status === 201 ? data : null;
      })
      .catch(e => {});
  };
  // console.log('location', datas[0]);
  // const lat = 33.5344737;
  const onRefresh = () => {
    setRefreshing(true);
    viewAllPost({
      Auth: userData.token,
      page: 1,
      latitude: latitude ? latitude : Lat,
      longitude: longitude ? longitude : Long,
      filter_post: filter,
    })
      .then(res => {
        // console.log('res of new api', res);
        setData(res.posts.data);
        setTestArr(res.posts.data);
        setRefreshing(false);
      })
      .catch(err => {
        setRefreshing(false);
        console.log('err in home', err.response.data);
      });
    // setLoadAble(true);
    // setLoading(true);
    // getHomeData_API(1)
    //   .then((res) => {
    //     if (res) {
    //       const { homebanner, status, newsfeedlist } = res;
    //       if (status === "success") {
    //         Array.isArray(homebanner) && setHeading(homebanner[0]);
    //         Array.isArray(newsfeedlist) && setList(newsfeedlist);
    //       }
    //     }
    //   })
    // .catch((e) => {})
    // .finally(() => {
    //   setPage(2);
    // setRefreshing(false);
    // setLoading(false);
    // });
  };
  const mediaModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={focusMedia}
        onRequestClose={() => {
          setFocusMedia(false);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '90%',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() => setFocusMedia(false)}
              style={{
                height: 30,
                width: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <CrossIcon color={'white'} size={25} name="squared-cross" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: '85%',
              width: '100%',
              // backgroundColor: 'red',
              alignItems: 'center',
              justifyContent: 'center',
              // backgroundColor: 'red',
              // borderRadius: 25,
            }}>
            {media.substring(media.length - 4) == '.jpg' ? (
              <Image
                source={{uri: media}}
                style={{height: '100%', width: '100%'}}
                resizeMode="contain"
              />
            ) : (
              <VideoCompModal source={media} />
            )}

            {/* <ActivityIndicator size="small" color="black" /> */}
          </View>
        </View>
      </Modal>
    );
  };
  // const long = 73.0525821;
  // console.log('test arr length', testArr.length);
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
      {/* <ImageBackground
        style={{flex: 1}}
        source={require('../../../assets/Images/back.png')}> */}
      <View
        style={{
          height: 80,
          backgroundColor:'#5F95F0',
          // backgroundColor: darkmode ? '#242527' : 'white',
          // elevation: 3,
          flexDirection: 'row',
          alignItems: 'center',

          paddingHorizontal: 15,
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', }}>
          <Image
            style={{height: 50, width: 50, borderRadius: 30}}
            source={
              userData?.userdata?.image
                ? {uri: userData?.userdata?.image}
                : require('../../../assets/Images/girl.jpg')
            }
          />
          <View style={{marginLeft: 10}}>
            <Text style={{fontSize: 12, color: 'white'}}>
              Hello {userData?.userdata?.firstname}!
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon1 name="location" size={20} color={'white'} />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'MontserratAlternates-SemiBold',
                  color: '#5F95F0',
                }}>
                {location}
                {/* {`${userData?.userdata?.firstname}`} */}
              </Text>
              <TouchableOpacity
                onPress={() => setCountyModal(!countyModal)}
                style={{
                  height: 20,
                  width: 20,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  alignItems: 'center',
                  marginLeft: 5,
                  justifyContent: 'center',
                }}>
                <Icon1 name="pencil" size={15} color="#5F95F0" />
              </TouchableOpacity>
            </View>
          </View>

          {/* <Text style={{fontFamily: 'MontserratAlternates-Regular'}}>
              {location}
            </Text> */}
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              width: 25,
              height: 25,
              borderWidth: 0,
              backgroundColor: 'transparent',
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: '#ccc',
            }}
            onPress={() => navigation.navigate('Search')}>
            <Icon2 name="search1" size={18} color="white" />
            {/* <Image
              source={require('../../../assets/Images/search.png')}
              style={{height: 15, width: 15}}
            /> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 25,
              height: 25,
              borderWidth: 0,
              backgroundColor: 'transparent',
              borderRadius: 5,
              alignItems: 'center',
              marginLeft: 5,
              justifyContent: 'center',
              borderColor: '#ccc',
            }}
            onPress={() => navigation.navigate('Notification')}>
            {/* <Image
              resizeMode="contain"
              source={require('../../../assets/Images/BellIcon.png')}
              style={{
                height: 15,
                // marginLeft: 10,
                width: 15,
                // borderWidth: 1,
                // borderColor: 'grey',
                // borderRadius: 5,
              }}
            /> */}
             <Icon name="md-notifications-outline" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {/* <FlatList horizontal data={arr} renderItem={renderItem} /> */}
      {/* <ScrollView> */}
      <View
        style={{
          // marginTop: 10,
          backgroundColor: darkmode ? 'black' : 'white',
          paddingHorizontal: 12,
          paddingVertical: 12,
          flex: 1,
        }}>
        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {arr.map(item => (
            <View
              style={{
                height: 30,
                backgroundColor: 'white',
                marginRight: 10,
                elevation: 3,
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 100,
                borderRadius: 5,
              }}>
              <Text style={{color: '#5F95F0', fontWeight: 'bold'}}>
                #{item}
              </Text>
            </View>
          ))}
        </View> */}
        {/* <FlatList horizontal data={hash} renderItem={renderItem} /> */}
        {/* <ScrollView> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 134,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'MontserratAlternates-SemiBold',
              color: darkmode ? 'white' : 'black',
            }}>
            {filter == 'all'
              ? 'All'
              : filter == 'recent'
              ? 'Recent posts'
              : filter == 'likes'
              ? 'Most Likes'
              : 'Most Comments'}
          </Text>
          <TouchableOpacity
            onPress={() => setShowFilter(!showfilter)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../../assets/Images/filters.png')}
              style={{height: 20, width: 20}}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'MontserratAlternates-Regular',
                color: darkmode ? 'white' : 'black',
                marginLeft: 3,
              }}>
              Filters
            </Text>
            {showfilter && (
              <View
                style={{
                  height: 200,
                  width: 150,
                  right: 0,
                  top: 20,
                  zIndex: 250,
                  position: 'absolute',
                  // backgroundColor: '#ccc',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setFilter('all');
                    setShowFilter(!showfilter);
                    setTimeout(function () {
                      setChange(!change);
                    }, 1000);
                  }}
                  style={{
                    height: 40,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,

                    justifyContent: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: 'grey',

                    paddingLeft: 10,
                    backgroundColor: '#ccc',
                    // elevation: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'black',
                      fontFamily: 'MontserratAlternates-Medium',
                    }}>
                    All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setFilter('recent');
                    setShowFilter(!showfilter);
                    setTimeout(function () {
                      setChange(!change);
                    }, 1000);
                  }}
                  style={{
                    height: 40,

                    justifyContent: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: 'grey',

                    paddingLeft: 10,
                    backgroundColor: '#ccc',
                    // elevation: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'black',
                      fontFamily: 'MontserratAlternates-Medium',
                    }}>
                    Most Recent
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setFilter('likes');
                    setShowFilter(!showfilter);
                    setTimeout(function () {
                      setChange(!change);
                    }, 1000);
                  }}
                  style={{
                    height: 40,

                    justifyContent: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: 'grey',

                    paddingLeft: 10,
                    backgroundColor: '#ccc',
                    // elevation: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'black',
                      fontFamily: 'MontserratAlternates-Medium',
                    }}>
                    Most Likes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setFilter('comments');
                    setShowFilter(!showfilter);
                    setTimeout(function () {
                      setChange(!change);
                    }, 1000);
                  }}
                  style={{
                    height: 40,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,

                    justifyContent: 'center',
                    // borderBottomWidth: 1,
                    borderBottomColor: 'grey',

                    paddingLeft: 10,
                    backgroundColor: '#ccc',
                    // elevation: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'black',
                      fontFamily: 'MontserratAlternates-Medium',
                    }}>
                    Most Comments
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 10,
            // flex: 1,
            width: '100%',
            paddingBottom: 0,
            height: hp(Platform.OS == 'ios' ? 73 : 78.5),
          }}>
          <FlatList
            data={datas}
            // onEndReachedThreshold={0.5}
            onRefresh={onRefresh}
            keyExtractor={item => item.id + 'a'}
            refreshing={refreshing}
            onEndReached={increasePage}
            renderItem={renderItem1}
          />
        </View>
        {/* </ScrollView> */}
      </View>
      {/* </ImageBackground> */}

      {/* </ScrollView> */}

      {/* <Text>Home</Text> */}
      {MyModal(showModal)}
      {ReportModal()}
      {DeleteModal()}
      {CountiesModal(countyModal)}
      {mediaModal()}
    </SafeAreaView>
  );
};
export default Home;
