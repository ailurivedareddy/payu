import axios from 'axios';
import React, { useState, useEffect } from 'react';
 import { Platform, StyleSheet, Text, TextInput, View, Button, NativeModules, Alert, Switch, ScrollView, PermissionsAndroid, DeviceEventEmitter, NativeEventEmitter } from 'react-native';
 import { sha512 } from 'js-sha512';
import { fetchPayUDetails } from './api/IntiatePayment_api';
import { buildPayload } from './payLoadBuilder';
import { ToastAndroid } from 'react-native';
 const { PayUBizSdk } = NativeModules;
 
 export default App= () => {
 
     const [key, setKey] = useState('QS1iB9');
     const [amount, setAmount] = useState("1000");
     const [productInfo, setProductInfo] = useState('test1');
     const [firstName, setFirstName] = useState('test');
     const [email, setEmail] = useState('jjj@goodz.in');
     const [phone, setPhone] = useState('7702302357');
     const [ios_surl, setIosSurl] = useState('https://www.goodz.in');
     const [ios_furl, setIosFurl] = useState('https://www.goodz.in');
 
     const [environment, setEnvironment] = useState(1 + "");
     const [android_surl, setAndroidSurl] = useState('https://www.goodz.in');
     const [android_furl, setAndroidFurl] = useState('https://www.goodz.in');
     const [udf1, setUdf1] = useState('udf1');
     const [udf2, setUdf2] = useState('udf2');
     const [udf3, setUdf3] = useState('udf3');
     const [udf4, setUdf4] = useState('udf4');
     const [udf5, setUdf5] = useState('udf5');
     const [merchantSalt, setMerchantSalt] = useState('g5tGzBhDRWvxQureT1xOdTV38Y9nLEr9');
 
     const [userCredential, setUserCredential] = useState('QS1iB9:test');
 
     const [enableSI, setEnableSI] = useState(false);
     const [primaryColor, setPrimaryColor] = useState('#aabbcc');
     const [secondaryColor, setSecondaryColor] = useState('#000000');
     const [merchantName, setMerchantName] = useState("Rashan vala");
     const [merchantLogo, setMerchantLogo] = useState("Jio");
     const [showExitConfirmationOnCheckoutScreen, setShowExitConfirmationOnCheckoutScreen] = useState(true);
     const [showExitConfirmationOnPaymentScreen, setShowExitConfirmationOnPaymentScreen] = useState(true);
 
     const [cartDetails, setCartDetails] = useState([{ 'Order': 'Value' }, { 'Key Name': 'Value1' }]);
     const [paymentModesOrder, setPaymentModesOrder] = useState([{ 'UPI': 'TEZ' }, { 'Wallets': 'PAYTM' }, { 'EMI': '' },{'Wallets': 'PHONEPE'}]);
     const [surePayCount, setSurePayCount] = useState(1);
     const [merchantResponseTimeout, setMerchantResponseTimeout] = useState(10000);
     //const [showExitConfirmationOnPaymentScreen, setShowExitConfirmationOnPaymentScreen] = useState(true);
     const [autoSelectOtp, setAutoSelectOtp] = useState(true);
     const [enforcePaymentEnable, setEnforcePaymentEnable] = useState(false);
     const [showCbToolbar, setShowCbToolbar] = useState(true);
     const [autoApprove, setAutoApprove] = useState(false);
     const [merchantSMSPermission, setMerchantSMSPermission] = useState(false);
     const [showAlert, setShowAlert] = useState(false);
 
     displayAlert = (title, value) => {
         if (showAlert == false) {
             console.log('displayAlert ' + title + ' ' + value);
             setShowAlert(true);
             Alert.alert(title, value);
             //setState({ showAlert: true }, () => Alert.alert(title, value));
 
         }
         setShowAlert(false);
     }
     toggleAutoApproveOTP = (value) => {
 
         //setState({ autoApprove: value })
         setAutoApprove(value);
     }
 
     toggleEnableSI = (value) => {
         setEnableSI(value);
         //setState({ enableSI: value })
     }
    
 
     toggleSelectOTP = (value) => {
         setAutoSelectOtp(value);
         //setState({ autoSelectOtp: value })
     }
     toggleEnforcePaymentEnable = (value) => {
        setEnforcePaymentEnable(value);
        //setState({ autoSelectOtp: value })
    }
     toggleViewPort = (value) => {
 
         //setState({ viewPortWideEnable: value })
     }
     togglePermission = (value) => {
         setMerchantSMSPermission(value);
         requestSMSPermission()
         //setState({ merchantSMSPermission: value })
 
     }
 
     requestSMSPermission = async () => {
         try {
             const granted = await PermissionsAndroid.request(
                 PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
                 {
                     title: "Sample App SMS Permission",
                     message:
                         "Sample App needs access to your sms to autofill OTP on Bank Pages ",
                     buttonNeutral: "Ask Me Later",
                     buttonNegative: "Cancel",
                     buttonPositive: "OK"
                 }
             );
             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                 console.log("SMS Permission Granted!");
             } else {
                 console.log("SMS Permission Denied");
             }
         } catch (err) {
             console.warn(err);
         }
     };
 
     //Register eventEmitters here
     useEffect(() => {
         const eventEmitter = new NativeEventEmitter(PayUBizSdk);
 
         payUOnPaymentSuccess = eventEmitter.addListener('onPaymentSuccess', onPaymentSuccess);
         payUOnPaymentFailure = eventEmitter.addListener('onPaymentFailure', onPaymentFailure);
         payUOnPaymentCancel = eventEmitter.addListener('onPaymentCancel', onPaymentCancel);
         payUOnError = eventEmitter.addListener('onError', onError);
         payUGenerateHash = eventEmitter.addListener('generateHash', generateHash);
    //Unregister eventEmitters here
         return () => {
            console.log("Unsubscribed!!!!")
            payUOnPaymentSuccess.remove();
            payUOnPaymentFailure.remove();
            payUOnPaymentCancel.remove();
            payUOnError.remove();
            payUGenerateHash.remove();
       }

     }, [merchantSalt])
 
     onPaymentSuccess = (e) => {
         console.log(e.merchantResponse);
         console.log(e.payuResponse);
         displayAlert('onPaymentSuccess', JSON.stringify(e));
     }
        
     onPaymentFailure = (e) => {
         console.log(e);
         console.log(e.merchantResponse);
         console.log(e.payuResponse);
         displayAlert('onPaymentFailure', JSON.stringify(e));
     }
        // onPaymentSuccess = (e) => {
        //     ToastAndroid.show("Payment Success!", ToastAndroid.SHORT);
        // }

        // onPaymentFailure = (e) => {
        //     ToastAndroid.show("Payment Failed!", ToastAndroid.SHORT);
        // }

     onPaymentCancel = (e) => {
         console.log('onPaymentCancel isTxnInitiated -' + e);
         displayAlert('onPaymentCancel', JSON.stringify(e));
     }
     onError = (e) => {
         console.log(e);
         displayAlert('onError', JSON.stringify(e));
     }
    generateHash = (e) => {
         console.log(e.hashName);
         console.log(e.hashString);
         sendBackHash(e.hashName, e.hashString + merchantSalt);
     } 
     createPaymentParams = () => {
         var txnid = new Date().getTime().toString();
         console.log('AutoSelectOtp: '+autoSelectOtp +'MerchantSmsPermission: '+merchantSMSPermission);
         var payUPaymentParams = {
             key: key,
             transactionId: txnid ,
             amount: amount,
             productInfo: productInfo,
             firstName: firstName,
             email: email,
             phone: phone,
             ios_surl: ios_surl,
             ios_furl: ios_furl,
             android_surl: android_surl,
             android_furl: android_furl,
             environment: environment,
             userCredential: userCredential,
             additionalParam: {
                 udf1: udf1,
                 udf2: udf2,
                 udf3: udf3,
                 udf4: udf4,
                 udf5: udf5, 
                 walletUrn:'100000'
             }
         }
         var siParamObject = {
             isFreeTrial: true,
             billingAmount: '10',
             billingInterval: '1',
             paymentStartDate: '2024-05-20',
             paymentEndDate: '2025-04-30',
             billingCycle: 'DAILY', //Can be any of 'daily','weekly','yearly','adhoc','once','monthly'
             remarks: 'Test SI transcaction',
             billingCurrency: 'INR'
         }
         if (enableSI) {
             console.log('Inside enableSI')
             payUPaymentParams.payUSIParams = siParamObject
         }
 
         var payUCheckoutProConfig = {
             primaryColor: primaryColor,
             secondaryColor: secondaryColor,
             merchantName: merchantName,
             merchantLogo: merchantLogo,
             showExitConfirmationOnCheckoutScreen: showExitConfirmationOnCheckoutScreen,
             showExitConfirmationOnPaymentScreen: showExitConfirmationOnPaymentScreen,
             cartDetails: cartDetails,
             paymentModesOrder: paymentModesOrder,
             surePayCount: surePayCount,
             merchantResponseTimeout: merchantResponseTimeout,
             autoSelectOtp: autoSelectOtp,
             // Android specific property
             autoApprove: autoApprove,
             merchantSMSPermission: merchantSMSPermission,
             showCbToolbar: showCbToolbar,
         }
         if (enforcePaymentEnable) {
            payUCheckoutProConfig["enforcePaymentList"] = [{'payment_type' :"NB"}, {'payment_type' :"CARD"}];
         }
        
         return {
             payUPaymentParams: payUPaymentParams,
             payUCheckoutProConfig: payUCheckoutProConfig
         };
     }
     //Used to send back hash generated to SDK
     sendBackHash = (hashName, hashData) => {
         console.log(hashName);
         var hashValue = calculateHash(hashData);
         var result = { [hashName]: hashValue };
         console.log(result);
         PayUBizSdk.hashGenerated(result);
     }
     calculateHash = (data) => {
         console.log(data);
         var result = sha512(data);
         console.log(result);
         return result;
     }
