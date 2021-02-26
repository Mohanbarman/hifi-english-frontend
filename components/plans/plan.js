/*
 * @author Gaurav Kumar
 */

import React, {useContext, useEffect} from "react";
import {Avatar, Header, Icon, Button} from "react-native-elements";
import {Text, View, StyleSheet, SafeAreaView, Alert, ActivityIndicator} from "react-native";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import {ThemeContext} from "../../context/theme";
import {gql, useMutation, useQuery} from "@apollo/client";
import RazorpayCheckout from 'react-native-razorpay';
import {AuthContext} from "../../context/auth";

const styles = StyleSheet.create({
    container: {
        height: "100%"
    },
    planWrapper: {
        paddingBottom: 54,
        paddingLeft: 35,
        paddingRight: 35,
        borderBottomLeftRadius: 45,
        borderBottomRightRadius: 45,
        marginBottom: 15
    },
    planTitle: {
        fontSize: 24,
        color: "white",
        textAlign: "center"
    },
    planDescription: {
        fontSize: 16,
        color: "#FFFFFF",
        textAlign: "center"
    },
    planDetailsWrapper: {
        borderRadius: 45,
        backgroundColor: "white",
        flexDirection: "row",
        borderColor: "#D8CEF780",
        borderWidth: 2,
        padding: 20,
        margin: 15,
        alignItems: "center"
    },
    sessions: {
        fontSize: 17,
        fontWeight: "bold",
        marginBottom: 6
    },
    amount: {
        fontSize: 14
    },
    crossedAmount: {
        fontSize: 13,
        textDecorationLine: "line-through",
        color: "#707070",
        paddingLeft: 10
    },
    upgradeBtn: {
        fontSize: 22,
        fontWeight: "500",
        borderRadius: 28,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        width: 275,
        marginTop: 30,
        marginLeft: "auto",
        marginRight: "auto",
    },
    footerText: {
        fontSize: 15,
        color: "#707070",
        textAlign: "center",
        marginTop: "auto",
        padding: 20
    },
    validitySessionsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 30,
    },
    validitySessionsText: {
        fontSize: 18,
        color: 'white',
    },
    activityIndicatorContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const SUBSCRIPTION = gql`
    query SUBSCRIPTION($id:Int){
        subscriptions(id:$id){
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

const CREATE_ORDER = gql`
    mutation CREATE_ORDER($sub:String!){
        createOrder(subscriptionId: $sub){
            order{
                id
                orderId
                payload
                status
                subscription{
                    id
                    title
                    minutes
                    sessions
                    discountPrice
                    price
                    days
                }
                user{
                    id
                    name
                }
            }
        }
    }
`;

const VALIDATE_PAYMENT = gql`
    mutation VALIDATE_PAYMENT($orderId:String!, $paymentId:String!){
        verifyPayment(razorpayOrderId: $orderId,razorpayPaymentId: $paymentId){
            order{
                id
                orderId
                payload
                status
                subscription{
                    id
                    title
                    minutes
                    sessions
                    days
                    discountPrice
                    price
                }
                user{
                    id
                    name
                    subscription{
                        id
                        title
                        minutes
                        sessions
                        days
                        discountPrice
                        price
                    }
                    numberOfSessions
                    validityDate
                    email
                    gender
                    hobbies
                    languageKnown
                    dateJoined
                    city
                    state
                    level
                    phone
                    online
                    rating
                    profileImageUrl
                    profession
                    role
                }
            }
        }
    }
`;

const Plan = (props) => {
    let {theme, navigation, route} = props;
    let {colors} = useContext(ThemeContext);
    let {profile, setProfile, videoScreen} = useContext(AuthContext);
    const {data, loading: subscriptionLoading} = useQuery(SUBSCRIPTION, {variables: {id: route?.params?.planId}});
    const [create, {error, loading}] = useMutation(CREATE_ORDER);
    const [verify] = useMutation(VALIDATE_PAYMENT);

    const submitForm = () => {
        create({variables: {sub: data?.subscriptions?.objects?.[0]?.id}})
            .then(({data}) => {
                let {order} = data?.createOrder;
                const options = {
                    description: `${order?.subscription?.minutes} Mins Session`,
                    image: 'https://i.imgur.com/3g7nmJC.png',
                    currency: 'INR',
                    key: 'rzp_test_cDLgx70s11wLYN',
                    amount: order?.subscription?.discountPrice * 100,
                    name: order?.subscription?.title,
                    order_id: order?.orderId,
                    prefill: {
                        email: profile?.email,
                        contact: profile?.phone,
                        name: profile?.name
                    },
                    theme: {color: colors?.primary}
                }
                RazorpayCheckout.open(options).then((data) => {
                    // handle success

                    // Alert.alert('Success', `${data?.razorpay_payment_id}`);
                    verify({variables: {orderId: order?.orderId, paymentId: data?.razorpay_payment_id}})
                        .then(d => {
                            console.log(d);
                            setProfile(d?.data?.verifyPayment?.order?.user);
                        })
                        .catch(e => {
                            console.log(e);
                        })
                }).catch((e) => {
                    // handle failure
                    console.log(e)
                    Alert.alert('Error', `${e?.error.description}`);
                });
            })
            .catch(e => {
                console.log(e);
                Alert.alert("Error", e?.message)
            })
    }

    useEffect(() => {
        if (videoScreen) {
            navigation.navigate("Call");
        }
    }, [videoScreen])

    return (
        <SafeAreaView style={{backgroundColor: "white"}}>
            {subscriptionLoading
                ? <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator size='large' color={colors.primary}/>
                </View>
                : <View style={styles.container}>
                    <View style={[styles.planWrapper, {backgroundColor: colors.primary}]}>
                        <Header
                            leftComponent={{
                                icon: 'navigate-before',
                                color: '#fff',
                                onPress: navigation.goBack
                            }}
                            backgroundColor={colors.primary}
                            containerStyle={{borderBottomWidth: 0, paddingLeft: 0, paddingRight: 0}}
                        />
                        <Text style={styles.planTitle}>{data?.subscriptions?.objects?.[0]?.title}</Text>
                        <Text style={styles.planDescription}>Learn English from experts straightaway from the
                            convenience of
                            your Home</Text>
                        <View style={styles.validitySessionsWrapper}>
                            <Text
                                style={styles.validitySessionsText}>{`Sessions : ${data?.subscriptions?.objects?.[0]?.sessions}`}</Text>
                            <Text
                                style={styles.validitySessionsText}>{`Validity : ${data?.subscriptions?.objects?.[0]?.days}`} Days</Text>
                        </View>
                    </View>
                    <View style={styles.planDetailsWrapper}>

                        <Icon name={"check"}
                              color={"#42BC1F"}
                              rounded
                              reverse
                              iconStyle={{fontSize: 30}}/>
                        <View style={{alignItems: "center", marginLeft: "auto", marginRight: "auto"}}>
                            <Text
                                style={[styles.sessions, {color: colors.primary}]}>{data?.subscriptions?.objects?.[0]?.minutes} Mins
                                Session</Text>
                            <Text
                                style={[styles.amount, {color: colors.primary}]}>Rs. {data?.subscriptions?.objects?.[0]?.discountPrice} &nbsp; &nbsp;
                                <Text style={styles.crossedAmount}>
                                    Rs. {data?.subscriptions?.objects?.[0]?.price}
                                </Text>
                            </Text>
                        </View>
                        <Avatar rounded
                                title={`${100 - Math.floor((data?.subscriptions?.objects?.[0]?.discountPrice / data?.subscriptions?.objects?.[0]?.price) * 100)}% off`}
                                containerStyle={{
                                    backgroundColor: colors.secondary,
                                    height: 70,
                                    width: 70,
                                    borderRadius: 35,
                                    padding: 10,
                                }}
                                titleStyle={{color: "white"}}
                                size={40}/>
                    </View>
                    {/* <View style={styles.planDetailsWrapper}>

                    <Icon name={"check"}
                          color={"#707070"}
                          rounded
                          reverse
                          iconStyle={{fontSize: 30}}/>
                    <View style={{alignItems: "center", marginLeft: "auto", marginRight: "auto"}}>
                        <Text style={[styles.sessions, {color: colors.primary}]}>30 Mins Session</Text>
                        <Text style={[styles.amount, {color: colors.primary}]}>Rs. 2440 &nbsp; &nbsp;
                            <Text style={styles.crossedAmount}>
                                Rs. 3000
                            </Text>
                        </Text>
                    </View>
                    <Avatar rounded title={"10% off"} containerStyle={{
                        backgroundColor: colors.secondary,
                        height: 70,
                        width: 70,
                        borderRadius: 35
                    }}
                            titleStyle={{color: "white"}}
                            size={40}/>
                </View>*/}
                    <Button title={"Upgrade Yourself"}
                            loading={loading}
                            buttonStyle={[styles.upgradeBtn, {backgroundColor: colors.secondary}]}
                            titleStyle={{color: "white", textTransform: "capitalize"}}
                            onPress={() => {
                                submitForm();
                            }}
                    />
                    <Text style={styles.footerText}>
                        NOTE: Everyday you can practice English with an English Expert during your batch
                        time.
                    </Text>
                </View>
            }

        </SafeAreaView>
    )
};

export default Plan;
