import React, {useState} from 'react';
import {
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import MyModal from '../../../Components/MyModal';
import {resetPassword} from '../../../lib/api';
const Password = ({navigation, route}: {navigation: any; route: any}) => {
  const {darkmode} = useSelector(({USER}) => USER);
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordErr, setConfirmPasswordErr] = useState('');
  const [showModal, setShowModal] = useState(false);
  const {email, value} = route.params;
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
      {/* <ImageBackground
        style={{flex: 1}}
        source={require('../../../assets/Images/back.png')}> */}
      <View
        style={{
          height: 80,
          elevation: 3,
          backgroundColor: darkmode ? '#242527' : 'white',
          justifyContent: 'center',
          paddingLeft: 20,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ccc',
              borderRadius: 5,
              height: 30,
              width: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              name="left"
              size={20}
              color={'black'}
              onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 17,
              marginLeft: 20,
              color: darkmode ? 'white' : 'black',
              fontFamily: 'MontserratAlternates-SemiBold',
              // fontWeight: 'bold',
            }}>
            Forgot Password
          </Text>
        </View>
      </View>
      <View style={{marginTop: 30, paddingHorizontal: 15}}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: 'MontserratAlternates-Medium',
              color: darkmode ? 'white' : 'black',
            }}>
            Please enter your new password
          </Text>
          {/* <Text>We will send 4 digits code to your email.</Text> */}
        </View>
        <View style={{marginTop: 80}}>
          <Text
            style={{
              fontSize: 12,
              color: darkmode ? 'white' : 'black',
              fontFamily: 'MontserratAlternates-SemiBold',
            }}>
            NEW PASSWORD
          </Text>
          <TextInput
            value={password}
            secureTextEntry
            onChangeText={text => {
              setPassword(text);
              setPasswordErr('');
            }}
            style={{
              borderBottomColor: passwordErr ? 'red' : 'grey',
              borderBottomWidth: 1,
              color: darkmode ? 'white' : 'black',
              height: 50,
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
            CONFIRM PASSWORD
          </Text>
          <TextInput
            value={confirmPassword}
            secureTextEntry
            onChangeText={text => {
              setConfirmPassword(text);
              setConfirmPasswordErr('');
            }}
            style={{
              borderBottomColor: confirmPasswordErr ? 'red' : 'grey',
              borderBottomWidth: 1,
              color: darkmode ? 'white' : 'black',
              height: 50,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            if (password.length >= 8 && confirmPassword.length >= 8) {
              if (password == confirmPassword) {
                setShowModal(true);
                resetPassword({
                  password,
                  password_confirmation: confirmPassword,
                  email,
                  token: value,
                })
                  .then(res => {
                    console.log('res', res);
                    setShowModal(false);
                    if (res.status == 'success') {
                      navigation.navigate('Login');
                    }
                  })
                  .catch(err => {
                    setShowModal(false);
                    console.log('Error MEssage ', err.response.data);
                    console.log('esd', err);
                    // setCodeErr('err');
                  });
                //
              } else {
                setPasswordErr('asd');
                setConfirmPasswordErr('asd');
              }
            } else if (!password && !confirmPassword) {
              setPasswordErr('asd');
              setConfirmPasswordErr('asd');
            } else if (password.length < 8 && confirmPassword.length < 8) {
              Alert.alert('Password length must be greater or equal to 8');
            } else if (!password) {
              setPasswordErr('asd');
            } else if (!confirmPassword) {
              setConfirmPasswordErr('asd');
            } else if (password != confirmPassword) {
              setPasswordErr('asd');
              setConfirmPasswordErr('asd');
            }
          }}
          style={{
            backgroundColor: '#5F95F0',
            alignItems: 'center',
            height: 50,
            borderRadius: 10,
            marginTop: 80,
            elevation: 3,
            justifyContent: 'center',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 16, color: 'white'}}>
            Update
          </Text>
        </TouchableOpacity>
      </View>
      {/* </ImageBackground> */}
      {/* <Text>Email</Text> */}
      {MyModal(showModal)}
    </SafeAreaView>
  );
};
export default Password;
