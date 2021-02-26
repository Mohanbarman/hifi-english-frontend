/*
 * @author Gaurav Kumar
 */

import React, {useContext} from "react";
import {DrawerContentScrollView, DrawerItemList, DrawerItem} from "@react-navigation/drawer";
import {LinkingStatic as Linking, StyleSheet, View, Text, Image, TouchableHighlight} from "react-native";
import {Icon, SocialIcon, Avatar} from "react-native-elements";
import {ThemeContext} from "../context/theme";
import {AuthContext} from "../context/auth";
import UserAvatar from "../assets/images/useravatar.png";
import {formatDistanceToNow, isPast} from "date-fns";

const styles = StyleSheet.create({
    avatar: {
        height: 70,
        width: 70
    },
    userDetailsWrapper: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderBottomLeftRadius: 45,
        borderBottomRightRadius: 45,
        backgroundColor: "white",
        paddingBottom: 54,
        paddingLeft: 35,
        paddingRight: 35,
        paddingTop: 40,
        marginTop: -5
    },
    navItem: {
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        marginTop: 0,
        borderRadius: 0, borderBottomWidth: 1, borderBottomColor: "rgba(222,222,222,0.64)", backgroundColor: "white",
    },
    navItemIcon: {
        marginRight: 0,
        color: "#572CD8",
        marginLeft: 27
    },
    navItemLabel: {
        color: "#404040",
        fontSize: 15
    },
    categoryTitle: {
        color: "white", fontSize: 16, paddingLeft: 35,
        fontWeight: "bold",
        marginTop: 18, marginBottom: 18
    }
});

