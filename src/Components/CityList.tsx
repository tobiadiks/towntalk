import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Icon2 from 'react-native-vector-icons/Entypo';
import Geocoder from 'react-native-geocoding';
import {useSelector} from 'react-redux';
import {config} from '../../config';
const CityList = ({
  item,

  navigation,
}: {
  item: any;

  navigation: any;
}) => {
  //   console.log('item', item);
  const [address, setAddress] = useState('');
  const {darkmode} = useSelector(({USER}) => USER);
  const handleCitySearch = (city: String) => {
    Geocoder.from(city)
      .then(json => {
        console.log('lat', JSON.stringify(json));
        var location = json.results[0].formatted_address;
        setAddress(location);
        // handleRestaurantSearch(location.lat, location.lng);
      })
      .catch(error => console.warn(error));
  };
  useEffect(() => {
    Geocoder.init(config);
    handleCitySearch(item.name);
  }, []);
  return (
    // <View></View>
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ResturantsNearby', {
          sel: item.category,
          city: item.name,
        })
      }
      style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
      <Icon2 name="location-pin" size={30} color={'#5F95F0'} />
      <View style={{marginLeft: 10}}>
        <Text
          style={{
            fontFamily: 'MontserratAlternates-SemiBold',
            color: darkmode ? 'white' : 'black',
          }}>
          {item.name}
        </Text>
        <Text style={{fontSize: 10, color: 'grey'}}>{address}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default CityList;
