import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  ImageBackground,
  TextInput,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Keyboard,
  Alert,
  ScrollView,
} from 'react-native';
import {login} from '../../../lib/api';
import {validateEmail} from '../../../lib/functions';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import {useDispatch} from 'react-redux';
import MyModal from '../../../Components/MyModal';
import {LoginButton, LoginManager, AccessToken} from 'react-native-fbsdk';
import {logged} from '../../../redux/actions';
const phoneNo = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <ImageBackground
        source={require('../../../assets/Images/SignupBackground.png')}
        style={{flex: 1}}> */}
      <View style={{paddingHorizontal: 15, flex: 1}}>
        {/* <ScrollView> */}
        {keyboardStatus == false && (
          <View
            style={{
              flex: 0.5,
              justifyContent: 'center',
              // backgroundColor: 'red',
              //   zIndex: 3,
              alignItems: 'center',
            }}>
            {/* <View
              style={{
                position: 'absolute',
                zIndex: 3,
                // elevation: 1,
                height: 200,
                width: 200,

                backgroundColor: 'transparent',
              }}> */}
            {/* <Image
              resizeMode="contain"
              source={require('../../../assets/Images/logoback.png')}
              style={{height: 100, width: 100}}
            /> */}
            {/* </View> */}
            {/* <Text
              style={{
                fontSize: 20,
                marginTop: 20,
                color
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Hello again.
            </Text> */}
            <Text
              style={{
                fontSize: 16,
                color: 'grey',
                marginTop: 40,
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Welcome Back!
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: 'black',
                marginTop: 40,
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Login With Your Phone
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',

                justifyContent: 'center',
                width: '80%',
                top: 20,
              }}>
              {/* <TouchableOpacity
                  onPress={() => setCategory('Email')}
                  style={{
                    borderBottomWidth: category == 'Email' ? 1 : 0,
                    borderBottomColor: 'grey',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: category == 'Email' ? 'black' : 'grey',
                      fontFamily:
                        category == 'Email'
                          ? 'MontserratAlternates-SemiBold'
                          : 'MontserratAlternates-Medium',
                    }}>
                    Email
                  </Text>
                </TouchableOpacity> */}
              {/* <TouchableOpacity
                  onPress={() => setCategory('Phone No')}
                  style={{
                    borderBottomWidth: category == 'Phone No' ? 1 : 0,
                    borderBottomColor: 'grey',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: category == 'Phone No' ? 'black' : 'grey',
                      fontFamily:
                        category == 'Phone No'
                          ? 'MontserratAlternates-SemiBold'
                          : 'MontserratAlternates-Medium',
                    }}>
                    Phone No
                  </Text>
                </TouchableOpacity> */}
            </View>
          </View>
        )}

        <View style={{flex: 2}}>
          <View style={{marginTop: 30}}>
            {/* <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    fontFamily: 'MontserratAlternates-SemiBold',
                  }}>
                  EMAIL ADDRESS
                </Text> */}
            <TextInput
              value={email}
              //   keyboardType="email-address"
              //   autoCapitalize="none"
              placeholderTextColor={'grey'}
              placeholder={'Phone No'}
              onChangeText={text => {
                setEmail(text);
                setEmailErr('');
              }}
              style={{
                borderColor: emailErr ? 'red' : 'grey',
                borderWidth: 1,
                height: 50,
                paddingHorizontal: 10,
                borderRadius: 10,
                color: 'black',
                fontFamily: 'MontserratAlternates-Regular',
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('CodePhone', {email})}
            style={{
              backgroundColor: '#5F95F0',
              alignItems: 'center',
              height: 50,
              borderRadius: 10,
              marginTop: 70,
              elevation: 3,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'MontserratAlternates-SemiBold',
                fontSize: 16,
                color: 'white',
              }}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                fontFamily: 'MontserratAlternates-Regular',
                color: 'black',
                alignSelf: 'center',
                marginTop: 10,
              }}>
              Login With Email
            </Text>
          </TouchableOpacity>
        </View>
        {/* </ScrollView> */}
      </View>
      {/* </ImageBackground> */}
      {/* {MyModal(showModal)} */}
    </SafeAreaView>
  );
};
export default phoneNo;
