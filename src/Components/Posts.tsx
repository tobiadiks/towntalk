import React, {useState} from 'react';

import {
  View,
  FlatList,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  Image,
  Text,
} from 'react-native';
import LikeDislike from './LikeDislike';
import Video from 'react-native-video';
import Swiper from 'react-native-swiper';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import moment from 'moment';
import MentionHashtagTextView from 'react-native-mention-hashtag-text';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
const Posts = props => {
  const {
    item,
    navigation,
    onShare,
    blockuser,
    onPress,
    hashPress,
    focusMedia,
    deletePost,
    tagPress,
    handleReport,
    press,
  } = props;
  const {userData, darkmode} = useSelector(({USER}) => USER);
  const [show, setShow] = useState(false);
  const [paused, setPaused] = useState(true);
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={{
        // height: 30,
        backgroundColor: darkmode ? '#242527' : 'white',
        marginRight: 3,
        elevation: 3,
        zIndex: -110,
        // alignItems: 'center',
        // justifyContent: 'center',
        // minWidth: 100,
        marginLeft: 3,
        marginVertical: 3,
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
          // backgroundColor: 'red',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={
              item?.user?.image
                ? {uri: item?.user?.image}
                : require('../assets/Images/girl.jpg')
            }
            style={{width: 50, height: 50, borderRadius: 50}}
          />
          <View style={{marginLeft: 10}}>
            <View
              style={{
                width: wp(60),
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
                      onPress={tagPress}
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
            </View>

            <Text
              style={{
                fontSize: 12,
                fontFamily: 'MontserratAlternates-Regular',
                marginTop: 5,
                color: 'grey',
              }}>
              {item?.created_at}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setShow(!show)}
          style={{
            height: 30,
            width: 30,
            // backgroundColor: 'red',
            alignItems: 'flex-end',
            bottom: 10,
          }}>
          <Icon2
            name="dots-three-vertical"
            size={20}
            color={darkmode ? 'white' : 'black'}
            style={{}}
          />
        </TouchableOpacity>
        {show && (
          <View
            // onPress={() => Alert.alert('hello')}
            style={{
              position: 'absolute',
              height: 100,
              zIndex: 100,
              width: 100,
              // backgroundColor: 'red',
              borderRadius: 10,
              right: 0,
              top: 30,
            }}>
            <TouchableOpacity
              onPress={() => {
                setShow(!show);
                onShare();
              }}
              style={{
                height: 40,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                // borderBottomLeftRadius:
                //   item.user.id == userData.userdata.id ? 10 : 0,
                // borderBottomRightRadius:
                //   item.user.id == userData.userdata.id ? 10 : 0,
                justifyContent: 'center',
                borderBottomWidth: item.user.id == userData.userdata.id ? 0 : 1,
                borderBottomColor: 'grey',

                paddingLeft: 10,
                backgroundColor: '#ccc',
                // elevation: 1,
              }}>
              <Text style={{color: 'black'}}>Share Post</Text>
            </TouchableOpacity>
            {item.user.id == userData.userdata.id && (
              <TouchableOpacity
                onPress={() => {
                  setShow(!show);
                  deletePost(item.id);
                }}
                style={{
                  height: 40,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  justifyContent: 'center',
                  paddingLeft: 10,
                  backgroundColor: '#ccc',
                  // elevation: 1,
                }}>
                <Text style={{color: 'black'}}>Delete Post</Text>
              </TouchableOpacity>
            )}
            {item.user.id != userData.userdata.id && (
              <TouchableOpacity
                onPress={() => {
                  setShow(!show);
                  handleReport(item.id);
                  blockuser(item.user.id);
                }}
                // onPress={() =>}
                style={{
                  height: 40,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  justifyContent: 'center',
                  paddingLeft: 10,
                  backgroundColor: '#ccc',
                  // elevation: 1,
                }}>
                <Text style={{color: 'black'}}>Report Post</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>

      <View style={{marginTop: 10, zIndex: -2}}>
        <TouchableOpacity onPress={() => focusMedia(item?.media[0].media)}>
          {item?.media[0]?.media &&
            (item?.media[0]?.media_type == 'image' ? (
              <Image
                source={
                  item?.media[0]?.media
                    ? {uri: item?.media[0]?.media}
                    : require('../assets/Images/social.jpg')
                }
                resizeMode="cover"
                style={{
                  height: undefined,
                  aspectRatio: 1,
                  zIndex: -11,
                  borderRadius: 10,
                  width: '100%',
                  marginTop: 10,
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
                  poster={
                    'https://towntalkapp.com/app/public/assets/thumbnail/thumbnail.png'
                  }
                  style={{
                    // position: 'absolute',
                    top: 0,
                    left: 0,
                    // width: wp(85),
                    // back
                    // borderRadius: 10,
                    borderRadius: 10,
                    bottom: 0,
                    // height: 250,
                    width: '100%',
                    // height: 300,
                    height: undefined,
                    aspectRatio: 1,
                    right: 0,
                  }}
                  // controls={true}
                  paused={paused}
                  source={{uri: item?.media[0]?.media}}
                />
                <View
                  style={{
                    position: 'absolute',
                    height: undefined,
                    aspectRatio: 1,
                    // height: 300,
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
                      <Icon2
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
                      <Icon3
                        name={'pause'}
                        onPress={() => setPaused(!paused)}
                        size={40}
                        color="white"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </>
            ))}
        </TouchableOpacity>

        <View style={{marginTop: 10}}>
          {/* <Text>{item?.description}</Text> */}
          <MentionHashtagTextView
            numberOfLines={5}
            mentionHashtagPress={hashPress}
            mentionHashtagColor={'#5F95F0'}
            style={{
              fontSize: 13,
              color: darkmode ? 'white' : 'black',
              fontFamily: 'MontserratAlternates-Regular',
            }}>
            {item?.description}
          </MentionHashtagTextView>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
          zIndex: -3,
          // backgroundColor: 'red',
        }}>
        <View
          style={{
            flexDirection: 'row',
            // backgroundColor: 'red',
            width: '50%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <LikeDislike item={item} press={press} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            // backgroundColor: 'red',
            justifyContent: 'space-between',
            width: '50%',
            alignItems: 'center',
          }}>
          {/* <View /> */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Comments', {id: item.id})}
            // onPress={() => {
            //   setLike(!like);
            //   setDislike(false);
            // }}
            style={{
              flexDirection: 'row',
              marginLeft: 30,
              // backgroundColor: 'red',
              // height: '100%',
              // height: 20,
              width: 35,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
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
          <TouchableOpacity
            onPress={() => {
              onShare();
            }}
            //   setLike(!like);
            //   setDislike(false);
            // }}
            style={{
              flexDirection: 'row',
              width: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="send" size={16} color={'grey'} />
          </TouchableOpacity>
        </View>
      </View>
      {item?.comment_count > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Comments', {id: item.id})}
          style={{marginTop: 10}}>
          <Text
            style={{
              fontSize: 13,
              color: darkmode ? 'white' : 'black',
              fontFamily: 'MontserratAlternates-Regular',
            }}>
            View all{' '}
            <Text
              style={{
                fontSize: 14,
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              {item?.comment_count}
            </Text>{' '}
            comments
          </Text>
        </TouchableOpacity>
      )}
      {item?.recentcomments && (
        <TouchableOpacity style={{marginTop: 10}}>
          <Text
            style={{
              fontSize: 13,
              color: darkmode ? 'white' : 'black',
              fontFamily: 'MontserratAlternates-Regular',
            }}>
            <Text
              style={{
                fontSize: 14,
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              {item?.recentcomments?.user.firstname}
            </Text>{' '}
            {item?.recentcomments?.comment}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default Posts;
