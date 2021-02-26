/*
 * @author Gaurav Kumar
 */

/*
 * @author Gaurav Kumar
 */

import React, { useContext, useEffect, useState } from "react";
import { Icon, ListItem, Overlay, Rating } from "react-native-elements";
import { Text, TouchableHighlight, View, StyleSheet, FlatList, ScrollView, Switch, Alert } from "react-native";
import UserAvatar from "../../assets/images/useravatar.png";
import { ThemeContext } from "../../context/theme";
import { AuthContext } from "../../context/auth";
import { gql, useMutation } from "@apollo/client";

const styles = StyleSheet.create({
    connectToExpert: {
        borderRadius: 45,
        borderColor: "#D8CEF780",
        borderWidth: 2,
        margin: 15,
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 20,
        paddingRight: 32,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
});
const UPDATE_PROFILE = gql`
    mutation UPDATEUSER($online:Boolean){
        updateUser(online:$online){
            profile{
                id
                email
                gender
                city
                dateJoined
                dob
                hobbies
                isActive
                isAdmin
                isStaff
                isSuperuser
                languageKnown
                lastLogin
                level
                name
                phone
                profession
                role
                state
                online
                numberOfSessions
                webrtcId
                webrtcPassword
                validityDate
                profileImageUrl
                accountNumber
                ifscCode
                upiId
                subscription{
                    id
                    days
                    title
                    minutes
                    sessions
                    discountPrice
                    price
                } 
            }
        }
    }
`;

const ReadyForCall = (props) => {
    let { theme } = props;
    let { colors } = useContext(ThemeContext);
    let { profile, setProfile } = useContext(AuthContext);
    const [ready, setReady] = useState(!!profile?.online);
    const [update, { data, error, loading }] = useMutation(UPDATE_PROFILE);

    return (
        <View>
            <TouchableHighlight style={{ height: 100 }}>
                <View style={[styles.connectToExpert, { backgroundColor: "white" }]}>
                    <Text style={{ color: colors.primary, fontSize: 18 }}>Ready to take call </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#42BC1F" }}
                        thumbColor={"white"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => {
                            setReady(!ready);
                            update({ variables: { online: !profile?.online } })
                                .then(({ data }) => {
                                    setReady(data?.updateUser?.profile?.online);
                                    setProfile(data?.updateUser?.profile);
                                })
                                .catch(e => {
                                    setReady(p => !p);
                                    console.log(e);
                                    Alert.alert(e?.message);
                                })

                        }}
                        value={ready}
                    />
                </View>
            </TouchableHighlight>
        </View>
    );
};

export default ReadyForCall;
