// 和后台交互api
// 核心请求服务 依赖 axios
import axios from 'axios';
import qs from 'qs';
import {getSessionKey} from './NativeApi';

// 实例化 ajax请求对象
const ajaxinstance = axios.create({
  baseURL: '/',
  timeout: 50000,
  headers: {
    responseType: 'json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

// 添加拦截器，处理 公用请求参数，和通用请求头部
ajaxinstance.interceptors.request.use((config) => {
  const tempConfig = config;
  const {method, data = {}, params = {}} = config;
  const sessionKey = getSessionKey();
  if (method === 'post') {
    data.clientType = 'W';
    data.sessionKey = sessionKey;
    tempConfig.data = qs.stringify(data);
  } else if (method === 'get') {
    params.clientType = 'W';
    params.sessionKey = sessionKey;
    tempConfig.params = params;
  } else {
    Promise.reject({
      message: '请求不支持'
    });
  }
  return tempConfig;
}, error => Promise.reject({
  message: error.message || '请求异常'
}));

// 请求响应拦截器
ajaxinstance.interceptors.response.use((response) => {

  if (response.data.resultCode != '0' && response.data.code !== 0) {
    return Promise.reject({
      message: response.data.resultMessage || response.data.message || '服务异常',
      data: response.data
    });
  }
  return response.data;
}, error => Promise.reject({
  message: error.message || '请求异常'
}));
// const ajaxClass = "/uam";
export function ajaxGet(data) {
  // return ajaxinstance.get(ajaxClass + data.url, {
  //   params: data.params
  // });
  return ajaxinstance.get(data.url, {
    params: data.params
  });
}
// export function ajaxPost(data) {
//   return ajaxinstance.post(ajaxClass + data.url, data.params);
// }
export function ajaxPost(data) {
  return ajaxinstance.post(data.url, data.params);
}
export function ajaxAll(array) {
  return axios.all(array);
}
