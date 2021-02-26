/*
* @author Gaurav Kumar
* */

import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useContext} from "react";
import {AuthContext} from "../../context/auth";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import {useNavigation} from "@react-navigation/core";

const CallScreenModal = () => {
    const {videoScreen, remoteUser, rejectCall, acceptCall, ringing} = useContext(AuthContext);
    let navigation = useNavigation();
    return (videoScreen &&
        <SafeAreaView>
            <View style={styles.wrapper}>
                <Text style={styles.username} numberOfLines={1} onPress={() => {
                    navigation.navigate("Call");
                }}>Return to call</Text>
                <View style={styles.btnWrapper}>
                    <View style={styles.toolBarItem}>
                        <TouchableOpacity
                            style={[styles.buttonContainer, styles.buttonCallEnd]}
                            onPress={rejectCall}>
                            <MaterialIcon name={"call-end"} size={19} color="white"/>
                        </TouchableOpacity>
                    </View>

                    {ringing && <View style={styles.toolBarItem}>
                        <TouchableOpacity
                            style={[styles.buttonContainer, styles.buttonCall]}
                            onPress={acceptCall}>
                            <MaterialIcon name={"call"} size={19} color="white"/>
                        </TouchableOpacity>
                    </View>}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "green",
        position: "absolute",
        top: 0,
        width: "100%",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        justifyContent: "space-between",
        zIndex:3
    },
    username: {
        color: "white",
        fontSize: 18,
        flex:1
    },
    btnWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: "auto"
    },
    toolBarItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        height: 30,
        width: 30,
        borderRadius: 15,
        marginHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonCallEnd: {
        backgroundColor: 'red',
    },
    buttonCall: {
        backgroundColor: 'green',
    },
});

export default CallScreenModal;
