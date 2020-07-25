import React, { Component } from "react";
import {
  View,
  StyleSheet,
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
      loading: false,
      longitude: 0,
      latitude: 0,
      isOutside: false,
      crtDustState: 0,
      windowIsOpen: 0,
      isPushedWindowAlarm: 0,
      isPushedDustAlarm: 0,
    };
  }

  _getCurrentInfo = async () => {
    const { data } = await axios.get(`http://211.176.118.59/postDB`);
    this._getNetInfo();
    this.setState({
      crtDustState: data[0]["condition"], // 0: good 1: bad
      windowIsOpen: data[0]["isOpen"],
    });
  };

  _getDistance = (gapLat, gapLon) => {
    let latMeter = 0.000008726; // 위도 기준 1m : 0.000008726
    let lonMeter = 0.00001136364; // 경도 기준 1m : 0.00001136364

    gapLat = gapLat / latMeter;
    gapLon = gapLon / lonMeter;
    return Math.sqrt(Math.pow(gapLat, 2) + Math.pow(gapLon, 2));
  };

  _checkOutside = (distance, netType) => {
    let moveDistance = 0; // 사용자가 이동한 거리(얼마나 이동했을때 밖이라고 판단할지)
    if (distance > moveDistance && netType != "wifi") {
      // netType != "wifi"

      this.setState({
        isOutside: true,
        loading: true,
      });
    }
  };

  _getGapBetweenTwoNumber = (num1, num2) => {
    return Math.abs(num1 - num2);
  };

  _getFirstLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();

      this._getCurrentInfo();

      this.setState({
        latitude: latitude,
        longitude: longitude,
      });
    } catch (error) {}
  };

  _getLocation = async () => {
    const { latitude, longitude, netType } = this.state;
    let lat = latitude;
    let lon = longitude;

    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();

      let gapLat = this._getGapBetweenTwoNumber(lat, latitude);
      let gapLon = this._getGapBetweenTwoNumber(lon, longitude);
      let distance = this._getDistance(gapLat, gapLon);
      this._checkOutside(distance, netType);

      this.setState({
        latitude: latitude,
        longitude: longitude,
      });
    } catch (error) {}
  };

  _getNetInfo = () => {
    NetInfo.fetch().then((state) => {
      this.setState({
        netType: state.type,
        // loading: true,
      });
    });
  };

  _stateChangeWindowAlarm = () => {
    this.setState({
      isPushedWindowAlarm: 1,
    });
  };

  _pushNotification = (notiType, delayTime) => {
    const titles = ["오늘은 미세먼지가 나쁜 날이에요!"];
    const messages = {
      dust: [
        "호흡기가 아야해요~",
        "마스크는 잘 착용하셨나요?",
        "집에 빨리 돌아가는게 좋을 것 같아요!",
        "외출을 자제하시는게 좋을 것 같아요!",
        "손은 꼭 잘 씻어야 해요",
      ],
      water: ["물은 많이 드셨나요?", "물을 많이 마시면 미세먼지 완화에 좋아요"],
      window: [
        "미세먼지가 나쁜 날엔 창문을 닫는 것이 좋아요!",
        "지금 창문이 열려있어서 미세먼지들이 들어오고 있어요!",
      ],
    };
    const message =
      messages[notiType][Math.floor(Math.random() * messages[notiType].length)];
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
    let sendAfterFewSeconds = Date.now();
    sendAfterFewSeconds += delayTime * 1000;

    const schedulingOptions = { time: sendAfterFewSeconds };

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

  _windowPushNotification = () => {
    const { windowIsOpen, isPushedWindowAlarm } = this.state;
    if ((isPushedWindowAlarm == 0) & (windowIsOpen == 1)) {
      this._pushNotification("window", 15);
      this.setState({
        isPushedWindowAlarm: 1,
      });
    }
  };

  _dustPushNotification = () => {
    const { crtDustState, isPushedDustAlarm } = this.state;
    if (crtDustState == 1 && isPushedDustAlarm == 0) {
      this._pushNotification("dust", 10);
      this._pushNotification("dust", 50);

      this.setState({
        isPushedDustAlarm: 1,
      });
      setTimeout(() => {
        this.setState({
          isPushedDustAlarm: 0,
        });
      }, 180 * 1000);
    }
  };

  componentDidMount() {
    _getiOSNotificationPermission();

    this._getFirstLocation();

    setInterval(() => {
      this._getLocation();
      this._getNetInfo();
      this._getCurrentInfo();
    }, 3 * 1000);

    setTimeout(() => {
      setInterval(() => {
        this._windowPushNotification();
        this._dustPushNotification(1);
      }, 3 * 1000);
    }, 5 * 1000);

    setInterval(() => {
      this._pushNotification("water", 1);
    }, 1800 * 1000); //1800

    this._listenForNotifications();
  }

  render() {
    const { loading, isOutside } = this.state;

    if (isOutside) {
      return (
        <View style={styles.container}>
          <Text style={styles.showData}>지금 밖이시군요!</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.showData}>현재 밖이 아니시군요!</Text>
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
  showData: {
    fontSize: 50,
    // flex: 1,
    // alignItems: "center",
    // alignContent: "center",
    // justifyContent: "center",
  },
});
