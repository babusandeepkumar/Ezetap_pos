import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect} from 'react'
import RNEzetapSdk from 'react-native-ezetap-sdk';
const App = () => {

  useEffect(()=>{
    const handleAppKeyPress = async () => {
      var withAppKey =
        '{"userName":' +
        "1035576469" +
        ',"prodAppKey":"066faa4c-9d24-4232-858a-f3e2fb1ee65a","merchantName":"COMMISSIONER_VIJAYAWADA_M","appMode":"PROD","currencyCode":"INR","captureSignature":false,"prepareDevice":false}';
      var response = await RNEzetapSdk.initialize(withAppKey);
      await RNEzetapSdk.prepareDevice();
      var userName = "1035576469";

      var genericPay =
        '{"userName":' +
        userName +
        ',"amount":' +
        "1" +
        ',"options":{"references":{"reference2":"citizen name","reference3":month"},"customer":{"name":' +
        "harish" +
        ',"email":"harish@gmail.com","Wscode":"21003219"},"amountTip":"0"}}';
      var res = await RNEzetapSdk.pay(genericPay);
      console.log(res);
      var sendReceiptJson = {
        "customerName": "harish",
        "mobileNo": "1234567890",
        "email": "sandeep2siripurapu@gmail.com",
        "txnId": "230602114024654E010069054"
      };
      
    var response = await RNEzetapSdk.sendReceipt(JSON.stringify(sendReceiptJson));
    console.log(response);
    };
    handleAppKeyPress();
  },[]);




  return (
    <View>
      <Text>App</Text>
    </View>
  )
}

export default App

const styles = StyleSheet.create({})