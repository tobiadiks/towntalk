import React, {useState, useCallback, useEffect} from 'react';

import {
  SafeAreaView,
  Image,
  Modal,
  KeyboardAvoidingView,
  Keyboard,
  Text,
  Share,
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import {useSelector} from 'react-redux';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import database from '@react-native-firebase/database';
import {
  city_posts,
  blockUser,
  reportUser,
  checkIn,
  deletePostApi,
  business_check,
  profile,
} from '../../../lib/api';
import VideoCompModal from '../../../Components/VideoCompModal';
import Icon from 'react-native-vector-icons/AntDesign';
import Hotspot from '../../../Components/Hotspot';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/Feather';
import Posts from '../../../Components/Posts';
import Icon4 from 'react-native-vector-icons/Ionicons';
const ExploreTowns = ({navigation, route}) => {
  const {city} = route.params;

  const {darkmode, userData} = useSelector(({USER}) => USER);
  const dummy = [1, 2, 3, 4, 5];
  // console.log('route', city);
  const [posts, setPosts] = useState([]);
  const [hotSpots, setHotspots] = useState([]);
  const [specific, setSpecific] = useState({});
  const [reportReason, setReportReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [reportId, setReportId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [change, setChange] = useState(false);
  const [media, setMedia] = useState('');
  const [list, setList] = useState([]);
  const [keyboardStatus, setKeyboardStatus] = useState('');
  const [focusMedia, setFocusMedia] = useState(false);
  const [blockuserId, setBlockuserId] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  console.log('city in post', specific);
  const checkPlace = place => {
    business_check({name: place.name, Auth: userData.token})
      .then(res => {
        // setShowModal(false);
        // console.log('res', res);
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
  const _usersList = useCallback(async () => {
    try {
      // setLoading(true);
      database()
        .ref('users/' + userData.userdata.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .orderByChild('timestamp')
        .on('value', dataSnapshot => {
          let users = [];
          dataSnapshot.forEach(child => {
            users.push(child.val());
          });
          console.log('users', users);
          setList(users.reverse());
          // setLoading(false);

          // console.log("user list in chat list ", JSON.stringify(users))
        });
    } catch (error) {}
  }, []);
  useEffect(() => {
    _usersList();
    // profile({Auth: userData.token, id: item.user.id}).then(res => {
    //   // console.log('resi of profile', JSON.stringify(res));
    //   setPosts(res.data);
    //   setProfileObject(res.data);
    // });
  }, [change]);
  const onShare = async () => {
    try {
      const link = await dynamicLinks().buildLink({
        link: `https://towntalkapp.page.link/${specific.id}`,

        // domainUriPrefix is created in your Firebase console
        domainUriPrefix: 'https://towntalkapp.page.link',
        // optional setup which updates Firebase analytics campaign
        // "banner". This also needs setting up before hand
        analytics: {
          campaign: 'banner',
        },
      });
      console.log('::::----', link);

      const result = await Share.share({
        message: `TownTalk: Post link ${link}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  const MyModal = (show: boolean) => {
    //   console.log('show', show);
    return (
      <Modal animationType="slide" transparent={true} visible={show}>
        <TouchableOpacity
          onPress={() => setShowModal(false)}
          style={{
            flex: 1,
            // height: hp(100),
            backgroundColor: '#00000088',
            alignItems: 'center',
            justifyContent: 'flex-end',
            zIndex: 200,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            // position: 'absolute',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => console.log('hello')}
            style={{
              // height: '45%',
              maxHeight: '50%',
              minHeight: '20%',
              width: '100%',
              borderRadius: 10,
              backgroundColor: darkmode ? 'black' : 'white',
            }}>
            <TouchableOpacity
              onPress={() => onShare()}
              style={{
                width: '90%',
                height: 50,
                alignSelf: 'center',
                backgroundColor: '#5F95F0',
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
                Share
              </Text>
            </TouchableOpacity>
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 15,
                marginRight: 15,
              }}>
              <Icon1
                name="circle-with-cross"
                size={20}
                color="black"
                onPress={() => setShowModal(false)}
              />
            </View> */}
            <Text
              style={{
                marginLeft: 10,
                fontSize: 16,
                marginTop: 10,
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Share with contacts
            </Text>
            <View style={{paddingHorizontal: 10}}>
              <FlatList data={list} renderItem={renders} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  const ReportModal = () => {
    const Wrapper = Platform.OS == 'ios' ? KeyboardAvoidingView : View;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showReportModal}
        onRequestClose={() => setShowReportModal(false)}>
        <TouchableOpacity
          onPress={() => setShowReportModal(false)}
          style={{
            flex: 1,
            // height: hp(100),
            backgroundColor: '#00000088',
            alignItems: 'center',
            justifyContent:
              keyboardStatus == 'Keyboard Shown' && Platform.OS == 'ios'
                ? 'center'
                : 'flex-end',
            zIndex: 200,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            // position: 'absolute',
          }}>
          {/* <ScrollView> */}
          <Wrapper
            // behavior="padding"
            behavior="padding"
            style={{
              height: '50%',
              width: '100%',
              backgroundColor: 'white',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              padding: 20,
            }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => console.log('hello')}>
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-SemiBold',
                  fontSize: 16,
                  color: 'black',
                }}>
                Report this post
              </Text>
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-Regular',
                  fontSize: 14,
                  color: 'grey',
                  marginTop: 10,
                }}>
                If someone is in immediate danger, get help before reporting to
                Towntalk. Don't wait.
              </Text>
              <TextInput
                value={reportReason}
                onChangeText={text => setReportReason(text)}
                style={{
                  backgroundColor: '#ccc',
                  height: 100,
                  borderRadius: 10,
                  color: 'black',
                  padding: 10,
                  marginTop: 15,
                }}
                placeholder="Why do you want to report this post?"
                placeholderTextColor="grey"
                numberOfLines={4}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity
                onPress={() => {
                  reportUser({
                    Auth: userData.token,
                    message: reportReason,
                    post_id: reportId,
                  })
                    .then(res => {
                      console.log('res of report', res);
                    })
                    .catch(err => {
                      console.log('err in report', err);
                    });
                  setShowReportModal(false);
                }}
                style={{
                  width: '100%',
                  height: 50,
                  backgroundColor: '#5F95F0',
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
                  Report
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  reportUser({
                    Auth: userData.token,
                    message: reportReason,
                    post_id: reportId,
                  })
                    .then(res => {
                      console.log('res of report', res);
                    })
                    .catch(err => {
                      console.log('err in report', err);
                    });
                  blockUser({
                    Auth: userData.token,
                    block_user_id: blockuserId,
                  })
                    .then(res => {
                      console.log('res of block', res);
                      setChange(!change);
                    })
                    .catch(err => {
                      console.log('err in block', err);
                    });
                  setShowReportModal(false);
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
                  Report & block user
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Wrapper>
          {/* </ScrollView> */}
        </TouchableOpacity>
      </Modal>
    );
  };
  const DeleteModal = () => {
    const Wrapper = Platform.OS == 'ios' ? KeyboardAvoidingView : View;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModal}
        onRequestClose={() => setDeleteModal(false)}>
        <TouchableOpacity
          onPress={() => setDeleteModal(false)}
          style={{
            flex: 1,
            // height: hp(100),
            backgroundColor: '#00000088',
            alignItems: 'center',
            justifyContent: 'flex-end',
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
              height: '50%',
              width: '100%',
              backgroundColor: 'white',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              padding: 20,
            }}>
            <Text
              style={{
                fontFamily: 'MontserratAlternates-SemiBold',
                fontSize: 16,
                color: 'black',
              }}>
              Delete this post
            </Text>
            <View style={{alignItems: 'center', marginVertical: 15}}>
              <Icon4 name="trash-bin-sharp" size={50} color="red" />
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                Are you sure?
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'MontserratAlternates-Regular',
                fontSize: 14,
                color: 'grey',
                marginTop: 0,
              }}>
              Once deleted, you will not be able to recover this Post!
            </Text>
            <TouchableOpacity
              onPress={() => {
                deletePostApi({
                  Auth: userData.token,
                  post_id: reportId,
                })
                  .then(res => {
                    console.log('res of delete', res);
                    setChange(!change);
                  })
                  .catch(err => {
                    console.log('err in delete', err);
                  });
                setDeleteModal(false);
              }}
              style={{
                width: '100%',
                height: 50,
                backgroundColor: 'red',
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
                Delete Post
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDeleteModal(false);
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
                Cancel
              </Text>
            </TouchableOpacity>
          </Wrapper>
        </TouchableOpacity>
      </Modal>
    );
  };
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
  const mediaModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={focusMedia}
        onRequestClose={() => {
          setFocusMedia(false);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '90%',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() => setFocusMedia(false)}
              style={{
                height: 30,
                width: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon1 color={'white'} size={25} name="squared-cross" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: '85%',
              width: '100%',
              // backgroundColor: 'red',
              alignItems: 'center',
              justifyContent: 'center',
              // backgroundColor: 'red',
              // borderRadius: 25,
            }}>
            {media.substring(media.length - 4) == '.jpg' ? (
              <Image
                source={{uri: media}}
                style={{height: '100%', width: '100%'}}
                resizeMode="contain"
              />
            ) : (
              <VideoCompModal source={media} />
            )}

            {/* <ActivityIndicator size="small" color="black" /> */}
          </View>
        </View>
      </Modal>
    );
  };
  const renders = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        setShowModal(false);
        navigation.navigate('SingleChat', {
          item: item.user,
          image: specific?.media[0]?.media
            ? specific?.media[0]?.media
            : specific.description,
          items: specific,
        });
      }}
      style={{
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingTop: 5,
        borderRadius: 5,
        paddingHorizontal: 5,
        alignItems: 'center',
        backgroundColor: darkmode ? '#242527' : 'white',
        paddingBottom: 20,
        borderBottomColor: '#ccc',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={
            item.user.image
              ? {uri: item.user.image}
              : require('../../../assets/Images/girl.jpg')
          }
          style={{height: 50, width: 50, borderRadius: 30}}
        />
        <View style={{marginLeft: 10}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'MontserratAlternates-SemiBold',
              color: darkmode ? 'white' : 'black',
            }}>
            {`${item.user.firstname}`}
          </Text>
          {/* <Text
            style={{
              marginTop: 5,
              color: 'black',
              fontFamily: 'MontserratAlternates-Regular',
            }}>
            {/* {item.latestMessage} 
          </Text> */}
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 30,
          width: 30,
          borderRadius: 20,
          backgroundColor: '#5F95F0',
        }}>
        <Icon3 name="send" color="white" size={18} />
      </View>
    </TouchableOpacity>
  );
  const render = ({item, index}) => (
    <Hotspot
      item={item}
      hottest={index == 0 ? true : false}
      check={() => checkPlace(item)}
      checkedIn={() => checked(item)}
      navigation={navigation}
    />
  );
  const focusModalOpener = media => {
    setFocusMedia(!focusMedia);
    setMedia(media);
  };
  useEffect(() => {
    city_posts({Auth: userData.token, location: city})
      .then(res => {
        // console.log('res of city', res);
        setHotspots(res.hotspots);
        setPosts(res.posts);
      })
      .catch(err => {
        console.log('err of city', err);
      });
  }, [refresh]);
  const deletePost = id => {
    setReportId(id);
    setDeleteModal(true);
  };
  const alter = () => {
    // console.log('alter called');
    setChange(!change);
  };
  const handleReport = id => {
    setReportId(id);
    setShowReportModal(true);
  };
  const blockUserComp = id => {
    // console.log('block user id', id);
    setBlockuserId(id);
  };
  const renderItem1 = ({item}) => (
    <Posts
      item={item}
      onShare={() => {
        setSpecific(item);
        setShowModal(true);
      }}
      onPress={() => {
        navigation.navigate('PostDetails', {item});
      }}
      deletePost={deletePost}
      press={alter}
      navigation={navigation}
      tagPress={text => {
        navigation.navigate('Hashes', {tag: item.business_tag});
        console.log('tag press');
      }}
      focusMedia={text => {
        focusModalOpener(text);
      }}
      hashPress={text => {
        console.log('text of hash tag', text);
        navigation.navigate('Hashes', {text});
      }}
      handleReport={handleReport}
      blockuser={blockUserComp}
    />
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
          paddingHorizontal: 15,
          backgroundColor: darkmode ? '#242527' : 'white',
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
          Explore
        </Text>
        <View style={{width: 50}} />
        {/* <Icon1 name="diff-added" size={25} color="black" /> */}
      </View>
      <View style={{paddingHorizontal: 15}}>
        <Text style={{fontSize: 18, color: darkmode ? 'white' : 'black'}}>
          {city}
        </Text>
        {/* <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: darkmode ? 'white' : 'black',
            }}>
            <Text style={{color: 'grey', fontSize: 14}}>Checkins</Text>
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginLeft: 30,
              color: darkmode ? 'white' : 'black',
            }}>
            {' '}
            <Text style={{color: 'grey', fontSize: 14}}>Hottest time</Text>
          </Text>
        </View> */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 16, color: darkmode ? 'white' : 'black'}}>
            Hotspots in {city}
          </Text>
          <Text style={{color: 'grey'}}>See all</Text>
        </View>
        <View>
          <FlatList
            data={hotSpots}
            renderItem={render}
            horizontal
            keyExtractor={item => `${item}a`}
          />
        </View>
        <Text
          style={{
            marginTop: 20,
            fontSize: 16,
            color: darkmode ? 'white' : 'black',
          }}>
          Posts mentioning {city}
        </Text>
        <View style={{height: hotSpots.length > 0 ? '38%' : '75%'}}>
          <FlatList data={posts} renderItem={renderItem1} />
        </View>
      </View>
      {MyModal(showModal)}
      {DeleteModal()}
      {ReportModal()}
      {mediaModal()}
    </SafeAreaView>
  );
};
export default ExploreTowns;
