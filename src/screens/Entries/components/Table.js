import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import {useTheme, IconButton, DataTable} from 'react-native-paper';
import { color } from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Table(props) {
  const {colors, roundness, fonts} = useTheme();
  const [tableData, setTableData] = useState(null);
  const [tableHeight, setTableHeight] = useState(0);
  const [tableWidth, setTableWidth] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setTableData(props.data);
  }, [props.data]);

  const handleCellItem = (value, rowIndex, cellIndex) => {
    let tableDataCopy = tableData;
    tableDataCopy.rowData[rowIndex][cellIndex] = value;
    setTableData(tableDataCopy);
    setRefresh(!refresh);
  };

  const handleColumnHeader = (value, index) => {
    let tableDataCopy = tableData;
    tableDataCopy.columnHeaders[index] = value;
    setTableData(tableDataCopy);
    setRefresh(!refresh);
  };

  const handleAddColumn = () => {
    let tableDataCopy = tableData;
    tableDataCopy.columnHeaders.push('');
    tableDataCopy.rowData.map((rowItem, rowIndex) => {
      tableDataCopy.rowData[rowIndex].push('');
    });
    setTableData(tableDataCopy);
    setRefresh(!refresh);
  };

  const handleAddRow = () => {
    let tableDataCopy = tableData;
    tableDataCopy.rowData.push(
      new Array(tableData.columnHeaders.length).fill(''),
    );
    setTableData(tableDataCopy);
    setRefresh(!refresh);
  };

  const renderRow = ({item, index}) => {
    return (
      <DataTable.Row>
        {item.map((cellItem, cellIndex) => {
          return (
            <TextInput
              placeholder={`Row ${index + 1}-${cellIndex + 1}`}
              value={cellItem}
              onChangeText={(value) => handleCellItem(value, index, cellIndex)}
              style={{width: wp('65%') / tableData.columnHeaders.length, color: colors.text}}
              placeholderTextColor={colors.text}
            />
          );
        })}
      </DataTable.Row>
    );
  };

  return (
    <View>
      <IconButton
        onPress={props.onPressDelete}
        icon="trash-can"
        size={20}
        color="white"
        style={{
          elevation: 5,
          backgroundColor: 'rgba(0,0,0, 0.5)',
          alignSelf: 'flex-end',
        }}
      />
      {tableData !== null && (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            overflow: 'scroll',
            paddingBottom: 50,
          }}>
          <View style={{flexDirection: 'row'}}>
            <DataTable
              onLayout={(e) => {
                setTableHeight(e.nativeEvent.layout.height);
                setTableWidth(e.nativeEvent.layout.width);
                console.warn('Table dimensions', e.nativeEvent.layout);
              }}
              style={{
                backgroundColor: colors.background,
                elevation: 7,
                width: '80%',
              }}>
              <DataTable.Header>
                {tableData.columnHeaders.map((item, index) => {
                  return (
                    <TextInput
                      placeholder={`Col ${index + 1}`}
                      placeholderTextColor={colors.text}
                      value={item}
                      onChangeText={(value) => handleColumnHeader(value, index)}
                      style={{
                        width: wp('65%') / tableData.columnHeaders.length,
                        color: colors.text
                      }}
                    />
                  );
                })}
                {/* <IconButton icon="plus"/> */}
              </DataTable.Header>
              <FlatList
                data={tableData.rowData}
                renderItem={renderRow}
                keyExtractor={(item, index) => String(index)}
                extraData={[tableData, refresh]}
              />
            </DataTable>
            <IconButton
              onPress={handleAddColumn}
              icon="plus"
              style={{
                backgroundColor: colors.background,
                position: 'absolute',
                right: 0,
                top: 10,
              }}
            />
          </View>
          <IconButton
            onPress={handleAddRow}
            icon="plus"
            style={{
              backgroundColor: colors.background,
              position: 'absolute',
              bottom: 0,
            }}
          />
        </ScrollView>
      )}
    </View>
  );
}
