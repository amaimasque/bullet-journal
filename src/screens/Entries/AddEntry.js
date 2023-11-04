import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  FlatList,
  BackHandler,
  Alert,
  Image,
  useWindowDimensions,
  KeyboardAvoidingView,
  ImageBackground,
  useDe,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  useTheme,
  FAB,
  Portal,
  Dialog,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Unorderedlist from 'react-native-unordered-list';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Orientation from 'react-native-orientation-locker';
import {DragResizeContainer} from 'react-native-drag-resize';

import Header from 'components/Header';
import LoadingModal from 'components/LoadingModal';
import ChartModal from './components/ChartModal';
import ObjectsModal from './components/ObjectsModal';
import Charts from './components/Charts';
import Table from './components/Table';
import VideoPlayer from './components/VideoPlayer';
import Photo from './components/Photo';
import Object from './components/Object';
import BottomToolBar from './components/BottomToolBar';
import EmojisModal from './components/EmojisModal';
import BackgroundModal from './components/BackgroundModal';
import FontColorModal from './components/FontColorModal';
import Backgrounds from 'helpers/Backgrounds';
import {formatDate, getCurrentFormattedDate} from 'helpers/DateHelper';
import * as Firebase from 'helpers/Firebase';
import Emojis from 'helpers/Emojis';

const ROTATION = require('assets/images/rotation-lock.png');

