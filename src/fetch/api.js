import * as url from './urlConfig'
import {serverRoot,root} from '../config/serverConfig';
import axios from 'axios'
// axios.defaults.headers.common['brandId'] = "111111";
//微信配置信息
export const wxConfigApi = {
  config(data) {
    return axios.post(url.wxConfig, data).then((response) => {
      return response.data
    })
  }
}

//获取注册优惠券
export const registerCoupon = {
  coupon(data) {
    return axios.post(url.customerCoupon,data).then((response) => {
      return response.data
    })
  }
}

//注册验证
export const checkApi = {
  registered() {
    return axios.post(url.checkRegistered).then((response) => {
      return response.data
    })
  }
}

//轮播图
export const bannerApi = {
  banner() {
    return axios.post(url.banner).then((response) => {
      return response.data
    })
  }
}
//店铺介绍
export const advertApi = {
  advert() {
    return axios.post(url.advert).then((response) => {
      return response.data
    })
  }
}
//品牌设置
export const settingApi = {
  setting() {
    return axios.post(url.setting).then((response) => {
      return response.data
    })
  }
}
//店铺参数
export const shopApi = {
  async shop() {
    return axios.post(url.shop).then((response) => {
      return new Promise(function(resolve,reject){
        if(response){
          resolve(response.data);
        }else{
          reject('失败');
        }
      })
    })
  },
  async noticeList(data) {
    let response = await axios.post(url.noticeList, data)
    return response.data;
  },
  async addNoticeHistory(data) {
    let response = await axios.post(url.addNoticeHistory, data)
  },
  async moduleSetting() {
    let response = (await axios.post(url.moduleSetting, )).data
    return response.data;
  }
}
//评论总数
export const appraiseCountApi = {
  count() {
    return axios.post(url.appraiseCount).then((response) => {
      return response.data
    })
  }
}
//评论总数
export const listAppraiseApi = {
  appraise(data) {
    return axios.post(url.listAppraise,data).then((response) => {
      return response.data
    })
  }
}
//个人信息
export const customerApi = {
  updateCustomerShareLink(data) {
    return axios.post(url.updateCustomerShareLink, data).then((response) => {
      // return response.data
        return new Promise(function(resolve,reject){
          if(response){
            resolve(response.data);
          }else{
            reject('失败');
          }
        })
    })
  },
  customer(data){
    return axios.post(url.customer, data).then((response) => {
      // return response.data
        return new Promise(function(resolve,reject){
          if(response){
            resolve(response.data);
          }else{
            reject('失败');
          }
        })
    })
  },
  // 会员折扣
  getMemberActivityByTelephone(data) {
    return axios.post(url.getMemberActivityByTelephone, data).then((response) => {
      return new Promise(function(resolve,reject) {
        if(response){
          resolve(response.data);
        }else{
          reject('失败');
        }
      })
    })
  },
  // 获取用户的最后一订单
  lastOrderByCustomer(data) {
    return axios.post(url.lastOrderByCustomer, data).then((response) => {
      return new Promise(function(resolve,reject) {
        if(response){
          resolve(response.data);
        }else{
          reject('失败');
        }
      })
    })
  },
  // 充值活动banner图片
  async selectBanner(data) {
    let url = serverRoot + '/wechat/svip/selectBanner'
    let response = await axios.post(url, data)
    return response.data
  },
  // 付费会员充值接口
  async svipChargeWx(data) {
    let url = serverRoot + '/wechat/svipCharge/svipChargeWx'
    let response = await axios.post(url, data)
    return response.data
  },
  // 查询用户是否为付费会员
  async getCustomerSvip(data) {
    let url = serverRoot + '/wechat/svip/getCustomerSvip'
    let response = await axios.post(url, data)
    return response.data
  }
}
//账户流水
export const accountApi = {
  account() {
    return axios.post(url.account).then((response) => {
      return response.data
    })
  }
}
//优惠券
export const couponApi = {
  coupon(data) {
    return axios.post(url.coupon,data).then((response) => {
      return response.data
    })
  }
}
//账户可提现余额
export const remainApi = {
  remain() {
    return axios.post(url.remain).then((response) => {
      return response.data
    })
  }
}
//账户可提现余额
export const getCashApi = {
  getCash(data) {
    return axios.post(url.getCash,data).then((response) => {
      return response.data
    })
  }
}
//所有店铺菜品类型
export const articleApi = {
  articleType(data) {
    return axios.post(url.articleType,data).then((response) => {
      return response.data
    })
  }
}
//所有店铺的菜品
export const articleListApi = {
  // 所有菜品
  article(data) {
    return axios.post(url.article,data).then((response) => {
      return response.data
    })
  },
  // 获取推荐列表
  getRecommend(params) {
    return axios.post(url.getRecommend, params).then(response => response.data)
  },
  // 获取unit
  getUnit(params) {
    return axios.post(url.getUnit, params).then(response => response.data)
  },
  // 获取重量包
  getWeight(params) {
    return axios.post(url.getWeight, params).then(response => response.data)
  }

}


