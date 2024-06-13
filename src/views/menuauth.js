/**
 * 路由前置守卫
 */
router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const userStore = useUserStore()
    const authStore = useAuthStore()
    //1.白名单直接放行
    if (ROUTER_WHITE_LIST.includes(to.path)) {
      next()
    }
    // 2.如果没有token，携带redirect参数跳转login页面
    // 需要判断是否是login,不然跳转login,会造成死循环进入beforeEach
    if (!userStore.token) {
      if (to.path === LOGIN_URL) next()
      next({ path: LOGIN_URL })
    }
    //3.如果有token，判断store中是否有权限数据
    if (!authStore.authRouterList.length) {
      await getAuthRoutes()
      // !!如果 addRoute 并未完成，路由守卫会一层一层的执行执行，直到 addRoute 完成，找到对应的路由
      next({ ...to, replace: true })
    } else {
      next()
    }
  })
  /**
   * 路由后置守卫
   */
  router.afterEach(() => {
    NProgress.done()
  })
  /**
   * 路由报错
   */
  router.onError((error) => {
    NProgress.done()
    console.warn('路由错误', error.message)
  })
  /**
   * 处理动态路由
   */
  async function getAuthRoutes() {
    const userStore = useUserStore()
    const authStore = useAuthStore()
    try {
       //1.获取用户信息、权限列表
      await userStore.GetInfoAction()
      // 2.判断当前用户有没有菜单权限
      if (!authStore.authRouterList.length) {
        ElNotification({
          title: '无权限访问',
          message: '当前账号无任何菜单权限，请联系系统管理员！',
          type: 'warning',
          duration: 3000,
        })
        RESEETSTORE()
        router.replace(LOGIN_URL)
        return Promise.reject('No permission')
      }
      //3.与本地路由表对比，获取新的路由表
      const authRoutes = filterDynamicRoutes(
        dynamicRoutes,
        authStore.authRouterList,
      )
      //4.动态添加路由
      authRoutes.forEach((route) => {
        router.addRoute(route)
      })
      //5.获取菜单数据：处理subMenu数据,静态路由和动态路由拼接，过滤isHide=true的路由 
      const menuList getMenuList([ ...staticRoutes, ...routerList, ] as unknown as Menu.MenuOptions[]) 
      authStore.setAuthMenuList(menuList)
    } catch (error) {
      RESEETSTORE()
      console.log(error)
    }
  }
  //对比本地路由表，获取有权限的路由
  function filterDynamicRoutes(
    dynamicRoutes: RouteRecordRaw[],
    authRouterList: string[],
  ) {
    return dynamicRoutes.filter((route) => {
      if (!authRouterList.includes(route.name as string)) return false
      if (route.children?.length) {
        route.children = filterDynamicRoutes(route.children, authRouterList)
      }
      return true
    })
  }
  //过滤隐藏的菜单
  function getMenuList(routeList: Menu.MenuOptions[]) {
    return routeList.filter((route: Menu.MenuOptions) => {
      if (route?.children?.length) {
        route.children = getMenuList(route.children)
      }
      return !route.meta?.isHide
    })
  }
  