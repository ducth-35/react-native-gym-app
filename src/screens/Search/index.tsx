import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is search screen</Text>
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
