import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import {likeDislike} from '../lib/api';
const LikeDislike = props => {
  const {userData, darkmode} = useSelector(({USER}) => USER);
  const {item, press} = props;
  const [like, setLike] = useState(item?.is_like == true ? true : false);
  const [dislike, setDislike] = useState(item?.is_like == false ? true : false);
  // useEffect(() => {
  //   setLike(item.is_like == true ? true : false);
  //   setDislike(item.is_like == false ? false : true);
  // }, []);
  // console.log('like of component', like);
  // console.log('like of api', item.is_like);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'blue',
        width: '100%',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => {
          // setLike(!like);
          press();
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
              // press();
            })
            .catch(err => {
              console.log('err', err);
            });
        }}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon
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
          {item?.like_count}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          // setDislike(!dislike);
          press();
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
              console.log('res', res);
            })
            .catch(err => {
              console.log('err', err);
            });
        }}
        style={{flexDirection: 'row', marginLeft: 20, alignItems: 'center'}}>
        <Icon
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
          {item?.dislike_count}
        </Text>
      </TouchableOpacity>
      <View />
    </View>
  );
};

export default LikeDislike;
