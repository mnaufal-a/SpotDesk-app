import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import Home from './src/screens/Home';
import Details from './src/screens/Details';
import Booking from './src/screens/Booking';
import Checkout from './src/screens/Checkout';
import Success from './src/screens/Success';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import { supabase } from './src/config/supabase';
import MyBookings from './src/screens/MyBookings';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
  console.log("APP START");

  supabase.auth.getSession().then(({ data: { session } }) => {
    console.log("SESSION:", session);

    setIsLoggedIn(!!session);
  }).catch((err) => {
    console.log("GET SESSION ERROR:", err);

    setIsLoggedIn(false);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {

    console.log("AUTH CHANGE:", _event);

    setIsLoggedIn(!!session);
  });

  return () => subscription.unsubscribe();
}, []);

  // Tampilkan loading spinner dulu saat mengecek session
  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{headerShown: false}}>
          {isLoggedIn ? (
            <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Details" component={Details} />
            <Stack.Screen name="Booking" component={Booking} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="Success" component={Success} />
            <Stack.Screen name="MyBookings" component={MyBookings} />
            </>
          ) : (
            <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            </>
          )}         
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;