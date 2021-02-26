/*
 * @author Gaurav Kumar
 */

import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import Screen0Image from "../assets/images/screen0.png";
import { Avatar, Button, Icon } from "react-native-elements";
import { gql, useMutation } from "@apollo/client";
// import { AgoraContext } from "../context/AgoraContext";
// import config from "../config";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#572CD8',
        justifyContent: 'center',
        width: "100%",
        height: "100%",
        alignItems: "center",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "flex-end",
        backgroundColor: '#572CD8',
    },
    btnWrapper: {
        borderRadius: 45,
        margin: 15,
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 20,
        paddingRight: 20,
        // position: "absolute",
        // bottom: 0,
        // left: 0,
        // right: 0,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    remoteView: {
        position: "absolute",
        left: 9,
        bottom: 115,
        width: 150,
        height: 150,
        borderRadius: 10,
        backgroundColor: 'rgb(239,118,118)',
    },
    localView: {
        position: "absolute",
        right: 9,
        bottom: 115,
        width: 150,
        height: 150,
        borderRadius: 10,
        backgroundColor: 'rgb(239,118,118)',
    },
    minutesText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
        marginTop: 30
    }
});
import ConnectyCube from 'react-native-connectycube';
import { AuthContext } from "../context/auth";

const CALL = gql`
    mutation CALL($to:Int!, $minutes:Float){
        call(toUser: $to, minutes: $minutes){
            call{
                id
                minutes
                toUser{
                    id
                    name
                }
                dateTime
            }
        }
    }
`;
const MEDIA_OPTIONS = { audio: true, video: { facingMode: 'user' } };
const Call = ({ user, close }) => {
    const [localStream, setLocalStream] = useState(undefined)
    const [md, setMd] = useState(undefined);
    const [seconds, setSeconds] = useState(0);
    const [makeCall, { loading, data, error }] = useMutation(CALL);
    const {
        call,
        disconnect,
        remoteUser,
        ringing,
        acceptCall,
        calling,
        connected,
        openMicrophone,
        engine,
        setOpenMicrophone
    } = useContext(AuthContext);

    useEffect(() => {
        if (connected) {
            setInterval(() => {
                setSeconds(p => p + 1)
            }, 1000);
        }
    }, [connected]);

    return (
        <View style={styles.container}>
            <Avatar rounded title={user?.name?.substr(0, 2) || remoteUser?.name?.substr(0, 2)} activeOpacity={1}
                overlayContainerStyle={{
                    borderColor: "#ffffff", borderWidth: 5,
                    shadowColor: "#2b2b2b",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 19,
                    backgroundColor: "black"
                }}
                showAccessory={true}
                titleStyle={{ fontSize: 50, textTransform: "capitalize" }}
                size={170} />
            <Text
                style={styles.minutesText}>{calling || ringing ? "calling..." : `${Math.floor(seconds / 60)}:${seconds % 60} min`}</Text>
            {/*<RTCView streamURL={remoteStream?.toURL()} style={styles.remoteView}/>*/}
            {/*<RTCView streamURL={localStream?.toURL()} style={styles.localView}/>*/}
            <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
                {/*<View style={{width: "100%", justifyContent:"center", flexDirection:"row", flex:1}}>*/}
                {/*    <Icon*/}
                {/*        reverse={true}*/}
                {/*        name={"call"}*/}
                {/*        color={'rgba(0,0,0,0)'}*/}
                {/*        size={30}*/}
                {/*        reverseColor={"white"}*/}
                {/*        containerStyle={{backgroundColor: 'rgba(0,0,0,0)'}}*/}
                {/*    />*/}
                {/*</View>*/}


                <View style={styles.btnWrapper}>
                    <Icon
                        reverse={true}
                        name={"call"}
                        color={'#bbb5d7'}
                        size={35}
                        disabled={calling || connected}
                        reverseColor={"green"}
                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
                        onPress={() => {
                            // receive();
                            if (ringing) {
                                console.log("ringing")
                                acceptCall();
                            } else {
                                call();
                            }
                        }}
                    />
                    <Icon
                        reverse={true}
                        name={openMicrophone ? "mic-off" : "mic"}
                        color={'#bbb5d7'}
                        size={30}
                        reverseColor={"white"}
                        disabled={ringing || calling}
                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
                        onPress={() => {
                            engine?.muteLocalAudioStream(openMicrophone)
                                .then(r => {
                                    setOpenMicrophone(p => !p);
                                    console.log("muted")
                                })
                                .catch(e => {
                                    console.log(e)
                                })
                        }}
                    />
                    <Icon
                        reverse={true}
                        name={"call-end"}
                        color={'#bbb5d7'}
                        size={35}
                        reverseColor={"red"}
                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
                        onPress={disconnect}
                    />
                </View>
            </View>
        </View>
    )
};

export default Call;
