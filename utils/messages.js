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
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
const sendImageMessage = async (phoneNumber, media_object_id) => {
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
      type: 'image',
      image: {
        id: media_object_id,
      },
    };

    const response = await axios.post(url, data, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
const sendAudioMessage = async (phoneNumber, media_object_id) => {
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
      type: 'audio',
      audio: {
        id: media_object_id,
      },
    };

    const response = await axios.post(url, data, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const sendContactMessage = async (phoneNumber, contactsArray) => {
  try {
    const url = `https://graph.facebook.com/v22.0/${FROM_PHONE_NUMBER_ID}/messages`;
    const headers = {
      Authorization: `Bearer ${WEBHOOK_VERIFY_TOKEN}`,
      'Content-Type': 'application/json',
    };
    const data = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'contacts',
      contacts: contactsArray,
    };

    const response = await axios.post(url, data, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const sendDocumentMessage = async (phoneNumber, media_object_id, filename) => {
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
      type: 'document',
      document: {
        id: media_object_id,
        filename: filename,
      },
    };

    const response = await axios.post(url, data, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};


const sendReactionMessage = async (phoneNumber, message_id, emoji) => {
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
      type: 'reaction',
      reaction: {
        message_id: message_id,
        emoji: emoji,
      },
    };

    const response = await axios.post(url, data, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export { sendMessage, sendImageMessage, sendAudioMessage, sendContactMessage, sendDocumentMessage, sendReactionMessage };
