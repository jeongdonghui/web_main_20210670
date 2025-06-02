import { encrypt_text, decrypt_text } from './crypto.js';
import { verifyJWT } from './jwt_token.js';

export function session_set() { // 세션 저장
    let id = document.querySelector("#typeEmailX");
    let password = document.querySelector("#typePasswordX");
    let random = new Date();

    const obj = {
        id: id.value,
        otp: random
    };

    if (sessionStorage) {
        const objString = JSON.stringify(obj);
        let en_text = encrypt_text(objString);

        sessionStorage.setItem("Session_Storage_id", id.value);
        sessionStorage.setItem("Session_Storage_object", objString);
        sessionStorage.setItem("Session_Storage_pass", en_text);
    } else {
        alert("세션 스토리지를 지원하지 않습니다.");
    }
}

export function session_get() {
    if (sessionStorage) {
        return sessionStorage.getItem("Session_Storage_pass");
    } else {
        alert("세션 스토리지를 지원하지 않습니다.");
    }
}

export function session_check() {
    const storedId = sessionStorage.getItem("Session_Storage_id");
    const jwtToken = localStorage.getItem("jwt_token");

    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes("index_login.html");

    if (storedId && jwtToken) {
        const payload = verifyJWT(jwtToken);

        if (payload) {
            // ✅ 이미 로그인된 사용자가 로그인 페이지가 아닐 때만 리디렉션
            if (!isLoginPage) {
                alert("이미 로그인 되었습니다.");
                location.href = '../login/index_login.html';
            }
        } else {
            // ❌ 만료/위조 토큰이면 클리어
            sessionStorage.clear();
            localStorage.removeItem("jwt_token");
        }
    }
}

export function session_del() {
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_id");
        sessionStorage.removeItem("Session_Storage_object");
        sessionStorage.removeItem("Session_Storage_pass");
        sessionStorage.removeItem("pass2"); // 로그인 시 저장했던 추가 비밀번호 암호화
        alert('세션을 삭제했습니다.');
    } else {
        alert("세션 스토리지를 지원하지 않습니다.");
    }
}

export function session_set2(obj) {
    if (sessionStorage) {
        const objString = JSON.stringify(obj);
        sessionStorage.setItem("Session_Storage_join", objString);
    } else {
        alert("세션 스토리지를 지원하지 않습니다.");
    }
}
