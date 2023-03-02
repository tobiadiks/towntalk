import React, {useEffect} from 'react';

import {View, Image, ImageBackground, Text} from 'react-native';

const Splash = ({navigation}: {navigation: any}) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTimeout(function () {
        navigation.navigate('Login');
      }, 3000);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  return (
    <View style={{flex: 1, backgroundColor: '#5F95F0'}}>
      <ImageBackground
        style={{flex: 1, justifyContent: 'flex-end'}}
        source={require('../../../assets/Images/updatedLogo.png')}></ImageBackground>
      {/* <ImageBackground
        style={{flex: 1, justifyContent: 'flex-end'}}
        source={require('../../../assets/Images/LogoEdit.png')}>
        <View
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../../../assets/Images/LogoStar.png')}
            style={{height: 200, width: 200}}
          />
        </View>
        <View style={{height: '28%', width: '100%'}}>
          <Image
            resizeMode="contain"
            source={require('../../../assets/Images/girlSitting.png')}
            style={{width: '100%', height: '100%'}}
          />
        </View>
      </ImageBackground> */}
    </View>
  );
};
export default Splash;
