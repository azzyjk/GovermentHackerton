//This is an example code for Net Info//
import React, { Component } from "react";
//import react in our code.

import NetInfo from "@react-native-community/netinfo";
import { AppState, Text } from "react-native";

export default class App extends Component {
  state = {
    appState: AppState.currentState,
    test: "",
  };
  componentDidMount() {
    //To get the network state once
    NetInfo.fetch().then((state) => {
      this.setState({
        test: state.type,
      });
    });

    //Subscribe to network state updates
    // const unsubscribe = NetInfo.addEventListener((state) => {
    //   console.log(
    //     "Connection type: " +
    //       state.type +
    //       ", Is connected?: " +
    //       state.isConnected
    //   );
    // });

    //To Unsubscribe the network state update
    //unsubscribe();
  }
  render() {
    const { test } = this.state;
    if (test == "wifi") {
      console.log("wifi");
      return <Text style={{ marginTop: 30, padding: 20 }}>This is wifi.</Text>;
    } else {
      return (
        <Text style={{ marginTop: 30, padding: 20 }}>
          NetInfo Example. Please open debugger to see the log
        </Text>
      );
    }
  }
}
