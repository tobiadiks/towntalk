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
import {useDispatch, useSelector} from 'react-redux';
import MyModal from '../../../Components/MyModal';
// import { useSelector } from 'react-redux';
// import {LoginButton, LoginManager, AccessToken} from 'react-native-fbsdk';
import {logged} from '../../../redux/actions';
const Login = ({navigation}: {navigation: any}) => {
  const {darkmode} = useSelector(({USER}) => USER);
  console.log('darkmode', darkmode);
  const [email, setEmail] = useState('');
  const {iEmail} = useSelector(({USER}) => USER);
  const [emailErr, setEmailErr] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [show, setShow] = useState(false);
  const [phoneErr, setPhoneErr] = useState('');
  const [passwrodErr, setPasswordErr] = useState('');
  const [category, setCategory] = useState('Email');
  const [showModal, setShowModal] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const getInfoFromToken = token => {
    // console.log('------------------');
    fetch(
      'https://graph.facebook.com/v2.5/me?fields=email,name,friends,picture&access_token=' +
        token,
    )
      .then(response => response.json())
      .then(json => {
        setShowModal(true);
        login({email: json.email, password: json.id})
          .then(res => {
            console.log('res', res);
            setShowModal(false);
            if (res.status == 'success') {
              console.log('res', res);
              logged(res)(dispatch);
            }
          })
          .catch(error => {
            console.log('err', error.response.data);
            // Alert.alert("Credentials doesn't matched");
            setShowModal(false);
            if (error.response.data.status == 'error') {
              if (error.response.data.is_verified == false) {
                navigation.navigate('EmailVerification', {
                  email,
                });
                //   ToastAndroid.show(
                //     `${error.response.data.message.email}`,
                //     ToastAndroid.SHORT,
                //   );
                // Alert.alert(
                //   `${error.response.data.message.email}`,
                // );
              } else if (
                error.response.data.message == 'Invalid Username or Password'
              ) {
                //   ToastAndroid.show(
                //     `${error.response.data.message.phoneno}`,
                //     ToastAndroid.SHORT,
                //   );
                Alert.alert(`${error.response.data.message}`);
              } else if (error.response.data.message == 'User not Found') {
                Alert.alert(`${error.response.data.message}`);
              }
            }
          });
      });
    // .then(json => {
    //   // setloding(true);
    //   const data = new FormData();
    //   data.append('email', json.email);
    //   data.append('password', json.id);
    //   // data.append('social', 'true');
    //   login({
    //     typ: use == 'stu' ? 'student' : 'teacher',
    //     data: data,
    //   })
    //     .then(res => {
    //       console.log('---------', res);

    //       if (res.status == 'success') {
    //         setloding(false);
    //         userAuthorize(res)(dispatch);
    //         // navigation.navigate(use == 'stu' ? 'StudentTab' : 'TeacherTab');
    //       } else {
    //         setloding(false);
    //         console.log('Some Thing Wrong');
    //       }
    //     })
    //     .catch(error => {
    //       // setloding(false);
    //       // console.log('Message Error', error?.response?.data);
    //       // seterr(error?.response?.data?.message);

    //       if (error.response.data.status == 'error') {
    //         var today = new Date();
    //         var dd = String(today.getDate()).padStart(2, '0');
    //         var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    //         var yyyy = today.getFullYear();

    //         let vrifiddate = yyyy + '-' + mm + '-' + dd;

    //         const data = new FormData();
    //         data.append(
    //           'first_name',
    //           json.name
    //             .split(' ')[0]
    //             .replace(/^./, json.name.split(' ')[0][0].toUpperCase()),
    //         );
    //         data.append('email', json.email);
    //         data.append('last_name', json.name.split(' ')[1]);
    //         // data.append('name', json.name);
    //         // data.append('email', json.email);
    //         data.append('password', json.id);
    //         data.append('password_confirmation', json.id);
    //         data.append('email_verified_at', vrifiddate);
    //         // data.append('type', type);
    //         if (json.picture.data.url) {
    //           json.picture.data.url &&
    //             data.append('image', {
    //               uri: json.picture.data.url,
    //               type: 'image/jpeg',
    //               name: 'image' + new Date() + '.jpg',
    //             });
    //           console.log('data,,,,,', data);
    //         }
    //         CompleteProfile({
    //           typ: use == 'stu' ? 'student' : 'teacher',
    //           data: data,
    //         })
    //           .then(res => {
    //             console.log('-----', res);
    //             if (res.status == 'success') {
    //               setloding(false);
    //               userAuthorize(res)(dispatch);
    //               // navigation.navigate(use == 'stu' ? 'StudentTab' : 'Verificatiion');
    //             } else {
    //               setloding(false);
    //               console.log('Some Thing Wrong');
    //             }
    //           })
    //           .catch(error => {
    //             setloding(false);
    //             console.log('Message Error------1', error);
    //             console.log('Message Error------2', error.response.message);
    //             console.log('Message Error------3', error.data);
    //             console.log('Message Error------4', error.response.data);
    //             console.log('Message Error------5', error.message);

    //             if (error?.response?.data?.message?.email) {
    //               alert(error?.response?.data?.message?.email);
    //             } else {
    //               setloding(false);
    //               console.log('Error Meaasge sign up', error.response.data);
    //             }
    //           });
    //       } else {
    //         // setloding(false);
    //         console.log('Message Error', error);
    //         // seterr('Some thing Wrong');
    //       }
    //     });
    // })
    // .catch(error => {
    //   // setloding(false);
    //   Alert.alert(error);
    // });
  };
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
    // appleAuthRequestResponse.email &&
    // iphoneEmail(appleAuthRequestResponse.email)(dispatch);
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    console.log('Credentials', credentialState);
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      if (!appleAuthRequestResponse.email && iEmail) {
        setShowModal(true);
        login({email: iEmail, password: '12345678'})
          .then(res => {
            console.log('res', res);
            setShowModal(false);
            if (res.status == 'success') {
              console.log('res', res);
              logged(res)(dispatch);
            }
          })
          .catch(error => {
            console.log('err', error.response.data);
            // Alert.alert("Credentials doesn't matched");
            setShowModal(false);
            if (error.response.data.status == 'error') {
              if (error.response.data.is_verified == false) {
                navigation.navigate('EmailVerification', {
                  email,
                });
                //   ToastAndroid.show(
                //     `${error.response.data.message.email}`,
                //     ToastAndroid.SHORT,
                //   );
                // Alert.alert(
                //   `${error.response.data.message.email}`,
                // );
              } else if (
                error.response.data.message == 'Invalid Username or Password'
              ) {
                //   ToastAndroid.show(
                //     `${error.response.data.message.phoneno}`,
                //     ToastAndroid.SHORT,
                //   );
                Alert.alert(`${error.response.data.message}`);
              } else if (error.response.data.message == 'User not Found') {
                Alert.alert(`${error.response.data.message}`);
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
  const Faceboologin = async () => {
    LoginManager.logOut();
    LoginManager.setLoginBehavior('web_only');
    LoginManager.logInWithPermissions(['email', 'public_profile']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('cancled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            console.log('userdata', data.permissions);
            // const {accessToken} = data;
            // initUser(accessToken);
            const accessToken = data.accessToken.toString();
            getInfoFromToken(accessToken);
          });
        }
      },

      function (error) {
        alert(error);
        console.log('error', error);
      },
    );
  };
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // console.log('userInfo', userInfo);
      setShowModal(true);
      login({
        email: userInfo.user.email,

        password: userInfo.user.id,
      })
        .then(res => {
          console.log('res', res);
          setShowModal(false);
          if (res.status == 'success') {
            console.log('res', res);
            logged(res)(dispatch);
          }
        })
        .catch(error => {
          console.log('err', error.response.data);
          // Alert.alert("Credentials doesn't matched");
          setShowModal(false);
          if (error.response.data.status == 'error') {
            if (error.response.data.is_verified == false) {
              navigation.navigate('EmailVerification', {
                email,
              });
              //   ToastAndroid.show(
              //     `${error.response.data.message.email}`,
              //     ToastAndroid.SHORT,
              //   );
              // Alert.alert(
              //   `${error.response.data.message.email}`,
              // );
            } else if (
              error.response.data.message == 'Invalid Username or Password'
            ) {
              //   ToastAndroid.show(
              //     `${error.response.data.message.phoneno}`,
              //     ToastAndroid.SHORT,
              //   );
              Alert.alert(`${error.response.data.message}`);
            } else if (error.response.data.message == 'User not Found') {
              Alert.alert(`${error.response.data.message}`);
            }
          }
        });
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
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '663248566993-u3shjkc82qcp2h3jie63k1per56tbv4n.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }, []);
  const dispatch = useDispatch();
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
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
                color: darkmode ? 'white' : 'black',
                marginTop: 40,
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Login with your email
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
          {category == 'Email' ? (
            <>
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
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={'grey'}
                  placeholder={'Email'}
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
                {/* <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    fontFamily: 'MontserratAlternates-SemiBold',
                  }}>
                  PASSWORD
                </Text> */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: passwrodErr ? 'red' : 'grey',
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    value={password}
                    placeholderTextColor={'grey'}
                    placeholder={'Password'}
                    onChangeText={text => {
                      setPassword(text);
                      setPasswordErr('');
                    }}
                    secureTextEntry={show ? false : true}
                    style={{
                      // backgroundColor: 'red',
                      width: '85%',
                      height: 50,
                      paddingHorizontal: 10,
                      color: darkmode ? 'white' : 'black',
                      // borderBottomColor: passwrodErr ? 'red' : 'grey',
                      // borderBottomWidth: 1,
                      fontFamily: 'MontserratAlternates-Regular',
                    }}
                  />
                  <TouchableOpacity onPress={() => setShow(!show)}>
                    <Text
                      style={{
                        fontFamily: 'MontserratAlternates-Regular',
                        fontSize: 10,
                        marginRight: 10,
                      }}>
                      {password ? (show ? 'Hide' : 'Show') : null}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* <TextInput
                    value={password}
                    onChangeText={text => {
                      setPassword(text);
                      setPasswordErr('');
                    }}
                    secureTextEntry
                    style={{
                      borderBottomColor: passwrodErr ? 'red' : 'grey',
                      borderBottomWidth: 1,
                      fontFamily: 'MontserratAlternates-Regular',
                    }}
                  /> */}
              </View>
              <View style={{marginTop: 5, alignItems: 'flex-end'}}>
                <TouchableOpacity onPress={() => navigation.navigate('Email')}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: darkmode ? 'white' : 'black',
                      fontFamily: 'MontserratAlternates-Medium',
                    }}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (validateEmail(email) && password) {
                    setShowModal(true);
                    login({email, password})
                      .then(res => {
                        console.log('res', res);
                        setShowModal(false);
                        if (res.status == 'success') {
                          console.log('res', res);
                          logged(res)(dispatch);
                        }
                      })
                      .catch(error => {
                        console.log('err', error.response.data);
                        // Alert.alert("Credentials doesn't matched");
                        setShowModal(false);
                        if (error.response.data.status == 'error') {
                          if (error.response.data.is_verified == false) {
                            navigation.navigate('EmailVerification', {
                              email,
                            });
                            //   ToastAndroid.show(
                            //     `${error.response.data.message.email}`,
                            //     ToastAndroid.SHORT,
                            //   );
                            // Alert.alert(
                            //   `${error.response.data.message.email}`,
                            // );
                          } else if (
                            error.response.data.message ==
                            'Invalid Username or Password'
                          ) {
                            //   ToastAndroid.show(
                            //     `${error.response.data.message.phoneno}`,
                            //     ToastAndroid.SHORT,
                            //   );
                            Alert.alert(`${error.response.data.message}`);
                          } else if (
                            error.response.data.message == 'User not Found'
                          ) {
                            Alert.alert(`${error.response.data.message}`);
                          }
                        }
                      });

                    // navigation.navigate('TabNavigator');
                  } else if (!validateEmail(email) && !password) {
                    setEmailErr('asd');
                    setPasswordErr('asd');
                  } else if (!validateEmail(email)) {
                    setEmailErr('asd');
                  } else if (!password) {
                    setPasswordErr('asd');
                  }
                }}
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
              {/* <TouchableOpacity onPress={() => navigation.navigate('phoneNo')}>
                <Text
                  style={{
                    fontFamily: 'MontserratAlternates-Regular',
                    color: darkmode ? 'white' : 'black',
                    alignSelf: 'center',
                    marginTop: 10,
                  }}>
                  Login With Phone
                </Text>
              </TouchableOpacity> */}

              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
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
                  onPress={() =>
                    Platform.OS == 'ios' && iEmail && onAppleButtonPress()
                  }>
                  <Image
                    source={require('../../../assets/Images/apple.png')}
                    style={{height: 40, width: 40, marginRight: 10}}
                  />
                  </TouchableOpacity>
                }
              </View>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'MontserratAlternates-Regular',
                    color: darkmode ? 'white' : 'black',
                  }}>
                  Don't have an account?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text
                    style={{
                      marginLeft: 7,
                      fontSize: 16,
                      fontFamily: 'MontserratAlternates-SemiBold',
                      color: darkmode ? 'white' : 'black',
                    }}>
                    Sign Up!
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={{marginTop: 30}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: darkmode ? 'white' : 'black',
                    fontFamily: 'MontserratAlternates-SemiBold',
                  }}>
                  PHONE NO
                </Text>
                <TextInput
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={text => {
                    setPhone(text);
                    setPhoneErr('');
                  }}
                  style={{
                    borderBottomColor: phoneErr ? 'red' : 'grey',
                    borderBottomWidth: 1,
                    height: 50,
                    color: 'grey',
                    fontFamily: 'MontserratAlternates-Regular',
                  }}
                />
              </View>
              {/* <View style={{marginTop: 30}}>
                  <Text style={{fontSize: 12}}>PASSWORD</Text>
                  <TextInput
                    value={password}
                    onChangeText={text => {
                      setPassword(text);
                      setPasswordErr('');
                    }}
                    secureTextEntry
                    style={{
                      borderBottomColor: passwrodErr ? 'red' : 'grey',
                      borderBottomWidth: 1,
                    }}
                  />
                </View> */}
              {/* <View style={{marginTop: 5, alignItems: 'flex-end'}}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Email')}>
                    <Text style={{fontSize: 12}}>Forgot Password</Text>
                  </TouchableOpacity>
                </View> */}
              <TouchableOpacity
                onPress={() => {
                  setShowModal(true);
                  if (phone) {
                    login({phoneno: phone})
                      .then(res => {
                        console.log('res', res);
                        setShowModal(false);
                        if (res.status == 'success') {
                          // logged(res)(dispatch);
                          navigation.navigate('CodePhone', {phone});
                        }
                      })
                      .catch(err => {
                        console.log('err', err);
                        // Alert.alert("Credentials doesn't matched");
                        setShowModal(false);
                        console.log('Error MEssage ', err.response.data);
                        if (err.response.data.status == 'error') {
                          Alert.alert(`${err.response.data.message}`);
                        }
                      });
                    //
                  } else {
                    setPhoneErr('asd');
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
                <Text
                  style={{
                    fontFamily: 'MontserratAlternates-SemiBold',
                    fontSize: 16,
                    color: 'white',
                  }}>
                  Verify
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'MontserratAlternates-Regular',
                    color: 'black',
                  }}>
                  New to Town Talk?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text
                    style={{
                      marginLeft: 7,
                      fontSize: 16,
                      fontFamily: 'MontserratAlternates-SemiBold',
                      color: '#5F95F0',
                    }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        {/* </ScrollView> */}
      </View>
      {/* </ImageBackground> */}
      {MyModal(showModal)}
    </SafeAreaView>
  );
};
export default Login;
