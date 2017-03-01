import React, { Component, PropTypes } from 'react';
import { 
    View,
    Text,
    StyleSheet,
    Button
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


const ICE_CONFIG = {'iceServers': [{'url': 'stun:47.91.149.159:3478'}]};
const PC_PEERS = {};
let localStream;

function getLocalStream(isFront, callback) {
    MediaStreamTrack.getSources(sourceInfos => {
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
            const sourceInfo = sourceInfos[i];
            if (sourceInfo.kind === 'video' && sourceInfo.facing === (isFront ? 'front' : 'back')) {
                videoSourceId = sourceInfo.id;
            }
        }

        getUserMedia({
            audio: true,
            video: {
                mandatory: {
                    minWidth: 500,
                    minHeight: 300,
                    minFrameRate: 30
                }
            },
            facingMode: (isFront ? 'user' : 'environment'),
            optional: (videoSourceId ? [{sourceId: videoSourceId}] : [])
        }, (stream) => {
            console.log('getUserMedia:', stream);
            callback(stream);
        }, logError);
    });
}

function createPC(socketId, isOffer) {
    const pc = new RTCPeerConnection(ICE_CONFIG);
    PC_PEERS[socketId] = pc;


    pc.onicecandidate = (event) => {
        console.log('onicecandidate:', event.candidate);
        if (event.candidate) {
            
        }
    }

    pc.onnegotiationneeded = () => {
        console.log('onnegotiationneeded');
        if (isOffer) {
            createOffer();
        }
    }

    pc.oniceconnectionstatechange = (event) => {
        console.log('oniceconnectionstatechange:', event.target.iceConnectionState);
        if (event.target.iceConnectionState === 'completed') {
            setTimeout(() => {
                getStatus();
            }, 1000);
        }
        if (event.target.iceConnectionState === 'connected') {
            createDataChannel();
        }
    }


    pc.onsignalingstatechange = (event) => {
        console.log('onsignalingstatechange: ', event.target.signalingState);
    }


    pc.onaddstream = (event) => {
        console.log('onaddstream', event.stream);
    }

    pc.onremovestream = (event) => {
        console.log('onremovestream', event.stream);
    }

    pc.addStream(localStream);


    function createOffer() {
        pc.createOffer(desc => {
            console.log('createOffer', desc);
            pc.setLocalDescription(desc, () => {
                console.log('setLocalDescription', pc.localDescription);
            }, logError);
        }, logError);
    }

    function createDataChannel() {
        if (pc.textDataChannel) {
            return; 
        }
        const dataChannel = pc.createDataChannel('text');
        dataChannel.onerror = (error) => {
            console.log('dataChannel.onerror: ', error);
        }
        dataChannel.onmessage = (event) => {
            console.log('dataChannel.onmessage: ', event.data);
        }
        dataChannel.onopen = () => {
            console.log('dataChannel.open');
        }
        dataChannel.onclose = function() {
            console.log('dataChannel.onclose');
        }
        pc.textDataChannel = dataChannel;
    }

    function getStatus() {
        const pc = PC_PEERS[Object.keys(PC_PEERS)[0]];
        if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
            const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
            console.log('track', track);
            pc.getStatus(track, report => {
                console.log('getStats report', report);
            }, logError);
        }
    }

    return pc;
}


function logError(error) {
    console.log('logError', error);
}


export default class RoomScreen extends Component {

    constructor() {
        super();

        this.state = {
            videoURL: null,
        }

        this.onStartButtonPress = this.onStartButtonPress.bind(this);    
    }
    
    onStartButtonPress() {
         getLocalStream(true, stream => {
            localStream = stream;
            console.log(stream.toURL());
            this.setState({videoURL: stream.toURL()});
        });
    }

    onStopButtonPress() {

    }

    render() {
        return (
            <View style={styles.container}>
                
                <RTCView streamURL={this.state.videoURL} style={styles.video}/>
                

                <View style={{flexDirection:'row'}}>
                    <Button
                        onPress={this.onStartButtonPress}
                        title="start" />

                    <Button
                        onPress={this.onStopButtonPress} 
                        title="stop"/>
                </View>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
    video: {
        flex: 1,
    }
});