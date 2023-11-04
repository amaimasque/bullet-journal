import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  StatusBar,
  FlatList,
  TextInput,
} from 'react-native';
import {
  useTheme,
  FAB,
  Portal,
  Dialog,
  Button,
  DataTable,
  List,
} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import HsvColorPicker from 'react-native-hsv-color-picker';

export default function FontColorModal(props) {
  const {colors, roundness, fonts} = useTheme();
  let {visible, onDismiss, onSave} = props;
  const [expanded, setExpanded] = useState(false);
  const [selectedType, setselectedType] = useState('Select from list');
  const [errorMessage, seterrorMessage] = useState('');
  const [data, setData] = useState('');
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(0);
  const [val, setVal] = useState(1);
  const [fontColor, setFontColor] = useState(colors.text);

  function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
      (s = h.s), (v = h.v), (h = h.h);
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  useEffect(() => {
    let color = HSVtoRGB(hue, sat, val);
    setFontColor(`rgb(${color.r}, ${color.g}, ${color.b})`);
  }, [hue, sat, val]);

  useEffect(() => {
    if (props.data !== '') {
      setFontColor(props.data);
    }
  }, [props.data]);

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{backgroundColor: colors.background, borderRadius: 5}}>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={{paddingVertical: hp('3%')}}>
            <HsvColorPicker
              huePickerHue={hue}
              onHuePickerDragMove={({hue}) => setHue(hue)}
              onHuePickerPress={({hue}) => setHue(hue)}
              satValPickerHue={hue}
              satValPickerSaturation={sat}
              satValPickerValue={val}
              onSatValPickerDragMove={({saturation, value}) => {
                setSat(saturation);
                setVal(value);
              }}
              onSatValPickerPress={({saturation, value}) => {
                setSat(saturation);
                setVal(value);
                // console.warn(saturation, value);
              }}
            />
            <Button
              mode="contained"
              onPress={() => {
                onSave(fontColor);
                onDismiss();
              }}
              color={colors.positive}
              labelStyle={{color: 'white'}}
              style={{marginTop: 20}}>
              SAVE
            </Button>
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
  listInput: {
    width: wp('53%'),
    backgroundColor: '#F0F0F0',
  },
});
