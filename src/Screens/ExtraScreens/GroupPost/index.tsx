import React, {useState, useEffect} from 'react';

import {
  View,
  FlatList,
  TextInput,
  ScrollView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Image,
  Text,
  ImageBackground,
  PermissionsAndroid,
} from 'react-native';
import moment from 'moment';
import Tags from 'react-native-tags';
import Geolocation from 'react-native-geolocation-service';
import MapView from 'react-native-maps';
import {addPost} from '../../../lib/api';
import MyModal from '../../../Components/MyModal';
import LikeDislike from '../../../Components/LikeDislike';
import Comments from '../../../Components/Comments';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Hotel from '../../../Components/Hotel';
import {useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import Swiper from 'react-native-swiper';
const GroupPost = ({navigation, route}) => {
  const {item} = route.params;
  const {userData} = useSelector(({USER}) => USER);
  const [name, setName] = useState(`${userData?.userdata?.firstname}`);
  const [img, setImg] = useState([]);
  const [zip, setZip] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [hash, setHash] = useState([]);
  const [latitude, setlatitude] = useState(0);
  const [longitude, setlongitude] = useState(0);
  // console.log('userdata', latitude, longitude);
  const d = new Date();
  // console.log('date', d.toLocaleDateString());
  const picker = () => {
    ImagePicker.openPicker({
      // multiple: true,
      width: 1500,
      height: 1500,
      cropping: true,
    }).then(image => {
      // setShow(!show);
      // images.push(image.path);
      // setImg(image.path);
      setImg([...img, {image: image.path}]);
      // console.log(image);
      // setImgErr('');
    });
  };
  // console.log('has', hash);
  const add = () => {
    if (zip && latitude) {
      if (description || img.length > 0) {
        // if (hash.length > 0) {
        setShowModal(true);
        const data = new FormData();
        // hash.forEach(item => {
        //   data.append('hashtags[]', item);
        // });
        data.append('zipcode', zip);
        data.append('latitude', latitude);
        data.append('longitude', longitude);
        data.append('description', description);
        // data.append("dateTime",)
        data.append('dateTime', moment(d).format('MM-DD-YYYY hh:mm a'));
        data.append('title', name);
        data.append('media_type', 'image');
        data.append('group_id', item.id);
        img.forEach(item => {
          data.append('media[]', {
            uri: item.image,
            type: 'image/jpeg',
            name: `image${Math.random()}.jpg`,
          });
        });

        addPost({Auth: userData.token}, data)
          .then(res => {
            setShowModal(false);
            console.log('res', res);
            if (res.status == 'success') {
              navigation.goBack();
            }
          })
          .catch(err => {
            setShowModal(false);
            console.log('err', err);
          });
      } else {
        Alert.alert('Enter post detail!');
      }
      // } else {
      //   Alert.alert("Enter Hash tag then press 'space'");
      // }
    } else {
      Alert.alert('Zip code required');
    }
  };
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
  console.log('lat', latitude, longitude);
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
    setImg([]);
    // setName('');
    setZip('');
    setDescription('');
    setHash([]);
    Platform.OS == 'ios'
      ? Geolocation.requestAuthorization('always').then(res => {
          cuRRentlocation();
          console.log('res', res);
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
            justifyContent: 'space-between',
          }}>
          {/* <TouchableOpacity>
            <Icon1 name="left" size={20} />
          </TouchableOpacity> */}
          <View
            style={{
              marginLeft: 0,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon1
              name="left"
              color="black"
              size={20}
              onPress={() => navigation.goBack()}
            />
            <Text
              style={{
                fontSize: 16,
                marginLeft: 10,
                fontFamily: 'MontserratAlternates-SemiBold',
                color: 'black',
              }}>
              Add Post
            </Text>
            {/* <Text style={{fontFamily: 'MontserratAlternates-Regular'}}>
              Chicago, IL 60611, USA
            </Text> */}
          </View>
          <TouchableOpacity
            onPress={() => add()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
              // marginTop: 30,
              paddingHorizontal: 20,

              borderRadius: 5,
              elevation: 2,
              backgroundColor: '#5F95F0',
            }}>
            <Text
              style={{
                fontFamily: 'MontserratAlternates-SemiBold',
                color: 'white',
              }}>
              Add Post
            </Text>
          </TouchableOpacity>
        </View>
        <Wrapper behavior="padding" style={{flex: 1}}>
          <ScrollView>
            <View style={{marginTop: 20, paddingHorizontal: 15}}>
              <View style={{flexDirection: 'row'}}>
                {img.length > 0 && (
                  <View style={{width: 150, marginRight: 10, height: 150}}>
                    <Swiper
                      showsPagination={true}
                      key={img.length}
                      paginationStyle={{bottom: 10}}
                      activeDotColor="#5F95F0"
                      loop={false}
                      style={{alignItems: 'center', justifyContent: 'center'}}
                      showsButtons={false}>
                      {img.map(item => (
                        <Image
                          source={{uri: item.image}}
                          style={{
                            borderRadius: 10,
                            width: '100%',
                            height: '100%',
                          }}
                        />
                      ))}
                    </Swiper>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => picker()}
                  style={{
                    height: 150,
                    width: '45%',
                    borderWidth: 1,

                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    borderColor: '#5F95F0',
                  }}>
                  {/* {img ? (
                  <Image
                    source={{uri: img}}
                    style={{height: 150, width: '100%', borderRadius: 5}}
                  />
                ) : ( */}
                  <Icon2 name="images-outline" size={50} color={'#5F95F0'} />
                  {/* )} */}
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 30}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    fontFamily: 'MontserratAlternates-SemiBold',
                  }}>
                  Name
                </Text>
                {/* <TextInput
                value={`${userData.userdata.firstname} ${userData.userdata.lastname}`}
                placeholderTextColor={'black'}
                editable={false}
                // onChangeText={text => {

                //   setEmail(text);
                //   setEmailErr('');
                // }}
                style={{
                  fontFamily: 'MontserratAlternates-Regular',
                  borderBottomColor: 'grey',
                  color: 'black',
                  borderBottomWidth: 1,
                }}
              /> */}
                <TextInput
                  value={name}
                  placeholderTextColor={'black'}
                  editable={false}
                  onChangeText={text => {
                    setName(text);
                  }}
                  style={{
                    fontFamily: 'MontserratAlternates-Regular',
                    borderBottomColor: 'grey',
                    color: 'black',
                    height: 50,
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
                  Zip code
                </Text>
                <TextInput
                  value={zip}
                  onChangeText={text => {
                    setZip(text);
                    // setEmailErr('');
                  }}
                  style={{
                    fontFamily: 'MontserratAlternates-Regular',
                    borderBottomColor: 'grey',
                    borderBottomWidth: 1,
                    paddingHorizontal: 10,
                    color: 'black',
                    height: 50,
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
                  Post description
                </Text>
                <TextInput
                  textAlignVertical="top"
                  value={description}
                  multiline
                  numberOfLines={5}
                  onChangeText={text => {
                    setDescription(text);
                    // setEmailErr('');
                  }}
                  style={{
                    fontFamily: 'MontserratAlternates-Regular',
                    borderColor: 'grey',
                    borderWidth: 1,
                    marginTop: 10,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    color: 'black',
                    height: 100,
                  }}
                />
              </View>
              <View style={{height: 50}} />
              {/* <View style={{marginTop: 30, marginBottom: 20}}>
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
                      <Text style={{color: 'grey'}}>
                        {`${tag.substring(0, 1) != '#' ? '#' : ''}${tag}`}{' '}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View> */}
            </View>
          </ScrollView>
        </Wrapper>
      </ImageBackground>
      {MyModal(showModal)}
    </SafeAreaView>
  );
};
export default GroupPost;
