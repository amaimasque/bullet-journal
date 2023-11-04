import { DefaultTheme } from "react-native-paper";

export const themes = {
  candy: {
    ...DefaultTheme,
    // dark: boolean;
    // mode?: Mode;
    roundness: 50,
    colors: {
      ...DefaultTheme.colors,
      primary: 'white',
      background: 'white',
      // surface: string;
      accent: '#FAE7DF',
      error: '#F02D3A',
      text: 'black',
      // onSurface: string;
      // onBackground: string;
      headerAccent: '#DECEC7',
      // placeholder: string;
      backdrop: 'rgba(0,0,0,0.5)',
      // notification: string;
      accent1: '#F9F9F9',
      accent2: '#CECECE',
      positive: '#8896D7',
    },
    // fonts: {
    //   regular: 'Roboto-Regular',
    //   medium: 'Roboto-Medium',
    //   bold: 'Roboto-Bold',
    //   light: 'Roboto-Light',
    //   thin: 'Roboto-Thin',
    // },
    animation: {
      scale: 2,
    },
  },
  dark: {
    // dark: true;
    roundness: 50,
    colors: {
      primary: 'black',
      background: '#202020',
      accent: '#7E7E7E',
      error: '#E03A3E',
      text: '#FFFFFF',
      headerAccent: '#7E7E7E',
      backdrop: 'rgba(0,0,0,0.5)',
      accent1: '#444242',
      accent2: '#99B898',
      positive: '#FECEA8',
    },
    fonts: {
      regular: 'Roboto-Regular',
      medium: 'Roboto-Medium',
      bold: 'Roboto-Bold',
      light: 'Roboto-Light',
      thin: 'Roboto-Thin',
    },
    animation: {
      scale: 2,
    },
  },
  coffee: {
    // dark: true;
    roundness: 50,
    colors: {
      primary: 'black',
      background: '#AB9A6E',
      accent: '#B6A587',
      error: '#621C1D',
      text: '#FFFFFF',
      headerAccent: '#C0A88C',
      backdrop: 'rgba(0,0,0,0.5)',
      accent1: '#9B8C73',
      accent2: '#CFB292',
      positive: '#CFB292',
    },
    fonts: {
      regular: 'Roboto-Regular',
      medium: 'Roboto-Medium',
      bold: 'Roboto-Bold',
      light: 'Roboto-Light',
      thin: 'Roboto-Thin',
    },
    animation: {
      scale: 2,
    },
  },
  evergreen: {
    // dark: true;
    roundness: 50,
    colors: {
      primary: 'black',
      background: '#798F68',
      accent: '#A0C6AF',
      error: '#8E3535',
      text: '#FFFFFF',
      headerAccent: '#A9A156',
      backdrop: 'rgba(0,0,0,0.5)',
      accent1: '#5E6F51',
      accent2: '#D0C689',
      positive: '#EFEFBD',
    },
    fonts: {
      regular: 'Roboto-Regular',
      medium: 'Roboto-Medium',
      bold: 'Roboto-Bold',
      light: 'Roboto-Light',
      thin: 'Roboto-Thin',
    },
    animation: {
      scale: 2,
    },
  },
  seas: {
    // dark: true;
    roundness: 50,
    colors: {
      primary: 'white',
      background: '#479DC2',
      accent: '#AAE2DE',
      error: '#E45068',
      text: 'black',
      headerAccent: '#B8FCF3',
      backdrop: 'rgba(0,0,0,0.5)',
      accent1: '#479DC2',
      accent2: '#96E2DD',
      positive: '#53D1BE',
    },
    fonts: {
      regular: 'Roboto-Regular',
      medium: 'Roboto-Medium',
      bold: 'Roboto-Bold',
      light: 'Roboto-Light',
      thin: 'Roboto-Thin',
    },
    animation: {
      scale: 2,
    },
  },
  banana: {
    // dark: true;
    roundness: 50,
    colors: {
      primary: 'white',
      background: '#FFF69B',
      accent: '#FDE873',
      error: '#D63751',
      text: '#000E34',
      headerAccent: '#DAC969',
      backdrop: 'rgba(0,0,0,0.5)',
      accent1: '#EBD65F',
      accent2: '#278ED9',
      positive: '#3AA7F7',
    },
    fonts: {
      regular: 'Roboto-Regular',
      medium: 'Roboto-Medium',
      bold: 'Roboto-Bold',
      light: 'Roboto-Light',
      thin: 'Roboto-Thin',
    },
    animation: {
      scale: 2,
    },
  },
};

export const fonts = {
  Roboto: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
    light: 'Roboto-Light',
    thin: 'Roboto-Thin',
  },
  BigShouldersDisplay: {
    regular: 'BigShouldersDisplay-Regular',
    medium: 'BigShouldersDisplay-Medium',
    bold: 'BigShouldersDisplay-Bold',
    light: 'BigShouldersDisplay-Light',
    thin: 'BigShouldersDisplay-Thin',
  },
  Mali: {
    regular: 'Mali-Regular',
    medium: 'Mali-Medium',
    bold: 'Mali-Bold',
    light: 'Mali-Light',
    thin: 'Mali-ExtraLight',
  },
  Montserrat: {
    regular: 'Montserrat-Regular',
    medium: 'Montserrat-Medium',
    bold: 'Montserrat-Bold',
    light: 'Montserrat-Light',
    thin: 'Montserrat-ExtraLight',
  },
  OpenSans: {
    regular: 'OpenSans-SemiBold',
    medium: 'OpenSans-Medium',
    bold: 'OpenSans-Bold',
    light: 'OpenSans-Regular',
    thin: 'OpenSans-Light',
  },
};
