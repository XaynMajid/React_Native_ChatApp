import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import axios  from 'axios'
// import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

 const Login = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
// useEffect(() => {
//  const checkToken = async()=>{
//   try {
//     const token= await AsyncStorage.getItem("userToken")
//     console.log(token);
// if(token){
//   navigation.replace("home")
// }
// else{
//   Alert.alert("Login First")
// }
//   } catch (error) {
//     console.log("error",error);
//   }
// }
//   checkToken()
// }, []);


  // const handleLogin = async () => {

    
  //     const data = {
  //       email: email,
  //       password: password,
  //     };
  //   await axios.post("http://localhost:8163/login",data).then((response)=>{
  //     // console.log(response);
  //     Alert.alert("Login");
  // const token = response.data.token
  // console.log(response.data);
  // if(!token){
  //   Alert.alert("Wrong Email or Password")
  // }
  // // console.log("token",token);
  // AsyncStorage.setItem("userToken",token)
  // navigation.replace("home")
  //     }).catch((err)=>{
  //         Alert.alert("error in login",err);
  //     })
  
 
  // };

  const handleLogin = async () => {
    const data = {
      email: email,
      password: password,
    };
  
    try {
      const response = await axios.post("http://localhost:8163/login", data);
      const token = response.data.token;
  
      if (token) {
        // console.log(response.data);
        await AsyncStorage.setItem("userToken", token);
        navigation.replace("home");
        Alert.alert("Login Successful");
      }
    } catch (err) {
      if(email && (err.response && err.response.status === 401 )){
        Alert.alert("Login Failed", "Wrong Email or Password");
      }
      
       else {
        Alert.alert("Login Error", "Make Sure To Enter Email and Password");
        console.error(err);
      }
    }
  };
  


  return (
    <View style={{ ...tw`flex-1` }}>
      <View style={{ ...tw`text-black  text-center mx-10 mt-10 p-5` }}>
        <Text
          style={{ ...tw`text-blue-600 font-bold text-xl text-center my-4` }}
        >
          Sign In
        </Text>
        <Text style={{ ...tw`text-black text-center text-xl my-4` }}>
          Sign in to Your Account
        </Text>
      </View>
      <View>
        <View style={{ ...tw` mx-10` }}>
          <Text style={{ ...tw`text-black m-2 ` }}>Email:</Text>
          <TextInput
            value={email}
            placeholder="Enter Your Email"
            placeholderTextColor={"#888"}
            style={{ ...tw` rounded-md bg-white px-5 py-3 text-gray-700` }}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={{ ...tw` mx-10` }}>
          <Text style={{ ...tw`text-black m-2 ` }}>Password:</Text>
          <TextInput
            value={password}
            placeholder="Enter Your Password"
            placeholderTextColor={"#888"}
            style={{
              ...tw`border-gray-300 rounded-md bg-white px-5 py-3 text-gray-700`,
            }}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
        </View>

        <View style={{ ...tw`my-10` }}>
          <Pressable onPress={handleLogin}>
            <Text
              style={{
                ...tw`text-white text-lg rounded-md py-4 px-15  bg-blue-500 mx-auto`,
              }}
            >
              Login
            </Text>
          </Pressable>
          <View style={{ ...tw`flex-row  mx-auto` }}>
            <Text style={{ ...tw`text-center text-gray-600 mt-4 text-lg` }}>
              Don't have an account?
            </Text>
            <Pressable style={{ ...tw`mt-4` }}>
              <Text
                style={{ ...tw`text-blue-600  text-lg` }}
                onPress={() => navigation.navigate("register")}
              >
                {" "}
                Signup
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Login;
