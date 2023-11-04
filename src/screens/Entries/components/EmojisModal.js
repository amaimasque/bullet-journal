import React from 'react';
import {TouchableOpacity, ScrollView, FlatList, Image} from 'react-native';
import {useTheme, Portal, Dialog} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Emojis from 'helpers/Emojis';

export default function EmojisModal(props) {
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
              data={Object.values(Emojis)}
              renderItem={renderItem}
              keyExtractor={(index) => `object${index}`}
            />
          </ScrollView>
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
}
