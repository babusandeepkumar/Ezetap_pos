import { StyleSheet, Text, View, Image, Dimensions, TextInput, ToastAndroid, ScrollView } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import Config from '../assets/Config.json';
import FastImage from 'react-native-fast-image';
import { useNetInfo } from '@react-native-community/netinfo';
import Offline from './Offline';
import RNEzetapSdk from 'react-native-ezetap-sdk';
import { Button } from 'react-native-paper';
import Logs from './Logs';
const Home = ({navigation}) => {

  const showToast = (txt) => {
    ToastAndroid.show(txt, ToastAndroid.LONG);
  };
 
  function getall(){
    inputRef.current?.blur();
    if(ws!=''){
    setsub(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "wscode": ws
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };
   // console.log(Config.login_url+"valPos", requestOptions)
    fetch( Config.login_url+"valPos", requestOptions)
      .then(response => response.json())
      .then(async(result) => {
    
       if(result.statusCode=="200"){
        var json = {
          "prodAppKey": result.appKey,
          "demoAppKey": result.appKey,
          "merchantName": result.merchantName,
          "userName": result.userName,
          "currencyCode": 'INR',
          "appMode": result.appMode,
          "captureSignature": 'true',
          "prepareDevice": 'true',
          "captureReceipt": 'false'
        };
    var res= await RNEzetapSdk.initialize(JSON.stringify(json));
   var geteze=JSON.parse(res);
   if(geteze.status=="success"){
   
    const did=geteze.result.device.serialNumber;
   //const did="1490917904";
   const sen={"did":did,"wscode":ws};
   var myHeaders1 = new Headers();
   myHeaders1.append("Content-Type", "application/json");
   var requestOptions1 = {
     method: 'POST',
     headers: myHeaders1,
     body: JSON.stringify(sen)
   };
   fetch( Config.login_url+"valPosLogin", requestOptions1)
     .then(response => response.json())
     .then((data)=>{
      setsub(false);
      Logs.firsttime(did,ws);
      Logs.appendLogToFile("api  :- valPosLogin working fine")
      navigation.navigate("Select",{"data":data,did:did,"uname":result.userName});
     }).catch(error=>{console.log("No Records found in this wscode and did"); setsub(false); 
     showToast('error occures : "No Records found in this wscode and did'); 
     Logs.appendLogToFile("api  :- valPosLogin error No Records found in this wscode and did")})
   }else{
    showToast(geteze.error.message);
    setsub(false);
    Logs.appendLogToFile("ezetap sdk initialize error :-"+JSON.stringify(geteze))
   }
  
    }else{
     alert("invalid ws code");
     setsub(false);
     Logs.appendLogToFile("invalid ws code")
    }
    
    })
      .catch(error => {
        console.log(error)
        setsub(false);
        showToast('No records found in this WS Code ....');
        Logs.appendLogToFile("No records found in this ws code");
    });
   
    }else{
        alert("please enter ws code");
    }
   
  }
  const info=useNetInfo();
  const inputRef = useRef(null);
  const [issub,setsub]=useState(false);
    const [ws,setws]=useState('');

    const handlewscode = (text) => {
        const trimmedText = text.trim();
        if (trimmedText.includes(' ')) {
          return;
        }
        setws(trimmedText);
        };

        

  return (
<View>
   
        <View style={styles.image2}>
         <FastImage
        style={styles.header}
        source={{
            uri: 'https://allvy.com/CLAP_Mobile/bb.png',
            priority: FastImage.priority.high,
            cache:FastImage.cacheControl.immutable
        }}
        resizeMode={FastImage.resizeMode.stretch}
    />
            </View>
            <Image  source={require('../assets/splogo.png')} resizeMode={'cover'} style={styles.image1}/>
      <Image  source={require('../assets/bgp.png')} resizeMode={'cover'} style={styles.image}/>
    <View style={styles.text}>
   
    
     
      <View style={styles.gen}>
        <Text style={{padding:2,margin:10,marginTop:10,color:'black'}}>Enter Ward Secretariat Code</Text>
        <TextInput onChangeText={handlewscode}
        value={ws}
        style={[styles.inp]}
        placeholder="Enter here ..."
        ref={inputRef}
        keyboardType='numeric'
        maxLength={8}
      >
            
        </TextInput>
      </View>
   
     <View  style={styles.gen}>
     <Button  mode="contained" style={styles.btn} onPress={() => getall()} disabled={!info?.isConnected}>
         Get Data
     </Button>
     </View>
     
    </View>
  
    <Spinner
          visible={issub}
          textContent={'Loading...'}
         textStyle={styles.spinnerTextStyle}
         style={{marginTop:30}}
        />
        
    {!info?.isConnected ? <Offline/>: ''
   
        }
   </View>
  )
}

export default Home

const styles = StyleSheet.create({
    spldrop:(schem)=>({
      backgroundColor:"transparent",
      borderWidth:1,
      borderColor:"#777",
      zIndex:10,
      borderRadius:10,
     // color:(schem==='dark')?'white':'black',
     color:"red"
    }),
    card:{
     padding:10,
    //  width:'110%'
    },
    btn:{
        width:"100%",
        padding:5,
        marginTop:10,
        backgroundColor:"#6082B6",
        borderRadius:0,
        fontSize:30,
        borderRadius:10,
      
        },
       header:{
          width:Dimensions.get("window").width,
          height:Dimensions.get("window").height/3.5,
          borderBottomLeftRadius:20,
          borderBottomRightRadius:20,
       },
      text:{
            width:'80%',
            marginLeft:'10%',
      },
    inp:{
        borderWidth:1,
        borderColor:"#777",
        borderRadius:10,
        paddingLeft:20,
        marginTop:5
    },
    gen:{
    margin:5,
    marginTop:20
    },
    image:{
        bottom:10,
        marginTop:200,
       width:Dimensions.get('window').width,
       position:'absolute',
       justifyContent:'center',
       alignItems:'center',
       opacity:0.1
        },
        image1:{
          marginTop:Dimensions.get('window').height/3,
          margin:Dimensions.get('window').width/4,
          position:'absolute',
          justifyContent:'center',
          alignItems:'center',
          opacity:0.1
          },
         
})