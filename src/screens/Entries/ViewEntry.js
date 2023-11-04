import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  BackHandler,
  ScrollView,
  StatusBar,
  FlatList,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useTheme, IconButton, DataTable} from 'react-native-paper';
import AutoHeightImage from 'react-native-auto-height-image';
import Unorderedlist from 'react-native-unordered-list';
import convertToProxyURL from 'react-native-video-cache';
import {DragResizeContainer} from 'react-native-drag-resize';
import Orientation from 'react-native-orientation-locker';

import Header from 'components/Header';
import Charts from './components/Charts';
import VideoPlayer from './components/VideoPlayer';
import Object from './components/Object';
import * as Firebase from 'helpers/Firebase';
import Backgrounds from 'helpers/Backgrounds';
import Emojis from 'helpers/Emojis';

function Photo(props) {
  const [source, setSource] = useState('');
  let {imageStyle, uri} = props;

  // useEffect(() => {
  //   console.warn('Url', props.url);
  //   props.url.startsWith('https://') ? setSource(props.url) : fetchPhoto();
  // }, [props.url]);

  // const fetchPhoto = async () => {
  //   await Firebase.getDownloadUrl(props.url, (url) => {
  //     setSource(url);
  //   });
  // };

  return (
    <AutoHeightImage
      width={wp('86%')}
      source={{uri: props.url}}
      style={imageStyle}
    />
  );
}

function Video(props) {
  const [source, setSource] = useState('');

  useEffect(() => {
    console.warn('Url', props.url);
    props.url.startsWith('https://') ? setSource(props.url) : fetchVideo();
  }, [props.url]);

  const fetchVideo = async () => {
    await Firebase.getDownloadUrl(props.url, (url) => {
      setSource(url);
    });
  };

  return <VideoPlayer source={convertToProxyURL(source)} viewOnly={true} />;
}

export default function ViewEntry(props) {
  let {data} = props.route.params;
  // const [data, setData] = useState(null);
  const {colors, roundness, fonts} = useTheme();
  const [contentList, setContentList] = useState([]);

  useEffect(() => {
    const backAction = () => {
      setContentList([]);
      Orientation.lockToPortrait();
      props.navigation.goBack(null);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    data.orientation === 'landscape' && Orientation.lockToLandscape();
    let contentSplitter = /\/:(?<type>bullet|table|chart|image|video|emoji)[0-9]+\//gm,
      input = data.content,
      numBullets = 0,
      numTables = 0,
      numCharts = 0,
      numImages = 0,
      numVideos = 0,
      numEmojis = 0,
      index = 0,
      content = [];
    for (var token of input.split(contentSplitter)) {
      switch (token) {
        case 'bullet':
          numBullets += 1;
          content.push(`bullet${numBullets}`);
          break;
        case 'table':
          numTables += 1;
          content.push(`table${numTables}`);
          break;
        case 'chart':
          numCharts += 1;
          content.push(`chart${numCharts}`);
          break;
        case 'image':
          numImages += 1;
          content.push(`image${numImages}`);
          break;
        case 'video':
          numVideos += 1;
          content.push(`video${numVideos}`);
          break;
        case 'emoji':
          numEmojis += 1;
          content.push(`emoji${numEmojis}`);
          break;
        default:
          content.push(token.trim());
      }
      index += 1;
    }
    setContentList(content);
  }, [props.route.params]);

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
    let {type, data} = item;
    return <Charts type={type} data={data} viewOnly={true} />;
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
    let {columnHeaders, rowData} = data;
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
    let numMatches = item.match(/\d+/g);
    let numRemover = /[^\d]/g;
    if (item.match(/bullet[0-9]+/gm)) {
      let bulletItem = data.bullets[parseInt(item.replace(numRemover, '')) - 1];
      return (
        bulletItem !== undefined && (
          <Unorderedlist color={data.fontColor} style={{fontSize: 13}}>
            <Text
              style={{
                fontFamily: fonts.regular,
                color: data.fontColor,
                fontSize: 13,
              }}>
              {bulletItem}
            </Text>
          </Unorderedlist>
        )
      );
    } else if (item.match(/chart[0-9]+/gm)) {
      let chartIndex = parseInt(item.replace(numRemover, '')) - 1;
      {
        return (
          data.charts[chartIndex] !== undefined &&
          renderChart(data.charts[chartIndex])
        );
      }
    } else if (item.match(/table[0-9]+/gm)) {
      let tableIndex = parseInt(item.replace(numRemover, '')) - 1;
      {
        return (
          JSON.parse(data.tables)[tableIndex] !== undefined &&
          renderTable(JSON.parse(data.tables)[tableIndex])
        );
      }
    } else if (item.match(/image[0-9]+/gm)) {
      return <Photo url={data.images[numMatches[0] - 1]} />;
    } else if (item.match(/video[0-9]+/gm)) {
      return <Video url={data.videos[numMatches[0] - 1]} />;
    } else if (item.match(/emoji[0-9]+/gm)) {
      return (
        <Image
          source={Emojis['emoji' + data.emojis[numMatches[0] - 1]]}
          style={{width: '100%', height: hp('10%'), resizeMode: 'contain'}}
        />
      );
    } else {
      return (
        <Text
          style={{
            fontFamily: fonts.regular,
            color: data.fontColor,
            fontSize: 14,
            textAlignVertical: 'top',
          }}>
          {item}
        </Text>
      );
    }
  };
  return (
    <ImageBackground
      imageStyle={{resizeMode: 'stretch'}}
      source={
        data.background.title.includes('bg')
          ? Backgrounds['background' + data.background.value]
          : ''
      }
      style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        style={
          !data.background.title.includes('bg') && {
            backgroundColor: data.background.value,
          }
        }>
        <Header
          {...props}
          headerStyle={{position: 'absolute', top: 0}}
          title={data.title === '' ? 'No title' : data.title}
          centerMainContainerStyle={{width: useWindowDimensions().width * 0.75}}
          rightComponent={() => {
            return (
              <IconButton
                icon={'pencil-outline'}
                color={colors.text}
                size={hp('4%')}
                onPress={() => {
                  props.navigation.navigate('AddEntry', {
                    data,
                    refreshList: props.route.params.refreshList,
                  });
                  // alert('This feature is under development');
                }}
              />
            );
          }}
          rightMainContainerStyle={{flex: 1, alignItems: 'flex-end'}}
        />
        <DragResizeContainer
          onInit={({x, y, w, h}) =>
            console.log(`X: ${x}, Y: ${y}, W: ${w}, H: ${h}`)
          }
          style={{flex: 1}}>
          {data?.objects?.map((item, index) => {
            console.log(item);
            return (
              <Object
                viewOnly={true}
                index={item.item}
                x={item.coordinates.x}
                y={item.coordinates.y}
                w={item.pixels.w}
                h={item.pixels.h}
              />
            );
          })}
          <FlatList
            data={contentList}
            renderItem={renderContent}
            keyExtractor={(item, index) => String(index)}
            contentContainerStyle={{
              paddingVertical: hp('3%'),
              paddingHorizontal: wp('7%'),
            }}
            showsVerticalScrollIndicator={false}
          />
        </DragResizeContainer>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    height: hp('100%') - StatusBar.currentHeight,
    paddingTop: hp('8%'),
  },
});
