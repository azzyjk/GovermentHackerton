import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Button,
  Alert,
  Platform,
  AppState,
  Text,
} from "react-native";
import { Notifications } from "expo";
import NetInfo from "@react-native-community/netinfo";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

async function _getiOSNotificationPermission() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== "granted") {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      test: "",
    };
  }

  _getNetInfo = () => {
    NetInfo.fetch().then((state) => {
      this.setState({
        test: state.type,
      });
    });
  };

  _handleButtonPress = () => {
    const titles = ["오늘은 미세먼지가 나쁜 날이에요!"];
    const messages = [
      "test111111111",
      "test2222222222",
      "test3333333333",
      "test4444444444",
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];

    // push notification의 설정 및 정보
    const localnotification = {
      title: title,
      body: message,
      data: { title: title, message: message },
      android: {
        sound: true,
      },
      ios: {
        sound: true,
      },
    };

    // push notification을 보낼 시간
    let sendAfterFiveSeconds = Date.now();
    sendAfterFiveSeconds += 5 * 1000;

    const schedulingOptions = { time: sendAfterFiveSeconds };

    // push notification 보내기
    Notifications.scheduleLocalNotificationAsync(
      localnotification,
      schedulingOptions
    );
  };

  _listenForNotifications = () => {
    Notifications.addListener((notification) => {
      if (notification.origin === "received" && Platform.OS === "ios") {
        Alert.alert(notification.data.title, notification.data.message);
      }
    });
  };

  componentDidMount() {
    _getiOSNotificationPermission();
    this._getNetInfo();
    this._listenForNotifications();
  }

  render() {
    const { test } = this.state;
    console.log("test는 ");
    console.log(test);
    if (test == "wifi") {
      return <Text style={{ marginTop: 30, padding: 20 }}>This is wifi.</Text>;
    } else {
      return (
        <View style={styles.container}>
          <Text style={{ marginTop: 30, padding: 20 }}>
            NetInfo Example. Please open debugger to see the log
          </Text>
          <Button
            title="Send a notification in 5 seconds!"
            onPress={this._handleButtonPress}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusbarHeight,
    backgroundColor: "#ecf0f1",
  },
});
