import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useTheme, List} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import HsvColorPicker from 'react-native-hsv-color-picker';

import * as Constants from 'helpers/Constants';
import {AppConsumer} from 'helpers/ThemeContextProvider';
import Header from 'components/Header';
const CHECK = require('images/checked.png');

export default function Personalization(props) {
  const {colors, roundness, fonts} = useTheme();
  const [fontStyle, setFontStyle] = useState('Roboto');
  const [fontColor, setFontColor] = useState(colors.text);
  const [isFontPickerVisible, setIsFontPickerVisible] = useState(false);
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(0);
  const [val, setVal] = useState(1);
  const [theme, setTheme] = useState('Candy');
  const [themeList, setThemeList] = useState([
    {
      title: 'Candy',
      icon: require('assets/images/theme_candy.png'),
    },
    {
      title: 'Dark',
      icon: require('assets/images/theme_dark.png'),
    },
    {
      title: 'Coffee',
      icon: require('assets/images/theme_coffee.png'),
    },
    {
      title: 'Evergreen',
      icon: require('assets/images/theme_evergreen.png'),
    },
    {
      title: 'Seas',
      icon: require('assets/images/theme_seas.png'),
    },
    {
      title: 'Banana',
      icon: require('assets/images/theme_banana.png'),
    },
  ]);
  const [expanded, setExpanded] = React.useState(false);
  const [fontStyleList, setFontStyleList] = useState([
    'Big Shoulders Display',
    'Mali',
    'Montserrat',
    'Open Sans',
  ]);

  function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
      (s = h.s), (v = h.v), (h = h.h);
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  const renderFontStyles = ({item, index}) => {
    return (
      <AppConsumer>
        {(appConsumer) => (
          <List.Item
            onPress={() => {
              handleOnPressFontStyle(item);
              appConsumer.updateFont(item.replace(/\s+/g, ''));
            }}
            titleStyle={{fontFamily: fonts.regular}}
            title={item}
            style={{fontFamily: fonts.regular, backgroundColor: colors.accent1}}
          />
        )}
      </AppConsumer>
    );
  };

  const renderTheme = ({item, index}) => {
    let {title, icon} = item;
    let checked = theme === title;
    return (
      <View style={{width: wp('40%'), padding: wp('3%')}}>
        <Text
          style={{
            fontFamily: fonts.light,
            color: colors.text,
            fontSize: 12,
            marginBottom: 5,
          }}>
          {title}
        </Text>
        <AppConsumer>
          {(appConsumer) => (
            <TouchableOpacity
              onPress={() => {
                setTheme(title);
                appConsumer.updateTheme(title.toLowerCase());
              }}>
              {checked && (
                <View style={styles.checkContainer}>
                  <Image source={CHECK} style={styles.checkIcon} />
                </View>
              )}
              <Image source={icon} style={styles.themeIcon} />
            </TouchableOpacity>
          )}
        </AppConsumer>
      </View>
    );
  };

  const handleOnPressFontStyle = (font) => {
    let newFontStyleList = [];
    fontStyleList.map((i) => {
      i !== font && newFontStyleList.push(i);
    });
    newFontStyleList.push(fontStyle);
    setFontStyleList(newFontStyleList);
    setFontStyle(font);
    setExpanded(false);
  };

  useEffect(() => {
    let color = HSVtoRGB(hue, sat, val);
    setFontColor(`rgb(${color.r}, ${color.g}, ${color.b})`);
  }, [hue, sat, val]);

  return (
    <View style={{flex: 1}}>
      <Header
        {...props}
        headerStyle={{position: 'absolute', top: 0}}
        title="Personalization"
        rightComponent={() => {
          return null;
        }}
      />
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={styles.contentContainerStyle}
        style={{
          backgroundColor: colors.background,
        }}>
        
        <View style={[styles.subcontainer, styles.fontStyleContainer]}>
          <Text
            style={[
              styles.labelStyle,
              {
                fontFamily: fonts.light,
                color: colors.text,
              },
            ]}>
            Font Style
          </Text>
          <List.Accordion
            style={{width: wp('55%'), backgroundColor: colors.accent1}}
            title={fontStyle}
            expanded={expanded}
            onPress={() => setExpanded(!expanded)}>
            <FlatList
              data={fontStyleList.sort()}
              renderItem={renderFontStyles}
              keyExtractor={(index) => `fontStyle${index}`}
            />
          </List.Accordion>
        </View>
        <View style={{width: wp('80%'), marginTop: hp('3%')}}>
          <Text
            style={{
              fontFamily: fonts.medium,
              color: colors.text,
              fontSize: 10,
            }}>
            Preview
          </Text>
          <Text
            style={[
              styles.fontText,
              {
                backgroundColor: colors.background,
                borderColor: colors.text,
                fontFamily: fonts.regular,
                color: colors.text,
              },
            ]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pharetra in risus non maximus. Pellentesque facilisis dolor et justo
            laoreet congue. Cras sed mauris libero.
          </Text>
        </View>
        <View style={styles.subcontainer}>
          <Text
            style={[
              styles.labelStyle,
              {
                fontFamily: fonts.light,
                color: colors.text,
              },
            ]}>
            Font Color
          </Text>
          <AppConsumer>
            {(appConsumer) => (
              <TouchableOpacity
                onPress={() => {
                  let color = HSVtoRGB(hue, sat, val);
                  isFontPickerVisible &&
                    appConsumer.updateFontColor(
                      `rgb(${color.r}, ${color.g}, ${color.b})`,
                    );
                  setIsFontPickerVisible(!isFontPickerVisible);
                }}
                style={[
                  styles.fontColorViewer,
                  {backgroundColor: fontColor, borderColor: colors.text},
                ]}
              />
            )}
          </AppConsumer>
        </View>
        <View style={{display: isFontPickerVisible ? 'flex' : 'none'}}>
          <HsvColorPicker
            huePickerHue={hue}
            onHuePickerDragMove={({hue}) => setHue(hue)}
            onHuePickerPress={({hue}) => setHue(hue)}
            satValPickerHue={hue}
            satValPickerSaturation={sat}
            satValPickerValue={val}
            onSatValPickerDragMove={({saturation, value}) => {
              setSat(saturation);
              setVal(value);
            }}
            onSatValPickerPress={({saturation, value}) => {
              setSat(saturation);
              setVal(value);
              console.warn(saturation, value);
            }}
          />
        </View>
        <View style={{width: wp('80%')}}>
          <Text
            style={[
              styles.labelStyle,
              {
                fontFamily: fonts.light,
                color: colors.text,
              },
            ]}>
            Theme
          </Text>
          <View>
            <FlatList
              nestedScrollEnabled={true}
              numColumns={2}
              data={themeList}
              renderItem={renderTheme}
              extraData={theme}
              keyExtractor={(index) => `theme${index}`}
              // style={{flexWrap: 'wrap'}}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    // height: hp('100%') - StatusBar.currentHeight,
    paddingHorizontal: wp('10%'),
  },
  subcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('80%'),
  },
  labelStyle: {
    textAlignVertical: 'center',
    width: wp('25%'),
    height: 65,
  },
  fontText: {
    borderWidth: 1,
    width: wp('80%'),
    padding: 10,
    marginTop: 5,
  },
  fontStyleContainer: {
    marginTop: hp('11%'),
    alignItems: 'flex-start',
  },
  fontColorViewer: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
  },
  checkContainer: {
    zIndex: 5,
    position: 'absolute',
    width: wp('34%'),
    height: hp('11%'),
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  themeIcon: {
    width: wp('34%'),
    height: hp('11%'),
    resizeMode: 'contain',
  },
});
