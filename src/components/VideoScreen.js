import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Button,
    Image,
    BackAndroid,
    ToastAndroid
} from 'react-native';

import {
    RTCView,
    RTCSessionDescription,
    RTCIceCandidate
} from 'react-native-webrtc';

import { 
    startCommunication, 
    receiveVideo,
    addIceCandidate, 
    ProcessAnswer,
    ReleaseMeidaSource
} from '../utils/webrtc-utils';

import config from "../config/app";

import ReceiveScreen from './ReceiveScreen';

import Display from 'react-native-display';

import InCallManager from 'react-native-incall-manager';

import { Actions } from 'react-native-router-flux';


const participants = {};

const WSS_CLIENT_SERVER = 'ws://47.91.149.159:8081/groupcall';
let socket = null;

function sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    if (socket) {
	    socket.send(jsonMessage);
    }
}

export default class VideoScreen extends Component {

    constructor(params) {
        super();

        this.state = {
            videoURL: null,
            remoteURL: null,
            userName: params.userName,
            roomName: params.roomName
        };

        this.userName = params.userName;
        this.roomName = params.roomName;
    }


    componentDidMount () {

        InCallManager.setSpeakerphoneOn(true);
        InCallManager.setKeepScreenOn(true);

        socket = new WebSocket(WSS_CLIENT_SERVER, {
            rejectUnauthorized: false
        });

        socket.onopen = () => {
            var message = {
                id : 'joinRoom',
                name : this.state.userName,
                room : this.state.roomName,
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


    componentWillMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }


    componentWillUnmount () {
        BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        if (socket) {
            console.log('socket closed');
            socket.close();
        }
    }

    onBackAndroid = () => {  
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            sendMessage({
                id: 'leaveRoom'
            });
            participants = {};
            ReleaseMeidaSource();
            BackAndroid.exitApp();
            return false;
        }

        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        return true;
    };


    render() {
        return (
            <View style={styles.container}>
                
                <RTCView zOrder={0} objectFit='cover' style={styles.videoContainer} streamURL={this.state.videoURL}  />

                <Display enable={this.state.remoteURL != null}>
                    <View style={styles.floatView}>
                        <ReceiveScreen videoURL={this.state.remoteURL} />
                    </View>
                </Display>
            </View>
        );
    }


    messageProcessHandler(msg) {
        switch (msg.id) {
            case 'existingParticipants':
                startCommunication(sendMessage, this.state.userName, (stream) => {
                    this.setState({ videoURL: stream.toURL() });
                });

                msg.data.forEach((participant) => {
                    participants[participant.name] = participant.name;
                    receiveVideo(sendMessage, participant.name, (stream, pc) => {
                        pc.onaddstream = (event) => {
                            console.log('url====' + event.stream.toURL());
                            this.setState({ remoteURL: event.stream.toURL() });
                        };
                    });
                });
                break;
            case 'newParticipantArrived':
                participants[msg.name] = msg.name;            
                if (this.state.remoteURL == null || this.state.remoteURL === '') {
                    receiveVideo(sendMessage, msg.name, (stream, pc) => {
                        pc.onaddstream = (event) => {
                            this.setState({ remoteURL: event.stream.toURL() });
                        };
                    });
                }
                break;
            case 'participantLeft':
                this.participantLeft(msg.name);   
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

    /**
     *  partipant leave
     * 
     * @param {*} name 
     */
    participantLeft(name) {
        if (participants[name]) {
            delete participants[name];
        }

        if (Object.keys(participants).length == 0) {
            this.setState({
                remoteURL: null
            });
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
