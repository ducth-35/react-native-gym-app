import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const DetailsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is details screen</Text>
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
