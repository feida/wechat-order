import {
  settingApi,
  shopApi,
  articleApi,
  articleListApi
} from '../../fetch/api'
import * as TYPE from '../actionType/shopCartType'

import { calcPrice } from '../../components/dialog/articles.js'

// 加入购物车 缓存中读取count的计算
function calcCount(state, a, mode, countChange=1) {
  // mode 1:加入购物车；2：从购物车localstorage读取
  // 左侧count
  let familyIndex = state.familyListType.findIndex(arg => arg.id===a.articleFamilyId);
  if (familyIndex === -1) {
    // console.log(a, '-----')
    // 菜品被删除
    return;
  }
  if (mode === 1) {
    state.familyListType[familyIndex].count += countChange;
  } else if (mode === 2) {
    state.familyListType[familyIndex].count += a.count;
  }
  // state.familyListType = [...state.familyListType];
  // 列表中count
  let articleIndex = state.familyListType[familyIndex].articles.findIndex(arg => arg.id === a.id);
  if (a.foodType === 1 && !a.recommendId) {  // 右侧count，只有单品且没有推荐配菜才需要
    if (mode === 1) {
      state.familyListType[familyIndex].articles[articleIndex].count += countChange;
    } else if (mode === 2 ) {
      state.familyListType[familyIndex].articles[articleIndex].count = a.count;
    }
    state.familyListType[familyIndex].articles[articleIndex] = {...state.familyListType[familyIndex].articles[articleIndex]}; // props对象也要改
  }

  state.familyListType = [...state.familyListType];
}

// 补全article的recommendChoose mealAttrsChoose unitListChoose weightListChoose
// // foodType   1：我是单品；2：我是套餐；3：单品老规格； 4：单品新规格；5：重量包；
async function fixArticle(article) {
  // 是否在购物车中把这个菜删掉
  let cartNeedDelete = false;
  // 推荐配菜
  if (article.recommendId) {
    let params = {
      articleId: article.id,
      groupId: null
    }
    let data = await articleListApi.getRecommend($.param(params))
    if (data.data && data.data.articles && data.data.articles.length > 0) {
      data.data.articles.forEach(a => {
        // 统一用key photoSmall
        if (!a.imgUrl || a.imgUrl.length === 0) {
          a.photoSmall = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAEsAlgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAopskixjLHApEkWTO05oAfRSZozQAtFJmjNAC0UmaM0ALRSZozQAtFMaZFySwAHJOeBTlYNyDkUALRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAQXRX5ARuPJUdycdB74z+tfi/8AtTf8FLvjr4b/AGgPHWgeDvEsHhTQdC1e60e3srfTLO63rbzPF5rPPC7ZcqWwCFGcADBJ/aKaMybeARnnsR9K/Hn9qT/glv8AGfxf8fPG3iXwha6Xr+h6/qlzrEU8l7FavEbiVpWhZHYHKMxG4cMNrcEsqgHhv/D0T9p7/opZ/wDBBpn/AMjUf8PRP2nv+iln/wAEGmf/ACNW5/w6Y/aO/wCha0n/AMHNt/8AFUf8OmP2jv8AoWtJ/wDBzbf/ABVAGH/w9E/ae/6KWf8AwQaZ/wDI1H/D0T9p7/opZ/8ABBpn/wAjVuf8OmP2jv8AoWtJ/wDBzbf/ABVH/Dpj9o7/AKFrSf8Awc23/wAVQBh/8PRP2nv+iln/AMEGmf8AyNR/w9E/ae/6KWf/AAQaZ/8A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PE8OdssRPo6FkP8AvHviv6SvA3irT/HXhDRvEekytNper2UGoWsjAgtFLGsiHB5GVYHBr5vj/wCCXv7NS5P/AArPk9jr2p/XB/0np/nmvqLStNt9I0+3s7WCO2treNYYoYV2oiKMKqqOAAAAPYCgC3RRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf//Z';
        } else if ( ! article.photoSmall.match(/^(http|https).+/i)) {
          a.photoSmall = state.brandSetting.brand.wechatImgUrl + article.photoSmall;
        } else {
          a.photoSmall = a.imgUrl;
        }
      })
      article.recommend = data.data;
      article.recommendArticles = data.data.articles;
      if ( ! article.recommendArticlesChoose) {
        article.recommendArticlesChoose = data.data.articles; //选中的配菜  count:1+
      } else {
        // todo check
      }
    }
    
  } 
  if (article.foodType == 2) {                  // 套餐的配菜
    if ( ! article.mealAttrsChoose) {
      let params = {
        articleId: article.id,
      }
      article.mealAttrsChoose = article.mealAttrs;            //选中配菜 click：true,打完标记会存到cartItem
      for(var j in article.mealAttrsChoose){                  //默认必选的
        var attr = article.mealAttrsChoose[j];
        attr.currentItem = [];
        var hasDefault = false;
        for(var n in attr.mealItems){
          var item = attr.mealItems[n];
          if(item.isDefault && attr.choiceType == 0){ //必选 并且有默认值
            item.click =true;
          }else{
            item.click = false;
          }
          attr.currentItem.push(item);
        }
        if(attr.currentItem.length == 0 && attr.choiceType == 0){
          attr.currentItem = [];
          if(attr.mealItems.length > 0 ){
            attr.currentItem[0] = attr.mealItems[0];
            attr.mealItems[0].click = true;
          }
        }
      }
    }
  } else if (article.foodType == 3) {         // 老规格 没有编辑模式 永远把老数据copy一份过来
    // if ( ! article.articlePricesChoose) {
      article.articlePricesChoose = [...article.articlePrices]; 
    // }
  } else if (article.foodType == 4)  {        // 新规格的规格
    // 新规格
    let params = {
      articleId: article.id,
    }
    let unitList = (await articleListApi.getUnit($.param(params))).data
    article.unitList = unitList;
    if ( ! article.unitListChoose) {
      article.unitListChoose = unitList;                     // 用于保存编辑状态
    } else {
      // todo check 单位有没有变化
    }
      
  } else if (article.foodType == 5) {           // 重量包的重量包
    let params = {
      weightPackageId: article.weightPackageId,
    }
    let weightList = (await articleListApi.getWeight($.param(params))).data
    article.weightList = weightList
    if ( ! article.weightListChoose) {
      article.weightListChoose = weightList     // 用于保存编辑后的状态
    } else {
      // todo check 变化
    } 
  }

  return article;
}
// 检查购物车是否过期
function checkCartItemExpire() {
  let isExpire = false;
  let lifeTime = 10*3600;  //单位秒
  // let lifeTime = 60;  //单位秒 for test
  let currTime =  new Date().getTime()/1000
  let endTime = localStorage.getItem("cartItem-endtime");
  if (endTime) {
    if (currTime >= endTime) {
      isExpire = true;
      localStorage.setItem("cartItem-endtime", currTime + lifeTime);
    }
  } else {
    localStorage.setItem("cartItem-endtime", currTime + lifeTime);
  }
  return isExpire;
}

