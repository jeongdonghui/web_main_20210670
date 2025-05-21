import { session_set, session_get, session_check } from './session.js';

function encodeByAES256(key, data) {
    const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(""),  // CBC 모드에서는 IV가 기본 요구되므로 빈 값은 권장되지 않음
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return cipher.toString();
}

function decodeByAES256(key, data) {
    const cipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(""),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return cipher.toString(CryptoJS.enc.Utf8);
}

export function encrypt_text(password) {
    const key = "key".padEnd(32, " "); // AES-256 key: 32바이트
    const encrypted = encodeByAES256(key, password);
    return encrypted;
}

export function decrypt_text() {
    const key = "key".padEnd(32, " ");
    const encrypted = session_get();
    const decrypted = decodeByAES256(key, encrypted);
    console.log("복호화된 값:", decrypted);
}
