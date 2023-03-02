import React, {useState} from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {otp} from '../../../lib/api';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import MyModal from '../../../Components/MyModal';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
const Code = ({navigation, route}: {navigation: any; route: any}) => {
  const CELL_COUNT = 4;
  const {darkmode} = useSelector(({USER}) => USER);
  const [value, setValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  // console.log('route', route.params);
  const {email} = route.params;
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [codeErr, setCodeErr] = useState('');
  console.log('err', codeErr);
  //   const CELL_COUNT = 4;
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
          <Icon
            name="arrowleft"
            size={20}
            color={'black'}
            onPress={() => navigation.goBack()}
          />
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
      <View style={{marginTop: 100, paddingHorizontal: 15}}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: 'MontserratAlternates-Medium',
              color: darkmode ? 'white' : 'black',
            }}>
            Enter 4 digit code we've send on your email!
          </Text>
          {/* <Text>We will send 4 digits code to your email.</Text> */}
        </View>
        <CodeField
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={text => {
            setValue(text);
            codeErr && setCodeErr('');
          }}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[
                darkmode ? styles.cells : styles.cell,
                {
                  borderWidth: 1,
                  borderColor: codeErr ? 'red' : 'grey',
                },
                isFocused && styles.focusCell,
              ]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
        <TouchableOpacity
          onPress={() => {
            if (value.length == 4) {
              setShowModal(true);
              otp({email, token: value})
                .then(res => {
                  setShowModal(false);
                  console.log('res', res);
                  if (res.status == 'success') {
                    navigation.navigate('Password', {email, value});
                  }
                })
                .catch(err => {
                  setShowModal(false);
                  console.log('Error MEssage ', err.response.data);
                  console.log('esd', err);
                  setCodeErr('err');
                });
            } else {
              setCodeErr('asd');
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
            Verify
          </Text>
        </TouchableOpacity>
      </View>
      {/* </ImageBackground> */}
      {/* <Text>Email</Text> */}
      {MyModal(showModal)}
    </SafeAreaView>
  );
};
export default Code;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#FFECEA',
  },
  secondView: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'red',
    //   justifyContent:"center",
  },
  thirdView: {
    flex: 2,
    alignItems: 'center',
    //   justifyContent:"center",
  },
  bottom: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  image: {
    height: 120,
    width: 120,
    marginTop: 30,
  },
  red0: {color: '#FF4029', fontFamily: 'Nunito-Regular'},
  red: {color: '#FF4029', fontFamily: 'Nunito-Bold'},
  red1: {
    color: '#FF4029',
    marginTop: 5,
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
  },
  white: {color: 'white', fontSize: 18, fontFamily: 'Nunito-SemiBold'},
  login: {fontSize: 20, fontFamily: 'Nunito-Bold'},
  inputView: {
    backgroundColor: 'transparent',
    elevation: 4,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    width: '90%',
    marginTop: 20,
    borderRadius: 30,
  },
  placeholder: {
    marginLeft: 15,
    fontFamily: 'Nunito-Regular',
    color: 'grey',
    fontSize: 16,
    height: '100%',
  },
  forgot: {
    marginTop: 10,
    width: '90%',

    alignItems: 'flex-end',
  },
  loginButton: {
    height: 50,
    backgroundColor: '#FF4029',
    width: '90%',
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  signUpView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  modalView: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'flex-end',
  },
  forgotView: {
    backgroundColor: '#FFECEA',
    height: '55%',
    borderTopLeftRadius: 25,
    paddingHorizontal: 20,
    borderTopRightRadius: 25,
    width: '100%',
  },
  left: {marginLeft: 20, fontSize: 18, fontFamily: 'Nunito-Bold'},
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  normalText: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    // backgroundColor: 'red',
  },
  empty: {height: 10},
  enterMail: {
    flex: 1,
    marginTop: 20,
    // backgroundColor: 'blue',
    // justifyContent: 'center',
  },
  mail: {
    backgroundColor: '#FFECEA',
    elevation: 4,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    // marginTop: 10,
    // height: 50,
  },
  input: {
    paddingLeft: 15,
    color: 'black',
    fontSize: 16,
    height: 50,
    fontFamily: 'Nunito-Regular',
  },

  sendEmail: {
    height: 50,
    width: '100%',
    backgroundColor: '#FF4029',
    alignItems: 'center',
    // marginTop: 0,
    // marginBottom: 10,
    justifyContent: 'center',
    borderRadius: 30,
    position: 'absolute',
    bottom: 10,
  },
  sendEmail1: {
    height: 50,
    width: '100%',
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#FF4029',
    alignItems: 'center',
    marginLeft: 15,
    //   marginTop: hp(10),
    // marginBottom: 10,
    justifyContent: 'center',
    borderRadius: 30,
  },
  root: {flex: 1, padding: 0},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 0},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    // backgroundColor: 'red',
    marginHorizontal: 20,
    fontSize: 20,
    color: 'black',
    fontFamily: 'MontserratAlternates-Medium',
    marginTop: 80,
    borderColor: 'grey',
    borderWidth: 1,
    // borderColor: 'white',
    // backgroundColor: 'red',
    // elevation: 4,
    textAlign: 'center',
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.5,
    // shadowRadius: 2,
  },
  cells: {
    width: 40,
    height: 40,
    lineHeight: 38,
    // backgroundColor: 'red',
    marginHorizontal: 20,
    fontSize: 20,
    color: 'white',
    fontFamily: 'MontserratAlternates-Medium',
    marginTop: 80,
    borderColor: 'grey',
    borderWidth: 1,
    // borderColor: 'white',
    // backgroundColor: 'red',
    // elevation: 4,
    textAlign: 'center',
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.5,
    // shadowRadius: 2,
  },
  focusCell: {
    borderColor: 'grey',
  },
});
