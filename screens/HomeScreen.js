import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

/**
 * Main screen that displays a list of expenses for the authenticated user and
 * allows navigation to the AddExpense screen. Users can also sign out from
 * this screen.
 */
export default function HomeScreen({ navigation }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Listen to Firestore changes for the current user's expenses. Ordering by
    // timestamp descending ensures latest expenses appear first.
    const unsubscribe = firestore()
      .collection('expenses')
      .where('userId', '==', auth().currentUser.uid)
      .orderBy('timestamp', 'desc')
      .onSnapshot((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setExpenses(list);
      });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    auth().signOut();
  };

  return (
    <View style={styles.container}>
      <Button
        title="Add Expense"
        onPress={() => navigation.navigate('AddExpense')}
      />
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.amountText}>{item.category}: {item.amount}</Text>
            {item.description ? (
              <Text style={styles.descriptionText}>{item.description}</Text>
            ) : null}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No expenses yet.</Text>}
      />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  amountText: { fontSize: 16, fontWeight: 'bold' },
  descriptionText: { fontSize: 14, color: '#444' },
  empty: { textAlign: 'center', marginTop: 20, color: '#666' },
});
