/*
 * @author Gaurav Kumar
 */

import React, {useContext, useState} from "react";
import {View, Text, FlatList} from "react-native";
import {Avatar, Button, Icon, ListItem} from "react-native-elements";
import {ThemeContext} from "../../context/theme";
import Sound from "react-native-sound";

import audioFile from "../../assets/audios/pina-colada.mp3";


let playlist = [
  {
    title: "title 1",
    audio: new Sound(require("../../assets/sounds/calling.mp3")),
  },
  {
    title: "title 2",
    audio: new Sound(require("../../assets/sounds/dialing.mp3")),
  },
  {
    title: "title 3",
    audio: new Sound("/data/user/0/com.rnvideochat/files/Mohanundefinedbarman updated-1610783796032.mp4"),
  }
]

const TrainingCenter = (props) => {
  let {colors} = useContext(ThemeContext);
  let [playingIndex, setPlayingIndex] = useState(-1);
  const playAudio = (key) => {
    if (playlist[key].audio.isPlaying()) {
      playlist[key].audio.pause();
      setPlayingIndex(-1);
      return 0;
    }

    playlist.forEach((audio) => {
      if (audio.audio.isPlaying()) {
        audio.audio.pause()
      }
    })

    setPlayingIndex(key);
    playlist[key].audio.play();
  };
  return (
    <View style={{paddingLeft: 20, paddingRight: 20}}>
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
        <Text style={{color: colors.secondary, fontSize: 18}}>Training Center</Text>
        <Button type={"clear"} title={"All"} titleStyle={{color: colors.secondary, fontSize: 15}}/>
      </View>
      <View style={{borderRadius: 10, overflow: "hidden"}}>
        {playlist?.map((item, key) => {
          return (
            <ListItem key={key} onPress={() => {
              playAudio(key);
            }} bottomDivider={true}>
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
                <ListItem.Title
                  style={{color: "#242134", fontWeight: "bold", fontSize: 18}}>{item.title}</ListItem.Title>
                <Button
                  title={playingIndex === key ? "Pause" : "Play"} type={"clear"}
                  titleStyle={{color: "#572CD8", fontSize: 18}} onPress={() => playAudio(key)}
                />
              </ListItem.Content>
            </ListItem>
          )
          // return (
          //     <ListItem key={key}
          //               leftAvatar={
          //                   <Avatar
          //                       containerStyle={{borderColor: "#D8CEF780", borderRadius: 7, borderWidth: 1}}
          //                       size={60}
          //                       icon={{
          //                           name: key === playingIndex ? "pause-circle-filled" : "play-circle-filled",
          //                           color: "#572CD8",
          //                           size: 45
          //                       }}
          //                       onPress={() => {
          //                           playAudio(key);
          //                       }}/>
          //               }
          //               title={"Demo Recording 1"}
          //               titleStyle={{color: "#242134", fontWeight: "bold", fontSize: 18}}
          //               rightElement={
          //                   <Button title={key === playingIndex ? "Pause" : "Play"} type={"clear"}
          //                           titleStyle={{color: "#572CD8", fontSize: 18}} onPress={() => {
          //                       playAudio(key);
          //                   }}/>
          //               }
          //               onPress={() => {
          //                   playAudio(key);
          //               }}
          //               bottomDivider={true}
          //     />
          // );
        })}
      </View>
    </View>
  )
};


export default TrainingCenter;
