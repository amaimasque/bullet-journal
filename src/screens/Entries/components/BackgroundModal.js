import React from 'react';
import {
  TouchableOpacity,
  ScrollView,
  FlatList,
  View,
  Text,
  Image,
} from 'react-native';
import {useTheme, Portal, Dialog, IconButton} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Backgrounds from 'helpers/Backgrounds';

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

export default function BackgroundModal(props) {
  const {colors, fonts} = useTheme();
  let {visible, onDismiss, onPressItem, noteBackground} = props;

  const renderBackgrounds = ({item, index}) => {
    let {title, value} = item,
      checked = noteBackground.title === title;
    return (
      <View>
        <TouchableOpacity
          onPress={() => onPressItem(item)}
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

  const renderBackgroundPhotos = ({item, index}) => {
    let checked = noteBackground.title === `bg${index + 1}`;
    return (
      <TouchableOpacity
        onPress={() =>
          onPressItem({title: `bg${index + 1}`, value: index + 1})
        }>
        <Image
          source={item}
          style={{
            borderRadius: wp('15%') / 2,
            width: wp('15%'),
            height: wp('15%'),
            borderColor: 'black',
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
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{backgroundColor: colors.background, borderRadius: 5, width: wp('85%'), alignSelf: 'center'}}>
        <Dialog.ScrollArea>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{padding: wp('5%')}}>
            <Text style={{fontFamily: fonts.light, fontSize: 17}}>Colors</Text>
            <FlatList
              data={BACKGROUND_COLORS}
              renderItem={renderBackgrounds}
              // listKey={({index}) => `colorItem${index}-${Date.now()}`}
              numColumns={3}
              keyExtractor={(item, index) => String(index)}
            />
            <Text style={{fontFamily: fonts.light, fontSize: 17}}>
              Backgrounds
            </Text>
            <FlatList
              data={Object.values(Backgrounds)}
              renderItem={renderBackgroundPhotos}
              // listKey={({index}) => `colorItem${index}-${Date.now()}`}
              numColumns={3}
              keyExtractor={(item, index) => String(index)}
            />
          </ScrollView>
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
}
