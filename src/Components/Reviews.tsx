import React from 'react';
import {TouchableOpacity, View, ScrollView, Image, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import StarRating from 'react-native-star-rating';
const Reviews = ({item}) => {
  return (
    <View
      style={{
        height: hp(20),
        width: wp(85),
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        marginTop: 10,
        backgroundColor: '#ccc',
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
          <Text style={{fontWeight: '600', fontSize: 16, color: 'black'}}>
            {item?.user?.firstname}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 0,
              alignItems: 'center',
            }}>
            <StarRating
              maxStars={5}
              starSize={20}
              fullStarColor={'lightgreen'}
              rating={item.rating}
              // style={{marginTop: 10}}
              //   selectedStar={rating => setStars(rating)}
            />
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                marginLeft: 5,

                fontWeight: '600',
              }}>
              {item.rating}
            </Text>
          </View>
        </View>
      </View>

      <View style={{height: '60%'}}>
        <ScrollView nestedScrollEnabled={true}>
          <Text>{item.feedback}</Text>
        </ScrollView>
      </View>
    </View>
  );
};
export default Reviews;
