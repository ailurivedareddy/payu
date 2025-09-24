import React, { useEffect, useState } from "react";
import PayUCore from "payu-core-pg-react";
console.log("PayUCore SDK:", PayUCore);
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { fetchPayUDetails } from "./initiatePayment_api";

const PayUPayment = () => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "4111111111111111", // Test Visa card
    cvv: "123",
    expiryMonth: "12",
    expiryYear: "2025",
    nameOnCard: "TEST USER",
  });

  const [paymentDetails, setPaymentDetails] = useState({
    amount: "100.00",
    firstName: "John",
    email: "test@example.com",
    phone: "9876543210",
    productInfo: "Test Product",
  });


  const validateInputs = () => {
    const { amount, firstName, email, phone, productInfo } = paymentDetails;
    const { cardNumber, cvv, expiryMonth, expiryYear, nameOnCard } = cardDetails;

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Enter valid amount");
      return false;
    }
    if (!firstName.trim()) {
      Alert.alert("Error", "Enter first name");
      return false;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Enter valid email");
      return false;
    }
    if (phone.length < 10) {
      Alert.alert("Error", "Enter valid phone number");
      return false;
    }
    if (!productInfo.trim()) {
      Alert.alert("Error", "Enter product info");
      return false;
    }
    if (cardNumber.replace(/\s/g, "").length < 13) {
      Alert.alert("Error", "Enter valid card number");
      return false;
    }
    if (cvv.length < 3) {
      Alert.alert("Error", "Enter valid CVV");
      return false;
    }
    if (!nameOnCard.trim()) {
      Alert.alert("Error", "Enter name on card");
      return false;
    }
    return true;
  };


const initiateCardPayment = async () => {
  if (!validateInputs()) return;

  console.log("=== Initiating Card Payment ===");

  const transactionId = `CARD_${Date.now()}`;

  // Prepare payload for backend
  const requestPayload = {
    amount: paymentDetails.amount,
    productinfo: paymentDetails.productInfo,
    firstname: paymentDetails.firstName,
    email: paymentDetails.email,
    phone: paymentDetails.phone,
    udf1: "card-payment"
  };

  // Call backend API
  const apiResponse = await fetchPayUDetails(requestPayload);

  if (!apiResponse || apiResponse.error) {
    Alert.alert("Error", "Unable to fetch PayU details");
    return;
  }

  const payUData = apiResponse.data;

  const params = {
    payUPaymentParams: {
      key: payUData.key,
      transaction_id: payUData.txnid || transactionId,
      amount: payUData.amount,
      product_info: payUData.productinfo,
      first_name: payUData.firstname,
      email: payUData.email,
      phone: payUData.phone,
      surl: payUData.surl,
      furl: payUData.furl,
      environment: "1", // 1 = test, 0 = production
      hash: payUData.hash, // ✅ use backend hash
      udf1: payUData.udf1,
      udf2: "",
      udf3: "",
      udf4: "",
      udf5: "",
    },
    payUCardDetails: {
      cardNumber: cardDetails.cardNumber.replace(/\s/g, ""),
      cardName: cardDetails.nameOnCard.toUpperCase(),
      cardExpiry: `${cardDetails.expiryMonth}/${cardDetails.expiryYear}`,
      cardSecurityCode: cardDetails.cvv,
      storeCard: false,
    },
  };

  console.log("Final Params:", JSON.stringify(params, null, 2));

  try {
    const response = await PayUCore.startPayment(params);
    console.log("=== Payment Response ===", response);
    Alert.alert("Payment Success", JSON.stringify(response));
  } catch (err) {
    console.log("=== Payment Error ===", err);
    Alert.alert("Payment Failed", err.message || "Something went wrong");
  }
};

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, "");
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>PayU Test Payment (Core SDK)</Text>

      <TextInput
        placeholder="Amount (₹)"
        value={paymentDetails.amount}
        onChangeText={(text) => setPaymentDetails({ ...paymentDetails, amount: text })}
        style={styles.input}
        keyboardType="decimal-pad"
      />

      <TextInput
        placeholder="First Name"
        value={paymentDetails.firstName}
        onChangeText={(text) => setPaymentDetails({ ...paymentDetails, firstName: text })}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={paymentDetails.email}
        onChangeText={(text) => setPaymentDetails({ ...paymentDetails, email: text })}
        style={styles.input}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Phone"
        value={paymentDetails.phone}
        onChangeText={(text) => setPaymentDetails({ ...paymentDetails, phone: text })}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Product Info"
        value={paymentDetails.productInfo}
        onChangeText={(text) => setPaymentDetails({ ...paymentDetails, productInfo: text })}
        style={styles.input}
      />

      <TextInput
        placeholder="Card Number"
        value={cardDetails.cardNumber}
        onChangeText={(text) =>
          setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(text) })
        }
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Name on Card"
        value={cardDetails.nameOnCard}
        onChangeText={(text) => setCardDetails({ ...cardDetails, nameOnCard: text })}
        style={styles.input}
      />

      <View style={{ flexDirection: "row" }}>
        <TextInput
          placeholder="MM"
          value={cardDetails.expiryMonth}
          onChangeText={(text) => setCardDetails({ ...cardDetails, expiryMonth: text })}
          style={[styles.input, { flex: 1, marginRight: 4 }]}
        />
        <TextInput
          placeholder="YYYY"
          value={cardDetails.expiryYear}
          onChangeText={(text) => setCardDetails({ ...cardDetails, expiryYear: text })}
          style={[styles.input, { flex: 2, marginRight: 4 }]}
        />
        <TextInput
          placeholder="CVV"
          value={cardDetails.cvv}
          onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })}
          style={[styles.input, { flex: 1 }]}
          secureTextEntry
        />
      </View>

      <TouchableOpacity onPress={initiateCardPayment} style={styles.payButton}>
        <Text style={{ color: "white", fontSize: 18 }}>Pay ₹{paymentDetails.amount}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "white",
  },
  payButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default PayUPayment;
