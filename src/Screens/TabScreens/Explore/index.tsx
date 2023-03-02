import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import {useSelector} from 'react-redux';
import Hotspot from '../../../Components/Hotspot';
import Icon from 'react-native-vector-icons/Feather';
import {
  hotspots,
  business_check,
  checkIn,
  trending_town,
} from '../../../lib/api';
const Explore = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [hotSpots, setHotSpot] = useState([]);
  const [trending, setTrending] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchedHotSpot, setSearchedHotSpot] = useState([]);
  const {darkmode, userData} = useSelector(({USER}) => USER);
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
  const dummy = [1, 2, 3, 4, 5];
  const checked = place => {
    checkIn({Auth: userData.token, business_name: place.name})
      .then(res => {
        console.log('res of checkedin', res);
        if (res.status == 'success') {
          setRefresh(!refresh);
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
  const renders = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ExploreTowns', {city: item})}
      style={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingTop: 5,
        paddingLeft: 5,
        paddingBottom: 20,
        backgroundColor: darkmode ? '#242527' : 'white',
        marginTop: 20,
      }}>
      <Text style={{fontSize: 16, color: darkmode ? 'white' : 'black'}}>
        {item}
      </Text>
      {/* <Text style={{marginTop: 5, color: 'grey'}}>2,334 Check ins</Text> */}
    </TouchableOpacity>
  );
  const getUnique = (arr, index) => {
    const unique = arr
      .map(e => e[index])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter(e => arr[e])
      .map(e => arr[e]);

    return unique;
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      trending_town()
        .then(res => {
          console.log('res of trending town', res);
          setTrending(res.data);
        })
        .catch(err => {
          console.log('err in trending town', err);
        });
      hotspots({Auth: userData.token})
        .then(res => {
          console.log('res of hotspot', res);
          // console.log('unique array', );
          setHotSpot(getUnique(res.data, 'name'));
          setSearchedHotSpot(getUnique(res.data, 'name'));
        })
        .catch(err => {
          console.log('err in hotspot', err);
        });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    trending_town()
      .then(res => {
        console.log('res of trending town', res);
        setTrending(res.data);
      })
      .catch(err => {
        console.log('err in trending town', err);
      });
    hotspots({Auth: userData.token})
      .then(res => {
        // console.log('res of hotspot', res);
        // console.log('unique array', );
        setHotSpot(getUnique(res.data, 'name'));
        setSearchedHotSpot(getUnique(res.data, 'name'));
      })
      .catch(err => {
        console.log('err in hotspot', err);
      });
  }, [refresh]);
  const searchTextReceive = e => {
    let filteredName = [];
    // if (e) {
    filteredName = hotSpots.filter(item => {
      return item?.name?.toLowerCase().includes(`${e.toLowerCase()}`);
      // return item.name.toLowerCase().includes(`${e.toLowerCase()}`);
    });
    setSearchedHotSpot(filteredName);
    // filteredName = [];
    // }
  };
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
      <View
        style={{
          height: 80,
          // elevation: 3,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'MontserratAlternates-SemiBold',
            color: darkmode ? 'white' : 'black',
          }}>
          Explore
        </Text>

        {/* <Icon1 name="diff-added" size={25} color="black" /> */}
      </View>
      <ScrollView>
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
              <Icon name="search" color="#5F95F0" size={20} />
              <TextInput
                value={search}
                onChangeText={text => {
                  searchTextReceive(text);
                  setSearch(text);
                }}
                placeholder="Search"
                placeholderTextColor={'grey'}
                style={{color: 'black', flex: 1}}
              />
            </View>
            <TouchableOpacity
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
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
            // onPress={() => navigation.navigate('HotspotsNearby')}
            >
              <Text style={{fontSize: 16, color: darkmode ? 'white' : 'black'}}>
                Hotspots Nearby
              </Text>
            </TouchableOpacity>
            <Text style={{color: 'grey'}}>See all</Text>
          </View>
          <View>
            <FlatList
              data={searchedHotSpot}
              renderItem={render}
              horizontal
              keyExtractor={item => `${item}a`}
            />
          </View>
          <Text
            style={{
              marginTop: 20,
              color: darkmode ? 'white' : 'black',
              fontSize: 16,
            }}>
            #Trendingtowns
          </Text>
          <View style={{height: '30%'}}>
            <FlatList
              data={trending}
              renderItem={renders}
              keyExtractor={item => `${item}a`}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explore;
