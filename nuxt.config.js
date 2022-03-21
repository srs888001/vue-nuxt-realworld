/**
 * Nuxt.js 配置文件
 */

 module.exports = {
    router: {
        // 命中后设置 Class 属性
        // 用于高亮
        linkActiveClass: 'active',

        extendRoutes (routes, resolve) {
            // 清除 Nuxt.js 基于 pages 目录默认生成的路由表规则
            routes.splice(0)

            routes.push(...[
                {
                  path: '/',
                  component: resolve(__dirname, 'pages/layout/'),
                  children: [
                    {
                      path: '', // 默认子路由
                      name: 'home',
                      component: resolve(__dirname, 'pages/home/')
                    },
                    {
                        path: '/login', // 登录子路由
                        name: 'login',
                        component: resolve(__dirname, 'pages/login/')
                    },
                    {
                        path: '/register', // 注册子路由
                        name: 'register',
                        component: resolve(__dirname, 'pages/login/')
                    },
                    {
                        path: '/profile/:username', // 个人信息
                        name: 'profile',
                        component: resolve(__dirname, 'pages/profile/')
                    },
                    {
                        path: '/settings', 
                        name: 'settings',
                        component: resolve(__dirname, 'pages/settings/')
                    },
                    {
                        path: '/editor', 
                        name: 'editor',
                        component: resolve(__dirname, 'pages/editor/')
                    },
                    {
                        path: '/article/:slug', 
                        name: 'article',
                        component: resolve(__dirname, 'pages/article/')
                    }, 
                  ]
                }
            ])
        }
    },
    // 注册插件
    plugins: [
        '~/utils/request.js',
     ]
}