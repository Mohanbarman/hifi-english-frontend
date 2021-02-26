/*
 * @author Gaurav Kumar
 */

import React, {useContext, useEffect, useState} from "react";
import {Avatar, Icon, Image, ListItem, Overlay} from "react-native-elements";
import {ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import UserAvatar from "../../assets/images/useravatar.png";
import {ThemeContext} from "../../context/theme";
import {useNavigation} from "@react-navigation/core";
import {gql, useLazyQuery, useQuery} from "@apollo/client";
import {AuthContext} from "../../context/auth";
import lightFormat from 'date-fns/lightFormat'

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

const CALLBACK_REQUESTS = gql`
    query CALLS($toUser:Int, $callType:String, $page:Int, $pageSize:Int) {
        calls(toUser: $toUser,callType: $callType, page:$page, pageSize:$pageSize){
            hasNext
            hasPrev
            objects{
                callType
                dateTime
                fromUser{
                    id
                    name
                    webrtcId
                    profileImageUrl
                    subscription {
                        minutes
                        id
                        sessions
                    }
                }
                toUser{
                    id
                    name
                    webrtcId
                }
                minutes
            }
            totalDocs
            page
            pages
        }
    }
`;

const CallbackRequests = (props) => {
    let {theme} = props;
    let {colors} = useContext(ThemeContext);
    let {profile} = useContext(AuthContext);
    const [overlayVisible, setOverlay] = useState(false);

    const [getCallBackRequests, {data, loading, error}] = useLazyQuery(CALLBACK_REQUESTS);
    const [callbackRequests, setCallbackRequests] = useState(undefined);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isNextLoading, setIsNextLoading] = useState(false);

    useEffect(() => {
        if (data && refreshing) {
            setCallbackRequests(data?.calls?.objects);
            setPage(data?.calls?.page);
            setHasNextPage(data?.calls?.hasNext);
            setRefreshing(false);
        } else if (data && isNextLoading) {
            setCallbackRequests(p => [...p, ...data?.calls?.objects]);
            setPage(data?.calls?.page);
            setHasNextPage(data?.calls?.hasNext);
            setIsNextLoading(false);
        } else if (data) {
            setCallbackRequests(data?.calls?.objects);
            setPage(data?.calls?.page);
            setHasNextPage(data?.calls?.hasNext);
        }
    }, [data])

    useEffect(() => {
        getCallBackRequests({variables: {toUser: profile?.id, callType: "missed"}});
        setRefreshing(false);
        setIsNextLoading(false);
    }, [overlayVisible]);

    useEffect(() => {
        getCallBackRequests({variables: {toUser: profile?.id, callType: "missed"}});
    }, [])

    const handleRefresh = () => {
        setRefreshing(true);
        getCallBackRequests({variables: {toUser: profile?.id, callType: "missed"}});
    }

    const handleEndReached = () => {
        if (hasNextPage) {
            setIsNextLoading(true);
            getCallBackRequests({
                variables: {
                    page: page + 1,
                    pageSize: 10,
                    toUser: profile?.id,
                    callType: "missed"
                }
            });
        }
    }

    return (
        <View>
            <TouchableHighlight style={{height: 100}} onPress={() => setOverlay(true)} underlayColor={"transparent"}>
                <View style={[styles.connectToExpert, {backgroundColor: colors.secondary}]}>
                    <Text style={{color: "white", fontSize: 18}}>CallBack Requests ({data?.calls?.totalDocs})</Text>
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
                    }}>CallBack Requests</Text>

                    {loading && !refreshing && !isNextLoading
                        ? <ActivityIndicator style={{padding: 10, width: 350, height: 450}} size='large'
                                             color={colors.primary}/>
                        : <FlatList
                            style={{maxHeight: 450, minWidth: 350, overflow: "hidden"}}
                            data={callbackRequests}
                            renderItem={(item) => <RenderCallbackRequest item={item} setOverlay={setOverlay}/>}
                            keyExtractor={item => item?.dateTime}
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            onEndReachedThreshold={0.1}
                            onEndReached={handleEndReached}
                            ListFooterComponent={hasNextPage
                                ? <ActivityIndicator style={{padding: 10}} size='large' color={colors.primary}/>
                                : <Text style={{textAlign: 'center', padding: 10, color: 'black', fontWeight: '500'}}>No more requests</Text>
                            }
                        />
                    }
                </View>
            </Overlay>
        </View>
    );
};

const RenderCallbackRequest = ({item: {item}, setOverlay}) => {
    let {setVideoScreen, setRemoteUser, connectycubeConnected} = useContext(AuthContext);
    const dateObj = new Date(Date.parse(item?.dateTime));
    const parsedDate = `${dateObj.toLocaleDateString()}, ${dateObj.toLocaleTimeString()}`

    const handlePress = () => {
        if (connectycubeConnected) {
            setRemoteUser(item.fromUser);
            setVideoScreen(true);
            setOverlay(false);
        } else {
            Alert.alert(
                'Not connected to the server',
                'Please wait for a minute If problem still exists please login again.',
            )
        }
    }

    return (
        <ListItem
            bottomDivider={true}
            onPress={handlePress}>
            <Avatar source={{uri: item?.fromUser?.profileImageUrl ?? Image.resolveAssetSource(UserAvatar).uri}}
                    size={58} rounded/>
            <ListItem.Content>
                <ListItem.Title style={{
                    fontSize: 18,
                    color: "#242134",
                    fontWeight: "bold",
                    textTransform: "capitalize"
                }}>{item?.fromUser?.name}</ListItem.Title>
                <ListItem.Subtitle style={{
                    fontSize: 14,
                    color: "#A490E0"
                }}>{parsedDate}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon name={"phone"} reverseColor={"#42BC1F"} color={"white"} reverse={true}
                  size={25}
                  iconStyle={{fontSize: 35}}
                  containerStyle={{borderColor: "#70707080", borderWidth: 1}}/>
        </ListItem>
    )
}

export default CallbackRequests;
