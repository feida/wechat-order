// 计算价格
export function calcPrice(a) {
  let price = a.fansPrice || a.price || 0;
  let discount = a.discount || 100;
  price = price * discount / 100;
  // 计算配菜价格
  if (a.recommendId) {
    a.recommendArticlesChoose && a.recommendArticlesChoose.forEach(subA => {
      if (subA.count && subA.count >= 1) {
        price += subA.price * subA.count;
      }
    })
    // 可以把currentRecommend清掉
  }
  // 计算套餐 子菜价格
  if (a.mealAttrsChoose && a.mealAttrsChoose.length > 0) {
    a.mealAttrsChoose.forEach(attr => {
      attr.mealItems.forEach(item => {
        if (item.click && item.click === true) {
          let priceDif = item.priceDif || 0;
          price = price + priceDif;
        }
      })
    })
  }

  // 计算重量包价格
  if (a.foodType == 5) {
    a.weightListChoose && a.weightListChoose.details && a.weightListChoose.details.forEach(detail => {
      if (detail.click && detail.click === true) {
        price = price * detail.weight;
      }
    })
  }
  //a.calcPrice = price.toFixed(2);
  return parseFloat(price.toFixed(2));
}

// 获取 推荐配菜计算属性 imgList
export function getRecommendImgList(currentRecommend) {
  let imgList = [];
  // imgList.push(this.currentArticle);
  currentRecommend && currentRecommend.articles && currentRecommend.articles.forEach(a => {
    if (a.count && a.count >= 1) {
      let chooseA = {...a};
      imgList.push(chooseA);
    }
  });
  
  return imgList;
}

// 判断最大配餐购买数量
export function checkRecommendCount(vueObj, article) {
  if ( ! article.recommend) {
    return true;
  }


  let recommendCount = 0;
  article.recommendArticlesChoose.forEach(a => {
    if (a.count && a.count >= 1) {
      recommendCount += 1;
    }
  });

  //choiceType 为1 必选一个推荐菜  
  if (article.recommend.choiceType == 1) {
    if (recommendCount === 0) {
      vueObj.$kiko_message({
        isShow: true,
        message: '您还未选择配菜哦!',
        time: 2000,
        type: 2
      })
      return false;
    }
  }
  if (recommendCount > article.recommend.count) {
    vueObj.$kiko_message({
      isShow: true,
      message: '配餐最大购买数量为'+article.recommend.count,
      time: 2000,
      type: 2
    })
    return false; 
  }
  return true;
}

// 推荐配餐自动滑动
export function autoScroll(iscrollObj) {
  // dom变化调用下iscroll的refresh 
  setTimeout(function () {
    iscrollObj.refresh();
    // console.log(iscrollObj.y, '************');
    let scrollWrap = $('.scroll-wrap');
    let recommend = $("#recommend-wrap");
    let diffHeight = recommend.height() - scrollWrap.height();
    if (diffHeight - Math.abs(iscrollObj.y) > 50) {
      iscrollObj.scrollBy(0, -50, 1000);
    }
  }, 0);
}