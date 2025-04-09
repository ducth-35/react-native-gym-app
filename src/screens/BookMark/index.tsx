import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const BookMarkScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is book mark screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
