import { JSEncrypt } from "jsencrypt";

// Gera um par de chaves RSA
export const generateKeyPair = () => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(
    "-----BEGIN PUBLIC KEY-----\n" +
      encrypt.getPublicKey() +
      "\n-----END PUBLIC KEY-----",
  );
  const publicKey = encrypt.getPublicKey(); // Exporta a chave pública
  const privateKey = encrypt.getPrivateKey(); // Exporta a chave privada
  console.log(publicKey);
  return { publicKey, privateKey };
};

// Criptografa uma mensagem com a chave pública
export const encryptMessage = (message: string, publicKey: string) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encrypt.encrypt(message); // Retorna a mensagem criptografada
};

// Descriptografa uma mensagem com a chave privada
export const decryptMessage = (
  encryptedMessage: string,
  privateKey: string,
) => {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(privateKey);
  return decrypt.decrypt(encryptedMessage); // Retorna a mensagem original
};
