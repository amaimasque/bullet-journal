import React from 'react';
import {useTheme, Portal, Dialog, ActivityIndicator} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function LoadingModal(props) {
  const {colors} = useTheme();
  let {visible} = props;

  return (
    <Portal>
      <Dialog
        visible={visible}
        style={{
          backgroundColor: colors.background,
          borderRadius: 5,
          width: wp('20%'),
          padding: 10,
          alignSelf: 'center',
        }}>
        <ActivityIndicator
          animating={true}
          size="large"
          color={colors.accent}
        />
      </Dialog>
    </Portal>
  );
}
