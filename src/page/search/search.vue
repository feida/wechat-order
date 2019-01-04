<template lang="html">
  <div class="weui_dialog_confirm">
    <div class="weui-mask"></div>
    <div class="weui_dialog_search">
      <div class="full-height">
        <!--菜品搜索栏-->
        <div class="search_header">
          <input class="weui-input" type="text" v-model="searchName" placeholder="请输入菜品名称">
        </div>
        <!--菜品搜索结果-->
        <div class="search_contain" v-if="searchName != null &&  searchName != ''">
          <p class="search_contain_item" v-for="a in searchNameList">
            <span>{{a.name}}</span>
            <i style="float: right;">↖</i>
          </p>
        </div>
        <!--热门搜索/历史记录-->
        <div class="search_tab" v-if="noSearchResult">
          <div>
            <p style="padding-bottom: 10px;">热门搜索</p>
            <div class="flex-container-tab">
              <div class="weui_flex_tab" v-for="f in nameList" @click="choiceHotName(f)">{{f.name}}</div>
            </div>
          </div>
          <div>
            <div style="padding-bottom: 10px;">
              <span>历史搜索</span>
              <p style="float: right;" @click="clearHistory">
                <img class="heartImg" style="margin-right: initial;" src="../../assets/img/clearSearch.png" alt="清空">
                <span style="vertical-align: middle;">清空历史搜索</span>
              </p>
            </div>
            <div class="flex-container-tab">
              <div class="weui_flex_tab" v-for="f in historyList">{{f.name}}</div>
            </div>
          </div>
        </div>
        <!--菜品区域-->
        <div class="searchScroll" v-iscroll=getIscroll>
        <div class="flex-container">
          <div class="weui_flex_item" v-for="a in filterArticleList" >
            <img v-if="!a.photoSmall" class="logoImg" src="../../assets/img/resto.png"/>
            <img v-if="a.photoSmall" class="logoImg" :src="a.photoSmall" />
            <p class="articleName">{{a.name}}</p>
            <p class="articlePrice" v-if="!a.fansPrice">
              <span class="price big">{{a.price}}/{{a.unit}}</span>
            </p>
            <p class="articlePrice" v-if="a.fansPrice">
              <span class="price small">{{a.price}}</span>
              <span class="price big">{{a.fansPrice}}/{{a.unit}}</span>
            </p>
            <p class="articlePrice" style="padding-bottom: 2vw;">
              <img class="heartImg" src="../../assets/img/red_heart.png" alt="点赞数">
              <i style="color: #c41e24;">{{a.likes}}</i>
            </p>
            <span class="numberControl">
              <span class="plus-span"><i class="icon iconfont plus">&#xe6cd;</i></span>
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { articleListApi } from '../../fetch/api'

  export default {
    data () {
      return {
        articleList:[],
        searchName:'',
        noSearchResult:true,
        nameList:[
          {
              name:'萝卜',
          },
          {
            name:'鸡',
          },
          {
            name:'肉',
          },
          {
            name:'锅',
          },
        ],
        historyList:[]
      }
    },
    watch: {

    },
    computed: {
      filterArticleList() {
        let search = this.searchName;
        if (search) {
          this.setHistoryItems(search);
          return this.articleList.filter(function(product) {
            return Object.keys(product.name).some(function() {
              return String(product.name).indexOf(search) >  -1;
            })
          })
        }
      },
      searchNameList() {
        let search = this.searchName;
        let nameArray = [];
        if (search) {
          this.articleList.forEach(function(article) {
            let temp = {};
            temp.name = article.name;
            if(temp.name.indexOf(search) > 0){
              nameArray.push(temp);
            }
            console.log(JSON.stringify(nameArray));
          });
          return nameArray;
        }
      }
    },
    created(){
      let _this = this;
      let param = {
        distributionModeId:1
      };
      articleListApi.article($.param(param)).then((response) => {
        _this.articleList = response.data;
        _this.resetDomHeight();
        _this.historySearchList();
      });
      this.$watch("searchName", function () {
        if (this.searchName.length) {
          _this.noSearchResult = false;
        } else {
          _this.noSearchResult = true;
        }
      })
    },
    methods:{
      historySearchList(){
        let historyItems = localStorage.getItem('historyItems');
        let that = this;
        if(historyItems != null){
          let ss = historyItems.split("|");
          ss.forEach(function (item) {
            let history = {};
            history.name = item;
            that.historyList.push(history);
          });
        }
      },
      getIscroll(iscroll){
        if (iscroll) {
          iscroll.on('scrollEnd', function() {
            console.log("scrollEnd");
          });
        }
      },
      resetDomHeight() {
        let mainHeight = $(".full-height");
        let header = $(".search_header");
        let content = $(".searchScroll");
        content.height(mainHeight.height() - header.height());
      },
      choiceHotName(f){
        this.searchName = f.name;
      },
      clearHistory() {
        localStorage.removeItem('historyItems');
        this.historyList = [];
        console.log(localStorage.getItem('historyItems'));
      },
      setHistoryItems(keyword) {
        keyword = keyword.trim();
        let { historyItems } = localStorage;
        if (historyItems === undefined) {
          localStorage.historyItems = keyword;
        } else {
          const onlyItem = historyItems.split('|').filter(e => e != keyword);
          if (onlyItem.length > 0) historyItems = keyword + '|' + onlyItem.join('|');
          localStorage.historyItems = historyItems;
          console.log(localStorage.getItem('historyItems'));
        }
      }
    }
  }
</script>

<style scoped>
  @import '../../assets/css/search.css';
</style>
