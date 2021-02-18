<template>
  <div class="company">
    <div class="statistics">
      <div class="item">
        <div class="top">
          <span class="title">粉丝统计</span>
          <span class="look" @click="$router.push('/fans/list')">查看粉丝></span>
        </div>
        <div class="data">
          <div class="data-item">
            <div class="label">粉丝总数</div>
            <div class="number">{{ fans.count }}</div>
          </div>
          <div class="data-item">
            <div class="label">昨日新增</div>
            <div class="number">{{ fans.countInc }}</div>
          </div>
          <div class="data-item">
            <div class="label">昨日流失</div>
            <div class="number">{{ fans.countLost }}</div>
          </div>
        </div>
      </div>
      <div class="item mine">
        <div class="left">
          <div class="user">
            <img :src="authrize.head_img" alt="">
            <div>订阅号</div>
          </div>
          <div class="say">
            <div class="title">{{ authrize.nick_name}}</div>
            <!-- <div class="share">分享一下我的想法，也可能分享别人的。</div> -->
          </div>
        </div>
        <div class="right">
          <a-button @click="showWxModal=true">更新授权</a-button>
          <a-button style="margin-top:12px;" @click="refreshAuthor">刷新</a-button>
        </div>
      </div>
    </div>
    <div class="table">
      <div class="form-box">
        <a-radio-group v-model="fansType" @change="getCustomerStatistics">
          <a-radio-button value="1">新增人数</a-radio-button>
          <a-radio-button value="2">取关人数</a-radio-button>
          <a-radio-button value="3">净增人数</a-radio-button>
        </a-radio-group>
        <div>
          <a-select v-model="dateType" style="width: 105px;height:42px;" @change="changeData">
            <a-select-option value="4">按月</a-select-option>
            <a-select-option value="3">按周</a-select-option>
            <a-select-option value="2">按天</a-select-option>
          </a-select>
          <span style="margin-left:8px;">自定义：</span>
          <a-range-picker 
            format="YYYY-MM-DD"
            v-model="dataTime" 
            @change="getCustomerStatistics"/>
          <a-button style="margin-left:8px;" @click="resetData">重置</a-button>
        </div>
      </div>
      <div class="table-echarts">
        <LineCharts  
          :options="tableData"
          v-show="tableData.xAxisData.length != 0"
           style="width:100%;">
        </LineCharts>
        <a-empty v-show="tableData.xAxisData.length == 0"
                  style="margin-top: 30px;">
          <span slot="description" style="color: #999;">暂无数据</span>
        </a-empty>							
      </div>
    </div>
    <div class="function">
      <div class="title">常用功能</div>
      <ul class="function-con">
        <li @click="goNewPage(1)">
          <img src="~@/assets/homePage/neirongyinqing.png" alt="">
          <div>
            <div class="name">内容引擎</div>
            <p class="text">了解和客户群发相关的限制</p>
          </div>
        </li>
        <li @click="goNewPage(2)">
          <img src="~@/assets/homePage/duanxinyingxiao.png" alt="">
          <div>
            <div class="name">短信营销</div>
            <p class="text">了解渠道活码的功能和使用</p>
          </div>
        </li>
        <li  @click="goNewPage(3)">
          <img src="~@/assets/homePage/qunfatuisong.png" alt="">
          <div>
            <div class="name">群发推送</div>
            <p class="text">统一管理企业客户群</p>
          </div>
        </li>
      </ul>
    </div>
    <!-- 点击添加公众号弹窗 -->
		<authorize :show="showWxModal" @cancel="cancel"></authorize>
  </div>
</template>

