import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

/**
 * Screen that allows a user to log in or register for a new account.
 * Uses Firebase Authentication for handling credentials.
 */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State to hold an optional family code.  If provided on sign‑up the user will
  // join an existing family; otherwise a new family will be created.
  const [familyCode, setFamilyCode] = useState('');

  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .catch((err) => {
        // Show a basic alert on error. In a production application you would
        // provide more helpful feedback to the user.
        Alert.alert('Login Error', err.message);
      });
  };

  /**
   * Register a new user.  After creating an account with Firebase Auth, the user
   * is either added to an existing family (if a family code was provided) or a
   * brand new family is created.  The user's record is stored in the `users`
   * collection with a reference to their `familyId` for later queries.
   */
  const handleSignUp = async () => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email.trim(),
        password
      );
      const userId = userCredential.user.uid;
      let familyId;
      if (familyCode.trim()) {
        // Attempt to join an existing family using the code.  If the family
        // document does not exist the update will throw, which will be caught
        // by the outer try/catch.
        const familyRef = firestore().collection('families').doc(familyCode.trim());
        await familyRef.update({
          members: firestore.FieldValue.arrayUnion(userId),
        });
        familyId = familyRef.id;
      } else {
        // No family code provided, so create a new family document.
        const newFamilyRef = await firestore().collection('families').add({
          createdAt: firestore.FieldValue.serverTimestamp(),
          members: [userId],
        });
        familyId = newFamilyRef.id;
      }
      // Store user details along with the familyId for later lookups.
      await firestore().collection('users').doc(userId).set({
        email: email.trim(),
        familyId,
      });
    } catch (err) {
      Alert.alert('Registration Error', err.message);
    }
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
      {/* Optional field for entering a family code on registration.  Users can leave
          this blank to create a new family automatically. */}
      <TextInput
        placeholder="Family Code (optional)"
        value={familyCode}
        onChangeText={setFamilyCode}
        style={styles.input}
        autoCapitalize="none"
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
