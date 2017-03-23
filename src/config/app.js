import { Dimensions } from 'react-native';

const window = Dimensions.get('window');

export default {
  screenWidth: window.width,
  screenHeight: window.height,
  thumbnailHeight: 100,
  video: {
    minWidth: 500,
    minHeight: 300,
    minFrameRate: 30
  }
}