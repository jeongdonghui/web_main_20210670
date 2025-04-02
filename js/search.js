// 버튼 클릭 시 "검색을 수행합니다!" 메시지 표시
document.getElementById("search_btn").addEventListener('click', search_message);

function search_message() {
  alert("검색을 수행합니다!");
}

// 검색어를 입력받아 구글 검색 수행
function googleSearch() {
  const searchTerm = document.getElementById("search_input").value.trim(); // ✅ 앞뒤 공백 제거

  // ✅ 검색어가 비어있으면 검색 중단
  if (searchTerm.length === 0) {
    alert("검색어를 입력해주세요!");
    return false;
  }

  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;

  // ✅ 새 탭에서 구글 검색 수행
  window.open(googleSearchUrl, "_blank");

  return false;
}

