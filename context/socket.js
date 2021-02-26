/*
/!*
 * @author Gaurav Kumar
 *!/

import React, {useContext, useEffect, useRef, useState} from "react";
import AsyncStorage from '@react-native-community/async-storage';
import Socket from "socket.io-client";
import {mediaDevices, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate} from "react-native-webrtc";
import InCallManager from 'react-native-incall-manager';
import {AuthContext} from "./auth";

export const SocketContext = React.createContext();
export const SocketProvider = (props) => {
    let user = undefined;
    // let peer = undefined;
    const peerRef = useRef();
    let {profile, isAuthenticated} = useContext(AuthContext);
    const [socket, setSocket] = useState(props?.socket);
    const [ringing, setRinging] = useState(false);
    const [remoteUser, setRemoteUser] = useState(undefined);
    const [calling, setCalling] = useState(false);
    const [localStream, setLocalStream] = useState(undefined);
    const [remoteStream, setRemoteStream] = useState(undefined);
    const [remoteSocket, setRemoteSocket] = useState();
    const [offer, setOffer] = useState(undefined);
    const [connected, setConnected] = useState(false);
    const [minutes, setMinutes] = useState(0);
    const [remotepeer, setRemotePeer] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [disabledAudio, setDisabledAudio] = useState(false);
    const [disabledVideo, setDisabledVideo] = useState(true);
    const [peer, setPeer] = useState(new RTCPeerConnection({
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302',
            }, {
                urls: 'stun:stun1.l.google.com:19302',
            }, {
                urls: 'stun:stun2.l.google.com:19302',
            }

        ]
    }));
    const handleAddStreamEvent = e => {
        console.log("stream added",e.stream)
        setRemoteStream(e.stream);
    }

    const handleOffer = incoming => {
        // createPeer();
        setRinging(true);
        // InCallManager.startRingtone('_BUNDLE_');
        setOffer(incoming);
        // setTimeout(() => {
        //     if (ringing) {
        //         setRinging(false);
        //         setOffer(undefined);
        //         InCallManager.stopRingtone();
        //     }
        // }, 10000);
    }

    const handleAnswer = incoming => {
        // InCallManager.stopRingtone();
        // InCallManager.start({media: 'video'});
        console.log("answer", incoming)
        const desc = new RTCSessionDescription(incoming.sdp);
        peer?.setRemoteDescription(desc).catch(e => setError(e));
    }

    const handleNegotiationNeededEvent = () => {
        peer.createOffer().then(o => {
            return peer.setLocalDescription(o);
        }).then(() => {
            const payload = {
                user: user?.id,
                caller: profile?.id,
                sdp: peer.localDescription
            };
            socket.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    const handleICECandidateEvent = (e) => {
        if (e.candidate) {
            const payload = {
                user: user?.id,
                caller: profile?.id,
                candidate: e.candidate,
            };
            socket.emit("ice-candidate", payload);
        }
    }

    const handleTrackEvent = (e) => {
        setRemoteStream(e.streams[0]);
    };

    const createPeer = () => {
        let remotePeer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302',
                }, {
                    urls: 'stun:stun1.l.google.com:19302',
                }, {
                    urls: 'stun:stun2.l.google.com:19302',
                }

            ]
        });
        remotePeer.onicecandidate = handleICECandidateEvent;
        remotePeer.ontrack = handleTrackEvent;
        remotePeer.onaddstream = handleAddStreamEvent;
        remotePeer.onnegotiationneeded = handleNegotiationNeededEvent;
        // setPeer(remotePeer);
        peerRef.current = remotePeer;
        // return remotePeer;
    };

    const connect = () => {
        let s = Socket.connect("ws://192.168.1.110:4000");
        if (s.connected) {
            s.emit("join", 123);
            // s.on('calling', user => {
            //     setRemoteSocket(user);
            //     setRinging(true);
            // });
            s.on("offer", handleOffer);
            s.on("answer", handleAnswer);
            // socket.on("ice-candidate", handleNewICECandidateMsg)
            s.on("error", e => {
                console.log(e)
            })
        } else {
            setError(new Error("Socket connection is not established"))
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);
        console.log(candidate, incoming)
        peer?.addIceCandidate(incoming)
            .catch(e => console.log(e));
    }

    const call = (u) => {
        user = u;
        setCalling(true);
        createPeer();
        if (localStream === undefined) {
            mediaDevices.getUserMedia({
                audio: true,
                video: true
            }).then(stream => {
                setLocalStream(stream);
                peer.addStream(stream);
                // InCallManager.start({audio: true, video: true});
                // setTimeout(() => {
                //     if (calling) {
                //         peer.close();
                //         InCallManager.stop({busytone: ''});
                //         setCalling(false);
                //     }
                // }, 5000);
            });
        } else {
            peer.addStream(localStream);
            // InCallManager.start({audio: true});
            // setTimeout(() => {
            //     if (calling) {
            //         peer.close();
            //         InCallManager.stop({busytone: ''});
            //         setCalling(false);
            //     }
            // }, 5000);
        }

    };
    const cancel = () => {
        // socket?.disconnect();
        socket.emit("disconnect-call", 345);
        if (peer) {
            setRinging(false);
            InCallManager.stopRingtone();
            peer.close();
            setRemoteStream(undefined);
            InCallManager.stop();
        }
        setConnected(false);
        setCalling(false);
    };

    const receive = () => {
        if (offer) {
            // InCallManager.stopRingtone();
            // remotePeer.onicecandidate = handleICECandidateEvent;
            // remotePeer.ontrack = handleTrackEvent;
            // remotePeer.onaddstream = handleAddStreamEvent;
            // remotePeer.onnegotiationneeded = ()=>{
            //     console.log(remotePeer)
            //     if(!offer) {
            //         remotePeer.createOffer().then(offer => {
            //             return remotePeer.setLocalDescription(offer);
            //         }).then(() => {
            //             const payload = {
            //                 user: user?.id,
            //                 caller: profile?.id,
            //                 sdp: remotePeer.localDescription
            //             };
            //             socket.emit("offer", payload);
            //         }).catch(e => console.log(e,"224"));
            //     }
            // };
            const desc = new RTCSessionDescription(offer.sdp);
            peer?.setRemoteDescription(desc).then(() => {
                peer.addStream(localStream);
                // remotePeer.addStream(localStream);
                // localStream.getTracks().forEach(track => peerRef.current.addTrack(track, localStream));
            }).then(() => {
                return peer.createAnswer();
            }).then(answer => {
                return peer.setLocalDescription(answer);
            }).then(() => {
                const payload = {
                    user: offer?.caller,
                    caller: profile?.id,
                    sdp: peer?.localDescription
                };
                socket.emit("answer", payload);
                setConnected(true);
                // setTimeout(() => {
                //     if (connected) {
                //         cancel();
                //     }
                // }, 5000);
            })
                .catch(e => {
                    console.log(e)
                });
        }
    };
    const mute = () => {
        let audioTracks = localStream.getAudioTracks();
        if (audioTracks?.length > 0) {
            localStream.removeTrack(audioTracks[0]);
            setDisabledAudio(true)
        }
    };
    const unMute = () => {
        mediaDevices.getUserMedia({
            audio: true,
            video: false
        }).then(stream => {
            let audioTracks = stream.getAudioTracks();
            if (audioTracks?.length > 0) {
                localStream.addTrack(audioTracks[0]);
                setDisabledAudio(false)
            }
        });
    }

    useEffect(() => {
        if (socket && profile) {
            socket.emit("join", profile?.id);
            // socket.on('calling', user => {
            //     setRemoteSocket(user);
            //     setRinging(true);
            // });
            socket.on('disconnect-call', user => {
                setRemoteSocket(user);
                setRinging(false);
                setOffer(undefined);
                // InCallManager.stopRingtone();
            });
            socket.on("ice-candidate", handleNewICECandidateMsg)
            socket.on("offer", handleOffer);
            socket.on("answer", handleAnswer);
            socket.on("error", e => {
                console.log(e)
            })

        }
        if (peer) {
            peer.onicecandidate = handleICECandidateEvent;
            peer.ontrack = handleTrackEvent;
            peer.onaddstream = handleAddStreamEvent;
            peer.onnegotiationneeded = handleNegotiationNeededEvent;
        }
    }, [isAuthenticated]);
    return (
        <SocketContext.Provider value={{
            call,
            receive,
            cancel,
            error,
            connected,
            calling,
            connect,
            localStream,
            setLocalStream,
            remoteStream,
            setRemoteStream,
            peer: peerRef?.current,
            ringing,
            remoteUser,
            setRemoteUser,
            setRinging,
            disabledAudio,
            mute,
            unMute
        }} {...props}/>
    );
};
*/
