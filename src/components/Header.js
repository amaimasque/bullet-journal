import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Menu, Divider, useTheme} from 'react-native-paper';

//helpers
import * as DateHelper from 'helpers/DateHelper';

//assets
const MENU = require('images/icons/menu.png');
const CALENDAR = require('images/icons/calendar.png');

export default function Header(props) {
  const [sortBy, setSortBy] = useState('Daily');
  const [isListVisible, setIsListVisible] = useState(false);

  const {colors, fonts} = useTheme();

  let {
    leftComponent,
    leftMainContainerStyle,
    rightComponent,
    rightMainContainerStyle,
    centerMainContainerStyle,
    headerTextStyle,
    iconStyle,
    centerComponent,
    title,
    headerStyle,
    onChangeSort,
    rightHeaderText,
  } = props;

  const handleSort = (item) => {
    setSortBy(item);
    setIsListVisible(false);
  };

  useEffect(() => {
    onChangeSort !== undefined && onChangeSort(sortBy);
  }, [sortBy]);

  return (
    <View
      style={[
        styles.headerContainer,
        headerStyle,
        {backgroundColor: colors.accent, width: useWindowDimensions().width},
      ]}>
      <View style={leftMainContainerStyle}>
        {leftComponent === undefined ? (
          <TouchableOpacity
            onPress={() => props.navigation.toggleDrawer()}
            style={styles.buttonStyle}>
            <Image
              source={MENU}
              style={[styles.iconStyle, {tintColor: colors.text}]}
            />
          </TouchableOpacity>
        ) : (
          leftComponent()
        )}
      </View>
      <View style={[{width: wp('67.5%')}, centerMainContainerStyle]}>
        {centerComponent === undefined ? (
          <Text
            style={[styles.headerStyle, headerTextStyle, {color: colors.text}]}>
            {title === undefined ? '' : title}
          </Text>
        ) : (
          centerComponent()
        )}
      </View>
      <View style={rightMainContainerStyle}>
        {rightComponent === undefined ? (
          <View style={styles.rightComponentContainer}>
            <View style={{alignItems: 'flex-end', width: wp('20%')}}>
              <View>
                {sortBy === 'Daily' && (
                  <View>
                    <Text style={[styles.todayIsText, {color: colors.text}]}>
                      Today is
                    </Text>
                  </View>
                )}
                <Text
                  allowFontScaling={true}
                  minimumFontScale={0.5}
                  adjustsFontSizeToFit={true}
                  style={[styles.sorterText, {color: colors.text}]}
                  onPress={() => setIsListVisible(!isListVisible)}>
                  {sortBy === 'Daily' ? rightHeaderText : sortBy}
                </Text>
              </View>
            </View>
            <Menu
              onDismiss={() => setIsListVisible(false)}
              visible={isListVisible}
              contentStyle={[
                styles.sortByContainer,
                {backgroundColor: colors.background},
              ]}
              anchor={
                <TouchableOpacity
                  onPress={() => setIsListVisible(!isListVisible)}
                  style={styles.buttonStyle}>
                  <Image
                    source={CALENDAR}
                    style={[styles.iconStyle, {tintColor: colors.text}]}
                  />
                </TouchableOpacity>
              }>
              <Menu.Item
                onPress={() => handleSort('Daily')}
                title="Daily"
                titleStyle={{
                  fontSize: 11,
                  fontFamily: fonts.light,
                  color: colors.text,
                }}
                style={{height: hp('5%')}}
              />
              <Divider />
              <Menu.Item
                onPress={() => handleSort('Weekly')}
                title="Weekly"
                titleStyle={{
                  fontSize: 11,
                  fontFamily: fonts.light,
                  color: colors.text,
                }}
                style={{height: hp('5%')}}
              />
              <Divider />
              <Menu.Item
                onPress={() => handleSort('Monthly')}
                title="Monthly"
                titleStyle={{
                  fontSize: 11,
                  fontFamily: fonts.light,
                  color: colors.text,
                }}
                style={{height: hp('5%')}}
              />
              <Divider />
              <Menu.Item
                onPress={() => handleSort('Yearly')}
                title="Yearly"
                titleStyle={{
                  fontSize: 11,
                  fontFamily: fonts.light,
                  color: colors.text,
                }}
                style={{height: hp('5%')}}
              />
            </Menu>
          </View>
        ) : (
          rightComponent()
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: hp('8%'),
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    elevation: 20,
  },
  iconStyle: {
    width: wp('7%'),
    height: hp('5%'),
    resizeMode: 'contain',
  },
  headerStyle: {
    fontFamily: 'Roboto-Light',
    fontSize: 14,
  },
  buttonStyle: {
    paddingHorizontal: wp('3%'),
  },
  sortByContainer: {
    borderRadius: 10,
    textAlign: 'center',
    marginTop: hp('5%'),
  },
  rightComponentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('30%'),
  },
  todayIsText: {
    fontSize: 10,
    fontFamily: 'Roboto-Light',
    textAlign: 'right',
  },
  sorterText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    textAlign: 'right',
    height: 20,
    textAlignVertical: 'center',
  },
});
