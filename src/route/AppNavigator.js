import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import Dashboard from '../screens/Dashboard';
import NotificationScreen from '../screens/NotificationScreen';
import ActionScreen from '../screens/ActionScreen';
import UpdateMember from '../screens/UpdateMember';
import Settings from '../screens/Settings';
import Webpanel from '../screens/Webpanel';
import Registration from '../screens/Registration';

const Stack = createNativeStackNavigator();

function AppNavigator({initialRouteName}) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName} // Use the initial route passed as a prop
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="LoginScreen"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="OtpScreen"
          component={OtpScreen}
        />
        <Stack.Screen
          name="Dashboard"
          options={{gestureEnabled: false}}
          component={Dashboard}
        />
        <Stack.Screen name="ActionScreen" component={ActionScreen} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="UpdateMember" component={UpdateMember} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Webpanel" component={Webpanel} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
