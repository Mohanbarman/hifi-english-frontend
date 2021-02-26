import React from 'react';
import { ThemeProvider } from "./context/theme";
import { AuthProvider } from "./context/auth";
import Home from "./components/home";
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import ConnectyCube from "react-native-connectycube";
import config from "./src/config";
import { NetworkProvider } from "./context/networkProvider";
import { createDrawerNavigator } from "@react-navigation/drawer";

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}


const client = new ApolloClient({
  //uri: 'https://arcane-meadow-08383.herokuapp.com/graphql/',
  uri: 'http://192.168.1.13:8001/graphql/',
  // uri: "https://hifi-english-backend.herokuapp.com/graphql/",
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
  // cache: new InMemoryCache()
});

const Drawer = createDrawerNavigator();

const App = () => {
  ConnectyCube.init(...config);
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <NetworkProvider>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </NetworkProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
export default App;
