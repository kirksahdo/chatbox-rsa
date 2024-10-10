import axios from "axios";
import { Message } from "../interfaces/Messages";

const API_URL = "http://localhost:8000";

export const registerUserAPI = async (username: string, publicKey: string) => {
  return await axios.post(`${API_URL}/register_key`, {
    username,
    public_key: publicKey,
  });
};

export const sendMessageAPI = async (
  sender: string,
  recipient: string,
  content: string,
) => {
  return await axios.post(`${API_URL}/send_message`, {
    sender,
    recipient,
    content,
  });
};

export const fetchMessagesAPI = async (username: string) => {
  const response = await axios.get<{ messages: Message[] }>(
    `${API_URL}/messages/${username}`,
  );
  return response.data.messages;
};

export const getRecipientPublicKey = async (username: string) => {
  const response = await axios.get(`${API_URL}/get_key/${username}`);
  return response.data;
};
