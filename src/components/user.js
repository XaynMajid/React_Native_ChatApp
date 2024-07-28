import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Touchable, TouchableOpacity } from 'react-native';
import { Image, StyleSheet, Text, View } from 'react-native';
import tw from 'twrnc';
import { UserType } from '../UserContext';

const User = ({item}) => {
    // console.log(item.name);
    const {userId,setUserId}=useContext(UserType)
    const [friendsList,setFriendsList]= useState([])
    const [friendsReqList,setFriendsReqList]= useState([])
const [checker,setCheckers] = useState(false)
    const handlePress = async (currentUserId, selectedUserID) => { // sending userdata for friend requests in backend
        try {
            const response = await fetch("http://localhost:8163/friend-request", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ currentUserId, selectedUserID })
            });
    
            // Assuming you want to log the response for debugging purposes
            console.log('Response from server:', response);
    
            // Example: Handling different status codes
            if (response.ok) {
                console.log('Friend request sent successfully');
                // Handle success scenario if needed
            } else {
                console.error('Server responded with error status:', response.status);
                // Handle error scenario if needed
            }
        } catch (error) {
            console.error('Error while sending the data:', error);
        }

setCheckers(true)

    }


// Find Users

useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await fetch(`http://localhost:8163/friends/${userId}`);
        if (response.ok) {
          //   console.log(response);
          const data = await response.json();
          setFriendsList(data.friends)
        //   console.log("friendsdata",data.friends);
        }
      } catch (error) {
        console.log("error while fetching friends", error);
      }
    };
    getFriends();
  }, [item._id]);
  const FriendListId = friendsList.map((id)=> {return id._id}   )
// console.log(FriendListId,"Onli");
const isFriend =FriendListId.includes(item._id)
    

useEffect(() => {
    const getFriendsReq = async () => {
      try {
        const response = await fetch(`http://localhost:8163/friendRequests/${userId}`);
        if (response.ok) {
          //   console.log(response);
          const data = await response.json();
          setFriendsReqList(data)
          console.log("friendsdata",data);
        }
        else{
            console.log("response is not ok");
        }
      } catch (error) {
        console.log("error while fetching friends", error);
      }
    };
    getFriendsReq();
  }, [checker]);

  const isFriendReq = friendsReqList.includes(item._id)

    return (
        <View style={{...tw` flex-row my-3 items-center justify-between`}}>
            <View style={{...tw`flex-row`}}>
            <View style={{...tw`mr-3 `}}>
            <Image source={{uri:item.image}} style={{...tw`h-20 w-20`,borderRadius:50}} /> 
            </View>
            <View style={{...tw`justify-center`}}>
            <Text style={{...tw`text-black text-xl`}}>
                {item.name} 
            </Text>
            <Text style={{...tw`text-gray-500`}}>
                {item.email} 
            </Text>
            </View>
            </View>
            <View>
            {
  isFriendReq ? (
    // If a friend request has already been sent, render nothing or an appropriate message/button
    <Text style={{...tw`text-white bg-red-500 px-4 py-3 rounded-lg w-30 text-center`}}>Request Sent</Text>
  ) : (
    isFriend ? (
        <Text style={{...tw`text-white bg-green-500 px-4 py-3 rounded-lg w-30 text-center`}}>Friends</Text>
    ) : (
      <TouchableOpacity onPress={() => { handlePress(userId, item._id) }}>
        <Text style={{...tw`text-white bg-slate-500 px-4 py-3 rounded-lg w-30 text-center`}}>Add Friend</Text>
      </TouchableOpacity>
    )
  )
}
               
            </View>






            </View>
    );
}

const styles = StyleSheet.create({})

export default User;
