/*
 * @author Gaurav Kumar
 */

import React, {useContext, useEffect} from "react";
import {View, Text, FlatList, PermissionsAndroid, ToastAndroid} from "react-native";
import {Button, ListItem} from "react-native-elements";
import UserAvatar from "../../assets/images/useravatar.png";
import {ThemeContext} from "../../context/theme";
import RNFS from 'react-native-fs';

const Assignments = (props) => {
    let {theme} = props;
    let {colors} = useContext(ThemeContext);

    const assignments = [
        {
            id: 1,
            title: 'Assignment 1',
            path: 'hifi-english-assignment.pdf',
        },
    ]

    return (
        <View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottomColor: "#D8CEF780",
                    borderBottomWidth: 2,
                    paddingBottom: 10,
                    paddingTop: 10,
                    paddingHorizontal: 30,
                }}>
                <Text style={{color: colors.secondary, fontSize: 18}}>Assignments</Text>
                <Button type={"clear"} title={"All"} titleStyle={{color: colors.secondary, fontSize: 15}}/>
            </View>
            <FlatList
                data={assignments}
                renderItem={(item) => Assignment(item)}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                    <ListItem>
                        <ListItem.Content>
                            <ListItem.Title style={{
                                fontSize: 18,
                                color: "rgba(33,33,40,0.87)",
                            }}>
                                List is empty
                            </ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                }/>
        </View>
    )
};

const Assignment = ({item}) => {

    const handleSave = async () => {
        // Request for storage permission
        const permissionRes = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

        if (permissionRes === PermissionsAndroid.RESULTS.GRANTED) {
            // Read pdf from 'android/app/src/main/assets' make sure to rebuild app after making changes in that dir
            const data = await RNFS.readFileAssets(item.path, "base64")

            // Set download directory path
            const downloadPath = RNFS.DownloadDirectoryPath + '/' + item.path;

            // Write file to download directory
            const writeRes = await RNFS.writeFile(downloadPath, data, 'base64');

            ToastAndroid.show('Saved ' + downloadPath, ToastAndroid.LONG)
        } else {
            ToastAndroid.show('Allow storage permission to save assignments', ToastAndroid.LONG);
        }
    }

    return (
        <ListItem key={item.id} bottomDivider={true} containerStyle={{paddingHorizontal: 30}}>
            <ListItem.Content>
                <ListItem.Title style={{fontSize: 15, color: "#242134"}}>{item.title}</ListItem.Title>
                <ListItem.Subtitle style={{fontSize: 13, color: "#A490E0"}}>{".pdf"}</ListItem.Subtitle>
            </ListItem.Content>
            <Button
                type="outline"
                titleStyle={{color: "#572CD8", fontSize: 15}}
                title="Save"
                onPress={handleSave}
            />
        </ListItem>
    );
};

export default Assignments;