<script>
import LineCharts from '@/components/echarts/LineCharts'
import authorize from "@/components/Authorize.vue"
import moment from 'moment';
import axios from 'axios'
export default {
 data() {
   return {
      fansType: "1",
      dateType: "4",
      dataTime: [moment(moment().subtract(31, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')],
      tableData:{
        title     : '粉丝数',
        xAxisData : [],
        seriesData: [
          {
            data  : [],
            type  : "line",
            name : "",
            smooth: true,
          }
        ]
     },
     authrize: {
      nick_name: "",
      wx_id: "",
      head_img: '~@/assets/homePage/gongzhonghao.png'
    },
    fans:{
       count: 0,
       countInc: 0,
       countLost: 0
     },
    showWxModal: false
   }
 },
 mounted() {
   this.getAuthrize();
 },
 components:{
   LineCharts,authorize
 },
 methods: {
   moment,
   resetData() {
    this.customerType = "2";
    this.dateType = "4";
    this.dataTime = [moment(moment().subtract(31, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')];
    this.getCustomerStatistics();
  },
  //获取公众号信息
  getAuthrize() {
    axios.post("/wx-authorize-info/get-authrize-info",{
      uid: localStorage.getItem('uid')
    }).then( res => {
      this.authrize.nick_name = res.data.data.info[0].nick_name;
      this.authrize.wx_id = res.data.data.info[0].wx_id;
      this.authrize.head_img = res.data.data.info[0].head_img;
      this.getFans();
      this.getCustomerStatistics();
    })
  },
  //获取粉丝信息
  getFans() {
    axios.post("index/fans-top",{
      wx_id: this.authrize.wx_id
    }).then( res => {
      this.fans.count = res.data.data.five.count;
      this.fans.countInc = res.data.data.one.count
      this.fans.countLost = res.data.data.two.count
    })
  },
  //获取统计数据
  getCustomerStatistics() {
    axios.post("index/fans-increase",{
      wx_id: this.authrize.wx_id,
      s_date: new Date(this.dataTime[0]).toLocaleDateString(),
      e_date: new Date(this.dataTime[1]).toLocaleDateString(),
      type: 2
    }).then( res => {
      this.tableData.xAxisData = res.data.data.fans_data.map( item => item.hour)
      if (this.fansType==1) {
        this.tableData.seriesData[0].data = res.data.data.seriesData[2].data
        this.tableData.seriesData[0].name = "新增关注"
      }
      if (this.fansType==2) {
        this.tableData.seriesData[0].data = res.data.data.seriesData[1].data
        this.tableData.seriesData[0].name = "净增长"
      }
      if (this.fansType==3) {
        this.tableData.seriesData[0].data = res.data.data.seriesData[0].data
        this.tableData.seriesData[0].name = "取消关注"
      }
    })
  },
  changeData() {
    if(this.dateType == 4) {
      this.dataTime = [moment(moment().subtract(31, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')];
    }
    if(this.dateType == 3) {
      this.dataTime = [moment(moment().subtract(8, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')];
    }
    if(this.dateType == 2) {
      this.dataTime = [moment(moment().subtract(1, 'days'), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')];
    }
    this.getCustomerStatistics()
  },
  goNewPage(type){
    // this.$store.dispatch('changeMenu',2);
    setTimeout(()=>{
      switch(type) {
        case 1:
          this.$router.push("/filingCabinet/statistics")
          break;
        case 2:
          this.$router.push("/smsSend/list")
          break;
          case 3:
          this.$router.push("/customer/list")
          break;
      } 
    },200)
  },
  cancel () {
    this.showWxModal = false
  },
  // 刷新公众号信息
  async refreshAuthor () {
    const {data: res} = await axios.post("wx-authorize-info/refresh-authorize", {
      refresh_id: this.authrize.wx_id,
      wx_id:localStorage.getItem('wxNum')
    })

    if (res.error != 0) {
      this.isLoading = false
      if (typeof res.message === 'undefined') {
        this.$message.error('刷新失败')
      } else {
        this.$message.error(res.message)
      }
    }else {
      this.$message.success('刷新成功')
    }
  },
 }
}
</script>

<style scoped>
.company{
  padding: 20px 24px;
  box-sizing: border-box;
  background: #fff;
}
.statistics{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.statistics .item{
  width: 500px;
  background: #FAFAFA;
  border-radius: 4px;
  padding: 20px 24px;
  box-sizing: border-box;
}
.statistics .item .top{
  display: flex;
  justify-content: space-between;
}
.statistics .item .top .title{
  color: #333;
  font-size: 18px;
  font-weight: bold;
  line-height: 18px;
}
.statistics .item .top .look{
  color: #00AF63;
  font-size: 14px;
  line-height: 18px;
  cursor: pointer;
}
.statistics .item .data{
  display: flex;
  margin-top: 20px;
}
.data-item{
  flex: 1;
}
.data-item .label{
  color: #7F7F7F;
  font-size: 14px;
  line-height: 14px;
  height: 14px;
}
.data-item .number{
  color: #333333;
  font-size: 18px;
  margin-top: 12px;
  line-height: 18px;
  height: 18px;
}
.table, .function{
  padding: 24px;
  background: #FAFAFA;
  margin-top: 20px;
}
.form-box{
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 99999;
}
.ant-radio-button-wrapper{
  margin: 0;
  width: auto;
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
  background: #00AF63;
  color: #fff;
}
.function .title{
  color: #333;
  font-size: 18px;
  font-weight: bold;
  height: 18px;
  line-height: 18px;
}
.function-con {
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  margin-top: 12px;
}
.function-con li{
  width: 276px;
  padding: 20px 24px;
  box-sizing: border-box;
  display: flex;
  background: #fff;
  cursor: pointer;
}
.function-con li img{
  width: 25px;
  height: 25px;
  margin-right: 12px;
}
.function-con li .name{
  color: #333;
  font-size: 14px;
  height: 14px;
  line-height: 14px;
}
.function-con li .text{
  color: #7F7F7F;
  font-size: 12px;
  line-height: 12px;
  margin-top: 6px;
}
.mine{
  display: flex;
  justify-content: space-between;
}
.mine .left {
  display: flex;
}
.mine .left .user{
  width: 48px;
}
.mine .left .user img{
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
.mine .left .user div{
  background: #169CD5;
  color: #fff;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  margin-top: 6px;
  text-align: center;
}
.mine .left .say{
  margin-left: 16px;
  width: 181px;
}
.mine .left .say .title{
  color: #333;
  font-size: 14px;
  line-height: 20px;
  margin-top: 16px;
}
.mine .left .say .share{
  color: #7F7F7F;
  font-size: 12px;
  line-height: 17px;
  margin-top: 10px;
}
.mine .right{
  width: 90px;
}
.mine .right .ant-btn{
  width: 90px;
}
</style>