import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import { Alert, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import RTCViewGrid from "../../src/components/VideoScreen/RTCViewGrid";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/core";
import InCallManager from 'react-native-incall-manager';


const CallScreenRoute = ({ route }) => {

    const {
        remoteUser,
        acceptCall,
        rejectCall,
        remoteStream,
        localStream,
        setLocalStream,
        incall,
        muted,
        toggleMute,
        ringing,
        setCalling,
        profile,
        call,
        calling,
        videoScreen,
        toggleRecording,
        recording
    } = useContext(AuthContext);

    let navigation = useNavigation();

    const [isSpeakerOn, setIsSpeakerOn] = useState(false);

    // const [viewBtn, setViewBtn] = useState(true);

    const startCall = () => {
        if (!ringing && remoteUser && !incall && !calling) {
            if (profile?.numberOfSessions > 0 || profile?.role?.toLowerCase() === 'teacher') {
                call([remoteUser?.webrtcId]).then(s => {
                    setLocalStream(s);
                    setCalling(true);
                })
                    .catch(e => {
                        console.log(e)
                    });
            } else {
                Alert.alert(
                    'Out of sessions',
                    'Please upgrade to make a call',
                )
            }
        }
    }

    const _handleSpeakerToggle = () => {
        setIsSpeakerOn(p => !p);
    }

    useEffect(() => {
        InCallManager.setSpeakerphoneOn(isSpeakerOn);
    }, [isSpeakerOn])

    useEffect(() => {
        if (!videoScreen && route.name === "Call" && navigation.canGoBack()) {
            navigation.goBack();
        }
    }, [videoScreen])

    useEffect(() => {
        if (videoScreen) {
            startCall();
        }
    }, [videoScreen]);

    return (
        <View style={{ backgroundColor: "black", height: "100%" }} onTouchStart={() => {
            // if (remoteStream) {
            //     setViewBtn(true);
            //     setTimeout(() => {
            //         setViewBtn(false)
            //     }, 2000);
            // }
        }}>
            <StatusBar backgroundColor="black" barStyle="light-content" />
            <RTCViewGrid remoteStream={remoteStream} localStream={localStream} />
            <SafeAreaView style={[styles.container, {}]}>
                {remoteStream && <>
                    {/*<View style={styles.toolBarItem}>*/}
                    {/*    <TouchableOpacity*/}
                    {/*        style={[styles.buttonContainer, styles.buttonMute]}*/}
                    {/*        onPress={toggleRecording}>*/}
                    {/*        <MaterialIcon name={'record-voice-over'} size={32} color={recording ? "red" : "white"} />*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}
                    <View style={styles.toolBarItem}>
                        <TouchableOpacity
                            style={[styles.buttonContainer, styles.buttonMute]}
                            onPress={toggleMute}>
                            <MaterialIcon name={!muted ? 'mic' : 'mic-off'} size={32} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.toolBarItem}>
                        <TouchableOpacity
                            style={[styles.buttonContainer, styles.buttonMute]}
                            onPress={_handleSpeakerToggle}>
                            <MaterialIcon name={isSpeakerOn ? 'volume-up' : 'volume-off'} size={32} color="white" />
                        </TouchableOpacity>
                    </View>
                </>}

                <View style={styles.toolBarItem}>
                    <TouchableOpacity
                        style={[styles.buttonContainer, styles.buttonCallEnd]}
                        onPress={rejectCall}>
                        <MaterialIcon name={"call-end"} size={32} color="white" />
                    </TouchableOpacity>
                </View>

                {ringing && <View style={styles.toolBarItem}>
                    <TouchableOpacity
                        style={[styles.buttonContainer, styles.buttonCall]}
                        onPress={acceptCall}>
                        <MaterialIcon name={"call"} size={32} color="white" />
                    </TouchableOpacity>
                </View>}
            </SafeAreaView>
        </View>
    )
};
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        height: 60,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        zIndex: 100,
    },
    toolBarItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonCall: {
        backgroundColor: 'green',
    },
    buttonCallEnd: {
        backgroundColor: 'red',
    },
    buttonMute: {
        backgroundColor: 'blue',
    },
    buttonSwitch: {
        backgroundColor: 'orange',
    },
});
export default CallScreenRoute;
