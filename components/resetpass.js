/*
 * @author Gaurav Kumar
 */

import React from "react";
import {View, Text, StyleSheet, Picker} from "react-native";
import {Avatar, Button, Input} from "react-native-elements";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        width: "100%",
        height: "100%"
    },
    btnContainer: {
        marginTop: 80,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        width: "100%"
    },
    loginBtn: {
        borderRadius: 20,
        borderColor: 'purple',
        borderWidth: 2,
        color: 'red',
        overflow: 'hidden',
        paddingLeft: 20,
        paddingRight: 20
    },
    header: {
        fontSize: 40,
        color: "purple",
        textAlign: "center"
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10
    }
});

const ResetPass = ()=>{
    return(
        <View style={styles.container}>
            <Text style={styles.header}>Reset Password</Text>
            <Input placeholder={"Email"}/>
            <Button title={"Continue"}/>
        </View>
    );
};

export default ResetPass;
