import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import slash from 'slash2';
import themePluginConfig from './themePluginConfig';

const { pwa } = defaultSettings;

// origin server url
const originServerUrl = 'http://gss.com';

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';

const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/login',
      component: './Login',
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      authority: ['*', 'admin'],
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            // Dev
            {
              path: '/dev',
              component: './dev'
            },
            // System
            {
              path: '/system',
              name: 'system',
              icon: 'deployment-unit',
              routes: [
                {
                  path: '/system/administrator',
                  name: 'administrator',
                  hideChildrenInMenu: true,
                  routes: [
                    {
                      path: '/system/administrator',
                      redirect: '/system/administrator/index',
                    },
                    {
                      path: '/system/administrator/index',
                      name: 'index',
                      component: './System/Administrator/index',
                    },
                    {
                      path: '/system/administrator/detail',
                      name: 'detail',
                      component: './System/Administrator/detail',
                    },
                  ],
                },
                {
                  path: '/system/domain',
                  name: 'domain',
                  hideChildrenInMenu: true,
                  routes: [
                    {
                      path: '/system/domain',
                      redirect: '/system/domain/index',
                    },
                    {
                      path: '/system/domain/index',
                      name: 'index',
                      component: './System/Domain/index',
                    },
                    {
                      path: '/system/domain/editor',
                      name: 'editor',
                      component: './System/Domain/form',
                    },
                  ],
                },
                {
                  path: '/system/role',
                  name: 'role',
                  component: './System/Role/index',
                },
                {
                  path: '/system/access-controls',
                  name: 'access-controls',
                },
              ],
            },
            // Configure
            {
              path: '/configure',
              name: 'configure',
              icon: 'setting',
              routes: [
                {
                  path: '/configure/system',
                  name: 'system',
                },
                {
                  path: '/configure/website',
                  name: 'website',
                },
              ],
            },
            // Content
            {
              path: '/content',
              name: 'content',
              icon: 'container',
              routes: [
                {
                  path: '/content/article',
                  name: 'article',
                },
                {
                  path: '/content/category',
                  name: 'category',
                },
                {
                  path: '/content/model',
                  name: 'model',
                },
                {
                  path: '/content/tag',
                  name: 'tag',
                },
              ],
            },
            // Tools: earn
            {
              path: '/earn-view',
              name: 'earn-view',
              icon: 'home',
              routes: [
                {
                  path: '/earn-view',
                  redirect: '/earn-view/hotel/index',
                },
                {
                  path: '/earn-view/hotel',
                  name: 'hotel',
                  hideChildrenInMenu: true,
                  routes: [
                    {
                      path: '/earn-view/hotel',
                      redirect: '/earn-view/hotel/index',
                    },
                    {
                      path: '/earn-view/hotel/index',
                      name: 'index',
                      component: './Earn/Hotel',
                    },
                  ],
                },
                {
                  path: '/earn-view/order',
                  name: 'order',
                  hideChildrenInMenu: true,
                  routes: [
                    {
                      path: '/earn-view/order',
                      redirect: '/earn-view/order/index',
                    },
                    {
                      path: '/earn-view/order/booking',
                      name: 'booking',
                      component: './Earn/Order/Booking',
                    },
                    {
                      path: '/earn-view/order/index',
                      name: 'index',
                      component: './Earn/Order/Index',
                    },
                  ],
                },
                {
                  path: '/earn-view/task',
                  name: 'task',
                  hideChildrenInMenu: true,
                  routes: [
                    {
                      path: '/earn-view/task',
                      redirect: '/earn-view/task/index',
                    },
                    {
                      path: '/earn-view/task/index',
                      name: 'index',
                      component: './Earn/Task/Index',
                    },
                  ],
                },
              ],
            },
            // Tools:
            {
              path: '/wow-gold',
              name: 'WOWG',
              icon: 'pay-circle',
              routes: [
                {
                  path: '/wow-gold',
                  redirect: '/wow-gold/index',
                },
                {
                  path: 'index',
                  component: './Tools/WOWG/index',
                },
              ],
            },
            // 404
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },

    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'font-size-base': '12px',
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  // chainWebpack: webpackPlugin,
  proxy: {
    '/main/': {
      target: originServerUrl,
      changeOrigin: true,
    },
    // global proxy item
    '/storage/': {
      target: originServerUrl,
      changeOrigin: true,
    },
    // tools: earn proxy item
    '/earn/': {
      target: 'http://tts.mitanglx.com',
      changeOrigin: true,
    },
    // tools: wow gold
    '/tools/': {
      target: originServerUrl,
      changeOrigin: true,
    },
  },
  runtimePublicPath: true,
  publicPath: '/admin/',
  treeShaking: true,
  base: '/admin',
} as IConfig;
