import React from 'react';
import { StyleSheet, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Register from './screens/Register';
import FriendRequests from './screens/FriendRequests';
import ChatsScreen from './screens/ChatsScreen';
import UserChatScreen from './screens/UserChatScreen';
const Stack = createNativeStackNavigator()
const Navigation = () => {
    
  return (
    <NavigationContainer  >
     <Stack.Navigator initialRouteName='login'>
      <Stack.Screen name='home' component={HomeScreen} options={{headerShown:true}} />
      <Stack.Screen name='friendRequests' component={FriendRequests} options={{headerShown:true}} />
      <Stack.Screen name='register' component={Register} options={{headerShown:false}} />
      <Stack.Screen name='login' component={Login} options={{headerShown:false}} />
      <Stack.Screen name='Chats' component={ChatsScreen} options={{headerShown:true}} />
      <Stack.Screen name='userChat' component={UserChatScreen} options={{headerShown:true}} />
     </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({})

export default Navigation;
