import React, {useState, useEffect} from 'react';

import {
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import Axios from 'axios';
import LikeDislike from './LikeDislike';
import {config} from '../../config';
import {useSelector} from 'react-redux';
// import Comments from '../../../Components/Comments';
import Icon from 'react-native-vector-icons/Fontisto';
const Hotel = ({item, checkPlace, navigation}) => {
  const {darkmode} = useSelector(({USER}) => USER);
  return (
    <TouchableOpacity
      onPress={checkPlace}
      // onPress={() => navigation.navigate('RestaurantsDetail', {item})}
      style={{
        // height: 30,
        backgroundColor: darkmode ? '#242527' : 'white',
        marginRight: 10,
        elevation: 3,
        // alignItems: 'center',
        // justifyContent: 'center',
        // minWidth: 100,
        marginLeft: 3,
        marginVertical: 3,
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
      }}>
      <View
        style={{
          // marginTop: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          {/* <Image
            source={require('../assets/Images/girl.jpg')}
            style={{width: 50, height: 50, borderRadius: 50}}
          /> */}
          <View
            style={{
              marginLeft: 0,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}></View>
        </View>
        {/* <Icon name="dots-three-horizontal" size={20} /> */}
      </View>
      <View
        style={{
          marginTop: 10,
          width: '100%',
          // flexDirection: 'row',
          alignItems: 'center',
          // backgroundColor: 'red',
          overflow: 'hidden',
        }}></View>
      <View style={{marginTop: 5}}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'MontserratAlternates-Medium',
            // marginTop: 5,
            color: darkmode ? 'white' : 'black',
          }}>
          {item?.opening_hours?.open_now ? 'Open Now' : 'Closed'}
        </Text>

        <Image
          resizeMode={'cover'}
          source={
            item?.photos
              ? {
                  uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${item?.photos[0]?.photo_reference}&key=${config}`,
                }
              : require('../assets/Images/imagePlaceholder.png')
          }
          style={{height: 150, borderRadius: 10, width: '100%', marginTop: 10}}
        />
        <View style={{width: '90%', marginTop: 10}}>
          <Text
            style={{
              fontFamily: 'MontserratAlternates-SemiBold',
              fontSize: 16,

              color: darkmode ? 'white' : 'black',
            }}>
            {item.name}
            {/* {item.vicinity} */}
          </Text>
        </View>
      </View>

      {/* <Text style={{color: '#5F95F0', fontWeight: 'bold'}}>#{item}</Text> */}
    </TouchableOpacity>
  );
};

export default Hotel;
