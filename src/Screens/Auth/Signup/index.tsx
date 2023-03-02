import React, {useState, useEffect} from 'react';
import {
  View,
  ImageBackground,
  Image,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Text,
  // TouchableWithoutFeedback,
} from 'react-native';
// import { useState } from 'react';
import moment from 'moment';
import {register} from '../../../lib/api';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import {logged, iphoneEmail} from '../../../redux/actions';
import {validateEmail} from '../../../lib/functions';
import {useDispatch, useSelector} from 'react-redux';
// import {LoginButton, LoginManager, AccessToken} from 'react-native-fbsdk';
import MyModal from '../../../Components/MyModal';
import ImagePicker from 'react-native-image-crop-picker';
const Signup = ({navigation}: {navigation: any}) => {
  const dispatch = useDispatch();
  const {darkmode} = useSelector(({USER}) => USER);
  const [firstName, setFirstName] = useState('');
  const [image, setImage] = useState('');
  const [firstNameErr, setFirstNameErr] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameErr, setLastNameErr] = useState('');
  const [zip, setZip] = useState('');
  const [zipErr, setZipErr] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordConfirmErr, setPasswordConfirmErr] = useState('');
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  async function onAppleButtonPress() {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    console.log('res', appleAuthRequestResponse);
    console.log('email', appleAuthRequestResponse.email);
    console.log(
      'name',
      appleAuthRequestResponse.fullName.familyName +
        appleAuthRequestResponse.fullName.givenName,
    );
    appleAuthRequestResponse.email &&
      iphoneEmail(appleAuthRequestResponse.email)(dispatch);
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    console.log('Credentials', credentialState);
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      if (appleAuthRequestResponse.email) {
        setShowModal(true);
        var today = new Date();

        let vrifiddate = moment(today).format('YYYY-MM-DD hh:mm:ss');
        const data = new FormData();
        data.append(
          'firstname',
          appleAuthRequestResponse.fullName.familyName +
            appleAuthRequestResponse.fullName.givenName,
        );
        data.append('email', appleAuthRequestResponse.email);
        data.append('password', '12345678');
        data.append('password_confirmation', '12345678');
        data.append('email_verified_at', vrifiddate);
        // data.append('image', {
        //   uri: userInfo.user.photo,
        //   type: 'image/jpeg',
        //   name: `image${new Date()}.jpg`,
        // });

        register(data)
          .then(res => {
            console.log('res', res);

            setShowModal(false);
            if (res.status == 'success') {
              logged(res)(dispatch);
              // navigation.navigate('EmailVerification', {email});
            }
            // logged(res)(dispatch);
          })
          .catch(error => {
            console.log('err', error.response.data);
            setShowModal(false);
            // console.log('Error MEssage ', error.response.data);
            if (error.response.data.status == 'error') {
              if (error.response.data.message.email) {
                //   ToastAndroid.show(
                //     `${error.response.data.message.email}`,
                //     ToastAndroid.SHORT,
                //   );
                Alert.alert(`${error.response.data.message.email}`);
              }
              if (error.response.data.message.phoneno) {
                //   ToastAndroid.show(
                //     `${error.response.data.message.phoneno}`,
                //     ToastAndroid.SHORT,
                //   );
                Alert.alert(`${error.response.data.message.phoneno}`);
              }
              if (error.response.data.message.firstname) {
                //   ToastAndroid.show(
                //     `${error.response.data.message.phoneno}`,
                //     ToastAndroid.SHORT,
                //   );
                Alert.alert(
                  'The username has already been taken.',
                  // `${error.response.data.message.firstname}`,
                );
              }
            }
          });
      }
      //   // Alert.alert('hello', appleAuthRequestResponse.email);
      //   setloading(true);
      //   const data = new FormData();
      //   data.append('email', iEmail);
      //   data.append('password', '12345678');
      //   setloading(true);
      //   fetch('https://bicicita.com/app/api/login', {
      //     method: 'POST',
      //     body: data,
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   })
      //     .then((response) => response.json())
      //     .then((res) => {
      //       console.log('res', res);
      //       if (res.status == 'success') {
      //         ToggleLoginSignup(res)(dispatch);
      //         setloading(false);
      //         seterrortextwhole('');
      //       } else if (res.status == 'error') {
      //         setIsVerified(!res.is_verified);
      //         seterrortextwhole(res.message);
      //         setloading(false);
      //       }
      //     })
      //     .catch((error) => {
      //       setloading(false);
      //     })
      //     .finally(() => {
      //       setloading(false);
      //     });
      // } else {
      //   navigation.navigate('ProfileConfirmation', {
      //     userData: {
      //       email: iEmail ? iEmail : appleAuthRequestResponse.email,
      //       pass: '12345678',
      //       name: appleAuthRequestResponse.fullName.familyName,
      //     },
      //     social: true,
      //   });
      //   // if (!emailIsValid(email.replace(/\s/g, '')) && !pass) {
      //   //   setEmailErrortext('Email is required');
      //   //   setpasserrortext('password is required');
      //   //   return;
      //   // }
      //   // setloading(true);
      //   // if (!emailIsValid(email.replace(/\s/g, ''))) {
      //   //   setEmailErrortext('Enter Valid Email');
      //   //   setloading(false);
      //   //   return;
      //   // }
      //   // if (!pass) {
      //   //   setpasserrortext('Enter your password');
      //   //   setloading(false);
      //   //   return;
      //   // }
      // }
      // navigation.navigate('ProfileConfirmation', {
      //   userData: {
      //     email: iEmail ? iEmail : appleAuthRequestResponse.email,
      //     pass: '12345678',
      //     name: appleAuthRequestResponse.fullName.familyName,
      //   },
      //   social: true,
      // });
    }
  }
  const getInfoFromToken = token => {
    console.log('------------------');
    fetch(
      'https://graph.facebook.com/v2.5/me?fields=email,name,friends,picture&access_token=' +
        token,
    )
      .then(response => response.json())
      .then(json => {
        console.log('json', json);
        setShowModal(true);
        var today = new Date();

        let vrifiddate = moment(today).format('YYYY-MM-DD hh:mm:ss');
        const data = new FormData();
        data.append('firstname', json.name);
        data.append('email', json.email);
        data.append('password', json.id);
        data.append('password_confirmation', json.id);
        data.append('email_verified_at', vrifiddate);
        data.append('image', {
          uri: json.picture.data.url,
          type: 'image/jpeg',
          name: `image${new Date()}.jpg`,
        });

        register(data)
          .then(res => {
            console.log('res', res);

            setShowModal(false);
            if (res.status == 'success') {
              logged(res)(dispatch);
              // navigation.navigate('EmailVerification', {email});
            }
            // logged(res)(dispatch);
          })
          .catch(error => {
            console.log('err', error.response.data);
            setShowModal(false);
            // console.log('Error MEssage ', error.response.data);
            if (error.response.data.status == 'error') {
              if (error.response.data.message.email) {
                //   ToastAndroid.show(
                //     `${error.response.data.message.email}`,
                //     ToastAndroid.SHORT,
                //   );
                Alert.alert(`${error.response.data.message.email}`);
              }
              if (error.response.data.message.phoneno) {
                //   ToastAndroid.show(
                //     `${error.response.data.message.phoneno}`,
                //     ToastAndroid.SHORT,
                //   );
                Alert.alert(`${error.response.data.message.phoneno}`);
              }
              if (error.response.data.message.firstname) {
                //   ToastAndroid.show(
                //     `${error.response.data.message.phoneno}`,
                //     ToastAndroid.SHORT,
                //   );
                Alert.alert(
                  'The username has already been taken.',
                  // `${error.response.data.message.firstname}`,
                );
              }
            }
          });
      });
  };
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '663248566993-u3shjkc82qcp2h3jie63k1per56tbv4n.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }, []);
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setShowModal(true);
      var today = new Date();

      let vrifiddate = moment(today).format('YYYY-MM-DD hh:mm:ss');
      const data = new FormData();
      data.append('firstname', userInfo.user.name);
      data.append('email', userInfo.user.email);
      data.append('password', userInfo.user.id);
      data.append('password_confirmation', userInfo.user.id);
      data.append('email_verified_at', vrifiddate);
      data.append('image', {
        uri: userInfo.user.photo,
        type: 'image/jpeg',
        name: `image${new Date()}.jpg`,
      });

      register(data)
        .then(res => {
          console.log('res', res);

          setShowModal(false);
          if (res.status == 'success') {
            logged(res)(dispatch);
            // navigation.navigate('EmailVerification', {email});
          }
          // logged(res)(dispatch);
        })
        .catch(error => {
          console.log('err', error.response.data);
          setShowModal(false);
          // console.log('Error MEssage ', error.response.data);
          if (error.response.data.status == 'error') {
            if (error.response.data.message.email) {
              //   ToastAndroid.show(
              //     `${error.response.data.message.email}`,
              //     ToastAndroid.SHORT,
              //   );
              Alert.alert(`${error.response.data.message.email}`);
            }
            if (error.response.data.message.phoneno) {
              //   ToastAndroid.show(
              //     `${error.response.data.message.phoneno}`,
              //     ToastAndroid.SHORT,
              //   );
              Alert.alert(`${error.response.data.message.phoneno}`);
            }
            if (error.response.data.message.firstname) {
              //   ToastAndroid.show(
              //     `${error.response.data.message.phoneno}`,
              //     ToastAndroid.SHORT,
              //   );
              Alert.alert(
                'The username has already been taken.',
                // `${error.response.data.message.firstname}`,
              );
            }
          }
        });
      // console.log('userInfo', userInfo);
      // this.setState({userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  // const Faceboologin = async () => {
  //   LoginManager.logOut();
  //   LoginManager.setLoginBehavior('web_only');
  //   LoginManager.logInWithPermissions(['email', 'public_profile']).then(
  //     function (result) {
  //       if (result.isCancelled) {
  //         console.log('cancled');
  //       } else {
  //         AccessToken.getCurrentAccessToken().then(data => {
  //           console.log('userdata', data.permissions);
  //           // const {accessToken} = data;
  //           // initUser(accessToken);
  //           const accessToken = data.accessToken.toString();
  //           getInfoFromToken(accessToken);
  //         });
  //       }
  //     },

  //     function (error) {
  //       alert(error);
  //       console.log('error', error);
  //     },
  //   );
  // };
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
        source={require('../../../assets/Images/SignupBackground.png')}
        style={{flex: 1}}> */}
      {/* <Image
          source={require('../../../assets/Images/mainLogo.png')}
          style={{height: 200, marginLeft: 0, width: 200}}
        /> */}
      <Text
        style={{
          fontSize: 18,
          marginTop: 30,
          marginLeft: 20,
          color: darkmode ? 'white' : 'black',
          paddingBottom: 5,
          fontFamily: 'MontserratAlternates-SemiBold',
        }}>
        Sign Up
      </Text>
      {keyboardStatus == false && (
        <>
          <TouchableOpacity
            onPress={() => picker()}
            style={{
              marginTop: 40,
              alignItems: 'center',
              height: 100,
              // width: 100,
            }}>
            {/* <View style={{height: 100, width: 100, backgroundColor: 'red'}}> */}
            <Image
              resizeMode="cover"
              style={{height: 50, width: 50, borderRadius: 30}}
              source={
                image
                  ? {uri: image}
                  : require('../../../assets/Images/girl.jpg')
              }
              style={{height: 100, borderRadius: 60, width: 100}}
            />
            {/* </View> */}
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            {/* <Text
            style={{
              marginTop: 20,
              fontSize: 20,
              fontFamily: 'MontserratAlternates-SemiBold',
            }}>
            Hello!
          </Text> */}
            <Text
              style={{
                fontSize: 16,
                marginTop: 20,
                color: 'grey',
                paddingBottom: 5,
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Profile picture
            </Text>
          </View>
        </>
      )}

      <Wrapper behavior="padding" style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View style={{paddingHorizontal: 15}}>
            <View style={{marginTop: 30}}>
              <TextInput
                value={firstName}
                onBlur={() => {
                  firstName.length > 10 && setFirstNameErr('name limitation');
                  firstName.length < 4 && setFirstNameErr('name limitation');
                }}
                onChangeText={text => {
                  if (text.includes(' ')) {
                    setFirstName(text.trim());
                    setFirstNameErr('');
                  } else {
                    setFirstName(text);
                    setFirstNameErr('');
                  }
                }}
                style={{
                  borderColor: firstNameErr ? 'red' : 'grey',
                  borderWidth: 1,
                  height: 50,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-Regular',
                }}
                placeholderTextColor={'grey'}
                placeholder={'@Username'}
              />
            </View>
            <Text style={{marginTop: 10, fontSize: 12, color: 'grey'}}>
              Minumum 4 characters, Maximum 10 characters
            </Text>
            {/* <View style={{marginTop: 30}}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'MontserratAlternates-SemiBold',
                    color: 'black',
                  }}>
                  LAST NAME
                </Text>
                <TextInput
                  value={lastName}
                  onChangeText={text => {
                    setLastName(text);
                    setLastNameErr('');
                  }}
                  style={{
                    borderBottomColor: lastNameErr ? 'red' : 'grey',
                    borderBottomWidth: 1,
                    height: 50,
                    color: 'black',
                    fontFamily: 'MontserratAlternates-Regular',
                  }}
                />
              </View> */}
            <View style={{marginTop: 20}}>
              <TextInput
                value={email}
                autoCapitalize="none"
                placeholderTextColor={'grey'}
                placeholder={'Email Address'}
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
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-Regular',
                }}
              />
            </View>
            <View style={{marginTop: 30}}>
              <TextInput
                value={phone}
                // secureTextEntry
                placeholder="Phone"
                placeholderTextColor={'grey'}
                onChangeText={text => {
                  setPhone(text);
                  setPhoneErr('');
                }}
                style={{
                  borderColor: phoneErr ? 'red' : 'grey',
                  borderWidth: 1,
                  borderRadius: 10,
                  height: 50,
                  paddingHorizontal: 10,
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-Regular',
                }}
              />
            </View>

            <View style={{marginTop: 30}}>
              {/* <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'MontserratAlternates-SemiBold',
                  color: 'black',
                }}>
                PASSWORD
              </Text> */}
              <TextInput
                value={password}
                placeholderTextColor={'grey'}
                placeholder={'Password'}
                secureTextEntry
                onChangeText={text => {
                  setPassword(text);
                  setPasswordErr('');
                }}
                style={{
                  borderColor: passwordErr ? 'red' : 'grey',
                  borderWidth: 1,
                  height: 50,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-Regular',
                }}
              />
            </View>
            <View style={{marginTop: 30}}>
              <TextInput
                value={passwordConfirm}
                placeholderTextColor={'grey'}
                placeholder={'Confirm Password'}
                secureTextEntry
                onChangeText={text => {
                  setPasswordConfirm(text);
                  setPasswordConfirmErr('');
                }}
                style={{
                  borderColor: passwordConfirmErr ? 'red' : 'grey',
                  borderWidth: 1,
                  height: 50,
                  borderRadius: 10,
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-Regular',
                }}
              />
            </View>
            <View style={{marginTop: 30}}>
              <TextInput
                value={zip}
                onChangeText={text => {
                  setZip(text);
                  setZipErr('');
                }}
                style={{
                  borderColor: zipErr ? 'red' : 'grey',
                  borderWidth: 1,
                  height: 50,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-Regular',
                }}
                placeholderTextColor={'grey'}
                placeholder={'ZIP CODE'}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                if (
                  validateEmail(email) &&
                  password.length >= 8 &&
                  passwordConfirm.length >= 8 &&
                  firstName &&
                  zip &&
                  phone
                ) {
                  if (password == passwordConfirm) {
                    setShowModal(true);
                    // navigation.navigate('EmailVerification', {
                    //   firstName,
                    //   lastName,
                    //   zip,
                    //   email,
                    //   password,
                    //   phone,
                    //   image,
                    // });
                    const data = new FormData();
                    data.append('firstname', firstName);

                    data.append('zipcode', zip);
                    data.append('email', email);
                    // data.append('social', false);
                    data.append('password', password);
                    data.append('password_confirmation', passwordConfirm);
                    data.append('phoneno', phone);
                    {
                      image &&
                        data.append('image', {
                          uri: image,
                          type: 'image/jpeg',
                          name: `image${new Date()}.jpg`,
                        });
                    }
                    register(data)
                      .then(res => {
                        console.log('res', res);

                        setShowModal(false);
                        if (res.status == 'success') {
                          navigation.navigate('EmailVerification', {email});
                        }
                        // logged(res)(dispatch);
                      })
                      .catch(error => {
                        console.log('err', error.response.data);
                        setShowModal(false);
                        // console.log('Error MEssage ', error.response.data);
                        if (error.response.data.status == 'error') {
                          if (error.response.data.message.email) {
                            //   ToastAndroid.show(
                            //     `${error.response.data.message.email}`,
                            //     ToastAndroid.SHORT,
                            //   );
                            Alert.alert(`${error.response.data.message.email}`);
                          }
                          if (error.response.data.message.phoneno) {
                            //   ToastAndroid.show(
                            //     `${error.response.data.message.phoneno}`,
                            //     ToastAndroid.SHORT,
                            //   );
                            Alert.alert(
                              `${error.response.data.message.phoneno}`,
                            );
                          }
                          if (error.response.data.message.firstname) {
                            //   ToastAndroid.show(
                            //     `${error.response.data.message.phoneno}`,
                            //     ToastAndroid.SHORT,
                            //   );
                            Alert.alert(
                              'The username has already been taken.',
                              // `${error.response.data.message.firstname}`,
                            );
                          }
                        }
                      });
                  } else {
                    setPasswordErr('asd');
                    setPasswordConfirmErr('asd');
                  }

                  // navigation.navigate('TabNavigator');
                } else if (
                  !validateEmail(email) &&
                  !password &&
                  !passwordConfirm &&
                  !firstName &&
                  !zip &&
                  !phone
                ) {
                  setEmailErr('asd');
                  setPasswordErr('asd');
                  setPasswordConfirmErr('asd');
                  setFirstNameErr('asd');
                  // setLastNameErr('asd');
                  setZipErr('asd');
                  setPhoneErr('asd');
                } else if (!validateEmail(email)) {
                  setEmailErr('asd');
                } else if (!password) {
                  setPasswordErr('asd');
                } else if (!passwordConfirm) {
                  setPasswordConfirmErr('asd');
                } else if (password.length < 8) {
                  Alert.alert(
                    'Password length must be greater or equal to 8 characters',
                  );
                } else if (passwordConfirm.length < 8) {
                  Alert.alert(
                    'Password length must be greater or equal to 8 characters',
                  );
                } else if (password != passwordConfirm) {
                  setPasswordErr('asd');
                  setPasswordConfirmErr('asd');
                } else if (!firstName) {
                  setFirstNameErr('asd');
                } else if (!zip) {
                  setZipErr('asd');
                } else if (!phone) {
                  setPhoneErr('asd');
                }
              }}
              style={{
                backgroundColor: '#5F95F0',
                alignItems: 'center',
                height: 50,
                borderRadius: 10,
                marginTop: 40,
                elevation: 3,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-SemiBold',
                  fontSize: 16,
                  color: 'white',
                }}>
                Continue
              </Text>
            </TouchableOpacity>
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  // TODO: facebook login
                  // Facebooklogin();
                }}>
                <Image
                  source={require('../../../assets/Images/facebook.png')}
                  style={{height: 40, width: 40, marginRight: 10}}
                />
              </TouchableOpacity>

              <Image
                source={require('../../../assets/Images/twitter.png')}
                style={{height: 40, width: 40, marginRight: 10}}
              />
              <TouchableOpacity onPress={() => signIn()}>
                <Image
                  source={require('../../../assets/Images/google.png')}
                  style={{height: 40, width: 40, marginRight: 10}}
                />
              </TouchableOpacity>
              {/* available for only ios */}
              {Platform.OS == 'ios' && <TouchableOpacity
                onPress={() => Platform.OS == 'ios' && onAppleButtonPress()}>
                <Image
                  source={require('../../../assets/Images/apple.png')}
                  style={{height: 40, width: 40, marginRight: 10}}
                />
                </TouchableOpacity>
              }
            </View>

            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-Regular',
                  color: darkmode ? 'white' : 'black',
                }}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text
                  style={{
                    marginLeft: 7,
                    fontSize: 16,
                    fontFamily: 'MontserratAlternates-SemiBold',
                    color: darkmode ? 'white' : 'black',
                  }}>
                  Sign in!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Wrapper>
      {/* </ImageBackground> */}
      {MyModal(showModal)}
    </SafeAreaView>
  );
};
export default Signup;
