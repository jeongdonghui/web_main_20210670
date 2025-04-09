// 버튼 클릭 시 search_message 함수 연결
document.getElementById("search_button_msg").addEventListener('click', search_message);

// search_message 함수: 변수 사용해서 메시지 출력
function search_message() {
    let message = "검색을 수행합니다!"; // ✅ let 변수 추가
    alert(message);
}

// search_message2 함수: 같은 이름 아니고 다른 함수 추가
function search_message2() {
    let anotherMessage = "다른 검색을 수행합니다!";
    alert(anotherMessage);
}

// 구글 검색 함수
function googleSearch() {
    const searchTerm = document.getElementById("search_input").value.trim();

    // 공백 검사
    if (searchTerm.length === 0) {
        alert("검색어를 입력해주세요!");
        return false;
    }

    // 비속어 검사
    const badWords = ["나쁜말1", "나쁜말2", "나쁜말3", "욕설1", "욕설2"];

    for (let i = 0; i < badWords.length; i++) {
        if (searchTerm.includes(badWords[i])) {
            alert("부적절한 단어가 포함되어 있습니다!");
            return false;
        }
    }

    // 정상 검색
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(googleSearchUrl, "_blank");
    return false;
}
