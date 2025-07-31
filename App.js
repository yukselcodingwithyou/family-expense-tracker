import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';

/**
 * Root application component.
 *
 * This component sets up navigation and listens for authentication changes
 * provided by Firebase. When a user is authenticated it shows the main
 * application screens; otherwise it shows the login/registration screen.
 */

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Subscribe to authentication state changes.  When the user logs in or out
    // this listener will fire and update local state accordingly.
    const unsubscribe = auth().onAuthStateChanged((u) => {
      setUser(u);
    });
    // Clean up subscription when component unmounts.
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Expenses' }} />
            <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Add Expense' }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login or Register' }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
