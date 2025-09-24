import axios from "axios";

const BASE_URL = "https://mergedapi.goodz.in/internal/testing";
const AUTH_HEADER = "ailuri-veda-ca862477ab1c5bace4";

export const fetchPayUDetails = async (requestPayload) => {
  console.log("Request Payload:", requestPayload);

  try {
    const response = await axios.post(
      `${BASE_URL}/pay/u/initiate/pay/request`,
      requestPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": AUTH_HEADER,
        },
      }
    );

    const json = response.data;
    console.log("API Response:", json);
    return json;
  } catch (err) {
    console.error("PayU API Error:", err);
    return null;
  }
};
