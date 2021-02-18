<template>
  <div class="company">
    <div class="statistics">
      <div class="item">
        <div class="top">
          <span class="title">粉丝统计</span>
          <span class="look">查看粉丝></span>
        </div>
        <div class="data">
          <div class="data-item">
            <div class="label">粉丝总数</div>
            <div class="number">378923</div>
          </div>
          <div class="data-item">
            <div class="label">今日新增</div>
            <div class="number">378923</div>
          </div>
          <div class="data-item">
            <div class="label">今日流失</div>
            <div class="number">378923</div>
          </div>
        </div>
      </div>
      <div class="item mine">
        <div class="left">
          <div class="user">
            <img src="" alt="">
            <div>订阅号</div>
          </div>
          <div class="say">
            <div class="title">肖恩的自说自话</div>
            <div class="share">分享一下我的想法，也可能分享别人的。</div>
          </div>
        </div>
        <div class="right">
          <a-button>更新授权</a-button>
          <a-button style="margin-top:12px;">刷新</a-button>
        </div>
      </div>
    </div>
    <div class="table">
      <div class="form-box">
        <a-radio-group v-model="customerType">
          <a-radio-button value="1">新增人数</a-radio-button>
          <a-radio-button value="2">去管人数</a-radio-button>
          <a-radio-button value="3">净增人数</a-radio-button>
        </a-radio-group>
        <div>
          <a-select v-model="dateType" style="width: 105px;height:42px;">
            <a-select-option value="1" disabled>近一个月</a-select-option>
            <a-select-option value="2">近一周</a-select-option>
            <a-select-option value="3" >昨天</a-select-option>
          </a-select>
          <span style="margin-left:8px;">自定义：</span>
          <a-range-picker format="YYYY-MM-DD HH:mm:ss"/>
          <a-button style="margin-left:8px;">重置</a-button>
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
        <li>
          <img src="~@/assets/homePage/neirongyinqing.png" alt="">
          <div>
            <div class="name">内容引擎</div>
            <p class="text">了解和客户群发相关的限制</p>
          </div>
        </li>
        <li>
          <img src="~@/assets/homePage/duanxinyingxiao.png" alt="">
          <div>
            <div class="name">短信营销</div>
            <p class="text">了解渠道活码的功能和使用</p>
          </div>
        </li>
        <li>
          <img src="~@/assets/homePage/qunfatuisong.png" alt="">
          <div>
            <div class="name">群发推送</div>
            <p class="text">统一管理企业客户群</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import LineCharts from '@/components/echarts/LineCharts'
export default {
 data() {
   return {
      customerType: "1",
      dateType: "1",
      tableData:{
        title     : '人数',
        xAxisData : ["1","2","3"],
        data_Type : 1,
        name      : '发起申请数',
        seriesData: [
          {
            data  : ["1","2"],
            name  : "新增人数",
            smooth: true,
            type  : "line"
          }
        ]
     }
   }
 },
 components:{
   LineCharts
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
  justify-content: space-between;
  background: #fff;
}
.function-con li img{
  width: 25px;
  height: auto;
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