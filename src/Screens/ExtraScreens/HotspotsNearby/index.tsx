import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  PermissionsAndroid,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import MyModal from '../../../Components/MyModal';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/AntDesign';
import Hotspot from '../../../Components/Hotspot';
import Icons from 'react-native-vector-icons/Feather';
import Slider from '@react-native-community/slider';
import {business_check, checkIn} from '../../../lib/api';
import {useSelector} from 'react-redux';
import IconFire from 'react-native-vector-icons/MaterialIcons';
import {config} from '../../../../config';
const dummy = [1, 2, 3, 4, 5];

const HotspotsNearby = ({navigation}) => {
  const [search, setSearch] = useState('');
  const {darkmode, userData} = useSelector(({USER}) => USER);
  const [selected, setSelected] = useState('Shopping');
  const [slideStartingValue, setslideStartingValue] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [hotspotList, setHotspotList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [selectRadius, setRadius] = useState(2);
  const [showModal, setShowModal] = useState(false);

  const dummyArr = [
    {
      name: 'Shopping',
      icon: (
        <IconFire
          name="shopping-basket"
          size={20}
          color={selected == 'Shopping' ? 'white' : 'black'}
        />
      ),
    },
    {
      name: 'Entertainment',
      icon: (
        <Icons
          name="tv"
          size={20}
          color={selected == 'Entertainment' ? 'white' : 'black'}
        />
      ),
    },
  ];
  const checkPlace = place => {
    business_check({name: place.name, Auth: userData.token})
      .then(res => {
        // setShowModal(false);
        console.log('res', res);
        if (res.status == 'success') {
          if (res.check) {
            navigation.navigate('RestaurantsDetailBackend', {id: place.name});
          } else {
            navigation.navigate('RestaurantsDetail', {item: place});
          }
        }
      })
      .catch(err => {
        // setShowModal(false);
        console.log('err in check', err);
      });
  };
  const checked = place => {
    checkIn({Auth: userData.token, business_name: place.name})
      .then(res => {
        console.log('res of checkedin', res);
        if (res.status == 'success') {
          // setRefresh(!refresh);
        }
      })
      .catch(err => {
        console.log('err in checkedin', err);
      });
  };
  const render = ({item, index}) => (
    <Hotspot
      item={item}
      hottest={index == 0 ? true : false}
      check={() => checkPlace(item)}
      checkedIn={() => checked(item)}
      navigation={navigation}
    />
  );
  const handleRestaurantSearch = (lat: Number, long: Number) => {
    setShowModal(true);
    // console.log('here');
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    const location = `location=${lat},${long}`;
    const radius = `&radius=${selectRadius}000`;
    const type = `&keyword=${selected}`;
    const key = `&key=${config}`;
    const restaurantSearchUrl = url + location + radius + type + key;
    fetch(restaurantSearchUrl)
      .then(response => response.json())
      .then(result => {
        console.log('result of hotspot', result.results);
        setHotspotList(result.results);
        setFilteredList(result.results);
        // setList(result.results);
        // setShowModal(false);
        // console.log('results', result.results);
        setShowModal(false);
      })
      // .then(result => this.setState({restaurantList: result}))
      .catch(e => {
        console.log('err', e);
        // setShowModal(false);
        setShowModal(false);
      });
  };
  const cuRRentlocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        handleRestaurantSearch(
          position.coords.latitude,
          position.coords.longitude,
        );
        // getPlace(position.coords.latitude, position.coords.longitude);
        // getPlace('47.751076', '-120.740135');
        console.log('users location', position.coords.longitude);

        console.log('users location', position.coords.latitude);
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
    filteredName = hotspotList.filter(item => {
      return item?.name?.toLowerCase().includes(`${e.toLowerCase()}`);
      // return item.vender.fullname.toLowerCase().includes(`${e.toLowerCase()}`);
    });
    setFilteredList(filteredName);
    // filteredName = [];
    // }
  };
  useEffect(() => {
    Platform.OS == 'ios'
      ? Geolocation.requestAuthorization('whenInUse').then(res => {
          cuRRentlocation();
          console.log('res', res);
        })
      : requestLocationPermission();
  }, [selected, selectRadius]);
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
  const renders = ({item}) => (
    <TouchableOpacity
      onPress={() => setSelected(item.name)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        marginRight: 10,
        width: 120,
        justifyContent: 'center',
        // paddingHorizontal: 10,
        marginTop: 10,
        backgroundColor: selected == item.name ? '#5F95F0' : '#ccc',
        // backgroundColor: '#5F95F0',
        borderRadius: 30,
      }}>
      {item.icon}
      <Text
        style={{
          color: selected == item.name ? 'white' : 'black',
          marginLeft: 5,
        }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  const filterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
      visible={showFilterModal}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#00000088',
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            backgroundColor: darkmode ? 'black' : 'white',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            width: '100%',
            paddingHorizontal: 15,
            // paddingTop: 30,
            paddingBottom: 20,
            // height: 50,
          }}>
          <View style={{alignItems: 'center'}}>
            <IconFire
              name="horizontal-rule"
              onPress={() => setShowFilterModal(false)}
              size={50}
              color="#ccc"
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: darkmode ? 'white' : 'black',
            }}>
            Filter hotspots
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: '#ccc',
                borderRadius: 30,
                marginRight: 10,
              }}>
              <Text>Most Checked ins</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{padding: 10, backgroundColor: '#ccc', borderRadius: 30}}>
              <Text>Most tagged places</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 16, color: darkmode ? 'white' : 'black'}}>
              Select radius
            </Text>
            <Text style={{fontSize: 16, color: darkmode ? 'white' : 'black'}}>
              {parseInt(slideStartingValue)} miles
            </Text>
          </View>
          <View>
            <Slider
              style={{width: '95%', height: 40}}
              minimumValue={1}
              maximumValue={50}
              minimumTrackTintColor="#5F95F0"
              maximumTrackTintColor="#5F95F0"
              thumbTintColor="#5F95F0"
              // thumbImage={require('../../../../Assets/dp.png')

              // }

              // value={slideStartingCount}

              onSlidingStart={value => {
                // console.log("value of slider", value)
                setslideStartingValue(value);
                //   setslideStartingCount(slideStartingValue + 0.5);
              }}
              onSlidingComplete={value => {
                // console.log("value of slider", value)
                setslideStartingValue(value);
                //   setslideStartingCount(slideStartingValue + 0.5);
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              setShowFilterModal(false);
              setRadius(parseInt(slideStartingValue));
              setTimeout(() => {
                setSelected(selected);
              }, 1000);
            }}
            style={{
              backgroundColor: '#200E32',
              height: 50,
              borderRadius: 10,
              alignItems: 'center',
              marginTop: 20,
              justifyContent: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
              Apply filters
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowFilterModal(false);
              setRadius(2);
              setTimeout(() => {
                setSelected(selected);
              }, 1000);
            }}>
            <Text
              style={{
                color: 'grey',
                textDecorationLine: 'underline',
                alignSelf: 'center',
                marginTop: 20,
              }}>
              Remove All Filters
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
      <View
        style={{
          height: 80,
          // elevation: 3,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: darkmode ? '#242527' : 'white',
          paddingHorizontal: 15,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            height: 25,
            backgroundColor: '#ccc',
            width: 25,
            alignItems: 'center',
            borderRadius: 5,
            justifyContent: 'center',
          }}>
          <Icon color="black" name="arrowleft" size={20} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'MontserratAlternates-SemiBold',
            color: darkmode ? 'white' : 'black',
          }}>
          Hotspots Nearby
        </Text>
        <View style={{width: 50}} />
        {/* <Icon1 name="diff-added" size={25} color="black" /> */}
      </View>
      <View style={{paddingHorizontal: 15}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 50,
              paddingHorizontal: 15,
              backgroundColor: '#ccc',
              borderRadius: 10,
              width: '80%',
            }}>
            <Icons name="search" color="#5F95F0" size={20} />
            <TextInput
              value={search}
              onChangeText={text => {
                setSearch(text);
                searchTextGiven(text);
              }}
              placeholder="Search"
              placeholderTextColor={'grey'}
              style={{color: 'black', flex: 1}}
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowFilterModal(!showFilterModal)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#200E32',
              height: 50,
              width: 50,
              borderRadius: 10,
            }}>
            <Image
              source={require('../../../assets/Images/whitefilter.png')}
              style={{height: 20, width: 20}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View>
          <FlatList data={dummyArr} horizontal renderItem={renders} />
        </View>
        <View>
          <FlatList
            data={filteredList}
            renderItem={render}
            keyExtractor={item => `${item}a`}
          />
        </View>
      </View>
      {filterModal()}
      {MyModal(showModal)}
    </SafeAreaView>
  );
};

export default HotspotsNearby;
