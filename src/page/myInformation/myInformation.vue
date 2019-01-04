<template lang="html">
<div class="weui_dialog_confirm">
    <div class="weui-mask"></div>
    <div class="weui_dialog_record">
      <div class="container js_container">
		    <!--个人信息详情-->
		    <div class="page">
			    <div class="weui_cells weui_cells_access">
				    <div class="weui_media_box weui_media_appmsg" style="padding: 10px 15px;">
		          <div class="weui_media_bd" style="margin-left: initial;">
		            <span class="weui_media_title">头像</span>
		          </div>
		          <div class="weui_media_hd" style="margin-right: initial;line-height: initial;">
		            <img class="weui_media_appmsg_thumb" :src="customer.headPhoto">
		          </div>
		        </div>
				    <div class="weui_cell">
			        <div class="weui_cell_bd weui_cell_primary">
			          <span>昵称</span>
			          <span class="personInformation">{{customer.nickname}}</span>
			        </div>
			      </div>
			      <div class="weui_cell">
			        <div class="weui_cell_bd weui_cell_primary">
			          <span>性别</span>
			          <span class="personInformation" v-if="customer.sex == 1">男</span>
			          <span class="personInformation" v-if="customer.sex == 2">女</span>
			        </div>
			      </div>
			      <a class="weui_cell js_cell" @click="showAge">
			        <div class="weui_cell_bd weui_cell_primary">
			          <span>年龄</span>
			          <span class="personInformation">{{personAge}}</span>
			        </div>
			        <div class="weui_cell_ft"></div>
			      </a>
			      <a class="weui_cell js_cell" @click="showAge">
			        <div class="weui_cell_bd weui_cell_primary">
			          <span>星座</span>
			          <span class="personInformation">{{starSign}}</span>
			        </div>
			        <div class="weui_cell_ft"></div>
			      </a>
			    </div>

			    <div class="weui_cells weui_cells_access" >
				    <a class="weui_cell" @click="showJob">
			        <div class="weui_cell_bd weui_cell_primary">
			          <span>职业</span>
			          <span class="personInformation">{{myVocation}}</span>
			        </div>
			        <div class="weui_cell_ft"></div>
			      </a>
			      <a class="weui_cell" @click="showCompany">
			        <div class="weui_cell_bd weui_cell_primary">
			          <span>公司</span>
			          <input class="weui_input personInformation" type="text" placeholder="填输入公司名称" v-model="companyName" readonly="readonly" disabled="disabled">
			        </div>
			        <div class="weui_cell_ft"></div>
			      </a>
			      <a class="weui_cell" @click="showSchool">
			        <div class="weui_cell_bd weui_cell_primary">
			          <span>学校</span>
			          <input class="weui_input personInformation" type="text" placeholder="填写学校,发现校友" v-model="schoolName" readonly="readonly" disabled="disabled">
			        </div>
			        <div class="weui_cell_ft"></div>
			      </a>
			      <a class="weui_cell">
			        <div class="weui_cell_bd weui_cell_primary">
			          <span>所在地</span>
			          <span class="personInformation">{{customer.province}}{{customer.city}}</span>
			        </div>
			      </a>
			      <a class="weui_cell" @click="showViod">
			        <div class="weui_cell_bd weui_cell_primary">
			          <span>个人说明</span>
			          <span class="personInformation">{{personalNote}}</span>
			        </div>
			        <div class="weui_cell_ft"></div>
			      </a>
			    </div>
		    </div>
		<!--<weui-dialog-current :show.sync="wMessage.show" :msg="wMessage.message" :type="wMessage.type" ></weui-dialog-current>-->
		<!--<weui-loading :show.sync="loadShow"></weui-loading>-->

	    </div>

    </div>

</div>


</template>

<script>
  import { customerApi, } from '../../fetch/api'
  export default {
    data () {
      return {
        customer:{},
        vocation:[],
        checkedId : null,
        remainWords : 30,
        personAge:null,
        starSign:'',
        personDate:null,
        age:"1985-01-01",
        myVocation:null,
        companyName:null,
        schoolName:null,
        personalNote:''
      }
    },
    components: {
    },
    created(){
      let that = this;
      customerApi.customer().then((response) => {
        that.customer = response.data;
        console.log('customer',that.customer)
        if(that.customer.customerDetail.age == 0){
          that.personAge = null;
        }else{
          that.personAge = that.customer.customerDetail.age;
        }
        if(that.customer.customerDetail.birthDate != null){
          that.age = new Date(that.customer.customerDetail.birthDate.time).format("yyyy-MM-dd")
        }
        that.companyName = that.customer.customerDetail.company;
        that.schoolName = that.customer.customerDetail.school;
        that.starSign = that.customer.customerDetail.constellation;
        that.myVocation = that.customer.customerDetail.vocation;
        that.personalNote = that.customer.customerDetail.personalNote;
      })

    },
    methods:{
      getIscroll(iscroll){
        var that = this;
        if (iscroll) {
          iscroll.on('scrollEnd', function() {
            console.log("scrollEnd");
            if (this.y <= this.maxScrollY) {
              //this.refresh();
            }
          });
        }
      },
      showAge:function(){
        var that = this;
        this.$router.push({ path: '/user/myInformation/age',query:{name:'age'}});
      },
      showJob:function(){
        this.$router.push({ path: '/user/myInformation/job'});
      },
      showCompany:function(){
        this.$router.push({ path: '/user/myInformation/age',query:{name:'company'}});
      },
      showSchool:function(){
        this.$router.push({ path: '/user/myInformation/age',query:{name:'school'}});
      },
      showViod:function(){
        this.$router.push({ path: '/user/myInformation/age',query:{name:'personalNote'}});
      },
    },
  }
</script>

<style scoped>
  @import '../../assets/css/myInformation.css';
</style>
