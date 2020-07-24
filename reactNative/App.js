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
import Loading from "./Loading";
import * as Location from "expo-location";

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
      netType: "",
      loading: false,
      longitude: 0,
      latitude: 0,
    };
  }
  _getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      this.setState({
        latitude: latitude,
        longitude: longitude,
        loading: true,
      });
    } catch (error) {}
  };

  _getNetInfo = () => {
    NetInfo.fetch().then((state) => {
      this.setState({
        netType: state.type,
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
      body: message,
      data: { title: title, message: message },
      android: {
        sound: true,
        title: title,
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
    setTimeout(() => {
      this._getNetInfo();
      this._getLocation();
    }, 2000);
    this._listenForNotifications();
  }

  render() {
    const { netType, loading } = this.state;
    if (loading == false) {
      return <Loading />;
    } else {
      if (netType == "wifi") {
        return (
          <View style={styles.container}>
            <Text style={styles.showData}>현재 밖이 아니시군요!</Text>
          </View>
        );
      } else {
        this._handleButtonPress();
        return (
          <View style={styles.container}>
            <Text style={styles.showData}>지금 밖이시군요!</Text>
          </View>
        );
      }
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
  showData: {
    fontSize: 50,
    // flex: 1,
    // alignItems: "center",
    // alignContent: "center",
    // justifyContent: "center",
  },
});
