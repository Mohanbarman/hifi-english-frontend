/*
 * @author Gaurav Kumar
 */

import React, {useContext, useEffect, useState} from "react";
import {ActivityIndicator, FlatList, Text, View} from "react-native";
import {Avatar, Button, Image, ListItem} from "react-native-elements";
import UserAvatar from "../../assets/images/useravatar.png";
import {ThemeContext} from "../../context/theme";
import {gql, useLazyQuery, useQuery} from "@apollo/client";
import {AuthContext} from "../../context/auth";

const CALL_LOGS = gql`
    query CALL_LOGS($page:Int, $pageSize:Int) {
        calls(page: $page, pageSize: $pageSize) {
            page
            hasNext
            objects {
                fromUser {
                    name
                    id
                    email
                    profileImageUrl
                }
                toUser {
                    name
                    id
                    email
                    profileImageUrl
                }
                dateTime
                minutes
            }
        }
    }
`

const LastCallList = (props) => {
    const {theme} = props;
    const {colors} = useContext(ThemeContext);
    const {profile} = useContext(AuthContext);
    const [getCalls, {loading, data}] = useLazyQuery(CALL_LOGS);
    const [refreshing, setRefreshing] = useState(false);
    const [calls, setCalls] = useState(undefined);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isNextLoading, setIsNextLoading] = useState(false);

    useEffect(() => {
        getCalls({variables: {page: 1, pageSize: 10}});
    }, [])

    useEffect(() => {
        if (data && refreshing) {
            setCalls(data?.calls?.objects);
            setPage(data?.calls?.page);
            setHasNextPage(data?.calls?.hasNext);
            setRefreshing(false);
            setIsNextLoading(false);
        } else if (data && isNextLoading) {
            setCalls(p => [...p, ...data?.calls?.objects]);
            setPage(data?.calls?.page);
            setHasNextPage(data?.calls?.hasNext);
            setIsNextLoading(false);
        } else if (data) {
            setCalls(data?.calls?.objects);
            setPage(data?.calls?.page);
            setHasNextPage(data?.calls?.hasNext);
        }
    }, [data, loading])

    const handleEndReached = () => {
        if (hasNextPage) {
            setIsNextLoading(true);
            getCalls({variables: {page: page + 1, pageSize: 10}});
        }
    }

    const handleRefresh = () => {
        setRefreshing(true);
        getCalls({variables: {page: 1, pageSize: 10}});
    }

    return (
        <>
            <View style={{paddingLeft: 20, paddingRight: 20}}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingLeft: 10,
                    alignItems: "center",
                    borderBottomColor: "#D8CEF780",
                    borderBottomWidth: 1,
                    paddingBottom: 10,
                    paddingTop: 10
                }}>
                    <Text style={{color: colors.secondary, fontSize: 18, paddingVertical: 10}}>Last Calls</Text>
                </View>
            </View>
            {loading && !isNextLoading && !refreshing
                ? <ActivityIndicator style={{padding: 20}} size='large' color={colors.primary}/>
                : <FlatList
                    onRefresh={handleRefresh}
                    data={calls}
                    style={{alignSelf: 'stretch', paddingHorizontal: 20}}
                    refreshing={refreshing}
                    renderItem={(item, theme) => LastCall({item, theme, profile})}
                    keyExtractor={item => item?.dateTime}
                    onEndReachedThreshold={0.1}
                    onEndReached={handleEndReached}
                    ListFooterComponent={hasNextPage
                        ? <ActivityIndicator style={{padding: 10}} size='large' color={colors.primary}/>
                        : <Text style={{textAlign: 'center', padding: 10, color: 'black', fontWeight: '500'}}>No more logs</Text>
                    }
                />
            }
        </>
    )
};

const LastCall = ({item, theme, profile}) => {
    const dateObj = new Date(Date.parse(item?.item?.dateTime));
    const parsedDate = `${dateObj.toLocaleDateString()}, ${dateObj.toLocaleTimeString()}`
    let correspondingUser;

    // Finding corresponding user using account id
    if (item?.item?.fromUser?.id === profile?.id) {
        correspondingUser = item?.item?.toUser;
    } else if (item?.item?.fromUser?.id !== profile?.id) {
        correspondingUser = item?.item?.fromUser;
    }

    return (
        <ListItem>
            <Avatar source={{uri: correspondingUser?.profileImageUrl ?? Image.resolveAssetSource(UserAvatar).uri}}
                    size={58} containerStyle={{borderRadius: 58}} avatarStyle={{borderRadius: 58}}/>
            <ListItem.Content>
                <ListItem.Title style={{fontSize: 18, color: "#242134", fontWeight: "bold"}}>
                    {correspondingUser?.name}
                </ListItem.Title>
                <ListItem.Subtitle style={{fontSize: 14, color: "#A490E0"}}>
                    {parsedDate}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Title right>
                {item?.item?.minutes >= 60 ?
                    `${Math.floor(item?.item?.minutes / 60)} min`
                    : `${item?.item?.minutes} sec`
                }
            </ListItem.Title>
        </ListItem>
    );
};

export default LastCallList;
