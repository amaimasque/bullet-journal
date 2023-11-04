import React from 'react';
import {View, StatusBar, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useTheme} from 'react-native-paper';

import * as DateHelper from 'helpers/DateHelper';

export default function Calendar(props) {
  let {data, month, year, onPressDay} = props;
  const {colors, fonts} = useTheme();

  const renderWeeks = ({item}) => {
    return (
      <View
        style={[styles.weekDaysContainer, {backgroundColor: colors.accent1}]}>
        <Text
          style={{fontSize: 12, fontFamily: fonts.bold, color: colors.text}}>
          {item.substr(0, 3).toUpperCase()}
        </Text>
      </View>
    );
  };

  const renderMonthDays = ({item}) => {
    let currentDayDate = DateHelper.getCurrentFormattedDate('M/D');
    let isCurrent =  currentDayDate.split('/')[0] !== month.toString()? false : currentDayDate.split('/')[1] === `${item}`,
      filteredNotes = data.filter(
        (i) =>
          DateHelper.formatDate(i.dateAdded, null, 'M/D/YYYY').toString() ===
          `${month}/${item}/${year}`,
      ).length;
    return (
      <TouchableOpacity
        onPress={() => onPressDay(`${month}/${item}/${year}`)}
        style={[
          styles.calendarMonthDaysContainer,
          {borderColor: colors.text, borderBottomWidth: 1, borderRightWidth: 1},
        ]}>
        <Text
          style={[
            styles.dayTextStyle,
            {
              fontFamily: isCurrent ? fonts.bold : fonts.light,
              color: colors.text,
              backgroundColor: isCurrent ? colors.headerAccent : colors.accent2,
            },
          ]}>
          {item}
        </Text>
        <Text
          style={{
            fontFamily: fonts.bold,
            color: colors.accent2,
            marginTop: 20,
            display: filteredNotes !== 0 ? 'flex' : 'none',
            textAlign: 'center',
          }}>
          <Text style={{fontSize: 25, textAlign: 'center'}}>
            {filteredNotes !== 0 && filteredNotes}
          </Text>
          <Text style={{fontSize: 9}}>{'\nnote(s)'}</Text>
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{width: wp('100%'), height: hp('80%')}}>
      <Text
        style={[
          styles.calendarMonthContainer,
          {backgroundColor: colors.headerAccent, color: colors.text},
        ]}>
        {DateHelper.formatDate(`${month} ${year}`, 'M YYYY','MMMM YYYY')}
      </Text>
      <FlatList
        data={DateHelper.getWeekDays()}
        renderItem={renderWeeks}
        keyExtractor={(index) => `week${index}-${Date.now()}`}
        contentContainerStyle={{width: wp('100%')}}
        horizontal
      />
      <FlatList
        data={DateHelper.getMonthDays(`${month}/1/${year}`, 'M/D/YYYY')}
        renderItem={renderMonthDays}
        keyExtractor={(index) => `monthDay${index}-${Date.now()}`}
        contentContainerStyle={{
          width: wp('100%'),
          borderColor: colors.text,
          borderTopWidth: 1,
        }}
        numColumns={7}
        extraData={[month, year]}
        // ItemSeparatorComponent={() => {return <View style={{borderColor: colors.text, borderWidth: 1}}/>}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  weekHeaderContainer: {
    width: wp('40%'),
    minHeight: hp('15%'),
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: 'black',
    borderRightWidth: 0.5,
  },
  calendarMonthContainer: {
    textAlign: 'center',
    fontFamily: 'LoverBunny',
    fontSize: 20,
    height: hp('5%'),
    textAlignVertical: 'center',
  },
  weekDaysContainer: {
    width: wp('100%') / 7,
    height: hp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarMonthDaysContainer: {
    width: wp('100%') / 7,
    height: hp('14.2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayTextStyle: {
    width: 20,
    lineHeight: 20,
    borderRadius: 10,
    fontSize: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
    position: 'absolute',
    top: 5,
    left: 5,
  },
});
