import { View, Text } from 'react-native'
import React from 'react'
import RNEzetapSdk from 'react-native-ezetap-sdk';

 export  async function intialize(unm,key,mecname,appmode){
    var withAppKey = '{"userName":' +
    unm+
    ',"prodAppKey":'+key+',"merchantName":'+mecname+',"appMode":'+appmode+',"currencyCode":"INR","captureSignature":false,"prepareDevice":false}';
     await RNEzetapSdk.initialize(withAppKey);
     var test= await RNEzetapSdk.prepareDevice();
    return test.toString();
 }

 export  function test(){
    alert("working properly");
 }
