import React, {useState} from 'react';
import {Platform, View, TouchableOpacity, Text} from 'react-native';
import Video from 'react-native-video';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/AntDesign';
const VideoComp = ({item, navigation}) => {
  const [paused, setPaused] = useState(true);
  return (
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
          height: 300,
          width: 300,
          // width: '100%',
          // height: undefined,
          aspectRatio: 1,
          right: 0,
        }}
        // controls={true}
        paused={paused}
        source={{uri: item.msg}}
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('PostDetails', {item: item.screen});
        }}
        style={{
          position: 'absolute',
          height: 300,
          width: 300,
          // height: undefined,
          // aspectRatio: 1,
          // width: '100%',
          alignItems: 'center',
          //   backgroundColor: 'red',
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
      </TouchableOpacity>
    </>
  );
};

export default VideoComp;
