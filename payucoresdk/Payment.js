// PaymentScreen.js
import React from 'react';
import { View, Button, Alert } from 'react-native';
import { CBWrapper } from 'payu-core-pg-react';

const Payment = () => {

  // Example payment parameters
  const payUPaymentParams = {
    key: "YOUR_MERCHANT_KEY",
    transactionId: "TXN_" + new Date().getTime(),
    amount: "1000", // as string
    productInfo: "Test Product",
    firstName: "John",
    email: "john.doe@example.com",
    phone: "9999999999",
    android_surl: "https://yourdomain.com/success",  // success URL
    android_furl: "https://yourdomain.com/failure",  // failure URL
    environment: "1", // 1 = staging, 0 = production
    user_credentials: "merchantKey:john.doe@example.com",
    hashes: {
      payment: "HASH_FROM_YOUR_BACKEND" // generated securely on server
    },
    // Optional additional params
    additional_param: {
      udf1: "udf1",
      udf2: "udf2"
    }
  };

  const startPayment = () => {
    const paymentObject = {
      payUPaymentParams: payUPaymentParams,
      payUCheckoutProConfig: {
        primaryColor: "#fca311",
        secondaryColor: "#14213d",
        merchantName: "My Store",
        showExitConfirmationOnCheckoutScreen: true,
        showExitConfirmationOnPaymentScreen: true,
      }
    };

    CBWrapper.openCheckoutScreen(
      paymentObject,
      (onPaymentSuccess) => {
        console.log("Payment Success:", onPaymentSuccess);
        Alert.alert("Success", JSON.stringify(onPaymentSuccess));
      },
      (onPaymentFailure) => {
        console.log("Payment Failure:", onPaymentFailure);
        Alert.alert("Failure", JSON.stringify(onPaymentFailure));
      },
      (onPaymentCancel) => {
        console.log("Payment Cancelled:", onPaymentCancel);
        Alert.alert("Cancelled", "User cancelled the payment");
      },
      (onError) => {
        console.log("Error:", onError);
        Alert.alert("Error", JSON.stringify(onError));
      }
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Pay Now" onPress={startPayment} />
    </View>
  );
};

export default Payment;
