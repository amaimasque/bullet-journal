import React, {useEffect, useState} from 'react';
import {Image, useWindowDimensions} from 'react-native';
import {DragResizeBlock} from 'react-native-drag-resize';
import Objects from 'helpers/Objects';

export default function Photo(props) {
  const [isActive, setIsActive] = useState(false);
  let {
    index,
    handleSelectedObject,
    selectedIndex,
    handleCoordinates,
    handlePixels,
    x,
    y,
    w,
    h,
    viewOnly,
    limits,
  } = props;

  useEffect(() => {
    selectedIndex !== index && setIsActive(false);
  }, [selectedIndex, index]);

  console.log(viewOnly);

  return (
    <DragResizeBlock
      x={x}
      y={y}
      // w={w}
      // h={h}
      // minW={50}
      // minH={50}
      zIndex={10}
      limitations={limits}
      onPress={() => {
        !viewOnly && setIsActive(true) && handleSelectedObject(index);
      }}
      isDisabled={!viewOnly ? !isActive : true}
      onDragEnd={(coord) => {
        handleCoordinates(coord[0], coord[1]);
        setTimeout(() => setIsActive(false), 3000);
      }}
      onResizeEnd={(pixels) => handlePixels(pixels[0], pixels[1])}
      style={{width: w, height: h}}>
      {/* <View style={{width: w, height: h}}> */}
      <Image
        source={Objects['object' + index]}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
        }}
        onLayout={(e) => {
          !viewOnly &&
            handlePixels(
              e.nativeEvent.layout.width,
              e.nativeEvent.layout.height,
            );
          // console.warn(e.nativeEvent.layout.height + ' ' + e.nativeEvent.layout.width)
        }}
      />
      {/* </View> */}
    </DragResizeBlock>
  );
}
