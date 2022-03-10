import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Dashboard(){
  return (
    <View style={styles.container}>
        <Text style={styles.text}>
            Dashboard
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  text:{
      fontSize: 50,
      color: 'blue'
  },
});