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

const CHART_TYPES = ['Pie', 'Bar', 'Line'];
export default function ChartsModal(props) {
  const {colors, roundness, fonts} = useTheme();
  let {visible, onDismiss} = props;
  const [expanded, setExpanded] = useState(false);
  const [selectedType, setselectedType] = useState('Select from list');
  const [errorMessage, seterrorMessage] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {
    if (props.data !== null) {
      // alert(JSON.stringify(props.data));
      setData(props.data.data.join());
      setselectedType(props.data.type);
    }
  }, [props.data]);

  const handleData = (text) => {
    text.split(',').some((item) => !item.match(/[\d|\,]/gm))
      ? seterrorMessage('Please insert numbers as data only!')
      : seterrorMessage('');
    setData(text);
    text === '' && seterrorMessage('');
  };

  const renderItem = ({item, index}) => {
    return (
      <List.Item
        onPress={() => {
          setselectedType(item);
          setExpanded(false);
        }}
        title={item}
        style={{fontStyle: fonts.regular, backgroundColor: '#F9F9F9'}}
      />
    );
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{backgroundColor: colors.background, borderRadius: 5}}>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={{paddingVertical: hp('3%')}}>
            <Text style={{fontFamily: fonts.light, fontSize: 17}}>
              {props.data !== null ? 'Edit' : 'Insert'} Chart
            </Text>
            <View style={[styles.subcontainer, {paddingVertical: 10}]}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                style={[
                  styles.labelStyle,
                  {
                    fontFamily: fonts.light,
                    color: colors.text,
                    width: wp('20%'),
                  },
                ]}>
                Chart type
              </Text>
              <List.Accordion
                style={styles.listInput}
                title={selectedType}
                expanded={expanded}
                onPress={() => setExpanded(!expanded)}>
                <FlatList
                  data={CHART_TYPES}
                  renderItem={renderItem}
                  keyExtractor={(index) => `fontStyle${index}`}
                />
              </List.Accordion>
            </View>
            <Text style={{fontFamily: fonts.light, color: colors.text}}>
              Chart Data
            </Text>
            <TextInput
              multiline={true}
              placeholder="Separate by comma, e.g. 1, 2, 3"
              value={data}
              onChangeText={handleData}
              style={[
                styles.dataInput,
                {backgroundColor: colors.accent1},
                errorMessage !== '' && {
                  borderColor: colors.error,
                  borderWidth: 1,
                },
              ]}
            />
            {errorMessage !== '' && (
              <Text style={{color: colors.error, fontSize: 10}}>
                {errorMessage}
              </Text>
            )}
            <Button
              disabled={!selectedType || errorMessage !== '' || data === ''}
              mode="contained"
              onPress={() =>
                props.data !== null
                  ? props.editChart(selectedType, data)
                  : props.saveChart(selectedType, data)
              }
              color={colors.positive}
              labelStyle={{color: 'white'}}
              style={{marginTop: 20}}>
              {props.data !== null ? 'Save' : 'Insert'}
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
