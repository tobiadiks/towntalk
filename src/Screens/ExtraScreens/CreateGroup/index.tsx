import React, {useState, useEffect} from 'react';

import {
  View,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  ImageBackground,
} from 'react-native';
import Tags from 'react-native-tags';
import MyModal from '../../../Components/MyModal';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {addgroup} from '../../../lib/api';
import Icon1 from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import ImagePicker from 'react-native-image-crop-picker';
const CreateGroup = ({navigation}) => {
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [zip, setZip] = useState('');
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState(false);
  const [latitude, setlatitude] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [longitude, setlongitude] = useState(0);
  const {userData} = useSelector(({USER}) => USER);
  const [hash, setHash] = useState([]);
  const picker = () => {
    ImagePicker.openPicker({
      // multiple: true,
      width: 1500,
      height: 1500,
      cropping: true,
    }).then(image => {
      // setShow(!show);
      // images.push(image.path);
      setImg(image.path);
      console.log(image);
      // setImgErr('');
    });
  };
  // console.log('show', status);
  const cuRRentlocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setlatitude(position.coords.latitude);
        setlongitude(position.coords.longitude);
        // getPlace(position.coords.latitude, position.coords.longitude);
        // getPlace('47.751076', '-120.740135');
        console.log('users location', position.coords.longitude);

        console.log('users location', position.coords.latitude);
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
  useEffect(() => {
    // handleAddress('solo');
    Platform.OS == 'ios'
      ? Geolocation.requestAuthorization('always').then(res => {
          cuRRentlocation();
          // console.log('res', res);
        })
      : requestLocationPermission();
  }, []);
  const Wrapper = Platform.OS == 'ios' ? KeyboardAvoidingView : View;
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
            // justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon1 name="left" color="black" size={20} />
          </TouchableOpacity>
          <View style={{marginLeft: 10}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'MontserratAlternates-SemiBold',
                color: 'black',
              }}>
              Create Group
            </Text>
            {/* <Text style={{fontFamily: 'MontserratAlternates-Regular'}}>
              Chicago, IL 60611, USA
            </Text> */}
          </View>
        </View>
        <Wrapper behavior="padding" style={{flex: 1}}>
          <ScrollView>
            <View style={{marginTop: 20, paddingHorizontal: 15}}>
              <View style={{flexDirection: 'row'}}>
                {img ? (
                  // <View style={{width: 150, marginRight: 10, height: 150}}>
                  //   <Swiper
                  //     showsPagination={true}
                  //     key={img.length}
                  //     paginationStyle={{bottom: 10}}
                  //     activeDotColor="#5F95F0"
                  //     loop={false}
                  //     style={{alignItems: 'center', justifyContent: 'center'}}
                  //     showsButtons={false}>
                  //     {img.map(item => (
                  //       <Image
                  //         source={{uri: item.image}}
                  //         style={{
                  //           borderRadius: 10,
                  //           width: '100%',
                  //           height: '100%',
                  //         }}
                  //       />
                  //     ))}
                  //   </Swiper>
                  // </View>
                  <TouchableOpacity
                    onPress={() => picker()}
                    style={{
                      height: 150,
                      width: '100%',
                      borderWidth: 1,

                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                      borderColor: '#5F95F0',
                    }}>
                    <Image
                      source={{uri: img}}
                      style={{width: '100%', height: '100%'}}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => picker()}
                    style={{
                      height: 150,
                      width: '100%',
                      borderWidth: 1,

                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                      borderColor: '#5F95F0',
                    }}>
                    <Icon2 name="images-outline" size={50} color={'#5F95F0'} />
                  </TouchableOpacity>
                )}
              </View>
              <View style={{marginTop: 30}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    fontFamily: 'MontserratAlternates-SemiBold',
                  }}>
                  GROUP NAME
                </Text>
                <TextInput
                  value={name}
                  placeholderTextColor={'grey'}
                  // placeholder={'abc'}
                  // editable={false}
                  onChangeText={text => {
                    setName(text);
                    // setEmailErr('');
                  }}
                  style={{
                    fontFamily: 'MontserratAlternates-Regular',
                    borderBottomColor: 'grey',
                    color: 'black',
                    height: 50,
                    paddingHorizontal: 10,
                    // backgroundColor: 'red',
                    borderBottomWidth: 1,
                  }}
                />
              </View>

              <View style={{marginTop: 30}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    fontFamily: 'MontserratAlternates-SemiBold',
                  }}>
                  Group Status
                </Text>
                <TouchableOpacity
                  onPress={() => setShow(!show)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: 'black',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'MontserratAlternates-Regular',
                    }}>
                    {status ? 'Private' : 'Public'}
                  </Text>
                  <Icon1 name="caretdown" color="black" size={15} />
                </TouchableOpacity>
                {show && (
                  <TouchableOpacity
                    onPress={() => {
                      setStatus(!status);
                      setShow(!show);
                    }}
                    style={{
                      backgroundColor: 'white',
                      height: 30,
                      borderRadius: 5,
                      paddingLeft: 5,
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: 'black'}}>
                      {status ? 'Public' : 'Private'}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* <TextInput
                value={zip}
                onChangeText={text => {
                  setZip(text);
                  // setEmailErr('');
                }}
                style={{
                  fontFamily: 'MontserratAlternates-Regular',
                  borderBottomColor: 'grey',
                  borderBottomWidth: 1,
                }}
              /> */}
              </View>
              <View style={{marginTop: 30}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    fontFamily: 'MontserratAlternates-SemiBold',
                  }}>
                  Group description
                </Text>
                <TextInput
                  value={zip}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  onChangeText={text => {
                    setZip(text);
                    // setEmailErr('');
                  }}
                  style={{
                    fontFamily: 'MontserratAlternates-Regular',
                    borderColor: 'grey',
                    borderWidth: 1,
                    marginTop: 10,
                    paddingHorizontal: 10,
                    color: 'black',
                    borderRadius: 5,
                    // backgroundColor: 'red',
                    height: 100,
                  }}
                />
              </View>
              {/* <View style={{marginTop: 30}}>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                Hash Tag
              </Text>
              <Tags
                initialText=""
                textInputProps={{
                  placeholder: 'Any Tag',
                  autoCapitalize: 'none',
                  placeholderTextColor: 'grey',
                }}
                initialTags={[]}
                onChangeTags={tags => setHash(tags)}
                onTagPress={(index, tagLabel, event, deleted) =>
                  console.log(
                    index,
                    tagLabel,
                    event,
                    deleted ? 'deleted' : 'not deleted',
                  )
                }
                containerStyle={{justifyContent: 'center'}}
                inputStyle={{
                  // borderWidth: 1,
                  height: 50,
                  backgroundColor: 'white',
                  borderRadius: 5,
                  color: 'black',
                  // borderColor: 'black',
                }}
                renderTag={({
                  tag,
                  index,
                  onPress,
                  deleteTagOnPress,
                  readonly,
                }) => (
                  <TouchableOpacity key={`${tag}-${index}`} onPress={onPress}>
                    <Text>
                      {`${tag.substring(0, 1) != '#' ? '#' : ''}${tag}`}{' '}
                    </Text>
                  </TouchableOpacity>
                )}
              />
             
            </View> */}
              <TouchableOpacity
                onPress={() => {
                  if (name && img && zip) {
                    // if (hash.length > 0) {
                    setShowModal(true);
                    const data = new FormData();
                    data.append('title', name);
                    data.append('status', status ? 'private' : 'public');
                    data.append('description', zip);
                    data.append('latitude', latitude);
                    data.append('longitude', longitude);
                    // hash.forEach(item => {
                    //   data.append('hashtags[]', item);
                    // });
                    data.append('image', {
                      uri: img,
                      type: 'image/jpeg',
                      name: `image${Math.random()}.jpg`,
                    });
                    addgroup({Auth: userData.token}, data)
                      .then(res => {
                        console.log('res', res);
                        setShowModal(false);
                        if (res.status == 'success') {
                          navigation.goBack();
                        }
                      })
                      .catch(err => {
                        console.log('err', err.response.data);
                        setShowModal(false);
                        Alert.alert('Something went wrong try again!');
                      });
                    // } else {
                    //   Alert.alert("Enter Hash tag then press 'space'");
                    // }
                  } else {
                    Alert.alert('All fields required');
                  }
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50,
                  marginTop: 30,
                  marginBottom: 20,
                  borderRadius: 5,
                  elevation: 2,
                  backgroundColor: '#5F95F0',
                }}>
                <Text
                  style={{
                    fontFamily: 'MontserratAlternates-SemiBold',
                    color: 'white',
                  }}>
                  Create Group
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Wrapper>
      </ImageBackground>
      {MyModal(showModal)}
    </SafeAreaView>
  );
};
export default CreateGroup;
