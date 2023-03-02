import React, {useState} from 'react';

import {
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import LikeDislike from './LikeDislike';
import Icon1 from 'react-native-vector-icons/Fontisto';
import Icon2 from 'react-native-vector-icons/AntDesign';
// import Comments from '../../../Components/Comments';
import Icon from 'react-native-vector-icons/Entypo';
const Group = ({item, onPress, page}) => {
  console.log('item', item);
  const renderItem3 = ({item}) => (
    <View
      style={{
        // height: 30,
        // backgroundColor: 'white',
        // marginRight: 10,
        // marginLeft: 3,
        // marginVertical: 3,
        // elevation: 3,
        // alignItems: 'center',
        // justifyContent: 'center',
        // minWidth: 100,
        borderRadius: 5,
      }}>
      <Text
        style={{
          marginRight: 5,
          fontSize: 13,
          fontFamily: 'MontserratAlternates-Medium',
          color: '#5F95F0',
        }}>
        #{item}
      </Text>
    </View>
  );
  const [show, setShow] = useState(false);
  // console.log('item of group', item);
  const arr = ['fun', 'danger', 'helpful', 'adventure', 'hobby'];
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        // height: 30,
        backgroundColor: 'white',
        marginRight: 3,
        elevation: 3,
        // alignItems: 'center',
        // justifyContent: 'center',
        // minWidth: 100,
        marginLeft: 3,
        marginVertical: 3,
        marginTop: 10,
        padding: 12,
        borderRadius: 5,
      }}>
      <View
        style={{
          // marginTop: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <Image
            source={
              item.image
                ? {uri: item.image}
                : require('../assets/Images/girl.jpg')
            }
            style={{width: 50, height: 50, borderRadius: 50}}
          />
          <View style={{marginLeft: 10}}>
            <Text
              style={{
                fontFamily: 'MontserratAlternates-SemiBold',
                fontSize: 16,
                color: 'black',
              }}>
              {item.title}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              {item.status != 'public' && (
                <Icon1 name="locked" color="#5F95F0" size={10} />
              )}

              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'MontserratAlternates-Regular',
                  marginLeft: 5,
                  color: 'black',
                }}>
                {item.status == 'public' ? 'Public Group' : 'Private Group'}
              </Text>
            </View>
          </View>
        </View>
        {/* <Icon
          name="dots-three-horizontal"
          color="black"
          style={{bottom: 10}}
          size={20}
        /> */}
      </View>
      <View
        style={{
          marginTop: 10,
          width: '100%',
          // flexDirection: 'row',
          alignItems: 'center',
          // backgroundColor: 'red',
          overflow: 'hidden',
        }}>
        {/* <FlatList horizontal data={arr} renderItem={renderItem3} /> */}
        {/* {arr.map(item => (
        <View>
          <Text
            style={{
              marginRight: 5,
              fontSize: 13,
              fontFamily: 'MontserratAlternates-Medium',
              color: '#5F95F0',
            }}>
            #{item}
          </Text>
        </View>
      ))} */}
      </View>
      <View style={{marginTop: 10}}>
        <Text
          style={{fontSize: 13, fontFamily: 'MontserratAlternates-Regular'}}>
          {item.description}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            top: 5,
            alignItems: 'center',
          }}>
          {item.members.slice(0, 5).map((item, index) => (
            <View
              style={{
                borderRadius: 30,
                right: index * 15,
                borderColor: 'black',
                borderWidth: 1,
              }}>
              <Image
                source={
                  item.user.image
                    ? {uri: item.user.image}
                    : require('../assets/Images/girl.jpg')
                }
                style={{height: 30, borderRadius: 20, width: 30}}
              />
            </View>
          ))}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
        }}>
        {/* <LikeDislike /> */}
        {/* {page == 'profile' && item.is_member ? (
          <TouchableOpacity
            // onPress={() => {
            //   setLike(!like);
            //   setDislike(false);
            // }}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon2 name="check" size={15} color="#5F95F0" />
            <Text
              style={{
                color: '#5F95F0',
                fontFamily: 'MontserratAlternates-Medium',
                marginLeft: 5,
                fontSize: 13,
              }}>
              Joined
            </Text>
          </TouchableOpacity>
        ) : null} */}

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {!show && (
            <TouchableOpacity
              //   onPress={() => setShow(true)}
              // onPress={() => {
              //   setLike(!like);
              //   setDislike(false);
              // }}
              style={{
                flexDirection: 'row',
                marginLeft: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#5F95F0',
                  fontFamily: 'MontserratAlternates-Medium',
                  marginLeft: 5,
                  fontSize: 13,
                }}>
                {item.member_count}{' '}
                {item.member_count > 1 ? 'Members' : 'Member'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {show && (
        <>
          <View
            style={{
              marginTop: 30,
            }}>
            <TouchableOpacity onPress={() => setShow(false)}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'MontserratAlternates-SemiBold',
                }}>
                Comments
              </Text>
            </TouchableOpacity>

            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <Image
                  source={require('../assets/Images/girl.jpg')}
                  style={{width: 50, height: 50, borderRadius: 50}}
                />
                <View style={{marginLeft: 10}}>
                  <Text
                    style={{
                      fontFamily: 'MontserratAlternates-SemiBold',
                      fontSize: 16,
                      color: '#5F95F0',
                    }}>
                    Kurt Mailey
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
                  fontSize: 13,
                  fontFamily: 'MontserratAlternates-Regular',
                }}>
                Nov 15, 2015
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'MontserratAlternates-Regular',
                marginTop: 10,
              }}>
              After reading Clayton Christensen, Geoffery Moore and Steve Blank,
              I was expacting a lot from Lean Startup by Eric Ries. I was
              disappointed...
            </Text>
          </View>
          <View
            style={{
              marginTop: 30,
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
                  source={require('../assets/Images/girl.jpg')}
                  style={{width: 50, height: 50, borderRadius: 50}}
                />
                <View style={{marginLeft: 10}}>
                  <Text
                    style={{
                      fontFamily: 'MontserratAlternates-SemiBold',
                      fontSize: 16,
                      color: '#5F95F0',
                    }}>
                    Kurt Mailey
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
                  fontSize: 13,
                  fontFamily: 'MontserratAlternates-Regular',
                }}>
                Nov 15, 2015
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'MontserratAlternates-Regular',
                marginTop: 10,
              }}>
              After reading Clayton Christensen, Geoffery Moore and Steve Blank,
              I was expacting a lot from Lean Startup by Eric Ries. I was
              disappointed...
            </Text>
          </View>
          <View
            style={{
              marginTop: 30,
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
                  source={require('../assets/Images/girl.jpg')}
                  style={{width: 50, height: 50, borderRadius: 50}}
                />
                <View style={{marginLeft: 10}}>
                  <Text
                    style={{
                      fontFamily: 'MontserratAlternates-SemiBold',
                      fontSize: 16,
                      color: '#5F95F0',
                    }}>
                    Kurt Mailey
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
                  fontSize: 13,
                  fontFamily: 'MontserratAlternates-Regular',
                }}>
                Nov 15, 2015
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'MontserratAlternates-Regular',
                marginTop: 10,
              }}>
              After reading Clayton Christensen, Geoffery Moore and Steve Blank,
              I was expacting a lot from Lean Startup by Eric Ries. I was
              disappointed...
            </Text>
          </View>
        </>
      )}
      {/* <Text style={{color: '#5F95F0', fontWeight: 'bold'}}>#{item}</Text> */}
    </TouchableOpacity>
  );
};

export default Group;