//所有店铺
export const shopListApi = {
  selectByShopCity() {
    return axios.post(url.selectByShopCity).then((response) => {
      return response.data
    })
  },
  shopList(data) {
    return axios.post(url.shopList,data).then((response) => {
      return response.data
    })
  }
}
//用户最新订单
export const newPackageApi = {
  new() {
    return axios.post(url.newPackage).then((response) => {
      return response.data
    })
  }
}
//邀请返利人数
export const shareCountApi = {
  share(data) {
    return axios.post(url.shareCount,data).then((response) => {
      return response.data
    })
  }
}
//点赞
export const praiseApi = {
  praise(data) {
    return axios.post(url.praise,data).then((response) => {
      return response.data
    })
  }
}
//取消赞
export const cancelPraiseApi = {
  cancel(data) {
    return axios.post(url.cancelPraise,data).then((response) => {
      return response.data
    })
  }
}
//评论
export const submitAppraise = {
  // 保存评论（旧） 
  saveAppraise(data) {
    return axios.post(url.saveAppraise, data).then((response) => {
      return response.data
    })
  },
  // 获取后台设置用户评论标签
  listShowPhoto() {
    return axios.post(url.listShowPhoto).then((response) => {
      return response.data
    })
  },
  // 红包评论
  addPraise(data) {
    return axios.post(url.addPraise, data).then((response) => {
      return response.data
    })
  },
  // 获取之前的评论信息
  getAppraiseByOrderId(data) {
    return axios.post(url.getAppraiseByOrderId, data).then((response) => {
      return response.data
    })
  },
  getShareDetailed(data) {
    return axios.post(url.getShareDetailed, data).then((response) => {
      return response.data
    })
  },
  // 普通评论(主界面评论)
  submit(data) {
    return axios.post(url.appraise,data).then((response) => {
      return response.data
    })
  }
}


//我的评论数
export const myAppraiseCountApi = {
  count() {
    return axios.post(url.myAppraiseCount).then((response) => {
      return response.data
    })
  }
}

//我的评论列表
export const appraiseCustomerApi = {
  appraiseList(data) {
    return axios.post(url.appraiseCustomer,data).then((response) => {
      return response.data
    })
  }
}

//我的评论详情
export const getAppraiseInfo = {
  detail(data) {
    return axios.post(url.getAppraiseInfo,data).then((response) => {
      return response.data
    })
  }
}

//切换店铺
export const switchShopInfo = {
  switch(data) {
    return axios.post(url.swtichShop+data).then((response) => {
      return response.data
    })
  }
}

//用户生日保存
export const modifyBirthDate = {
  submit(data) {
    return axios.post(url.modifyBirthDate,data).then((response) => {
      return response.data
    })
  }
}

//获取职业信息
export const vocationlist = {
  get() {
    return axios.post(url.vocationlist).then((response) => {
      return response.data
    })
  }
}

//用户个人信息修改
export const modifyCustomer = {
  change(data) {
    return axios.post(url.modifyCustomer,data).then((response) => {
      return response.data
    })
  }
}

// 准备下单界面
export const rulesList = {
  // 获取充值列表
  getRulesList() {
    return axios.post(url.rulesList).then((response) => {
      return response.data
    })
  },
  // 获取桌号
  getTable(data) {
    return axios.post(url.getTable, data).then(res => {
      return res.data;
    })
  }
}