const state = {
  familyListType: [],   //菜品类型以及类型下菜品列表
  currentArticleType: {}, //当前菜品类型
  articleList: [],      //所有菜品
  familyList: [],       //服务端返回的所有菜品
  totalPrice: 0,        //总价
  totalNumber: 0,       //总数量
  cartItem: [],         //购物车的菜品项
  lastCartItem: [],     //后付模式 已经下过单的购物车项
  loadFamily: false,
  currentArticle: {},   // 当前弹出层选中的菜
  brandSetting: {},      // 品牌配置
  shop: {},             // 店铺设置(主要包括shop端店铺参数设置的一堆开关项)
};

const getters = {
  brandSetting: state => state.brandSetting,
  shop: state => state.shop,
  familyListType: state => state.familyListType,
  articleList: state => state.articleList,
  currentArticleType: state => state.currentArticleType,
  // familyList: state => state.familyList,
  loadFamily: state => state.loadFamily,
  cartItem: state => state.cartItem,
  lastCartItem: state => state.lastCartItem,
  // 粉丝价格计算后的总价
  totalPrice: function (state, getters) {
    let price = 0;
    // 购物车中菜品价格
    state.cartItem.forEach(function(article){
      // foodType   1：我是单品；2：我是套餐；3：单品老规格； 4：单品新规格；5：重量包；
      if (article.count > 0) {
        price += article.calcPrice * article.count;
      }
    })
    return price;
  },
  // 菜品原价的总价
  totalPriceOrigin: function (state, getters) {
    let price = 0;
    // 购物车中菜品价格
    state.cartItem.forEach(function(article){
      // foodType   1：我是单品；2：我是套餐；3：单品老规格； 4：单品新规格；5：重量包；
      if (article.count > 0) {
        price += article.price * article.count;
      }
    })
    return price;
  },
  // 购物车数量
  totalNumber: function(state, getters) {
    let count = 0;
    state.cartItem.forEach(function (article) {
      if (article.count) {
        count += article.count;
        // 推荐配菜算入菜品数量(看了简厨线上，不算配菜数量)
        // if (article.recommendId && article.recommendId.length > 0) {
        //   article.recommendArticlesChoose && article.recommendArticlesChoose.forEach(item => {
        //     if (item.count && item.count > 0) {
        //       count += item.count;
        //     }
        //   })
        // }
      }
    })
    return count;
  },
  // 购物车+已下单 总数量
  // todo 
  totalOrderNumber: function (state, getters) {
    let count = 0;
    count = getters.totalNumber;
    // 已经下过的单
    state.lastCartItem.forEach(article => {
      if (article.count) {
        count += article.count;
      } 
      if (article.recommendArticlesChoose && article.recommendArticlesChoose.length > 0) {
        article.recommendArticlesChoose.forEach(item => {
          if (item.count && item.count > 0) {
            count += item.count;
          }
        })
      }
    })
    return count;
  },
  currentArticle: state => {
    // 正常情况获取 familylistype中article 编辑模式获取购物车中的article信息
    let currentArticle = state.currentArticle;
    // if (Object.keys(currentArticle).length !== 0) {
    //   let cartItemIndex = state.cartItem.findIndex(arg => arg.id === state.currentArticle.id);
    //   if (currentArticle.foodType == 2) {       // 套餐
    //     currentArticle.count = 1;
    //   } else if (currentArticle.foodType == 4) {// 新规格
    //     // 通过生成的唯一索引查看购物车
    //     // if (currentArticle.cartItemIndex && state.cartItem[currentArticle.cartItemIndex]) {
    //     //   currentArticle.count = state.cartItem[currentArticle.cartItemIndex].count;
    //     // }
    //   } else if (cartItemIndex !== -1 ) {
    //     currentArticle.count = state.cartItem[cartItemIndex].count;
    //   } else {
    //     currentArticle.count = 0;
    //   }
    // }
    // currentArticle = {...currentArticle};
    return currentArticle;
  }
};