//    const startTransaction = () => { 
//         try { 
//             const { payUPaymentParams, payUCheckoutProConfig } = createPaymentParams(); 
//             console.log("Final Params:", payUPaymentParams);
//              PayUBizSdk.openCheckoutScreen({ payUPaymentParams, payUCheckoutProConfig, });
//              } catch (err) { console.error("Payment initiation failed:", err); 
                
//              } 
//             }; 

    const startTransaction = async () => { try {
         // Step 1: Build payload (frontend params only) 
         const requestPayload = buildPayload( "5558", firstName, email, phone, productInfo, amount, android_surl, android_furl, ); 
         // Step 2: Call backend API 
         const data = await fetchPayUDetails(requestPayload); 
         if (data?.data) { 
            // Step 3: Start PayU Checkout Pro with backend response
             const payUPaymentParams = { key: data.data.key, 
                    transactionId: data.data.txnid, 
                    amount: data.data.amount, 
                    productInfo:data.data.productinfo, 
                    firstName: data.data.firstname, 
                    email: data.data.email, 
                    phone: data.data.phone, 
                    surl: data.data.surl, 
                    furl: data.data.furl,
                    ios_surl: ios_surl,
                    ios_furl: ios_furl,
                    android_surl: android_surl,
                    android_furl: android_furl,
                    udf1: data.data.udf1,
                     hash: data.data.hash,
                    environment: environment, 
                    userCredential: userCredential,}; 
             console.log("Payment Params:", payUPaymentParams);
             const payUCheckoutProConfig = { primaryColor: primaryColor, secondaryColor: secondaryColor, merchantName: merchantName, merchantLogo: merchantLogo, showExitConfirmationOnCheckoutScreen: showExitConfirmationOnCheckoutScreen, showExitConfirmationOnPaymentScreen: showExitConfirmationOnPaymentScreen, cartDetails: cartDetails, paymentModesOrder: paymentModesOrder, surePayCount: surePayCount, merchantResponseTimeout: merchantResponseTimeout, autoSelectOtp: autoSelectOtp, // Android specific property 
             autoApprove: autoApprove, merchantSMSPermission: merchantSMSPermission, showCbToolbar: showCbToolbar, };
             console.log("Starting PayU Checkout with params:", payUPaymentParams);
             PayUBizSdk.openCheckoutScreen({
                payUPaymentParams,
                payUCheckoutProConfig,
            }); 
            } else { 
                console.error("Invalid response from backend:", data); 
            } } catch (err) {
                 console.error("Transaction initiation failed:", err);
             } };

     return (
         <ScrollView style={styles.container}>
             <View >
             <Text style={styles.welcome}>☆ PayUCheckoutPro ☆{'\n'}Sample App</Text> 
             </View> 
             <View style={styles.cell}>
                 <Text style={styles.category}>Merchant Key</Text>
                 <TextInput style={styles.valuesTextInput} defaultValue={key} onChangeText={text => { setKey(text)}} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>Merchant Salt</Text>
                 <TextInput style={styles.valuesTextInput} defaultValue={merchantSalt} onChangeText={text => { setMerchantSalt(text) }} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>Environment</Text>
                 <TextInput style={styles.valuesTextInput} defaultValue={environment} onChangeText={text => { setEnvironment(text) }} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>Enter Transcation{'\n'}Amount</Text>
                 <TextInput style={styles.valuesTextInput} defaultValue={amount} onChangeText={text => { setAmount(text) }} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>Email</Text>
                 <TextInput style={styles.valuesTextInput} defaultValue={email} onChangeText={text => { setEmail(text) }} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>User Credential</Text>
                 <TextInput style={styles.valuesTextInput} defaultValue={userCredential} onChangeText={text => { setUserCredential(text) }} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>UDF1</Text>
                 <TextInput style={styles.valuesTextInput} defaultValue={udf1} onChangeText={text => { setUdf1(text) }} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>UDF2</Text>
                 <TextInput style={styles.valuesTextInput} defaultValue={udf2} onChangeText={text => { setUdf2(text)}} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>UDF3</Text>
                 <TextInput style={styles.valuesTextInput} defaultValue={udf3} onChangeText={text => { setUdf3(text)}} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>UDF4</Text>
                 <TextInput style={styles.valuesTextInput} defaultValue={udf4} onChangeText={text => { setUdf4(text)}} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>UDF5</Text>
                 <TextInput style={styles.valuesTextInput} defaultValue={udf5} onChangeText={text => { setUdf5(text) }} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>Merchant Surl/Furl{'\n'}Timeout</Text>
                 <TextInput style={styles.valuesTextInput} defaultValue={String(merchantResponseTimeout)} onChangeText={text => { setMerchantResponseTimeout( parseInt(text)) }} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>Auto Select Otp</Text>
                 <Switch style={styles.valuesSwitch} value={autoSelectOtp} onValueChange={toggleSelectOTP} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>Enable enforce{'\n'}Payment</Text>
                 <Switch style={styles.valuesSwitch} value={enforcePaymentEnable} onValueChange={toggleEnforcePaymentEnable} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>SMS Permission</Text>
                 <Switch style={styles.valuesSwitch} value={merchantSMSPermission} onValueChange={togglePermission} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>Auto Approve Otp</Text>
                 <Switch style={styles.valuesSwitch} value={autoApprove} onValueChange={toggleAutoApproveOTP} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>Enable SI</Text>
                 <Switch style={styles.valuesSwitch} value={enableSI} onValueChange={toggleEnableSI} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>SurePay (0-3)</Text>
                 <TextInput style={styles.valuesTextInput} defaultValue={String(surePayCount)} onChangeText={text => { setSurePayCount(parseInt(text) )}} />
             </View>
             <View style={styles.cell}>
                 <Text style={styles.category}>Merchant Name</Text>
                 <TextInput style={styles.valuesTextInput} defaultValue={merchantName} onChangeText={text => { setMerchantName(text) }} />
             </View>
             <Button title={'Pay Now'}  onPress={()=>{startTransaction()}} />
         </ScrollView>
     );
 }
 
 const styles = StyleSheet.create({
     contentContainerStyle: {
         flex: 2,
         justifyContent: 'center',
         alignItems: 'center',
         backgroundColor: '#F5FCFF',
 
     },
     welcome: {
         fontSize: 20,
         textAlign: 'center',
         margin: 10,
         marginTop: 50,
         marginBottom: 20,
         padding:10,
         backgroundColor: '#6495DD',
         fontWeight:"bold"  
     },
     category: {
         fontSize: 14,
         textAlign: 'left',
         fontWeight: "bold"
     },
     values: {
         fontSize: 14,
         textAlign: 'right'
     },
     valuesTextInput: {
        fontSize: 14,
        textAlign: 'right',
        width:180,
        borderWidth: .5,
        borderRadius: 5,
        padding: 10,
        backgroundColor:'#F2F3F4'
    },
     valuesSwitch: {
        fontSize: 14,
        textAlign: 'right'
    },
     instructions: {
         textAlign: 'center',
         color: '#333333',
         marginBottom: 5,
     },
     cell: {
         flex: 1,
         flexDirection: 'row',
         justifyContent: 'space-between',
         alignItems: 'center',
         margin: 10,
     },
 });
 
