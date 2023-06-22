import crypto from "node:crypto";

const encryptionKeySecret = 'MySecretKey1234567890'; // Set your own secret key
const encryptionKey = crypto.randomBytes(32); // 32 bytes key
const iv = crypto.randomBytes(16); // 16 bytes IV

console.log("encryptionKey :>> ", encryptionKey);
console.log("iv :>> ", iv);

const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
let encryptedMessage = cipher.update("Hello bro", "utf8", "hex");
encryptedMessage += cipher.final("hex");

console.log("encryptedMessage :>> ", encryptedMessage);

// Decrypt message
const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv);
let decryptedMessage = decipher.update(encryptedMessage, "hex", "utf8");
decryptedMessage += decipher.final("utf8");

console.log("decryptedMessage :>> ", decryptedMessage);

