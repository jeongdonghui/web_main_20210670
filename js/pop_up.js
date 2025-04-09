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
function over(obj) {
    obj.src="image/LOGO1.jpg";
}
function out(obj) {
    obj.src="image/logo_coupang_w350.png";
}