
import {
    RTCPeerConnection,
    MediaStreamTrack,
    getUserMedia,
    RTCSessionDescription
} from 'react-native-webrtc';


let pcArray = {};
const ICE_CONFIG = { iceServers: [{ url: 'stun:47.91.149.159:3478' }] };


export function startCommunication(_sendMessage, _name, callback) {
    getLocalStream(true, stream => {
        var pc = createPC(_sendMessage, _name, true, stream);
        pcArray[_name] = pc;
        callback(stream, pc);
    });
}


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
                frameRate: {
                    min: 1,
                    ideal: 15,
                    max: 30
                },
                width: {
                    min: 32,
                    ideal: 50,
                    max: 320
                },
                height: {
                    min: 32,
                    ideal: 50,
                    max: 320
                }
            },
            facingMode: (isFront ? 'user' : 'environment'),
            optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
        }, (stream) => {
            callback(stream);
        }, logError);
    });
}

export function createPC(sendMessage, name, isOffer, localStream, callback) {
    var pc = new RTCPeerConnection(ICE_CONFIG);

    pc.onnegotiationneeded = () => {
        console.log('onnegotiationneeded');
        if (isOffer) {
            createOffer();
        }
    };

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            var msg = {
                'id': 'onIceCandidate',
                'candidate': event.candidate,
                'name': name
            };
            sendMessage(msg);
        }
    } 

    pc.oniceconnectionstatechange = (event) => {
        console.log('oniceconnectionstatechange:', event.target.iceConnectionState);
    };

    pc.onsignalingstatechange = (event) => {
        console.log('onsignalingstatechange: ', event.target.signalingState);
    };

    pc.addStream(localStream);

    function createOffer() {
        pc.createOffer(desc => {
            pc.setLocalDescription(desc, () => {
                console.log(pc.localDescription);
                var msg = {
                    'id': 'receiveVideoFrom',
                    'sender': name,
                    'sdpOffer': pc.localDescription.sdp
                };
                sendMessage(msg);
            }, logError);
        }, logError);
    }

    return pc;
}


export function addIceCandidate(name, candidate) {
    var pc  = pcArray[name];
    if (pc) {
        pc.addIceCandidate(candidate);
    } else {
        console.log('pc.addIceCandidate failed : pc not exists');
    }
}

export function ProcessAnswer(name, sdp, callback) {

    var pc  = pcArray[name];

    if (pc) {
        var answer = {
            'type': 'answer',
            'sdp': sdp
        };
        if (pc) {
            pc.setRemoteDescription(new RTCSessionDescription(answer), () => {
                callback();
            }, err => {
                callback(err);
            });
        }
    } else {
        console.log('ProcessAnswer failed : pc not exists');
    }
}


function logError(error) {
    console.log('logError', error);
}