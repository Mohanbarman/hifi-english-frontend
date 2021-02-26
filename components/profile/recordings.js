/*
 * @author Gaurav Kumar
 */

import React, {useContext, useEffect, useState} from "react";
import {Text, View} from "react-native";
import {Avatar, Button, ListItem} from "react-native-elements";
import {ThemeContext} from "../../context/theme";
import RNFS from "react-native-fs";
import Sound from "react-native-sound";
import {format} from 'date-fns';

const Recordings = (props) => {
    const [recordings, setRecordings] = useState([]);
    let {colors} = useContext(ThemeContext);
    let [playingIndex, setPlayingIndex] = useState(-1);

    const playAudio = (key) => {
        if (recordings[key].audio.isPlaying()) {
            recordings[key].audio.pause();
            setPlayingIndex(-1);
            console.log(recordings[key])
            return 0;
        }

        recordings.forEach((audio) => {
            if (audio.audio.isPlaying()) {
                audio.audio.pause()
            }
        })

        setPlayingIndex(key);
        console.log(recordings[key])
        recordings[key].audio.play((s) => {
            if (s) {
                console.log("played")
            } else {
                console.log('playback failed due to audio decoding errors');
            }
        });
    };
    useEffect(() => {
        RNFS.readDir(RNFS.ExternalDirectoryPath)
            .then(async result => {
                result.map(a => {
                    setRecordings(p=>[...p, {name: a.name, audio: new Sound(a.path), date:a.mtime}])
                })
            })
            .catch(e => {
                console.log(e)
            })
    }, [])
    return (
        <View>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingLeft: 10,
                alignItems: "center",
                borderBottomColor: "#D8CEF780",
                borderBottomWidth: 2,
                paddingBottom: 10,
                paddingTop: 10
            }}>
                <Text style={{color: colors.secondary, fontSize: 18}}>Recordings</Text>
                <Button type={"clear"} title={"All"} titleStyle={{color: colors.secondary, fontSize: 15}}/>
            </View>
            {recordings?.map((item, key) => {
                return (
                    <ListItem key={key}
                              bottomDivider={true} onPress={() => playAudio(key)}>
                        <Avatar
                            containerStyle={{borderColor: "#D8CEF780", borderRadius: 7, borderWidth: 1}}
                            size={60}
                            icon={{
                                name: playingIndex === key ? "pause-circle-filled" : "play-circle-filled",
                                color: "#572CD8",
                                size: 45
                            }}
                            onPress={() => playAudio(key)}/>
                        <ListItem.Content>
                            <ListItem.Title style={{
                                fontSize: 18,
                                color: "#242134",
                                fontWeight: "bold"
                            }}>{item.name}</ListItem.Title>
                            <ListItem.Subtitle
                                style={{fontSize: 14, color: "#A490E0"}}>{format(new Date(item?.date),"d.M.yyyy")}</ListItem.Subtitle>
                        </ListItem.Content>
                        <Text
                            style={{fontSize: 18}}>{`${Math.ceil(item?.audio?._duration / 60)}:${Math.floor((item?.audio?._duration % 60))}`} min</Text>
                    </ListItem>
                );
            })}
            <ListItem>
                <ListItem.Content>
                    <ListItem.Title style={{
                        fontSize: 18,
                        color: "rgba(33,33,40,0.87)",
                    }}>{recordings?.length === 0 ?
                        "List is empty" : ""
                    }</ListItem.Title>
                </ListItem.Content>
            </ListItem>
        </View>
    )
};

export default Recordings;
