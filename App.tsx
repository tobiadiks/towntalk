import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
//  import android.os.Bundle;
import dynamicLinks from '@react-native-firebase/dynamic-links';
import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {Store, persistor} from './src/redux/store';
import {Provider} from 'react-redux';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';

import Root from './src/Navigator/Root';
const App = () => {
  const getNotifications = async () => {
    await messaging().onNotificationOpenedApp(remoteMessage => {
      // setBadge(0);
    });
    await messaging()
      .getInitialNotification()
      .then(remoteMessage => {});
  };

  const getToken = async () => {
    let fcmToken = await messaging().getToken();
    console.log('i got fcm', fcmToken);
    // if (fcmToken) {
    //   try {
    //     fcm(fcmToken)(dispatch);
    //   } catch (e) {
    //     'Error in dispatching fcm to redux', e;
    //   }
    // }
  };
  const _createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'fcm_fallback_notification_channel', // (required)
        channelName: 'fcm_fallback_notification_channel', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created => console.log('created channel', created),
    );
  };
  useEffect(() => {
    // console.log('called on every time app awake');
    getToken();
    getNotifications();
    Platform.OS == 'android' && _createChannel();
    const unsubscribe = messaging().onMessage(remoteMessage => {
      Platform.OS === 'ios' &&
        PushNotificationIOS.addNotificationRequest({
          id: new Date().toString(),
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          category: 'userAction',
          userInfo: remoteMessage.data,
        });
      // Platform.OS === 'ios' &&
      //   PushNotificationIOS.setApplicationIconBadgeNumber(1);
    });
    return unsubscribe;
  }, []);
  const handleDynamicLink = link => {
    // Alert.alert('hello');
    console.log('come here', link);
    // Handle dynamic link inside your own application
    // if (link.url === 'https://invertase.io/offer') {
    //   // ...navigate to your offers screen
    // }
  };
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        // const id_data = link.url.match(/[0-9]+/);
        // Alert.alert('hello');
        console.log('came here', link);
        //  navigate('Signup')
      })
      .catch(err => {
        console.log('error in dynamic link', err);
      });
  }, []);
  return (
    // <SafeAreaView style={{flex: 1}}>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <Root />
      </PersistGate>
    </Provider>
  );
};

export default App;
