import { Box, Center, Button, Input, Icon, Text, View } from "native-base";
import { useState, useEffect } from "react";
import { TextInput, StyleSheet, TouchableOpacity } from "react-native";

export default () => {
  return (
    <View style={styles.Root}>
      <Text style={styles.Text}>No Data</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  Root: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  Text: {
    fontWeight: "500",
    fontSize: 20,
  },
});
