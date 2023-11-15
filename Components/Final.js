import { StyleSheet, View,TextInput,Text, ScrollView, Dimensions,Image, FlatList,TouchableOpacity,ToastAndroid} from 'react-native'
import React, { useState,useEffect } from 'react'
import { Appearance,Switch } from 'react-native';
import { Button,Dialog, Portal,Provider,Modal  } from 'react-native-paper'
import Config from '../assets/Config.json'
import { LogBox } from 'react-native';
import FastImage from 'react-native-fast-image'
import { useNetInfo } from '@react-native-community/netinfo';
import Offline from './Offline';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome';
import Logs from './Logs';
import DeviceInfo from 'react-native-device-info';

const {width} = Dimensions.get('window');
const frameWidth = width;
import RNEzetapSdk from 'react-native-ezetap-sdk';
LogBox.ignoreLogs(['Warning: Each child in a list should have a unique "key" prop']);

const Final = ({route,navigation}) => {
 

  const showToast = (txt) => {
    ToastAndroid.show(txt, ToastAndroid.LONG);
  };

  const info=useNetInfo();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const[issub,setissub]=useState(false);
   const data = (route.params.data);
   const sub = (route.params.sub);
   const type = (route.params.type);
   const cluster = (route.params.cluster);
   const [visible, setVisible] =useState(false);
   const [visible1, setVisible1] = useState(false);
   const [mdata,setmdata]=useState([]);
   const[selcode,setcode]=useState([]);
   const [selmont,setselmont]=useState([]);
   const[final,setfinal]=useState([]);
   const [ucl,setucl]=useState([]);
   const[tempdata,settempdata]=useState([]);
   const[tempmonth,settempmonth]=useState([]);
   const[tempdata1,settempdata1]=useState([]);
   const[secode,setsecode]=useState('')
   const[hhid,sethhid]=useState('');
   const did=route.params.did;
   const uname=route.params.uname;

   function getmonth(dateString) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    const [year, month] = dateString.split('-');
    const monthIndex = parseInt(month, 10) - 1;
    const abbreviatedMonth = months[monthIndex];
  
    return abbreviatedMonth;
  }


 useEffect(() => {
  setissub(true);
  var tp='';
  if(type=="Commercial"){
   tp="getUCCDetails"
  }else{
    tp="getUCDetails"
  }
  fetch(Config.gen_url+tp, {
   method: 'POST',
   headers: {
     Accept: 'application/json',
     'Content-Type': 'application/json',
   },
   body: JSON.stringify({
     slno: sub.slno,
   }),
 }).then((response)=>response.json()).then((data)=>{
  Logs.appendLogToFile("api :- "+tp+"working fine");
   const tem1=[];
   const tem2=[];
   data.forEach((ree)=>{
    sethhid(ree.hhid);
    setsecode(ree.secretariatcode);
   if(ree.paymentStatus !='SUCCESS'){
   tem1.push(ree.yearMonth);
   item = {}
   item [ree.yearMonth] = ree.transactionId;
   item [ree.transactionId] = ree.amount;
    setucl(ree.ucSlno);
   tem2.push(item);
   }
   });
   settempdata(tem1);
   settempdata1(tem2);
   setmdata(data);
   setissub(false);
 }).catch((err)=>{console.log(err);showToast("error occures for getting months and years");Logs.appendLogToFile("api :- "+tp+" error "+JSON.stringify(err));});
 
 }, []);
 
 
 function selectmonth(month) {
  const monthIndex = tempdata.indexOf(month);
  var selectedMonths='';
  if(selmont.indexOf(month)>-1){
     selectedMonths = tempdata.slice(0, monthIndex);
  }else{
     selectedMonths = tempdata.slice(0, monthIndex+1);
  }


  setselmont(selectedMonths);
  
  // Update the code and amount based on selected months
  var tarr = [];
  var amt = 0;
  selectedMonths.forEach((selectedMonth) => {
    const monthIndex = tempdata.indexOf(selectedMonth);
    tarr.push(tempdata1[monthIndex][selectedMonth]);
    var rmn = tempdata1[monthIndex][selectedMonth];
    amt += tempdata1[monthIndex][rmn];
  });

  setcode(tarr);
  setamount(amt);

 }
 
 const [amount,setamount]=useState(0.0);
 var year = Array.from(new Set(mdata.map(({ year }) => year)));
 var temp=[];
 year.forEach((res)=>{
  var ress=mdata.filter((n,i)=>{return n.year==res});
 
  var arr={"year":res,"data":ress};
  temp.push(arr);
 })

 var tempmont=[];
 const modaldata = temp.map((res, index) => {
  const result = res.data.map((item, i) => {
    return (
      <TouchableOpacity
        key={`${index}_${i}`} // Using a combination of the outer and inner index as the key
        style={item.paymentStatus === 'SUCCESS' ? styles.paid : selmont.indexOf(item.yearMonth) > -1 ? styles.select : styles.pending}
        disabled={item.paymentStatus === 'SUCCESS' ? true : false}
        onPress={() => selectmonth(item.yearMonth)}
      >
        <Text style={item.paymentStatus === 'SUCCESS' ? styles.paidc : selmont.indexOf(item.yearMonth) > -1 ? styles.selectc : styles.pendingc}>{item.month}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <View key={index} style={{ flexDirection: 'row' }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, margin: 10, color: '#777' }}>{res.year}</Text>
      </View>
      <View style={styles.frame}>
        {result}
      </View>
    </View>
  );
});



   async function getall(){
    setissub(true)
  const months=[];
selmont.map(res=>{
  // const dt = new Date(res);
  // const name = dt.toLocaleString("default", { month: "short" });
  const name=getmonth(res);
  months.push(name);
})
settempmonth(months)

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "did": did,
  "monthNames": months,
  "ptIdList": selcode,
  "uccSlNo": type=="Residential"?0:ucl,
  "ulScNo": type=="Residential"?ucl:0
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};
fetch(Config.login_url+"posPaymentreq2", requestOptions)
  .then(response => response.json())
  .then(result => {
    if(result.status !=404 && result.status !=500){
      Logs.appendLogToFile("api :-posPaymentreq2 working fine");
      setfinal(result); setissub(false);setVisible1(true)
  }else{
    setissub(false);
    showToast("error occures :"+result.error);
    Logs.appendLogToFile("api :-posPaymentreq2 error "+JSON.stringify(error));
  }
})
  .catch(error => {console.log('error', error); setissub(false);
  showToast("error occures for getting users data from server");  
  Logs.appendLogToFile("api :-posPaymentreq2 error "+JSON.stringify(error));});
  } 
   

  async function paynow(){
    setVisible1(false);
    setissub(true);
    let nm = DeviceInfo.getVersion();
    try{
    var genericPay1 ={
        "userName":uname,
        "amount":amount,
        "options":{
          "paymentBy": secode,
           "references": { "reference1": final.txnid,
           "reference2": sub.citizenName !=null ?sub.citizenName:""+sub.traderName !=null?sub.traderName:"",
           "reference3":(tempmonth).join(","), 
          // "reference4": final.txnid,
           "additionalReferences": [
            {
              "Year": Array.from(new Set(selmont.map(date => date.split('-')[0]))).join("-")
            },
            {
              "WSCode": secode
            },
            {
              "AppVersionnumber": nm
            }
          ]},
        "customer":{"name":sub.citizenName !=null ?sub.citizenName:""+sub.traderName !=null?sub.traderName:"",
        "email":final.email,
        "mobileNo":final.phone,
        "Wscode":secode
      },"amountTip":"0"}}
      console.log(JSON.stringify(genericPay1))
      var res = await RNEzetapSdk.pay(JSON.stringify(genericPay1));
      const getdt=(JSON.parse(res));
      console.log(res)
      if(getdt.status=="success"){
        getdt['result']['references']={"udf1": ucl,
        "monthNames":(tempmonth),
        "pidList": (selcode),
        "txnid":final.txnid,
        "typeOfProperty": type};
        getdt['result']['txn']['paymentMode']= (getdt['result']['txn']['paymentMode']=="CASH"?"POS-Cash": getdt['result']['txn']['paymentMode']=="UPI" || getdt['result']['txn']['paymentMode']=="BHARATQR" ?"POS-QRCode":"POS-Online");
        var myHeaders3 = new Headers();
          myHeaders3.append("Content-Type", "application/json");
          myHeaders3.append("wscode",secode);
          var requestOptions = {
            method: 'POST',
            headers: myHeaders3,
            body: JSON.stringify(getdt)
          };
         var gen='';
        
         if(getdt['result']['txn']['paymentMode']=="POS-Cash"){
          gen="payOnlinePosResponse2"
         }else{
          gen="payOnlinePosResponseOnline2"
         }

          fetch(Config.login_url+gen, requestOptions)
            .then(response => response.json())
            .then(result => {
               setissub(false);
               if(result.result=="SUCCESS"){
                Logs.appendLogToFile("api :-"+gen+" working fine")
                alert("Payment completed successfully");
                navigation.navigate("Select",{"data":data,did:did,"uname":uname})
               }
            })
            .catch(error =>{ setissub(false);console.log('error', error);showToast("error occures sending data into server");  Logs.appendLogToFile("api :-"+gen+" error "+JSON.stringify(error));} );

      }else{
        setissub(false);
      alert("Payment cancelled");
      Logs.appendLogToFile("ezetap sdk pay :payment cancelled");
      }
    }catch(e){
      console.log(e);
      showToast("error occures sending data into server")
      Logs.appendLogToFile("api :-posPaymentreq2 error "+JSON.stringify(e));
      setissub(false);
    }
  } 
 
  const isvalid=amount !=0.0;
   const containerStyle = {backgroundColor: 'white', padding: 20,width:'94%',marginLeft:'3%'};
   const containerStyle1 = {backgroundColor: 'white', padding: 10,width:'90%',borderRadius:10,alignSelf:"center"};
   return (
     <Provider>
       <Portal >
         <Modal visible={visible} onDismiss={()=>setVisible(true)} contentContainerStyle={containerStyle}>
          <ScrollView>
          <Text>{modaldata}</Text>
          </ScrollView>
        
        <View style={{justifyContent:'center',alignItems:'center',marginTop:40}}>
        <TouchableOpacity mode="contained" style={{backgroundColor:"#6082B6",width:150,height:45,borderRadius:10,justifyContent:"center",alignItems:"center"}} onPress={()=>setVisible(false)}><Text style={{color:"white",fontSize:18}}>Ok</Text></TouchableOpacity>
        </View>
         </Modal>
       </Portal>


       <Portal >
         <Modal visible={visible1} onDismiss={()=>setVisible1(false)} contentContainerStyle={containerStyle1}>
         <ScrollView>
          <View style={{alignItems:"center"}}>
            <Image source={require("../assets/tr.png")} style={{width:100,height:100}}></Image>
            <Text style={{fontWeight:"bold"}}>UserFee Confirmation Details</Text>
            <View style={{width:100,backgroundColor:"skyblue",height:10,margin:5,borderRadius:10}}></View>
          </View>

          <View style={[styles.row,{borderBottomWidth:1,borderBottomColor:"#777",marginBottom:10}]}>
            <Text style={styles.col}>Name of the District </Text>
            <Text style={styles.col1}>{data.distName}{data.ulbName}</Text>
          </View>
           
          <View style={styles.row}>
            <Text style={styles.col}>Name of the ULB</Text>
            <Text style={styles.col1}>{data.mandalName}{data.districtName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.col]}>{sub.traderName !='' &&  sub.traderName !=null?"Trader  Name":"Name of the Citizen"}</Text>
            <Text style={styles.col1}>{sub.citizenName}{sub.traderName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.col}>Mobile Number</Text>
            <Text style={styles.col1}>{data.mobileNumberComm}{sub.mobileNumber}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.col}>Door Number</Text>
            <Text style={styles.col1}>{data.doorNoComm}{sub.doorNo}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.col}>House Hold Type</Text>
            <Text style={styles.col1}>{type}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.col}>Amount</Text>
            <Text style={styles.col1}>₹ {amount}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.col}>Status</Text>
            <Text style={styles.col1}>Pending</Text>
          </View>
         
          <View style={styles.row}>
            <Text style={styles.col}>{Array.from(new Set(selmont.map(date => date.split('-')[0]))).join(",").split(",").length>1?"Years":"Year"}</Text>
            <Text style={styles.col1}>{ Array.from(new Set(selmont.map(date => date.split('-')[0]))).join(",")}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.col}>Due {tempmonth.length>1?"Months":"Month"}</Text>
            <Text style={[styles.col1,{width:130}]}>{(tempmonth).join(",")}</Text>
          </View>


          <View style={styles.row}>
            <Text style={styles.col}>House Hold ID</Text>
            <Text style={[styles.col1,{width:130}]}>{hhid}</Text>
          </View>
          <View style={styles.row}>
            <Button mode='contained' style={[styles.col,{backgroundColor:"green"}]} onPress={()=>paynow()}>Pay Now</Button>
            <Button mode='contained' style={[styles.col,{backgroundColor:"red",borderWidth:1,marginLeft:5}]} onPress={()=>setVisible1(false)}>Close</Button>
          </View>
          </ScrollView>
          </Modal>
          </Portal>
     <View>
     <ScrollView >
     <Spinner
          visible={issub}
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
        <Text style={styles.inptitle}>Name of the District</Text>
       </View>
       <View style={styles.box}>
        <Text 
       style={styles.inp}
       >{data.distName}{data.ulbName}</Text>
       </View>
    
       <View style={styles.title}>
        <Text style={styles.inptitle}> Name of the ULB</Text>
       </View>
       <View style={styles.box}>
        <Text 
       style={styles.inp}
       >{data.mandalName}{data.districtName}</Text>
       </View>
 
       <View style={styles.title}>
        <Text style={styles.inptitle}>Name of the Ward Secretariat </Text>
       </View>
       <View style={styles.box}>
        <Text 
       style={styles.inp}
       >{data.secretariatName}{data.secretariatNameComm}</Text>
       </View>
 
 
       <View style={styles.title}>
        <Text style={styles.inptitle}>Cluster ID</Text>
       </View>
       <View style={styles.box}>
       <Text 
       style={styles.inp}
       >{cluster}</Text>
       </View>
 
 
       <View style={styles.title}>
        <Text style={styles.inptitle}>{sub.traderName !="" && sub.traderName !=null?" Trader Name":"Name of the Citizen"}</Text>
       </View>
       <View style={styles.box}>
        <Text 
       style={styles.inp}
       >{sub.citizenName}{sub.traderName}</Text>
       </View>
 
 
       <View style={styles.title}>
        <Text style={styles.inptitle}>Mobile Number</Text>
       </View>
       <View style={styles.box}>
        <Text 
       style={styles.inp}
       >{data.mobileNumberComm}{sub.mobileNumber}</Text>
       </View>
 
 
 
       <View style={styles.title}>
        <Text style={styles.inptitle}>Door Number</Text>
       </View>
       <View style={styles.box}>
        <Text 
       style={styles.inp}
       >{data.doorNoComm}{sub.doorNo}</Text>
       </View>
 
 
       <View style={[styles.title,{flexDirection:"row",alignItems:"center"}]}>
  
        <TouchableOpacity  style={{width:"50%",backgroundColor:"green",marginTop:10,height:50,justifyContent:"center",borderRadius:20,alignItems:"center"}} onPress={()=>setVisible(true)}>
          <Text style={{color:"white"}}> Select Months</Text></TouchableOpacity>
        <Text style={{marginLeft:10,fontSize:20,color:"red"}}>₹ {amount} </Text>
       </View>
    
       <View style={styles.btnc}>
       <Button  mode="contained" style={styles.btn} onPress={() => getall()} disabled={!info?.isConnected || !isvalid}>
    Confirm
   </Button>
       </View>
    </View>
 
    </ScrollView>
    {!info?.isConnected ? <Offline/>: ''
   
  }
     </View>
     </Provider>
   )
 }

export default Final
const styles = StyleSheet.create({
  row:{
    flexDirection: 'row',
    margin:5
  },
  col:{
   width:"50%",
   
  },
  col1:{
  fontWeight:"600",
  width:130
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
  selectc:{
  color:"white"
  },
  pendingc:{
    color:"white"
    },
  paid:{
    backgroundColor:'#ccc',
    margin:3,
    color:'red',
    width:70,
    height:35,
    borderRadius:20,
    justifyContent:"center",
    alignItems:"center"
  },
  select:{
    backgroundColor:'green',
    margin:3,
    color:'white',
    width:70,
    height:35,
    borderRadius:20,
    justifyContent:"center",
    alignItems:"center"
  },
  pending:{
backgroundColor:'red',
margin:3,
width:70,
    height:35,
    borderRadius:20,
    justifyContent:"center",
    alignItems:"center"
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
   container:{
  height:Dimensions.get("window").height+200
   },
      
       btn:{
        width:"80%",
        padding:5,
        marginTop:10,
        backgroundColor:"#6082B6",
        fontSize:30,
        borderRadius:10,
        marginLeft:10,
        alignSelf:"center"
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
})