import React from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import Constants from "expo-constants";

export default function Loading() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.loadingShow}> 현재 로딩중입니다...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusbarHeight,
    backgroundColor: "#42275a",
  },
  loadingShow: {
    fontSize: 32,
  },
});
