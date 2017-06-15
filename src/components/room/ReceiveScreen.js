import React, { Component } from 'react';
import config from "../../config/app.js";
import { 
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native';

import { RTCView } from 'react-native-webrtc';

export default class ReceiveScreen extends Component {
    
    render() {
        return (
            <View style={styles.root}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>房间成员</Text>
                </View>
                <RTCView objectFit='cover' zOrder={1} style={styles.contentContainer} streamURL={this.props.videoURL} />
            </View>
        )
    }
    
}


const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    titleContainer: {
        flex: 0.1,
        paddingVertical: 2,
        paddingLeft: 10
    },
    title: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.5)'
    },

    contentContainer: {
       flex: 1,
       backgroundColor: 'transparent'
    }
});
