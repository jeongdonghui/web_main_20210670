/*
var close_time //시간 정보
var close_time2 = 10; //10초 설정

clearTimeout(close_time); //재호출 정지
close_time = setTimeout("close_window(), 10000");
// 1/1000초 지정, 바로 시작
show_time(); //실시간 시간 보여주기

function show_time(){
        let divClock = document.getElementByld('Time');
        divClock.innerText = close_tiem2; //10초 삽입 시작
    close_time2--; //1초씩감소
    setTimeout(show_time, 1000); //1초마다 갱신
}LO

function close_window(){ //함수 정의
    window.close(); //윈도우 닫기
}*/

function pop_up() {
    window.open("../popup/popup.html", "팝업테스트", "width = 400, height = 300, top=10, left=10");
    // ../ 들어가는 이유 : 한 단계 위 상위 폴더로 가기 위해서 사용함. 2번 나가야 할 시 ../../ 사용
}

function show_clock(){
    let currentDate = new Date(); //현재 시스템 날짜 객체 생성
    let divClock = document.getElementById('divClock')
    let msg = "현재시간: ";
    if(currentDate.getHours()>12){  // 12시보다크면오후아니면오전
        msg += "오후";
         msg += currentDate.getHours()-12+"시";
    }
         else {
            msg += "오전";
            msg += currentDate.getHours()+"시";
         }  
            msg += currentDate.getMinutes()+"분";
            msg += currentDate.getSeconds()+"초";
            divClock.innerText = msg;

            if (currentDate.getMinutes()>58) {    //정각1분전빨강색출력
                divClock.style.color="red";
            }
            setTimeout(show_clock, 1000); //1초마다 갱신
}

function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/" + ";SameSite=None; Secure";
    }
function getCookie(name) {
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if (cookie != "") {
        var cookie_array = cookie.split("; ");

    for ( var index in cookie_array) {
        var cookie_name = cookie_array[index].split("=");
    if (cookie_name[0] == "popupYN") {
        return cookie_name[1];
        }
    }
    }
    return ;
}

function closePopup() {
    if (document.getElementById('check_popup').value) {
        setCookie("popupYN", "N", 1);
        console.log("쿠키를 설정합니다.");
        self.close();
    }
}

function pop_up() {
    var cookieCheck = getCookie("popupYN");
    if (cookieCheck != "N"){
    window.open("../popup/popup.html", "팝업테스트", "width=400, height=300, top=10, left=10");
    }
}

function over(obj) {
    obj.src="image/LOGO1.jpg";
}
function out(obj) {
    obj.src="image/logo_coupang_w350.png";
}

//const over = (obj) => {
//    obj.src = "image/LOGO01.jpg";
//};