<template lang="html">
<div class="weui_dialog_confirm">
    <div class="weui-mask"></div>
    <div class="weui_dialog_record">
      <!--年龄 星座-->
      <div class="page" v-if="name == 'age'">
				<div class="weui_cells weui_cells_access">
					<div class="weui_cell">
			      <div class="weui_cell_bd weui_cell_primary">
			        <label for="" class="weui_label">生日</label>
			      </div>
			      <div class="personInformation">
			        <input type="date" id="myAgeInput" class="weui_input" v-model="age" style="width: 200px;">
			      </div>
			      <div class="weui_cell_ft"></div>
			    </div>
					<div class="weui_cell">
			      <div class="weui_cell_bd weui_cell_primary">
				      <span>年龄</span>
				      <span class="personInformation">{{personAge}}</span>
			      </div>
			    </div>
			    <div class="weui_cell">
				    <div class="weui_cell_bd weui_cell_primary">
				      <span>星座</span>
				      <span class="personInformation">{{starSign}}</span>
			      </div>
			    </div>
		    </div>
		    <div class="bottom_button" style="position:fixed;top: 150px;">
          <div class="weui_dialog_ft margin-top-0 no-border-top" style="line-height:38px;">
            <a class="weui_btn_dialog primary" @click="saveMyBirth" style="margin:0px 40px;border-radius: 5px;background-color: #000;">保存</a>
          </div>
        </div>
			</div>

			<!--公司-->
			<div class="page" v-if="name == 'company'">
				<div class="weui_cells weui_cells_access">
					<div class="weui_cell">
			      <div class="weui_cell_bd weui_cell_primary">
			        <span>公司</span>
				      <input id="myCompany" class="weui_input personInformation" type="text" placeholder="填输入公司名称" v-model="companyName">
				    </div>
			    </div>
		    </div>
		    <div class="bottom_button" style="position:fixed;top: 60px;">
          <div class="weui_dialog_ft margin-top-0 no-border-top" style="line-height:38px;">
            <a class="weui_btn_dialog primary" @click="confirmCompany" style="margin:0px 40px;border-radius: 5px;background-color: #000;">保存</a>
          </div>
        </div>
			</div>

			<!--学校-->
			<div class="page" v-if="name == 'school'">
				<div class="weui_cells weui_cells_access">
					<div class="weui_cell">
			      <div class="weui_cell_bd weui_cell_primary">
				      <span>学校</span>
				      <input id="mySchool" class="weui_input personInformation" type="text" placeholder="填写学校,发现校友" v-model="schoolName">
			      </div>
			    </div>
		    </div>
		    <div class="bottom_button" style="position:fixed;top: 60px;">
          <div class="weui_dialog_ft margin-top-0 no-border-top" style="line-height:38px;">
            <a class="weui_btn_dialog primary" @click="confirmSchool" style="margin:0px 40px;border-radius: 5px;background-color: #000;">保存</a>
          </div>
        </div>
			</div>

			<!--个人说明-->
			<div class="page" v-if="name == 'personalNote'">
				<div class="weui_cells" style="background-color: initial;">
					<div class="weui_cell" style="background-color: #fff;padding:5px;">
			      <textarea  placeholder="show出您的个性签名" rows="3" cols="50" maxlength="30" v-model="personalNote" style="padding:5px;font-size:17px;"></textarea>
			      <span class="remainWords">{{remainWords}}</span>
			    </div>
			    <div class="bottom_button" style="position:fixed;">
	          <div class="weui_dialog_ft margin-top-0 no-border-top" style="line-height:38px;">
	            <a class="weui_btn_dialog primary" @click="saveMyVoid" style="margin:0px 40px;border-radius: 5px;background-color: #000;">保存</a>
	          </div>
	        </div>
		    </div>
			</div>
    </div>
</div>


</template>

<script>
  import { customerApi, modifyBirthDate, modifyCustomer} from '../../../fetch/api'
  export default {
    data () {
      return {
        name:'age',
        customer:{},
        remainWords : 30,
        personAge:null,
        starSign:'',
        personDate:null,
        age:"1985-01-01",
        companyName:null,
        schoolName:null,
        personalNote:''
      }
    },
    components: {
    },
    created(){
      let that = this;
      this.name = this.$route.query.name;
      console.log('name',this.name)
      customerApi.customer().then((response) => {
        that.customer = response.data;
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
        that.personalNote = that.customer.customerDetail.personalNote;
      })
    },
    methods:{
      saveMyBirth:function(){
        var that = this;
        console.log(that.personDate,that.personAge,that.starSign)
        let data = {
          customerId: that.customer.id,
          birthDate: that.personDate,
          age: that.personAge,
          constellation: that.starSign
        }
        modifyBirthDate.submit($.param(data)).then((response) =>{
          if(response.success){
            this.$router.back();
          }
        })

      },
      getStarSign:function(month,day){
        var s="魔羯座水瓶座双鱼座白羊座金牛座双子座巨蟹座狮子座处女座天秤座天蝎座射手座";
        var arr=[20,19,21,21,21,22,23,23,23,23,22,22];
        return s.substr(month*3-(day<arr[month-1]?3:0),3);
      },
      confirmCompany:function () {
        let that = this;
        this.save(that.companyName)
      },
      confirmSchool:function () {
        let that = this;
        this.save(that.schoolName)
      },
      saveMyVoid:function () {
        let that = this;
        this.save(that.personalNote)
      },
      save: function (content) {
        let that = this;
        let data = {
          customerId: this.customer.id,
          content: content,
          field: this.name,
        }
        modifyCustomer.change($.param(data)).then((response) => {
          that.$router.back();
        })
      }
    },
    watch: {
      'age':function (newVal, oldVal){
        this.personDate = newVal;
        var nowYear = new Date().getFullYear(); //获取当前年份
        var myYear = newVal.substring(0,4); //获取出生年份
        var myMouth = newVal.substring(5,7); //获取出生月份
        var myDay = newVal.substring(8,10); //获取出生天数
        if(myYear >= nowYear){
          this.personAge = 0;
        }else{
          this.personAge = nowYear - myYear;
        }
        this.starSign = this.getStarSign(myMouth,myDay);
      },
      'personalNote': function (newVal, oldVal) {
        console.log('newVal',newVal)
        this.remainWords = newVal.length;
      },
    },

  }
</script>

<style scoped>
  @import '../../../assets/css/age.css';
</style>
