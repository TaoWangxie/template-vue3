import axios from 'axios';
import { baseUrl, appSecret } from '@/environment';
import { ElMessage } from 'element-plus';
import { removeStore, getStore } from './storage';
import { ACCESS_TOKEN, CLIENT_ID, USER_INFO } from './const';
import {
  getToken,
  doLoginOut,
} from '@/utils/micro';

axios.interceptors.request.use(
  (config: any) => {
    // 设置token
    config.headers[CLIENT_ID] = appSecret;
    config.headers[ACCESS_TOKEN] = getToken() || '';

    config.metadata = { startTime: new Date() };
    // console.log(config.metadata);
    return config;
  },
  error => {
    return Promise.reject(error);
  });

export const responseHandler = function (data: any, resolve: any, reject: any, metadata: any) { // 公共响应码集中处理

  let code = data.code;
  code = Number.parseInt(`${code}`, 10);
  if (code === 0 || code === 200) {
    resolve({ ...data, ...metadata });
    return;
  }
  switch (code) {
    case -101: // 请登录
    case 101:
      removeStore(USER_INFO);
      doLoginOut();
      break;
    default:
      ElMessage.error(data.message);
      break;
  }

  reject(data.message)
};

export const api = <E, O>(url = '', type: any = 'GET', headers: Record<string, any> = {}, responseType: any = 'json') => {
  return (options?: E) => new Promise<O>((resolve, reject) => {
    axios.request({
      url: url,
      baseURL: url.startsWith('http') ? '' : baseUrl,
      method: type.toLowerCase(),
      params: ['GET', 'DELETE'].includes(type) ? options || {} : {}, // 业务params 请求参数
      headers: headers || {},
      data: !['GET', 'DELETE'].includes(type) ? options || {} : {},
      responseType: headers.responseType || 'json'
    }).then((response: any) => {

      let metadata = {
        duration: +new Date() - response.config.metadata.startTime,
        httpStatus: response.status
      };
      console.groupCollapsed('[' + url + ']返回信息');
      console.info('状态：' + metadata.httpStatus);
      console.info('耗时：' + metadata.duration + ' ms');
      console.info(response.data);
      console.groupEnd();

      if (headers.responseType  === 'json') { // 统一处理数据
        responseHandler(response.data, resolve, reject, metadata);
      } else {
        response.data?.code != "200" && ElMessage.error(response.data.message)
        resolve(response.data)
      }
    }).catch(function (error) {
      errorHandler(url, resolve, reject, error);
    });
  })
};


const errorHandler = (url: any, resolve: any, reject: any, error: any) => {
  //
  let metadata: any = {};

  let e: any = { code: '', message: '' };
  if (error.response) {
    metadata.duration = +new Date() - error.response.config.metadata.startTime;
    metadata.httpStatus = error.response.status;

    console.groupCollapsed('[' + url + '] 请求出错');
    console.info('状态：' + metadata.httpStatus);
    console.info('耗时：' + metadata.duration + ' ms');
    console.error('错误信息：' + error);
    console.groupEnd();

    e.code = error.response.status;
    e.message = error.response.statusText;
    switch (e.code) { // 异常情况
      case 400:
        e.message = '请求信息有误';
        break;
      case 401:
        e.message = '权限不足';
        break;
      case 404:
        e.message = '数据不存在';
        break;
      case 405:
        e.message = '错误的请求类型';
        break;
      case 500:
        e.message = '服务器开小差了，请稍后再试';
        break;
      case 501:
        console.log('接口[' + url + ']还未实现');
        e = error.response.data;
        break;
      case 503:
        e.message = '系统维护，请稍后再试';
        break;
    }
  } else {
    e.code = 600;
    e.message = (error.message === 'Network Error') ? '网络异常, 请检查网络稍后再试'
      : '数据处理错误';
    console.groupCollapsed('[' + url + '] 请求出错');
    console.error('错误信息：' + error.message);
    console.groupEnd();
  }
  responseHandler(e, resolve, reject, metadata);
};

interface apiType<T> {
  code: number
  data: T
  message: string
}

export const fetch = <E, O>(url: string, ...rest: [type?: string, headers?: any, responseType?: string]) => api<E, O>(url, ...rest)

fetch.GET = <E, O>(url: string, headers?: any) => api<E, apiType<O>>(url, 'GET', headers)
fetch.POST = <E, O>(url: string, headers?: any) => api<E, apiType<O>>(url, 'POST', headers)
fetch.PUT = <E, O>(url: string, headers?: any) => api<E, apiType<O>>(url, 'PUT', headers)
fetch.DELETE = <E, O>(url: string, headers?: any) => api<E, apiType<O>>(url, 'DELETE', headers)