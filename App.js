import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { css } from './assets/css'

export default function App() {
  return (
    <View style={css.container}>
      <View style={css.map}></View>
      <View style={css.search}></View>
    </View>
  );
}
