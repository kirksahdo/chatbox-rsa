# Real-Time Chat with WebSocket and End-to-End RSA Encryption

## Introduction

This project is a real-time chat application that uses WebSockets for communication and implements **End-to-End Encryption (E2EE)** using **RSA encryption**. The main purpose of this project is to ensure that messages exchanged between users remain private and secure, meaning that only the sender and recipient can decrypt and read the messages.

### Key Features

- **WebSocket-based Communication:** Enables real-time messaging with minimal delay.
- **End-to-End Encryption (E2EE):** Ensures that only the intended users can read the messages, using RSA keys.
- **RSA Encryption:** Messages are encrypted with the recipient's public key and can only be decrypted with their private key.
- **Front-end and Back-end separation:** The project is organized into two main folders.

---

## About RSA Encryption and E2EE

**RSA Encryption** is an asymmetric cryptographic algorithm that uses a pair of keys:

- **Public Key:** Used to encrypt the message.
- **Private Key:** Used to decrypt the message.

In this chat application, each user generates their own RSA key pair. When sending a message:

1. The sender encrypts the message using the recipient’s **public key**.
2. The recipient uses their **private key** to decrypt the message upon receipt.

This ensures **End-to-End Encryption (E2EE)**, meaning the server can only relay encrypted messages without knowing their content, ensuring full confidentiality.

---

### Front-end (React)

The front-end uses **React** to provide a simple interface for users to:

- Register and generate RSA key pairs.
- Send and receive encrypted messages in real-time.
- Store and manage RSA private keys locally with AES encryption (for password protection).

### Back-end (FastAPI)

The back-end is built with **FastAPI**, providing:

- WebSocket connections to handle real-time messaging.
- RSA public key exchange between users.
- Secure message storage with SQLite via **SQLAlchemy**.

---

## Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** and **npm** (for the front-end)
- **Python 3.10+** (for the back-end)
- **SQLite** (for local database storage)

---

## Security Considerations

- **RSA Key Management:**

  - The RSA keys are generated **only on the client-side** to ensure that the private keys never leave the user’s device.
  - The private keys are encrypted with AES using a password, adding an additional layer of security.

- **E2EE Limitations:**

  - If the private key is lost or the password is forgotten, the user will no longer be able to decrypt past messages.

- **WebSocket Encryption:**
  - WebSocket messages are encrypted end-to-end, ensuring that the server cannot access the message content.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [JSEncrypt](https://github.com/travist/jsencrypt)
- [CryptoJS](https://cryptojs.gitbook.io/)
