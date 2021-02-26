import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RTCView} from 'react-native-connectycube';
import {AuthContext} from '../../../context/auth';
import CallingLoader from './CallingLoader';

const Timer = ({remoteStream}) => {
    const [seconds, setSeconds] = useState(0);
    const {incall, videoScreen, session, profile, acceptTime} = useContext(AuthContext);
    const [interval, updateInterval] = useState(undefined);

    // useEffect(() => {
    //     if (videoScreen) {
    //         setSeconds(0);
    //     }
    //     clearInterval(interval);
    // }, [videoScreen]);

    useEffect(() => {
        if (acceptTime > 0 && videoScreen) {
            setSeconds(0)
            let p = setInterval(() => {
                console.log("still interval ", acceptTime)
                if(videoScreen) {
                    const callDuration = Math.floor((Date.now() - acceptTime) / 1000);
                    setSeconds(callDuration);
                }else{
                    clearInterval(interval)
                }
            }, 1000);
            updateInterval(p);
        }
        clearInterval(interval)
        console.log(interval, videoScreen)
        return () => {
            clearInterval(interval);
            setSeconds(0);
        }
    }, [acceptTime, videoScreen])

    return <Text
        style={styles.timerText}>{`${Math.floor(seconds / 60)} : ${(seconds % 60) < 10 ? `0${seconds % 60}` : (seconds % 60)} min`}</Text>;
}

export default ({remoteStream, localStream}) => {
    const {remoteUser, profile, acceptTime} = useContext(AuthContext);
    const RTCViewRendered = ({user, stream}) => {
        return (
            <View style={styles.blackView}>
                {stream
                    ? <RTCView
                        objectFit="cover"
                        style={styles.blackView}
                        key={user?.id}
                        streamURL={stream.toURL()}
                        zOrder={1} />
                    : <CallingLoader
                        profileImage={profile?.name === user?.name ? profile?.profileImageUrl : remoteUser?.profileImageUrl}
                        name={profile?.name === user?.name ? 'You' : user?.name}/>
                }
            </View>
        );
    };
    return <View style={[styles.blackView, {height: "100%"}]}>
        <RTCViewRendered
            user={remoteUser}
            stream={remoteStream}
        />
        <Timer remoteStream={remoteStream}/>
        <RTCViewRendered
            user={profile}
            stream={localStream}
        />
    </View>;
};

const styles = StyleSheet.create({
    blackView: {
        flex: 1,
        backgroundColor: 'black',
        opacity: 1,
        zIndex: 2
    },
    inColumn: {
        flex: 1,
        flexDirection: 'column',
    },
    inRow: {
        flex: 1,
        flexDirection: 'row',
    },
    timerText: {
        color: 'white',
        fontSize: 40,
        textAlign: 'center',
    }
});
