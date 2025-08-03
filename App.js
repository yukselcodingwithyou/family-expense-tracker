import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

// Import Paper components for consistent theming across the app
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

// Import screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';

/**
 * Root application component.
 *
 * Here we set up a custom React Native Paper theme and wrap the application
 * in a PaperProvider, which ensures that all Paper components (buttons,
 * text inputs, lists, etc.) use our defined colors. We then configure
 * the React Navigation stack to show different screens based on whether
 * the user is authenticated via Firebase. If no user is logged in, the
 * login/register screen is shown; otherwise, the home screen and add
 * expense screen are accessible.
 */

// Create stack navigator
const Stack = createNativeStackNavigator();

// Define a custom theme to override Paper's default colors
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#388e3c', // green tone for primary actions
    accent: '#fbc02d',  // yellow tone for secondary/accents
  },
};

export default function App() {
  const [user, setUser] = useState(null);

  // Listen for authentication state changes and update local state
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(u => {
      setUser(u);
    });

    // Clean up subscription on unmount
    return unsubscribe;
  }, []);

  return (
    // Provide the custom theme to all Paper components
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Expenses' }}
              />
              <Stack.Screen
                name="AddExpense"
                component={AddExpenseScreen}
                options={{ title: 'Add Expense' }}
              />
            </>
          ) : (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
