import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useTheme} from 'react-native-paper';
const BULLET = require('assets/images/icons/bullet-list.png');
const EMOJIS = require('assets/images/icons/happy.png');
const EMBELLISHMENT = require('assets/images/icons/art-design.png');
const FONTCOLOR = require('assets/images/icons/text-color.png');

export default function BottomToolBar(props) {
  const {colors} = useTheme();
  let {
    onPressBullet,
    onPressEmoji,
    onPressDesign,
    bulletLineFocused,
    onPressFontColor,
  } = props;

  return (
    <View
      style={[
        styles.mainContainer,
        {
          width: useWindowDimensions().width,
          backgroundColor: colors.headerAccent,
        },
      ]}>
      <TouchableOpacity
        onPress={onPressBullet}
        style={[
          {marginHorizontal: wp('5%')},
          // bulletLineFocused && {
          //   backgroundColor: colors.background,
          //   padding: hp('2%'),
          // },
        ]}>
        <Image
          source={BULLET}
          style={[
            styles.buttonIcon,
            {tintColor: colors.text},
            // bulletLineFocused && {height: hp('2%'), width: hp('2%')},
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressEmoji}>
        <Image
          source={EMOJIS}
          style={[styles.buttonIcon, {tintColor: colors.text}]}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressDesign} style={{marginLeft: wp('5%')}}>
        <Image
          source={EMBELLISHMENT}
          style={[styles.buttonIcon, {tintColor: colors.text}]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPressFontColor}
        style={{marginLeft: wp('5%')}}>
        <Image
          source={FONTCOLOR}
          style={[styles.buttonIcon, {tintColor: colors.text}]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    // position: 'absolute',
    // bottom: 0,
    height: hp('7%'),
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    height: hp('4%'),
    width: hp('4%'),
    resizeMode: 'contain',
  },
});
