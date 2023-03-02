import React, {useState, useEffect} from 'react';

import {
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  PermissionsAndroid,
  Image,
  Platform,
  Dimensions,
  Alert,
  Text,
  ImageBackground,
  TextInput,
} from 'react-native';
import {config} from '../../../../config';
import Geolocation from 'react-native-geolocation-service';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Icon6 from 'react-native-vector-icons/Entypo';
import Hotel from '../../../Components/Hotel';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Icon4 from 'react-native-vector-icons/Fontisto';
import Icon7 from 'react-native-vector-icons/MaterialIcons';
import MyModal from '../../../Components/MyModal';
import {cityAdd} from '../../../redux/actions';
import {business_check} from '../../../lib/api';
const Search = ({navigation}) => {
  const [sel, setSel] = useState('All');
  const [city, setCity] = useState('');
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const {CityAdd, userData, darkmode} = useSelector(({USER}) => USER);
  console.log('cityadd', CityAdd);
  const check = place => {
    setShowModal(true);
    business_check({name: place.name, Auth: userData.token})
      .then(res => {
        setShowModal(false);
        if (res.status == 'success') {
          if (res.check) {
            navigation.navigate('RestaurantsDetailBackend', {id: place.name});
          } else {
            navigation.navigate('RestaurantsDetail', {item: place});
          }
        }
      })
      .catch(err => {
        setShowModal(false);
        console.log('err in check', err);
      });
  };
  const renderItem1 = ({item}: {item: any}) => (
    <Hotel item={item} navigation={navigation} checkPlace={() => check(item)} />
  );
  useEffect(() => {
    // handleAddress('solo');
    setShowModal(true);

    Platform.OS == 'ios'
      ? Geolocation.requestAuthorization('always').then(res => {
          cuRRentlocation();
          console.log('res', res);
        })
      : requestLocationPermission();
  }, [sel]);
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        cuRRentlocation();
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const cuRRentlocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        // setlatitude(position.coords.latitude);
        // setlongitude(position.coords.longitude);

        handleRestaurantSearch(
          position.coords.latitude,
          position.coords.longitude,
        );

        // getPlace(position.coords.latitude, position.coords.longitude);
        // getPlace('47.751076', '-120.740135');
        // console.log('users location', position.coords.longitude);

        // console.log('users location', position.coords.latitude);
      },
      error => {
        console.log('error in loc', error);
      },
      {
        enableHighAccuracy: true,
        // timeout: 15000,
        // maximumAge: 10000
      },
    );
  };
  const searchTextGiven = e => {
    let filteredName = [];
    // if (e) {
    filteredName = list.filter(item => {
      return item?.name?.toLowerCase().includes(`${e.toLowerCase()}`);
      // return item.vender.fullname.toLowerCase().includes(`${e.toLowerCase()}`);
    });
    setSearchList(filteredName);
    // filteredName = [];
    // }
  };
  const handleRestaurantSearch = (lat: Number, long: Number) => {
    // console.log('here');
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    const location = `location=${lat},${long}`;
    const radius = '&radius=2000';
    const type = `&keyword=${sel == 'All' ? '' : sel}`;

    // const type = `&keyword=${sel}`;
    const key = `&key=${config}`;
    const restaurantSearchUrl = url + location + radius + type + key;
    fetch(restaurantSearchUrl)
      .then(response => response.json())
      .then(result => {
        setList(result.results);
        setSearchList(result.results);
        setShowModal(false);
        console.log('results', result.results);
      })
      // .then(result => this.setState({restaurantList: result}))
      .catch(e => {
        console.log('err', e);
        setShowModal(false);
      });
  };
  const arr = [
    {
      name: 'All',
      image: null,
    },
    {
      name: 'Banks',
      image: <Icon1 name="bank" size={15} color={'#5F95F0'} />,
    },
    {
      name: 'Bars',
      image: <Icon7 name="sports-bar" size={15} color={'#5F95F0'} />,
    },
    {
      name: 'Clubs',
      image: <Icon6 name="sports-club" size={15} color={'#5F95F0'} />,
    },
    {
      name: 'Entertainment',
      image: <Icon3 name="tv" size={15} color={'#5F95F0'} />,
    },
    {
      name: 'Gas Stations',
      image: <Icon5 name="gas-pump" size={15} color={'#5F95F0'} />,
    },
    {
      name: 'Gyms',
      image: <Icon5 name="dumbbell" size={15} color={'#5F95F0'} />,
    },
    {
      name: 'Malls',
      image: <Icon7 name="local-mall" size={15} color={'#5F95F0'} />,
    },
    {
      name: 'Restaurants',
      image: <Icon3 name="restaurant" size={15} color={'#5F95F0'} />,
    },
    {
      name: 'Shopping',
      image: <Icon1 name="shopping-bag" size={15} color={'#5F95F0'} />,
    },

    {
      name: 'Supermarkets',
      image: <Icon4 name="shopping-store" size={15} color={'#5F95F0'} />,
    },
  ];
  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        setSel(item.name);
        setCity('');
      }}
      style={{
        height: 30,
        backgroundColor: sel == item.name ? '#5F95F0' : 'white',
        marginRight: 10,
        paddingHorizontal: 10,
        marginLeft: 3,
        marginVertical: 3,
        elevation: 3,
        flexDirection: 'row',
        // borderWidth: sel == item.name ? 1 : 0,
        // maxWidth: 150,
        // borderColor: '#5F95F0',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
        borderRadius: 50,
      }}>
      {item.image}
      {/* <Image source={require(`../../../assets/Images/${item.image}`)} /> */}
      <Text
        style={{
          color: sel == item.name ? 'white' : '#5F95F0',
          marginLeft: 5,
          fontFamily: 'MontserratAlternates-Medium',
        }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const height = Dimensions.get('screen').height;
  console.log('hei', height);
  console.log('selected', CityAdd);
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
      {/* <ImageBackground
        style={{height: '100%'}}
        source={require('../../../assets/Images/back.png')}> */}
      <View
        style={{
          height: 80,
          backgroundColor: darkmode ? '#' : 'white',
          elevation: 3,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          // justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={{
            height: 30,
            width: 30,
            borderRadius: 5,
            backgroundColor: '#ccc',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Icon name="left" size={20} color={'black'} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'MontserratAlternates-SemiBold',
            color: darkmode ? 'white' : 'black',
            marginLeft: 20,
          }}>
          Search
        </Text>
        {/* <Text style={{fontFamily: 'MontserratAlternates-Regular'}}>
              Chicago, IL 60611, USA
            </Text> */}
      </View>
      {/* <FlatList horizontal data={arr} renderItem={renderItem} /> */}
      {/* <ScrollView> */}
      <View
        style={{
          marginTop: 10,
          // flex: 0.9,
          // backgroundColor: 'red',
          marginHorizontal: 15,
        }}>
        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {arr.map(item => (
            <View
              style={{
                height: 30,
                backgroundColor: 'white',
                marginRight: 10,
                elevation: 3,
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 100,
                borderRadius: 5,
              }}>
              <Text style={{color: '#5F95F0', fontWeight: 'bold'}}>
                #{item}
              </Text>
            </View>
          ))}
        </View> */}
        <View
          style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 40,
            borderRadius: 10,
            // marginTop: 10,
            alignItems: 'center',
            borderWidth: 1,
            paddingLeft: 10,
            borderColor: 'black',
          }}>
          <TextInput
            placeholder="Search"
            placeholderTextColor="grey"
            value={city}
            onChangeText={text => {
              setCity(text);
              searchTextGiven(text);
            }}
            style={{
              width: '90%',
              color: 'black',
              fontFamily: 'MontserratAlternates-Regular',
            }}
          />
          {/* <TouchableOpacity
            style={{
              // backgroundColor: 'red',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
            }}
            onPress={() => {
              if (sel && city) {
                const data = {name: city, category: sel};
                navigation.navigate('ResturantsNearby', {sel, city});
                cityAdd(data)(dispatch);
              } else {
                Alert.alert('Select Category and City');
              }
            }}>
            <Image
              source={require('../../../assets/Images/search.png')}
              style={{height: 15, width: 15}}
            />
          </TouchableOpacity> */}
        </View>
        <FlatList horizontal data={arr} renderItem={renderItem} />

        {/* <TouchableOpacity
          onPress={() => {
            if (sel) {
              navigation.navigate('ResturantsNearby', {sel});
            } else {
              Alert.alert('Select Category');
            }
          }}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: 'grey',
            marginTop: 20,
            flexDirection: 'row',
            paddingBottom: 10,
            alignItems: 'center',
          }}>
          <Icon1 name="send" size={15} color={'grey'} />
          <Text
            style={{
              marginLeft: 10,
              fontFamily: 'MontserratAlternates-Regular',
              color: darkmode ? 'white' : 'black',
            }}>
            Nearby me...
          </Text>
        </TouchableOpacity> */}

        {/* <View
            style={{
              height: height > 850 ? '70%' : '78%',
              backgroundColor: 'red',
            }}>
           
          </View> */}
      </View>
      <View style={{height: height > 850 ? '80%' : '75%'}}>
        <FlatList data={searchList} renderItem={renderItem1} />
      </View>
      {/* </ImageBackground> */}

      {/* </ScrollView> */}

      {/* <Text>Home</Text> */}
      {MyModal(showModal)}
    </SafeAreaView>
  );
};
export default Search;