export default function AddEntry(props) {
  const {colors, roundness, fonts} = useTheme();
  const [state, setState] = useState({open: false});
  const [isOrientationLocked, setIsOrientationLocked] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bullets, setBullets] = useState([]);
  const [tables, setTables] = useState([]);
  const [charts, setCharts] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [objects, setObjects] = useState([]);
  const [isLoadingModalVisible, setLoadingModalVisibility] = useState(false);
  const [imagesUploaded, setimagesUploaded] = useState(false);
  const [videosUploaded, setvideosUploaded] = useState(false);
  const [refreshList, setrefreshList] = useState(false);
  const [splittedContent, setSplittedContent] = useState('');
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isChartModalVisible, setChartModalVisibility] = useState(false);
  const [isObjectModalVisible, setObjectModalVisibility] = useState(false);
  const [isEmojiModalVisible, setEmojiModalVisibility] = useState(false);
  const [isBgModalVisible, setBgModalVisibility] = useState(false);
  const [isFontModalVisible, setFontModalVisiblity] = useState(false);
  const [isBulletLine, setIsBulletLine] = useState(false);
  const [limitations, setLimitations] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [inputDate, setInputDate] = useState(getCurrentFormattedDate(null));
  const [lastFocusedBulletInput, setLastFocusedBulletInput] = useState('');
  const [selectedObject, setSelectedObject] = useState(null);
  const [noteBackground, setNoteBackground] = useState({
    value: '#FFFFFF',
    title: 'white',
  });
  const {open} = state;
  const onStateChange = ({open}) => setState({open});
  const [isBackgroundModalVisible, setBackgroundModalVisibility] = useState(
    false,
  );
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });
  const [selectedChartIndex, setSelectedChartIndex] = useState(null);
  const [fontColor, setFontColor] = useState(colors.text);

  const resetContents = () => {
    setTitle('');
    setContent('');
    setTables([]);
    setCharts([]);
    setImages([]);
    setVideos([]);
    setEmojis([]);
    setObjects([]);
    setBullets([]);
    setInputDate(new Date());
    setSelectedObject(null);
    setNoteBackground({
      value: '#FFFFFF',
      title: 'white',
    });
    setFontColor(colors.text);
  };

  useEffect(() => {
    // setIsLoading(true);
    // setTimeout(() => setIsLoading(false));
  }, [useWindowDimensions().width]);

  useEffect(() => {
    const backAction = () => {
      let isEditingNote =
        props.route.params.data !== null &&
        props.route.params.data !== undefined;
      Alert.alert(
        'Hold on!',
        `You are currently ${
          isEditingNote ? 'editing' : 'creating'
        } your note. Are you sure you want to go back?`,
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => {
              resetContents();
              Orientation.lockToPortrait();
              props.navigation.goBack(null);
              if (isEditingNote) {
                props.navigation.goBack(null);
              }
            },
          },
        ],
      );
      // props.navigation.goBack(null);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [props]);

  const hideDialog = () => setBgModalVisibility(false);

  useEffect(() => {
    let {data} = props.route.params;
    if (data !== null) {
      // alert(JSON.stringify(data, null, '\t'));
      setTitle(data.title);
      setContent(data.content);
      data.tables?.replace(/[\[\]""]/g, '') !== '' &&
        setTables(JSON.parse(data.tables));
      setCharts(data.charts);
      setImages(data.images);
      setVideos(data.videos);
      setEmojis(data.emojis);
      setObjects(data.objects);
      setBullets(data.bullets);
      setInputDate(new Date(data.dateAdded));
      setSelectedObject(null);
      setNoteBackground(data.background);
      setIsOrientationLocked(data.orientation === 'portrait');
      data.orientation === 'portrait'
        ? Orientation.lockToPortrait()
        : Orientation.lockToLandscape();
      setFontColor(data.fontColor);
    } else resetContents();
  }, [props.route.params]);

  useEffect(() => {
    // setIsToolbarVisible(true);
    // return () => setIsToolbarVisible(false);
    const unsubscribeFocus = props.navigation.addListener('focus', () => {
      setIsToolbarVisible(true);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribeFocus;
  }, []);

  useEffect(() => {
    const unsubscribeBlur = props.navigation.addListener('blur', () => {
      setIsToolbarVisible(false);
    });
    return unsubscribeBlur;
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setInputDate(date);
    hideDatePicker();
  };

  const handleContent = (value, index) => {
    let splittedContentCopy = splittedContent;
    splittedContent[index] = value;
    setSplittedContent(splittedContentCopy);
    setContent(splittedContentCopy.join(''));
    setrefreshList(!refreshList);
  };

  const handleBackground = (item) => {
    setNoteBackground(item);
    hideDialog();
  };

  useEffect(() => {
    setIsToolbarVisible(!isBackgroundModalVisible);
  }, [isBackgroundModalVisible]);

  useEffect(() => {
    console.log(selection);
  }, [selection]);

  useEffect(() => {
    if (imagesUploaded && videosUploaded) {
      let data = {
        title,
        content,
        bullets,
        tables: JSON.stringify(tables),
        charts,
        images,
        videos,
        emojis,
        objects,
        background: noteBackground,
        dateAdded: inputDate.toString(),
        fontColor,
        orientation: isOrientationLocked ? 'portrait' : 'landscape',
      };
      if (
        props.route.params.data === null ||
        props.route.params.data === undefined
      ) {
        Firebase.saveNote(data, () => {
          console.warn('Saved');
          props.route.params.refreshList();
          goBack();
        });
      } else {
        Firebase.editNote(props.route.params.data.id, data, () => {
          console.warn('Updated.');
          goBack();
          goBack();
          props.route.params.refreshList();
        });
      }
    }
  }, [imagesUploaded, videosUploaded]);

  const goBack = () => {
    setLoadingModalVisibility(false);
    setimagesUploaded(false);
    setvideosUploaded(false);
    resetContents();
    Orientation.lockToPortrait();
    props.navigation.goBack(null);
  };

  const handleSaveNote = () => {
    Alert.alert('Confirm', 'Are you sure you want to save note?', [
      {
        text: 'NO',
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: async () => {
          if (title !== '' || content !== '') {
            setLoadingModalVisibility(true);
            let imagesUrls = [],
              videosUrls = [];
            let promisesImages = await images.map((item) => {
              return typeof item === 'string' && item !== ''
                ? imagesUrls.push(item)
                : Firebase.uploadFile(item.path, item.fileName, (value) => {
                    imagesUrls.push(value);
                  });
            });
            let promisesVideos = await videos.map((item) => {
              return typeof item === 'string' && item !== ''
                ? videosUrls.push(item)
                : Firebase.uploadFile(item.path, item.fileName, (value) => {
                    videosUrls.push(value);
                  });
            });
            Promise.all(promisesImages).then((res) => {
              setImages(imagesUrls);
              setimagesUploaded(true);
            });
            Promise.all(promisesVideos).then((res) => {
              setVideos(videosUrls);
              setvideosUploaded(true);
            });
          } else goBack();
        },
      },
    ]);
  };

  useEffect(() => {
    let contentSplitter = /\/:(?<type>bullet|table|chart|image|video|emoji)[0-9]+\//gm,
      input = content,
      numBullets = 0,
      numTables = 0,
      numCharts = 0,
      numImages = 0,
      numVideos = 0,
      numEmojis = 0,
      index = 0,
      contentarray = [];
    // console.warn(input);
    for (var token of input.split(contentSplitter)) {
      switch (token) {
        case 'bullet':
          numBullets += 1;
          contentarray.push(`/:bullet${numBullets}/`);
          break;
        case 'table':
          numTables += 1;
          contentarray.push(`/:table${numTables}/`);
          break;
        case 'chart':
          numCharts += 1;
          contentarray.push(`/:chart${numCharts}/`);
          break;
        case 'image':
          numImages += 1;
          contentarray.push(`/:image${numImages}/`);
          break;
        case 'video':
          numVideos += 1;
          contentarray.push(`/:video${numVideos}/`);
          break;
        case 'emoji':
          numEmojis += 1;
          contentarray.push(`/:emoji${numEmojis}/`);
          break;
        default:
          contentarray.push(token);
      }
      index += 1;
    }
    contentarray = contentarray.filter((item) => item !== '');
    if (
      contentarray.length === 0 ||
      contentarray[contentarray.length - 1].startsWith('/:')
    ) {
      contentarray.push('');
    }
    // console.warn('Content array', JSON.stringify(contentarray));
    setSplittedContent(contentarray);
  }, [content, refreshList]);

  const renderChart = (item, title, index, chartIndex) => {
    let {type, data} = item;
    return (
      <Charts
        onPressChart={() => {
          setSelectedChartIndex(chartIndex);
          setTimeout(() => setChartModalVisibility(true), 500);
        }}
        type={type}
        data={data}
        onPressDelete={() => handleDelete(title, 'chart', index)}
        viewOnly={false}
      />
    );
  };

  const renderTable = (data, title, index) => {
    return (
      <Table
        data={data}
        onChangeData={(value) => {
          let tablesCopy = tables;
          tablesCopy[index] = value;
          setTables(tablesCopy);
          setrefreshList(!refreshList);
        }}
        onPressDelete={() => handleDelete(title, 'table', index)}
      />
    );
  };

  const handleKeyDown = (e) => {
    if (
      e.nativeEvent.key == 'Backspace' &&
      bullets[parseInt(lastFocusedBulletInput.replace(/[^\d]/g, '')) - 1] === ''
    ) {
      handleDelete(
        lastFocusedBulletInput,
        'bullet',
        parseInt(lastFocusedBulletInput.replace(/[^\d]/g, '') - 1),
      );
      setLastFocusedBulletInput('');
      setrefreshList(!refreshList);
    }
  };

  const renderContent = ({item, index}) => {
    let numMatches = item.match(/\d+/g);
    let numRemover = /[^\d]/g;
    if (item.match(/:bullet[0-9]+/gm)) {
      // console.warn('Bullet', parseInt(item.replace(numRemover, '')) - 1);
      let bulletItem = bullets[parseInt(item.replace(numRemover, '')) - 1];
      // console.warn('Bullet', bulletItem);
      return (
        bulletItem !== undefined && (
          <Unorderedlist color={fontColor} style={{fontSize: 13}}>
            <TextInput
              multiline={true}
              onChangeText={(value) => {
                let bulletsCopy = bullets;
                bulletsCopy[parseInt(item.replace(numRemover, '')) - 1] = value;
                // console.warn(bulletsCopy)
                setBullets([...bulletsCopy]);
              }}
              onFocus={() => {
                // setIsBulletLine(true);
                setLastFocusedBulletInput(item);
              }}
              onKeyPress={handleKeyDown}
              // onBlur={() => setIsBulletLine(false)}
              value={bullets[parseInt(item.replace(numRemover, '')) - 1]}
              style={{
                fontFamily: fonts.regular,
                color: fontColor,
                fontSize: 13,
                textAlignVertical: 'top',
                minHeight: 13,
                padding: 0,
              }}
            />
          </Unorderedlist>
        )
      );
    } else if (item.match(/:chart[0-9]+/gm)) {
      let chartIndex = parseInt(item.replace(numRemover, '')) - 1;
      {
        return (
          charts[chartIndex] !== undefined &&
          renderChart(charts[chartIndex], item, index, chartIndex)
        );
      }
    } else if (item.match(/:table[0-9]+/gm)) {
      let tableIndex = parseInt(item.replace(numRemover, '')) - 1;
      {
        return (
          tables[tableIndex] !== undefined &&
          renderTable(tables[tableIndex], item, tableIndex)
        );
      }
    } else if (item.match(/:image[0-9]+/gm)) {
      return (
        <Photo
          source={images[numMatches[0] - 1]}
          onPressDelete={() => handleDelete(item, 'image', numMatches[0] - 1)}
        />
      );
    } else if (item.match(/:video[0-9]+/gm)) {
      return (
        <VideoPlayer
          source={videos[numMatches[0] - 1]}
          onPressDelete={() => handleDelete(item, 'video', numMatches[0] - 1)}
          viewOnly={false}
        />
      );
    } else if (item.match(/:emoji[0-9]+/gm)) {
      return (
        <TouchableOpacity
          style={{marginTop: hp('2%')}}
          onLongPress={() => handleDelete(item, 'chart', numMatches[0] - 1)}>
          <Image
            source={Emojis['emoji' + emojis[numMatches[0] - 1]]}
            style={{width: '100%', height: hp('10%'), resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TextInput
          value={splittedContent[index]}
          onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
          onChangeText={(value) => handleContent(value, index)}
          multiline={true}
          placeholder="Please input here..."
          placeholderTextColor={fontColor}
          style={{
            fontFamily: fonts.regular,
            color: fontColor,
            fontSize: 12,
            // height: hp('73%'),
            textAlignVertical: 'center',
          }}
        />
      );
    }
  };

  const handleDelete = (item, type, index) => {
    if (type !== 'bullet') {
      Alert.alert('Confirm', 'Are you sure you want to delete this item?', [
        {
          text: 'NO',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => {
            let contentCopy = content;
            contentCopy = contentCopy.replace(item, '');
            // console.warn('From', content, 'to', contentCopy, 'removing', item);
            setContent(contentCopy);
            switch (type) {
              case 'image':
                let imagesCopy = images;
                imagesCopy.splice(index, 1);
                setImages(imagesCopy);
                break;
              case 'video':
                let videosCopy = videos;
                videosCopy.splice(index, 1);
                setVideos(videosCopy);
                break;
              case 'chart':
                let chartsCopy = charts;
                chartsCopy.splice(index, 1);
                setCharts(chartsCopy);
                break;
              case 'table':
                let tablesCopy = tables;
                tablesCopy.splice(index, 1);
                setTables(tablesCopy);
                break;
              case 'emoji':
                let emojisCopy = emojis;
                emojisCopy.splice(index, 1);
                setEmojis(emojisCopy);
                break;
              case 'bullet':
                let bulletsCopy = bulletsCopy;
                bulletsCopy.splice(index, 1);
                setBullets(bulletsCopy);
                break;
            }
            setrefreshList(!refreshList);
          },
        },
      ]);
    } else {
      // let contentCopy = content;
      // contentCopy = contentCopy.replace(item, `\n${bullets[index]}\n`);
      // console.warn('From', content, 'to', contentCopy, 'removing', item);
      // setContent(contentCopy);
      let bulletsCopy = bullets;
      bulletsCopy.splice(index, 1);
      setBullets(bulletsCopy);
      setrefreshList(!refreshList);
    }
  };

  const insert = (main_string, ins_string, pos) => {
    if (typeof pos === 'undefined') {
      pos = 0;
    }
    if (typeof ins_string === 'undefined') {
      ins_string = '';
    }
    return main_string.slice(0, pos) + ins_string + main_string.slice(pos);
  };

  const handlePicker = (mediaType) => {
    mediaType === 'photo'
      ? ImagePicker.showImagePicker(
          {title: 'Choose photo', mediaType},
          async (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.warn('ImagePicker Error: ', response.error);
            } else {
              let contentCopy = content;
              contentCopy = insert(
                contentCopy,
                `/:image${images.length + 1}/`,
                // selection.start,
                contentCopy.length,
              );
              setContent(contentCopy);
              setImages(
                images.concat({uri: response.uri, path: response.path}),
              );
              // setrefreshList(!refreshList);
            }
          },
        )
      : ImagePicker.launchImageLibrary(
          {title: 'Choose video', mediaType},
          async (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              RNFetchBlob.fs
                .stat(response.path)
                .then((stats) => {
                  // console.warn(stats.size);
                  if (stats.size > 10000000) {
                    return alert('Please attach 10MB video size or less!');
                  }
                  let contentCopy = content;
                  contentCopy = insert(
                    contentCopy,
                    `/:video${videos.length + 1}/`,
                    contentCopy.length,
                  );
                  setContent(contentCopy);
                  setVideos(
                    videos.concat({uri: response.uri, path: response.path}),
                  );
                  // setrefreshList(!refreshList);
                })
                .catch((err) => {});
            }
          },
        );
  };

  const handleEditChart = (type, data) => {
    let chartsCopy = charts;
    chartsCopy[selectedChartIndex] = {type, data: data.split(',').map(Number)};
    setCharts([...chartsCopy]);
    setSelectedChartIndex(null);
    setChartModalVisibility(false);
  };

  const handleChart = (type, data) => {
    let contentCopy = content;
    contentCopy = insert(
      contentCopy,
      `/:chart${charts.length + 1}/`,
      contentCopy.length,
    );
    setContent(contentCopy);
    setCharts(charts.concat({type, data: data.split(',').map(Number)}));
    setChartModalVisibility(false);
  };

  const handleTable = () => {
    let contentCopy = content;
    contentCopy = insert(
      contentCopy,
      `/:table${tables.length + 1}/`,
      contentCopy.length,
    );
    setContent(contentCopy);
    setTables(tables.concat({columnHeaders: [''], rowData: [['']]}));
  };

  const handleBullet = () => {
    // alert(lastFocusedBulletInput)
    // if (lastFocusedBulletInput !== '') {
    //   handleDelete(lastFocusedBulletInput, 'bullet', parseInt(lastFocusedBulletInput.replace(/[^\d]/g, '') - 1));
    //   setLastFocusedBulletInput('');
    //   setrefreshList(!refreshList)
    // } else {
    let contentCopy = content;
    contentCopy = insert(
      contentCopy,
      `/:bullet${bullets.length + 1}/`,
      contentCopy.length,
    );
    setContent(contentCopy);
    setBullets(bullets.concat(''));
    setrefreshList(!refreshList);
    // }
  };

  const handleObject = (index) => {
    setObjectModalVisibility(false);
    setObjects(
      objects.concat({
        item: index,
        coordinates: {x: 0, y: 0},
        pixels: {w: 100, h: 100},
      }),
    );
  };

  const handleEmoji = (index) => {
    let contentCopy = content;
    contentCopy = insert(
      contentCopy,
      `/:emoji${emojis.length + 1}/`,
      contentCopy.length,
    );
    console.warn(contentCopy);
    setContent(contentCopy);
    setEmojis(emojis.concat(index));
    setEmojiModalVisibility(false);
  };

  const handleCoordinates = (index, x, y) => {
    let objectsCopy = objects;
    objectsCopy[index] = {...objects[index], coordinates: {x, y}};
    console.warn(JSON.stringify(objectsCopy));
    setObjects(objectsCopy);
  };

  const handlePixels = (index, w, h) => {
    let objectsCopy = objects;
    objectsCopy[index] = {...objects[index], pixels: {w, h}};
    console.warn(
      JSON.stringify(objects[index]) + 'to' + JSON.stringify(objectsCopy),
    );
    setObjects(objectsCopy);
  };

  return (
    <ImageBackground
      imageStyle={{resizeMode: 'stretch'}}
      source={
        noteBackground.title.includes('bg')
          ? Backgrounds['background' + noteBackground.value]
          : ''
      }
      style={{flex: 1}}>
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={styles.contentContainerStyle}
        style={{backgroundColor: noteBackground.value}}>
        {isChartModalVisible && (
          <ChartModal
            visible={isChartModalVisible}
            onDismiss={() => {
              setChartModalVisibility(false);
              setSelectedChartIndex(null);
            }}
            saveChart={handleChart}
            editChart={handleEditChart}
            data={
              selectedChartIndex !== null ? charts[selectedChartIndex] : null
            }
          />
        )}
        {isObjectModalVisible && (
          <ObjectsModal
            visible={isObjectModalVisible}
            onDismiss={() => setObjectModalVisibility(false)}
            onPressItem={handleObject}
          />
        )}
        {isEmojiModalVisible && (
          <EmojisModal
            visible={isEmojiModalVisible}
            onDismiss={() => setEmojiModalVisibility(false)}
            onPressItem={handleEmoji}
          />
        )}
        {isBgModalVisible && (
          <BackgroundModal
            visible={isBgModalVisible}
            onDismiss={() => setBgModalVisibility(false)}
            onPressItem={(item) => handleBackground(item)}
            noteBackground={noteBackground}
          />
        )}
        {isLoadingModalVisible && (
          <LoadingModal visible={isLoadingModalVisible} />
        )}
        {isFontModalVisible && (
          <FontColorModal
            visible={isFontModalVisible}
            onDismiss={() => setFontModalVisiblity(false)}
            onSave={(data) => setFontColor(data)}
          />
        )}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <Header
          {...props}
          headerStyle={{position: 'absolute', top: 0}}
          title={
            props.route.params.data === null ||
            props.route.params.data === undefined
              ? 'Add Entry'
              : 'Edit Entry'
          }
          // centerMainContainerStyle={{width: wp('65%')}}
          centerMainContainerStyle={{width: useWindowDimensions().width * 0.5}}
          rightComponent={() => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // justifyContent: 'center',
                  justifyContent: 'flex-end',
                  // backgroundColor: 'red',
                  width: useWindowDimensions().width * 0.4,
                }}>
                <TouchableOpacity
                  style={[
                    {
                      width: hp('4%'),
                      height: hp('4%'),
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() =>
                    Orientation.getOrientation((orientation) => {
                      setIsOrientationLocked(!orientation === 'PORTRAIT');
                      orientation === 'PORTRAIT'
                        ? Orientation.lockToLandscape()
                        : Orientation.lockToPortrait();
                    })
                  }>
                  <Image
                    source={ROTATION}
                    style={{
                      width: hp('4%'),
                      height: hp('4%'),
                      tintColor: colors.text,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setBgModalVisibility(true)}
                  style={{
                    backgroundColor: noteBackground.value,
                    borderWidth: 1,
                    borderRadius: hp('2%'),
                    marginLeft: wp('5%'),
                  }}>
                  <Image
                    source={
                      noteBackground.title.includes('bg')
                        ? Backgrounds['background' + noteBackground.value]
                        : ''
                    }
                    style={{
                      borderRadius: hp('2%'),
                      width: hp('4%'),
                      height: hp('4%'),
                      resizeMode: 'cover',
                      backgroundColor: noteBackground.title.includes('bg')
                        ? ''
                        : noteBackground.value,
                    }}
                  />
                </TouchableOpacity>
                <IconButton
                  icon="check"
                  color={colors.text}
                  size={hp('4%')}
                  onPress={handleSaveNote}
                />
              </View>
            );
          }}
        />
        <View style={{paddingHorizontal: wp('7%')}}>
          <TextInput
            placeholder="Entry Title"
            placeholderTextColor={fontColor}
            style={{
              fontFamily: fonts.regular,
              color: fontColor,
              fontSize: 14,
              borderBottomColor: fontColor,
              borderBottomWidth: 1,
            }}
            onChangeText={(text) => setTitle(text)}
            value={title}
          />
          <View
            style={{flexDirection: 'row', marginVertical: 5, marginBottom: 20}}>
            <Text
              style={{
                fontFamily: fonts.light,
                fontSize: 12,
                marginRight: 10,
                color: fontColor,
              }}>
              Date
            </Text>
            <Text
              onPress={showDatePicker}
              style={{
                fontFamily: fonts.medium,
                fontSize: 12,
                color: fontColor,
              }}>
              {formatDate(inputDate, null, 'MMMM D, YYYY')}
            </Text>
          </View>
        </View>
        {!isLoading && (
          <DragResizeContainer
            onInit={(limits) => {
              console.warn(JSON.stringify(limits));
              setLimitations(limits);
            }}
            style={{flex: 1, width: useWindowDimensions().width}}>
            {objects.map((item, index) => {
              console.log(item);
              return (
                <Object
                  limits={limitations}
                  viewOnly={false}
                  index={item.item}
                  handleSelectedObject={(index) => setSelectedObject(index)}
                  selectedIndex={selectedObject}
                  handleCoordinates={(x, y) => {
                    handleCoordinates(index, x, y);
                  }}
                  handlePixels={(x, y) => {
                    console.warn('x' + x + 'y' + y);
                    handlePixels(index, x, y);
                  }}
                  x={item.coordinates.x}
                  y={item.coordinates.y}
                  w={item.pixels.w}
                  h={item.pixels.h}
                />
              );
            })}
            <FlatList
              data={splittedContent}
              renderItem={renderContent}
              keyExtractor={(item, index) => String(index)}
              showsVerticalScrollIndicator={false}
              extraData={[content, splittedContent, refreshList, bullets]}
              contentContainerStyle={{paddingHorizontal: wp('7%')}}
              // contentContainerStyle={{backgroundColor: 'green', marginBottom: hp('7%')}}
            />
          </DragResizeContainer>
        )}
        <BottomToolBar
          // bulletLineFocused={isBulletLine}
          onPressBullet={handleBullet}
          onPressEmoji={() => setEmojiModalVisibility(true)}
          onPressDesign={() => setObjectModalVisibility(true)}
          onPressFontColor={() => setFontModalVisiblity(true)}
        />
        {isToolbarVisible && (
          <Portal theme={useTheme}>
            <FAB.Group
              visible={isToolbarVisible}
              open={open}
              icon={open ? 'close' : 'plus'}
              actions={[
                {
                  icon: 'file-table',
                  onPress: () => handleTable(),
                  style: {backgroundColor: 'white'},
                },
                {
                  icon: 'chart-bar',
                  onPress: () => setChartModalVisibility(true),
                  style: {backgroundColor: 'white'},
                },
                {
                  icon: 'file-video',
                  onPress: () => handlePicker('video'),
                  style: {backgroundColor: 'white'},
                },
                {
                  icon: 'camera-image',
                  onPress: () => handlePicker('photo'),
                  style: {backgroundColor: 'white'},
                },
              ]}
              onStateChange={onStateChange}
              onPress={() => {
                if (open) {
                  // do something if the speed dial is open
                }
              }}
            />
          </Portal>
        )}
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    height: hp('100%') - StatusBar.currentHeight,
    // paddingHorizontal: wp('7%'),
    paddingTop: hp('10%'),
    // flex: 1,
  },
});
