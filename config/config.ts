import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
import proxy from './proxy';
import webpackPlugin from './plugin.config';

const { pwa } = defaultSettings;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, REACT_APP_ENV } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';

const plugins: IPlugin[] = [
  ['umi-plugin-antd-icon-config', {}],
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
        : false,
      // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
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
  // [
  //   'umi-plugin-antd-theme',
  //   {
  //     theme: [
  //       {
  //         fileName: 'dark.css',
  //         key:'dark',
  //         modifyVars: {
  //           '@primary-color': '#4992BF',
  //           '@menu-color': '#9B9B9B',
  //           '@menu-bg': '#3A3A3A',
  //         },
  //       },
  //     ],
  //     // 是否压缩css
  //     min: true,
  //     // css module
  //     isModule: true,
  //     // 忽略 antd 的依赖
  //     ignoreAntd: false,
  //     // 忽略 pro-layout
  //     ignoreProLayout: false,
  //     // 不使用缓存
  //     cache: true,
  //   }
  // ],
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
      authority: ['admin'],
      routes: [
        {
          path: '/blank',
          component: '../layouts/BlankLayout',
          routes: [
            {
              path: '/blank',
              component: './dev',
            },
          ],
        },
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
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/sub-page',
                  name: 'sub-page',
                  icon: 'smile',
                  component: './Welcome',
                  authority: ['admin'],
                },
              ],
            },
            {
              path: '/config',
              name: 'config',
              icon: 'control',
              component: './Config/index',
            },
            {
              path: '/system',
              name: 'system',
              icon: 'crown',
              // authority: ['admin'],
              routes: [
                {
                  path: '/system',
                  redirect: '/system/domain/index',
                },
                {
                  path: '/system/domain',
                  name: 'domain',
                  routes: [
                    {
                      path: '/system/domain',
                      redirect: '/system/domain/index',
                    },
                    {
                      path: '/system/domain/index',
                      component: './System/Domain',
                    },
                  ],
                },
                {
                  path: '/system/role',
                  name: 'role',
                  routes: [
                    {
                      path: '/system/role',
                      redirect: '/system/role/index',
                    },
                    {
                      path: '/system/role/index',
                      component: './System/Role',
                    },
                  ],
                },
                {
                  path: '/system/authority',
                  name: 'authority',
                  routes: [
                    {
                      path: '/system/authority',
                      redirect: '/system/authority/index',
                    },
                    {
                      path: '/system/authority/index',
                      component: './System/Authority',
                    },
                  ],
                },
                {
                  path: '/system/administrator',
                  name: 'administrator',
                  routes: [
                    {
                      path: '/system/administrator',
                      redirect: '/system/administrator/index',
                    },
                    {
                      path: '/system/administrator/index',
                      component: './System/Administrator',
                    },
                    {
                      path: '/system/administrator/detail',
                      component: './System/Administrator/detail',
                    },
                  ],
                },
              ],
            },
            {
              path: '/content',
              name: 'content',
              icon: 'book',
              routes: [
                {
                  path: '/content',
                  redirect: '/content/category/index',
                },
                {
                  path: '/content/category',
                  name: 'category',
                  routes: [
                    {
                      path: '/content/category',
                      redirect: '/content/category/index',
                    },
                    {
                      path: '/content/category/index',
                      component: './Content/Category/index',
                    },
                  ],
                },
                {
                  path: '/content/tag/index',
                  name: 'tag',
                  component: './Content/Tag/index',
                },
                {
                  path: '/content/aem/index',
                  name: 'aem',
                  component: './Content/Aem/index',
                },
                {
                  path: '/content/article',
                  name: 'article',
                  routes: [
                    {
                      path: '/content/article',
                      redirect: '/content/article/index',
                    },
                    {
                      path: '/content/article/index',
                      component: './Content/Article/index',
                    },
                  ],
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
    REACT_APP_ENV: REACT_APP_ENV || false,
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
  proxy: proxy[REACT_APP_ENV || 'dev'],
  chainWebpack: webpackPlugin,
  runtimePublicPath: true,
  publicPath: '/admin/',
  treeShaking: true,
  base: '/admin',
} as IConfig;
