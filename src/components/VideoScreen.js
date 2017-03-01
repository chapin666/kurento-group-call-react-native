import React, { Component, PropTypes } from 'react';
import { 
    View,
    Text,
    StyleSheet 
} from 'react-native';

import {
    RTCPeerConnection,
    RTCMediaStream,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStreamTrack,
    getUserMedia,
} from 'react-native-webrtc';

export default class RoomScreen extends Component {

    render() {
        return (
            <View style={styles.container}>
                <RTCView  />
            </View>
        );
    }

}

const styles = StyleSheet.create({
   container: {
        flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
    }
});