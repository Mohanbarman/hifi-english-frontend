/*
 * @author Gaurav Kumar
 */

import React, {useEffect, useState} from "react";
import {Alert, ToastAndroid} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {AuthService} from "../src/services";
import ConnectyCube from 'react-native-connectycube';
import InCallManager from "react-native-incall-manager";

export const AuthContext = React.createContext();

const LOGOUT = gql`
    mutation LOGOUT{
        logout{
            deleted
        }
    }
`;

const GETUSERBYWEBRTCID = gql`
    mutation GETUSERBYWEBRTCID($id:String!) {
        getUserByWebrtcId(webrtcId:$id) {
            profile {
                name
                id
                gender
                webrtcId
                numberOfSessions
                role
                profileImageUrl
                subscription {
                    id
                    title
                    minutes
                    sessions
                }
            }
        }
    }
`

const MAKECALL = gql`
    mutation MAKECALL($callType:String, $minutes:String, $toUser:Int) {
        makeCall(callType:$callType, minutes:$minutes, toUser:$toUser) {
            call {
                fromUser {
                    email
                    id
                }
                toUser {
                    email
                    id
                }
                dateTime
                minutes
                callType
            }
        }
    }
`;

const VIEWER = gql`
    query VIEWER {
        viewer {
            id
            email
            gender
            city
            dateJoined
            dob
            hobbies
            isActive
            isAdmin
            isStaff
            isSuperuser
            languageKnown
            lastLogin
            level
            name
            phone
            profession
            role
            state
            online
            numberOfSessions
            webrtcId
            webrtcPassword
            validityDate
            profileImageUrl
            accountNumber
            ifscCode
            upiId
            callDuration
            preferredTime
            subscription{
                id
                days
                title
                minutes
                sessions
                discountPrice
                price
            }
        }
    }
`;


