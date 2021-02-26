import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Avatar from "../../../assets/images/useravatar.png";

export default ({name, profileImage}) => (
    <View style={styles.container}>
        <View style={styles.info}>
            <Image source={{uri: profileImage ?? Image.resolveAssetSource(Avatar).uri}} style={styles.avatar}/>
            <Text style={styles.text}>{name}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "black",
        opacity: 1
    },
    info: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    },
    text: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        marginTop: 15,
    },
    avatar: {
        height: 130,
        width: 130,
        borderRadius: 65,
    }
});
