import { StyleSheet, View,TextInput,Text, ScrollView, Dimensions,Image,KeyboardAvoidingView, ToastAndroid } from 'react-native'
import React, { useState,useEffect,useMemo } from 'react'
import { Button,Dialog, Portal,Provider,Modal  } from 'react-native-paper'
import { LogBox } from 'react-native';
import FastImage from 'react-native-fast-image'
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNetInfo } from '@react-native-community/netinfo';
import Offline from './Offline';
import Logs from './Logs';

const {width} = Dimensions.get('window');
const frameWidth = width;
import Config from '../assets/Config.json'
LogBox.ignoreLogs(['Warning: Each child in a list should have a unique "key" prop']);

export const Getdata = ({route,navigation}) => {
const [visible,setvisible]=useState(false);
const [clid,setclid]=useState('');
const [cluster,setcluster]=useState([]);
const data=route.params.data;
const did=route.params.did;
const uname=route.params.uname;
const showToast = (txt) => {
  ToastAndroid.show(txt, ToastAndroid.LONG);
};
useEffect(() => {
  const arr = data.cDetails.map(res => ({
    label: res,
    value: res
  }));
  setcluster(arr);
}, [data.cDetails]);
const [type, settype] = useState('Commercial');
const[phno,setphno]=useState('');
const radioButtons = useMemo(() => ([
  {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Commercial',
      value: 'Commercial'
  },
  {
      id: '2',
      label: 'Residential',
      value: 'Residential'
  }
]), []);

const handleTextChange = (text) => {
  const trimmedText = text.trim();
  if (trimmedText.includes(' ')) {
    return;
  }
  setphno(trimmedText);
};
const isvalid=clid !='' && phno !='' ;
const info=useNetInfo();
async function getall(){
  setvisible(true);
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "clusterId": clid,
  "phone": phno,
  "secretariatCode":data.secretariatCode,
  "typeOfuserCharge": type,
  "ulbName": data.ulbName
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};
fetch(Config.login_url+"getUserData", requestOptions)
  .then(response => response.json())
  .then(result =>{
   
    setvisible(false);
  
    if(result.statusCode=="404"){
     showToast("No Data found in this record....")
     Logs.appendLogToFile("api :- getUserData error "+JSON.stringify(result));
    }else{
      setphno('')
      Logs.appendLogToFile("api :- getUserData working fine");
      navigation.navigate("Final",{"data":data,sub:result,type:type,cluster:clid,did:did,uname:uname});
    }

  })
  .catch(error =>{console.log('error', error); setvisible(false); Logs.appendLogToFile("api :- getUserData error "+JSON.stringify(error));} );
}
   return (
   
     <View>
        <ScrollView >
       <Spinner
          visible={visible}
          textContent={'Loading...'}
         textStyle={styles.spinnerTextStyle}
         style={{marginTop:30}}
        />
     <FastImage
        style={styles.header}
        source={{
            uri: 'https://allvy.com/CLAP_Mobile/bb.png',
            priority: FastImage.priority.high,
            cache:FastImage.cacheControl.immutable
        }}
        resizeMode={FastImage.resizeMode.stretch}
    />
           <Image  source={require('../assets/splogo.png')} resizeMode={'cover'} style={styles.image1}/>
           <Image  source={require('../assets/bgp.png')} resizeMode={'cover'} style={styles.image}/>
         
    
    <View style={styles.container}>
       <View style={styles.title}>
        <Text style={styles.inptitle}>Name of the District </Text>
       </View>
       <View style={styles.box}>
        <Text 
       style={styles.inp}
       >{data.distName}{data.ulbName}</Text>
       </View>
    
       <View style={styles.title}>
        <Text style={styles.inptitle}>Name of the ULB</Text>
       </View>
       <View style={styles.box}>
        <Text 
       style={styles.inp}
       >{data.mandalName}{data.districtName}</Text>
       </View>
 
       <View style={styles.title}>
        <Text style={styles.inptitle}>Name of the Ward Secretariat</Text>
       </View>
       <View style={styles.box}>
        <Text 
       style={styles.inp}
       >{data.secretariatName}{data.secretariatNameComm}</Text>
       </View>
 
 
       <View style={styles.title}>
        <Text style={styles.inptitle}> Select Cluster ID </Text>
       </View>
       <View style={[styles.box,{justifyContent:"center",alignItems:"center"}]}>
       <Dropdown
                    style={{borderWidth:1,width:"90%",alignSelf:"center",height:50,borderColor:"#777",
                    borderRadius:10,paddingLeft:20}}
                    data={cluster}
                    search
                    searchPlaceholder="Search"
                    labelField="label"
                    valueField="value"
                    label="Dropdown"
                    placeholder="Choose cluser id ..."
                    value={clid}
                    mode='modal'
                    maxHeight={100} 
                    onChange={item => {
                    //setDropdown(item.value);
                        setclid(item.value);
                    }}
                    textError="Error"
                />
       
       </View>
 
      
       <View style={styles.title}>
        <Text style={styles.inptitle}>Mobile Number</Text>
       </View>
       <KeyboardAvoidingView behavior="padding" style={styles.container1}>
       <View style={styles.box}>
        <TextInput 
       style={styles.inp}
        value={phno}
        onChangeText={(txt)=>handleTextChange(txt)}
        maxLength={10}
        keyboardType='numeric' 
        placeholder='Enter here....'
       />
       </View>
       </KeyboardAvoidingView>
       <View style={styles.title}>
        <Text style={styles.inptitle}> Select property </Text>
       </View>
       <View style={[styles.box,{justifyContent:"center",alignItems:"center"}]}>
       <Dropdown
                    style={{borderWidth:1,width:"90%",alignSelf:"center",height:50,borderColor:"#777",
                    borderRadius:10,paddingLeft:20}}
                    data={radioButtons}
                    search={false}
                    searchPlaceholder="Search"
                    labelField="label"
                    valueField="value"
                    label="Dropdown"
                    placeholder="Choose ..."
                    value={type}
                    mode='modal'
                    maxHeight={100}
                   
                    onChange={item => {
                    //setDropdown(item.value);
                        settype(item.value);
                    }}
                    textError="Error"
                />
       
       </View>
<View style={styles.btnc}>
       <Button  mode="contained" style={styles.btn} onPress={() => getall()} disabled={!isvalid || !info?.isConnected}>
    Search
   </Button>
  
   </View>
    </View>
    
   </ScrollView>
   {!info?.isConnected ? <Offline/>: ''
   
  }
       </View>  
      
   )
 }

