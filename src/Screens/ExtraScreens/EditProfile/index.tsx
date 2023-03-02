import React, {useState} from 'react';

import {
  View,
  FlatList,
  TextInput,
  ScrollView,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground,
} from 'react-native';
import MyModal from '../../../Components/MyModal';
import Posts from '../../../Components/Posts';
import Group from '../../../Components/Group';
import MapView from 'react-native-maps';
import Iconpencil from 'react-native-vector-icons/Octicons';
import IconIos from 'react-native-vector-icons/EvilIcons';
import {logged, darkMode} from '../../../redux/actions';
import LikeDislike from '../../../Components/LikeDislike';
import Comments from '../../../Components/Comments';
import ImagePicker from 'react-native-image-crop-picker';
import {editProfile} from '../../../lib/api';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Hotel from '../../../Components/Hotel';
import {useSelector, useDispatch} from 'react-redux';
const EditProfile = ({navigation}: {navigation: any}) => {
  const {userData, darkmode} = useSelector(({USER}) => USER);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(userData.userdata.image);
  const [firstName, setFirstName] = useState(userData?.userdata?.firstname);
  const [lastName, setLastName] = useState(userData?.userdata?.lastname);
  const [zip, setZip] = useState(userData.userdata.zipcode);
  const [mile, setMile] = useState('5 Miles');
  const [miles, setMiles] = useState(
    userData.userdata.radius ? userData.userdata.radius : 5,
  );
  const [email, setEmail] = useState(userData.userdata.email);
  const arr = ['fun', 'danger', 'helpful', 'adventure', 'hobby'];
  console.log('image', userData);
  const myModal3 = () => (
    <Modal animationType="slide" transparent={true} visible={showModal}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#00000088',
        }}>
        <View
          style={{
            width: '80%',
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
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
            <Icon2
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
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-Regular',
              }}>
              5 Miles
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
            <Icon2
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
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-Regular',
              }}>
              10 Miles
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
            <Icon2
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
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-Regular',
              }}>
              15 Miles
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMile('20 Miles')}
            style={{
              flexDirection: 'row',
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
              paddingBottom: 10,
              marginTop: 10,
              alignItems: 'center',
            }}>
            <Icon2
              name={
                mile == '20 Miles'
                  ? 'radio-button-checked'
                  : 'radio-button-unchecked'
              }
              size={20}
              color={mile == '20 Miles' ? '#5F95F0' : 'grey'}
            />
            <Text
              style={{
                marginLeft: 5,
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-Regular',
              }}>
              20 Miles
            </Text>
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setMiles(
                  mile == '20 Miles'
                    ? 20
                    : mile == '15 Miles'
                    ? 15
                    : mile == '10 Miles'
                    ? 10
                    : 5,
                );
                setShowModal(false);
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
  const picker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(image.path);
    });
  };
  const Wrapper = Platform.OS == 'ios' ? KeyboardAvoidingView : View;
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
      {/* <ImageBackground
        style={{flex: 1}}
        source={require('../../../assets/Images/back.png')}> */}
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
        <View
          style={{
            flexDirection: 'row',
            width: 80,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: 30,
              height: 30,
              backgroundColor: '#ccc',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.goBack()}>
            <Icon1 name="left" color="black" size={20} />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'MontserratAlternates-SemiBold',
            color: darkmode ? 'white' : 'black',
            marginLeft: 20,
          }}>
          Edit Profile
        </Text>
        <TouchableOpacity
          onPress={() => {
            setShow(true);
            const data = new FormData();
            data.append('firstname', firstName);
            data.append('lastname', lastName);
            data.append('zipcode', zip);
            data.append('email', email);
            data.append('radius', miles);
            {
              image &&
                data.append('image', {
                  uri: image,
                  type: 'image/jpeg',
                  name: `image${new Date()}.jpg`,
                });
            }
            editProfile({Auth: userData.token}, data)
              .then(res => {
                console.log('res', res);
                setShow(false);
                if (res.status == 'success') {
                  navigation.goBack();
                  logged(res)(dispatch);
                }
              })
              .catch(err => {
                console.log('err', err.response.data);
                setShow(false);
              });
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#5F95F0',
            // marginTop: 30,
            width: 80,
            height: 40,
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 14,
              color: 'white',
              fontFamily: 'MontserratAlternates-SemiBold',
            }}>
            Save
          </Text>
        </TouchableOpacity>

        {/* <Icon
            name="log-out"
            color={'#5F95F0'}
            size={20}
            onPress={() => navigation.navigate('Login')}
          /> */}
      </View>
      <Wrapper behavior="padding" style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              paddingHorizontal: 15,
              // backgroundColor: 'red',
              marginTop: 30,
              flex: 1,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => picker()}
                style={{
                  // borderWidth: 1,
                  width: 105,
                  height: 105,
                  backgroundColor: '#5F95F0',

                  alignItems: 'center',
                  justifyContent: 'center',

                  borderRadius: 50,
                }}>
                <Image
                  // resizeMode="stretch"
                  source={
                    image
                      ? {uri: image}
                      : require('../../../assets/Images/girl.jpg')
                  }
                  style={{height: 100, width: 100, borderRadius: 50}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => picker()}
                style={{
                  height: 30,
                  width: 30,
                  backgroundColor: '#5F95F0',
                  borderRadius: 20,
                  bottom: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  right: 25,
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    height: 28,
                    width: 28,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {Platform.OS == 'ios' ? (
                    <IconIos name="pencil" size={20} color="grey" />
                  ) : (
                    <Iconpencil name="pencil" size={20} color="grey" />
                  )}
                </View>
              </TouchableOpacity>
              {/* {!image && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 30,
                    width: 30,
                    borderRadius: 20,
                    backgroundColor: 'white',
                    elevation: 3,
                    bottom: 15,
                    left: 20,
                  }}>
                  <Icon2 name="add-photo-alternate" size={20} color="#5F95F0" />
                </View>
              )} */}

              {/* <Text
              style={{
                fontSize: 16,
                color: 'black',
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Olivia Benson
            </Text>
            <Text>New York</Text> */}
              {/* <TouchableOpacity
              // onPress={() => console.log('abc')}
              style={{
                position: 'absolute',
                // backgroundColor: 'blue',
                width: '100%',
                alignItems: 'flex-end',
                height: 100,
              }}>
              <Text>Edit</Text>
            </TouchableOpacity> */}
            </View>
            <View style={{marginTop: 30}}>
              <Text
                style={{
                  fontSize: 12,
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                Full name
              </Text>
              <TextInput
                value={lastName}
                onChangeText={text => {
                  setLastName(text);
                  // setLastNameErr('');
                }}
                style={{
                  backgroundColor: '#ccc',
                  borderRadius: 10,
                  paddingLeft: 10,
                  marginTop: 10,
                  fontFamily: 'MontserratAlternates-Regular',
                  // borderBottomWidth: 1,
                  height: 50,
                  color: 'black',
                }}
              />
            </View>
            <View style={{marginTop: 30}}>
              <Text
                style={{
                  fontSize: 12,
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                Username
              </Text>
              <TextInput
                value={firstName}
                onChangeText={text => {
                  setFirstName(text);
                  // setFirstNameErr('');
                }}
                style={{
                  // borderBottomColor: 'grey',
                  backgroundColor: '#ccc',
                  borderRadius: 10,
                  paddingLeft: 10,
                  marginTop: 10,
                  fontFamily: 'MontserratAlternates-Regular',
                  // borderBottomWidth: 1,
                  height: 50,
                  color: 'black',
                }}
              />
            </View>
            <View style={{marginTop: 30}}>
              <Text
                style={{
                  fontSize: 12,
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                Email
              </Text>
              <TextInput
                editable={false}
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  // setEmailErr('');
                }}
                style={{
                  backgroundColor: '#ccc',
                  borderRadius: 10,
                  paddingLeft: 10,
                  marginTop: 10,
                  fontFamily: 'MontserratAlternates-Regular',
                  // borderBottomWidth: 1,
                  height: 50,
                  color: 'black',
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
                Zipcode
              </Text>
              <TextInput
                value={zip}
                onChangeText={text => {
                  setZip(text);
                  // setLastNameErr('');
                }}
                style={{
                  backgroundColor: '#ccc',
                  borderRadius: 10,
                  paddingLeft: 10,
                  marginTop: 10,
                  fontFamily: 'MontserratAlternates-Regular',
                  // borderBottomWidth: 1,
                  height: 50,
                  color: darkmode ? 'white' : 'black',
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
                Select radius
              </Text>
              <TouchableOpacity
                onPress={() => setShowModal(true)}
                style={{
                  height: 50,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // borderBottomWidth: 1,
                  alignItems: 'center',
                  // paddingHorizontal: 5,
                  backgroundColor: '#ccc',
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  marginTop: 10,
                  // borderBottomColor: 'grey',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'MontserratAlternates-Regular',
                  }}>
                  {miles} Miles
                </Text>
                <Icon1 name="down" color="black" size={15} />
              </TouchableOpacity>
            </View>

            <View style={{height: 50}} />
          </View>
        </ScrollView>
      </Wrapper>

      {/* <Text>abc</Text> */}
      {/* </ImageBackground> */}
      {myModal3()}
      {MyModal(show)}
    </SafeAreaView>
  );
};
export default EditProfile;
