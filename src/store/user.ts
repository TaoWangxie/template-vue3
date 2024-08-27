import { defineStore } from 'pinia'
import { setStore, getStore, setSessionStore, getSessionStore } from "@/utils/storage";
import router from "@/router/index";
interface userInfoInf {
  _id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  created: string;
  updated: string;
}
export const useUserStore = defineStore({
  id: 'user', // id必填，且需要唯一
  state: () => {
    return {
      token:'',
      userInfo: null,
    }
  },
  actions: {
    setToken(token:string){
      this.token = token
      setStore('token',this.token)
    },
    getToken(){
      let token = this.token || getStore('token')
      return token ? 'Bearer ' +  token : ''
    },
    setUserInfo(userInfo:any){
      this.userInfo = userInfo
      setStore('userInfo',this.userInfo)
    },
    getUserInfo(): userInfoInf | any {
      let localUserInfo = getStore('userInfo')
      if(localUserInfo){
        localUserInfo = JSON.parse(localUserInfo)
      }
      return this.userInfo || localUserInfo
    },
    doLogout(){
      // 清除store user token
      this.setToken('')
      setSessionStore('beforeLoginUrl', '')
      this.goLogin()
    },
    goLogin() {
      // 将路由fullpath 保存在缓存中，用于登录完成后跳转
      let indexOf = window.location.href.indexOf('#/')
      let currentUrl = window.location.href.slice(indexOf + 1, window.location.href.length);
      setSessionStore('beforeLoginUrl', currentUrl)
      this.setToken('')
      router.push({ path: '/login' })
    },
    goBeforeLoginUrl(){
      let url = getSessionStore('beforeLoginUrl');
      if (!url || url.indexOf('/login') != -1) {
          router.push('/');
      } else {
          router.push(url);
          setSessionStore('beforeLoginUrl', '');
      }
    }
  }
})