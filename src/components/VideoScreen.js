import React, { Component } from 'react';
import config from "../config/app";
import { 
    View,
    StyleSheet,
    Button,
    Image
} from 'react-native';

import {
    RTCView,
    RTCSessionDescription,
    RTCIceCandidate
} from 'react-native-webrtc';

import { startCommunication, addIceCandidate, ProcessAnswer } from '../utils/webrtc-utils';
import ReceiveScreen from './ReceiveScreen';

const WSS_CLIENT_SERVER = 'ws://192.168.1.115:8080/groupcall';

let socket = null;

function sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    if (socket) {
	    socket.send(jsonMessage);
    }
}

export default class RoomScreen extends Component {

    constructor() {
        super();

        this.state = {
            videoURL: null,
            remoteURL: null,
        };

    }

    componentDidMount () {

        socket = new WebSocket(WSS_CLIENT_SERVER, {
            rejectUnauthorized: false
        });

        socket.onopen = () => {
            var message = {
                id : 'joinRoom',
                name : 'zhangsan',
                room : '8888',
                presenter: true
            };
            sendMessage(message);
        };

        socket.onerror = (err) => {
            console.log(err);
        };


        socket.onmessage = message => {
            var parsedMessage = JSON.parse(message.data);
            this.messageProcessHandler(parsedMessage);
        };
    }


    componentWillUnmount () {
        if (socket) {
            socket.close();
        }
    }
    

    render() {
        return (
            <View style={styles.container}>
                
                <RTCView zOrder={0} objectFit='cover' style={styles.videoContainer} streamURL={this.state.videoURL}  />

                <View style={styles.floatView}>
                    <ReceiveScreen videoURL={this.state.remoteURL} />
                </View>
                
            </View>
        );
    }


    messageProcessHandler(msg) {
        console.log('message: ' + msg.id);
        switch (msg.id) {
            case 'existingParticipants':
                startCommunication(sendMessage, 'zhangsan', (stream, pc) => {
                    this.setState({ videoURL: stream.toURL() });
                });
                msg.data.forEach((participant) => {
                    startCommunication(sendMessage, participant.name, (stream, pc) => {
                        pc.onaddstream = event => {
                            this.setState({ remoteURL: event.stream.toURL() });
                        };
                    });
                });
                break;
            case 'newParticipantArrived':
                break;
            case 'participantLeft':
                break;
            case 'receiveVideoAnswer':
                ProcessAnswer(msg.name, msg.sdpAnswer, (err) => {
                    if (err) {
                        console.error('the error: ' + err);
                    }
                });
                break;
            case 'iceCandidate':
                addIceCandidate(msg.name, new RTCIceCandidate(msg.candidate));
                break;
            default:
                console.error('Unrecognized message', msg.message);
        }
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    videoContainer: {
        flex: 1
    },
    floatView: {
        position: 'absolute',
        width: 250,
        height: 210,
        bottom: 15,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15
    }
});
