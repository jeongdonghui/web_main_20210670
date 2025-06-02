const JWT_SECRET = "your_secret_key_here";

export function generateJWT(payload) {
    // ... (생략)
}

export function checkAuth() {
    const authenticated = isAuthenticated();
    if (authenticated) {
        alert('정상적으로 토큰이 검증되었습니다.');
    } else {
        alert('토큰 검증 에러!! 인증되지 않은 접근입니다.');
        window.location.href = '../login/login.html';
    }
}

function isAuthenticated() {
    const token = localStorage.getItem("jwt_token");
    if (!token) return false;
    const payload = verifyJWT(token);
    return payload !== null;
}

export function verifyJWT(token) {
    try {
        const [headerB64, payloadB64, signature] = token.split(".");
        const expectedSignature = CryptoJS.HmacSHA256(`${headerB64}.${payloadB64}`, JWT_SECRET);
        const expectedEncoded = CryptoJS.enc.Base64.stringify(expectedSignature);

        if (signature !== expectedEncoded) return null;

        const payload = JSON.parse(atob(payloadB64));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && now > payload.exp) return null;

        return payload;
    } catch (e) {
        return null;
    }
}
