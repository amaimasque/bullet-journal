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
  Image,
  Alert,
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
  DataTable,
} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Grid, LineChart, XAxis} from 'react-native-svg-charts';
import Unorderedlist from 'react-native-unordered-list';
import ImagePicker from 'react-native-image-picker';
import AutoHeightImage from 'react-native-auto-height-image';

import Header from 'components/Header';
import {formatDate, getCurrentFormattedDate} from 'helpers/DateHelper';
import * as Firebase from 'helpers/Firebase';

const BACKGROUND_COLORS = [
  {
    value: '#FFFFFF',
    title: 'white',
  },
  {
    value: '#FFE0AC',
    title: 'orange',
  },
  {
    value: '#FFACB7',
    title: 'pink',
  },
  {
    value: '#F0F0F0',
    title: 'white-gray',
  },
  {
    value: '#FFE8DF',
    title: 'peach',
  },
  {
    value: '#6886C5',
    title: 'purple',
  },
];

function Photo(props) {
  const [source, setSource] = useState('');
  let {url, imageStyle} = props;

  useEffect(() => {
    // props.url.startsWith('https://') ? setSource(props.url) : fetchPhoto();
    console.warn('Url', props.url)
  }, [props.url]);

  const fetchPhoto = async () => {
    await Firebase.getDownloadUrl(props.url).then((url) => {
      setSource(url);
    });
  };

  return (
    <AutoHeightImage
      width={wp('86%')}
      source={{uri: source}}
      style={imageStyle}
    />
  );
}

