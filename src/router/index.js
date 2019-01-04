
import Vue from 'vue'
import VueRouter from 'vue-router'

const user = resolve => require(['../page/container/user.vue'], resolve)
const plain = resolve => require(['../page/container/plain.vue'], resolve)
const home = resolve => require(['../page/home/home.vue'], resolve)
const order = resolve => require(['../page/order/order.vue'], resolve)
const my = resolve => require(['../page/my/my.vue'], resolve)
const recharge = resolve => require(['../page/recharge/recharge.vue'], resolve)
const register = resolve => require(['../page/register/register.vue'], resolve)
const getCash = resolve => require(['../page/getCash/getCash.vue'], resolve)
const shop = resolve => require(['../page/shop/shop.vue'], resolve)         //单列
const shopHome = resolve => require(['../page/shop/shopHome.vue'], resolve) //双列
const shopHome2 = resolve => require(['../page/shop/shopHome2.vue'], resolve) //新版
const search = resolve => require(['../page/search/search.vue'], resolve)
const record = resolve => require(['../page/record/record.vue'], resolve)
const placeOrder = resolve => require(['../page/placeOrder/placeOrder.vue'], resolve)
const orderDetail = resolve => require(['../page/orderDetail/orderDetail.vue'], resolve)
const alipayPage = resolve => require(['../page/placeOrder/alipayPage.vue'], resolve)
const myComment = resolve => require(['../page/myComment/myComment.vue'], resolve)
const myCommentDetails = resolve => require(['../page/myComment/myCommentDetails.vue'], resolve)
const myInformation = resolve => require(['../page/myInformation/myInformation.vue'], resolve)
const age = resolve => require(['../page/myInformation/components/age.vue'], resolve)
const job = resolve => require(['../page/myInformation/components/job.vue'], resolve)
//发票相关
const invoice = {
  // 共用组件,路由里配置base组件
  invoice: resolve => require(['../page/my/com/invoice/base/invoice.vue'], resolve),         //wrap组件                                                                               // 电子发票
  titleList: resolve => require(['../page/my/com/invoice/base/children/titleList.vue'], resolve), //抬头列表
  apply: resolve => require(['../page/my/com/invoice/base/children/apply.vue'], resolve),        //申请发票
  titleApply: resolve => require(['../page/my/com/invoice/base/titleApply.vue'], resolve),       // 嵌套路由wrap，选择单位 个人  
  applyCompany: resolve => require(['../page/my/com/invoice/base/children/applyCompany.vue'], resolve),        //申请发票 单位
  applyPerson: resolve => require(['../page/my/com/invoice/base/children/applyPerson.vue'], resolve),        //申请发票 个人
  history: resolve => require(['../page/my/com/invoice/base/children/history.vue'], resolve),     //历史纪录
  titleEditCompany: resolve => require(['../page/my/com/invoice/base/titleEdit/company.vue'], resolve),       //单位 设置默认
  titleEditPerson: resolve => require(['../page/my/com/invoice/base/titleEdit/person.vue'], resolve),        //个人 设置默认
  titleAdd: resolve => require(['../page/my/com/invoice/base/titleAdd.vue'], resolve),       // 嵌套路由wrap
  addCompany: resolve => require(['../page/my/com/invoice/base/children/addCompany.vue'], resolve),       // 单位
  addPerson: resolve => require(['../page/my/com/invoice/base/children/addPerson.vue'], resolve),        // 个人
  listCompany: resolve => require(['../page/my/com/invoice/base/listCompany'], resolve),        // 单位抬头列表
  listPerson: resolve => require(['../page/my/com/invoice/base/listPerson'], resolve),        // 个人抬头列表
  infoCompany: resolve => require(['../page/my/com/invoice/base/infoCompany'], resolve),        // 单位抬头info页
  infoPerson: resolve => require(['../page/my/com/invoice/base/infoPerson'], resolve),        // 个人抬头info页面
}

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      // redirect: '/user/order',
      redirect: '/resto/shopHome',
      meta: {
        // auth: true,
        title: '店铺列表'
      }
    },
    {
      path: '/resto',
      component: plain,
      children: [
        {
          path: 'shopHome',
          name: 'shopHome',
          component: shopHome2,
          meta: {
            auth: true,
            title: '选择店铺'
          }
        }
      ]
    },
    {
      path: '/user',
      component: user,
      meta: {
        // auth: true,
        title: '点餐'
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: home,
          meta: {
            title: '首页'
          }
        },
        {
          path: 'order',
          name: 'order',
          component: order,
          meta: {
            auth: true,
            title: '点餐'
          }
        },
        {
          path: 'my',
          name: 'my',
          component: my,
          meta: {
            title: '我的'
          }
        },
        {
          path: 'register',
          name: 'register',
          component: register,
          meta: {
            title: '注册'
          }
        },
        {
          path: 'recharge',
          name: 'recharge',
          component: recharge
        },
        {
          path: 'getCash',
          name: 'getCash',
          component: getCash,
          meta: {
            title: '充值'
          }
        },
        {
          path: 'shop',
          name: 'shop',
          component: shop,
          meta: {
            title: '店铺切换'
          }
        },
        {
          path: 'search',
          name: 'search',
          component: search,
          meta: {
            title: '搜索'
          }
        },
        {
          path: 'record',
          name: 'record',
          component: record,
          meta: {
            title: '邀请返利'
          }
        },
        {
          path: 'placeOrder',
          name: 'placeOrder',
          component: placeOrder,
          meta: {
            title: '买单'
          }
        },
        {
          path: 'orderDetail',
          name: 'orderDetail',
          component: orderDetail,
          meta: {
            title: '订单详情'
          }
        },
        {
          path: 'alipayPage',
          name: 'alipayPage',
          component: alipayPage,
          meta: {
            title: '商品详情'
          }
        },
        {
          path: 'myComment',
          name: 'myComment',
          component: myComment,
          meta: {
            title: '我的评论'
          }
        },
        {
          path: 'myCommentDetails',
          name: 'myCommentDetails',
          component: myCommentDetails,
          meta: {
            title: '评论详情'
          }
        },
        {
          path: 'myInformation',
          name: 'myInformation',
          component: myInformation,
          meta: {
            title: '我的信息'
          }
        },
        {
          path: 'myInformation/age',
          name: 'age',
          component: age
        },
        {
          path: 'myInformation/job',
          name: 'job',
          component: job
        },
        // 发票管理
        {
          path: 'invoice',
          name: 'invoice',
          component: invoice.invoice,
          children: [
            {
              path: 'titleList',
              name: '发票抬头',
              component: invoice.titleList
            },
            {
              path: 'history',
              name: '历史记录',
              component: invoice.history
            },
            {
              path: 'apply',            //抽象组件，电子和纸质不一样
              name: '申请发票',
              component: invoice.apply
            }
          ]
        },
        //添加抬头
        {
          path: 'invoice/titleAdd',
          name: '抬头详情',                       
          component: invoice.titleAdd,
          children: [
            {
              path: 'addCompany',
              name: '单位',
              component: invoice.addCompany
            },
            {
              path: 'addPerson',
              name: '个人',
              component: invoice.addPerson
            }
          ]
        },
        //申请发票，编辑单位或个人
        {
          path: 'invoice/titleApply',
          name: '抬头详情',                       
          component: invoice.titleApply,
          children: [
            {
              path: 'applyCompany',
              name: '单位',
              component: invoice.applyCompany
            },
            {
              path: 'applyPerson',
              name: '个人',
              component: invoice.applyPerson
            }
          ]
        },
        {
          path: 'invoice/titleEdit/company',
          name: '编辑单位',
          component: invoice.titleEditCompany
        },{
          path: 'invoice/titleEdit/person',
          name: '编辑个人',
          component: invoice.titleEditPerson
        },{
          path: 'invoice/listCompany',
          name: '单位列表',
          component: invoice.listCompany
        },{
          path: 'invoice/listPerson',
          name: '个人列表',
          component: invoice.listPerson
        },{
          path: 'invoice/infoCompany',
          name: '单位抬头信息页面',
          component: invoice.infoCompany
        },{
          path: 'invoice/infoPerson',
          name: '个人抬头信息页面',
          component: invoice.infoPerson
        }
      ],
    },{
      path: '*',
      redirect: '/'
    }
  ],
  linkActiveClass: 'active'
})