const actions = {
  async getArticlelist({dispatch, getters, commit, state}) {
    try {
      //品牌配置
      commit(TYPE.SET_SETTING, await settingApi.setting());
      //shop配置
      commit(TYPE.GET_SHOP_SUCCESS, await shopApi.shop());
  
      let param = {
        distributionModeId: 1
      };
      // 菜品分类列表
      commit(TYPE.FAMILY_SUCCESS, await articleApi.articleType($.param(param)));
      // 菜列表
      commit(TYPE.ARTICLE_LIST_SUCCESS, await articleListApi.article($.param(param)));
      // 获取localstorage购物车列表, 并更新
      let cartItem = JSON.parse(localStorage.getItem("cartItem-"+state.shop.id)) || [];
      let isExpire = checkCartItemExpire()
      if (isExpire) {
        cartItem = [];  //清空购物车
      }
      
      // 后面通过版本号删除
      // 先定时删除购物车,存在价格和服务端不一致的情况
      for (let i=0; i<cartItem.length; ++i) {
        let a = cartItem[i];
        let index = state.articleList.findIndex(serverArticle => serverArticle.id===a.id)
        if (index === -1) {
          // 有菜品下架，数量清零
          a.count = 0;
        } else if (state.articleList[index].isEmpty == true) {
          // 菜品已售磬，数量清零
          a.count = 0;          
        }
        // 校验逻辑请求太多
        // todo价格变化，后面通过版本号控制
        // a = {...a, ...state.articleList[index]}
        // a = await fixArticle(a)
        // // 配置变化，重新计算价格
        // a.calcPrice = calcPrice(a)
        cartItem[i] = a;
      }
      commit(TYPE.SET_CART_ITEM, {cartItem: cartItem});
      localStorage.setItem("cartItem-"+state.shop.id, JSON.stringify(state.cartItem));
      // 计算出familyListType(方便前端用)
      commit(TYPE.SET_FAMILY_LIST_TYPE);
    } catch(e) {
      alert('接口报错了');
      console.log(e);
    }
  },
  async [TYPE.SET_CURRENT_ARTICLE] ({
    commit, state
  }, payload) {
    let article = payload.currentArticle;
    article = await fixArticle(article);
    commit(TYPE.SET_CURRENT_ARTICLE, {currentArticle: article});
  },
  // 扫码 下单，缓存已下单的
  // setLastCartItem({commit}, payload) {
  //   commit('setLastCartItem', payload.parentOrderId);
  //   commit('clearCartItem');
  // } 
};

