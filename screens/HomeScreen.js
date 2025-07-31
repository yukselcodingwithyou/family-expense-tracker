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
  const [familyId, setFamilyId] = useState(null);

  useEffect(() => {
    let unsubscribeExpenses;
    // Fetch the familyId for the current user and then subscribe to the family's
    // expenses.  Using an async function inside useEffect allows us to await
    // Firestore operations.
    const fetchFamilyAndListen = async () => {
      const userId = auth().currentUser?.uid;
      if (!userId) return;
      // Read the user's document to determine which family they belong to.
      const userDoc = await firestore().collection('users').doc(userId).get();
      const famId = userDoc.data()?.familyId;
      setFamilyId(famId);
      if (famId) {
        unsubscribeExpenses = firestore()
          .collection('expenses')
          .where('familyId', '==', famId)
          .orderBy('timestamp', 'desc')
          .onSnapshot((querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() });
            });
            setExpenses(list);
          });
      }
    };
    fetchFamilyAndListen();
    // Clean up the snapshot listener when the component unmounts or familyId
    // changes.
    return () => {
      if (unsubscribeExpenses) unsubscribeExpenses();
    };
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
