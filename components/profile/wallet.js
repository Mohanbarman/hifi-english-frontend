/*
 * @author Gaurav Kumar
 */

import React, {useContext, useEffect} from "react";
import {Header} from "react-native-elements";
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";


import LastCallList from "./last-calls";
import {ThemeContext} from "../../context/theme";
import {AuthContext} from "../../context/auth";
import {gql, useQuery} from "@apollo/client";

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
    flexDirection: "row",
    alignItems: "center"
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
  }
});


const VIEWER = gql`
    query VIEWER {
        viewer {
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
            callDuration
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
`


const Wallet = (props) => {
  let { navigation } = props;
  let { colors } = useContext(ThemeContext);
  // const {profile, setProfile} = useContext(AuthContext);
  const { data, refetch } = useQuery(VIEWER, { nextFetchPolicy: "network-only" });
  const { videoScreen } = useContext(AuthContext);
  // console.log(data)
  //   useEffect(()=>{
  //       refetch();
  //   });
  useEffect(() => {
    if (videoScreen) {
      navigation.navigate("Call");
    }
  }, [videoScreen])
  return (
    <SafeAreaView style={{ backgroundColor: "white" , height: '100%'}}>
      {/*<ScrollView style={{ height: "100%" }}>*/}
        <View style={[styles.profileWrapper, { backgroundColor: colors.primary }]}>
          {/*<View style={{justifyContent: "space-between", flexDirection: "row", marginTop: 26}}>*/}
          {/*    <Icon name={"menu"} color={"white"}/>*/}
          {/*    <Icon name={"notifications-none"} color={"white"}/>*/}
          {/*</View>*/}
          <Header
            leftComponent={{ icon: 'navigate-before', color: '#fff', onPress: () => navigation.goBack() }}
            // rightComponent={{ icon: 'notifications-none', color: '#fff' }}
            backgroundColor={colors.primary}
            containerStyle={{ borderBottomWidth: 0, paddingLeft: 0, paddingRight: 0 }}
          />
          <Text style={{ fontSize: 26, color: "white", textAlign: "center" }}>My Wallet</Text>
          <Text style={{ color: colors.secondary, textAlign: "center", fontSize: 16, marginTop: 40 }}>Total Earnings</Text>
          <Text style={{ color: "white", textAlign: "center", fontSize: 45 }}>
            Rs. {data ? (data?.viewer?.callDuration / 60 * 3).toFixed(2) : 'Loading ...'}
          </Text>
          <Text style={{ color: colors.secondary, fontSize: 22, marginTop: 25 }}>
            Total Minutes : <Text style={{ color: "white" }}>{(data?.viewer?.callDuration / 60).toFixed(2)}</Text>
          </Text>
          <Text style={{ color: colors.secondary, fontSize: 22 }}>
            Balance <Text style={{ color: "white" }}>Rs. {(data?.viewer?.callDuration / 60 * 3).toFixed(2)}</Text>
          </Text>
        </View>
        <LastCallList />
      {/*</ScrollView>*/}
    </SafeAreaView>
  );
};

export default Wallet;