const HifiDrawerContent = (props) => {
    let {navigation} = props;
    let colors = useContext(ThemeContext);
    let {logout, profile} = useContext(AuthContext);

    return (
        <DrawerContentScrollView {...props} style={{padding: 0}}>
            <UserProfile {...props} />
            <Text style={styles.categoryTitle}>Account</Text>
            <DrawerItem
                style={styles.navItem}
                icon={() => <Icon name={"account-circle"} style={[styles.navItemIcon]} size={30} color={"#572CD8"}/>}
                label={"Edit Profile"}
                labelStyle={[styles.navItemLabel]}
                onPress={() => navigation.navigate("EditProfile")}/>
            {/*<DrawerItem*/}
            {/*    style={styles.navItem}*/}
            {/*    icon={() => <Icon name={"event"} size={30} color={"#572CD8"} style={[styles.navItemIcon]}/>}*/}
            {/*    label={"My Batch"}*/}
            {/*    labelStyle={[styles.navItemLabel]}*/}
            {/*    onPress={() => navigation.navigate("Profile")}/>*/}
            {/*<DrawerItem*/}
            {/*    style={styles.navItem}*/}
            {/*    icon={() => <Icon name={"check"} size={30} color={"#572CD8"} style={[styles.navItemIcon]}/>}*/}
            {/*    label={"Subscribe for Daily Vocabulary"}*/}
            {/*    labelStyle={[styles.navItemLabel]}*/}
            {/*    onPress={() => navigation.navigate("Profile")}/>*/}
            {profile?.role?.toLowerCase() === 'student' &&
            <DrawerItem
                style={styles.navItem}
                icon={() => <Icon name={"credit-card"} size={30} color={"#572CD8"} style={[styles.navItemIcon]}/>}
                label={"Subscription"}
                labelStyle={[styles.navItemLabel]}
                onPress={() => navigation.navigate("Subscriptions")}/>
            }
            <DrawerItem
                style={styles.navItem}
                icon={() => <Icon name={"vpn-key"} size={30} color={"#572CD8"} style={[styles.navItemIcon]}/>}
                label={"Change Password"}
                labelStyle={[styles.navItemLabel]}
                onPress={() => navigation.navigate("ChangePassword")}/>
            {profile?.role?.toLowerCase() === 'teacher' ?
                <DrawerItem
                    style={styles.navItem}
                    icon={() => <Icon name={"account-balance-wallet"} size={30} color={"#572CD8"}
                                      style={[styles.navItemIcon]}/>}
                    label={"Wallet"}
                    labelStyle={[styles.navItemLabel]}
                    onPress={() => navigation.navigate("Wallet")}/>
                : null}
            {/*{profile?.role?.toLowerCase() === 'teacher' ?*/}
            {/*    <DrawerItem*/}
            {/*        style={styles.navItem}*/}
            {/*        icon={() => <Icon name={"picture-as-pdf"} size={30} color={"#572CD8"} style={[styles.navItemIcon]} />}*/}
            {/*        label={"Document Upload"}*/}
            {/*        labelStyle={[styles.navItemLabel]}*/}
            {/*        onPress={() => navigation.navigate("UploadDocument")} />*/}
            {/*    : null}*/}
            <DrawerItem
                style={styles.navItem}
                icon={() => (<Icon
                    name={'call'}
                    size={30}
                    color={"#572CD8"}
                    style={[styles.navItemIcon]}
                />)}
                label={"Contact us"}
                labelStyle={[styles.navItemLabel]}
                onPress={() => navigation.navigate("ContactUs")}
            />
            <DrawerItem
                style={styles.navItem}
                icon={() => <Icon name={"power-settings-new"} size={30} color={"#572CD8"}
                                  style={[styles.navItemIcon]}/>}
                label={"Logout"}
                labelStyle={[styles.navItemLabel]}
                onPress={logout}/>
            {/*<DrawerItem*/}
            {/*    style={styles.navItem}*/}
            {/*    icon={() => <Icon name={"contact-phone"} size={30} color={"#572CD8"} style={[styles.navItemIcon]}/>}*/}
            {/*    label={"Contact Us"}*/}
            {/*    labelStyle={[styles.navItemLabel]}*/}
            {/*    onPress={() => navigation.navigate("Profile")}/>*/}
            {/*<Text style={styles.categoryTitle}>Earn Free Minutes</Text>*/}
            {/*<DrawerItem*/}
            {/*    style={styles.navItem}*/}
            {/*    icon={() => <Icon name={"facebook"} type={"zocial"} size={30} color={"#3286E6"} light*/}
            {/*        style={[styles.navItemIcon]} raised={false} />}*/}
            {/*    label={"Facebook"}*/}
            {/*    labelStyle={[styles.navItemLabel]}*/}
            {/*    onPress={() => {*/}
            {/*    }} />*/}
            {/*<DrawerItem*/}
            {/*    style={styles.navItem}*/}
            {/*    icon={() => <Icon name={"logo-twitter"} type={"ionicon"} size={30} color={"#0DBEFF"} light*/}
            {/*        style={[styles.navItemIcon]} raised={false} />}*/}
            {/*    label={"Twitter"}*/}
            {/*    labelStyle={[styles.navItemLabel]}*/}
            {/*    onPress={() => {*/}
            {/*    }} />*/}
        </DrawerContentScrollView>
    )
};

const UserProfile = (props) => {
    let {colors} = useContext(ThemeContext);
    let {profile} = useContext(AuthContext);
    let {navigation} = props;

    return (
        <TouchableHighlight onPress={() => navigation.navigate("Profile")} underlayColor={"transparent"}>
            <View style={[styles.userDetailsWrapper]}>
                <View style={{width: "70%"}}>
                    <Text style={{color: colors.primary, fontSize: 20}}>{profile?.name}</Text>
                    {profile?.role?.toLowerCase() === 'student' && <>
                        <Text style={{color: colors.primary, fontSize: 16}}>Sessions
                            : {profile?.numberOfSessions}</Text>
                        <Text style={{color: colors.primary, fontSize: 16}}>
                            Validity : {
                            isPast(new Date(profile?.validityDate))
                                ? 'Expired'
                                : formatDistanceToNow(new Date(profile?.validityDate))
                                .replace('about ', '') + ' left'}
                        </Text>
                    </>}

                </View>
                <View style={{width: "30%"}}>
                    {/* <Image source={Avatar} style={styles.avatar} /> */}
                    <Avatar rounded
                            size={"large"}
                            source={{uri: profile?.profileImageUrl ?? Image.resolveAssetSource(UserAvatar).uri}}
                            containerStyle={{marginBottom: 35}}
                    />
                </View>
            </View>
        </TouchableHighlight>
    );
}

export default HifiDrawerContent;

