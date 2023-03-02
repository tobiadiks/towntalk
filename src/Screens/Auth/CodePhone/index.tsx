import React, {useState} from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {logged} from '../../../redux/actions';
import MyModal from '../../../Components/MyModal';
import Icon from 'react-native-vector-icons/AntDesign';
import {verify} from '../../../lib/api';
const CodePhone = ({navigation, route}: {navigation: any; route: any}) => {
  const CELL_COUNT = 4;
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const {phone} = route.params;
  const [codeErr, setCodeErr] = useState('');
  const [show, setShow] = useState(false);

  //   const CELL_COUNT = 4;
  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        style={{flex: 1}}
        source={require('../../../assets/Images/back.png')}>
        <View
          style={{
            height: 58,
            elevation: 3,
            backgroundColor: 'white',
            justifyContent: 'center',
            paddingLeft: 20,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="left"
              size={20}
              color={'black'}
              onPress={() => navigation.goBack()}
            />
            <Text
              style={{
                fontSize: 17,
                marginLeft: 20,
                color: 'black',
                fontFamily: 'MontserratAlternates-SemiBold',
                // fontWeight: 'bold',
              }}>
              Enter 4 digit code
            </Text>
          </View>
        </View>
        <View style={{marginTop: 100, paddingHorizontal: 15}}>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'MontserratAlternates-Medium',
                color: 'black',
              }}>
              Enter 4 digit code we've send on your
            </Text>
            <Text
              style={{
                fontFamily: 'MontserratAlternates-Medium',
                color: 'black',
                fontSize: 12,
              }}>
              phone no!
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
                  styles.cell,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: codeErr ? 'red' : 'grey',
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
                setShow(true);
                verify({phoneno: phone, pin: value})
                  .then(res => {
                    console.log('res', res);
                    setShow(false);
                    if (res.status == 'success') {
                      logged(res)(dispatch);
                    }
                  })
                  .catch(err => {
                    setShow(false);
                    setCodeErr('asd');
                    console.log('err', err);
                  });
                // navigation.navigate('TabNavigator');
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
      </ImageBackground>
      {/* <Text>Email</Text> */}
      {MyModal(show)}
    </SafeAreaView>
  );
};
export default CodePhone;

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
    // borderWidth: 2,
    marginTop: 80,
    borderColor: 'grey',
    borderWidth: 1,
    // borderColor: 'white',
    backgroundColor: 'transparent',
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
