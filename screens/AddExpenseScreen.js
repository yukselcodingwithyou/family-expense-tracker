import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

/**
 * Screen for adding a new expense. Collects basic details and writes them
 * to the Firestore database under the 'expenses' collection.
 */
export default function AddExpenseScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (!amount || !category) {
      Alert.alert('Missing fields', 'Please enter an amount and category');
      return;
    }
    try {
      const userId = auth().currentUser.uid;
      // Retrieve the user's familyId from the users collection to associate
      // expenses with the entire family rather than a single user.  This allows
      // all family members to see each other's expenses.
      const userDoc = await firestore().collection('users').doc(userId).get();
      const familyId = userDoc.data()?.familyId;
      await firestore().collection('expenses').add({
        userId,
        familyId,
        amount: parseFloat(amount),
        category: category.trim(),
        description: description.trim(),
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />
      <TextInput
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 8,
    borderRadius: 4,
  },
});
