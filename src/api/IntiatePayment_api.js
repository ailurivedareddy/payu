import axios from "axios";
import { buildPayload } from "../payLoadBuilder";

const BASE_URL = "https://mergedapi.goodz.in/internal/testing";
const AUTH_HEADER = "ailuri-veda-ca862477ab1c5bace4";

/**
 * Fetch PayU transaction details (normal hash)
 * @param {Object} payload - transaction data like amount, product info, user info
 * @returns {Object|null} - PayU data including hash, txnid, etc.
 */
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

/**
 * Fetch VAS hash (vault payment hash) for saved cards
 * @param {number|string} amount - transaction amount
 * @returns {string|null} - VASHASH for mobile SDK
 */
export const fetchVasHash = async (amount) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/android/pay/u/checkout/pro/users/data`,
      { env_type: "test", amount },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": AUTH_HEADER,
        },
      }
    );

    const vashash = response.data?.data;

    if (vashash) {
      console.log("VAS Hash:", vashash);
      return vashash;
    } else {
      console.error("VAS hash not found in API response:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching VAS hash:", error);
    return null;
  }
};
