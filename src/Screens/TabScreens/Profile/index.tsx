import React, {useState, useCallback, useEffect} from 'react';

import {
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  Text,
  ImageBackground,
} from 'react-native';
import MentionHashtagTextView from 'react-native-mention-hashtag-text';
import moment from 'moment';
import Icon3 from 'react-native-vector-icons/Entypo';
import {profile, likeDislike} from '../../../lib/api';
import LikeDislike from '../../../Components/LikeDislike';
import Icon4 from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Entypo';
import Posts from '../../../Components/Posts';
import Group from '../../../Components/Group';
import {darkMode} from '../../../redux/actions';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Thumb from 'react-native-vector-icons/Feather';
const Profile = ({navigation}) => {
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [select, setSelect] = useState('Posts');
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [change, setChange] = useState(false);
  const [data, setData] = useState({});
  const {userData, darkmode} = useSelector(({USER}) => USER);
  const [showModal, setShowModal] = useState(false);
  const [specific, setSpecific] = useState({});
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const alter = () => {
    console.log('alter called');
    setChange(!change);
  };
  const renders = ({item}) => (
    <View>
      {select == 'Groups' ? (
        <Group
          item={item}
          onPress={() => {
            navigation.navigate('GroupDetails', {item});
          }}
          page={'s'}
        />
      ) : (
        // <Text>Hello</Text>
        // <Posts
        //   item={item}
        //   onPress={() => {
        //     navigation.navigate('PostDetails', {item});
        //   }}
        //   onShare={() => {
        //     setSpecific(item);
        //     setShowModal(true);
        //   }}
        //   press={alter}
        //   navigation={navigation}
        //   hashPress={text => {
        //     console.log('text of hash tag', text);
        //     navigation.navigate('Hashes', {text});
        //   }}
        // />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('PostDetails', {item})}
          style={{
            // height: 30,
            backgroundColor: darkmode ? 'black' : 'white',
            marginRight: 3,
            // elevation: 3,
            // alignItems: 'center',
            // justifyContent: 'center',
            // minWidth: 100,
            marginLeft: 3,
            marginVertical: 3,
            marginTop: 10,
            padding: 12,
            borderRadius: 20,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfile', {item})}
            style={{
              // marginTop: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={
                  item?.user?.image
                    ? {uri: item?.user?.image}
                    : require('../../../assets/Images/girl.jpg')
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
                    color: 'grey',
                  }}>
                  {item?.created_at}
                  {/* {moment(item?.created_at).format('DD MMMM YYYY HH:MM a')} */}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View
            style={{
              marginTop: 10,
              width: '100%',
              // flexDirection: 'row',
              // alignItems: 'center',
              flexDirection: 'row',

              // backgroundColor: 'red',
              overflow: 'hidden',
            }}></View>
          <View style={{marginTop: 10}}>
            <MentionHashtagTextView
              numberOfLines={5}
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
            {item?.media[0]?.media && (
              <Image
                source={
                  item?.media[0]?.media
                    ? {uri: item?.media[0]?.media}
                    : require('../../../assets/Images/social.jpg')
                }
                resizeMode="cover"
                style={{
                  height: undefined,
                  aspectRatio: 1,
                  borderRadius: 10,
                  width: '100%',
                  marginTop: 10,
                }}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
              // backgroundColor: 'red',
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '50%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  // setLike(!like);
                  alter();
                  // Alert.alert('like ', item.like_count.toString());
                  // setDislike(false);
                  // setDislikeCount(
                  //   item?.is_like == false
                  //     ? item?.dislike_count - 1
                  //     : item?.dislike_count,
                  // );
                  // setLikeCount(
                  //   item?.is_like == true ? item?.like_count - 1 : item?.like_count + 1,
                  // );
                  // press();
                  likeDislike({
                    Auth: userData?.token,
                    creator_id: item?.user?.id,
                    post_id: item?.id,
                    is_like: 1,
                  })
                    .then(res => {
                      console.log('res', res);
                      alter();
                    })
                    .catch(err => {
                      console.log('err', err);
                    });
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Thumb
                  name="thumbs-up"
                  size={20}
                  color={item?.is_like == true ? '#5F95F0' : 'grey'}
                  // color={like == true ? '#5F95F0' : 'grey'}
                />
                <Text
                  style={{
                    fontFamily: 'MontserratAlternates-Regular',
                    fontSize: 13,
                    marginLeft: 5,
                    color: darkmode ? 'white' : 'black',
                  }}>
                  {item?.like_count.toString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // setDislike(!dislike);

                  // Alert.alert('dislike', item?.dislike_count);
                  // setLike(false);
                  // setLikeCount(
                  //   item?.is_like == true ? item?.like_count - 1 : item?.like_count,
                  // );
                  // setDislikeCount(
                  //   item?.is_like == false
                  //     ? item?.dislike_count - 1
                  //     : item?.dislike_count + 1,
                  // );

                  likeDislike({
                    Auth: userData?.token,
                    creator_id: item?.user?.id,
                    post_id: item?.id,
                    is_like: 0,
                  })
                    .then(res => {
                      alter();
                    })
                    .catch(err => {
                      console.log('err', err);
                    });
                }}
                style={{
                  flexDirection: 'row',
                  marginLeft: 20,
                  alignItems: 'center',
                }}>
                <Thumb
                  name="thumbs-down"
                  size={20}
                  color={item?.is_like == false ? '#5F95F0' : 'grey'}
                  // color={dislike == false ? '#5F95F0' : 'grey'}
                />
                <Text
                  style={{
                    fontFamily: 'MontserratAlternates-Regular',
                    fontSize: 13,
                    marginLeft: 5,
                    color: darkmode ? 'white' : 'black',
                  }}>
                  {item?.dislike_count.toString()}
                </Text>
              </TouchableOpacity>
              <View />
            </View>
            {/* <LikeDislike item={item} press={alter} /> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '50%',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Comments', {id: item.id})}
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
                <Icon2
                  name="comment"
                  size={25}
                  color={darkmode ? 'white' : 'black'}
                />
                <Text
                  style={{
                    fontFamily: 'MontserratAlternates-Regular',
                    marginLeft: 5,
                    color: 'grey',
                    fontSize: 13,
                  }}>
                  {item?.comment_count}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSpecific(item);
                  setShowModal(true);
                  // onShare();
                }}
                style={{
                  flexDirection: 'row',
                  width: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Thumb name="send" size={16} color={'grey'} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
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
      // <Modal animationType="slide" transparent={true} visible={show}>
      //   <View
      //     style={{
      //       flex: 1,
      //       // height: hp(100),
      //       backgroundColor: '#00000088',
      //       alignItems: 'center',
      //       justifyContent: 'center',
      //       zIndex: 200,
      //       left: 0,
      //       top: 0,
      //       right: 0,
      //       bottom: 0,
      //       // position: 'absolute',
      //     }}>
      //     <View
      //       style={{
      //         height: '60%',
      //         width: '90%',
      //         borderRadius: 10,
      //         backgroundColor: 'white',
      //       }}>
      //       <View
      //         style={{
      //           flexDirection: 'row',
      //           justifyContent: 'flex-end',
      //           marginTop: 15,
      //           marginRight: 15,
      //         }}>
      //         <Icon1
      //           name="circle-with-cross"
      //           size={20}
      //           color="black"
      //           onPress={() => setShowModal(false)}
      //         />
      //       </View>
      //       <View style={{paddingHorizontal: 10}}>
      //         <FlatList data={list} renderItem={render} />
      //       </View>
      //     </View>
      //   </View>
      // </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}>
        <TouchableOpacity
          onPress={() => setShowModal(!showModal)}
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
              {/* <Icon
                name="circle-with-cross"
                size={20}
                color="black"
                onPress={() => setShowModal(false)}
              /> */}
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
            <View style={{paddingHorizontal: 10, marginBottom: 20}}>
              <FlatList data={list} renderItem={render} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };
  useEffect(() => {
    _usersList();
    profile({Auth: userData.token, id: userData.userdata.id}).then(res => {
      console.log('res', JSON.stringify(res));
      setPosts(res.data);
    });
  }, [change]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      profile({Auth: userData.token, id: userData.userdata.id}).then(res => {
        // console.log('res of profile', JSON.stringify(res));
        setPosts(res.data);
      });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
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
        <View style={{width: 20}} />
        <View style={{marginLeft: 0}}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'MontserratAlternates-SemiBold',
              color: darkmode ? 'white' : 'black',
            }}>
            Profile
          </Text>
        </View>
        <TouchableOpacity
          style={{
            height: 30,
            backgroundColor: 'white',
            width: 30,
            borderRadius: 10,
            elevation: 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.navigate('Setting');
          }}>
          <Icon
            name="settings-sharp"
            color={'black'}
            size={20}
            // onPress={() => navigation.navigate('Setting')}
          />
        </TouchableOpacity>
        {/* <Icon
          name="settings-sharp"
          color={'black'}
          size={20}
          onPress={() => navigation.navigate('Setting')}
        /> */}
        {/* <Icon
            name="log-out"
            color={'black'}
            size={20}
            onPress={() => logoutuser(false)(dispatch)}
          /> */}
      </View>
      <View
        style={{
          // paddingHorizontal: 15,
          // backgroundColor: 'red',
          marginTop: 30,
          flex: 1,
        }}>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              width: 105,
              height: 105,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 55,
              backgroundColor: '#5F95F0',
            }}>
            <Image
              source={
                userData?.userdata?.image
                  ? {uri: userData?.userdata?.image}
                  : require('../../../assets/Images/girl.jpg')
              }
              style={{height: 100, width: 100, borderRadius: 50}}
            />
          </View>

          <Text
            style={{
              fontSize: 16,
              color: darkmode ? 'white' : 'black',
              fontFamily: 'MontserratAlternates-SemiBold',
            }}>
            {userData?.userdata?.fullname}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: 'grey',
              fontFamily: 'MontserratAlternates-Medium',
            }}>
            {userData?.userdata?.firstname}
          </Text>

          {/* <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={{
              position: 'absolute',
              // backgroundColor: 'blue',
              width: '100%',

              alignItems: 'flex-end',
              height: 100,
            }}>
            <Text
              style={{
                color: '#5F95F0',
                fontFamily: 'MontserratAlternates-Regular',
                fontSize: 12,
              }}>
              Edit
            </Text>
          </TouchableOpacity> */}
        </View>
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'space-between',
            alignItems: 'center',
            // backgroundColor: 'red',
            marginTop: 10,
          }}>
          <TouchableOpacity
            activeOpacity={1}
            // onPress={() => {
            //   setLike(!like);
            //   setDislike(false);
            // }}
            style={{
              // flexDirection: 'column',
              alignItems: 'center',
              // backgroundColor: 'red',
              flexDirection: 'row',
              // height: 30,
              justifyContent: 'flex-end',
              paddingRight: 20,
              // flexDirection: 'row',
              width: '50%',
              // borderRightWidth: 1,
              // borderRightColor: 'grey',
            }}>
            {/* <Icon2
              name="arrowup"
              size={20}
              color={like ? '#5F95F0' : 'black'}
            /> */}
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-SemiBold',
                  fontSize: 16,
                  color: darkmode ? 'white' : 'black',
                  // marginLeft: 5,
                }}>
                {posts?.like_count ? posts?.like_count : 0}
              </Text>
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-Regular',
                  fontSize: 12,
                  color: 'grey',
                  marginTop: 5,
                }}>
                Total likes
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            // onPress={() => {
            //   setDislike(!dislike);
            //   setLike(false);
            // }}
            style={{
              // flexDirection: 'column',
              alignItems: 'center',
              // backgroundColor: 'red',
              flexDirection: 'row',
              // height: 30,
              justifyContent: 'flex-start',
              paddingLeft: 20,
              // flexDirection: 'row',
              width: '50%',
              // borderRightWidth: 1,
              // borderRightColor: 'grey',
            }}>
            {/* <Icon2
              name="arrowdown"
              size={20}
              color={dislike ? '#5F95F0' : 'black'}
            /> */}
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-SemiBold',
                  fontSize: 16,
                  color: darkmode ? 'white' : 'black',
                }}>
                {posts?.dislike_count ? posts?.dislike_count : 0}
              </Text>
              <Text
                style={{
                  fontFamily: 'MontserratAlternates-Regular',
                  fontSize: 12,
                  color: 'grey',
                  marginTop: 5,
                }}>
                Total dislikes
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={{
              width: 200,
              height: 40,
              backgroundColor: '#200E32',
              marginTop: 10,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'MontserratAlternates-SemiBold',
              }}>
              Edit profile
            </Text>
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
          data={select == 'Posts' ? posts?.posts : posts?.groups}
          renderItem={renders}
        />
      </View>
      {/* <Text>abc</Text> */}
      {/* </ImageBackground> */}
      {MyModal(showModal)}
    </SafeAreaView>
  );
};
export default Profile;
