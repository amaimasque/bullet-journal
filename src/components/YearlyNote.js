import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
  FlatList,
  ImageBackground,
} from 'react-native';
import {SwipeRow} from 'react-native-swipe-list-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Menu, useTheme, IconButton} from 'react-native-paper';

import {formatDate} from 'helpers/DateHelper';
import Backgrounds from 'helpers/Backgrounds';

const DELETE = require('assets/images/bin.png');
const MENU = require('assets/images/more.png');

export default function StickyNote(props) {
  const [availableData, setAvailableData] = useState([]);
  const [notesData, setNotesData] = useState(null);
  let {
    data,
    containerStyle,
    numContentLines,
    onPressDelete,
    noteStyle,
    disableSwipe,
  } = props;
  let {title, content, background, dateAdded, fontColor} = data;
  const {colors, roundness, fonts} = useTheme();

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleDelete = () => {
    setIsMenuVisible(false);
    Alert.alert('Confirm', 'Are you sure you want to delete this note?', [
      {
        text: 'NO',
        style: 'cancel',
      },
      {
        title: 'YES',
        onPress: () => onPressDelete(),
      },
    ]);
  };

  const renderIcons = ({item, index}) => {
    return <IconButton icon={item} color={colors.text} size={wp('5%')} />;
  };

  useEffect(() => {
    setNotesData(props.data);
    // props.data.images.length > 0 &&
    //   !availableData.includes('camera-image') &&
    //   setAvailableData(availableData.concat('camera-image'));
    // props.data.videos.length > 0 &&
    //   !availableData.includes('file-video') &&
    //   setAvailableData(availableData.concat('file-video'));
    // props.data.charts.length > 0 &&
    //   !availableData.includes('chart-bar') &&
    //   setAvailableData(availableData.concat('chart-bar'));
    // props.data.tables.length > 0 &&
    //   !availableData.includes('file-table') &&
    //   setAvailableData(availableData.concat('file-table'));
  }, [props.data]);

  useEffect(() => {
    // console.warn('Tables length', props.data.tables.length)
    if (notesData) {
      notesData.images.length > 0 &&
        !availableData.includes('camera-image') &&
        setAvailableData(availableData.concat('camera-image'));
      notesData.videos.length > 0 &&
        !availableData.includes('file-video') &&
        setAvailableData(availableData.concat('file-video'));
      notesData.charts.length > 0 &&
        !availableData.includes('chart-bar') &&
        setAvailableData(availableData.concat('chart-bar'));
      notesData.tables !== '[]' &&
        !availableData.includes('file-table') &&
        setAvailableData(availableData.concat('file-table'));
    }
  }, [notesData]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Modal
        visible={isMenuVisible}
        transparent={true}
        style={{flex: 1}}
        onRequestClose={() => setIsMenuVisible(false)}>
        <View style={styles.menuBackground}>
          <View style={styles.menuContainer}>
            <Menu.Item
              icon="eye-outline"
              onPress={() =>
                props.navigation.navigate('ViewEntry', {
                  data,
                  refreshList: props.refreshList,
                })
              }
              title="View"
            />
            <Menu.Item
              icon="pencil-outline"
              onPress={() => {
                props.navigation.navigate('AddEntry', {
                  data,
                  refreshList: props.refreshList,
                });
              }}
              title="Edit"
            />
            <Menu.Item
              icon="delete-outline"
              onPress={handleDelete}
              title="Delete"
            />
          </View>
        </View>
      </Modal>
      <Text
        style={{
          position: 'absolute',
					top: 1,
					left: 5,
          backgroundColor: colors.accent1,
          padding: 5,
          zIndex: 5,
          fontFamily: 'Roboto-Medium',
          fontSize: 10,
					borderRadius: 100,
					elevation: 5,
        }}>
        {formatDate(dateAdded, null, 'D')}
      </Text>
      <View>
        <SwipeRow
          disableSwipe={disableSwipe}
          leftActionValue={0}
          rightOpenValue={wp('-25%')}>
          <View style={styles.hiddenContainer}>
            <View />
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={handleDelete}
                style={{paddingHorizontal: wp('3%')}}>
                <Image source={DELETE} style={styles.swipeIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsMenuVisible(true)}
                style={{paddingHorizontal: wp('3%')}}>
                <Image source={MENU} style={styles.swipeIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.visibleContainer, noteStyle]}>
            <TouchableHighlight
              onPress={() =>
                props.navigation.navigate('ViewEntry', {
                  data,
                  refreshList: props.refreshList,
                })
              }
              underlayColor={'#F0F0F0'}
              onLongPress={() => setIsMenuVisible(true)}
              style={[
                styles.noteStyle,
                !background.title.includes('bg') && {
                  backgroundColor: background.value,
                },
              ]}>
              <ImageBackground
                imageStyle={{resizeMode: 'cover'}}
                style={{flex: 1, padding: wp('4%')}}
                source={
                  background.title.includes('bg')
                    ? Backgrounds[`background${background.value}`]
                    : ''
                }>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    numberOfLines={disableSwipe ? 1 : 2}
                    style={[styles.titleStyle, {color: fontColor}]}>
                    {title}
                  </Text>
                  {!disableSwipe && (
                    <FlatList
                      horizontal
                      data={availableData}
                      renderItem={renderIcons}
                      keyExtractor={(item, index) => String(index)}
                      contentContainerStyle={{
                        flex: 1,
                        justifyContent: 'flex-end',
                      }}
                      extraData={props}
                    />
                  )}
                </View>
                <Text
                  numberOfLines={
                    numContentLines == undefined ? 10 : numContentLines
                  }
                  style={[styles.contentStyle, {color: fontColor}]}>
                  {content.replace(
                    /\/:(?:bullet|table|chart|image|video|emoji)[0-9]+\//gm,
                    '',
                  )}
                </Text>
              </ImageBackground>
            </TouchableHighlight>
          </View>
        </SwipeRow>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hiddenContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visibleContainer: {
    width: wp('100%'),
  },
  titleStyle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  contentStyle: {
    fontSize: 10,
    fontFamily: 'Roboto-Light',
  },
  container: {
    width: wp('100%'),
  },
  noteStyle: {
    shadowColor: '#000',
    elevation: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingRight: wp('3%'),
  },
  swipeIcon: {
    width: wp('5%'),
    height: hp('3%'),
    resizeMode: 'contain',
  },
  menuBackground: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: wp('100%'),
    height: hp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: {
    backgroundColor: '#F0F0F0',
    width: wp('90%'),
    paddingVertical: hp('2%'),
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
  },
});
