import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Linking,
  ImageBackground,
  Share,
  StatusBar,
  Alert,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {logoutuser, darkMode} from '../../../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import {deleteAccount} from '../../../lib/api';
import SwitchWithIcons from 'react-native-switch-with-icons';
// import CheckBox from 'react-native-check-box';
import ToggleSwitch from 'toggle-switch-react-native';
import Icons from 'react-native-vector-icons/AntDesign';
const Setting = ({navigation}) => {
  const {userData, darkmode} = useSelector(({USER}) => USER);
  const dispatch = useDispatch();
  const [check, setCheck] = useState(darkmode);

  console.log('darkmode', darkmode);
  const moon = require('../../../assets/Images/moon.png');
  const sun = require('../../../assets/Images/sunFull.png');
  const settings = [
    {
      id: 1,
      name: 'Blocked Users',
      description: 'Manage people blocked',
      click: () => navigation.navigate('BlockedUser'),
      image: require('../../../assets/Images/blocked.png'),
    },
    {
      id: 2,
      name: 'Push Notifications',
      description: 'Manage notifications preference',
      click: () => navigation.navigate('Notification'),
      image: require('../../../assets/Images/notification.png'),
    },
    {
      id: 3,
      name: 'Change password',
      description: 'Manage your account password',
      click: () => navigation.navigate('NewPassword'),
      image: require('../../../assets/Images/password.png'),
    },
    {
      id: 4,
      name: 'Privacy Policy',
      description: 'Read our privacy policy',
      click: () =>
        Linking.openURL(
          'https://app.termly.io/document/privacy-policy/72c48b63-dcc9-42ea-9088-7663a09410d7',
        ),
      image: require('../../../assets/Images/document.png'),
    },
    {
      id: 5,
      name: 'Terms of Service',
      description: 'Read our terms and conditions',
      click: () =>
        Linking.openURL(
          'https://app.termly.io/document/terms-of-use-for-website/337641ae-e6ce-4fed-8267-c8105baa3a0f',
        ),
      image: require('../../../assets/Images/document.png'),
    },
    {
      id: 6,
      name: 'EULA',
      description: 'Read End-User License Agreement',
      click: () =>
        Linking.openURL(
          'https://app.termly.io/document/eula/847f5351-bd4a-461e-a246-97743430a237',
        ),
      image: require('../../../assets/Images/document.png'),
    },
    {
      id: 7,
      name: 'Contact us',
      description: 'We will love to hear from you',
      click: () => navigation.navigate('ContactUs'),
      image: require('../../../assets/Images/contact.png'),
    },
    {
      id: 8,
      name: 'Delete account',
      description: 'You wont be able to recovered the account',
      click: () => {
        Alert.alert(
          'Delete account',
          'Are you sure you want to delete your account?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                deleteAccount({Auth: userData.token})
                  .then(res => {
                    // console.log('res of delte', res);
                  })
                  .catch(err => {
                    console.log('err', err.response.data);
                  });
                logoutuser(false)(dispatch);
              },
            },
          ],
        );
      },
      image: require('../../../assets/Images/delete.png'),
    },
    {
      id: 9,
      name: 'Logout',
      description: 'You will be missed',
      click: () =>
        Alert.alert('Logout', 'Are you sure you want to Logout?', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => logoutuser(false)(dispatch)},
        ]),
      image: require('../../../assets/Images/logout.png'),
    },
  ];
  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      onPress={() => item.click()}
      style={{
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingLeft: 15,
        paddingBottom: 20,
        alignItems: 'center',
        paddingTop: 20,
        borderBottomColor: '#ccc',
      }}>
      <Image
        source={item.image}
        style={{height: 20, width: 20}}
        resizeMode={'contain'}
      />
      <View style={{marginLeft: 10}}>
        <Text
          style={{
            fontSize: 16,
            color: darkmode ? 'white' : 'black',
            fontFamily: 'MontserratAlternates-SemiBold',
          }}>
          {item.name}
        </Text>
        <Text
          style={{
            marginTop: 10,
            color: 'grey',
            fontFamily: 'MontserratAlternates-Medium',
          }}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
  // console.log('county', Counties.Alabama[1]);
  // const onShare = async () => {
  //   try {
  //     const result = await Share.share({
  //       message:
  //         'React Native | A framework for building native apps using React',
  //     });
  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         // shared with activity type of result.activityType
  //       } else {
  //         // shared
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       // dismissed
  //     }
  //   } catch (error) {
  //     Alert.alert(error.message);
  //   }
  // };
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ccc',
              height: 30,
              width: 30,
              alignItems: 'center',
              borderRadius: 5,
              justifyContent: 'center',
            }}
            onPress={() => navigation.goBack()}>
            <Icons name="arrowleft" size={20} color={'black'} />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'MontserratAlternates-SemiBold',
            color: darkmode ? 'white' : 'black',
            marginLeft: 20,
          }}>
          Settings
        </Text>
        <SwitchWithIcons
          value={check}
          // noIcon={true}
          icon={{
            true:
              // <Icon name="moon" />
              moon,
            false:
              // <Icon name="moon" />
              sun,
          }}
          onValueChange={
            value => {
              setCheck(!check);
              darkMode()(dispatch);
              darkmode
                ? StatusBar.setBarStyle('dark-content', true)
                : StatusBar.setBarStyle('light-content', true);
            }
            // console.log(`Value has been updated to ${value}`)
          }
        />
      </View>
      {/* <TouchableOpacity
        style={{height: 50, backgroundColor: 'red'}}
        onPress={onShare}></TouchableOpacity> */}
      <FlatList
        data={settings}
        renderItem={renderItem}
        keyExtractor={item => item.id + 'a'}
      />
    </SafeAreaView>
  );
};
export default Setting;
