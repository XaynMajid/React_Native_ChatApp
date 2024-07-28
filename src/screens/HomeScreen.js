import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import User from "../components/user";
const HomeScreen = () => {
  const navigation = useNavigation();
const {userId,setUserId}=useContext(UserType) // getting data from useContext
const [usersData, setUsersData] = useState([])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => <Text style={tw`text-black font-bold`}>Chat</Text>,
      headerRight: () => (
        <View style={{ ...tw`flex-row ` }}>
          <TouchableOpacity onPress={()=>navigation.navigate("Chats")}>
            <AntDesignIcon
              name="message1"
              size={25}
              style={{ ...tw`text-black mx-3` }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate("friendRequests")}>
            <IoniconsIcon
              name="people"
              size={25}
              style={{ ...tw`text-black` }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

useEffect(() => {
  const getToken =async()=>{
const Token = await AsyncStorage.getItem("userToken")
const Decoded= jwtDecode(Token)
const userId =  Decoded.userId
   setUserId(userId)
  axios.get(`http://localhost:8163/user/${userId}`).then((response)=>{
    // console.log(response.data);
    setUsersData(response.data)
   }).catch((err)=>{
    console.log(err,"error while fetching users");
   })
  }
  getToken()
  // console.log(usersData);
}, []);









// console.log(friendsList,"List of Friends");



  return (
    

<View style={tw` p-4`}>
{usersData.map((item, index) => (
  <User key={index} item={item} />
))}
</View>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;
