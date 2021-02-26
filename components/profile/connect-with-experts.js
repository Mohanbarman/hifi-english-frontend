/*
 * @author Gaurav Kumar
 */

import React, {useContext, useState, useEffect} from "react";
import {Avatar, Icon, ListItem, Overlay, Rating, Image} from "react-native-elements";
import {Text, TouchableHighlight, View, StyleSheet, FlatList, ScrollView} from "react-native";
import {ThemeContext} from "../../context/theme";
import Call from "../Call";
import {gql, useLazyQuery, useQuery} from "@apollo/client";
import {ActivityIndicator} from "react-native";
import {AuthContext} from "../../context/auth";
import {Alert} from "react-native";
import UserAvatar from "../../assets/images/useravatar.png";
import {useNavigation} from "@react-navigation/core";
// import {AgoraContext} from "../../context/AgoraContext";

const styles = StyleSheet.create({
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
    }
});

const EXPERTS = gql`
    query USERS($role:String, $page:Int, $pageSize:Int){
        users(role: $role, page:$page, pageSize: $pageSize){
            objects{
                id
                name
                role
                online
                gender
                rating
                webrtcId
                profileImageUrl
            }
        }
    }
`;

const ConnectWithExperts = (props) => {
    let {colors} = useContext(ThemeContext);
    const [overlayVisible, setOverlay] = useState(false);

    const [getExperts, {data, loading, error}] = useLazyQuery(EXPERTS);
    const [experts, setExperts] = useState(undefined);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isNextLoading, setIsNextLoading] = useState(false);

    useEffect(() => {
        if (error) {
            Alert.alert('Something went wrong', error?.message);
        }

        if (data && refreshing) {
            setExperts(data?.users?.objects);
            setPage(data?.users?.page);
            setHasNextPage(data?.users?.hasNext);
            setRefreshing(false);
        } else if (data && isNextLoading) {
            setExperts(p => [...p, ...data?.users?.objects]);
            setPage(data?.users?.page);
            setHasNextPage(data?.users?.hasNext);
            setIsNextLoading(false);
        } else if (data) {
            setExperts(data?.users?.objects);
            setPage(data?.users?.page);
            setHasNextPage(data?.users?.hasNext);
        }
    }, [data])

    useEffect(() => {
        getExperts({variables: {role: 'teacher', page: 1, pageSize: 10}});
        setRefreshing(false);
        setIsNextLoading(false);
    }, [overlayVisible]);

    useEffect(() => {
        getExperts({variables: {role: 'teacher'}});
    }, [])

    const handleRefresh = () => {
        setRefreshing(true);
        getExperts({variables: {role: 'teacher'}});
    }

    const handleEndReached = () => {
        if (hasNextPage) {
            setIsNextLoading(true);
            getExperts({
                variables: {
                    role: 'teacher',
                    page: page + 1,
                    pageSize: 10,
                }
            });
        }
    }

    return (
        <View>
            <TouchableHighlight style={{height: 100}} onPress={() => setOverlay(true)} underlayColor={"transparent"}>
                <View style={[styles.connectToExpert, {backgroundColor: colors.secondary}]}>
                    <Text style={{color: "white", fontSize: 18}}>Connect with an expert</Text>
                    <Icon name={"phone"} reverseColor={"#42BC1F"} color={"white"} reverse={true} size={25}
                          iconStyle={{fontSize: 35}}/>
                </View>
            </TouchableHighlight>
            <Overlay isVisible={overlayVisible} onBackdropPress={() => setOverlay(false)} width={"auto"}
                     overlayStyle={{borderRadius: 30, borderColor: "#D8CEF77F", padding: 0, overflow: 'hidden'}}
                     windowBackgroundColor={"#FFFFFF"}>
                <View>
                    <Text style={{
                        color: colors.primary,
                        textAlign: "center",
                        fontSize: 20,
                        borderBottomWidth: 1,
                        borderColor: "#D8CEF77F",
                        paddingBottom: 20,
                        paddingTop: 20
                    }}>Available Experts</Text>

                    {loading && !refreshing && !isNextLoading
                        ? <ActivityIndicator style={{padding: 10, width: 350, height: 450}} size='large'
                                             color={colors.primary}/>
                        : <FlatList
                            style={{maxHeight: 450, minWidth: 350, overflow: "hidden"}}
                            data={experts}
                            renderItem={(item) => <Expert item={item} setOverlay={setOverlay}/>}
                            keyExtractor={item => item?.id}
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            onEndReachedThreshold={0.1}
                            onEndReached={handleEndReached}
                            ListFooterComponent={hasNextPage
                                ? <ActivityIndicator style={{padding: 10}} size='large' color={colors.primary}/>
                                : <Text style={{textAlign: 'center', padding: 10, color: 'black', fontWeight: '500'}}>No more experts</Text>
                            }
                        />
                    }
                </View>
            </Overlay>
        </View>
    );
};

const Expert = ({item: {item}, setOverlay}) => {
    const {setVideoScreen, setRemoteUser, connectycubeConnected, profile, setRemoteUserId} = useContext(AuthContext);

    const handlePress = () => {
        if (profile?.numberOfSessions > 0) {
            if (connectycubeConnected) {
                setVideoScreen(true);
                setRemoteUser(item);
                setRemoteUserId(item?.id);
                console.log(setOverlay, ' overlay');
                setOverlay(false);
            } else {
                Alert.alert(
                    'Not connected to the server',
                    'Please wait for a minute If problem still exists please login again.',
                )
            }

        } else {
            if (profile?.numberOfSessions < 1) {
                Alert.alert(
                    'Out of sessions',
                    'Please upgrade to make a call',
                )
            } else if (new Date(Date.parse(profile?.validityDate)) < Date.now()) {
                Alert.alert(
                    'Validity expired',
                    'Please upgrade to make a call',
                )
            }
        }

    }

    return (
        <ListItem
            onPress={handlePress}
            bottomDivider={true} >
            <Avatar source={{uri: item?.profileImageUrl ?? Image.resolveAssetSource(UserAvatar).uri}} size={58}
                    rounded/>
            <ListItem.Content>
                <ListItem.Title style={{
                    fontSize: 18,
                    color: "#242134",
                    fontWeight: "bold",
                    textTransform: "capitalize"
                }}>{item.name}</ListItem.Title>
            </ListItem.Content>
            <Icon name={"phone"} reverseColor={"#42BC1F"} color={"white"} reverse={true}
                  size={25}
                  iconStyle={{fontSize: 35}}
                  containerStyle={{borderColor: "#70707080", borderWidth: 1}}/>
        </ListItem>

    )
}

export default ConnectWithExperts;
