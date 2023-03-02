import React, {useState, useCallback, useEffect} from 'react';
import moment from 'moment';
import {
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Text,
  Platform,
  PermissionsAndroid,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import Axios from 'axios';
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
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/AntDesign';
import {useSelector, useDispatch} from 'react-redux';
import {updateToken} from '../../../lib/api';
import {
  viewAllPost,
  deletePostApi,
  reportUser,
  blockUser,
  hashTag,
} from '../../../lib/api';
import Geolocation from 'react-native-geolocation-service';
import Posts from '../../../Components/Posts';
import {lat, long} from '../../../redux/actions';
const Hashes = ({navigation, route}) => {
  const {text, tag} = route.params;
  const arr = ['fun', 'danger', 'helpful', 'adventure', 'hobby'];
  const [latitude, setlatitude] = useState(0);
  const dispatch = useDispatch();
  const [longitude, setlongitude] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [page, setPage] = useState(1);
  const [showReportModal, setShowReportModal] = useState(false);
  const [select, setSelect] = useState('');
  const [blockuserId, setBlockuserId] = useState('');
  const [reportId, setReportId] = useState('');
  const [datas, setData] = useState([]);
  const [reportReason, setReportReason] = useState('');
  const [keyboardStatus, setKeyboardStatus] = useState('');
  const [location, setLocation] = useState('');
  const [specific, setSpecific] = useState({});
  const [testArr, setTestArr] = useState([]);
  const [hash, setHash] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const {userData, darkmode, Lat, Long} = useSelector(({USER}) => USER);
  const [change, setChange] = useState(false);
  const [list, setList] = useState([]);
  console.log('lat long in redux', Lat, Long);
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
  const cuRRentlocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setlatitude(position.coords.latitude);
        setlongitude(position.coords.longitude);
        lat(position.coords.latitude)(dispatch);
        long(position.coords.longitude)(dispatch);
        // getPlace('40.5759', '-74.4926');
        getPlace(position.coords.latitude, position.coords.longitude);
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
  const blockUserComp = id => {
    // console.log('block user id', id);
    setBlockuserId(id);
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
  useEffect(() => {
    getToken();
  }, []);
  const getToken = async () => {
    let fcmToken = await messaging().getToken();
    updateToken({Auth: userData.token, fcm_token: fcmToken});
    messaging().onTokenRefresh(token => {
      updateToken({Auth: userData.token, fcm_token: token});
    });
  };
  //   useEffect(() => {
  //     // handleAddress('solo');
  //     Platform.OS == 'ios'
  //       ? Geolocation.requestAuthorization('always').then(res => {
  //           cuRRentlocation();
  //           // console.log('res', res);
  //         })
  //       : requestLocationPermission();
  //   }, []);
  const increasePage = () => {
    viewAllPost({
      Auth: userData.token,
      page: page + 1,
      latitude: latitude ? latitude : Lat,
      longitude: longitude ? longitude : Long,
    }).then(res => {
      console.log('res of pagination', res);
      // setTestArr([...testArr, ...res.posts.data]);
      if (res.status == 'success') {
        setData([...datas, ...res.posts.data]);
        setPage(page + 1);
      }
    });
  };
  useEffect(() => {
    hashTag({Auth: userData.token, latitude, longitude}).then(res => {
      // console.log('res of hash', res);
      setHash(res.hashtags);
    });
    _usersList();
    viewAllPost({
      Auth: userData.token,
      page,
      hashtag: text ? text?.substring(1) : '',
      business_tag: tag ? tag : '',
      latitude: Lat,
      longitude: Long,
    })
      .then(res => {
        console.log('res of tag', res);
        setData(res.posts.data);
        setTestArr(res.posts.data);
      })
      .catch(err => {
        console.log('err in home', err.response.data);
      });
  }, [change]);
  // useEffect(() => {
  //   // handleAddress('solo');
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     Platform.OS == 'ios'
  //       ? Geolocation.requestAuthorization('always').then(res => {
  //           cuRRentlocation();
  //           // console.log('res', res);
  //         })
  //       : requestLocationPermission();
  //   });

  //   // Return the function to unsubscribe from the event so it gets removed on unmount
  //   return unsubscribe;
  // }, [navigation]);
  //   useEffect(() => {
  //     const unsubscribe = navigation.addListener('focus', () => {
  //       setSelect('');
  //       setPage(1);
  //       // setChange(!change);
  //       hashTag({Auth: userData.token, latitude, longitude}).then(res => {
  //         // console.log('res of hash', res);
  //         setHash(res.hashtags);
  //       });
  //       viewAllPost({
  //         Auth: userData.token,
  //         page: 1,
  //         latitude: latitude ? latitude : Lat,
  //         longitude: longitude ? longitude : Long,
  //       })
  //         .then(res => {
  //           console.log('res of new api', res);
  //           setData(res.posts.data);
  //           setTestArr(res.posts.data);
  //         })
  //         .catch(err => {
  //           console.log('err in home', err.response.data);
  //         });
  //     });

  //     // Return the function to unsubscribe from the event so it gets removed on unmount
  //     return unsubscribe;
  //   }, [navigation]);
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
      <View style={{alignItems: 'center'}}>
        {/* {item.counter ? (
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
            <Text style={{color: 'white', fontSize: 12}}>{item.counter}</Text>
            <Text>{moment(item.timestamp).format('DD/MM/YYYY HH:MM')}</Text>
          </View>
        ) : (
          <Text style={{fontSize: 12}}>
            {moment(item.timestamp).format('DD/MM/YYYY HH:MM')}
          </Text>
        )} */}
        {/* <Text
          style={{
            color: 'black',
            fontFamily: 'MontserratAlternates-Regular',
            fontSize: 10,
          }}>
          {item.time}
        </Text> */}
      </View>
    </TouchableOpacity>
  );
  const MyModal = (show: boolean) => {
    // console.log('show', latitude, longitude);
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
              <Icon
                name="circle-with-cross"
                size={20}
                color="black"
                onPress={() => setShowModal(false)}
              />
            </View>
            <View style={{paddingHorizontal: 10}}>
              <FlatList data={list} renderItem={render} />
            </View>
          </View>
        </View>
      </Modal>
    );
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
  // console.log('page', page);
  const deletePost = id => {
    setReportId(id);
    setDeleteModal(true);
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
      press={alter}
      deletePost={deletePost}
      navigation={navigation}
      tagPress={text => {
        navigation.navigate('Hashes', {tag: item.business_tag});
        console.log('tag press');
      }}
      // focusMedia={text => {
      //   focusModalOpener(text);
      // }}
      // handleReport={handleReport}
      blockuser={blockUserComp}
      hashPress={text => {
        console.log('text of hash tag', text);
        navigation.navigate('Hashes', {text});
        // viewAllPost({
        //   Auth: userData.token,
        //   hashtag: text.substring(1),
        //   page,
        //   latitude: latitude ? latitude : Lat,
        //   longitude: longitude ? longitude : Long,
        // })
        //   .then(res => {
        //     console.log('res of api after hash tag press', res);
        //     setData(res.posts.data);
        //     setTestArr(res.posts.data);
        //   })
        //   .catch(err => {
        //     // console.log('err in home', err.response.data);
        //   });
      }}
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
        console.log('data', data.results[0].address_components);
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
        // console.log('place', JSON.stringify(data.results[0].name));
        // return status === 200 || status === 201 ? data : null;
      })
      .catch(e => {});
  };
  console.log('location');
  // const lat = 33.5344737;
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
          backgroundColor: darkmode ? 'black' : 'white',
          elevation: 3,
          flexDirection: 'row',
          alignItems: 'center',

          paddingHorizontal: 15,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 30,
              width: 30,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ccc',
              borderRadius: 5,
            }}>
            <Icon1 name="arrowleft" color="black" size={20} />
          </View>

          <Text
            style={{
              fontSize: 16,
              fontFamily: 'MontserratAlternates-SemiBold',
              color: darkmode ? 'white' : 'black',
              marginLeft: 10,
            }}>
            {text ? text?.substring(1) : tag}
          </Text>
          {/* <Text
              style={{
                fontSize: 16,
                fontFamily: 'MontserratAlternates-SemiBold',
                color: '#5F95F0',
              }}>
              {location}
             
            </Text> */}
          {/* <Text style={{fontFamily: 'MontserratAlternates-Regular'}}>
              {location}
            </Text> */}
        </TouchableOpacity>
        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Image
                source={require('../../../assets/Images/search.png')}
                style={{height: 15, width: 15}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('GroupPage')}>
              <Image
                source={require('../../../assets/Images/9055212_bxs_category_icon.png')}
                style={{height: 15, marginLeft: 10, width: 15}}
              />
            </TouchableOpacity>
          </View> */}
      </View>
      {/* <FlatList horizontal data={arr} renderItem={renderItem} /> */}
      {/* <ScrollView> */}
      <View style={{marginTop: 10, paddingHorizontal: 12}}>
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
        <ScrollView>
          <View
            style={{
              marginTop: 10,
              // flex: 1,
              width: '100%',
              paddingBottom: 0,
              height: hp(Platform.OS == 'ios' ? 75 : 80),
            }}>
            <FlatList
              data={datas}
              // onEndReachedThreshold={0.5}
              // onEndReached={increasePage}
              renderItem={renderItem1}
            />
          </View>
        </ScrollView>
      </View>
      {/* </ImageBackground> */}

      {/* </ScrollView> */}

      {/* <Text>Home</Text> */}
      {MyModal(showModal)}
      {ReportModal()}
      {DeleteModal()}
    </SafeAreaView>
  );
};
export default Hashes;
