export function buildPayload(txnid, customerName, customerEmail, cPhone, prodInfo, amount, surl, furl) {
  return {
    env_type: "test", 
    pay_load_data: {
      txnid,
      customerName,        
      customerEmail,           
      cPhone,           
      prodInfo,
      amount:amount,
      surl,
      furl,
    }
  };
}
