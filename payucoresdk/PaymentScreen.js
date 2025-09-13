import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

const PaymentScreen = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePay = () => {
    if (!cardNumber || !expiryMonth || !expiryYear || !cvv) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Call your backend or Native Module to process payment
    processPayment({ cardNumber, expiryMonth, expiryYear, cvv });
  };

  const processPayment = (cardDetails) => {
    // 🔹 This is a placeholder
    // You should call your server which uses PayU Core SDK
    console.log('Processing Payment:', cardDetails);
    Alert.alert('Info', 'Payment processing started');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        keyboardType="numeric"
        maxLength={19}
        value={cardNumber}
        onChangeText={setCardNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Expiry Month (MM)"
        keyboardType="numeric"
        maxLength={2}
        value={expiryMonth}
        onChangeText={setExpiryMonth}
      />
      <TextInput
        style={styles.input}
        placeholder="Expiry Year (YY)"
        keyboardType="numeric"
        maxLength={2}
        value={expiryYear}
        onChangeText={setExpiryYear}
      />
      <TextInput
        style={styles.input}
        placeholder="CVV"
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
        value={cvv}
        onChangeText={setCvv}
      />
      <Button title="Pay Now" onPress={handlePay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 15, padding: 10, borderRadius: 5 },
});

export default PaymentScreen;
