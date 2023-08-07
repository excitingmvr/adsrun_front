    /* 사이드메뉴 */
    function showSideMenu() {
        document.querySelector('.side-menu').classList.add('active');
    }
    function hideSideMenu() {
        document.querySelector('.side-menu').classList.remove('active');
    }
    /* 로그아웃 팝업 */
    function activeLogoutPopup() {
        document.querySelector('.logout-popup').classList.add("active");
    }
    function removeLogoutPopup() {
        document.querySelector('.logout-popup').classList.remove("active");
    }
    /* 초대(공유)하기 팝업 */
    function activeInvitePopup() {
        document.querySelector('.invite-popup').classList.add("active");
    }
    function removeInvitePopup() {
        document.querySelector('.invite-popup').classList.remove("active");
    }
    /* 커스텀 팝업 */
    function activeCustomPopup() {
        document.querySelector('.custom-popup').classList.add("active");
    }
    function removeCustomPopup() {
        document.querySelector('.custom-popup').classList.remove("active");
    }

