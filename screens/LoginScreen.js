import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

/**
 * Screen that allows a user to log in or register for a new account.
 * Uses Firebase Authentication for handling credentials.
 */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .catch((err) => {
        // Show a basic alert on error. In a production application you would
        // provide more helpful feedback to the user.
        Alert.alert('Login Error', err.message);
      });
  };

  const handleSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(email.trim(), password)
      .catch((err) => {
        Alert.alert('Registration Error', err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Family Expense Tracker</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <View style={styles.buttonRow}>
        <Button title="Login" onPress={handleLogin} />
        <Button title="Register" onPress={handleSignUp} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 8,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});
