import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View,KeyboardAvoidingView, Keyboard } from 'react-native';
import tw from "twrnc"
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
    const navigation = useNavigation();
    const [password,setPassword]=useState("")
    const [email,setEmail]=useState("")
    const [name,setName]=useState("")
    const [image,setImage]=useState("")
const handleRegister =()=>{
const data ={
    name:name,
    email:email,
    password:password,
    image:image,
}
// console.log("hi");
axios.post("http://localhost:8163/register",data).then((response)=>{
    // console.log(response);
    Alert.alert("User is registered successfully")
    setName("")
    setEmail("")
    setPassword("")
    setImage("")
    navigation.navigate("login")
}).catch((err)=>{
    Alert.alert("Registration Error")

console.log("error in registration",err );
})

}
    return (
        <View style={{...tw`flex-1`}}>
            <KeyboardAvoidingView>
            <View style={{...tw`text-black  text-center mx-10 mt-10 p-5`}}>
                <Text style={{...tw`text-blue-600 font-bold text-xl text-center my-4`}}>Register</Text>
                <Text style={{...tw`text-black text-center text-xl my-4`}}>Register Your Account</Text>
            </View>
      <View style={{...tw` mx-10`}}>
    <Text style={{...tw`text-black m-2 `}}>
        Name:
    </Text>
    <TextInput
    value={name}
    placeholder='Enter Your Name'
    placeholderTextColor={"#888"}
    style={{...tw` rounded-md bg-white px-5 py-3 text-gray-700`}}
    onChangeText={(text) => setName(text)}

    />
</View>     
<View style={{...tw` mx-10`}}>
    <Text style={{...tw`text-black m-2 `}}>
        Email:
    </Text>
    <TextInput
    value={email}
    placeholder='Enter Your Email'
    placeholderTextColor={"#888"}
    style={{...tw` rounded-md bg-white px-5 py-3 text-gray-700`}}
    onChangeText={(text) => setEmail(text)}

    />
</View>
<View style={{...tw` mx-10`}}>
    <Text style={{...tw`text-black m-2 `}}>
        Password:
    </Text>
    <TextInput
    value={password}
    placeholder='Enter Your Password'
    placeholderTextColor={"#888"}
    style={{...tw`border-gray-300 rounded-md bg-white px-5 py-3 text-gray-700`}}
    onChangeText={(text) => setPassword(text)}
    />
</View>
<View style={{...tw` mx-10`}}>
    <Text style={{...tw`text-black m-2 `}}>
        Image:
    </Text>
    <TextInput
    value={image}
    placeholder='Enter Your Image'
    placeholderTextColor={"#888"}
    style={{...tw`border-gray-300 rounded-md bg-white px-5 py-3 text-gray-700`}}
    onChangeText={(text) => setImage(text)}
    />
</View>
</KeyboardAvoidingView>
<View style={{...tw`my-10`}} >
    <Pressable onPress={handleRegister}><Text style={{...tw`text-white text-lg rounded-md py-4 px-15  bg-blue-500 mx-auto`,}} >Register</Text></Pressable>
   <View style={{...tw`flex-row  mx-auto`}}>
    <Text style={{...tw`text-center text-gray-600 mt-4 text-lg`}}>Already have an account?</Text> 
    <Pressable style={{...tw`mt-4`}}><Text style={{...tw`text-blue-600  text-lg`}} onPress={()=>navigation.navigate("login")}> Sign In</Text></Pressable>
    </View>   
</View>
</View>

    );
}

const styles = StyleSheet.create({})

export default Register;
