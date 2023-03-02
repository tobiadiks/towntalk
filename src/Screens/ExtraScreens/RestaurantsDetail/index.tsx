import React, {useState, useEffect} from 'react';

import {
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Linking,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Text,
  TextInput,
  ImageBackground,
  Keyboard,
} from 'react-native';
import MentionHashtagTextView from 'react-native-mention-hashtag-text';
import {config} from '../../../../config';
import StarRating from 'react-native-star-rating';
import Reviews from '../../../Components/Reviews';
import {useSelector} from 'react-redux';
import {reviewPost} from '../../../lib/api';
import MapView, {Marker} from 'react-native-maps';
import ImageModal from '../../../Components/ImageModal';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/EvilIcons';
import Icon from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Swiper from 'react-native-swiper';
const RestaurantsDetail = ({navigation, route}) => {
  const {item} = route.params;
  const {darkmode, userData} = useSelector(({USER}) => USER);
  const [showModal, setShowModal] = useState(false);
  const [stars, setStars] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState('');
  const alter = () => {
    setShowModal(!showModal);
  };
  const [keyboardStatus, setKeyboardStatus] = useState('');
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('Keyboard Shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('Keyboard Hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const ReviewModal = () => {
    const Wrapper = Platform.OS == 'ios' ? KeyboardAvoidingView : View;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showReviewModal}
        onRequestClose={() => setShowReviewModal(false)}>
        <TouchableOpacity
          onPress={() => setShowReviewModal(false)}
          style={{
            flex: 1,
            // height: hp(100),
            backgroundColor: '#00000088',
            alignItems: 'center',
            justifyContent:
              keyboardStatus == 'Keyboard Shown' ? 'center' : 'flex-end',
            zIndex: 200,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            // position: 'absolute',
          }}>
          <Wrapper
            behavior="padding"
            style={{
              height: '45%',
              width: '100%',
              backgroundColor: 'white',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              padding: 20,
            }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => Keyboard.dismiss()}>
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-SemiBold',
                  fontSize: 16,
                  color: 'black',
                }}>
                Leave a review
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  alignItems: 'center',
                }}>
                <StarRating
                  maxStars={5}
                  starSize={35}
                  fullStarColor={'lightgreen'}
                  rating={stars}
                  // style={{marginTop: 10}}
                  selectedStar={rating => setStars(rating)}
                />
                <Text
                  style={{
                    color: 'black',
                    fontSize: 30,
                    marginLeft: 10,

                    fontWeight: '600',
                  }}>
                  {stars}.0
                </Text>
              </View>
              <TextInput
                value={review}
                onChangeText={text => setReview(text)}
                style={{
                  backgroundColor: '#ccc',
                  height: 120,
                  borderRadius: 10,
                  color: 'black',
                  padding: 10,
                  marginTop: 15,
                }}
                placeholder="Add Comment"
                placeholderTextColor="grey"
                numberOfLines={4}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity
                onPress={() => {
                  reviewPost({
                    Auth: userData.token,
                    feedback: review,
                    rating: stars,
                    business_id: item.id,
                  })
                    .then(res => {
                      console.log('res of review', res);
                    })
                    .catch(err => {
                      console.log('err in review', err);
                    });

                  setShowReviewModal(false);
                }}
                style={{
                  width: '100%',
                  height: 50,
                  backgroundColor: '#200E32',
                  marginTop: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'MontserratAlternates-SemiBold',
                  }}>
                  Leave a review
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Wrapper>
        </TouchableOpacity>
      </Modal>
    );
  };
  const renderItems = ({item}) => <Reviews item={item} />;
  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => console.log('item', item)}
      style={{width: wp(85), marginRight: 10, height: 100}}>
      <View style={{flexDirection: 'row'}}>
        <Image
          style={{height: 100, width: 100, borderRadius: 10}}
          source={
            item?.media[0]?.media_type == 'image'
              ? {uri: item?.media[0]?.media}
              : require('../../../assets/Images/social.jpg')
          }
        />
        <View
          style={{
            marginLeft: 10,
            // backgroundColor: 'blue',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: 'MontserratAlternates-SemiBold',
              fontSize: 16,
              color: darkmode ? 'white' : 'black',
            }}>
            {`${item?.user?.firstname}`}
            {item?.business_tag && (
              <Text style={{color: 'grey'}}>
                {' '}
                tagged{' '}
                <Text
                  // onPress={tagPress}
                  style={{
                    fontFamily: 'MontserratAlternates-SemiBold',
                    fontSize: 16,
                    color: darkmode ? 'white' : 'black',
                  }}>
                  {item?.business_tag}
                </Text>
              </Text>
            )}
          </Text>
          <View style={{marginTop: 2}}>
            {/* <Text>{item?.description}</Text> */}
            <MentionHashtagTextView
              numberOfLines={1}
              mentionHashtagPress={text =>
                navigation.navigate('Hashes', {text})
              }
              mentionHashtagColor={'#5F95F0'}
              style={{
                fontSize: 13,
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-Regular',
              }}>
              {item?.description}
            </MentionHashtagTextView>
          </View>
          <View
            style={{
              height: 30,
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              top: 5,
              // backgroundColor: 'red',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="thumbs-up"
                size={20}
                color={
                  item?.is_like == true
                    ? '#5F95F0'
                    : darkmode
                    ? 'white'
                    : 'grey'
                }
                // color={like == true ? '#5F95F0' : 'grey'}
              />
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-Regular',
                  fontSize: 13,
                  marginLeft: 5,
                  color: darkmode ? 'white' : 'black',
                }}>
                {item?.like_count}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 15,
                alignItems: 'center',
              }}>
              <Icon
                name="thumbs-down"
                size={20}
                color={
                  item?.is_like == false
                    ? '#5F95F0'
                    : darkmode
                    ? 'white'
                    : 'grey'
                }
                // color={dislike == false ? '#5F95F0' : 'grey'}
              />
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-Regular',
                  fontSize: 13,
                  marginLeft: 5,
                  color: darkmode ? 'white' : 'black',
                }}>
                {item?.dislike_count}
              </Text>
            </View>
            <View
              style={{
                marginLeft: 15,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon3
                name="comment"
                size={25}
                color={darkmode ? 'white' : 'grey'}
              />

              <Text
                style={{
                  fontFamily: 'MontserratAlternates-Regular',
                  // marginLeft: 5,
                  color: darkmode ? 'white' : 'black',
                  fontSize: 13,
                }}>
                {item.comment_count}
              </Text>
            </View>
          </View>
          <View></View>
        </View>
      </View>
    </TouchableOpacity>
  );
  // console.log('item', item);
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
      <ScrollView nestedScrollEnabled={true}>
        <TouchableOpacity
          onPress={() => {
            if (item.photos) {
              setShowModal(true);
            }
          }}
          style={{height: 200, width: '100%'}}>
          <Image
            source={
              item?.image
                ? {uri: item?.image}
                : item.photos
                ? {
                    uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${item.photos[0].photo_reference}&key=${config}`,
                  }
                : require('../../../assets/Images/imagePlaceholder.png')
            }
            style={{height: 200, width: '100%'}}
          />
          <View style={{position: 'absolute', left: 5, top: 5}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#ccc',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                height: 30,
                width: 30,
              }}
              onPress={() => navigation.goBack()}>
              <Icon1 name="arrowleft" color="black" size={20} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View
          style={{
            marginTop: 0,
            backgroundColor: darkmode ? '#242527' : 'white',
            elevation: 3,
            paddingHorizontal: 10,
            borderRadius: 5,
            marginHorizontal: 15,
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'MontserratAlternates-SemiBold',
                color: darkmode ? 'white' : 'black',
              }}>
              {item.name}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon1 name="star" color="lightgreen" />
              <Text
                style={{
                  color: darkmode ? 'white' : 'black',
                  fontSize: 16,
                  marginLeft: 3,
                }}>
                {item.rating} (5)
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Icon2 name="location-pin" size={15} color="#5F95F0" />
            <View>
              <Text
                style={{
                  fontSize: 13,
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-Medium',
                }}>
                {item.vicinity ? item.vicinity : item.location}
              </Text>
            </View>
          </View>
          {item?.opening_hours && (
            <View style={{marginTop: 10}}>
              <Text style={{color: darkmode ? 'white' : 'black'}}>
                {item?.opening_hours.open_now == true ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          )}

          <View style={{flexDirection: 'row', alignItems: 'center'}}></View>

          {item?.types && (
            <>
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 10,
                  color: darkmode ? 'white' : 'black',
                  fontFamily: 'MontserratAlternates-Medium',
                }}>
                Amneties
              </Text>
              {item?.types.map(element => (
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 5,
                      // marginLeft: 10,
                      color: darkmode ? 'white' : 'black',
                      fontFamily: 'MontserratAlternates-Medium',
                    }}>
                    {element}
                  </Text>
                </View>
              ))}
            </>
          )}

          <View style={{height: 10}} />
        </View>
        <View style={{marginTop: 20, paddingHorizontal: 15}}>
          <View
            style={{
              backgroundColor: '#ccc',
              marginBottom: 30,
              padding: 10,
              borderRadius: 10,
            }}>
            <View
              style={{
                height: 150,
                // marginBottom: 30,
                // backgroundColor: 'red',
                // marginTop: 20,
                borderRadius: 10,
                zIndex: -1,
                overflow: 'hidden',
              }}>
              <MapView
                style={{
                  flex: 1,
                  height: '100%',
                  width: '100%',
                  borderRadius: 10,
                }}
                initialRegion={{
                  latitude: item?.geometry
                    ? item?.geometry?.location.lat
                    : JSON.parse(item?.latitude),
                  longitude: item?.geometry
                    ? item?.geometry?.location.lng
                    : JSON.parse(item?.longitude),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
                <Marker
                  // key={index}
                  coordinate={{
                    latitude: item?.geometry
                      ? item?.geometry?.location.lat
                      : JSON.parse(item?.latitude),
                    longitude: item?.geometry
                      ? item?.geometry?.location.lng
                      : JSON.parse(item?.longitude),
                  }}
                  title={'location'}
                  // description={marker.description}
                />
              </MapView>
            </View>
            <Text style={{marginTop: 10}}>
              {item.vicinity ? item.vicinity : item.location}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const scheme = Platform.select({
                  ios: 'maps:0,0?q=',
                  android: 'geo:0,0?q=',
                });
                const latLng = `${
                  item.geometry ? item.geometry.location.lat : item.latitude
                },${
                  item.geometry ? item.geometry.location.lng : item.longitude
                }`;
                const label = `Direction`;
                const url = Platform.select({
                  ios: `${scheme}${label}@${latLng}`,
                  android: `${scheme}${latLng}(${label})`,
                });
                Linking.openURL(url);
              }}>
              <Text
                style={{
                  color: '#5F95F0',
                  textDecorationColor: '#5F95F0',
                  textDecorationLine: 'underline',
                  fontWeight: '500',
                }}>
                Get direction
              </Text>
            </TouchableOpacity>
          </View>

          {item?.posts && (
            <>
              <View
                style={{
                  width: '100%',
                  marginTop: 10,
                  borderRadius: 10,
                  padding: 5,
                  backgroundColor: darkmode ? '#242527' : 'white',
                }}>
                <View
                  style={{
                    // marginVertical: 10,
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',

                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: darkmode ? 'white' : 'black',
                      fontWeight: 'bold',
                    }}>
                    What people are saying
                  </Text>
                  <TouchableOpacity>
                    <Text style={{color: 'grey', marginRight: 0}}>
                      View all
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={item?.posts}
                  renderItem={renderItem}
                  horizontal
                />
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: darkmode ? 'white' : 'black',
                      fontWeight: 'bold',
                    }}>
                    Reviews
                  </Text>
                  <TouchableOpacity onPress={() => setShowReviewModal(true)}>
                    <Text
                      style={{
                        color: '#5F95F0',
                        textDecorationColor: '#5F95F0',
                        textDecorationLine: 'underline',
                      }}>
                      Give review
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <FlatList
                    data={item.reviews}
                    horizontal
                    renderItem={renderItems}
                  />
                </View>
              </View>
            </>
          )}
          <View style={{height: 30}} />
        </View>
      </ScrollView>

      {ImageModal(
        showModal,
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${
          item.photos ? item?.photos[0]?.photo_reference : null
        }&key=${config}`,
        alter,
      )}
      {ReviewModal()}
    </SafeAreaView>
  );
};
export default RestaurantsDetail;
