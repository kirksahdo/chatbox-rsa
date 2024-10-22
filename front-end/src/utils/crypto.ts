import JSEncrypt from "jsencrypt";
import CryptoJS from "crypto-js";

// Gera o par de chaves RSA (pública e privada)
export const generateKeyPair = () => {
  const crypt = new JSEncrypt({ default_key_size: "2048" });
  const publicKey = crypt.getPublicKey();
  const privateKey = crypt.getPrivateKey();
  return { publicKey, privateKey };
};

// Criptografa a chave privada usando AES com uma senha fornecida pelo usuário
export const encryptPrivateKey = (privateKey: string, password: string) => {
  const encrypted = CryptoJS.AES.encrypt(privateKey, password).toString();
  return encrypted;
};

// Descriptografa a chave privada com a senha correta
export const decryptPrivateKey = (
  encryptedPrivateKey: string,
  password: string,
) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      encryptedPrivateKey,
      password,
    ).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    throw new Error("Invalid password or corrupted key");
  }
};

// Função para criptografar mensagens com a chave pública
export const encryptMessage = (message: string, publicKey: string) => {
  const crypt = new JSEncrypt();
  crypt.setPublicKey(publicKey);
  const encrypted = crypt.encrypt(message);
  return encrypted ? encrypted : message;
};

// Função para descriptografar mensagens com a chave privada
export const decryptMessage = (
  encryptedMessage: string,
  privateKey: string,
) => {
  const crypt = new JSEncrypt();
  crypt.setPrivateKey(privateKey);
  const decrypted = crypt.decrypt(encryptedMessage);
  return decrypted ? decrypted : encryptedMessage;
};