const mutations = {
  [TYPE.SET_SETTING](state, response) {
    state.brandSetting = response;
  },
  [TYPE.GET_SHOP_SUCCESS](state, res) {
    state.shop = res.data;
  },
  // 菜品分类列表
  [TYPE.FAMILY_SUCCESS](state, response) {
    state.familyList = response.data;
    let emptyFamily = {
      id:"-99999999",
      name:"已售罄",
      peference:9999
    };
    state.familyList.push(emptyFamily);
    state.currentArticleType = response.data[0];
  },
  // 菜品列表
  [TYPE.ARTICLE_LIST_SUCCESS](state, result) {
    state.articleList = result.data;
  },
  // 分类 菜品 合并列表
  [TYPE.SET_FAMILY_LIST_TYPE](state, payload) {
    let familyListType = [];
    state.familyList.forEach(function (family) {
      let f = family;
      f.articles = [];
      state.articleList.forEach(function (article) {
        // 右侧count
        let cartItemIndex = state.cartItem.findIndex(arg => arg.id === article.id)
        if (cartItemIndex !== -1) {
          article.count = state.cartItem[cartItemIndex].count;
        } else {
          article.count = 0;
        }
        // if (article.articlePrices.length > 0) {
        //   article.articlePrices.forEach(function (item) {
        //     item.number = 0;
        //   })
        // }
        if(f.peference == 9999){
          if(article.isEmpty){
            f.articles.push(article);
          }
        }
        if (article.articleFamilyId == f.id) {
          // foodType   1：我是单品；2：我是套餐；3：单品老规格； 4：单品新规格；5：重量包；
          let foodType = null;
          if(article.articleType == 1 && article.articlePrices.length == 0 && article.openCatty == 0 && !article.newUnit){   //纯单品
            foodType = 1;
          }else if(article.articleType == 2){   // 套餐
            foodType = 2;
            
          } else if(article.articlePrices.length>0){    // 老规格
            foodType = 3;
          }else if(article.openCatty == 1){     // 重量包
            foodType = 5;
          } else if (article.newUnit == 1) {
            foodType = 4;  // 新规格
          }
          article.foodType = foodType;
          // 各个尺寸图处理
          // 菜品图片显示   1大图  2小图  3无图  4超级大图  5正方形图
          if (article.photoType == 1) {
            article.bgPhoto = article.photoSmall;
          } else if (article.photoType == 2) {
            // img标签显示 article.photoLittle;
            article.bgPhoto = '';
          } else if (article.photoType == 3) {
            article.bgPhoto = '';
          } else if (article.photoType == 4) {
            article.bgPhoto = article.photoSuper;
          } else if (article.photoType == 5) {
            article.bgPhoto = article.photoSquareOriginal;
          }
          // 拼接图片地址
          if (!article.photoSmall || article.photoSmall.length === 0) {
            article.photoSmall = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAEsAlgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAopskixjLHApEkWTO05oAfRSZozQAtFJmjNAC0UmaM0ALRSZozQAtFMaZFySwAHJOeBTlYNyDkUALRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAQXRX5ARuPJUdycdB74z+tfi/8AtTf8FLvjr4b/AGgPHWgeDvEsHhTQdC1e60e3srfTLO63rbzPF5rPPC7ZcqWwCFGcADBJ/aKaMybeARnnsR9K/Hn9qT/glv8AGfxf8fPG3iXwha6Xr+h6/qlzrEU8l7FavEbiVpWhZHYHKMxG4cMNrcEsqgHhv/D0T9p7/opZ/wDBBpn/AMjUf8PRP2nv+iln/wAEGmf/ACNW5/w6Y/aO/wCha0n/AMHNt/8AFUf8OmP2jv8AoWtJ/wDBzbf/ABVAGH/w9E/ae/6KWf8AwQaZ/wDI1H/D0T9p7/opZ/8ABBpn/wAjVuf8OmP2jv8AoWtJ/wDBzbf/ABVH/Dpj9o7/AKFrSf8Awc23/wAVQBh/8PRP2nv+iln/AMEGmf8AyNR/w9E/ae/6KWf/AAQaZ/8A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PE8OdssRPo6FkP8AvHviv6SvA3irT/HXhDRvEekytNper2UGoWsjAgtFLGsiHB5GVYHBr5vj/wCCXv7NS5P/AArPk9jr2p/XB/0np/nmvqLStNt9I0+3s7WCO2treNYYoYV2oiKMKqqOAAAAPYCgC3RRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf//Z';
          } else if ( ! article.photoSmall.match(/^(http|https).+/i)) {
            article.photoSmall = state.brandSetting.brand.wechatImgUrl + article.photoSmall;
          }
          // 套餐图片地址
          if (foodType === 2) {
            article.mealAttrs.forEach(attr => {
              attr.mealItems.forEach(mealItem => {
                  if (!mealItem.photoSmall || mealItem.photoSmall.length === 0) {
                    mealItem.photoSmall = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAEsAlgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAopskixjLHApEkWTO05oAfRSZozQAtFJmjNAC0UmaM0ALRSZozQAtFMaZFySwAHJOeBTlYNyDkUALRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAQXRX5ARuPJUdycdB74z+tfi/8AtTf8FLvjr4b/AGgPHWgeDvEsHhTQdC1e60e3srfTLO63rbzPF5rPPC7ZcqWwCFGcADBJ/aKaMybeARnnsR9K/Hn9qT/glv8AGfxf8fPG3iXwha6Xr+h6/qlzrEU8l7FavEbiVpWhZHYHKMxG4cMNrcEsqgHhv/D0T9p7/opZ/wDBBpn/AMjUf8PRP2nv+iln/wAEGmf/ACNW5/w6Y/aO/wCha0n/AMHNt/8AFUf8OmP2jv8AoWtJ/wDBzbf/ABVAGH/w9E/ae/6KWf8AwQaZ/wDI1H/D0T9p7/opZ/8ABBpn/wAjVuf8OmP2jv8AoWtJ/wDBzbf/ABVH/Dpj9o7/AKFrSf8Awc23/wAVQBh/8PRP2nv+iln/AMEGmf8AyNR/w9E/ae/6KWf/AAQaZ/8AI1bn/Dpj9o7/AKFrSf8Awc23/wAVR/w6Y/aO/wCha0n/AMHNt/8AFUAYf/D0T9p7/opZ/wDBBpn/AMjU6P8A4KjftNpIrN8SQ4B+6+g6aAfytxW1/wAOmP2jv+ha0n/wc23/AMVTJ/8AglD+0hawvInhTTZ3UZVItatQx+mXA/M0AehfDn/gs18VvD9xGni/w9oHi2y6O0KSWFw3qQ6lkH4R1+gP7M//AAUM+En7SVxDpen6nJ4a8VygAaDrmIpZW5yIXBKS9+Ad5HJUV+IXxY/Zx+J3wSmC+OfBOseHo2bYLu5g3Wzt6LOhaNj9Grz+1kktXDLuilyrpICVKEHIYHqOcc0Af1N+avrxTlYN0r8vP+Cb/wDwUUvvEuq6V8J/ijqLXOoXDLbaD4hu2O+dicJazufvMxwI3PLE7SSxXP6fwkFflIK9R+tAEtFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUx1LMOMjB60+igDK1zw/ZeItKn03VLG11PTrlTHPY3kSywSqf4XVlII9sc8V+RP/AAUU/wCCctv8INNvfib8NbeT/hElffquhqpc6YCwHnRHJJh3HlSPkAHO37v7F1Q1zSbPXtJvNO1C1jvbG8he2uLeYZSWJxtdGHcFSQR3oA/lzhmksrqKWJjFNGwZJIzyDngqe3PQiv6BP+Cfn7R7/tI/s8aVrGp3Cy+J9Jf+ydYyfmeeNRtmPr5kZRyem5nH8Nfir+1x8D3/AGc/j/4s8EB5JdOtZ/O06aXlntJcSRHPcgHafdTX1H/wRo+KUvh348eJPBUs4Wx8SaSZ4oz3u7ZtyEf9spJ8/wC6PagD9nFcOMryKdUUK7eAMDAH/wBapaACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKZKpZcDg+vp/k4p9NdwvX+WaAPxM/4LOKF/ar0IAAf8UlaHgc/8fV319T/AICvNv8AglyxH7dHw1AOM/2kD7/8Sy6r0n/gs66v+1dom1gdvhKzBweh+1XZ/qK82/4JcqW/bo+GpAyF/tIn/wAFt0KAP37jzgkjBPX/AD/npT6ajBl4p1ABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRTXkWNcsQo9T0pQwbpQAtFFFABRRRQAUUUUAFFFNZ1XqQOM0ALnFZniDXdP8P6Ne6tqd7DYaXYW8l1dXlw4WKGJFLM7H0ABNcX8ZPj98P/gXox1Pxr4q0/Q4lRnS2lk3XM4A/wCWUS5djyOQpHIyRnNfj3+29/wUc1v9pVJvCXha3ufDXw+jkDSRv8t3qZXlGnwxCoGAZYgTzyWJA2gHhP7X3xvk/aK/aD8WeNY1ePTbqf7Pp0L5zHawqI48jsWC+Yw7M7V9S/8ABGX4UXHiL47+I/HFxb/6B4Z0w20UjDpd3J2rj6RJOD6bx6jPwf4f0HUfFmu2Gi6PZTapq9/NHa2lpbIWklldgqoqj1Jx+Nf0K/sX/s3237L/AMDdK8J5in1uZjfazdR8+dduo3AH+6ihUX2QHqTQB7nb5AIxgDpn8/06fhUtIo28dqWgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCGfPAHBPfv8A5/wr8Ov2sP2+fjfpf7RXxB0bw/42vPDOi6JrV3o9np+mIiRLDbTPCrHIJZnCbyT3cgYUKB+40yswAXOOc4OD+fb6+1fk/wDtKf8ABJH4mfEH42eL/FXg7xF4bm0bX9TudXC6vPNbTwy3ErSyRbUikUqrMQrZyRjI4oA+P/8Ah4F+0R/0VfXfzj/+Io/4eBftEf8ARV9d/OP/AOIr3L/hzH8df+g14H/8GV1/8jUf8OY/jr/0GvA//gyuv/kagDw3/h4F+0R/0VfXfzj/APiKP+HgX7RH/RV9d/OP/wCIr3L/AIcx/HX/AKDXgf8A8GV1/wDI1H/DmP46/wDQa8D/APgyuv8A5GoA8N/4eBftEf8ARV9d/OP/AOIpR/wUA/aJPT4ra7/31F/8RXuP/DmP46/9BrwP/wCDK6/+Rqcv/BGf45xq27W/A/PT/iZXP/yLn8vWgDwxv+CgH7RK9fitrn/fUX/xFVtQ/bw/aC1axltbj4s+JFifgm2uvs7/AIPGFYfgRXIftBfAPxR+zj8SLvwR4rjtzqtrFHOJ7Ni0E8Ui5R42YAsM7hyBypHY039nv4JX/wC0H8VNL8CaZrOl6HqWpCQ28+rSSLE7IhcoCiMdxVWwMDOMZyRkA4nWtc1HxFqE1/q19calfTNuluruUyyyN3LMxJY+5Oa2fhv8NfFHxW8U2/h7wjoV94j1i5+5a2UXmMB3ZuQEUZ5ZiAO/Wv1S+E//AARb8JaPcR3fxA8bah4lYEM2m6PCLKAnPKvIxd3Xj+HYeODX3X8K/gb4I+COhnSPA3hjT/DtkyjzPssQMszDOGllbLyNyfmct1oA+Yf2D/8Agnjpv7Naw+MfFclrrnxGli2o8PzW+kq4wyQk/ekKkq0oxxlFG3Jf7Xt42j3bupOf/wBfvSwxmMHP5ZzUlABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUANZwvX+VCyLJnawbHXFfm3/wWP8Aix41+F//AAqEeEPGGveFBff2x9qGianPZi42fYtnmeUw3bd743ZxuOOtej/8EjPiD4m+JP7OPiXVPFfiLVvE+ox+K7i2S91m+lu5xGLOzYJvkYnaC7EDOPmPAoA+36KKKACmSKWXAp9FAH58/wDBXj9nVvH3whs/iZpdp5mt+Ef3d6Yly8unyONx9cRSEP7K8p6V+PnhPxPqfgfxXpfiHRrlrLWNIuor6zuU/wCWcsbBkb6ZA+vAr+njxBotj4k0S+0nU4FutOvoHtbmCT7skbqVZT9QSPxr+cX9pb4I3/7PPxx8U+BrtJGh0+YtYzuP9fZyfNDJnocowDHoGDjtQB/QN+z78YdL+PHwd8MeOtKwkGrWiySwA5NvOCVlhP8AuOGX3AB75r0QENyORX5Hf8Ec/wBon+wvFWtfCHWLvbY6sG1TRmkb5UuY0/0iEf78ahx/1yJ6mv1tgG1MdOAcenFAEtFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUU1nC4z34FfNniz/AIKO/s7eBvFGseHdb+IX2HWdIvZtPvbb+xNRk8qeJzHIm5bcq2GUjKkg44JoA+Qf+C5n3vgn/wBxv/2wr1P/AIIqf8ms+Kf+xyuv/SGxr5Y/4KsftRfDH9pU/C7/AIVx4m/4SL+xf7U+3/6BdWvk+d9k8r/XxJuz5Mn3c4284yM9/wD8Ewv2yPg/+zl8BNf8N/ETxf8A8I9rd14muNQhtf7MvLktA1raxhy0MLqPnikG0kH5c4wQSAfrRRXzX4T/AOCjv7O3jnxRo/h3RPiF9u1nV72HT7K2/sTUY/NnlcRxpue3CrlmAyxAGeSBX0krhs47UAOooooAilDlk2jjPJ9Pf/PfFfnb/wAFgP2c/wDhLvhrpPxV0q1Lat4YZbPUzEuXksJHwrkdzHIw49JnJ4XI/Resbxh4Z07xp4Z1TQNYt1u9J1S1ls7uBv44pEKOPyJH40AfzMeAPHGrfDfxloXinQpza6xot1FfWsgHHmI4cA+oJ4I7qdvev6Svgz8UNJ+Mnwu8M+NtHbFhrdjFdqjNkxOw+eInuUfeh91NfztftBfBvUf2f/jN4o8C6nu36XdMkFwy8T27DdFKP95CDx0OR1GK/QD/AII2/tFGO48QfBvVbkFZN+s6EJG4DAj7TCoPsFkA7YlNAH6tA5pagtfutg7lz8pznj6/XNT0AFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAEU6s6gLnHfB5/z/wDXr8kvjd/wSN+MPxL+MvjvxdpfiTwTbadr2vX+qW8V5fXiTLHNcSSIHC2rKGCsAcEjIr9cqKAP53P2p/2LvG/7Hn/CL/8ACaatoGp/8JF9q+y/2FcTy7Bb+T5nmebDHjPnpjGc/NnGBnof2Zv+CfHxC/ay8A33i3wbrfhfTtNsdUl0uWPWrq6ilMqRQykqI4JBsxMuMkHIOR0r6v8A+C5n3vgn/wBxv/2wr1P/AIIqf8ms+Kf+xyuv/SGxoA8N+CP/AASN+MPw0+MvgTxdqniPwRc6doOvWGqXMNpfXjzPHBcRyuEDWqqWKqQMkDJr9bYEaNSGz7ZP+cVLRQAUUUUAFMkTdj/P+e1PooA/NP8A4LFfs3nxD4L0b4t6Tab7/Qyumat5QyXs3f8AcyN/uSNtP/XUdhx+W3wn+JGrfCH4leHPGuiOU1TRbyO8iwcCTDfPGcfwupZD7Ma/pW8eeD9K+IHg/V/DOuWwu9H1e1lsruE/xRSIVb6HBOD2OD1FfzcfHD4T6n8C/i14m8D6vzd6NeNAJfui4i4aKQem+NkYexoA/o7+GPxC0f4p/D/QfGOh3H2jSNas472BshiAw5U46MpyrDsVIPOa6pWDdDmvy9/4I2/tFG+0XXfg5ql1umsN2r6GHb5jC5H2iEA8YDlXAzn9456Akfp9Bt5K8r2x+f8AWgCWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/K3/guUpZvgnj/AKjff/sH16n/AMEVf+TWfFP/AGOV1/6Q2NfVPx1/Zd+Gf7SX9h/8LF8M/wDCRf2KZvsP+n3Nr5PneX5v+plTdnyY+ucbeMZOdT4J/ATwP+zv4XvPDvgDRP7B0e6vGv5rf7VNcb52RI2fdK7sMrEg2ghRt4AycgHoVFFFABRRRQAUUUUAMkQsRzX5i/8ABY79nU6h4e0P4xaXa/6Tp7LpOtbcZeB2Jt5WPqsjNHnr+8RRwor9PawPHfgnR/iP4R1Xwx4hsF1PQ9Vt2tL20dmUSRNwQGUhlPcMpBBAIOQKAP5t/gd8VdU+Bfxa8MeOdJLG90a8S4MYPE8OdssRPo6FkP8AvHviv6SvA3irT/HXhDRvEekytNper2UGoWsjAgtFLGsiHB5GVYHBr5vj/wCCXv7NS5P/AArPk9jr2p/XB/0np/nmvqLStNt9I0+3s7WCO2treNYYoYV2oiKMKqqOAAAAPYCgC3RRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf//Z';
                  } else {
                    mealItem.photoSmall = state.brandSetting.brand.wechatImgUrl + mealItem.photoSmall;
                  }
              })
            })
          }
          if(!article.isEmpty && article.isHidden == 0){
            f.articles.push(article);
          }
        }
      });
      // 左侧count
      family.count = 0;
      state.cartItem.forEach(_cartItem => {
        if (family.id === _cartItem.articleFamilyId) {
          family.count += _cartItem.count;
        }
      })
      familyListType.push(family);
      // state.loadFamily = true;
    })
    state.familyListType = familyListType;
  },
  [TYPE.SET_CART_ITEM](state, payload) {
    state.cartItem = payload.cartItem;
  },
  addShopCart(state, a) {
    // foodType   1：我是单品；2：我是套餐；3：单品老规格； 4：单品新规格；5：重量包；
    a = {...a}
    a.calcPrice = calcPrice(a);

    let countChange = 1; //默认count变化数是1
    let index = state.cartItem.findIndex(arg => arg.id == a.id);
    // 存入state.cartItem 唯一索引
    a.cartItemIndex = state.cartItem.length;
    if (a.foodType == 1) {      //纯单品
      if ( ! a.recommendId) {
        if (index === -1) {
          a.count = 1;
          state.cartItem.push(a);
        } else {
          state.cartItem[index].count++;
        }
      } else {
        // 有推荐配餐 count永远是1
        a.count = 1;
        state.cartItem.push(a);
      }
    } else if (a.foodType == 2 ) { // 套餐的count永远是1
      a.count = 1;
      state.cartItem.push(a);
    } else if (a.foodType == 3) {// 老规格
      // 单次添加count可能>1
      countChange = a.count;
      // 子菜品是否已添加过
      let subArticleIndex = state.cartItem.findIndex(arg => arg.subArticleId == a.subArticleId);
      if (subArticleIndex !== -1) {
        state.cartItem[subArticleIndex].count = state.cartItem[subArticleIndex].count + a.count;
        state.cartItem[subArticleIndex] = {...state.cartItem[subArticleIndex]};
      } else {
        state.cartItem.push(a);
      }
    } else if (a.foodType == 4) { // 新规格
      // 永远直接push 单次添加count可能>1
      countChange = a.count;
      state.cartItem.push(a);
    } else if (a.foodType == 5) { // 重量包count永远是1
      a.count = 1;
      state.cartItem.push(a);
    }
    state.cartItem = [...state.cartItem];
    // 同步角标count
    calcCount(state, a, 1, countChange);

    localStorage.setItem("cartItem-"+state.shop.id, JSON.stringify(state.cartItem));
  },
  cutShopCart(state, a) {
    a = {...a};
    // let index = state.cartItem.findIndex(arg => arg.id == a.id);
    let cartItemIndex = a.cartItemIndex;
    if (cartItemIndex !== -1) {
      if (state.cartItem[cartItemIndex].count <= 1) {
        // 不是物理删，只是count减为0
        state.cartItem[cartItemIndex].count = 0;
      } else {
        state.cartItem[cartItemIndex].count--;
      }

      state.cartItem = [...state.cartItem];
      // 同步角标count
      calcCount(state, a, 1, -1);
    }
    localStorage.setItem("cartItem-"+state.shop.id, JSON.stringify(state.cartItem));
  },
  // 套餐编辑
  editShopCart(state, payload) {
    if (payload.cartItemIndex >= 0) {
      state.cartItem[payload.cartItemIndex] = {...payload.currentArticle};
      state.cartItem = [...state.cartItem];
      localStorage.setItem("cartItem-"+state.shop.id, JSON.stringify(state.cartItem));
    }
  },
  clearCartItem(state) {
    state.cartItem = [];
    state.familyListType.forEach(family => {
      family.count = 0;
      family.articles = family.articles.map(article => {
        article.count = 0;
        article = {...article};
        return article;
      })
    });
    state.familyListType = [...state.familyListType];
    localStorage.setItem("cartItem-"+state.shop.id, JSON.stringify(state.cartItem));
  },
  // (后付)已下单的菜品
  // clearLastCartItem(state) {
  //   state.lastCartItem = [];
  // },
  // (后付)下单后，存储已购买列表
  setLastCartItem(state, lastCartItem) {
    // let cartItem = state.cartItem.map(item => {
    //   let itemCopy = {...item};
    //   itemCopy.parentOrderId = parentOrderId;
    //   return itemCopy;
    // })
    state.lastCartItem = [...lastCartItem];
  },
  clearLastCartItem(state) {
    state.lastCartItem = [];
  },
  [TYPE.SET_CURRENT_ARTICLE] (state, payload) {
    state.currentArticle = {...payload.currentArticle};
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
