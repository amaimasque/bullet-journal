import React, {Component} from 'react';
import {themes, fonts} from './Constants';
import {Provider as PaperProvider} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
const Context = React.createContext();

export class AppContextProvider extends Component {
  state = {
    loaded: false,
    theme: themes.candy,
    font: fonts.Roboto,
    fontColor: 'white',
    updateTheme: async (theme) => {
      await AsyncStorage.setItem('THEME', theme);
      this.setState({theme: themes[theme]});
    },
    updateFont: async (font) => {
      // alert(font + JSON.stringify(fonts[font]))
      await AsyncStorage.setItem('FONT', font);
      this.setState({font: fonts[font]});
      // this.setState({theme: {...themes[chosenTheme], fonts: fonts[font]}});
    },
    updateFontColor: async (fontColor) => {
      await AsyncStorage.setItem('FONT_COLOR', fontColor);
      let chosenTheme = await AsyncStorage.getItem('THEME');
      this.setState({
        theme: {
          ...themes[chosenTheme],
          colors: {...themes[chosenTheme].colors, text: fontColor},
        },
        fontColor,
      });
    },
  };

  async componentDidMount() {
    let chosenTheme = await AsyncStorage.getItem('THEME'),
      chosenFont = await AsyncStorage.getItem('FONT'),
      chosenFontColor = await AsyncStorage.getItem('FONT_COLOR');
    // alert(chosenTheme + chosenFont + chosenFontColor)
    if (
      chosenTheme == null ||
      chosenFont === null ||
      chosenFontColor === null
    ) {
      await AsyncStorage.setItem('THEME', 'candy');
      this.setState(
        {
          theme: themes.candy,
          font: fonts.Roboto,
          fontColor: 'white',
        },
        () => {
          this.setState({loaded: true});
        },
      );
    } else {
      this.setState(
        {
          theme: {
            ...themes[chosenTheme],
            fonts: fonts[chosenFont],
            colors: {...themes[chosenTheme].colors, text: chosenFontColor},
          },
          font: fonts[chosenFont],
          fontColor: chosenFontColor,
        },
        () => {
          this.setState({loaded: true});
        },
      );
    }
  }

  render() {
    const {theme, font, loaded} = this.state;
    return (
      <Context.Provider value={this.state}>
        {loaded && (
          <PaperProvider theme={{...theme, fonts: font}}>
            {this.props.children}
          </PaperProvider>
        )}
      </Context.Provider>
    );
  }
}

export const AppConsumer = Context.Consumer;
export const AppContext = Context;
