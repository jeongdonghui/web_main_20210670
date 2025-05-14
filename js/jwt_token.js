 // JWT 비밀 키 (실제 운영 환경에서는 복잡한 키 사용 필수)
 const JWT_SECRET = "your_secret_key_here";
 function generateJWT(payload) {
    // 1. 헤더 생성 및 Base64 인코딩
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = btoa(JSON.stringify(header));
    // 2. 페이로드 Base64 인코딩
    const encodedPayload = btoa(JSON.stringify(payload)); // JSON 형태로 변환 후 인코딩
    // 3. 서명 생성 (HMAC-SHA256 알고리즘 사용)
    const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
    const encodedSignature = CryptoJS.enc.Base64.stringify(signature);
    // 4. 최종 토큰 조합
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
 }

 function verifyJWT(token) { // 토큰검증
    try {
     // 1. 토큰을헤더, 페이로드, 서명으로분할
    const parts = token.split('.');
     if (parts.length!== 3) return null; // 형식오류체크
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
     // 2. 서명재계산및비교
    const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
     const calculatedSignature= CryptoJS.enc.Base64.stringify(signature);
     if (calculatedSignature!== encodedSignature) return null; // 서명불일치
    // 3. 페이로드파싱및만료시간검증
    const payload = JSON.parse(atob(encodedPayload)); // 디코딩후해석
    if (payload.exp< Math.floor(Date.now() / 1000)) { // 밀리초단위
    console.log('보안토큰이만료되었습니다');
     return null;
     }
     return payload; // 검증성공
    } catch (error) {
        return null; // 파싱오류또는기타예외처리
    }
     }