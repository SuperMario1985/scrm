<template>
  <div class="company">
    <div class="statistics">
      <div class="item">
        <div class="top">
          <span class="title">客户统计</span>
          <span class="look">查看客户></span>
        </div>
        <div class="data">
          <div class="data-item">
            <div class="label">客户总数</div>
            <div class="number">{{ customer.count }}</div>
          </div>
          <div class="data-item">
            <div class="label">昨日新增</div>
            <div class="number">{{ customer.countInc }}</div>
          </div>
          <div class="data-item">
            <div class="label">昨日流失</div>
            <div class="number">{{ customer.countLost }}</div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="top">
          <span class="title">群统计</span>
          <span class="look">查看客户群></span>
        </div>
        <div class="data">
          <div class="data-item">
            <div class="label">群总数</div>
            <div class="number">{{ customerGroup.count }}</div>
          </div>
          <div class="data-item">
            <div class="label">昨日入群</div>
            <div class="number">{{ customerGroup.count }}</div>
          </div>
          <div class="data-item">
            <div class="label">昨日退群</div>
            <div class="number">{{ customerGroup.count }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="table">
      <div class="form-box">
        <a-radio-group v-model="customerType" @change="getCustomerStatistics">
          <a-radio-button value="2">新增库户数</a-radio-button>
          <a-radio-button value="3">客户流失数</a-radio-button>
        </a-radio-group>
        <div>
          <a-select v-model="dateType" style="width: 105px;height:42px;" @change="getCustomerStatistics">
            <a-select-option value="4" disabled>按月</a-select-option>
            <a-select-option value="3">按周</a-select-option>
            <a-select-option value="2" >按天</a-select-option>
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
           style="width:100%;">
        </LineCharts>								
      </div>
    </div>
    <div class="function">
      <div class="title">常用功能</div>
      <ul class="function-con">
        <li @click="goNewPage(1)">
          <img src="~@/assets/homePage/quefaxiaoxi.png" alt="">
          <div>
            <div class="name">群发消息</div>
            <p class="text">了解和客户群发相关的限制</p>
          </div>
        </li>
        <li @click="goNewPage(2)">
          <img src="~@/assets/homePage/qudaohuoma.png" alt="">
          <div>
            <div class="name">渠道活码</div>
            <p class="text">了解渠道活码的功能和使用</p>
          </div>
        </li>
        <li @click="goNewPage(3)">
          <img src="~@/assets/homePage/qunguanli.png" alt="">
          <div>
            <div class="name">群管理</div>
            <p class="text">统一管理企业客户群</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import LineCharts from '@/components/echarts/LineCharts'
import moment from 'moment';
import axios from 'axios'
export default {
  props:['corpid'],
 data() {
   return {
      customerType: "2",
      dateType: "4",
      dataTime: [moment(new Date().toLocaleDateString(), 'YYYY-MM-DD'), moment(new Date().toLocaleDateString(), 'YYYY-MM-DD')],
      tableData:{
        title     : '人数',
        xAxisData : [],
        seriesData: [
          {
            data  : [],
            type  : "line"
          }
        ]
     },
     customer:{
       count: 0,
       countInc: 0,
       countLost: 0
     },
     customerGroup:{
      count: 0,
      countInc: 0,
      countLost: 0
     }
   }
 },
  components:{
    LineCharts
  },
  mounted(){
    console.log(this.corpid)
    this.getCustomertotal();
    this.getCustomerNumber();
    this.getCustomerGroup();
    //this.getCustomerStatistics();
  },
  methods:{
    moment,
    getCustomertotal() {
      axios.post("/work-external-contact-follow-user/custom-list",{
        isMasterAccount: 2,
        sub_id: localStorage.getItem("sub_id"),
        corp_id: this.corpid
      }).then( res => {
        console.log(res)
        this.customer.count = res.data.data.count
      })
    },
    //获取客户昨天新增和流失数量
    getCustomerNumber() {
      axios.post("work-user-statistic/work-user-data",{
        corp_id: this.corpid
      }).then( res => {
        console.log(res)
        this.customer.countInc = res.data.data.two.count
        this.customer.countLost = res.data.data.three.count
      })
    },
    //获取客户群信息
    getCustomerGroup() {
      axios.post("work-chat/chat-statistic-yesterday",{
        corp_id: this.corpid
      }).then( res => {
        this.customerGroup.count = res.data.data[6].count;
        this.customerGroup.countInc = res.data.data[0].count
        this.customerGroup.countLost = res.data.data[2].count
      })
    },
    //获取客户统计
    getCustomerStatistics() {
      axios.post("work-user-statistic/work-user-increase",{
        corp_id: this.corpid,
        data_Type: this.customerType,
        s_date: new Date(this.dataTime[0]).toLocaleDateString(),
        e_date: new Date(this.dataTime[1]).toLocaleDateString(),
        type: this.dateType
      }).then( res => {
        this.tableData.xAxisData = res.data.data.xData;
        this.tableData.seriesData.data = res.data.data.user_data.map( item => {
          return item.cnt_num
        })
      })
    },
    resetData() {
      this.customerType = "2";
      this.dateType = "4";
      this.dataTime = [moment(new Date().toLocaleDateString(), 'YYYY-MM-DD'), moment(new Date().toLocaleDateString(), 'YYYY-MM-DD')];
      this.getCustomerStatistics();
    },
    goNewPage(type){
      this.$store.dispatch('changeMenu',2);
      setTimeout(()=>{
        switch(type) {
          case 1:
            this.$router.push("/massMessage/list")
            break;
          case 2:
            this.$router.push("/channelCode/list")
            break;
           case 3:
            this.$router.push("/group/list")
            break;
        } 
      },200)
    }
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
  width: 460px;
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
</style>