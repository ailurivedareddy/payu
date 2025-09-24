import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, DeviceEventEmitter } from 'react-native';
import CBWrapper from 'payu-core-pg-react';

const PaymentScreen = () => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cvv: '',
    expiryMonth: '',
    expiryYear: '',
    nameOnCard: ''
  });

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener("CBListener", (event) => {
      handlePaymentResponse(event);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handlePaymentResponse = (response) => {
    console.log("Payment Response:", response);
    
    switch(response.eventType) {
      case 'onPaymentSuccess':
        console.log('Payment Success:', response);
        Alert.alert('Success', 'Payment completed successfully!');
        break;
      case 'onPaymentFailure':
        console.log('Payment Failure:', response);
        Alert.alert('Failed', response.errorMessage || 'Payment failed');
        break;
      case 'onPaymentTerminate':
        console.log('Payment Terminated:', response);
        Alert.alert('Cancelled', 'Payment was cancelled');
        break;
      default:
        console.log('Other event:', response.eventType);
    }
  };

  const generatePaymentHash = async (paymentData) => {
    // Call your backend API to generate the hash
    // Never generate hash on client side for security
    try {
      const response = await fetch('YOUR_BACKEND_URL/generate-hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      const data = await response.json();
      return data.hash;
    } catch (error) {
      console.error('Hash generation error:', error);
      throw error;
    }
  };

  const initiatePayment = async () => {
    try {
      // Prepare payment data
      const paymentData = {
        key: 'YOUR_MERCHANT_KEY',
        txnid: new Date().getTime().toString(),
        amount: '100.00',
        productinfo: 'Test Product',
        firstname: 'John',
        email: 'john@example.com'
      };

      // Generate hash from your server
      const paymentHash = await generatePaymentHash(paymentData);

      // Build payment parameters
      const payUPaymentParams = {
        payUPaymentParams: {
          key: paymentData.key,
          transaction_id: paymentData.txnid,
          amount: paymentData.amount,
          product_info: paymentData.productinfo,
          first_name: paymentData.firstname,
          email: paymentData.email,
          phone: '9876543210',
          
          // Success/Failure URLs
          android_surl: 'https://your-domain.com/success',
          android_furl: 'https://your-domain.com/failure',
          ios_surl: 'https://your-domain.com/success',
          ios_furl: 'https://your-domain.com/failure',
          
          environment: '1', // 1 for staging, 0 for production
          
          // Card details
          bankcode: 'CC',
          card_number: cardDetails.cardNumber.replace(/\s/g, ''),
          cvv: cardDetails.cvv,
          expiry_year: cardDetails.expiryYear,
          expiry_month: cardDetails.expiryMonth,
          name_on_card: cardDetails.nameOnCard,
          store_card: '0',
          
          hashes: {
            payment: paymentHash
          },
          
          additional_param: {
            udf1: '',
            udf2: '',
            udf3: '',
            udf4: '',
            udf5: ''
          }
        }
      };

      // Start payment
      CBWrapper.startPayment(
        payUPaymentParams,
        'CC', // Payment mode for cards
        (error) => {
          console.log('Payment Error:', error);
          Alert.alert('Error', 'Payment initialization failed');
        },
        (response) => {
          console.log('Payment Started:', response);
        }
      );

    } catch (error) {
      console.error('Payment initiation error:', error);
      Alert.alert('Error', 'Failed to start payment');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Card Payment</Text>
      
      <TextInput
        placeholder="Card Number"
        value={cardDetails.cardNumber}
        onChangeText={(text) => setCardDetails({...cardDetails, cardNumber: text})}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        keyboardType="numeric"
      />
      
      <TextInput
        placeholder="Name on Card"
        value={cardDetails.nameOnCard}
        onChangeText={(text) => setCardDetails({...cardDetails, nameOnCard: text})}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TextInput
          placeholder="MM"
          value={cardDetails.expiryMonth}
          onChangeText={(text) => setCardDetails({...cardDetails, expiryMonth: text})}
          style={{ borderWidth: 1, padding: 10, flex: 1 }}
          keyboardType="numeric"
          maxLength={2}
        />
        <TextInput
          placeholder="YYYY"
          value={cardDetails.expiryYear}
          onChangeText={(text) => setCardDetails({...cardDetails, expiryYear: text})}
          style={{ borderWidth: 1, padding: 10, flex: 1 }}
          keyboardType="numeric"
          maxLength={4}
        />
        <TextInput
          placeholder="CVV"
          value={cardDetails.cvv}
          onChangeText={(text) => setCardDetails({...cardDetails, cvv: text})}
          style={{ borderWidth: 1, padding: 10, flex: 1 }}
          keyboardType="numeric"
          maxLength={3}
          secureTextEntry
        />
      </View>
      
      <TouchableOpacity
        onPress={initiatePayment}
        style={{ 
          backgroundColor: '#007bff', 
          padding: 15, 
          borderRadius: 5, 
          marginTop: 20,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;