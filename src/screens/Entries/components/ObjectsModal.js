import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  FlatList,
  Image,
} from 'react-native';
import {useTheme, Portal, Dialog} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Objects from 'helpers/Objects';

export default function ObjectsModal(props) {
  const {colors} = useTheme();
  let {visible, onDismiss, onPressItem} = props;

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressItem(index + 1)}
        style={{margin: wp('2%')}}>
        <Image
          source={item}
          style={{width: wp('20%'), height: wp('20%'), resizeMode: 'contain'}}
        />
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
            contentContainerStyle={{paddingVertical: hp('3%')}}
            showsVerticalScrollIndicator={false}>
            <FlatList
              numColumns={3}
              data={Object.values(Objects)}
              renderItem={renderItem}
              keyExtractor={(index) => `object${index}`}
            />
          </ScrollView>
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    height: hp('100%') - StatusBar.currentHeight,
    paddingHorizontal: wp('10%'),
  },
  subcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelStyle: {
    textAlignVertical: 'center',
    width: wp('20%'),
    height: 65,
  },
  dataInput: {
    borderRadius: 5,
    height: hp('20%'),
    textAlignVertical: 'top',
    padding: 10,
  },
});
