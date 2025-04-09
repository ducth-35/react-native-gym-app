import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const DiscoverScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is discover screen</Text>
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