const styles = StyleSheet.create({
  
  container:{
  height:Dimensions.get("window").height+50
  },
  btnc:{
   alignItems:"center",
   margin:10
  },
  frame: {

    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems:'flex-start',
    justifyContent:'flex-start',
    width: frameWidth/1.5,
    
},
  inptitle:{
    fontSize:18,
    color:'black'
  },
  paid:{
    backgroundColor:'skyblue',
    margin:3,
    color:'red'
  },
  select:{
    backgroundColor:'green',
    margin:3,
    color:'white'
  },
  pending:{
backgroundColor:'red',
margin:3
  },
  header:{
    width:Dimensions.get("window").width,
    height:Dimensions.get("window").height/3.5,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    marginTop:-7,
      },
          image:{
            bottom:0,
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
    box:{
      justifyContent:'center',
      alignItems:'center'
    },
    title:{
      marginLeft:14,
      padding:5, 
    },
    inp:{
        borderWidth:1,
        borderColor:"#777",
        borderRadius:10,
        paddingLeft:20,
        width:'90%',
        height:50,
        paddingTop:15,
        color:'black'
       },
      
       btn:{
        width:"40%",
        padding:5,
        marginTop:10,
        backgroundColor:"green",
        fontSize:30,
        borderRadius:10,
        marginLeft:10,
        margin:40
        },
        spldrop:{
          backgroundColor:"transparent",
          borderWidth:1,
          borderColor:"#777",
          zIndex:10,
          borderRadius:10,
         // color:(schem==='dark')?'white':'black',
         color:"red"
        }
})