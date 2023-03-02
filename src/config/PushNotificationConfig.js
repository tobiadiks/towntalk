import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import * as RootNavigation from './NavigationService';
import {Alert} from 'react-native';

const PushNotificationsConfigs = {
  configurations: () => {
    PushNotification.configure({
      onNotification: notification => {
        console.log('Notification entered my app', notification);
        // console.log(
        //   'called on notification',
        //   JSON.parse(notification.data.item),
        // );
        // console.log()
        // PushNotificationIOS.setApplicationIconBadgeNumber(2);
        // Platform.OS === 'ios' &&
        //   PushNotificationIOS.setApplicationIconBadgeNumber(8);
        const clicked = notification.userInteraction;
        if (clicked) {
          // RootNavigation.navigate('Notifications');
          console.log('clicked on notification', notification);
          if (notification.data.type === 'post_like') {
            // Alert.alert('post like clicked');
            RootNavigation.navigateWithParam('PostDetails', {
              item: JSON.parse(notification.data.post_data),
            });
          } else if (notification.data.type === 'post_dislike') {
            RootNavigation.navigateWithParam('PostDetails', {
              item: JSON.parse(notification.data.post_data),
            });
          } else if (notification.data.type === 'profile_dislike') {
            RootNavigation.navigateWithParam('TabNavigator', {
              screen: 'Profile',
            });
          } else if (notification.data.type === 'profile_like') {
            RootNavigation.navigateWithParam('TabNavigator', {
              screen: 'Profile',
            });
          } else if (notification.data.type === 'post_comment') {
            const {id} = JSON.parse(notification.data.post_data);
            RootNavigation.navigateWithParam('Comments', {id});
          } else if (notification.data.type === 'message') {
            console.log('guest data', JSON.parse(notification.data.guestData));
            RootNavigation.navigateWithParam('SingleChat', {
              item: JSON.parse(notification.data.guestData),
              fcm_token: notification.data.fcm_token,
            });
          }
          // console.log('called on notification3', notification.data.fcm_token);
          // RootNavigation.navigate1('Chat', {
          //   item: JSON.parse(notification.data.item),
          //   fcm_token: notification.data.fcm_token,
          // });
        }
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      onRegistrationError: err => {},
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: false,
    });
  },
};
export default PushNotificationsConfigs;
