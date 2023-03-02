import React, {useState, useEffect} from 'react';

import {
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  Image,
  Text,
  ImageBackground,
  TextInput,
} from 'react-native';
import moment from 'moment';
import {darkMode} from '../../../redux/actions';
import {createComment, viewComment} from '../../../lib/api';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/FontAwesome';
const Comments = ({navigation, route}) => {
  const {id} = route.params;
  const {darkmode} = useSelector(({USER}) => USER);
  console.log('darkmode', darkmode);
  const dispatch = useDispatch();
  console.log('id', id);
  const [comments, setComments] = useState([]);
  const {userData} = useSelector(({USER}) => USER);
  const [change, setChange] = useState(false);
  const [comment, setComment] = useState('');
  const [keyboardStatus, setKeyboardStatus] = useState('');
  useEffect(() => {
    viewComment({Auth: userData.token, id}).then(res => {
      console.log('res of comments', res);
      setComments(res.comments);
    });
  }, [change]);
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
                : require('../../../assets/Images/girl.jpg')
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
    createComment({Auth: userData.token, post_id: id, comment}).then(res => {
      setChange(!change);
    });
  };
  // console.log('comm', comments);
  const Wrapper = Platform.OS == 'android' ? View : KeyboardAvoidingView;
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: darkmode ? 'black' : 'white'}}>
      {/* <ImageBackground
        style={{flex: 1}}
        source={require('../../../assets/Images/back.png')}> */}
      <Wrapper behavior="padding" style={{flex: 1}}>
        <View
          style={{
            height: 80,
            backgroundColor: darkmode ? '#242527' : 'white',
            elevation: 3,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            // justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              height: 30,
              width: 30,
              backgroundColor: '#ccc',
              alignItems: 'center',
              borderRadius: 5,
              justifyContent: 'center',
            }}
            onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={20} color={'black'} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'MontserratAlternates-SemiBold',
              color: darkmode ? 'white' : 'black',
              marginLeft: 20,
            }}>
            Comments
          </Text>
          {/* <Text style={{fontFamily: 'MontserratAlternates-Regular'}}>
              Chicago, IL 60611, USA
            </Text> */}
        </View>
        {/* <FlatList horizontal data={arr} renderItem={renderItem} /> */}
        {/* <ScrollView> */}
        <View style={{flex: 1, paddingHorizontal: 15}}>
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {arr.map(item => (
            <View
              style={{
                height: 30,
                backgroundColor: 'white',
                marginRight: 10,
                elevation: 3,
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 100,
                borderRadius: 5,
              }}>
              <Text style={{color: '#5F95F0', fontWeight: 'bold'}}>
                #{item}
              </Text>
            </View>
          ))}
        </View> */}
          {/* <FlatList horizontal data={arr} renderItem={renderItem} /> */}

          <FlatList data={comments} renderItem={renderItems} />
        </View>
        <View
          style={{
            flexDirection: 'row',
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
              width: '80%',
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
      </Wrapper>
      {/* </ImageBackground> */}

      {/* </ScrollView> */}

      {/* <Text>Home</Text> */}
    </SafeAreaView>
  );
};
export default Comments;
