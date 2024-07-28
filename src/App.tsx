import React from 'react';
import { StyleSheet, View } from 'react-native';
import Navigation  from './navigation';
import { UserContext } from './UserContext';
const App = () => {
  return (
    <UserContext>
    <Navigation/>
    </UserContext>
  );
}

const styles = StyleSheet.create({})

export default App;
