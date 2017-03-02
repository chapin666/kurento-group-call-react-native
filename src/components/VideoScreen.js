import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Button
} from 'react-native';

import {
    RTCView
} from 'react-native-webrtc';

import { getLocalStream, createPC } from '../utils/webrtc-utils';
import UserList from './UserList';

let socket = null;
const WSS_CLIENT_SERVER = 'ws://47.91.149.159:9000/one2one';

function sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
	console.log('Senging message: ' + jsonMessage);
    if (socket) {
	    socket.send(jsonMessage);
    }
}


export default class RoomScreen extends Component {

    constructor() {
        super();

        this.state = {
            videoURL: null,
        };
    }

    componentDidMount () {

        //socket = new WebSocket(WSS_CLIENT_SERVER);

        socket = new WebSocket(WSS_CLIENT_SERVER);

        socket.onopen = () => {
            console.log('connected');
            
            let message = {
               id : 'register',
               name : 'chapin'
            };  
            sendMessage(message);
        }

        socket.onerror = (error) => {
            console.log(error);
        }
        
        getLocalStream(true, stream => {
            localStream = stream;
            console.log(stream.toURL());
            this.setState({ videoURL: stream.toURL() });
        });
    }


    componentWillUnmount () {
        if (socket) {
            console.log('socket close');
            socket.close();
        }
    }
    

    render() {
        return (
            <View style={styles.container}>

                <RTCView streamURL={this.state.videoURL} style={styles.videoContainer} />

                <View style={styles.listContainer}>
                    <UserList videoURL={this.state.videoURL} />
                </View>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listContainer: {
        flex: 0.5
    }
});
