import {useRef,useEffect, useState} from 'react';
import { View,Image,Animated,StyleSheet,useColorScheme,ToastAndroid,Text,TouchableOpacity,Alert,PermissionsAndroid   } from 'react-native';
import { NavigationContainer, DefaultTheme,
  DarkTheme} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Components/Home';
import JailMonkey from 'jail-monkey'
import RNExitApp from 'react-native-exit-app';
import {Getdata} from './Components/Getdata';
import Final from './Components/Final';
import DeviceInfo from 'react-native-device-info';
import Config from './assets/Config.json'
const App = () => {

  const scheme = useColorScheme();
  const Stack = createNativeStackNavigator();
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted.');
        // Perform file operations here
      } else {
        console.log('Storage permission denied.');
      }
    } catch (error) {
      console.log('Error while requesting storage permission:', error);
    }
  };
  
  // Call the function to request permission
  requestStoragePermission();
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme} >
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ orientation: 'portrait'}}>
      <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}} />
      <Stack.Screen name="Home" component={Home}  options={{headerShown:false}}/>
      <Stack.Screen name="Select" component={Getdata} options={{
          headerTitle:'Search Details',
          headerBackVisible:true,
          headerTitleStyle:{
            color:'white',
            fontSize:18
          },
          headerStyle: {
            backgroundColor: '#6082B6',
         },
         
          }}/>
    <Stack.Screen name="Final" component={Final} options={{
          headerTitle:'Payment',
          headerBackVisible:true,
          headerTitleStyle:{
            color:'white',
            fontSize:18
          },
          headerStyle: {
            backgroundColor: '#6082B6',
         },
         
          }}/>
   
      </Stack.Navigator>
      </NavigationContainer>
  )
}

function Splash({navigation}){
 
  const showToast = (txt) => {
    ToastAndroid.show(txt, ToastAndroid.LONG);
  };
  const fadeAnim = useRef(new Animated.Value(0)).current;
  setTimeout(()=>{
   var test=JailMonkey.trustFall();
     Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true
    }).start();
    if(test){
      showToast("rooted devices not allowed !");
      RNExitApp.exitApp();
    }else{
    //navigation.replace('Onbord'); 
    getData();
    }
   
  },5000);

  const getData = async () => {
        navigation.replace('Home')
  }
  return(
      <View style={styles.splmain}>
        <Spl2/>
<Spl1/>
 <View style={styles.top}></View>
       <View style={styles.bottom}></View>
      </View>
      
    )

  }  

function Spl1(){
  const showToast = (txt) => {
    ToastAndroid.show(txt, ToastAndroid.LONG);
  };
  
  useEffect(() => {
    async function versionget() {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        appname: "EZETAP",
        deviceType: "POS",
      });
  
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
  
      try {
        const response = await fetch(Config.login_url + "appVersion", requestOptions);
        const result = await response.json();
       
        let nm = DeviceInfo.getVersion();
        let num = Math.round(DeviceInfo.getBuildNumber() / 1000);
      //  console.log("version"+nm+" version code "+num);
        const valid = result.versionCode == num && result.versionNumber == nm;
     
        if (!valid) {
          Alert.alert(
            "App Update Required",
            "Your App is not updated.\nPlease update from Pax store\n Expected version "+num+"("+nm+")",
            [
              {
                text: "Exit",
                onPress: () => RNExitApp.exitApp(),
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  
    versionget();
  }, []);
  let nm = DeviceInfo.getVersion();
  let num = Math.round(DeviceInfo.getBuildNumber() / 1000);
return(
  <View>
<Image 
        source={require('./assets/city.gif')}  
        style={styles.spimgs1}
    />
    <View style={{marginTop:-35}}>
    <Text style={styles.txt}>Version Code {num}</Text>
    <Text style={styles.txt}>Version Name {nm}</Text>
    </View>
  </View>

)
}

function Spl2(){
  const fadeAnim = useRef(new Animated.Value(0)).current;
 
     Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true
    }).start();
  return(
    <Animated.View style={[styles.gif,
      {
        opacity: fadeAnim,
      },
    ]}>
       
     <Image source={require('./assets/splogo.png')} style={styles.spimgs}/>
    </Animated.View>
    
)
}


export default App

const styles = StyleSheet.create({
  txt:{
   color:"#777",
   fontSize:18,
   alignSelf:"center",
   margin:3
  },
  splmain:{
    backgroundColor:'white',
    height:'100%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    
  },
  spimgs:{
    marginTop:-30,
  },
  spimgs1:{
    marginTop:-2,
   width:250,
   height:200,
  margin:40
  },
  spimgs2:{
    width:150,
    height:50, 
   },
   top:{
    backgroundColor:"#6082B6",
    width:80,
    height:80,
    borderBottomLeftRadius:80,
    alignSelf:'flex-start',
    marginTop: -5,
    top:-1,
    right:0,
    position: 'absolute',
   },
   bottom:{
    backgroundColor:"#6082B6",
    width:200,
    height:200,
    alignSelf:'flex-start',
    bottom:-100,
    left:-80,
   borderRadius:100,
    position: 'absolute',
   }
})