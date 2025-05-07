function init() {
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    let get_id = getCookie("id");
    if (get_id) {
        emailInput.value = get_id;
        idsave_check.checked = true;
    }
    session_check(); // 세션 유무 검사
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

// 로그인 실패 시 호출되는 함수
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

// 로그인 제한 여부 확인
function isLoginLocked() {
    const lockUntil = parseInt(getCookie("login_lock") || "0");
    if (Date.now() < lockUntil) {
        const remaining = Math.ceil((lockUntil - Date.now()) / 60000);
        showMessage(`로그인 가능 횟수를 초과했습니다. ${remaining}분 간 로그인할 수 없습니다.`);
        return true;
    }
    return false;
}

// 메시지 출력용
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

    const c = '아이디, 패스워드를 체크합니다';
    alert(c);

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
    const hasSpecialChar = /[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue);
    if (!hasSpecialChar) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        return;
    }
    const hasUpperCase = /[A-Z]/.test(passwordValue);
    const hasLowerCase = /[a-z]/.test(passwordValue);
    if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        return;
    }

    // ✅ 로그인 성공 조건 예시
    const isLoginOk = (emailValue === "test@aa.com" && passwordValue === "Abcd1234!!");

    if (isLoginOk) {
        // 쿠키 초기화
        setCookie("login_fail", 0, 0);
        setCookie("login_lock", 0, 0);

        if (idsave_check.checked) {
            alert("쿠키를 저장합니다.");
            setCookie("id", emailValue, 1); // 1일 저장
            alert("쿠키 값: " + emailValue);
        } else {
            setCookie("id", "", 0); // 삭제
        }

        console.log('이메일:', emailValue);
        console.log('비밀번호:', passwordValue);
        session_set(); // 세션 생성
        loginForm.submit();
    } else {
        login_failed(); // 실패 시 호출
    }
};

document.getElementById("login_btn").addEventListener('click', check_input);
