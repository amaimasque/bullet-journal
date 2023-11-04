import React, {useState} from 'react';
import {View, useWindowDimensions} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {IconButton} from 'react-native-paper';

export default function CustomVideoPlayer(props) {

  const [video, setVideo] = useState({width: undefined, height: undefined, duration: undefined});
  const [thumbnailUrl, setThumbnailUrl] = useState(undefined);
  const [videoUrl, setVideoUrl] = useState(undefined);

  return (
    <View>
      {!props.viewOnly && (
        <IconButton
          onPress={props.onPressDelete}
          icon="close"
          size={20}
          color="white"
          style={{
            elevation: 10,
            position: 'absolute',
            right: 0,
            zIndex: 5,
            backgroundColor: 'black',
          }}
        />
      )}
      <VideoPlayer
        video={{
          uri:
            props.source !== undefined
              ? props.source.uri === undefined
                ? props.source
                : props.source.uri
              : '',
        }}
        // videoWidth={wp('86%')}
        videoWidth={useWindowDimensions().width * 0.86}
        // videoHeight={hp('30%')}
        videoHeight={useWindowDimensions().height * 0.30}
        duration={
          video
            .duration /* I'm using a hls stream here, react-native-video
          can't figure out the length, so I pass it here from the vimeo config */
        }
        // style={{aspectRatio: 1 / 2}}
      />
    </View>
  );
}
