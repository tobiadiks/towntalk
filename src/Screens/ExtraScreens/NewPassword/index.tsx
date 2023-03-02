import React, {useState} from 'react';

import {
  View,
  FlatList,
  TextInput,
  ScrollView,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  ImageBackground,
  Alert,
} from 'react-native';
import MyModal from '../../../Components/MyModal';
import {changePassword} from '../../../lib/api';
import {useSelector} from 'react-redux';
import Icon1 from 'react-native-vector-icons/AntDesign';
const NewPassword = ({navigation}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [oldPasswordErr, setOldPasswordErr] = useState('');
  const [newPasswordErr, setNewPasswordErr] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const {userData, darkmode} = useSelector(({USER}) => USER);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordErr, setConfirmPasswordErr] = useState('');
  // function isOverEighteen(year, month, day) {
  //   var now = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
  //   var dob = year * 10000 + month * 100 + day * 1; // Coerces strings to integers

  //   return now - dob > 180000;
  // }
  // console.log('abc', isOverEighteen(2012, 4, 5));
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
          backgroundColor: darkmode ? '#242527' : 'white',
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
          <TouchableOpacity
            style={{
              backgroundColor: '#ccc',
              borderRadius: 5,
              height: 30,
              width: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.goBack()}>
            <Icon1 name="arrowleft" color="black" size={20} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              marginLeft: 20,
              fontFamily: 'MontserratAlternates-SemiBold',
              color: darkmode ? 'white' : 'black',
            }}>
            Change Password
          </Text>
        </View>

        {/* <Icon
            name="log-out"
            color={'#5F95F0'}
            size={20}
            onPress={() => navigation.navigate('Login')}
          /> */}
      </View>
      <Wrapper behavior="padding" style={{flex: 1}}>
        <ScrollView>
          <View
            style={{
              paddingHorizontal: 15,
              // backgroundColor: 'red',
              marginTop: 30,
              flex: 1,
            }}>
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  //   borderWidth: 1,
                  //   width: 200,
                  //   height: 150,
                  //   borderColor: 'white',
                  borderRadius: 50,
                }}>
                <Image
                  resizeMode={'contain'}
                  // resizeMode="stretch"
                  source={require('../../../assets/Images/lock.png')}
                  style={{height: 100, width: 100}}
                />
              </View>
            </View>
            <View
              style={{
                marginTop: 80,
                padding: 5,
                backgroundColor: darkmode ? '#242527' : 'white',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                OLD PASSWORD
              </Text>
              <TextInput
                value={oldPassword}
                onChangeText={text => {
                  setOldPassword(text);
                  setOldPasswordErr('');
                }}
                secureTextEntry
                style={{
                  borderBottomColor: oldPasswordErr ? 'red' : 'grey',
                  borderBottomWidth: 1,
                  height: 50,
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-Regular',
                }}
              />
            </View>
            <View
              style={{
                marginTop: 30,
                padding: 5,
                backgroundColor: darkmode ? '#242527' : 'black',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                NEW PASSWORD
              </Text>
              <TextInput
                value={newPassword}
                onChangeText={text => {
                  setNewPassword(text);
                  setNewPasswordErr('');
                }}
                secureTextEntry
                style={{
                  borderBottomColor: newPasswordErr ? 'red' : 'grey',
                  fontFamily: 'MontserratAlternates-Regular',
                  borderBottomWidth: 1,
                  height: 50,
                  color: darkmode ? 'white' : 'black',
                }}
              />
            </View>
            <View
              style={{
                marginTop: 30,
                padding: 5,
                backgroundColor: darkmode ? '#242527' : 'white',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                CONFIRM NEWPASSWORD
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text);
                  setConfirmPasswordErr('');
                }}
                secureTextEntry
                style={{
                  borderBottomColor: confirmPasswordErr ? 'red' : 'grey',
                  fontFamily: 'MontserratAlternates-Regular',
                  borderBottomWidth: 1,
                  height: 50,
                  color: darkmode ? 'white' : 'black',
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                if (
                  oldPassword.length >= 8 &&
                  newPassword.length >= 8 &&
                  confirmPassword.length >= 8
                ) {
                  if (newPassword == confirmPassword) {
                    setShowModal(true);
                    changePassword({
                      Auth: userData.token,
                      old_password: oldPassword,
                      password: newPassword,
                      password_confirmation: confirmPassword,
                    })
                      .then(res => {
                        console.log('res', res);
                        setShowModal(false);
                        if (res.status === 'success') {
                          navigation.goBack();
                        }
                      })
                      .catch(err => {
                        setShowModal(false);
                        console.log('err', err);
                      });
                  } else {
                    setNewPasswordErr('asd');
                    setConfirmPasswordErr('asd');
                  }
                } else if (!oldPassword && !newPassword && !confirmPassword) {
                  setNewPasswordErr('asd');
                  setOldPasswordErr('asd');
                  setConfirmPasswordErr('asd');
                } else if (!oldPassword) {
                  setOldPasswordErr('asd');
                } else if (!newPassword) {
                  setNewPasswordErr('asd');
                } else if (!confirmPassword) {
                  setConfirmPasswordErr('asd');
                } else if (oldPassword.length < 8) {
                  Alert.alert(
                    'Password lenght must be greater or equal to 8 characters',
                  );
                } else if (newPassword.length < 8) {
                  Alert.alert(
                    'Password lenght must be greater or equal to 8 characters',
                  );
                } else if (confirmPassword.length < 8) {
                  Alert.alert(
                    'Password lenght must be greater or equal to 8 characters',
                  );
                }
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#5F95F0',
                marginTop: 80,
                height: 50,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'white',
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                Update
              </Text>
            </TouchableOpacity>
            <View style={{height: 50}} />
          </View>
        </ScrollView>
      </Wrapper>

      {/* <Text>abc</Text> */}
      {/* </ImageBackground> */}
      {MyModal(showModal)}
    </SafeAreaView>
  );
};
export default NewPassword;
