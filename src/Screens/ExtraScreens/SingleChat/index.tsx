import React, {useState, useRef, useEffect} from 'react';

import {
  View,
  FlatList,
  TextInput,
  ScrollView,
  SafeAreaView,
  PermissionsAndroid,
  TouchableOpacity,
  Image,
  Modal,
  Text,
  Linking,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import Message from '../../../Components/Message';

// import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Axios from 'axios';
import moment from 'moment';
import {getfcm,audioConvert} from '../../../lib/api';
import {mapKey, config} from '../../../../config';
import MapView, {Marker} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {firebase_key} from '../../../../config';
// import {AudioRecorder, AudioUtils} from 'react-native-audio';
import {
  recieverMsg,
  senderLocation,
  recieverLocation,
  senderMsg,
  senderVoice,
  recieverVoice,
} from '../../../lib/messageUtils';
import {useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import Icon1 from 'react-native-vector-icons/AntDesign';
import AudioComp from '../../../Components/AudioComp';
import VideoComp from '../../../Components/VideoComp';
const audioRecorderPlayer = new AudioRecorderPlayer();
const SingleChat = ({navigation, route}: {navigation: any; route: any}) => {
  const {item, fcm_token} = route.params;
  const image = route?.params?.image;
  const items = route?.params?.items;
  const [keyboardStatus, setKeyboardStatus] = useState('');
  const [message, setMessage] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [fcm, setFcm] = useState(fcm_token);
  const [messages, setMessages] = useState([]);
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [location, setLocation] = useState('');
  const [latitude, setlatitude] = useState(0);
  const [longitude, setlongitude] = useState(0);
  const [recordingState, setRecordingState] = useState('');
  const [timer, setTimer] = useState(0);
  const timerInterval = useRef(null);
  // const audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
  const mapRef = useRef(null);
  // const audioRecorderPlayer = new AudioRecorderPlayer();
  const {userData, darkmode} = useSelector(({USER}) => USER);
  const Wrapper = Platform.OS == 'android' ? View : KeyboardAvoidingView;

  const onStartRecord = async () => {
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener(e => {
      // console.log('audio object', e);
      // this.setState({
      //   recordSecs: e.currentPosition,
      //   recordTime: this.audioRecorderPlayer.mmssss(
      //     Math.floor(e.currentPosition),
      //   ),
      // });
      return;
    });
    console.log('audio object result', result);
  };
  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    // this.setState({
    //   recordSecs: 0,
    // });
    console.log('audio path on audio record stop', result);
    goForFetch(result)
  };

  // const onStartRecord = async () => {
  //   const result = await audioRecorderPlayer.startRecorder();
  //   audioRecorderPlayer.addRecordBackListener(e => {
  //     setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
  //     setRecordSecs(e.currentPosition);
  //     // this.setState({
  //     //   recordSecs: e.currentPosition,
  //     //   recordTime: this.audioRecorderPlayer.mmssss(
  //     //     Math.floor(e.currentPosition),
  //     //   ),
  //     // });
  //     return;
  //   });
  //   console.log(result);
  // };
  // const Record = async () => {
  //   if (Platform.OS === 'android') {
  //     try {
  //       const grants = await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //       ]);

  //       console.log('write external stroage', grants);

  //       if (
  //         grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
  //           PermissionsAndroid.RESULTS.GRANTED &&
  //         grants['android.permission.READ_EXTERNAL_STORAGE'] ===
  //           PermissionsAndroid.RESULTS.GRANTED &&
  //         grants['android.permission.RECORD_AUDIO'] ===
  //           PermissionsAndroid.RESULTS.GRANTED
  //       ) {
  //         onStartRecord();
  //       } else {
  //         console.log('All required permissions not granted');

  //         return;
  //       }
  //     } catch (err) {
  //       console.warn(err);

  //       return;
  //     }
  //   }
  // };
  const getPlace = (latitude, longitude) => {
    let radius = 100;
    let mapKey = 'AIzaSyCmhmQiZWqaMzKclPUY-mEshxF7Lj4T4NI';
    let request = `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${mapKey}`;
    return Axios.get(request)
      .then(({data, status}) => {
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
  const cuRRentlocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setlatitude(position.coords.latitude);
        setlongitude(position.coords.longitude);

        getPlace(position.coords.latitude, position.coords.longitude);
      },
      error => {
        console.log('error in loc', error);
      },
      {
        enableHighAccuracy: true,
      },
    );
  };
  // const recordAudio = async () => {
  //   try {
  //     prepareRecordingPath(audioPath);
  //     const filePath = await AudioRecorder.startRecording();
  //   } catch (error) {}
  // };
  // const prepareRecordingPath = (audioPath) => {
  //   AudioRecorder.prepareRecordingAtPath(audioPath, {
  //     SampleRate: 22050,
  //     Channels: 1,
  //     AudioQuality: 'Low',
  //     AudioEncoding: 'aac',
  //     AudioEncodingBitRate: 32000,
  //   });
  // };
  // console.log('fcm_token', fcm_token);
  // console.log('item in chat', item);
  useEffect(() => {
    if (recordingState === 'recording') {
      timerInterval.current = setInterval(() => {
        setTimer(timer + 1);
      }, 1000);
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        if (recordingState === 'uploading') setTimer(0);
      }
    };
  }, [timer, recordingState]);
  useEffect(() => {
    checkPermission();
  }, []);
  const checkPermission = async () => {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    let result;
    try {
      result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message:
            'App needs access to your microphone so you can search with voice.',
        },
      );
    } catch (error) {}
    return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
  };
  // const recordAudio = async () => {
  //   console.log('i came in record start');
  //   try {
  //     console.log('i came in record start try function');
  //     prepareRecordingPath(audioPath);
  //     const filePath = await AudioRecorder.startRecording();
  //   } catch (error) {}
  // };
  // const prepareRecordingPath = audioPath => {
  //   console.log('i came in preparerecording path');
  //   AudioRecorder.prepareRecordingAtPath(audioPath, {
  //     SampleRate: 22050,
  //     Channels: 1,
  //     AudioQuality: 'Low',
  //     AudioEncoding: 'aac',
  //     AudioEncodingBitRate: 32000,
  //   });
  // };
  // const stopRecording = async () => {
  //   const filePath = await AudioRecorder.stopRecording();
  //   if (Platform.OS === 'ios') {
  //     AudioRecorder.onFinished = ({audioFileURL}) => {
  //       // Android callback comes in the form of a promise instead.
  //       // devLogger('Audio', audioFileURL);
  //       if (audioFileURL) {
  //         //verify that audio on ios saving bucket
  //         goForFetch(audioFileURL);
  //       }
  //     };
  //   } else {
  //     goForFetch(filePath);
  //   }
  //   // AudioRecorder.onFinished = (data) => {
  //   //   // Android callback comes in the form of a promise instead.
  //   //   console.log('sfs', data);
  //   //   goForFetch(data.audioFileURL);
  //   // };
  //   // AudioRecorder.o

  //   // console.log('the file chat created', filePath);
  // };
  const createFormData = audio => {
    const data1 = new FormData();
    data1.append('audio', {
      uri: Platform.OS === 'android' ? 'file://' + audio : audio,
      name: 'test.aac',
      type: 'audio/aac',
    });

    return data1;
  };
  const goForFetch = async voice => {
    console.log('voice Link', voice);
    const data1 = new FormData();
    data1.append('audio', {
      uri: Platform.OS === 'android' ? 'file://' + voice : voice,
      name: `${Date.now()}test.aac`,
      type: 'audio/aac',
    });
    audioConvert({ Auth: userData.token},data1).then(res=>{
      console.log("audio convert back res",res);
      if(res.status=="success"){
        setRecordingState('');
        handleSendVoice(res.Path);
      }
    }).catch(err=>{
      console.log("audio convert back err",err);
    })
    // await fetch('https://towntalkapp.com/app/api/audioPath', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    //   body: createFormData(voice),
    // })
    //   .then(response => response.json())
    //   .then(responseJson => {
    //     console.log('the return voice file', JSON.stringify(responseJson));
    //     setRecordingState('');
    //     handleSendVoice(responseJson.Path);
    //   })
    //   .catch(error => {console.log("error in audio",error)});
  };
  const locationModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showLocationModal}
      onRequestClose={() => {
        // Alert.alert('Modal has been closed.');
        setShowLocationModal(!showLocationModal);
      }}>
      <View
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'space-between',
          backgroundColor: 'white',
        }}>
        <View>
          <View
            style={{
              height: 58,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 10,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#ccc',
                alignItems: 'center',
                justifyContent: 'center',
                height: 30,
                width: 30,
                borderRadius: 5,
              }}
              onPress={() => setShowLocationModal(!showLocationModal)}>
              <Icon1 name="arrowleft" color="black" size={20} />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 14,
                color: 'black',
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Send location
            </Text>
            <View style={{width: 30}} />
          </View>

          <View style={{height: keyboardStatus == 'Keyboard Shown' ? 300 : 60}}>
            <GooglePlacesAutocomplete
              placeholder="Search or enter address"
              fetchDetails={true}
              // currentLocation={true}
              // numberOfLines={3}
              // multiline={true}
              GooglePlacesDetailsQuery={{fields: 'geometry'}}
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                // console.log('data', data);
                setLocation(data.description);
                setlatitude(details?.geometry.location.lat);
                setlongitude(details?.geometry.location.lng);
                // console.log('detail', details);
                mapRef.current.animateToRegion({
                  latitude: details?.geometry.location.lat,
                  longitude: details?.geometry.location.lng,
                  latitudeDelta: 0.4,
                  longitudeDelta: 0.4,
                });
                // console.log(JSON.stringify(details.geometry.location));
              }}
              styles={{
                textInputContainer: {
                  // backgroundColor: 'grey',
                },
                textInput: {
                  height: 38,
                  backgroundColor: '#EBEBEB',
                  color: '#5d5d5d',
                  fontSize: 16,
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
              }}
              query={{
                key: config,
                language: 'en',
              }}
            />
          </View>
          <View style={{height: 200}}>
            <MapView
              ref={mapRef}
              style={{flex: 1}}
              initialRegion={{
                latitude: latitude ? latitude : 37.78825,
                longitude: longitude ? longitude : -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                // key={index}
                // style={{color: 'black'}}
                coordinate={{
                  latitude: latitude ? latitude : 37.78825,
                  longitude: longitude ? longitude : -122.4324,
                }}
                title={'location'}
                // description={marker.description}
              />
            </MapView>
          </View>
          <Text
            style={{
              margin: 15,
              color: 'black',

              fontFamily: 'MontserratAlternates-SemiBold',
            }}>
            {location}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={{
              backgroundColor: 'purple',
              width: '90%',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              height: 50,
              borderRadius: 10,
            }}
            onPress={() => {
              handleSendLocation();
              setShowLocationModal(!showLocationModal);
            }}>
            <Text
              style={{
                margin: 15,
                color: 'white',

                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Send this location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#5F95F0',
              width: '90%',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              height: 50,
              borderRadius: 10,
            }}
            onPress={() => {
              // handleSendLocation();
              setShowLocationModal(!showLocationModal);
            }}>
            <Text
              style={{
                margin: 15,
                color: 'white',

                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  const guestData = {
    id: item.id,
    firstname: item.firstname,
    // lastname: item.lastname,
    email: item.email,
    fcm_token: fcm,
    image: item.image,
  };
  const user = {
    id: userData.userdata.id,
    firstname: userData.userdata.firstname,
    // lastname: userData.userdata.lastname,
    email: userData.userdata.email,
    fcm_token: userData.userdata.fcm_token,
    image: userData.userdata.image,
  };
  useEffect(() => {
    getfcm({id: item.id}).then(res => {
      setFcm(res.token);
    });
    cuRRentlocation();
    // Alert.alert('hello');
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
  const _chatUsersRequest = async () => {
    try {
      // console.log('user going to db', guestData);
      // database()
      //   .ref(
      //     'requestusers/' +
      //       userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      //   )
      //   .child(guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
      //   .set({
      //     latestMessage: message,
      //     timestamp: database.ServerValue.TIMESTAMP,
      //     counter: 0,
      //     screen: image && items,
      //     user: guestData,
      //   });

      database()
        .ref('requestusers/' + guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .child(userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .once('value', snapshot => {
          const counts = snapshot?.val()?.counter;
          database()
            .ref(
              'requestusers/' + guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''),
            )
            .child(userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
            .set({
              latestMessage: message,
              timestamp: database.ServerValue.TIMESTAMP,
              counter: counts ? counts + 1 : 1,
              screen: image && items,
              user: user,
            });
        });
    } catch (error) {}
  };
  const _chatUsers = async () => {
    try {
      // console.log('user going to db', guestData);
      database()
        .ref(
          'requestusers/' +
            userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
        )
        .child(guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .remove();
      database()
        .ref('users/' + userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .child(guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .set({
          latestMessage: message,
          timestamp: database.ServerValue.TIMESTAMP,
          counter: 0,
          screen: image && items,
          user: guestData,
        });

      database()
        .ref('users/' + guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .child(userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .once('value', snapshot => {
          const counts = snapshot?.val()?.counter;
          database()
            .ref('users/' + guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
            .child(userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
            .set({
              latestMessage: message,
              timestamp: database.ServerValue.TIMESTAMP,
              counter: counts ? counts + 1 : 1,
              screen: image && items,
              user: user,
            });
        });
    } catch (error) {}
  };
  const _handlePushNotification = () => {
    // console.log('inside push notification function', guestData.fcm_token);
    const userData1 = {
      name: `${userData.userdata.firstname}`,
      email: userData.userdata.email,
      image: userData.userdata.image,
      fcm_token: userData.userdata.fcm_token,
    };
    const dataToSend = {
      notification: {
        id: `${userData1.email}`,
        title: `${userData1.name}`,
        body:
          message.substring(message.length - 4) == '.jpg' ? 'Image' : message,
      },
      data: {
        guestData: user,
        item: user,
        fcm_token: userData.userdata.fcm_token,
        type: 'message',
      },
      to: guestData.fcm_token,
    };
    const data = JSON.stringify(dataToSend);
    // console.log('data to send ', dataToSend);
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `key=${firebase_key}`,
      },
      body: data,
    })
      .then(res => res.json('response of push notification', res))
      .then(res => {
        // console.log('response of Api send messages , , , , , , ', res);
      })
      .catch(err => {});
  };
  const handleSend = () => {
    if (message) {
      setMessage('');
      _handlePushNotification();
      // console.log('message is here', message);
      senderMsg(
        message,
        userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
        guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''),
        Date.now(),
        items,
        // quote,
      );

      _chatUsers()
        .then(() => {})
        .catch(err => {
          // console.log('error inside screen', err);
        });

      recieverMsg(
        message,
        userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
        guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''),
        Date.now(),
        items,
        // quote,
      );
      _chatUsers()
        .then(() => {})
        .catch(err => {});
    }

    // _handlePushNotification()
  };
  const handleSendVoice = voice => {
    console.log('voice going for firebase', voice);
    _handlePushNotification();
    senderVoice(
      voice,
      userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      Date.now(),
    );

    _chatUsers()
      .then(() => {})
      .catch(err => {
        // console.log('error inside screen', err);
      });

    recieverVoice(
      voice,
      userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      Date.now(),
    );
    _chatUsers()
      .then(() => {})
      .catch(err => {});

    // _handlePushNotification()
  };
  const handleSendLocation = () => {
    _handlePushNotification();
    senderLocation(
      location,
      userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      Date.now(),
      latitude,
      longitude,
      // items,

      // quote,
    );

    _chatUsers()
      .then(() => {})
      .catch(err => {
        // console.log('error inside screen', err);
      });

    recieverLocation(
      location,
      userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      Date.now(),
      latitude,
      longitude,
      // quote,
    );
    _chatUsers()
      .then(() => {})
      .catch(err => {});
    // }

    // _handlePushNotification()
  };

  const _getMeesages = async () => {
    try {
      database()
        .ref('messeges')
        .child(userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .child(guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .on('value', dataSnapshot => {
          let msgs = [];
          dataSnapshot.forEach(child => {
            // console.log('child', child);
            msgs.push({
              sendBy: child.val().messege.sender,
              recievedBy: child.val().messege.reciever,
              msg: child.val().messege.msg,
              date: child.val().messege.date,
              // Type: child.val().messege.type,
              screen: child.val().messege.screen,
              latitude: child.val().messege.latitude,
              longitude: child.val().messege.longitude,
              audio: child.val().messege.audio,
              // quote: child.val().messege.quote,
            });
            return undefined;
          });
          setMessages(msgs.reverse());

          // console.log('msssssssssssssggggggggggsssssssss', msgs);
        });
    } catch (error) {}
  };
  useEffect(() => {
    if (image) {
      setMessage(image);
    }
  }, [image]);
  useEffect(() => {
    _getMeesages();
    _updateChatCount();
  }, []);
  const _updateChatCount = async () => {
    try {
      database()
        .ref('users/' + userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .child(guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .once('value', snapshot => {
          if (snapshot.val() != null) {
            database()
              .ref(
                'users/' +
                  userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
              )
              .child(guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
              .update({
                counter: 0,
              });
          }
        });
    } catch (error) {}
  };
  const render = ({item, index}) => {
    // console.log('item in chat', item);
    const check = word => {
      if (word?.substring(word.length - 4) == '.jpg') {
        return true;
      }
    };
    const checkVideo = word => {
      if (word?.substring(word.length - 4) == '.mp4') {
        return true;
      }
    };

    return (
      <View
        style={{
          // backgroundColor: 'red',
          // height: 50,
          alignItems:
            item.sendBy == userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, '')
              ? 'flex-end'
              : 'flex-start',
          marginBottom: 10,
          marginTop: index == 0 ? 10 : 10,
          // backgroundColor:darkmode?"black":"white"
        }}>
        {check(item.msg) == true ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PostDetails', {item: item.screen})
            }>
            <Image
              source={{uri: item.msg}}
              style={{height: 300, width: 300, borderRadius: 5}}
            />
          </TouchableOpacity>
        ) : checkVideo(item.msg) ? (
          <VideoComp item={item} navigation={navigation} />
        ) : item.latitude ? (
          <TouchableOpacity
            onPress={() => {
              const scheme = Platform.select({
                ios: 'maps:0,0?q=',
                android: 'geo:0,0?q=',
              });
              const latLng = `${item.latitude},${item.longitude}`;
              const label = `${item.msg}`;
              const url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`,
              });
              Linking.openURL(url);
            }}
            style={{width: '90%', zIndex: 2}}>
            <View
              style={{
                backgroundColor: '#EBEBEB',
                height: 50,
                paddingLeft: 10,
                // alignItems: 'center',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                justifyContent: 'center',
              }}>
              <Text>{item.msg}</Text>
            </View>
            <View
              style={{
                height: 200,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                width: '100%',
              }}>
              <MapView
                // ref={mapRef}
                scrollEnabled={false}
                style={{
                  flex: 1,
                  zIndex: -1,
                  // borderBottomLeftRadius: 10,
                  // borderBottomRightRadius: 10,
                }}
                initialRegion={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
                <Marker
                  // key={index}
                  // style={{color: 'black'}}
                  coordinate={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }}
                  title={'location'}
                  // description={marker.description}
                />
              </MapView>
            </View>
          </TouchableOpacity>
        ) : item.audio ? (
          <AudioComp
          date={item.date}
            audio={item.audio}
            me={
              item.sendBy ==
              userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, '')
                ? true
                : false
            }
          />
        ) : (
          <Message item={item} navigation={navigation} />
        )}
      </View>
    );
  };
  const fun = () => {
    for (let x = 0; x < messages.length; x++) {
      // console.log('dd', x);
      if (
        messages[x].recievedBy ==
        userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, '')
      ) {
        // setcmsg(true);
        return true;
        // break;
      } else {
        console.log('hello');
      }
    }
    // console.log(cmsg);
  };
  const requestSend = () => {
    setMessage('');
    console.log('called in request send');
    // _handlePushNotification();
    // console.log('message is here', message);
    senderMsg(
      message,
      userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      Date.now(),
      '',
    );
    _chatUsersRequest()
      .then(res => {
        console.log('no error found in send', res);
      })
      .catch(err => {
        console.log('error inside sender', err);
      });

    recieverMsg(
      message,
      userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''),
      Date.now(),
      '',
    );
    _chatUsersRequest()
      .then(res => {
        console.log('no error found in rev', res);
      })
      .catch(err => {
        console.log('error inside receiver', err);
      });
  };
  // console.log('messages', messages);
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
      <Wrapper behavior="padding" style={{flex: 1}}>
        <View
          style={{
            height: 80,
            // backgroundColor: 'white',
            // elevation: 3,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#ccc',
                alignItems: 'center',
                justifyContent: 'center',
                height: 30,
                width: 30,
                borderRadius: 5,
              }}
              onPress={() => navigation.goBack()}>
              <Icon1 name="arrowleft" color="black" size={20} />
            </TouchableOpacity>
            <Image
              source={
                item?.image
                  ? {uri: item?.image}
                  : require('../../../assets/Images/girl.jpg')
              }
              style={{
                height: 40,
                marginLeft: 20,
                width: 40,
                borderRadius: 20,
              }}
            />
            <View style={{marginLeft: 10}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'MontserratAlternates-SemiBold',
                  color: darkmode ? 'white' : 'black',
                }}>
                {`${item?.firstname} `}
              </Text>
              {/* <Text
                style={{
                  fontFamily: 'MontserratAlternates-Regular',
                  color: 'black',
                }}>
                online
              </Text> */}
            </View>
          </View>

          {/* <Image
            source={require('../../../assets/Images/search.png')}
            style={{height: 20, width: 20}}
          /> */}
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            backgroundColor: darkmode ? 'black' : 'white',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            flex: 1,
          }}>
          <FlatList
            inverted
            showsVerticalScrollIndicator={false}
            data={messages}
            renderItem={render}
            // style={{paddingVertical: 20}}
          />
        </View>
        <View
          style={{
            height: 70,

            paddingHorizontal: 15,
            backgroundColor: darkmode ? '#242527' : 'white',
            marginBottom:
              Platform.OS == 'android'
                ? 0
                : keyboardStatus == 'Keyboard Shown'
                ? 20
                : 0,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // backgroundColor: 'red',
              borderRadius: 30,
              borderWidth: 1,
              borderColor: 'grey',
              justifyContent: 'space-between',
            }}>
            <TextInput
              value={message}
              onChangeText={text => setMessage(text)}
              placeholder="Message..."
              style={{
                backgroundColor: 'white',
                width: message ? '85%' : '75%',
                height: 50,
                paddingHorizontal: 10,
                color: 'black',
                fontFamily: 'MontserratAlternates-Regular',
                borderRadius: 30,
              }}
              placeholderTextColor={'grey'}
            />
            {message ? (
              <TouchableOpacity
                onPress={() => (fun() ? handleSend() : requestSend())}
                // onPress={() => handleSend()}
                style={{
                  backgroundColor: '#5F95F0',
                  borderRadius: 30,
                  width: 35,
                  height: 35,
                  marginRight: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon2 name="ios-send" size={15} color="white" />
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  marginRight: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => setShowLocationModal(true)}
                  style={{
                    height: 30,
                    width: 30,
                    marginRight: 10,
                    borderRadius: 20,
                    backgroundColor: '#5F95F0',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon2 name="location-outline" size={20} color="white" />
                  {/* <Image
                  source={require('../../../../assets/Icons/Mic.png')}
                  style={{height: 20, width: 20, resizeMode: 'contain'}}
                /> */}
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={recordingState === 'uploading'}
                  onLongPress={() => {
                    onStartRecord();
                    // recordAudio();
                    setRecordingState('recording');
                  }}
                  onPressOut={() => {
                    if (recordingState === 'recording') {
                      onStopRecord();
                      setRecordingState('uploadings');
                    }
                  }}
                  // onPress={() => onStopRecord()}
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 20,

                    backgroundColor: '#5F95F0',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon2 name="mic" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Wrapper>
      {locationModal()}
    </SafeAreaView>
  );
};
export default SingleChat;
