import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT ,FROM_PHONE_NUMBER_ID} = process.env;

const sendMessage = async (phoneNumber, messageContent) => {
  try {
    const url = `https://graph.facebook.com/v22.0/${FROM_PHONE_NUMBER_ID}/messages`;
    const headers = {
      Authorization: `Bearer ${WEBHOOK_VERIFY_TOKEN}`,
      'Content-Type': 'application/json',
    };
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumber,
      type: 'text',
      text: {
        preview_url: false,
        body: messageContent,
      },
    };

    const response = await axios.post(url, data, { headers });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
export default sendMessage;
// sendMessage();