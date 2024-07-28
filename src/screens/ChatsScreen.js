import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import tw from "twrnc";
import { UserContext, UserType } from "../UserContext";
import UserChats from "../components/userChats";
const ChatsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendsList, setFriendsList] = useState([]);
  useEffect(() => {
    
    const getFriends = async () => {
      try {
        const response = await fetch(`http://localhost:8163/chat/${userId}`);
        if (response.ok) {
          //   console.log(response);
          const data = await response.json();
          setFriendsList(data);
        }
      } catch (error) {
        console.log("error while fetching friends", error);
      }
    };
    getFriends();
  }, []);

  return (
    <View style={{...tw``}}>

      {friendsList.length == 0 ? (
        <Text style={{ ...tw`text-black` }}>No Friends Found</Text>
      ) : (
        friendsList.map((item, index) => <UserChats item={item} key={index} />)
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default ChatsScreen;
