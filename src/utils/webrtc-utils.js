
import {
    RTCPeerConnection,
    MediaStreamTrack,
    getUserMedia,
} from 'react-native-webrtc';

const PC_PEERS = {};
const ICE_CONFIG = { iceServers: [{ url: 'stun:47.91.149.159:3478' }] };

export function getLocalStream(isFront, callback) {
    MediaStreamTrack.getSources(sourceInfos => {
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
            const sourceInfo = sourceInfos[i];
            if (sourceInfo.kind === 'video' && sourceInfo.facing === (isFront ? 'front' : 'back')) {
                videoSourceId = sourceInfo.id;
                break;
            }
        }

        getUserMedia({
            audio: true,
            video: {
                mandatory: {
                    minFrameRate: 30
                }
            },
            facingMode: (isFront ? 'user' : 'environment'),
            optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
        }, (stream) => {
            console.log('getUserMedia:', stream);
            callback(stream);
        }, logError);
    });
}

export function createPC(socketId, isOffer) {
    const pc = new RTCPeerConnection(ICE_CONFIG);
    PC_PEERS[socketId] = pc;


    pc.onicecandidate = (event) => {
        console.log('onicecandidate:', event.candidate);
        if (event.candidate) {
            
        }
    };

    pc.onnegotiationneeded = () => {
        console.log('onnegotiationneeded');
        if (isOffer) {
            createOffer();
        }
    };

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
    };


    pc.onsignalingstatechange = (event) => {
        console.log('onsignalingstatechange: ', event.target.signalingState);
    };


    pc.onaddstream = (event) => {
        console.log('onaddstream', event.stream);
    };

    pc.onremovestream = (event) => {
        console.log('onremovestream', event.stream);
    };

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
        };
        dataChannel.onmessage = (event) => {
            console.log('dataChannel.onmessage: ', event.data);
        };
        dataChannel.onopen = () => {
            console.log('dataChannel.open');
        }
        dataChannel.onclose = () => {
            console.log('dataChannel.onclose');
        };
        pc.textDataChannel = dataChannel;
    }

    function getStatus() {
        const peer = PC_PEERS[Object.keys(PC_PEERS)[0]];
        if (peer.getRemoteStreams()[0] && peer.getRemoteStreams()[0].getAudioTracks()[0]) {
            const track = peer.getRemoteStreams()[0].getAudioTracks()[0];
            console.log('track', track);
            peer.getStatus(track, report => {
                console.log('getStats report', report);
            }, logError);
        }
    }

    return pc;
}


function logError(error) {
    console.log('logError', error);
}