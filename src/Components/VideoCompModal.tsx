import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
const VideoCompModal = ({source}) => {
  const [paused, setPaused] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const handleExitFullScreen = () => {
    setFullscreen(false);
  };

  const handleEnterFullscreen = () => {
    setFullscreen(true);
  };
  return (
    <VideoPlayer
      source={{uri: source}}
      onEnd={() => setPaused(true)}
      repeat={Platform.OS === 'ios' ? true : false}
      //   onBack=
      poster={
        'https://towntalkapp.com/app/public/assets/thumbnail/thumbnail.png'
      }
      posterResizeMode="contain"
      fullscreen={fullscreen}
      ignoreSilentSwitch={'ignore'}
      disableBack
      onError={err => console.warn(err)}
      onEnterFullscreen={handleEnterFullscreen}
      onExitFullscreen={handleExitFullScreen}
      controls={false}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
        //   height: props.modal
        //     ? props.data.summary
        //       ? '80%'
        //       : '95%'
        //     : props.data.summary
        //     ? 175
        //     : 225,
        right: 0,
        borderRadius: 10,
        //   borderTopRightRadius: 10,
      }}
      // controls={true}
      paused={paused}
      // navigator={this.props.navigator}
    />
  );
};
export default VideoCompModal;
