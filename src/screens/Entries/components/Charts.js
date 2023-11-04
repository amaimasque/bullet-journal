/* eslint-disable prettier/prettier */
import React from 'react';
import {View, useWindowDimensions, TouchableOpacity} from 'react-native';
import {Grid, LineChart, PieChart, BarChart} from 'react-native-svg-charts';
import {IconButton} from 'react-native-paper';

export default function Charts(props) {
  let {type, data, onPressDelete, viewOnly, onPressChart} = props;

  const renderChart = () => {
    switch (type) {
      case 'Line':
        return (
          <View style={{height: 200, marginBottom: 30}}>
            <LineChart
              style={{height: 200}}
              data={data}
              svg={{stroke: 'rgb(134, 65, 244)'}}
              contentInset={{top: 20, bottom: 20}}>
              <Grid />
            </LineChart>
          </View>
        );
      case 'Pie':
        const randomColor = () =>
          (
            '#' +
            ((Math.random() * 0xffffff) << 0).toString(16) +
            '000000'
          ).slice(0, 7);
        const pieData = data
          .filter((value) => value > 0)
          .map((value, index) => ({
            value,
            svg: {
              fill: randomColor(),
              onPress: () => console.log('press', index),
            },
            key: `pie-${index}`,
          }));

        return <PieChart style={{height: 200}} data={pieData} />;
      case 'Bar':
        const fill = 'rgb(134, 65, 244)';

        return (
          <BarChart
            style={{height: 200}}
            data={data}
            svg={{fill}}
            contentInset={{top: 30, bottom: 30}}>
            <Grid />
          </BarChart>
        );
    }
  };

  return (
    <TouchableOpacity disabled={viewOnly} onPress={onPressChart} style={{width: useWindowDimensions().width * 0.86}}>
      {!viewOnly && (
        <IconButton
          onPress={onPressDelete}
          icon="trash-can"
          size={20}
          color="white"
          style={{
            elevation: 10,
            position: 'absolute',
            right: 0,
            zIndex: 5,
            backgroundColor: 'rgba(0,0,0, 0.5)',
          }}
        />
      )}
      {renderChart()}
    </TouchableOpacity>
  );
}
