import { Text, View, StyleSheet, Image } from "react-native";
import React from "react";
import IconImage from "../assets/logo.png";


export default function InternetNotConnected() {
    return (
        <View style={styles.container}>
            <Image source={IconImage} style={styles.image} />
            <Text style={styles.errorText}>Internet not connected</Text>
        </View>
    )
}

styles = StyleSheet.create({
    container: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    errorText: {
        fontSize: 30,
        color: "black",
        fontWeight: "500",
    },
    image: {
        width: 400,
        height: 400
    }
})