export const AuthProvider = (props) => {
    const [isAuthenticated, setAuthenticated] = useState(undefined);
    const [profile, setProfile] = useState(undefined);
    const [viewer, {data, error, loading}] = useLazyQuery(VIEWER);
    const [onBoardingDone, setOnBoardingDone] = useState(false);
    const [singout] = useMutation(LOGOUT);
    const [videoScreen, setVideoScreen] = useState(false);
    const [remoteUser, setRemoteUser] = useState(undefined);
    const [connectycubeConnected, setConnectycubeConnected] = useState(false);
    const [ringing, setRinging] = useState(false);
    const [session, setSession] = useState(undefined);
    const [extension, setExtension] = useState(undefined);
    const [calling, setCalling] = useState(false);
    const [localStream, setLocalStream] = useState(undefined);
    const [remoteStream, setRemoteStream] = useState(undefined);
    const [incall, setIncall] = useState(false);
    const [searchUser] = useMutation(GETUSERBYWEBRTCID);
    const [makeCall] = useMutation(MAKECALL);
    const [muted, setMuted] = useState(false);
    const [recording, setRecording] = useState(false);
    const MEDIA_OPTIONS = {audio: true, video: true};
    const [acceptTime, setAcceptTime] = useState(0);
    const [rejectTimeout, setRejectTimeout] = useState(undefined);
    const [expTimeout, setExpTimeout] = useState(undefined);

    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [isCallAccepted, setIsCallAccepted] = useState(false);
    const [remoteUserId, setRemoteUserId] = useState(undefined);

    const toggleRecording = () => {
        // if (recording) {
        //     SoundRecorder.stop()
        //         .then(function (result) {
        //             setRecording(false);
        //             console.log('stopped recording, audio file saved at: ' + result.path);
        //         });
        // } else {
        //
        //     SoundRecorder.start(RNFS.ExternalDirectoryPath + `/${remoteUser?.name?.split(" ")?.join("-")}-${new Date().getTime()}.mp3`, {channels: 2})
        //         .then(function () {
        //             setRecording(true);
        //             console.log('started recording');
        //         });
        // }
    }

    const toggleMute = () => {
        if (muted) {
            session.unmute('audio');
            setMuted(false);
        } else {
            setMuted(true);
            session.mute('audio');
        }
    }

    const playSound = type => {
        switch (type) {
            case 'outgoing':
                InCallManager.start({media: 'audio', ringback: '_DTMF_'});
                break;
            case 'incoming':
                InCallManager.start({media: 'audio', ringback: '_DEFAULT_'});
                break;
            case 'end':
                InCallManager.stop({busytone: '_DTMF_'});
                break;
        }
    };

    const stopSounds = () => {
        InCallManager.stopRingback();
        InCallManager.stopRingtone();
        InCallManager.stop();
    };


    const call = ids => {
        const options = {};
        const type = ConnectyCube.videochat.CallType.VIDEO; // AUDIO is also possible
        const s = ConnectyCube.videochat.createNewSession(ids, type, options);
        setSession(s);
        playSound('outgoing');
        console.log(profile?.subscription)

        return s.getUserMedia(MEDIA_OPTIONS)
            .then(stream => {
                s.call({});
                InCallManager.setKeepScreenOn(true);

                return stream;
            })
            .catch(e => Alert.alert('Attention', e?.message));
    };


    const logout = () => {
        singout()
            .then(({data}) => {
                ToastAndroid.show('Logged out successfully', ToastAndroid.LONG);
                AsyncStorage.removeItem("token")
                    .then(() => {
                        AsyncStorage.removeItem("profile")
                            .then(() => {
                                AuthService.logout();
                                setProfile(undefined);
                                setAuthenticated(false);
                                clearTimeout(expTimeout);
                            })
                            .catch(e => Alert.alert('Attention', e?.message))
                    })
                    .catch(e => Alert.alert('Attention', e?.message))
            })
            .catch(e => {
                Alert.alert("Attention", e?.message);
            })

    };

    const acceptCall = () => {
        stopSounds();
        session.accept({});
        setRinging(false);
        setAcceptTime(Date.now());
        InCallManager.setKeepScreenOn(true);
        setIsCallAccepted(true);
        if (profile?.role?.toLowerCase() === 'student') {
            console.log('This ran ............... 239', profile?.name)
            let t = setTimeout(() => {
                setIsReviewModalVisible(true);
                makeCall({
                    variables: {
                        callType: session?.initiatorID == profile?.webrtcId ? 'outgoing' : 'incoming',
                        toUser: session?.opponentsIDs?.[0],
                        minutes: profile?.subscription?.minutes * 60,
                    }
                }).then(async r => {
                        if (isCallAccepted) {
                            setIsReviewModalVisible(true);
                            setIsCallAccepted(false);
                        }
                        if (profile?.role?.toLowerCase() === 'student') {
                            let p = profile;
                            p.numberOfSessions = p.numberOfSessions - 1;
                            setProfile(p);
                            await AsyncStorage.setItem('profile', JSON.stringify(p));
                        }
                    }
                ).catch(e => {
                    Alert.alert(
                        'Request failed',
                        e?.message,
                    )
                })
                session.stop({});
                // rejectCall();
                setIncall(false);
                setCalling(false);
                setRemoteStream(undefined);
                setVideoScreen(false);
                // clearTimeout(rejectTimeout);
                InCallManager.setKeepScreenOn(false);
                setIsReviewModalVisible(true);
            }, profile?.subscription?.minutes * (1000 * 60))
            setRejectTimeout(t);
        }
    };

    const rejectCall = () => {
        playSound('end');

        console.log('isCallAccepted = ', isCallAccepted);

        if (isCallAccepted) {
            setIsReviewModalVisible(true);
            setIsCallAccepted(false);
        }

        console.log(calling, ringing, ' ************* calling ringing ', profile?.name);
        if (calling || ringing) {
            stopSounds();
            console.log(acceptTime, remoteStream, '*****', profile?.name, session?.acceptCallTime);
            const callDuration = remoteStream ? Math.floor((Date.now() - acceptTime) / 1000) : 0;
            setAcceptTime(0);
            if (!ringing) {
                /* we are dropping the call */
                session.stop({});
                ConnectyCube.videochat.clearSession(session.ID);
                makeCall({
                    variables: {
                        callType: session?.initiatorID == profile?.webrtcId ? (remoteStream ? 'outgoing' : 'missed') : 'incoming',
                        toUser: remoteUser?.webrtcId,
                        minutes: remoteStream ? Math.floor((Date.now() - acceptTime) / 1000) : 0,
                    }
                }).then(async r => {
                    if (profile?.role?.toLowerCase() === 'student' && callDuration > 0) {
                        let p = profile;
                        p.numberOfSessions = p.numberOfSessions - 1;
                        setProfile(p);
                        await AsyncStorage.setItem('profile', JSON.stringify(p));
                    }
                }).catch(e => Alert.alert('Attention', e?.message));
            } else {
                /* we are rejecting the call*/
                session.reject({});
                console.log('Reject called............. ', profile?.name);
                // ConnectyCube.videochat.clearSession(session.ID);
                setRinging(false);

                makeCall({variables: {callType: 'rejected', toUser: remoteUser?.webrtcId, minutes: 0}})
                    .then(async r => {
                        if (profile?.role === 'student' && callDuration > 0) {
                            let p = profile;
                            p.numberOfSessions--;
                            setProfile(p);
                            await AsyncStorage.setItem('profile', JSON.stringify(p));
                        }
                    })
                    .catch(e => Alert.alert(
                        'Request failed',
                        'Unable to submit call details',
                    ));
            }
        }

        setIncall(false);
        setCalling(false);
        setRemoteStream(undefined);
        setVideoScreen(false);
        clearTimeout(rejectTimeout);
        InCallManager.setKeepScreenOn(false);
    };

    const onCallListener = (session, extension) => {
        // if (session?.initiatorID?.toString() === profile?.webrtcId?.toString() || profile?.role?.toLocaleLowerCase() === "student" && profile?.numberOfSessions < 1) {
        if (profile?.numberOfSessions < 1) {
            session.reject({busy: true});
        } else {
            searchUser({variables: {id: session.initiatorID}})
                .then((r) => {
                    if (r?.data?.getUserByWebrtcId?.profile?.webrtcId?.toString() === session?.initiatorID?.toString()) {
                        setRemoteUser(r?.data?.getUserByWebrtcId?.profile);
                        setRemoteUserId(r?.data?.getUserByWebrtcId?.profile?.id);
                        setSession(session);
                        setExtension(extension);
                        setRinging(true);
                        setVideoScreen(true);
                        setCalling(true);

                        session.getUserMedia(MEDIA_OPTIONS)
                            .then(setLocalStream)
                            .catch(e => Alert.alert('Attention', e?.message))

                        playSound('incoming');
                    }
                })
                .catch(e => Alert.alert('Attention', e?.message))
        }
    };

    const onAcceptCallListener = (s, userId, extension) => {
        stopSounds();
        setIncall(true);
        setIsCallAccepted(true);
        setAcceptTime(Date.now());
        if (profile?.role?.toLowerCase() === 'student') {
            let t = setTimeout(() => {
                console.log('This ran ............... 345', profile?.name);
                setAcceptTime(0);
                s.stop({});
                makeCall({
                    variables: {
                        callType: s?.initiatorID == profile?.webrtcId ? 'outgoing' : 'incoming',
                        toUser: s?.opponentsIDs?.[0],
                        minutes: profile?.subscription?.minutes * 60,
                    }
                }).then(async r => {
                        if (isCallAccepted) {
                            setIsReviewModalVisible(true);
                            setIsCallAccepted(false);
                        }
                        if (profile?.role?.toLowerCase() === 'student') {
                            let p = profile;
                            p.numberOfSessions = p.numberOfSessions - 1;
                            setProfile(p);
                            await AsyncStorage.setItem('profile', JSON.stringify(p));
                        }
                    }
                ).catch(e => {
                    Alert.alert(
                        'Request failed',
                        e?.message,
                    )
                })
                // rejectCall();
                setIncall(false);
                setCalling(false);
                setRemoteStream(undefined);
                setVideoScreen(false);
                // clearTimeout(rejectTimeout);
                InCallManager.setKeepScreenOn(false);
                setIsReviewModalVisible(true);
            }, profile?.subscription?.minutes * (1000 * 60));
            setRejectTimeout(t);
        }
    };

    const onRejectCallListener = (session, userId, extension) => {
        console.log(session);
        setAcceptTime(0);
        console.log("reject call called by : ", profile?.name, session?.startCallTime, session?.acceptCallTime);
        if (profile?.role?.toLowerCase() === 'student' && session?.startCallTime) {
            makeCall({variables: {toUser: userId, callType: 'missed', minutes: 0}})
                .then(r => console.log(r))
                .catch(e => console.log(e));
        }

        playSound('end');
        ToastAndroid.show(`Call rejected`, ToastAndroid.LONG);
        setVideoScreen(false);
        setRemoteUser(undefined)
        setIncall(false);
        setRinging(false);
        setCalling(false);
        setRemoteStream(undefined);
        setIsCallAccepted(false);
        clearTimeout(rejectTimeout);
        stopSounds();
    };

    const onStopCallListener = (session, userId, extension) => {
        // display review modal
        if (session?.peerConnections?.[session?.opponentsIDs]?.connectionState === 'connected' || session?.acceptCallTime) {
            setIsReviewModalVisible(true);
            setIsCallAccepted(false);
        }

        const callDuration = acceptTime > 0 ? Math.floor((Date.now() - acceptTime) / 1000) : 0;

        setAcceptTime(0);

        if (profile?.role?.toLowerCase() === 'student'
            && (session?.peerConnections?.[session?.opponentsIDs]?.connectionState === 'connected'
                || session?.acceptCallTime )) {
            let p = profile;
            p.numberOfSessions = profile?.numberOfSessions - 1;
            setProfile(p);
            AsyncStorage.setItem('profile', JSON.stringify(p));


            // makeCall({
            //     variables: {
            //         callType: session?.initiatorID === profile?.webrtcId
            //                 ? 'outgoing'
            //                 : 'incoming',
            //         toUser: userId,
            //         minutes: callDuration
            //     }})
            //     .then(r => {
            //     })
            //     .catch(e => Alert.alert('Attention', e?.message));
        }

        playSound('end');
        ToastAndroid.show('Call stopped', ToastAndroid.LONG);
        stopSounds();
        setVideoScreen(false);
        setIncall(false);
        setRinging(false);
        setCalling(false);
        setRemoteStream(undefined);
        setRemoteUser(undefined);
        setIsCallAccepted(false);

        console.log(rejectTimeout);
        clearTimeout(rejectTimeout);
        setRejectTimeout(undefined);
    };

    const onUserNotAnswerListener = (session, userId) => {
        ToastAndroid.show('No answer', ToastAndroid.LONG);
        setAcceptTime(0)
        playSound('end');
        stopSounds();
        makeCall({variables: {callType: 'missed', toUser: userId, minutes: 0}})
            .then(r => {
                console.log(session, '*******************', profile?.name);
                setRemoteUser(undefined);
                setVideoScreen(false);
                setIncall(false);
                setRinging(false);
                setCalling(false);
                setRemoteStream(undefined);
            })
            .catch(e => Alert.alert('Attention', e?.message));
        setRemoteUser(undefined);
        setVideoScreen(false);
        setIncall(false);
        setRinging(false);
        setCalling(false);
        setRemoteStream(undefined);

        clearTimeout(rejectTimeout);
        session.stop({});
    };

    const onRemoteStreamListener = (s, userId, stream) => {
        setRemoteStream(stream);
    };

    const onSessionConnectionStateChangedListener = (session, userID, connectionState) => {
        if (connectionState === ConnectyCube.videochat.SessionConnectionState.CLOSED) {
            stopSounds();
            setVideoScreen(false);
            setRemoteStream(undefined);
            setRemoteUser(undefined);
            setRinging(false);
            setCalling(false);
            setAcceptTime(0);
            clearTimeout(rejectTimeout);
        }
    }

    const setUpListeners = () => {
        ConnectyCube.videochat.onCallListener = onCallListener;
        ConnectyCube.videochat.onAcceptCallListener = onAcceptCallListener;
        ConnectyCube.videochat.onRejectCallListener = onRejectCallListener;
        ConnectyCube.videochat.onStopCallListener = onStopCallListener;
        ConnectyCube.videochat.onUserNotAnswerListener = onUserNotAnswerListener;
        ConnectyCube.videochat.onRemoteStreamListener = onRemoteStreamListener;
        ConnectyCube.videochat.onSessionConnectionStateChangedListener = onSessionConnectionStateChangedListener;
    }


    useEffect(() => {
        if (connectycubeConnected && profile && isAuthenticated) {
            setUpListeners();
        }
    }, [connectycubeConnected, profile, isAuthenticated]);

    useEffect(() => {
        if (rejectTimeout) {
            clearTimeout(rejectTimeout);
        }
    }, [videoScreen])

    useEffect(() => {
        AsyncStorage.getItem("exp")
            .then(exp => {
                if (exp > new Date().getTime()) {
                    viewer();
                    AsyncStorage.getItem("profile")
                        .then((data) => {
                            if (data) {
                                setProfile(JSON.parse(data));
                                setAuthenticated(true);
                                let r = AuthService.login(JSON.parse(data));
                                ToastAndroid.show('Connecting to server', ToastAndroid.LONG);
                                r.then(r => {
                                    ToastAndroid.show('Successfully connected with server', ToastAndroid.LONG);
                                    setConnectycubeConnected(true);
                                }).catch(e => {
                                    Alert.alert('Failed', 'Failed to connect to server.', [
                                        {
                                            text: 'Try again',
                                            onPress: () => {
                                                AuthService.login(JSON.parse(data)).then(r => {
                                                    ToastAndroid.show('Connecting to server', ToastAndroid.LONG);
                                                    setConnectycubeConnected(true);
                                                })
                                            }
                                        }
                                    ]);
                                })
                                // AuthService.login(JSON.parse(data))
                                //     .then((r) => {
                                //         setConnectycubeConnected(true);
                                //         console.log(r);
                                //     })
                                //     .catch((e) => Alert.alert('Attention', e?.message));
                            } else {
                                AsyncStorage.removeItem("exp");
                                setAuthenticated(false);
                                setProfile(undefined);
                            }
                        })
                        .catch(e => Alert.alert('Attention', e?.message));
                    // let t = setTimeout(() => {
                    //     AsyncStorage.removeItem("exp");
                    //     AsyncStorage.removeItem("profile");
                    //     setAuthenticated(false);
                    //     setProfile(undefined);
                    //     Alert.alert("Your session expired");
                    //     if(!isAuthenticated){
                    //         clearTimeout(t);
                    //     }
                    // }, exp - new Date().getTime());
                    // setExpTimeout(t);
                } else {
                    ToastAndroid.show('Session expired', ToastAndroid.LONG);
                    setAuthenticated(false);
                    AsyncStorage.removeItem("exp");
                }
            })
            .catch(e => Alert.alert('Attention', e?.message))
        return () => {
            clearInterval(expTimeout);
        }
    }, []);
    useEffect(() => {
        if (data?.viewer) {
            setProfile(data?.viewer);
            AsyncStorage.setItem("profile", JSON.stringify(data?.viewer))
        }
    }, [loading]);
    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            profile,
            setProfile,
            logout,
            acceptTime,
            setAuthenticated,
            onBoardingDone,
            setOnBoardingDone,
            videoScreen,
            setVideoScreen,
            remoteUser,
            setRemoteUser,
            rejectCall,
            acceptCall,
            session,
            setCalling,
            calling,
            extension,
            remoteStream,
            setRemoteStream,
            localStream,
            setLocalStream,
            setIncall,
            incall,
            muted,
            setMuted,
            recording,
            toggleRecording,
            ringing,
            toggleMute,
            connectycubeConnected,
            setConnectycubeConnected,
            isReviewModalVisible,
            setIsReviewModalVisible,
            call,
            remoteUserId,
            setRemoteUserId,
        }} {...props} />
    );
};
