import { mapGetters,mapActions,mapMutations } from 'vuex'
import * as TYPE from '../../store/actionType/orderType'
// import CartItemList from '../../components/cartControl/cartItemList.vue'  //购物车列表组件
import cartControl from '../../components/cartControl/cartControl.vue'
import orderRemark from '../../components/dialog/orderRemark.vue'
import recharge from '../../components/dialog/recharge.vue'
import chargeRules from '../../components/charge/chargeRules.vue'
import payThird from '../../components/dialog/payThird.vue'
import saveButton from './com/saveButton.vue'                 // 右下角按钮组件

import { rulesList, chargeWx, customerApi, orderStatus } from '../../fetch/api.js'
//shopMode 2:电视叫号 3:验证码 6:boss模式 超级模式 先付 后付
let _this = this;
export default {
  data(){
    return {
      orderRemarkFlag: false, // 显示口味组件
      payThirdFlag: false,    // 显示第三方支付组件
      remarkTxt: '',
      useAccount: true,       // 是否适用余额
      chargeList: [],         // 充值优惠列表
      couponId: null,         // 使用的优惠券id
      parentOrderId: null,         // 父订单id
      // distributionModeId: null, // 就餐模式
      // tableNumber: null,      // 桌位号
      eventsNone: false,      // 屏蔽事件穿透
      lastOrder: {},          // 上个订单的状态（是否可以继续选购）
      orderBossId: null,       // 传入的订单id
      articleFree: {},         // 被产品全抵扣的菜品
    }
  },
  components: {
    cartControl,
    orderRemark,
    recharge,
    payThird,
    chargeRules,
    SaveButton: saveButton,
    // CartItemList
  },
  watch: {
    // "totalMoney": {
    //   immediate: true,
    //   handler: function(newVal, oldVal) {
    //     if (newVal > this.customer.account) {
    //       this.useAccount = false;      // 余额小于订单总额，不能打开余额支付
    //     }
    //   }
    // },
    "useAccount": {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal != oldVal) {
          this.alterOrderParams({useAccount: this.useAccount});
        }
      }
    },
    // 切换优惠券
    'couponId': function(newVal, oldVal) {
      if (newVal) {
        // 这个操作意义不到，后付情况传了useCoupon也不会保存
        let _params = {
          useCoupon: newVal,
        }
        let index = this.listCoupon0.findIndex(c => c.id==newVal)
        // 获取产品券抵扣的菜品
        let coupon = this.listCoupon0[index]
        if (coupon.couponShopArticlesList && coupon.couponShopArticlesList.length > 0) {
          for (let _a of coupon.couponShopArticlesList) {
            let idx = this.cartItem.findIndex(a => a.count>0 && a.id==_a.articleId)
            if (idx !== -1) {
              this.articleFree = _a;
              if (coupon.value <= this.cartItem[idx].calcPrice) {
                this.articleFree.deductMoney = coupon.value;
              } else {
                this.articleFree.deductMoney = this.cartItem[idx].calcPrice
              }
              _params.useProductCoupon = 1;
              _params.productCouponArticleId = this.articleFree.articleId;
              _params.productCouponMoney = this.articleFree.deductMoney;
              break;
            }
          }
        } else {
          this.articleFree = {}
        }
        // 修改订单参数 
        this.alterOrderParams(_params);
      }
    },
    // 默认选一张优惠券
    "listCoupon": function(listCoupon, oldVal) {
      if (this.listCoupon[0] && !this.couponId) {
        this.couponId = this.listCoupon[0].id;
      }
    },
    "cartItem": {
      handler: function(cartItem) {
        //下单页，把购物车数量改为0的情况
        if (this.totalNumber === 0) {
          this.$router.push({path: '/user/order'})          
        }
        this.setOrderParams();
      },
      // immediate: true
    }
  },
  computed: {
    ...mapGetters([
      'customer',
      'chargeDialog',
      'orderParams',
      'shop',
      'cartItem',
      'lastCartItem',
      'totalPrice',               // 取粉丝价的总和
      'totalPriceOrigin',         // 真原价的总和 
      'totalNumber',
      'totalOrderNumber',
      'memberActivityByTelephone',// 折扣
      'listCoupon0',              // 优惠券
    ]),
    // 可以使用的优惠券
    listCoupon() {
      let distributionModeId = this.orderParams.distributionModeId || this.lastOrder.distributionModeId;
      // console.log(distributionModeId, '----')
      distributionModeId = 1;
      let listCoupon = this.listCoupon0.filter(coupon => {
        // 有堂食 外带的限制
        if (coupon.distributionModeId == distributionModeId) {
          // todo 判断是否可以和余额一起使用

          // 产品券 点单中的单品类型的菜品是否有符合的
          let findRelativeArticle = false;
          this.cartItem && this.cartItem.forEach(a => {
            if (a.count>0 && a.foodType == 1) {//服务端type定义 1：无规格单品，2：老规格单品，3：套餐主品，4:套餐的子菜 5：新规格单品 6:推荐配餐 8：重量包
              if (coupon.couponShopArticlesList && coupon.couponShopArticlesList.length > 0) {
                let index = coupon.couponShopArticlesList.findIndex(_a => _a.articleId == a.id)
                if (index != -1) {
                  findRelativeArticle = true;
                }
              }
            }
          })
          // 只有先付模式可以使用优惠券
          if (findRelativeArticle == false || this.shop.allowAfterPay==0) {
            return false; // 和下单菜品没有关联 直接false
          }

          // 消费金额超过多少，可以激活优惠券道具的使用
          if ( this.totalMoney >= coupon.minAmount) {
            let now = new Date();
            // 日期范围内
            if (now.getTime() >= coupon.beginDate.time && now.getTime() <= coupon.endDate.time) {
              let beginTime = new Date(coupon.beginTime.time);
              let endTime = new Date(coupon.endTime.time);
              // 时间段范围内
              if (now.getHours() >=beginTime.getHours() && now.getHours() <= endTime.getHours()) {
                if (now.getHours() === beginTime.getHours()) {
                  if (now.getMinutes() >= beginTime.getMinutes()) {
                    return true;
                  }
                } else if (now.getHours() === endTime.getHours()) {
                  if (now.getMinutes() <= now.getMinutes()) {
                    return true;
                  }
                } else {
                  return true;
                }
              }
            }
          }
        } else {
          return false;
        }
      })

      
      
      return listCoupon;
    },
    // 菜品总价+餐盒费+服务费
    // 此计算属性被子类覆盖实现
    // totalMoney() {
    //   // 1+3种情形
    //   // 1.先付
    //   // 2.后付-第一次
    //   // 3.后付-继续选购
    //   // 4.后付-立即支付（不会加上购物车里的钱）
    //   let totalMoney = 0;
    //   // 总价 
    //   totalMoney = this.totalPrice;
    //   // 后付：不允许外带  注意：这里用到服务端的钱字段，都是存的会员折扣后的钱
    //   // 后付-“继续选购|第一次下单”
    //   let orderMoney = this.lastOrder.amountWithChildren || this.lastOrder.orderMoney || 0; // 已经点过的菜价格总和
    //   if (orderMoney == 0) {
    //     //则为后付的 第一次下单，加 服务费(服务费只计算一次)
    //     totalMoney += (this.shop.servicePrice || 0);
    //   }
    //   if (this.memberActivityByTelephone && this.memberActivityByTelephone.discount) {
    //     totalMoney = totalMoney * (this.memberActivityByTelephone.discount*100)/100 + orderMoney; //继菜的折扣价
    //   } else {
    //     totalMoney = totalMoney + orderMoney; // 不是会员            
    //   }
    //   return totalMoney;
    // },
    // 折扣后的总价
    totalMoneyAfterDiscount() {
      let needPay = 0;

      // 计算会员折扣
      if (this.memberActivityByTelephone && this.memberActivityByTelephone.discount) {
        if (this.orderBossId) {
          //  后付‘立即支付’   是用后端返回的钱，不能再进行折扣计算
          needPay = parseFloat(this.totalMoney.toFixed(2));
        } else {
          let m = this.totalMoney * (this.memberActivityByTelephone.discount*100)/100;
          needPay = parseFloat(m.toFixed(2))
        }
      } else {
        needPay = parseFloat(this.totalMoney.toFixed(2));
      }
      
      // 先算会员折扣，再减去优惠券
      
      // 先付 是否有产品券抵扣
      if (this.shop.allowFirstPay===0 && this.articleFree.deductMoney) {
        needPay -= this.articleFree.deductMoney
      }

      return needPay;
    },
    // price+pay = 折扣后的总额
    // 系统内支付的钱 优惠券 红包 开启余额情况下余额
    price() {
      // 优惠券
      // 注意：后付加菜的订单是不允许使用优惠券的
      // let needMoney = this.totalMoneyAfterDiscount;
      let price = 0;        //道具可以抵扣的总金额之和
      let couponId = this.couponId;
      // 余额
      if (this.useAccount) {
        // let diffPrice = this.totalMoneyAfterDiscount - price;
        if (this.customer.account >= this.totalMoneyAfterDiscount) {
          price = this.totalMoneyAfterDiscount;
        } else {
          price = this.customer.account;
        }
      }
      return parseFloat(price.toFixed(2));
    },
    // 第三方需要支付的钱
    pay() {
      let pay = this.totalMoneyAfterDiscount - this.price;
      return parseFloat(pay.toFixed(2));
    }
  },
  // 此方法不同模式下，会有不同的处理
  async created() {

    // 支付方式列表
    let ruleRes = await rulesList.getRulesList();
    this.chargeList = ruleRes.data;

  },
  methods:{
    ...mapMutations([
      'addShopCart',
      'cutShopCart'
    ]),
    showOrderRemark() {
      this.orderRemarkFlag = true;
    },
    closeOrderRemark(remarkTxt) {
      this.remarkTxt = remarkTxt;
      this.orderRemarkFlag = false;
    },
    close() {
      this.$router.push({ path: '/user/order'});
    },
    // 设置之前点过菜列表
    async setLastCartItem(orderId) {
      // 定义选购的
      try {
        let param = {id: orderId};
        let res = await orderStatus.getOrderDetail($.param(param));
        let orderDetail = res.data || {};
        this.lastOrder = orderDetail;
        let lastOrderItem = [];
        // debugger;
        // console.log(orderDetail)
        orderDetail.orderItems && orderDetail.orderItems.forEach(item => {
          if (item.parentId === '') {
            if (item.type == 1) {
              item.foodType = 1;
              item.name = item.articleName;
            } else if (item.type == 2) {
              item.foodType = 3;
              item.name = item.articleName;            
            } else if (item.type == 3) {
              item.foodType = 2;
              item.name = item.articleName;            
            } else if (item.type == 5) {
              item.foodType = 4;
              item.name = item.articleName;            
            } else if (item.type == 8) {
              item.foodType = 5;
              item.name = item.articleName;            
            }
            // 加工 套餐的children 
            // 套餐的情况
            // parentId和 主菜中id对应
            // 并且 套餐的数据是会给两份 1）主菜同级会有，2）主菜有个属性children属性包含了 套餐的子菜
            lastOrderItem.push(item);
          }
        })
        // 推荐配菜的情况
        // parentId和 主菜中articleId对应 同级
        lastOrderItem.length > 0 && orderDetail.orderItems.forEach(item => {  
          if (item.parentId && item.parentId.length > 0) {
            let index = lastOrderItem.findIndex(t => t.articleId === item.parentId)
            if (index !== -1) {
              if (!lastOrderItem[index].recommendArticlesChoose) {
                lastOrderItem[index].recommendArticlesChoose = []
              }
              lastOrderItem[index].recommendArticlesChoose.push(item); 
            }
          }
        })
        console.log(JSON.stringify(lastOrderItem));
          
        this.$store.commit('setLastCartItem', lastOrderItem);
      } catch(e) {
        alert(e.message)
      }
    },
    // 客户端foodtype定义 1：我是单品；2：我是套餐；3：单品老规格； 4：单品新规格；5：重量包；
    // 服务端type定义 1：无规格单品，2：老规格单品，3：套餐主品，4:套餐的子菜 5：新规格单品 6:推荐配餐 8：重量包
    // let params = {orderArray: '{"customerId":"51e57b47f51348819dd4c22208ff61a2","distributionModeId":1,"useAccount":true,"orderItems":[{"articleId":"d3d84fefcb334dc59be708ab2d3e3bf6","count":1,"type":1,"discount":100}],"waitMoney":0,"waitId":null,"servicePrice":0,"mealFeePrice":0,"mealAllNumber":0,"beforeId":null,"paymentAmount":0,"memberDiscountMoney":0.15000000000000002,"memberDiscount":0.85,"groupId":null,"payType":0}'};
    // 下单：只是saveOrder 买单：saveOrder+支付 | 后付模式则调用payAfter
    async createOrder(type) {
      try {
        // 下单
        this.saveOrder();
      } catch(e) {
        this.$kiko_message({
          isShow: true,
          message: e.message,
          time: 2000,
          type: 2
        })
      }
    },
    async saveOrder() {
      try {
        // saveOrder
        // let params = {shopId: this.shop.id, payMode: 0};

        // let checkRes = await chargeWx.checkShopOpenNewPosNow($.param(params));
        // if (checkRes.success == true) {
          // 上传订单信息
          let params = {orderArray: JSON.stringify(this.orderParams)};
          let orderRes = await chargeWx.saveOrder($.param(params));
          if (orderRes.success == true) {
            let orderid = orderRes.data.id;
            // let parentOrderId = orderRes.data.parentOrderId;
            // let factMoney = orderRes.data.paymentAmount;
            // 清空购物车|后付模式，标记已购买
            this.$store.commit('clearCartItem');
            this.$store.commit('clearLastCartItem');
            // 刷新余额
            await this.$store.dispatch('getCustomer', {code: ''});
            // 刷新优惠券
            await this.$store.dispatch('SET_LIST_COUPON_BY_STATUS');
            // 跳转到我的页面
            this.$router.push({ path: '/user/my', query:{orderid: orderid}});
          } else {
            throw new Error(orderRes.message)
          }
        // } else {
        //   throw new Error(checkRes.message)
        // }
      } catch(e) {
        this.$kiko_message({
          isShow: true,
          message: e.message,
          time: 2000,
          type: 2
        })
      }
    },
    alterOrderParams(partParams) {
      this.$store.commit(TYPE.SET_ORDER_PARAMS, {...this.orderParams, ...partParams});
    },
    // 设置下单参数
    setOrderParams(){
      let typeMap = {
        1: 1,
        2: 3,
        3: 2,
        4: 5,
        5: 8
      }
      let orderItems = [];
      this.cartItem.forEach(item => {
        if (item.count > 0) {
          let foodInfo = {
            articleId: item.id,
            articleName: item.name,
            count: item.count,
            type: typeMap[item.foodType],
            discount: item.discount,
            price: item.calcPrice
          };
          // 套餐
          if (item.foodType == 2) {
            //"mealItems": [7263, 7264, 7269, 7270],
            let mealItems = [];
            foodInfo['mealItems'] = item.mealAttrsChoose.forEach(attr => {
              attr.mealItems.forEach(mealItem => {
                if (mealItem.click === true) {
                  mealItems.push(mealItem.id);
                }
              })
            });
            foodInfo.mealItems = mealItems;
          }
          // 老规格articlId 拼接unitIds
          if (item.foodType == 3) {
            foodInfo.articleId += "@" + item.unitIds;//unitIds：规格的id
          }
          // 新规格articleName
          if (item.foodType == 4) {
            let newUnitName = ''
            item.unitListChoose[0].details.forEach(newUnit => {
              if (newUnit.click === true) {
                newUnitName = newUnit.name
              }
            })
            foodInfo.articleName += '('+newUnitName+')';
          }

          orderItems.push(foodInfo);
          // if have 推荐配餐
          if (item.recommendId && item.recommendId.length>0) {
            item.recommendArticlesChoose && item.recommendArticlesChoose.forEach(recomFood => {
              if (recomFood.count && recomFood.count >= 1) {
                let subFoodInfo = {
                  parentId: item.id,
                  articleId: recomFood.articleId,
                  count: recomFood.count,
                  type: 6,
                  discount: 100
                }
                orderItems.push(subFoodInfo);
              }
            })
          }
        }
      })

      // 餐盒费计算
      let mealAllNumber = 0;  //盒子总数量
      let mealFeePrice = 0;
      if (this.shop.isMealFee == 1 && this.orderParams.distributionModeId == 3) {// 外带
        // 餐盒费 = 餐盒单价 * 菜品数量 * 餐盒数量
        // mealFeeNumber 餐盒数量 一份菜需要多个盒子的情况
        this.cartItem.forEach(item => {
          if (item.count > 0) {
            let mealFeeNumber = item.mealFeeNumber || 1;
            mealAllNumber += item.count * mealFeeNumber;
            if (item.recommendId && item.recommendId.length > 0) {
              item.recommendArticlesChoose && item.recommendArticlesChoose.forEach(recomFood => {
                if (recomFood.count && recomFood.count > 0) {
                  mealAllNumber += recomFood.count * 1;// 推荐菜 一个菜只算一个盒
                }
              })
            }
          }
        })
        mealFeePrice = this.shop.mealFeePrice * mealAllNumber;
      }

      //实际支付金额

      let payType = this.shop.allowFirstPay === 0 ? 0 : 1;
      let orderParams = {
        customerId: this.customer.id,
        useAccount: this.useAccount,
        useCoupon: this.couponId, //使用的优惠券id
        orderItems: orderItems, // 购物车菜品列表
        waitMoney: 0,           //等位金额
        waitId: null,           //等位id
        servicePrice: this.shop.servicePrice,        //桌位费
        mealAllNumber: mealAllNumber,       //餐盒数
        mealFeePrice: mealFeePrice,         //餐盒费
        beforeId: null,         //预点餐的id 锅底
        paymentAmount: 0,       //实际支付金额
        "memberDiscount": this.memberActivityByTelephone.discount,        // 会员折扣
        "memberDiscountMoney": this.totalMoney - this.totalMoneyAfterDiscount,
        groupId: null,          //多人
        "totalPrice":null,
        "customerCount":0,
        payType: payType,        //0:先付 1:后付
        // "payMode": null             //1: 微信  2：支付宝
      }
      // this.$store.commit(TYPE.SET_ORDER_PARAMS, {...this.orderParams, ...orderParams});
      this.alterOrderParams(orderParams);
    },
    addToShopCart(a){
      this.addShopCart(a);
    },
    cutToShopCart(a){
      this.cutShopCart(a);
    },
    penScan() {

    },
    getIscroll(iscroll) {
      if (iscroll) {
        iscroll.on('scrollEnd', function() {
          console.log("scrollEnd");
        });
      }
    },
    switchUseAccount() {
      this.eventsNone = true;
      // 判断余额是否够
      if (this.customer.account >= this.totalMoney) {

        this.useAccount= !this.useAccount;
        setTimeout(()=>{
          this.eventsNone = false;
        }, 400)
      }
    }
  },
  filters: {
    //distributionModeId 1: 堂食  2: 外卖 3: 外带
    modeType(type) {
      let cfg = {
        1: '堂食',
        2: '外卖',
        3: '外带'
      }
      return cfg[type]
    }
  },
  beforeDestroy() {
    // 清除 下过的单的菜
    this.$store.commit('clearLastCartItem');
    // 清除 orderParams
    this.$store.commit(TYPE.SET_ORDER_PARAMS, {});
  }
}