import React, {useState, useEffect} from 'react';

import {
  View,
  FlatList,
  ScrollView,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import MentionHashtagTextView from 'react-native-mention-hashtag-text';
import LikeDislike from './LikeDislike';
import Icons from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';
import moment from 'moment';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Feather';
import Swiper from 'react-native-swiper';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import {createComment} from '../lib/api';
const SwiperPosts = props => {
  const {item, swipe, navigation, onShare, onPress, hashPress, press} = props;
  const {userData, darkmode} = useSelector(({USER}) => USER);
  const [paused, setPaused] = useState(false);
  const [show, setShow] = useState(false);
  const [change, setChange] = useState(false);
  const [comment, setComment] = useState('');
  const [keyboardStatus, setKeyboardStatus] = useState('');
  const renderItems = ({item}) => (
    <View
      style={{
        marginTop: 0,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        paddingBottom: 10,
      }}>
      {/* <Text
      style={{
        fontSize: 16,
        fontFamily: 'MontserratAlternates-SemiBold',
      }}>
      Comments
    </Text> */}
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <Image
            source={
              item.user.image
                ? {uri: item.user.image}
                : require('../assets/Images/girl.jpg')
            }
            style={{width: 50, height: 50, borderRadius: 50}}
          />
          <View style={{marginLeft: 10}}>
            <Text
              style={{
                fontFamily: 'MontserratAlternates-SemiBold',
                fontSize: 14,
                color: darkmode ? 'white' : 'black',
              }}>
              {`${item.user.firstname}`}
            </Text>
            {/* <Text
         style={{
           fontSize: 12,
           fontFamily: 'MontserratAlternates-Regular',
           marginTop: 5,
         }}>
         Today, 03:24 PM
       </Text> */}
          </View>
        </View>
        <Text
          style={{
            fontSize: 12,
            color: darkmode ? 'white' : 'black',
            fontFamily: 'MontserratAlternates-Regular',
          }}>
          {moment(item.created_at).format('MMM DD YYYY')}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: 'MontserratAlternates-Regular',
          marginTop: 10,
          color: darkmode ? 'white' : 'black',
        }}>
        {item.comment}
      </Text>
    </View>
  );
  const send = () => {
    setComment('');
    createComment({Auth: userData.token, post_id: item.id, comment}).then(
      res => {
        setChange(!change);
        press();
      },
    );
  };
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
  return (
    <ScrollView>
      <View
        //   activeOpacity={1}
        //   onPress={onPress}
        style={{
          // height: 30,
          backgroundColor: darkmode ? '#242527' : 'white',
          marginRight: 3,
          elevation: 3,
          // alignItems: 'center',
          // justifyContent: 'center',
          // minWidth: 100,
          marginLeft: 3,
          marginVertical: 3,
          marginBottom: 80,
          marginTop: 10,
          padding: 12,
          borderRadius: 5,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfile', {item})}
          style={{
            // marginTop: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              // backgroundColor: 'red',
              alignItems: 'center',
            }}>
            <Image
              source={
                item?.user?.image
                  ? {uri: item?.user?.image}
                  : require('../assets/Images/girl.jpg')
              }
              style={{width: 50, height: 50, borderRadius: 50}}
            />
            <View style={{marginLeft: 10}}>
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-SemiBold',
                  fontSize: 16,
                  color: darkmode ? 'white' : 'black',
                }}>
                {`${item?.user?.firstname}`}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'MontserratAlternates-Regular',
                  marginTop: 5,
                  color: darkmode ? 'white' : 'black',
                }}>
                {item?.created_at}
              </Text>
            </View>
          </View>
          {/* <Icon
          name="dots-three-horizontal"
          size={20}
          color={'black'}
          style={{bottom: 10}}
        /> */}
        </TouchableOpacity>

        <View style={{marginTop: 10}}>
          <View>
            <MentionHashtagTextView
              mentionHashtagPress={hashPress}
              mentionHashtagColor={'#5F95F0'}
              style={{
                fontSize: 13,
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-Regular',
              }}>
              {item.description}
            </MentionHashtagTextView>
          </View>
          {swipe.length > 0 && (
            <View style={{width: '100%', marginTop: 10, height: 350}}>
              <Swiper
                loadMinimal={true}
                showsPagination={true}
                key={swipe.length}
                paginationStyle={{bottom: 10}}
                activeDotColor="#5F95F0"
                loop={true}
                style={{
                  alignItems: 'center',
                  zIndex: 40,
                  justifyContent: 'center',
                }}
                showsButtons={false}>
                {swipe.map(
                  item =>
                    //   <View style={{width: '100%', marginTop: 10, height: 150}}>
                    item?.media_type == 'image' ? (
                      <Image
                        source={{uri: item?.media}}
                        style={{
                          borderRadius: 10,
                          width: '100%',
                          height: '100%',
                          resizeMode: 'cover',
                        }}
                      />
                    ) : (
                      <>
                        <Video
                          resizeMode="stretch"
                          posterresizeMode="cover"
                          repeat={Platform.OS == 'ios' ? true : false}
                          onEnd={() => setPaused(true)}
                          // onEnd={() => setPaused(!paused)}
                          poster={'https://baconmockup.com/300/200/'}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            // width: wp(85),
                            // back
                            // borderRadius: 10,
                            borderRadius: 10,
                            bottom: 0,
                            // height: 250,
                            width: '100%',
                            height: '100%',
                            right: 0,
                          }}
                          // controls={true}
                          paused={paused}
                          source={{uri: item?.media}}
                        />
                        <View
                          style={{
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            alignItems: 'center',
                            // backgroundColor: 'red',
                            justifyContent: 'center',
                          }}>
                          {paused ? (
                            <TouchableOpacity
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 30,
                                alignItems: 'center',
                                backgroundColor: '#5F95F0',
                                justifyContent: 'center',
                              }}>
                              <Icon
                                name={'controller-play'}
                                onPress={() => setPaused(!paused)}
                                size={40}
                                color="white"
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={{
                                width: 50,
                                height: 50,
                                backgroundColor: '#5F95F0',
                                borderRadius: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Icons
                                name={'pause'}
                                onPress={() => setPaused(!paused)}
                                size={40}
                                color="white"
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </>
                    ),
                  //   </View>
                )}
              </Swiper>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // marginTop: 10,
            zIndex: -3,
            // backgroundColor: 'red',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '50%',
              // backgroundColor: 'red',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <LikeDislike item={item} press={press} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '50%',
              marginTop: 10,
              justifyContent: 'space-between',
              // backgroundColor: 'red',
              alignItems: 'center',
            }}>
            {!show && (
              <TouchableOpacity
                onPress={() => navigation.navigate('Comments', {id: item.id})}
                // onPress={() => {
                //   setLike(!like);
                //   setDislike(false);
                // }}
                style={{
                  flexDirection: 'row',
                  marginLeft: 30,
                  width: 35,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <Image
                source={require('../assets/Images/comment.png')}
                style={{height: 10, width: 10}}
              /> */}
                <Icon1 name="comment" size={25} color="grey" />
                <Text
                  style={{
                    fontFamily: 'MontserratAlternates-Regular',
                    // marginLeft: 5,
                    color: darkmode ? 'white' : 'black',
                    fontSize: 13,
                  }}>
                  {item.comment_count}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                onShare();
              }}
              style={{
                flexDirection: 'row',
                width: 30,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Icon2 name="send" size={16} color={'grey'} />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList data={item.comments} renderItem={renderItems} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          width: '100%',
          zIndex: 3,
          bottom: 0,
          left: 0,
          backgroundColor: darkmode ? '#242527' : 'white',
          height: 70,
          marginBottom:
            Platform.OS == 'android'
              ? 0
              : keyboardStatus == 'Keyboard Shown'
              ? 20
              : 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TextInput
          placeholder={'Add your comment'}
          placeholderTextColor={'grey'}
          value={comment}
          onChangeText={text => {
            setComment(text);
          }}
          style={{
            width: '85%',
            height: 50,
            borderRadius: 30,
            color: 'black',
            paddingHorizontal: 10,
            backgroundColor: '#ccc',
          }}
        />
        <TouchableOpacity onPress={() => send()} style={{marginLeft: 10}}>
          <Icon3 name="send" size={25} color="#5F95F0" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SwiperPosts;