// 获取充值 & 支付相关接口
export const chargeWx = {
  // 获取微信充值|支付的配置
  jsWxPayconfig() {
    return axios.post(url.jsWxPayconfig).then(response => {
      return response.data;
    })
  },
  // 微信充值签名
  getChargeWx(data) {
    return axios.post(url.chargeWx, data).then(response => {
      return response.data;
    })
  },
  // 是否开启newPos
  checkShopOpenNewPosNow(data) {
    return axios.post(url.checkShopOpenNewPosNow, data).then(response => {
      return response.data;
    })
  },
  // 上传订单信息
  saveOrder(data) {
    return axios.post(url.saveOrder, data).then(response => {
      return response.data;
    })
  },
  // 获取微信支付签名
  payOrderWx(data) {
    return axios.post(url.payOrderWx, data).then(response => {
      return response.data;
    })
  },
  // 获取微信支付签名(此接口暂时不用)
  payOrderWxNew(data) {
    return axios.post(url.payOrderWxNew, data).then(response => {
      return response.data;
    })
  },

}

export const orderStatus = {
  // 所有订单列表
  listOrder(data) {
    return axios.post(url.listOrder, data).then(response => {
      return response.data;
    })
  },
  // 我的页面 当前处理订单
  customerNewOrder(data) {
    return axios.post(url.customerNewOrder, data).then(response => {
      return response.data;
    })
  },
  // 顾客排队队列
  readylistOrder(data) {
    // 参数传，但orderId为空
    return axios.post(url.readylistOrder, data).then(response => {
      return response.data;
    })  
  },
  // 轮询订单状态
  getOrderStates(data) {
    return axios.post(url.getOrderStates, data).then(response => {
      return response.data;
    })
  },
  // 打印订单
  pushOrder(data) {
    return axios.post(url.pushOrder, data).then(response => {
      return response.data;
    })
  },
  // 获取某个订单的详情
  getOrderDetail(data) {
    return axios.post(url.getOrderDetail, data).then(response => {
      return response.data;
    })
  },
  // 后付
  afterPay(data) {
    return axios.post(url.afterPay, data).then(response => {
      return response.data;
    })
  },
  // 取消支付
  async refundPaymentByUnfinishedOrder(data) {
    let response = await axios.post(url.refundPaymentByUnfinishedOrder, data);
    return response.data;
  }
}

// 发送短信
export const sendCode = {
  // 普通
  sendMes(data) {
    return axios.post(url.message, data).then((response) => {
      return response.data
    })
  },
  //阿里服务
  sendAliMes(data) {
    return axios.post(url.aliMessage, data).then((response) => {
      return response.data
    })
  }
}

// 发送短信
export const editPhone = {
  bind(data) {
    return axios.post(url.bindPhone, data).then((response) => {
      return response.data
    })
  }
}

// 支票相关接口
export const invoiceApi = {
  async receiptTitleList(data) {
    let url = serverRoot + '/wechat/receipt/receiptTitleList';
    let response = await axios.post(url, data)
    return response.data
  },
  async insertReceiptTitle(data) {
    let url = serverRoot + '/wechat/receipt/insertReceiptTitle';
    let response = await axios.post(url, data)
    return response.data
  },
  async updateReceiptTitle(data) {
    let url = serverRoot + '/wechat/receipt/updateReceiptTitle'
    let response = await axios.post(url, data)
    return response.data
  },
  // 申请发票列表
  async receiptOrderList(data) {
    let url = serverRoot + '/wechat/receipt/receiptOrderList'
    let response = await axios.post(url, data)
    return response.data
  },
  // 点击“申请发票” (电子)
  async TicketToMany(data) {
    let url = serverRoot + '/wechat/receipt/TicketToMany'
    let response = await axios.post(url, JSON.stringify(data), {headers: {'Content-Type': 'application/json'}})
    return response.data
  },
  // 发送邮箱
  async sendEmail(data) {
    let url = serverRoot + '/wechat/receipt/sendEmail'
    let response = await axios.post(url, data)
    return response.data
  },
  // 纸质发票申请(批量申请)
  async insertReceipt(data) {
    let url = serverRoot + '/wechat/receipt/insertReceipt'
    let response = await axios.post(url, data)
    return response.data
  },
}

