import NetInfo from "@react-native-community/netinfo";
import React, { useState } from "react";

export const NetworkContext = React.createContext();

export const NetworkProvider = (props) => {
    const [isInternetConnected, setIsInternetConnected] = useState(true);

    NetInfo.addEventListener(state => {
        if (isInternetConnected !== state.isInternetReachable) {
            setIsInternetConnected(state.isInternetReachable)
        }
    });

    return <NetworkContext.Provider value={{ isInternetConnected }} {...props} />
}