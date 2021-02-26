import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/auth";
import {Text, View, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity} from "react-native";
import RTCViewGrid from "../../src/components/VideoScreen/RTCViewGrid";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Alert} from "react-native";
import {useNavigation} from "@react-navigation/core";

const CallScreen = () => {
    const {
        remoteUser,
        setVideoScreen,
        acceptCall,
        rejectCall,
        remoteStream,
        localStream,
        setLocalStream,
        setIncall,
        incall,
        muted,
        toggleMute,
        ringing,
        setCalling,
        profile,
        call,
        calling,
        recording,
        toggleRecording,
        videoScreen,
    } = useContext(AuthContext);

    const startCall = () => {
        if (!ringing && remoteUser && !incall && !calling) {
            console.log(ringing, remoteUser, incall)
            console.log(profile?.name, " calling to => ", remoteUser?.name);
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

    useEffect(() => {

        navigation.navigate("Call");
        // startCall();
    }, []);
    let navigation = useNavigation();
    return (
        <View style={{backgroundColor: "black", height: "100%",}}>
            <StatusBar backgroundColor="black" barStyle="light-content"/>
            <RTCViewGrid remoteStream={remoteStream} localStream={localStream}/>
            <SafeAreaView style={styles.container}>
                {/*<View style={styles.toolBarItem}>*/}
                {/*    <TouchableOpacity*/}
                {/*        style={[styles.buttonContainer, styles.buttonMute]}*/}
                {/*        onPress={toggleRecording}>*/}
                {/*        <MaterialIcon name={'record-voice-over'} size={32} color={recording ? "red" : "white"}/>*/}
                {/*    </TouchableOpacity>*/}
                {/*</View>*/}
                <View style={styles.toolBarItem}>
                    <TouchableOpacity
                        style={[styles.buttonContainer, styles.buttonMute]}
                        onPress={toggleMute}>
                        <MaterialIcon name={!muted ? 'mic' : 'mic-off'} size={32} color="white"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.toolBarItem}>
                    <TouchableOpacity
                        style={[styles.buttonContainer, styles.buttonCallEnd]}

                        onPress={() => {
                            rejectCall();
                        }}>

                        <MaterialIcon name={"call-end"} size={32} color="white"/>
                    </TouchableOpacity>
                </View>
                {ringing && <View style={styles.toolBarItem}>
                    <TouchableOpacity
                        style={[styles.buttonContainer, styles.buttonCall]}
                        onPress={() => {
                            acceptCall();
                        }}>
                        <MaterialIcon name={"call"} size={32} color="white"/>
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
export default CallScreen;