export default function AddEntry(props) {
  const {colors, roundness, fonts} = useTheme();
  const [state, setState] = useState({open: false});
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bullets, setBullets] = useState([]);
  const [tables, setTables] = useState([]);
  const [charts, setCharts] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [refreshList, setrefreshList] = useState(false);
  const [splittedContent, setSplittedContent] = useState('');
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [inputDate, setInputDate] = useState(
    getCurrentFormattedDate('MMMM D, YYYY'),
  );
  const [noteBackground, setNoteBackground] = useState(BACKGROUND_COLORS[0]);
  const {open} = state;
  const onStateChange = ({open}) => setState({open});
  const [isBackgroundModalVisible, setBackgroundModalVisibility] = useState(
    false,
  );
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  const hideDialog = () => setBackgroundModalVisibility(false);

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
    console.warn('A date has been picked: ', date);
    setInputDate(formatDate(date, '', 'MMMM D, YYYY'));
    hideDatePicker();
  };

  const renderBackgrounds = ({item, index}) => {
    let {title, value} = item,
      checked = noteBackground.title === title;
    return (
      <View>
        <TouchableOpacity
          onPress={() => handleBackground(item)}
          style={{
            borderRadius: wp('15%') / 2,
            width: wp('15%'),
            height: wp('15%'),
            backgroundColor: value,
            borderWidth: 1,
            margin: wp('3%'),
          }}
        />
        {checked && (
          <IconButton
            icon="checkbox-marked-circle"
            color={colors.text}
            size={20}
            style={{position: 'absolute', bottom: 0, right: 0}}
          />
        )}
      </View>
    );
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
    let contentSplitter = /\/:(?<type>bullet|table|chart|image|video)[0-9]+\//gm,
      input = content,
      numBullets = 0,
      numTables = 0,
      numCharts = 0,
      numImages = 0,
      numVideos = 0,
      index = 0,
      contentarray = [];
    console.warn('Content', content)
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
        default:
          contentarray.push(token.trim());
      }
      index += 1;
    }
    console.warn('Content array', JSON.stringify(contentarray));
    setSplittedContent(contentarray);
  }, [content, refreshList]);

  const renderList = ({item}) => {
    return (
      <Unorderedlist>
        <Text
          style={{
            fontFamily: fonts.regular,
            color: colors.text,
            fontSize: 13,
            textAlignVertical: 'top',
          }}>
          {item}
        </Text>
      </Unorderedlist>
    );
  };

  const renderChart = (item) => {
    let {type, title, labels, data} = item;
    switch (type) {
      case 'line-chart':
        return (
          <View style={{height: 200, marginBottom: 30}}>
            <LineChart
              style={{height: 200}}
              data={data}
              svg={{stroke: 'rgb(134, 65, 244)'}}
              contentInset={{top: 20, bottom: 20}}>
              <Grid />
            </LineChart>
            <XAxis
              data={labels}
              formatLabel={(index) => labels[index]}
              contentInset={{left: 25, right: 25}}
              svg={{fontSize: 7, fill: 'black'}}
            />
          </View>
        );
    }
  };

  const renderRow = ({item}) => {
    return (
      <DataTable.Row>
        {item.map((cellItem) => {
          return <DataTable.Cell>{cellItem}</DataTable.Cell>;
        })}
      </DataTable.Row>
    );
  };

  const renderTable = (data) => {
    let {columnHeaders, rowData, totalCols} = data;
    return (
      <DataTable
        style={{
          backgroundColor: colors.background,
          elevation: 7,
          marginVertical: 10,
        }}>
        <DataTable.Header>
          {columnHeaders.map((item) => {
            return <DataTable.Title>{item}</DataTable.Title>;
          })}
        </DataTable.Header>
        <FlatList
          data={rowData}
          renderItem={renderRow}
          keyExtractor={(item, index) => String(index)}
        />
      </DataTable>
    );
  };

  const renderContent = ({item, index}) => {
    let numRemover = /[^\d]/g;
    if (item.match(/:bullet[0-9]+/gm)) {
      let bulletItem = data.bullets[parseInt(item.replace(numRemover, '')) - 1];
      return (
        bulletItem !== undefined && (
          <FlatList
            data={bulletItem}
            renderItem={renderList}
            keyExtractor={(index) =>
              `bullet${item.replace(numRemover, '')}-item${index}`
            }
            style={{marginVertical: 10}}
          />
        )
      );
    } else if (item.match(/:chart[0-9]+/gm)) {
      let chartIndex = parseInt(item.replace(numRemover, '')) - 1;
      {
        return (
          data.charts[chartIndex] !== undefined &&
          renderChart(data.charts[chartIndex])
        );
      }
    } else if (item.match(/:table[0-9]+/gm)) {
      let tableIndex = parseInt(item.replace(numRemover, '')) - 1;
      {
        return (
          data.tables[tableIndex] !== undefined &&
          renderTable(data.tables[tableIndex])
        );
      }
    } else if (item.match(/:image[0-9]+/gm)) {
      return <Photo source={item} />  ;
    } else {
      return (
        <TextInput
          value={item}
          onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
          onChangeText={(value) => handleContent(value, index)}
          multiline={true}
          placeholder="Please input here..."
          style={{
            fontFamily: fonts.regular,
            color: colors.text,
            fontSize: 12,
            // height: hp('73%'),
            textAlignVertical: 'center',
          }}
        />
      );
    }
  };

  const handleUpload = async (res, callback) => {
    await Firebase.uploadFile(res.path, res.fileName, (value) => {
      console.warn('Url', value)
      callback(value);
    });
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
              await handleUpload(response, (url) => {
                let contentCopy = content;
                contentCopy = insert(
                  contentCopy,
                  `/:image${images.length}/`,
                  selection.start,
                );
                setContent(contentCopy);
                setImages(images.concat(url));
                setrefreshList(!refreshList);
              });
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
              await handleUpload(response, (url) => {
                let contentCopy = content;
                contentCopy = insert(
                  contentCopy,
                  `/:video${images.length}/`,
                  selection.start,
                );
                setContent(contentCopy);
                setVideos(videos.concat(url));
                setrefreshList(!refreshList);
              });
            }
          },
        );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainerStyle}
      style={{backgroundColor: noteBackground.value}}>
      <Portal>
        <Dialog
          visible={isBackgroundModalVisible}
          onDismiss={hideDialog}
          style={{backgroundColor: colors.background, borderRadius: 5}}>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{padding: wp('5%')}}>
              <Text style={{fontFamily: fonts.light, fontSize: 17}}>
                Colors
              </Text>
              <FlatList
                data={BACKGROUND_COLORS}
                renderItem={renderBackgrounds}
                // listKey={({index}) => `colorItem${index}-${Date.now()}`}
                numColumns={3}
                keyExtractor={(item, index) => String(index)}
              />
            </ScrollView>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Header
        {...props}
        headerStyle={{position: 'absolute', top: 0}}
        title="Add Entry"
        centerMainContainerStyle={{width: wp('75%')}}
        rightComponent={() => {
          return (
            <TouchableOpacity
              onPress={() => setBackgroundModalVisibility(true)}
              style={{
                width: hp('4%'),
                height: hp('4%'),
                backgroundColor: noteBackground.value,
                borderWidth: 1,
                borderRadius: hp('2%'),
              }}
            />
          );
        }}
      />
      <TextInput
        placeholder="Entry Title"
        style={{
          fontFamily: fonts.regular,
          color: colors.text,
          fontSize: 14,
          borderBottomColor: colors.text,
          borderBottomWidth: 1,
        }}
      />
      <View style={{flexDirection: 'row', marginVertical: 5}}>
        <Text style={{fontFamily: fonts.light, fontSize: 12, marginRight: 10}}>
          Date
        </Text>
        <Text
          onPress={showDatePicker}
          style={{fontFamily: fonts.medium, fontSize: 12}}>
          {inputDate === getCurrentFormattedDate('MMMM D, YYYY')
            ? 'Today'
            : inputDate}
        </Text>
      </View>
      <FlatList
        data={splittedContent}
        renderItem={renderContent}
        keyExtractor={(item, index) => String(index)}
        showsVerticalScrollIndicator={false}
        extraData={[content, splittedContent, refreshList]}
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
                onPress: () => console.log('Pressed table'),
                style: {backgroundColor: 'white'},
              },
              {
                icon: 'chart-bar',
                onPress: () => console.log('Pressed chart'),
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    height: hp('100%') - StatusBar.currentHeight,
    paddingHorizontal: wp('7%'),
    paddingTop: hp('10%'),
  },
});
