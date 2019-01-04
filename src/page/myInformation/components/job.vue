<template lang="html">
  <div class="weui_dialog_confirm">
    <div class="weui-mask"></div>
    <div class="weui_dialog_record" >
      <div>
				<div class="page " id="pageJob" >
					<div class="weui_cells weui_cells_radio"  style="margin-top: 0px;">
						<label class="weui_cell weui_check_label"  v-for="(f,i) in vocation" >
					    <div class="weui_cell_bd weui_cell_primary" @click.stop="saveMyJob(f)">
					      <span class="weui_btn weui_btn_job" v-if="f.color == '蓝色'" style="background-color: #93bfe5;">{{f.sign}}</span>
					      <span class="weui_btn weui_btn_job" v-if="f.color == '黄色'" style="background-color: #e8ab6c;">{{f.sign}}</span>
					      <span class="weui_btn weui_btn_job" v-if="f.color == '橘色'" style="background-color: #e58e69;">{{f.sign}}</span>
					      <span class="weui_btn weui_btn_job" v-if="f.color == '绿色'" style="background-color: #abd0c9;">{{f.sign}}</span>
					      <span class="weui_btn weui_btn_job" v-if="f.color == '紫色'" style="background-color: #c3b1dc;">{{f.sign}}</span>
					      <span class="weui_btn weui_btn_job" v-if="f.color == '粉色'" style="background-color: #ddacc1;">{{f.sign}}</span>
					      <span class="weui_btn weui_btn_job" v-if="f.color == '白色'" style="background-color: #000;">{{f.sign}}</span>
					      <span class="personJob">{{f.content}}</span>
				      </div>
				      <div class="weui_cell_ft">
				        <input type="radio" name="radio1" class="weui_check"  :value="f.id" v-model="checkedId">
				        <span class="weui_icon_checked"></span>
				      </div>
				    </label>
			    </div>
		    </div>
			</div>
    </div>
  </div>

</template>

<script>
  import { customerApi,vocationlist, modifyCustomer } from '../../../fetch/api'
  export default {
    data () {
      return {
        customer:{},
        vocation:[],
        checkedId : null,
        myVocation:null,
      }
    },
    components: {
    },
    created(){
      let that = this;
      customerApi.customer().then((response) => {
        that.customer = response.data;
        console.log('customer',that.customer)
        that.myVocation = that.customer.customerDetail.vocation;
        vocationlist.get().then((response) => {
          console.log('zhiye',response)
          //进入记住之前选择的职业
          that.vocation = response.data;
          for(var i=0; i< that.vocation.length;i++){
            if(that.vocation[i].content == that.customer.customerDetail.vocation){
              that.checkedId = that.vocation[i].id
            }
          }
          if(that.checkedId == null){
            that.checkedId = that.vocation[0].id
          }
        })
      })


    },
    methods:{
      saveMyJob:function(f){
        var that = this;
        that.myVocation = f.content;
        let data = {
          customerId: that.customer.id,
          content: that.myVocation,
          field: 'vocation',
        }
        modifyCustomer.change($.param(data)).then((response) => {
          that.$router.back();
        })
      },

    },

  }
</script>

<style scoped>
  @import '../../../assets/css/job.css';
</style>
