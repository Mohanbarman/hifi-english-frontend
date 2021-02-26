/*
 * @author Gaurav Kumar
 */

import React, {useContext} from "react";
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import {Avatar, Icon, ListItem} from "react-native-elements";
import {ThemeContext} from "../../context/theme";
import {useNavigation} from "@react-navigation/core";
import {gql, useQuery} from "@apollo/client";

const SUBSCRIPTIONS = gql`
    query {
        subscriptions{
            page
            objects{
                id
                title
                price
                minutes
                days
                sessions
                discountPrice
            }
        }
    }
`;

const Subscriptions = ({colorScheme}) => {
    let {colors} = useContext(ThemeContext);
    const {data, loading, error} = useQuery(SUBSCRIPTIONS);
    return (
        <ScrollView>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomColor: "#D8CEF780",
                borderBottomWidth: 2,
                paddingBottom: 10,
                paddingTop: 10,
                paddingHorizontal: 30,
            }}>
                <Text style={{color: 'white', fontSize: 18}}>Plans</Text>
            </View>
            <View style={{borderRadius: 10, overflow: "hidden"}}>
                {loading
                    ? <ActivityIndicator style={{padding: 20}} size='large' color={colors.primary}/>
                    : data?.subscriptions?.objects?.map((item, key) => (
                        <PlanItem colorScheme={colorScheme} item={item} key={key}/>
                    ))}
            </View>
        </ScrollView>
    )
};

const PlanItem = ({item, colors, colorScheme}) => {
    let navigation = useNavigation();

    const style = StyleSheet.create({
        avatarContainer: {
            backgroundColor: colorScheme === 1 ? 'white' : "#959DAD",
        },
        avatarTitle: {
            color: colorScheme === 1 ? "#572bd8" : "white",
        },
        avatarSubtitle: {
            color: colorScheme === 1 ? 'white' : "#572CD8",
            fontWeight: "bold",
            fontSize: 14
        },
        avatarSecondarySubtitle: {
            fontSize: 12,
            color: colorScheme === 1 ? "#ececec" : "#A490E0",
        },
        listItemStyle: {
            justifyContent: "space-between",
            backgroundColor: colorScheme === 1 ? "transparent" : 'white',
            width: '100%',
            padding: 10,
            paddingHorizontal: 30,
        },
        listItemBubblesContainer: {
            flexDirection: "row",
            alignItems: "center",
            width: '100%',
            // backgroundColor: 'blue',
            display: 'flex',
            justifyContent: 'space-between',
        },
        listItemBubbleChild: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            // backgroundColor: 'yellow',
        }
    });

    return (
        <ListItem key={item.id}
                  bottomDivider={true}
                  containerStyle={[style.listItemStyle, item.minutes === 30 && colorScheme !== 1 ? {backgroundColor: '#eaeaea'} : {}]}
                  onPress={() => navigation.navigate("Plan", {planId: item?.id})}>
            <View style={style.listItemBubblesContainer}>
                <View style={style.listItemBubbleChild}>
                    <Avatar rounded title={item?.sessions?.toString()} containerStyle={style.avatarContainer}
                            titleStyle={style.avatarTitle}
                            size={40}/>
                    <Text style={{...style.avatarSubtitle, marginLeft: 10}}>Sessions</Text>
                </View>
                <View style={style.listItemBubbleChild}>
                    <Avatar rounded title={item?.days?.toString()}
                            containerStyle={style.avatarContainer}
                            titleStyle={style.avatarTitle}
                            size={40}/>
                    <View style={{marginLeft: 10}}>
                        <Text style={{...style.avatarSubtitle, marginLeft: 0}}>Days</Text>
                        <Text style={style.avatarSecondarySubtitle}>Validity</Text>
                    </View>

                </View>
                <View style={{...style.listItemBubbleChild, flexDirection: 'column'}}>
                    <Avatar
                        rounded title={item?.minutes?.toString()}
                        containerStyle={{...style.avatarContainer}}
                        titleStyle={style.avatarTitle}
                        size={35}/>
                    <Text style={style.avatarSecondarySubtitle}>Minutes</Text>
                </View>
                <Icon
                    name={"keyboard-arrow-right"} reverse
                    reverseColor={"white"}
                    size={16}
                    color={"#FF7D3B"}
                    style={{marginLeft: "auto"}}
                    iconStyle={{fontSize: 35}}/>
            </View>
        </ListItem>
    );
};

export default Subscriptions
