import React, {useState, useRef} from 'react';
import {View,ActivityIndicator, Text} from 'react-native';
import Sound from 'react-native-sound';
import Slider from '@react-native-community/slider';
import moment from 'moment';
import SIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Entypo';
const AudioComp = ({audio, me,date}) => {
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [value, setValue] = useState(0);
  const [minimumValue, setMinimumValue] = useState(0);
  const [waiting,setWaiting] = useState(false);
  const whoosh = useRef(null);
// console.log("value",value)
  const playSound = (soundUrl, i) => {
    // console.log('i am called', soundUrl);
    whoosh.current = new Sound(soundUrl, null, error => {
      if (error) {
        console.log('err', error);
        return;
      }
      // loaded successfully
      // console.log('i even came here');
      setDuration(whoosh.current.getDuration());

      // Play the sound with an onEnd callback
      setWaiting(false);
      setPlaying(true);
      whoosh.current.play(success => {
        if (success) {
          setPlaying(false);
          whoosh.current.release();
        } else {
        }
      });
    });

    setInterval(() => {
      whoosh.current.getCurrentTime(seconds => setValue(seconds));
    }, 10);
  };

  const pauseSound = () => {
    whoosh.current.pause();
    setPlaying(false);
  };

  const onValueChange = time => {
    whoosh.current.setCurrentTime(time);
  };
  return (
    <>
    <View
      style={{
        marginRight: 12,
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: me ? '#200E32' : '#EBEBEB',
        padding: 8,
      }}>
        {
          waiting ? <ActivityIndicator size="small" color="white" />:playing ? (
            <SIcon
              name={'pause'}
              size={25}
              color="white"
              onPress={() => pauseSound()}
            />
          ) : (
            <Icon
              name={'controller-play'}
              size={25}
              color="white"
              onPress={() => {
                console.log('noice', audio);
                setWaiting(true)
                playSound(audio, null);
              }}
            />
          )
        }
      {/* {playing ? (
        <SIcon
          name={'pause'}
          size={25}
          color="white"
          onPress={() => pauseSound()}
        />
      ) : (
        <Icon
          name={'controller-play'}
          size={25}
          color="white"
          onPress={() => {
            console.log('noice', audio);
            setWaiting(true)
            playSound(audio, null);
          }}
        />
      )} */}
      <Slider
        style={{width: '80%'}}
        minimumValue={minimumValue}
        maximumValue={duration}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="grey"
        value={value}
        // onSlidingComplete={()=>{console.log("audio completed")}}
        // onValueChange={vv => {
        //   onValueChange(vv);
        // }}
      />
    </View>
    <Text
          style={{
            fontSize: 10,
            marginTop:10,
            fontFamily: 'MontserratAlternates-Regular',
            color:me?"white":
               'grey',
          }}>
          {moment(date).format('MM/DD/YYYY hh:mm a')}
        </Text>
    </>
  );
};
export default AudioComp;
