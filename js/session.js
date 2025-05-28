 import { encrypt_text, decrypt_text } from './crypto.js';
 
export function session_set(){ //세션 저장}(객체)
    let id = document.querySelector("#typeEmailX");
    let password = document.querySelector("#typePasswordX");
    let random = new Date(); // 랜덤 타임스탬프
        const obj = { // 객체 선언
            id : id.value,
            otp : random
        }

 // 다음 페이지 계속 작성하기
    if (sessionStorage) {
        const objString = JSON.stringify(obj); // 객체-> JSON 문자열 변환
        let en_text = encrypt_text(objString); // 암호화

        sessionStorage.setItem("Session_Storage_id", id.value);
        sessionStorage.setItem("Session_Storage_object", objString);
        sessionStorage.setItem("Session_Storage_pass", en_text);
    } else {
        alert("세션 스토리지 지원 x");
    }
 }
export function session_get() { //세션 읽기
    if (sessionStorage) {
        return sessionStorage.getItem("Session_Storage_pass");
    } else {
        alert("세션 스토리지 지원 x");
    }
}

export function session_check() {
    const storedId = sessionStorage.getItem("Session_Storage_id");
    const jwtToken = localStorage.getItem("jwt_token");

    if (storedId && jwtToken) {
        const payload = verifyJWT(jwtToken);

        if (payload) {
            alert("이미 로그인 되었습니다.");
            location.href = '../login/index_login.html';
        } else {
            // 토큰이 만료됐거나 유효하지 않으면 세션 초기화
            sessionStorage.clear();
            localStorage.removeItem("jwt_token");
        }
    }
}

function session_del() {//세션 삭제
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_test");
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    } else {
        alert("세션 스토리지 지원 x");
    }
}

export function session_set2(obj){
    if (sessionStorage){
        const objString = JSON.stringify(obj);
        sessionStorage.setItem("Session_Storage_join", objString);
    } else{
        alert("세션 스토리지 지원 x");
    }
}