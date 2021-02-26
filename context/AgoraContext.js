/*
 * @author Gaurav Kumar
 */
import React, {useContext, useEffect, useRef, useState} from "react";
import RtcEngine from 'react-native-agora'
import {PermissionsAndroidStatic as PermissionsAndroid} from "react-native";
import {AuthContext} from "./auth";
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import Socket from "socket.io-client";


export const AgoraContext = React.createContext();
export const AgoraProvider = (props) => {
    const [socket, setSocket] = useState(props?.socket);
    const appId = "89942e53668949fdaa2ee4036b02af87";
    const [token, setToken] = useState(undefined);
    const [channel, setChannel] = useState(undefined);
    const [engine, setEngine] = useState(undefined);
    const [peers, setPeers] = useState([]);
    const [connected, setConnected] = useState(false);
    const [openMicrophone, setOpenMicrophone] = useState(true);
    const [enableSpeaker, setEnableSpeaker] = useState(false);
    const [remoteUser, setRemoteUser] = useState(undefined);
    const [calling, setCalling] = useState(false);
    const {isAuthenticated, profile} = useContext(AuthContext);
    const [ringing, setRinging] = useState(false);
    const requestCameraAndAudioPermission = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ])
            if (
                granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
            ) {
                console.log('You can use the mic')
            } else {
                console.log('Permission denied')
            }
        } catch (err) {
            console.warn(err)
        }
    }
    const setup = () => {
        RtcEngine.create(appId)
            .then(eng => {
                setEngine(eng);
                eng.enableAudio()
                    .then(r => {
                        console.log(r);
                        console.log("audio enabled")
                        eng.addListener('UserJoined', (uid, elapsed) => {
                            console.log('UserJoined', uid, elapsed)
                            setCalling(false);
                            setConnected(true);
                            setTimeout(() => {
                                disconnect();
                                setConnected(false);
                                setCalling(false);
                            }, profile?.subscription?.minutes * 60 * 1000);
                            if (peers.indexOf(uid) === -1) {
                                setPeers([...peers, uid]);
                            }
                        });
                        eng.addListener('UserOffline', (uid, reason) => {
                            console.log('UserOffline', uid, reason)
                            setPeers(peers.filter(id => id !== uid));
                        });
                        eng.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
                            console.log('JoinChannelSuccess', channel, uid, elapsed)
                            setConnected(true);
                        });
                        eng?.enableLocalAudio(!openMicrophone).then(() => {
                            setOpenMicrophone(p => !p);
                        }).catch((err) => {
                            console.warn('enableLocalAudio', err)
                        });
                        engine?.setEnableSpeakerphone(!enableSpeaker).then(() => {
                            setEnableSpeaker(e => !e);
                        }).catch((err) => {
                            console.warn('setEnableSpeakerphone', err)
                        })
                        console.log(eng)
                    })
                    .catch(e => {
                        console.log(e)
                    })
                console.log('requested!')
            })
            .catch(e => {
                console.log(e)
            })
    };
    useEffect(() => {
        if (isAuthenticated && profile && socket) {
            socket.emit('join', {
                user: {
                    id: profile?.id,
                    name: profile?.name,
                    picture: profile?.picture
                }
            });
            socket.on("calling", payload => {
                console.log("calling", payload);
                setChannel(payload?.channelName);
                setRemoteUser(payload?.user);
                setRinging(true);
            })
        }
    }, [isAuthenticated, socket?.connected])
    useEffect(() => {
        if (Platform.OS === 'android') {
            // Request required permissions from Android
            requestCameraAndAudioPermission().then(() => {
                setup();
            })
                .catch(e => {
                        console.log(e)
                    }
                )
        } else {
            setup();
        }

    }, [])
    const call = (user) => {
        console.log(profile)
        if (user && profile?.numberOfSessions > 0) {
            setRemoteUser(user);
            setCalling(true);
            let channelName = `${new Date().getTime()}-${profile?.id}-${user?.id}`;
            socket.emit("call", {
                caller: {
                    id: profile?.id,
                    name: profile?.name,
                    picture: profile?.picture
                },
                target: {
                    id: profile?.id,
                    name: profile?.name,
                    picture: profile?.picture
                },
                channelName: channelName
            });
           /* axios.get(`https://signalling-server-hifi.herokuapp.com/access_token?channelName=${channelName}&uid=${profile?.id}`)
                .then(({data}) => {
                    setToken(data?.token);
                    setChannel(channelName);
                    console.log(channelName)
                    setTimeout(() => {
                        setCalling(false);
                        disconnect();
                    }, 10000);
                    engine?.joinChannel(data?.token, channelName, null, profile?.id)
                        .then(res => {
                            setCalling(false);
                            console.log(res);
                        })
                        .catch(e => {
                            setCalling(false);
                            console.log(e);
                        })
                })
                .catch(e => {
                    console.log(e);
                    setCalling(false);
                });*/
        } else {
            console.log("remote user is not set")
        }
    }
    const disconnect = () => {
        engine?.leaveChannel()
            .then(r => {
                console.log(r);
                setPeers([]);
                setConnected(false);
                setCalling(false);
            })
    }
    const accept = () => {
        axios.get(`https://signalling-server-hifi.herokuapp.com/access_token?channelName=${channel}&uid=${profile?.id}`)
            .then(({data}) => {
                setToken(data?.token);
                engine?.joinChannel(data?.token, channel, null, profile?.id)
                    .then(res => {
                        setRinging(false);
                        console.log(res);
                    })
                    .catch(e => {
                        setRinging(false);
                        console.log(e);
                    })
            })
            .catch(e => {
                console.log(e);
                setRinging(false);
            });
    };
    return (
        <AgoraContext.Provider
            value={{
                engine,
                call,
                disconnect,
                accept,
                setRemoteUser,
                remoteUser,
                connected,
                calling,
                ringing,
                openMicrophone,
                setOpenMicrophone
            }} {...props}/>
    )
}
