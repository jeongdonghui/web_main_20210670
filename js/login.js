import { session_set, session_get, session_check } from './session.js';
import { encrypt_text, decrypt_text } from './crypto.js';
import { generateJWT, checkAuth } from './jwt_token.js';

function init() {
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    let get_id = getCookie("id");
    if (get_id) {
        emailInput.value = get_id;
        idsave_check.checked = true;
    }
    session_check();
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init_logined() {
    if (sessionStorage) {
        decrypt_text();
    } else {
        alert("세션 스토리지를 지원하지 않습니다.");
    }
}

const check_xss = (input) => {
    const DOMPurify = window.DOMPurify;
    const sanitizedInput = DOMPurify.sanitize(input);
    if (sanitizedInput !== input) {
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    return sanitizedInput;
};

function setCookie(name, value, expiredays) {
    const date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/";
}

function getCookie(name) {
    const cookie = document.cookie;
    if (cookie !== "") {
        const cookie_array = cookie.split("; ");
        for (let i = 0; i < cookie_array.length; i++) {
            const [key, val] = cookie_array[i].split("=");
            if (key === name) return val;
        }
    }
    return null;
}

function login_failed() {
    const failKey = "login_fail";
    const lockKey = "login_lock";

    let count = parseInt(getCookie(failKey) || "0");
    count++;

    setCookie(failKey, count, 1);

    if (count >= 3) {
        const lockUntil = Date.now() + 4 * 60 * 1000;
        setCookie(lockKey, lockUntil, 1);
        showMessage("로그인 가능 횟수를 초과했습니다. 4분 간 로그인할 수 없습니다.");
    } else {
        showMessage(`로그인 실패 (${count}/3)`);
    }
}

function isLoginLocked() {
    const lockUntil = parseInt(getCookie("login_lock") || "0");
    if (Date.now() < lockUntil) {
        const remaining = Math.ceil((lockUntil - Date.now()) / 60000);
        showMessage(`로그인 가능 횟수를 초과했습니다. ${remaining}분 간 로그인할 수 없습니다.`);
        return true;
    }
    return false;
}

function showMessage(msg) {
    const box = document.getElementById("login_message");
    if (box) {
        box.innerText = msg;
        box.style.display = "block";
    }
}

function hideMessage() {
    const box = document.getElementById("login_message");
    if (box) box.style.display = "none";
}

const check_input = () => {
    hideMessage();

    if (isLoginLocked()) return;

    const loginForm = document.getElementById("login_form");
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const idsave_check = document.getElementById('idSaveCheck');

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue);

    if (!sanitizedEmail || !sanitizedPassword) return;

    if (emailValue === '') {
        alert('이메일을 입력하세요.');
        return;
    }
    if (passwordValue === '') {
        alert('비밀번호를 입력하세요.');
        return;
    }
    if (emailValue.length < 5) {
        alert('아이디는 최소 5글자 이상 입력해야 합니다.');
        return;
    }
    if (passwordValue.length < 12) {
        alert('비밀번호는 반드시 12글자 이상 입력해야 합니다.');
        return;
    }
    if (!/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue)) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        return;
    }
    if (!/[A-Z]/.test(passwordValue) || !/[a-z]/.test(passwordValue)) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        return;
    }

    // ✅ 세션에서 회원가입된 사용자 정보 불러와 비교
    const joinedInfoString = sessionStorage.getItem("Session_Storage_join");
    let isLoginOk = false;

    if (joinedInfoString) {
        try {
            const joinedInfo = JSON.parse(joinedInfoString);
            const registeredEmail = joinedInfo._email;
            const registeredPassword = joinedInfo._password;

            isLoginOk = (emailValue === registeredEmail && passwordValue === registeredPassword);
        } catch (e) {
            console.error("세션 유저 정보 파싱 오류:", e);
        }
    }

    const payload = {
        id: emailValue,
        exp: Math.floor(Date.now() / 1000) + 3600
    };
    const jwtToken = generateJWT(payload);

    if (isLoginOk) {
        let loginCount = parseInt(localStorage.getItem("login_count") || "0");
        loginCount++;
        localStorage.setItem("login_count", loginCount);
        alert(`로그인 성공! 로그인 횟수: ${loginCount}`);

        setCookie("login_fail", 0, 0);
        setCookie("login_lock", 0, 0);

        if (idsave_check.checked) {
            alert("쿠키를 저장합니다.");
            setCookie("id", emailValue, 1);
            alert("쿠키 값: " + emailValue);
        } else {
            setCookie("id", "", 0);
        }

        sessionStorage.setItem("pass2", encrypt_text(passwordValue));
        session_set();
        localStorage.setItem('jwt_token', jwtToken);
        loginForm.submit();
    } else {
        login_failed();
    }
};

function logout() {
    let logoutCount = parseInt(localStorage.getItem("logout_count") || "0");
    logoutCount++;
    localStorage.setItem("logout_count", logoutCount);

    session_del();
    alert(`로그아웃 되었습니다. 로그아웃 횟수: ${logoutCount}`);
    location.href = "../index.html";
}

document.getElementById("login_btn").addEventListener('click', check_input);
