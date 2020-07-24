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
import axios from "axios";

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
      loading: true,
      longitude: 0,
      latitude: 0,
      outside: false,
      crtDustState: 0,
    };
  }

  _getCurrentDust = async () => {
    const { data } = await axios.get(`http://192.168.35.169/postDB`);
    this.setState({
      crtDustState: 1, // data[0]["condition"] 0: good 1: bad
    });
  };

  _checkOutside = (distance, outside) => {
    let moveDistance = 0; // 사용자가 이동한 거리
    if (distance > moveDistance && outside == false) return true; // outside : true
  };

  _getGapBetweenTwoNumber = (num1, num2) => {
    return Math.abs(num1 - num2);
  };

  _getLocation = async () => {
    const { latitude, longitude, outside } = this.state;
    let lat = latitude;
    let lon = longitude;
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();

      if (lat != 0) {
        let gapLat = this._getGapBetweenTwoNumber(lat, latitude);
        let gapLon = this._getGapBetweenTwoNumber(lon, longitude);
        gapLat = gapLat / 0.000008726;
        gapLon = gapLon / 0.00001136364;
        let distance = Math.sqrt(Math.pow(gapLat, 2) + Math.pow(gapLon, 2));
        console.log(distance);
        // 위도 기준 100m : 0.0008726
        // 경도 기준 100m : 0.001136364
        if ((distance, outside)) {
          // this._pushNotification();
        }
      }
      this.setState({
        latitude: latitude,
        longitude: longitude,
        loading: true,
      });
    } catch (error) {}
  };

  _getNetInfo = () => {
    let userNet = "";
    NetInfo.fetch().then((state) => {
      userNet = state.type;
      if (userNet == "wifi") {
        this.setState({
          outside: false,
          netType: userNet,
        });
      } else {
        this.setState({
          outside: true,
          netType: userNet,
        });
      }
    });
  };

  _pushNotification = () => {
    const titles = ["오늘은 미세먼지가 나쁜 날이에요!"];
    const messages = [
      "호흡기가 아야해요~",
      "마스크는 잘 착용하셨나요?",
      "집에 빨리 돌아가는게 좋을 것 같아요!",
      "미세먼지가 나쁜날엔 물을 많이 마셔야해요",
      "손은 꼭 잘 씻어야 해요",
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
    this._getCurrentDust();
    setInterval(() => {
      this._getLocation();
      this._getNetInfo();
    }, 3000);
    this._listenForNotifications();
  }

  render() {
    const { netType, loading, outside } = this.state;
    if (loading == false) {
      return <Loading />;
    } else {
      if (!outside) {
        return (
          <View style={styles.container}>
            <Text style={styles.showData}>현재 밖이 아니시군요!</Text>
          </View>
        );
      } else {
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
