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
  RefreshControl,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useTheme, IconButton} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

import Header from 'components/Header';
import LoadingModal from 'components/LoadingModal';
import DailyNote from 'components/StickyNote';
import YearlyNote from 'components/YearlyNote';
import Calendar from './components/Calendar';

import * as DateHelper from 'helpers/DateHelper';
import * as Firebase from 'helpers/Firebase';

//images
const EMPTY = {
  candy: require('images/empty_candy.png'),
  coffee: require('images/empty_coffee.png'),
  dark: require('images/empty_dark.png'),
  evergreen: require('images/empty_evergreen.png'),
  seas: require('images/empty_evergreen.png'),
  banana: require('images/empty_coffee.png'),
};
const WRITE = require('images/feather.png');

export default function Entries(props) {
  const [sortBy, setSortBy] = useState('Daily');
  const [viewedDay, setViewedDay] = useState(
    DateHelper.getCurrentFormattedDate('D'),
  );
  const [viewedMonth, setViewedMonth] = useState(
    DateHelper.getCurrentFormattedDate('M'),
  );
  const [viewedYear, setViewedYear] = useState(
    DateHelper.getCurrentFormattedDate('YYYY'),
  );
  const [notes, setNotes] = useState([]);
  const [isLoading, setsLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [userName, setUserName] = useState('');
  const {colors, roundness, fonts} = useTheme();

  useEffect(() => {
    fetchNotes();
    fetchTheme();
    fetchUser();
  }, [props]);

  useEffect(() => {
    try {
      let {selected} = props.route.params;
      selected !== undefined && setSortBy(selected);
    } catch (error) {
      console.warn('Error', error.message);
    }
  }, [props.route.params]);

  const fetchTheme = async () => {
    let theme = await AsyncStorage.getItem('THEME');
    setSelectedTheme(theme);
  };

  const fetchUser = async () => {
    Firebase.fetchUser((data) => {
      setUserName(data.username);
    });
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Image source={EMPTY[selectedTheme]} style={styles.emptyImg} />
        <Text style={[styles.emptyText, {color: colors.text}]}>
          It's empty out here!
        </Text>
      </View>
    );
  };

  const ItemSeparator = (borderBottomColor) => {
    return (
      <View
        style={{
          borderBottomColor,
          borderBottomWidth: 0.5,
        }}
      />
    );
  };

  const filterNotes = (type) => {
    if (type === 'Daily') {
      return notes.filter(
        (item) =>
          DateHelper.formatDate(item.dateAdded, null, 'YYYY-MM-D') ===
          DateHelper.formatDate(
            `${viewedMonth}/${viewedDay}/${viewedYear}`,
            'M/D/YYYY',
            'YYYY-MM-D',
          ),
      );
    } else if (type === 'Weekly') {
      // let currentDay = DateHelper.getCurrentDayOfWeek(),
      //   currentDayDate = DateHelper.getCurrentFormattedDate('D');
      let currentDay = parseInt(
          DateHelper.getCurrentDayOfWeek(
            `${viewedMonth}/${viewedDay}/${viewedYear}`,
          ),
        ),
        currentDayDate = viewedDay;
      // let sunDate = DateHelper.getCurrentFormattedDate(
      //     `YYYY-MM-${parseInt(currentDayDate) - currentDay}`,
      //   ),
      //   satDate = DateHelper.getCurrentFormattedDate(
      //     `YYYY-MM-${7 - currentDay + parseInt(currentDayDate)}`,
      //   );
      let sunDate = DateHelper.formatDate(
        DateHelper.subtractDaysToDate(
          `${parseInt(viewedMonth)}-${parseInt(currentDayDate)}-${viewedYear}`,
          'M/D/YYYY',
          parseInt(currentDay),
        ),
        null,
        'YYYY-MM-D',
      );
      let satDate = DateHelper.formatDate(
        DateHelper.addDaysToDate(sunDate, 'YYYY-MM-D', 6),
        null,
        'YYYY-MM-D',
      );
      let wnotes = notes.filter(
        (item) =>
          new Date(item.dateAdded) >= DateHelper.weekDateFormatter(sunDate) &&
          new Date(item.dateAdded) <= DateHelper.weekDateFormatter(satDate),
      )
      console.warn(wnotes.length)
      return wnotes;
    } else if (type === 'Monthly') {
      let currentMonthDate = DateHelper.getCurrentFormattedDate('MM');
      return notes.filter(
        (item) =>
          currentMonthDate ===
          DateHelper.formatDate(item.dateAdded, null, 'MM'),
      );
    }
  };

  const renderWeekly = ({item, index}) => {
    // let currentDay = DateHelper.getCurrentDayOfWeek(),
    //   currentDayDate = DateHelper.getCurrentFormattedDate('D');
    let currentDay = parseInt(
        DateHelper.getCurrentDayOfWeek(
          `${viewedMonth}/${viewedDay}/${viewedYear}`,
        ),
      ),
      currentDayDate = viewedDay;
    let sunDate = DateHelper.getCurrentFormattedDate(
      `YYYY-MM-${parseInt(currentDayDate) - currentDay}`,
    );
    // );
    // let weekly = filterNotes('Weekly')
    // .filter(
    //   (i) =>
    //     // DateHelper.formatDate(i.dateAdded, null, 'D').toString() === currentDayDate
    //     DateHelper.formatDate(i.dateAdded, null, 'D').toString() ===
    //     (parseInt(sunDate.split('-')[2]) + index).toString(),
    // );
    // console.warn(JSON.stringify(filterNotes('Weekly'), null, '\t'));
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={[
            styles.weekHeaderContainer,
            {backgroundColor: colors.accent1},
          ]}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'LoverBunny',
              color: colors.text,
            }}>
            {item}
          </Text>
        </TouchableOpacity>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={filterNotes('Weekly').filter(
            (i) =>
              // DateHelper.formatDate(i.dateAdded, null, 'D').toString() === currentDayDate
              DateHelper.formatDate(i.dateAdded, null, 'D').toString() ===
              (parseInt(sunDate.split('-')[2]) + index).toString(),
          )}
          renderItem={({item, index}) => {
            console.warn(JSON.stringify(item));
            return (
              <DailyNote
                numContentLines={1}
                disableSwipe={true}
                data={item}
                {...props}
                onPressDelete={() => {
                  setsLoading(true);
                  Firebase.deleteNote(item.id).then(() => {
                    Firebase.fetchNotes((data) => {
                      setNotes(data);
                      setsLoading(false);
                    });
                  });
                }}
                refreshList={fetchNotes}
                containerStyle={{width: wp('50%')}}
                noteStyle={{width: wp('50%')}}
              />
            );
          }}
        />
      </View>
    );
  };

  const renderNotes = () => {
    switch (sortBy) {
      case 'Daily':
        // console.warn('Daily', filterNotes('Daily'));
        return (
          <FlatList
            data={filterNotes('Daily').sort(
              (a, b) => a.dateAdded < b.dateAdded,
            )}
            renderItem={({item, index}) => {
              return (
                <DailyNote
                  data={item}
                  {...props}
                  onPressDelete={() => {
                    setsLoading(true);
                    Firebase.deleteNote(item.id).then(() => {
                      Firebase.fetchNotes((data) => {
                        setNotes(data);
                        setsLoading(false);
                      });
                    });
                  }}
                  refreshList={fetchNotes}
                  // refreshList={() => Firebase.fetchNotes((data) => setNotes(data))}
                />
              );
            }}
            ListEmptyComponent={renderEmpty}
            ItemSeparatorComponent={() => ItemSeparator('#F9F9F9')}
          />
        );
      case 'Weekly':
        return (
          <FlatList
            data={DateHelper.getWeekDays()}
            renderItem={renderWeekly}
            keyExtractor={(index) => `week${index}-${Date.now()}`}
            contentContainerStyle={{width: wp('100%')}}
            ItemSeparatorComponent={() => ItemSeparator(colors.text)}
          />
        );
      case 'Monthly':
        return (
          <Calendar
            data={filterNotes('Monthly')}
            month={viewedMonth}
            year={viewedYear}
            onPressDay={(date) => {
              let arrDate = date.split('/');
              setViewedDay(arrDate[1]);
              setViewedMonth(arrDate[0]);
              setViewedYear(arrDate[2]);
              setSortBy('Daily');
            }}
          />
        );
      case 'Yearly':
      default:
        return (
          <FlatList
            data={getYearsFromNotes(notes)}
            renderItem={renderYearly}
            ListEmptyComponent={renderEmpty}
          />
        );
    }
  };

  const renderYearly = ({item, index}) => {
    // let currentDay = DateHelper.getCurrentDayOfWeek(),
    //   currentDayDate = DateHelper.getCurrentFormattedDate('D');
    // let sunDate = DateHelper.getCurrentFormattedDate(
    //   `YYYY-MM-${parseInt(currentDayDate) - currentDay}`,
    // );
    let yearNotes = getYearlyNotes(item, notes);
    let months = getMonthsFromYearlyNotes(yearNotes);
    return (
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: 'black',
          borderBottomWidth: 0.5,
        }}>
        <TouchableOpacity
          style={[
            styles.yearRowHeaderContainer,
            {backgroundColor: colors.background},
          ]}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'LoverBunny',
              color: colors.text,
            }}>
            {item}
          </Text>
        </TouchableOpacity>
        <ScrollView
          nestedScrollEnabled={true}
          horizontal
          style={{width: wp('60%')}}>
          {months.map((month, indexMonth) => {
            let monthNotes = getMonthlyNotesFromYearlyNotes(month, yearNotes);
            return (
              <View>
                <Text
                  style={{
                    fontFamily: fonts.light,
                    padding: 5,
                    margin: 5,
                    backgroundColor: colors.positive,
                    color: colors.background,
                    height: 30,
                    textAlign: 'center',
                  }}>
                  {DateHelper.formatDate(month, 'M', 'MMMM').toUpperCase()}
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={monthNotes}
                  renderItem={({item, index}) => {
                    return (
                      <View>
                        <YearlyNote
                          numContentLines={4}
                          disableSwipe={true}
                          data={item}
                          {...props}
                          onPressDelete={() => {
                            setsLoading(true);
                            Firebase.deleteNote(item.id).then(() => {
                              Firebase.fetchNotes((data) => {
                                setNotes(data);
                                setsLoading(false);
                              });
                            });
                          }}
                          containerStyle={{
                            width: wp('50%'),
                          }}
                          noteStyle={{
                            width: wp('50%'),
                            paddingLeft: 15,
                            paddingRight: 5,
                            paddingBottom: 5,
                          }}
                          refreshList={fetchNotes}
                        />
                      </View>
                    );
                  }}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const getYearsFromNotes = (data) => {
    const arrYears = [];
    data.map((item) => {
      let date = DateHelper.formatDate(item.dateAdded, null, 'YYYY-M-D');
      let itemYear = date.split('-')[0];
      !arrYears.includes(itemYear) && arrYears.push(itemYear);
    });
    return arrYears;
  };

  const getYearlyNotes = (year, data) => {
    const notes = [];
    data.map((item) => {
      let date = DateHelper.formatDate(item.dateAdded, null, 'YYYY-M-D');
      let itemYear = date.split('-')[0];
      itemYear === year && notes.push(item);
    });
    return notes;
  };

  const getMonthsFromYearlyNotes = (data) => {
    const arrMonths = [];
    data.map((item) => {
      let date = DateHelper.formatDate(item.dateAdded, null, 'YYYY-M-D');
      let itemMonth = date.split('-')[1];
      !arrMonths.includes(itemMonth) && arrMonths.push(itemMonth);
    });
    return arrMonths;
  };

  const getMonthlyNotesFromYearlyNotes = (month, data) => {
    const notes = [];
    data.map((item) => {
      let date = DateHelper.formatDate(item.dateAdded, null, 'YYYY-M-D');
      let itemMonth = date.split('-')[1];
      itemMonth === month && notes.push(item);
    });
    return notes;
  };

  const fetchNotes = () => {
    setsLoading(true);
    Firebase.fetchNotes((data) => {
      setNotes(data);
      setsLoading(false);
    });
  };

  const handlePrevious = () => {
    if (sortBy === 'Monthly') {
      // subtract only month and/or year
      if (parseInt(viewedMonth) === 1) {
        setViewedMonth(12);
        setViewedYear(parseInt(viewedYear) - 1);
      } else {
        setViewedMonth(parseInt(viewedMonth) - 1);
      }
    } else if (sortBy === 'Weekly') {
      // subtract day to 7, test if diff. will negate
      // if (parseInt(viewedDay) - 7 <= 0) {
      //   let lastDayofPrevYear = DateHelper.getLastDayOfDate(
      //     `12/1/${parseInt(viewedYear) - 1}`,
      //   );
      //   setViewedDay(lastDayofPrevYear - Math.abs(viewedDay - 7));
      //   parseInt(viewedMonth) === 1
      //     ? setViewedMonth(12)
      //     : setViewedMonth(parseInt(viewedMonth) - 1);
      //   setViewedYear(parseInt(viewedYear) - 1);
      // } else {
      //   setViewedDay(viewedDay - 7);
      // }
      let arrDate = DateHelper.formatDate(
        DateHelper.subtractDaysToDate(
          `${viewedMonth}/${viewedDay}/${viewedYear}`,
          'M/D/YYYY',
          6,
        ),
        null,
        'YYYY-MM-D',
      ).split('-');
      setViewedYear(arrDate[0]);
      setViewedMonth(arrDate[1]);
      setViewedDay(arrDate[2]);
    } else {
      if (viewedDay === 1) {
        if (viewedMonth === 1) {
          // if January 1
          let lastDayofPrevYear = DateHelper.getLastDayOfDate(
            `12/1/${parseInt(viewedYear) - 1}`,
          );
          setViewedDay(lastDayofPrevYear);
          setViewedMonth(12);
          setViewedYear(parseInt(viewedYear) - 1);
          // console.warn(`Dec of last year's last day ${lastDayofPrevYear}`)
        } else {
          setViewedMonth(parseInt(viewedMonth) - 1);
          setViewedDay(
            DateHelper.getLastDayOfDate(
              `${parseInt(viewedMonth) - 1}/${viewedDay}/${viewedYear}`,
            ),
          );
        }
      } else {
        setViewedDay(parseInt(viewedDay) - 1);
      }
    }
  };

  const handleNext = () => {
    let lastDayOfDate = DateHelper.getLastDayOfDate(
      `${viewedMonth}/${viewedDay}/${viewedYear}`,
    );
    if (sortBy === 'Monthly') {
      // subtract only month and/or year
      if (viewedMonth === 12) {
        setViewedMonth(1);
        setViewedYear(parseInt(viewedYear) + 1);
      } else {
        setViewedMonth(parseInt(viewedMonth) + 1);
      }
    } else if (sortBy === 'Weekly') {
      // add day to 7, test if diff. will negate
      // if (parseInt(viewedDay) + 7 > lastDayOfDate) {
      //   let lastDayofPrevYear = DateHelper.getLastDayOfDate(
      //     `12/1/${parseInt(viewedYear) - 1}`,
      //   );
      //   setViewedDay(lastDayofPrevYear - Math.abs(viewedDay - 7));
      //   parseInt(viewedMonth) === 1
      //     ? setViewedMonth(12)
      //     : setViewedMonth(parseInt(viewedMonth) - 1);
      //   setViewedYear(parseInt(viewedYear) - 1);
      // } else {
      //   setViewedDay(viewedDay - 7);
      // }
      let arrDate = DateHelper.formatDate(
        DateHelper.addDaysToDate(
          `${viewedMonth}/${viewedDay}/${viewedYear}`,
          'M/D/YYYY',
          6,
        ),
        null,
        'YYYY-MM-D',
      ).split('-');
      setViewedYear(arrDate[0]);
      setViewedMonth(arrDate[1]);
      setViewedDay(arrDate[2]);
    } else {
      if (viewedDay.toString() === lastDayOfDate) {
        setViewedDay(1);
        if (viewedMonth === 12) {
          setViewedMonth(1);
          setViewedYear(parseInt(viewedYear) + 1);
        } else setViewedMonth(parseInt(viewedMonth) + 1);
      } else {
        setViewedDay(parseInt(viewedDay) + 1);
      }
    }
  };

  const handleChangeSort = (value) => {
    setSortBy(value);
    fetchNotes();
    setViewedDay(DateHelper.getCurrentFormattedDate('D'));
    setViewedMonth(DateHelper.getCurrentFormattedDate('M'));
    setViewedYear(DateHelper.getCurrentFormattedDate('YYYY'));
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={fetchNotes} />
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}
      style={{height: hp('100%'), backgroundColor: colors.background}}>
      <Header
        {...props}
        headerStyle={{position: 'absolute', top: 0}}
        onChangeSort={handleChangeSort}
        centerMainContainerStyle={{width: wp('54%')}}
        centerComponent={() => {
          return (
            <Text style={{fontSize: 12, color: colors.text}}>
              <Text style={{fontFamily: fonts.regular}}>Hello, </Text>
              <Text style={{fontFamily: 'LoverBunny'}}>{userName}!</Text>
            </Text>
          );
        }}
        rightHeaderText={`${DateHelper.formatDate(
          `${viewedMonth} ${viewedDay}, ${viewedYear}`,
          'M',
          'MMMM',
        )} ${viewedDay}, ${viewedYear}`}
      />
      {isLoading ? (
        <LoadingModal visible={isLoading} />
      ) : (
        <View style={{marginVertical: hp('8%')}}>
          {sortBy !== 'Yearly' && (
            <View
              style={{
                position: 'absolute',
                zIndex: 100,
                flexDirection: 'row',
                width: wp('100%'),
                justifyContent: 'space-between',
                top: hp('35%'),
              }}>
              <IconButton
                icon="chevron-left"
                mode="outlined"
                onPress={handlePrevious}
              />
              <IconButton
                icon="chevron-right"
                mode="outlined"
                onPress={handleNext}
              />
            </View>
          )}
          {renderNotes()}
        </View>
      )}
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('AddEntry', {
            refreshList: fetchNotes,
            data: null,
          })
        }
        style={[
          styles.addEntryButton,
          {borderRadius: roundness, backgroundColor: colors.accent2},
        ]}>
        <Image source={WRITE} style={styles.addEntryIcon} />
        <Text
          style={{fontFamily: fonts.thin, fontSize: 20, color: colors.primary}}>
          ADD ENTRY
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('100%') - StatusBar.currentHeight,
  },
  emptyContainer: {
    height: hp('80%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
  },
  emptyImg: {
    width: wp('90%'),
    height: hp('30%'),
    resizeMode: 'contain',
  },
  emptyText: {
    fontFamily: 'LoverBunny',
    fontSize: 20,
    textAlign: 'center',
  },
  addEntryButton: {
    backgroundColor: '#888888',
    height: hp('5%'),
    position: 'absolute',
    bottom: hp('3%'),
    width: wp('90%'),
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addEntryIcon: {
    marginTop: hp('-3%'),
    height: hp('10%'),
    resizeMode: 'contain',
    position: 'absolute',
    left: 0,
  },
  weekHeaderContainer: {
    width: wp('40%'),
    minHeight: hp('15%'),
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: 'black',
    borderRightWidth: 0.5,
  },
  yearRowHeaderContainer: {
    width: wp('40%'),
    // minHeight: hp('20%'),
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
});
