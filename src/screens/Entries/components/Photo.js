import React from 'react';
import {View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {IconButton} from 'react-native-paper';
import AutoHeightImage from 'react-native-auto-height-image';

export default function Photo(props) {
  let {source, imageStyle, onPressDelete} = props;

  return (
    <View style={{width: '100%', alignItems: 'center', backgroundColor: '#F9F9F9', marginTop: hp('2%')}}>
      <IconButton
        onPress={onPressDelete}
        icon="close"
        size={20}
        color="white"
        style={{elevation: 10, position: 'absolute', right: 0, zIndex: 5}}
      />
      <AutoHeightImage
        width={wp('86%')}
        source={typeof source === 'string' && source !== '' ? {uri: source} : {isStatic: true, uri: source !== undefined ? source.uri : source}}
        style={imageStyle}
      />
    </View>
  );
}