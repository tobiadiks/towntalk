import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  ImageBackground,
  Image,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  Text,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import VideoCompModal from '../../../Components/VideoCompModal';
import Icon3 from 'react-native-vector-icons/Ionicons';

import Icon1 from 'react-native-vector-icons/Entypo';
import {
  likeDislikeProfile,
  blockUser,
  deletePostApi,
  profile,
  reportUser,
} from '../../../lib/api';
import Icons from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/AntDesign';
// import {} from '../../../lib/api';
import Posts from '../../../Components/Posts';
import Group from '../../../Components/Group';
import database from '@react-native-firebase/database';
const UserProfile = ({navigation, route}: {navigation: any; route: any}) => {
  const [profileObject, setProfileObject] = useState({});
  const [like, setLike] = useState(
    profileObject.is_like == true ? true : false,
  );
  const {item} = route.params;
  // console.log('item in profile', item);
  const [dislike, setDislike] = useState(
    profileObject.is_like == false ? true : false,
  );
  const [select, setSelect] = useState('Posts');
  const [specific, setSpecific] = useState({});
  const [reportReason, setReportReason] = useState('');
  const [posts, setPosts] = useState([]);
  const [focusMedia, setFocusMedia] = useState(false);
  const {userData, darkmode} = useSelector(({USER}) => USER);
  const [list, setList] = useState([]);
  const [media, setMedia] = useState('');
  const [change, setChange] = useState(false);
  const [blockuserId, setBlockuserId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [reportId, setReportId] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
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
              height: '45%',
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
              <Icon3 name="trash-bin-sharp" size={50} color="red" />
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
  const deletePost = id => {
    setReportId(id);
    setDeleteModal(true);
  };
  const blockUserComp = id => {
    // console.log('block user id', id);
    setBlockuserId(id);
  };
  const handleReport = id => {
    setReportId(id);
    setShowReportModal(true);
  };
  const focusModalOpener = media => {
    setFocusMedia(!focusMedia);
    setMedia(media);
  };
  const renders = ({item}) => (
    <View>
      {select == 'Groups' ? (
        <Group
          item={item}
          onPress={() => {
            navigation.navigate('GroupDetails', {item});
          }}
          page={'profile'}
        />
      ) : (
        <Posts
          item={item}
          onPress={() => {
            navigation.navigate('PostDetails', {item});
          }}
          onShare={() => {
            setSpecific(item);
            setShowModal(true);
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
      )}
    </View>
  );
  const alter = () => {
    console.log('alter called');
    setChange(!change);
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
  const render = ({item}) => (
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
        alignItems: 'center',
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
              color: item.unread ? 'black' : 'black',
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
      <View style={{alignItems: 'center'}}>
        {/* {item.counter ? (
          <View
            style={{
              backgroundColor: '#5F95F0',
              height: 20,
              width: 20,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 30,
              marginBottom: 5,
            }}>
            <Text style={{color: 'white', fontSize: 12}}>{item.counter}</Text>
            <Text>{moment(item.timestamp).format('DD/MM/YYYY HH:MM')}</Text>
          </View>
        ) : (
          <Text style={{fontSize: 12}}>
            {moment(item.timestamp).format('DD/MM/YYYY HH:MM')}
          </Text>
        )} */}
        {/* <Text
          style={{
            color: 'black',
            fontFamily: 'MontserratAlternates-Regular',
            fontSize: 10,
          }}>
          {item.time}
        </Text> */}
      </View>
    </TouchableOpacity>
  );
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
              maxHeight: '40%',
              minHeight: '20%',
              width: '100%',
              borderRadius: 10,
              backgroundColor: darkmode ? 'black' : 'white',
            }}>
            <View
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
            </View>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 16,
                color: darkmode ? 'white' : 'black',
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Share with contacts
            </Text>
            <View style={{paddingHorizontal: 10}}>
              <FlatList data={list} renderItem={render} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };
  useEffect(() => {
    _usersList();
    profile({Auth: userData.token, id: item.user.id}).then(res => {
      // console.log('resi of profile', JSON.stringify(res));
      setPosts(res.data);
      setProfileObject(res.data);
    });
  }, [change]);
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
  return (
    <View style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
      {/* <ImageBackground
        style={{flex: 1}}
        source={require('../../../assets/Images/back.png')}> */}
      <View
        style={{
          height: 80,
          // backgroundColor: 'white',
          // elevation: 3,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Icons name="arrowleft" size={20} color={'black'} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'MontserratAlternates-SemiBold',
            color: darkmode ? 'white' : 'black',
            // marginLeft: 20,
          }}>
          User Details
        </Text>
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.navigate('Setting')}>
          <Icons name="setting" size={20} color={'black'} />
        </TouchableOpacity>
        {/* <Text style={{fontFamily: 'MontserratAlternates-Regular'}}>
              Chicago, IL 60611, USA
            </Text> */}
      </View>
      <View
        style={{
          paddingHorizontal: 5,
          // backgroundColor: 'white',
          paddingTop: 30,
          flex: 1,
        }}>
        <View style={{alignItems: 'center'}}>
          {userData.userdata.id != item.user.id && (
            <TouchableOpacity
              onPress={
                () =>
                  Alert.alert(
                    'Block user',
                    `Are you sure you want to block ${item.user.firstname}?`,
                    [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          blockUser({
                            Auth: userData.token,
                            block_user_id: item.user.id,
                          })
                            .then(res => {
                              console.log('res', res);
                              navigation.goBack();
                            })
                            .catch(err => {
                              console.log('err', err);
                            });
                        },
                      },
                    ],
                  )

                // navigation.navigate('SingleChat', {item: item.user})
              }
              style={{
                position: 'absolute',
                // backgroundColor: 'blue',
                width: '15%',
                alignItems: 'center',
                left: 0,
                // alignItems: 'flex-end',
                height: 100,
              }}>
              <Text
                style={{
                  color: '#5F95F0',
                  fontFamily: 'MontserratAlternates-Regular',
                  fontSize: 12,
                }}>
                Block
              </Text>
            </TouchableOpacity>
          )}
          <Image
            source={
              item.user.image
                ? {uri: item.user.image}
                : require('../../../assets/Images/girl.jpg')
            }
            style={{height: 100, width: 100, borderRadius: 50}}
          />
          <Text
            style={{
              fontSize: 16,
              color: darkmode ? 'white' : 'black',
              fontFamily: 'MontserratAlternates-SemiBold',
            }}>
            {item.user.firstname}
          </Text>
          <Text
            style={{fontSize: 14, fontFamily: 'MontserratAlternates-Medium'}}>
            {/* {userData.userdata.} */}
          </Text>
          {userData.userdata.id != item.user.id && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SingleChat', {
                  item: item.user,
                  fcm_token: item.user.fcm_token,
                })
              }
              style={{
                position: 'absolute',
                // backgroundColor: 'blue',
                width: '15%',
                alignItems: 'center',
                right: 0,
                // alignItems: 'flex-end',
                height: 100,
              }}>
              <Text
                style={{
                  color: '#5F95F0',
                  fontFamily: 'MontserratAlternates-Regular',
                  fontSize: 12,
                }}>
                Chat
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <TouchableOpacity
            activeOpacity={1}
            // onPress={() => {
            //   userData.userdata.id != item.user.id &&
            //     likeDislikeProfile({
            //       Auth: userData.token,
            //       profile_id: item.user.id,
            //       is_like: 1,
            //     }).then(res => {
            //       alter();
            //     });

            //   // setLike(!like);
            //   // setDislike(false);
            // }}
            style={{
              // flexDirection: 'column',
              alignItems: 'center',
              // backgroundColor: 'red',
              height: 30,
              justifyContent: 'center',
              // flexDirection: 'row',
              width: '50%',
              // borderRightWidth: 1,
              // borderRightColor: 'grey',
            }}>
            {/* <Icon2
              name="arrowup"
              size={20}
              color={profileObject.is_like == true ? '#5F95F0' : 'grey'}
            /> */}
            <Text
              style={{
                fontFamily: 'MontserratAlternates-Regular',
                fontSize: 14,
                color: darkmode ? 'white' : 'black',
                marginLeft: 5,
              }}>
              {profileObject.like_count ? profileObject.like_count : 0}
            </Text>
            <Text style={{color: 'grey', fontSize: 12}}>Total likes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            // onPress={() => {
            //   userData.userdata.id != item.user.id &&
            //     likeDislikeProfile({
            //       Auth: userData.token,
            //       profile_id: item.user.id,
            //       is_like: 0,
            //     })
            //       .then(res => {
            //         console.log('res', res);
            //         alter();
            //       })
            //       .catch(err => {
            //         console.log('err', err);
            //       });
            // }}
            style={{
              // flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              // backgroundColor: 'red',
              height: 50,
              width: '50%',
            }}>
            {/* <Icon2
              name="arrowdown"
              size={20}
              color={profileObject.is_like == false ? '#5F95F0' : 'grey'}
            /> */}
            <Text
              style={{
                fontFamily: 'MontserratAlternates-Regular',
                fontSize: 14,
                color: darkmode ? 'white' : 'black',
                marginLeft: 5,
              }}>
              {profileObject.dislike_count ? profileObject.dislike_count : 0}
            </Text>
            <Text style={{color: 'grey', fontSize: 12}}>Total dislikes</Text>
          </TouchableOpacity>
        </View>
        {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // backgroundColor: 'blue',
              width: '100%',
            }}>
            <TouchableOpacity
              onPress={() => setSelect('Posts')}
              style={{
                // backgroundColor: 'red',
                // height: 40,
                alignItems: 'center',
                borderBottomColor: '#5F95F0',
                borderBottomWidth: select == 'Posts' ? 1 : 0,
                paddingBottom: 10,
                justifyContent: 'center',
                width: '33%',
              }}>
              <Text
                style={{
                  color: select == 'Posts' ? '#5F95F0' : 'grey',
                  fontSize: 14,
                  fontFamily:
                    select == 'Posts'
                      ? 'MontserratAlternates-SemiBold'
                      : 'MontserratAlternates-Regular',
                }}>
                Posts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelect('Groups')}
              style={{
                // backgroundColor: 'green',
                // height: 40,
                borderBottomColor: '#5F95F0',
                borderBottomWidth: select == 'Groups' ? 1 : 0,
                paddingBottom: 10,
                alignItems: 'center',
                justifyContent: 'center',
                width: '33%',
              }}>
              <Text
                style={{
                  color: select == 'Groups' ? '#5F95F0' : 'grey',
                  fontSize: 14,
                  fontFamily:
                    select == 'Groups'
                      ? 'MontserratAlternates-SemiBold'
                      : 'MontserratAlternates-Regular',
                }}>
                Groups
              </Text>
            </TouchableOpacity>
          </View> */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={select == 'Posts' ? posts.posts : posts.groups}
          renderItem={renders}
        />
      </View>
      {/* </ImageBackground> */}
      {MyModal(showModal)}
      {DeleteModal()}
      {ReportModal()}
      {mediaModal()}
    </View>
  );
};
export default UserProfile;
