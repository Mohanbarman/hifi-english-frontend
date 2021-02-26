/*
 * @author Gaurav Kumar
 */

import React, {useContext, useEffect} from "react";
import {Avatar, Header} from "react-native-elements";
import {Image, SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import TabsWrapper from "./tabs-wrapper";
import ConnectWithExperts from "./connect-with-experts";
import {ThemeContext} from "../../context/theme";
import {AuthContext} from "../../context/auth";
import UserAvatar from "../../assets/images/useravatar.png";
import {formatDistanceToNow, isPast} from "date-fns";
import CallScreenModal from "../calling/CallScreenModal";


const styles = StyleSheet.create({
    profileWrapper: {
        paddingBottom: 54,
        paddingLeft: 35,
        paddingRight: 35,
        borderBottomLeftRadius: 45,
        borderBottomRightRadius: 45,
        marginBottom: 15
    },
    avatar: {
        height: 76,
        width: 76
    },
    userDetailsWrapper: {
        marginTop: 35,
        width: "100%",
        flexDirection: "row"
    },
    planDetailsWrapper: {
        borderRadius: 45,
        backgroundColor: "white",
        flexDirection: "row",
        borderColor: "#D8CEF780",
        borderWidth: 2,
        padding: 20,
        margin: 15
    },
    planTitle: {
        fontSize: 20,
        textAlign: "center"
    },
    connectToExpert: {
        borderRadius: 45,
        margin: 15,
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    header: {
        paddingLeft: 35,
        paddingRight: 35,
        borderBottomColor: 'transparent',
    }
});

const Student = (props) => {
    let {navigation} = props;
    let {colors} = useContext(ThemeContext);
    let {profile, videoScreen} = useContext(AuthContext);
    useEffect(() => {
        if (videoScreen) {
            navigation.navigate("Call");
        }
    }, [videoScreen])
    return (
        <SafeAreaView style={{backgroundColor: "white"}}>
            <ScrollView>
                <Header
                    leftComponent={{icon: 'menu', color: '#fff', size: 30, onPress: () => navigation.openDrawer()}}
                    centerComponent={{text: 'HIFI ENGLISH', style: {color: '#fff'}}}
                    backgroundColor={colors.primary}
                    containerStyle={styles.header}
                />
                <CallScreenModal/>
                <View style={[styles.profileWrapper, {backgroundColor: colors.primary}]}>
                    <View style={styles.userDetailsWrapper}>
                        <View style={{width: "70%"}}>
                            <Text style={{color: "white", fontSize: 22}}>{profile?.name}</Text>
                            <Text style={{color: "white", fontSize: 18}}>Sessions
                                : {profile?.numberOfSessions}</Text>
                            <Text style={{color: "white", fontSize: 18}}>Validity
                                : {isPast(new Date(profile?.validityDate))
                                    ? 'Expired'
                                    : formatDistanceToNow(new Date(profile?.validityDate))
                                    .replace('about ', '') + ' left'
                                }</Text>
                        </View>
                        <View style={{width: "30%"}}>
                            {/* <Image source={profile?.profileImageUrl ?? Avatar} style={styles.avatar} /> */}
                            <Avatar rounded
                                    size={"large"}
                                    source={{uri: profile?.profileImageUrl ?? Image.resolveAssetSource(UserAvatar).uri}}
                                    containerStyle={{marginBottom: 35}}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.planDetailsWrapper}>
                    <View style={{width: "auto", justifyContent: "center"}}>
                        <AnimatedCircularProgress size={67} width={5}
                                                  fill={Math.max(100 - Math.floor(100 * profile?.numberOfSessions / profile?.subscription?.sessions), 0)}
                                                  tintColor={colors.secondary}
                                                  backgroundColor="#572CD833"
                                                  padding={10}
                                                  rotation={0}>
                            {(progress) => (
                                <Text>
                                    {parseInt(progress)}%
                                </Text>
                            )}
                        </AnimatedCircularProgress>
                        <Text style={{textAlign: "center"}}>Completed</Text>
                    </View>
                    <View style={{width: "80%"}}>
                        <Text style={[styles.planTitle, {color: colors.primary}]}>{profile?.subscription?.title}</Text>
                        <View style={{flexDirection: "row", marginTop: 15}}>
                            <View style={{width: "50%", alignItems: "center"}}>
                                <Text style={{color: "#A490E0", fontSize: 15, marginBottom: 3}}>Sessions</Text>
                                <Text style={{color: "#242134", fontSize: 18}}>{profile?.numberOfSessions} left</Text>
                            </View>
                            <View style={{width: "50%", alignItems: "center"}}>
                                <Text style={{color: "#A490E0", fontSize: 15, marginBottom: 3}}>Validity</Text>
                                <Text style={{color: "#242134", fontSize: 18}}>{
                                    isPast(new Date(profile?.validityDate))
                                        ? 'Expired'
                                        : formatDistanceToNow(new Date(profile?.validityDate)).replace('about ', '') + ' left'
                                }</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <ConnectWithExperts/>
                <TabsWrapper/>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Student;
