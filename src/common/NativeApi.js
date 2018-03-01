const PageType = {
  gotoMyInvestment: '/native/home/home.html',
  gotoProductList: '/native/home/home.html'
};

// 获取SessionKey
export function getSessionKey() {
  if (window.LtnApp) {
    const sidObj = window.LtnApp.getSessionKey();
    return sidObj.sid;
  }
  return sessionStorage.getItem('ltn_sessionKey');
}
// 登录 url: 成功回调
export function login(url) {
  if (window.LtnApp) {
    window.LtnApp.login({
      url
    });
  } else {
    window.location.href = `/native/user_login/user_login.html?url=${url}`;
  }
}
// 跳转到指定页面
export function goPage(type) {
  if (window.LtnApp) {
    window.LtnApp.gotoAppPage({
      type
    });
  } else {
    window.location.href = PageType[type] || '/native/home/home.html';
  }
}

// 重新访问微信Outh2.0授权接口地址
export function reauthorize() {
  window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx168f4a5e83245568&redirect_uri=https%3A%2F%2Fwww.lingtouniao.com%2Fstatic%2Fhtml%2FluckySquare%2F%23%2Findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
}
