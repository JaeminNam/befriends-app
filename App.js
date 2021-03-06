import React,{useState, useEffect} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { AsyncStorage } from 'react-native';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import ApolloClient from "apollo-boost";
import options from './apollo';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from "styled-components";
import styles from "./styles";
import NavController from './components/NavController';
import { AuthProvider } from './AuthContext';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
    'Warning: componentWillMount has been renamed, and is not recommended for use. See https://fb.me/react-async-component-lifecycle-hooks for details.',
    'Warning: componentWillReceiveProps has been renamed, and is not recommended for use. See https://fb.me/react-async-component-lifecycle-hooks for details.',
]);

export default function App() {
  const [loaded, setLoaded ]=useState(false);
  const [client, setClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const preLoad = async () => {
    try{
      await Font.loadAsync({
        ...Ionicons.font,
      });
      await Asset.loadAsync(require("./assets/logo.png"));
      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: AsyncStorage,
      });
      const client = new ApolloClient({
        cache,
        request: async operation => {
          const token = await AsyncStorage.getItem("jwt");
          return operation.setContext({headers:{Authorization: `Bearer ${token}`}});
        },
        ...options
      }); 
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (!isLoggedIn || isLoggedIn === "false") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      setLoaded(true);
      setClient(client);
    }catch(e){
      console.log(e);
    }
  };
  
  useEffect(() => {
    preLoad();
  },[]);

  return loaded && client  ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
        <AuthProvider isLoggedIn={isLoggedIn}>
          <NavController/>
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  ) : (
    <AppLoading/>
  );
}