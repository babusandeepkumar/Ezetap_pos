import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Offline = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#FF0000' }]}>
      <Text style={[styles.text,{textAlign:'center',color:'white'}]}>You are Offline</Text>
    </View>
  )
}

export default Offline

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
      text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
})