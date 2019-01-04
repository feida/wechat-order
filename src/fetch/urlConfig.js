/**
 * Created by Administrator on 2017/12/11.陈泽
 */

// function getParam(name){
//   let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
//   let r = window.location.search.substr(1).match(reg);
//   if(r!=null)return unescape(r[2]);
//   return null;
// }
// const serverRoot = getParam(name);
import {serverRoot,root} from '../config/serverConfig';

console.log(serverRoot);

//微信jsconfig配置
export const wxConfig = serverRoot + '/wechat/jsconfig';

//注册优惠券
export const customerCoupon = serverRoot + '/wechat/customer/new/showCoupon';

//发送短信验证码
export const message = serverRoot + '/wechat/customer/new/sendCodeMsg';

//绑定手机号
export const bindPhone = serverRoot + '/wechat/customer/new/editPhone';

//发送短信验证码
export const aliMessage = serverRoot + '/wechat/customer/new/sendAliCodeMsgNew';

//首页轮播图
export const banner = serverRoot + '/wechat/shop/new/pictureslider';

//店铺介绍
export const advert = serverRoot + '/wechat/shop/new/shopAdvert';

//店铺参数
export const shop = serverRoot + '/wechat/shop/new/currentshop';

//店铺公告|通知
export const noticeList = serverRoot + '/wechat/shop/new/noticeList';

//公告浏览次数
export const addNoticeHistory = serverRoot + '/wechat/shop/new/addNoticeHistory';

//评论总数
export const appraiseCount = serverRoot + '/wechat/appraise/new/appraiseCount';

//评论查询评论列表
export const listAppraise = serverRoot + '/wechat/appraise/new/listAppraise';

//品牌设置
export const setting = serverRoot + '/wechat/setting';

//点击分享链接进入，后回调地址
export const updateCustomerShareLink = serverRoot + '/wechat/customer/new/updateCustomerShareLink';

//用户信息
export const customer = serverRoot + '/wechat/customer/new/customer';

//二维码
// export const code = serverRoot + '/wechat/customer/new/vCode';

//账户流水
export const account = serverRoot + '/wechat/customer/informationAccountAjax';

//优惠券
export const coupon = serverRoot + '/wechat/customer/new/listCouponByStatus';

//账户可提现余额
export const remain = serverRoot + '/wechat/customer/withdrawalsRemaim';

//账户可提现余额
export const getCash = serverRoot + '/wechat/customer/withdrawals';

//所有店铺菜品类型
export const articleType = serverRoot + '/wechat/article/new/articleFamilyList';

//所有店铺的菜品
export const article = serverRoot + '/wechat/article/new/articleList';

//老规格推荐
export const getRecommend = serverRoot + '/wechat/order/new/getRecommend';

//新规格getUnit
export const getUnit = serverRoot + '/wechat/order/new/getUnit';

// 获取重量包
export const getWeight = serverRoot + '/wechat/article/articleWeightPackage';

// 获取开放的城市
export const selectByShopCity = serverRoot + '/wechat/shop/new/selectByShopCity';

//店铺
export const shopList = serverRoot + '/wechat/shop/new/selectByCityOrName';

//选择店铺
// export const changeShop = serverRoot + '/wechat/shop/new/switch/'+sid;

//获取邀请返利数量
export const shareCount = serverRoot + '/wechat/customer/new/shareCustomerCount';

//充值优惠列表
export const rulesList = serverRoot + '/wechat/charge/new/rulesList';

//充值配置
export const jsWxPayconfig = serverRoot + '/wechat/jsWxPayconfig';

//充值地址
export const chargeWx = serverRoot + '/wechat/charge/new/chargeWx';

//支付检测是否开启newpos
export const checkShopOpenNewPosNow = serverRoot + '/wechat/shop/checkShopOpenNewPosNow';

//获取加密的二维码
export const getTable = serverRoot + '/wechat/order/getTable';

//上传订单信息
export const saveOrder = serverRoot + '/wechat/order/new/saveOrder';

//获取微信支付签名接口
export const payOrderWxNew = serverRoot + '/wechat/order/new/payOrderWxNew';

export const payOrderWx = serverRoot + '/wechat/order/new/payOrderWx';

//会员折扣
export const getMemberActivityByTelephone = serverRoot + '/wechat/customer/getMemberActivityByTelephone';

//是否有消费红包
export const newPackage = serverRoot + '/wechat/order/new/customerNewPackage';

//点赞
export const praise = serverRoot + '/wechat/appraiseNew/save/praise';

//取消点赞
export const cancelPraise = serverRoot + '/wechat/appraiseNew/del/praise';

//用户红包评论标签
export const listShowPhoto = serverRoot + '/wechat/shop/new/listShowPhoto';

//用户红包评论(新)
export const addPraise = serverRoot + '/wechat/newAppraise/addAppraise';

//用户评论红包(旧)
export const saveAppraise = serverRoot + '/wechat/appraise/new/saveAppraise'
//获取评论信息
export const getAppraiseByOrderId = serverRoot + "/wechat/appraise/new/getAppraiseByOrderId"

//获取完整评论信息
export const getShareDetailed = serverRoot + "/wechat/appraise/new/getShareDetailed"

//用户回复
export const appraise = serverRoot + '/wechat/appraiseNew/save/comment';

//我的评论总数
export const myAppraiseCount = serverRoot + '/wechat/newAppraise/my/appraiseCount';

//我的评论列表
export const appraiseCustomer = serverRoot + '/wechat/newAppraise/appraiseCustomer';

//我的评论详情
export const getAppraiseInfo = serverRoot + '/wechat/appraise/new/getAppraiseInfo';

//切换店铺
export const swtichShop = serverRoot + '/wechat/shop/new/switch/';
// todo
export const moduleSetting = serverRoot + '/wechat/shop/new/moduleSetting'

//用户生日保存
export const modifyBirthDate = serverRoot + '/wechat/customer/new/modifyBirthDate';

//用户职业信息
export const vocationlist = serverRoot + '/wechat/other/vocationlist';

//用户个人信息修改
export const modifyCustomer = serverRoot + '/wechat/customer/new/modifyCustomer';


//订单列表
export const listOrder = serverRoot + '/wechat/order/new/listOrder';

//(我的页面)检测是否有处理中的订单
export const customerNewOrder = serverRoot + '/wechat/order/new/customerNewOrder';

// 等待队列接口
export const readylistOrder = serverRoot + '/wechat/order/new/readylistOrder';

//轮询订单状态
export const getOrderStates = serverRoot + '/wechat/order/new/getOrderStates';

//打印订单
export const pushOrder =  serverRoot + '/wechat/order/new/pushOrder';

//用户最近的一笔订单
export const lastOrderByCustomer = serverRoot + '/wechat/customer/new/lastOrderByCustomer';

//获取某个订单的详情
export const getOrderDetail = serverRoot + '/wechat/order/new/getOrderDetail'

//注册验证
export const checkRegistered =  serverRoot + '/wechat/customer/new/checkRegistered';

//后付支付
export const afterPay = serverRoot + '/wechat/order/new/afterPay';

//取消支付
export const refundPaymentByUnfinishedOrder = serverRoot + '/wechat/order/new/refundPaymentByUnfinishedOrder';


