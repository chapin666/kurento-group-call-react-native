import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Button
} from 'react-native';

import {
    RTCView,
    RTCSessionDescription,
    RTCIceCandidate
} from 'react-native-webrtc';

import { startCommunication, addIceCandidate, ProcessAnswer } from '../utils/webrtc-utils';
import UserList from './UserList';

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

                <RTCView streamURL={this.state.videoURL} style={styles.videoContainer} />

                <View style={styles.listContainer}>
                    <UserList videoURL={this.state.remoteURL} />
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
                    pc.onaddstream = event => {
                        console.log("fuckllll" + event.stream);
                        this.setState({ remoteURL: event.stream.toURL() });
                    };
                });
                break;
            case 'newParticipantArrived':
                break;
            case 'participantLeft':
                break;
            case 'receiveVideoAnswer':
                ProcessAnswer(msg.sdpAnswer, () => {

                });
                break;
            case 'iceCandidate':
                addIceCandidate(new RTCIceCandidate(msg.candidate));
                break;
            default:
                console.error('Unrecognized message', msg.message);
        }
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
