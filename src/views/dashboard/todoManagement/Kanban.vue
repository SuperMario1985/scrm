<template>
  <div style="width: 100%; height: 100%">
    <div style="height: 100%">
      <a-card style="margin-bottom: 20px; padding: 10px 20px">
        <label class="tpl-title">待办看板</label>
      </a-card>
      <div style="height: calc(100% - 84px)">
        <a-row
          style="
            margin: 0 20px 20px;
            padding: 20px 20px 5px;
            background: #fff;
            line-height: 40px;
          "
          ref="searchArea"
        >
          <span class="select-option">
						<label style="margin-right: 5px;">客户类型：</label>
							<a-cascader :options="customerType"
							            v-model="corpType"
							            :show-search="{ filter }"
							            placeholder="'请选择'"
							            style="margin-right: 5px;width: 210px;"/>
					</span>
          <span class="select-option">
            <label style="margin-right: 5px">关键词：</label>
            <a-input
              @keyup.enter="find"
              placeholder="客户姓名/昵称/备注/公司名称"
              style="width: 210px; margin-right: 5px"
              v-model="name"
            />
          </span>
          <span class="select-option">
            <label style="margin-right: 5px">手机号：</label>
            <a-input
              @keyup.enter="find"
              placeholder="请输入手机号码"
              style="width: 210px; margin-right: 5px"
              v-model="phone"
            />
          </span>
          <span class="select-option" v-if="projectList.length > 1">
            <label style="margin-right: 5px">选择项目：</label>
            <a-select
              showSearch
              optionFilterProp="children"
              style="width: 210px; margin-right: 5px"
              v-model="projectId"
            >
              <a-select-option :value="''">全部</a-select-option>
              <template v-for="item in projectList">
                <a-select-option :value="item.id">
                  {{ item.title }}
                </a-select-option>
              </template>
            </a-select>
          </span>
          <span class="select-option">
            <label style="margin-right: 5px">项目处理人：</label>
            <a-button
              @click="showDepartmentList"
              style="width: 210px; margin: 0 10px 10px 0"
            >
              <span v-if="chooseNum > 0"
                >已选择{{ chooseUserNum }}名成员，{{
                  chooseDepartmentNum
                }}个部门</span
              >
              <span v-else>选择成员</span>
            </a-button>
          </span>
          <span class="select-option">
            <label style="margin-right: 5px">完成时间：</label>
            <a-range-picker
              :show-time="{
                defaultValue: [
                  moment('00:00:00', 'HH:mm:ss'),
                  moment('23:59:59', 'HH:mm:ss'),
                ],
              }"
              format="YYYY-MM-DD HH:mm:ss"
              allowClear
              style="width: 320px; margin-right: 5px"
              :disabled-date="disabledDate"
              v-model="joinTime"
              @change="changeTime"
            />
          </span>
          <a-button type="primary" style="margin: 0 10px 10px 0" @click="find"
            >查询</a-button
          >
          <a-button @click="clear">重置</a-button>
        </a-row>

        <!-- 表格部分 -->
        <div class="content-bd" ref="scroll">
          <!--				@mousedown="scroLineDown" @mouseup="scroLineUp"-->
          <a-spin tip="加载中..." size="large" :spinning="isLoading">
            <a-empty v-show="list.length == 0" style="margin: 100px auto 0" />
            <div
              class="part"
              v-for="(item, index) in list"
              :id="'part' + item.id"
              v-show="list.length > 0"
            >
              <a-spin tip="加载中..." :spinning="isSpinning[index]">
                <div class="part-title">
                  <span class="part-title-left"
                    >{{ item.title }}（{{ item.count }}）</span
                  >
                  <!--							<a-icon type="export" class="part-title-right" v-if="item.status != 0"-->
                  <!--							        @click="groupSend(item.id)"/>-->
                </div>
                <a-row
                  class="part-body"
                  :ref="'part_body_' + item.id"
                  :id="'partBody' + item.id"
                  v-perfect-scroll-bar="perfectScrollBarOptions"
                  @ps-scroll-down="handleScroll(item.id)"
                  @ps-scroll-y="(e) => changeScrollPosition(e, item.id)"
                >
                  <a-empty
                    v-if="item.members.length == 0"
                    style="margin-top: 100px"
                  />
                  <div
                    class="part-body-card"
                    v-for="part in item.members"
                    v-if="item.members.length > 0"
                    :ref="'part_body_card_' + part.id"
                    :id="part.id"
                  >
                    <div
                      style="
                        padding: 10px 10px 0;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        word-break: break-all;
                        font-weight: 700;
                      "
                    >
                      {{ part.title }}
                    </div>
                    <div
                      style="overflow: hidden; padding: 10px 5px 10px 10px"
                      @click="
                        part.status == 1
                          ? ''
                          : customDetail(
                              part.id,
                              part.end_time,
                              part.task_id,
                              part.external_userid,
                              part.sea_id
                            )
                      "
                    >
                      <img
                        :src="part.avatar"
                        alt=""
                        v-if="part.avatar"
                        style="
                          float: left;
                          width: 47px;
                          margin-right: 5px;
                          height: 47px;
                          border-radius: 5px;
                        "
                      />
                      <img
                        src="../../../assets/useradvart.png"
                        alt=""
                        v-if="!part.avatar"
                        style="
                          float: left;
                          width: 47px;
                          margin-right: 5px;
                          height: 47px;
                          border-radius: 5px;
                        "
                      />
                      <div
                        style="
                          float: left;
                          width: calc(100% - 52px);
                          font-size: 12px;
                        "
                      >
                        <div
                          style="
                            word-wrap: break-word;
                            word-break: break-all;
                            white-space: normal;
                          "
                        >
                          <a-popover placement="top">
                            <template slot="content">
                              <p>{{ part.name }}</p>
                            </template>
                            <template v-if="part.name != ''">
                              <span>{{ part.nickname }}</span>
                              <span
                                :class="
                                  part.corp_name != null
                                    ? 'corp-name'
                                    : 'wx-name'
                                "
                              >
                                <template v-if="part.s_type == 0">
                                  <template v-if="part.corp_name != null"
                                    >@{{ part.corp_name }}</template
                                  >
                                  <template v-else>@微信</template>
                                </template>
                              </span>
                            </template>
                          </a-popover>
                          <template v-if="part.name == ''">
                            <span>{{ part.nickname }}</span>
                            <span
                              :class="
                                part.corp_name != null ? 'corp-name' : 'wx-name'
                              "
                            >
                              <template v-if="part.s_type == 0">
                                <template v-if="part.corp_name != null"
                                  >@{{ part.corp_name }}</template
                                >
                                <template v-else>@微信</template>
                              </template>
                            </span>
                          </template>
                        </div>
                        <p style="margin-top: 5px">
                          <span
                            style="
                              overflow: hidden;
                              white-space: nowrap;
                              text-overflow: ellipsis;
                              max-width: 89px;
                              display: inline-block;
                              border: 1px solid;
                              border-radius: 4px;
                              padding: 0 5px;
                            "
                            :style="{
                              'border-color': part.level_color,
                              color: part.level_color,
                            }"
                            >{{ part.level }}</span
                          >
                          <a-progress
                            :percent="Number(part.per)"
                            size="small"
                            style="
                              font-size: 12px;
                              width: 100px;
                              vertical-align: top;
                              float: right;
                            "
                            strokeColor="#01b065"
                          />
                        </p>
                      </div>
                    </div>
                    <div
                      style="padding: 0 10px; margin-bottom: 10px"
                      @click="
                        part.status == 1
                          ? ''
                          : customDetail(
                              part.id,
                              part.end_time,
                              part.task_id,
                              part.external_userid,
                              part.sea_id
                            )
                      "
                    >
                      <p
                        style="
                          overflow: hidden;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                        "
                        v-if="part.status == 3"
                      >
                        项目实际完成：{{ part.finish_time }}
                        <span v-if="part.is_finish == 1">（按时完成）</span>
                        <span v-if="part.is_finish == 2" style="color: red"
                          >（超时{{ part.delay_days }}天）</span
                        >
                        <span v-if="part.is_finish == 3"
                          >（提前{{ part.pre_days }}天）</span
                        >
                      </p>
                      <p
                        style="
                          overflow: hidden;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                        "
                        v-if="part.status == 2 || part.status == 3"
                      >
                        项目开始时间：{{ part.start_time }}
                      </p>
                      <p
                        style="
                          overflow: hidden;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                        "
                        v-if="part.status == 2 || part.status == 3"
                      >
                        预计截止时间：{{ part.end_time }}
                      </p>
                      <!--												<p style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;"-->
                      <!--												   v-if="part.status == 2 || part.status == 3">-->
                      <!--													跟进次数：{{part.follow_num}}次</p>-->
                      <!--												<p style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;"-->
                      <!--												   v-if="part.status == 1 || part.status == 2 || part.status == 3">-->
                      <!--													待办项目：{{part.title}}</p>-->
                      <p style="white-space: normal" v-if="part.status == 1">
                        项目规则：<span v-if="part.type == 1">手动启动，</span
                        ><span v-if="part.type == 2">立即启动，</span
                        ><span v-if="part.type == 3"
                          >在{{ part.start_days }}天后启动，</span
                        >
                        需要{{ part.days }}天内完成
                      </p>
                    </div>
                    <div
                      style="
                        background: #f3f3f3;
                        padding: 7px 10px;
                        overflow: hidden;
                        font-size: 12px;
                      "
                    >
                      <div style="float: left; line-height: 24px">
                        处理人：<span
                          style="color: #01b065; margin-right: 5px"
                          >{{ part.user_name }}</span
                        >
                      </div>
                      <a-button
                        style="float: right; height: 24px"
                        type="primary"
                        @click="startRecord(part.id)"
                        v-if="part.status == 1 && part.can_edit == 1"
                        >开始
                      </a-button>
                      <a-button
                        style="float: right; height: 24px"
                        type="primary"
                        @click="
                          addRecord(
                            part.id,
                            item.id,
                            part.per,
                            part.nickname,
                            part.end_time,
                            part.task_id,
                            part.external_userid,
                            part.sea_id
                          )
                        "
                        v-if="part.status == 2 && part.can_edit == 1"
                        >项目跟进
                      </a-button>
                    </div>
                  </div>
                </a-row>
              </a-spin>
            </div>
          </a-spin>
        </div>
      </div>
      <!-- 添加跟进记录抽屉 -->
      <a-drawer
        :title="drawTitle"
        placement="right"
        :closable="false"
        :visible="recordVisible"
        @close="onClose"
        width="460px!important"
      >
        <div style="height: calc(100% - 51px); overflow: auto">
          <div style="padding: 20px 20px 0">
            预计截止时间：<span>{{ finishTime }}</span>
          </div>
          <div style="padding: 20px 20px 0">
            <span style="color: red">*</span>项目状态：
            <a-select style="width: 180px" v-model="status">
              <a-select-option v-for="item in follows" :value="item.id">
                {{ item.title }}
              </a-select-option>
            </a-select>
          </div>
          <div style="padding: 20px">
            <span style="color: red">*</span>项目进度：
            <a-input-number
              v-model="close_rate"
              style="width: 165px; margin-right: 5px"
              placeholder="请输入项目进度"
            />
            %
          </div>
          <div class="textArea">
            <div style="margin-bottom: 10px">
              <span style="color: red">*</span>进度说明：
            </div>
            <a-textarea
              placeholder="请输入进度说明，200字以内"
              :auto-size="{ minRows: 5, maxRows: 20 }"
              :maxLength="200"
              @change="changeText"
              v-if="showTextArea"
            />
            <div style="text-align: right; margin-top: 10px">
              {{ followMsg.length }}/200
            </div>
          </div>
        </div>
        <div class="footer">
          <a-button style="marginright: 8px" @click="onClose"> 取消 </a-button>
          <a-button type="primary" @click="onSure"> 确定 </a-button>
        </div>
      </a-drawer>
      <!-- 详情抽屉 -->
      <a-drawer
        :title="detalTitle"
        placement="right"
        :closable="false"
        :visible="detailVisible"
        @close="detailClose"
        width="460px!important"
      >
        <div style="height: calc(100% - 51px); overflow: auto">
          <div style="padding: 20px 20px 0" v-if="detailData.length > 0">
            预计截止时间：<span>{{ finishTime }}</span>
          </div>
          <div
            style="padding: 20px 20px 0"
            v-if="
              detailFinishTime.finish_time && detailFinishTime.finish_time != ''
            "
          >
            实际完成：{{ detailFinishTime.finish_time }}
            <span v-if="detailFinishTime.is_finish == 1">【按时完成】</span>
            <span v-if="detailFinishTime.is_finish == 2" style="color: red"
              >【超时{{ detailFinishTime.delay_days }}天】</span
            >
            <span v-if="detailFinishTime.is_finish == 3"
              >【提前{{ detailFinishTime.pre_days }}天】</span
            >
          </div>
          <div style="padding: 20px 20px 0">
            <div v-for="item in detailData">
              <p style="font-size: 16px; font-weight: 700">{{ item.date }}</p>
              <a-steps
                progress-dot
                direction="vertical"
                :current="item.data.length - 1"
              >
                <a-step :description="step.per_desc" v-for="step in item.data">
                  <template slot="title">
                    <span style="font-weight: 700">{{ step.time }}</span>
                    <span
                      :style="{ color: step.status_color }"
                      style="margin-left: 10px"
                      >{{ step.status_title }}</span
                    >
                    <a-tag color="green" style="float: right; margin: 0">
                      {{ step.per }}%
                    </a-tag>
                  </template>
                </a-step>
              </a-steps>
            </div>
            <a-empty v-if="detailData.length == 0" style="margin-top: 100px" />
            <!--分页 -->
            <div
              class="pagination"
              style="margin: 20px 0; box-sizing: border-box; overflow: hidden"
              v-show="total2 > 0"
            >
              <div style="height: 32px; float: left; line-height: 32px">
                共
                <span style="color: blue">{{ total2 }}</span
                >条
              </div>
              <div class="pagination" style="height: 32px; float: right">
                <a-pagination
                  :total="total2"
                  showSizeChanger
                  :showQuickJumper="quickJumper2"
                  :current="page2"
                  :pageSize="pageSize2"
                  :pageSizeOptions="['15', '30', '50', '100']"
                  @change="changePage"
                  @showSizeChange="showSizeChange"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <a-button style="marginright: 8px" @click="detailClose">
            关闭
          </a-button>
        </div>
      </a-drawer>
    </div>
    <!--部门选择框-->
    <chooseDepartment
      ref="user"
      :id="corpId1"
      :show="showModalDepartment"
      :chooseNum="chooseNum"
      :callback="modalVisibleChange"
      :is_special="1"
    ></chooseDepartment>
  </div>
</template>

<script>
import chooseDepartment from "@/components/ChooseDepartment.vue";
import infiniteScroll from "vue-infinite-scroll";
import moment from "moment";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    // reader.onerror = error => reject(error);
  });
}

export default {
  directives: { infiniteScroll },
  name: "todoManagementKanban",
  components: { chooseDepartment },
  data() {
    let corpId = localStorage.getItem("corpId")
      ? localStorage.getItem("corpId")
      : "";
    return {
      moment,
      corpInfo: [], //企业微信列表
      corpId: corpId, //修改后的企业微信id值
      corpId1: "", // 选择成员corpId
      corpLen: JSON.parse(localStorage.getItem("corpArr")).length,
      isLoading: false, //Loading组件的显示与隐藏
      name: "", //搜索客户姓名、昵称、公司名称
      phone: "", //手机号
      joinTime: null, // 添加客户时间
      pages: [], //每一列的页码集合
      projectList: [], //项目合集列表
      projectId: "", //项目id
      showModalDepartment: false, //成员选择框显示与隐藏
      chooseNum: 0, //已选择的部门成员总个数
      chooseUserNum: 0, //成员个数
      chooseDepartmentNum: 0, //部门个数
      checkedList: [], //选择的成员id数组
      user: [], //选择成员数组
      startX: 0, //按下鼠标指针的x轴坐标
      scrollX: 0,
      //添加跟进记录抽屉
      recordVisible: false, //显示与隐藏
      showTextArea: false, //输入框的显示与隐藏
      status: [], //跟进状态
      follows: [],
      followMsg: "", //跟进记录输入框内容
      followMsgTimeout: "",
      close_rate: "", //预估成交率
      task_id: "", //添加跟进需要参数
      external_userid: "", //添加跟进需要参数
      sea_id: "", //添加跟进需要参数

      list: [], //裂变数据
      timeout: "",
      page: 1, //分页
      id: "", //当前在滚动的列的id
      count: "", //当前在滚动的列的总数
      cid: "", //正在操作客户的id
      drawTitle: "", //添加跟进记录抽屉弹窗标题
      isMasterAccount: localStorage.getItem("isMasterAccount")
        ? localStorage.getItem("isMasterAccount")
        : "", //主账户1，子账户2
      customItem: {
        corpId: localStorage.getItem("corpId")
          ? localStorage.getItem("corpId")
          : "",
        name: "",
        phone: "",
        projectId: "",
        checkedList: [],
        user: [],
        chooseNum: 0,
        chooseUserNum: 0,
        chooseDepartmentNum: 0,
        joinTime: null,
      },
      perfectScrollBarOptions: {
        suppressScrollX: true, // 禁用 X 轴的滚动条
        minScrollbarLength: 15, // 最小的滚动条大小
      },
      isSpinning: [], //每一列的加载的显示与隐藏
      scrollData: [], // 滚动条位置
      //详情抽屉
      detalTitle: "",
      detailData: [], //详情数据
      detailFinishTime: {}, //详情实际完成时间
      detailVisible: false, //显示与隐藏
      finishTime: "", //截止时间
      //分页
      total2: 1, //总条数
      quickJumper2: false, // 是否显示快速跳转的控件
      page2: 1, //页码
      pageSize2: 15, //每页数据条数
    };
  },
  methods: {
    // 客戶类型
			filter (inputValue, path) {
				return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
			},
    //左右滚动
    scroLineDown(event) {
      this.startX = event.x; // 按下鼠标指针的x轴坐标
      // console.log(this.startX,'this.startX')
    },
    scroLineUp(event) {
      let endX = event.x;
      this.scrollX = this.scrollX + endX - this.startX;
      console.log(this.scrollX, "scrollX");
      this.$refs.scroll.style.right = this.scrollX + "px";
      this.$forceUpdate();
    },
    //切换企业微信
    changeWx(value) {
      this.corpId = value;
      this.checkedList = [];
      this.chooseNum = 0;
      this.chooseUserNum = 0;
      this.chooseDepartmentNum = 0;
      this.user = [];
    },
    //部门选择弹窗组件
    showDepartmentList() {
      this.corpId1 = this.corpId;
      this.showModalDepartment = true;
    },
    modalVisibleChange(event, arr, userNum, departmentNum, list) {
      if (event == "ok") {
        this.checkedList = arr;
        this.chooseNum = parseInt(userNum) + parseInt(departmentNum);
        this.chooseUserNum = userNum;
        this.chooseDepartmentNum = departmentNum;
        if (this.chooseNum > 0) {
          this.user = list;
        } else {
          this.user = [];
        }
      }
      this.showModalDepartment = false;
    },
    //加入时间
    disabledDate(current) {
      return current && current > moment().endOf("day");
    },
    changeTime(data, dataString) {
      this.joinTime = data;
    },
    //点击搜索
    find() {
      this.id = "";
      this.customItem.corpId = this.corpId;
      this.customItem.name = this.name;
      this.customItem.phone = this.phone;
      this.customItem.projectId = this.projectId;
      this.customItem.checkedList = this.checkedList;
      this.customItem.user = this.user;
      this.customItem.chooseNum = this.chooseNum;
      this.customItem.chooseUserNum = this.chooseUserNum;
      this.customItem.chooseDepartmentNum = this.chooseDepartmentNum;
      this.customItem.joinTime = this.joinTime;
      this.pages = [];
      this.scrollData = [];
      this.cid = "";
      this.getAccount();
      this.$nextTick(() => {
        this.list.map((x) => {
          this.changeScrollTop(false, 0, x.id);
        });
      });
      var elements = document.getElementsByClassName("part-body-card");
      Array.prototype.forEach.call(elements, function (element) {
        element.style.border = "";
      });
    },
    //点击清空
    clear() {
      this.corpId = localStorage.getItem("corpId")
        ? localStorage.getItem("corpId")
        : "";
      this.name = "";
      this.id = "";
      this.cid = "";
      this.phone = "";
      this.projectId = "";
      this.checkedList = [];
      this.user = [];
      this.chooseNum = 0;
      this.chooseUserNum = 0;
      this.chooseDepartmentNum = 0;
      this.joinTime = null;
      this.customItem.corpId = this.corpId;
      this.customItem.name = this.name;
      this.customItem.phone = this.phone;
      this.customItem.projectId = this.projectId;
      this.customItem.checkedList = this.checkedList;
      this.customItem.user = this.user;
      this.customItem.chooseNum = this.chooseNum;
      this.customItem.chooseUserNum = this.chooseUserNum;
      this.customItem.chooseDepartmentNum = this.chooseDepartmentNum;
      this.customItem.joinTime = this.joinTime;
      this.pages = [];
      this.scrollData = [];
      this.getAccount();
      this.$nextTick(() => {
        this.list.map((x) => {
          this.changeScrollTop(false, 0, x.id);
        });
      });
      var elements = document.getElementsByClassName("part-body-card");
      Array.prototype.forEach.call(elements, function (element) {
        element.style.border = "";
      });
    },
    //群发
    groupSend(id) {
      this.customItem.id = id;
      this.$router.push({
        path: "/massMessage/add",
        query: {
          item: this.customItem,
        },
      });
    },
    //添加跟进
    addRecord(
      cid,
      id,
      close_rate,
      name,
      end_time,
      task_id,
      external_userid,
      sea_id
    ) {
      this.list.map((x, index) => {
        x.members.map((y) => {
          if (y.cid == cid) {
            y.popVisible = false;
          }
        });
      });

      this.cid = cid;
      this.getFollowStatus(id, close_rate);
      this.drawTitle = name;
      this.followMsg = "";
      this.finishTime = end_time;
      this.task_id = task_id;
      this.external_userid = external_userid;
      this.sea_id = sea_id;
      var elements = document.getElementsByClassName("part-body-card");
      Array.prototype.forEach.call(elements, function (element) {
        element.style.border = "";
      });
    },
    changeText(e) {
      //输入框内容处理占内存，渲染很慢，给延迟保证输入框内容快速渲染
      clearTimeout(this.followMsgTimeout);
      this.followMsgTimeout = setTimeout(() => {
        this.followMsg = e.target.value;
      }, 3);
    },
    async onSure() {
      if (this.followMsg.trim() == "") {
        this.$message.error("进度说明不能为空！");
        return false;
      }
      if (this.status == "") {
        this.$message.warning("请选择项目状态！");
        return false;
      }
      let reg = /^(?:0|[1-9][0-9]?|100)$/;
      if (this.close_rate == null || this.close_rate == "") {
        this.$message.warning("请填写项目进度！");
        return false;
      }
      if (
        this.close_rate != null &&
        this.close_rate != "" &&
        (this.close_rate < 0 ||
          this.close_rate > 100 ||
          !reg.test(this.close_rate))
      ) {
        this.$message.warning("项目进度必须为0-100正整数！");
        return false;
      }
      const { data: res } = await this.axios.post(
        "wait-project/add-project-status",
        {
          uid: localStorage.getItem("uid"),
          id: this.cid,
          per_desc: this.followMsg,
          status: this.status,
          per: this.close_rate,
          task_id: this.task_id,
          external_userid: this.external_userid,
          sea_id: this.sea_id,
        }
      );

      if (res.error != 0) {
        this.$message.error(res.error_msg);
      } else {
        this.recordVisible = false;
        this.status = 1;
        this.followMsg = "";
        this.close_rate = "";
        this.showTextArea = false;
        this.id = "";
        if (this.pages.length == 0 && this.list.length > 0) {
          this.list.map((x) => {
            this.pages.push(x.page);
          });
        }
        this.getAccount();
      }
    },
    onClose() {
      this.recordVisible = false;
      this.status = 1;
      this.followMsg = "";
      this.close_rate = "";
      this.finishTime = "";
      this.showTextArea = false;
    },
    //客户详情
    customDetail(cid, end_time, task_id, external_userid, sea_id) {
      this.list.map((x, index) => {
        x.members.map((y) => {
          if (y.cid == cid) {
            y.popVisible = false;
          }
        });
      });
      this.$forceUpdate();
      this.finishTime = end_time;
      this.task_id = task_id;
      this.external_userid = external_userid;
      this.sea_id = sea_id;
      this.cid = cid;
      var elements = document.getElementsByClassName("part-body-card");
      Array.prototype.forEach.call(elements, function (element) {
        element.style.border = "";
      });
      this.getDetail();
    },
    async getDetail(page = 1, pageSize = this.pageSize2) {
      const { data: res } = await this.axios.post("wait-project/wait-info", {
        id: this.cid,
        task_id: this.task_id,
        external_userid: this.external_userid,
        sea_id: this.sea_id,
        page: page,
        page_size: pageSize,
      });
      if (res.error != 0) {
        this.$message.error(res.error_msg);
      } else {
        this.detalTitle = res.data.title;
        this.detailData = res.data.info;
        this.detailFinishTime = res.data.time;
        this.total2 = parseInt(res.data.count);
        this.page2 = page;
        this.pageSize2 = pageSize;
        this.quickJumper2 = this.total2 > this.pageSize2;
        this.detailVisible = true;
      }
    },
    // 分页
    changePage(page, pageSize) {
      this.getDetail(page, pageSize);
    },
    showSizeChange(page, pageSize) {
      this.getDetail(1, pageSize);
    },
    detailClose() {
      this.detalTitle = "";
      this.finishTime = "";
      this.detailData = [];
      this.detailVisible = false;
    },
    //获取表格内容
    async getAccount() {
      if (this.id == "") {
        this.isLoading = true;
      } else {
        if (this.list.length > 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].id == this.id) {
              this.isSpinning[i] = true;
            }
          }
        }
      }
      this.$forceUpdate();
      let page = "";
      if (this.id != "" && this.list.length > 0) {
        this.list.map((x) => {
          if (x.id == this.id) {
            page = x.page;
          }
        });
      } else {
        page = 1;
      }
      const { data: res } = await this.axios.post(
        "wait-project/wait-project-board",
        {
          uid: localStorage.getItem("uid"),
          isMasterAccount: this.isMasterAccount,
          sub_id: localStorage.getItem("sub_id"),
          corp_id: this.corpId,
          name: this.name,
          phone: this.phone,
          user_ids: this.checkedList,
          page: page,
          pages: this.pages,
          id: this.id,
          project_id: this.projectId,
          start_time: this.joinTime
            ? this.joinTime.length > 1
              ? this.joinTime[0].format("YYYY-MM-DD HH:mm:ss")
              : ""
            : "",
          end_time: this.joinTime
            ? this.joinTime.length > 1
              ? this.joinTime[1].format("YYYY-MM-DD HH:mm:ss")
              : ""
            : "",
        }
      );
      if (res.error != 0) {
        if (this.id == "") {
          this.isLoading = false;
        } else {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].id == this.id) {
              this.isSpinning[i] = false;
            }
          }
        }
        this.$message.error(res.message);
      } else {
        let that = this;
        if (that.pages.length == 0) {
          if (page == 1) {
            that.list = res.data.info;
            that.list.map((x, index) => {
              x.page = 1;
              that.scrollData[index] = {
                position: null,
              };
            });
          }
          if (page > 1) {
            that.list.map((x, index) => {
              if (x.id && x.id == that.id) {
                if (x.members.length < x.count) {
                  x.members = x.members.concat(res.data.info[index].members);
                }
              }
            });
          }
        } else {
          that.list = res.data.info;
        }
        that.list.map((x, index) => {
          that.isSpinning[index] = false;
        });
        that.isLoading = false;
        for (let i = 0; i < that.list.length; i++) {
          if (that.list[i].id == that.id) {
            that.isSpinning[i] = false;
          }
          for (let j = 0; j < that.list[i].members; j++) {
            that.list[i].members[j].popVisible = false;
          }
        }
        that.$forceUpdate();
        that.$nextTick(() => {
          let searchAreaHeight = that.$refs.searchArea.$el.clientHeight;
          that.$refs.scroll.style.height =
            "calc(100% - " + searchAreaHeight + "px)";
        });
        if (that.cid != "") {
          that.$nextTick(() => {
            const card = that.$refs["part_body_card_" + that.cid][0];
            card.style.boxShadow = "0 2px 8px 0 rgba(0, 0, 0, .12)";
            card.style.border = "2px solid #01b065";
          });
        }
      }
    },
    //获取项目列表
    async getprojectList() {
      const { data: res } = await this.axios.post("wait-project/project", {
        corp_id: this.corpId,
      });
      if (res.error != 0) {
        this.$message.error(res.error_msg);
      } else {
        this.projectList = res.data;
      }
    },
    //鼠标进入，显示pop
    mouseIn(cid) {
      clearTimeout(this.timeout);
      this.list.map((x, index) => {
        x.members.map((y) => {
          if (y.cid == cid) {
            y.popVisible = true;
          }
        });
      });
      this.$forceUpdate();
    },
    //鼠标离开，隐藏pop，做个10毫秒延时，保证从三个点移动到pop框内没有闪的效果
    mouseOut(cid) {
      let that = this;
      that.list.map((x, index) => {
        x.members.map((y) => {
          if (y.cid == cid) {
            that.timeout = setTimeout(function () {
              y.popVisible = false;
              that.$forceUpdate();
            }, 10);
          }
        });
      });
    },
    handleScroll(eleId) {
      const scrollYReach = this.$refs["part_body_" + eleId][0].$el._ps_.reach.y;
      if (eleId != this.id) {
        this.id = eleId;
        this.list.map((x) => {
          if (x.id == this.id) {
            this.page = x.page;
          }
        });
      }
      this.list.map((x) => {
        if (x.id == this.id) {
          this.count = x.count;
        }
      });
      if (scrollYReach === "end") {
        if (this.count / 15 > this.page) {
          ++this.page;
          this.list.map((x) => {
            if (x.id == this.id) {
              x.page = this.page;
            }
          });
          this.pages = [];
          this.cid = "";
          this.corpId = this.customItem.corpId;
          this.name = this.customItem.name;
          this.phone = this.customItem.phone;
          this.projectId = this.customItem.projectId;
          this.checkedList = this.customItem.checkedList;
          this.user = this.customItem.user;
          this.chooseNum = this.customItem.chooseNum;
          this.chooseUserNum = this.customItem.chooseUserNum;
          this.chooseDepartmentNum = this.customItem.chooseDepartmentNum;
          this.joinTime = this.customItem.joinTime;
          this.getAccount();
        }
      }
    },
    //获取跟进记录状态
    async getFollowStatus(id, close_rate) {
      const { data: res } = await this.axios.post(
        "wait-project/common-detail",
        {
          uid: localStorage.getItem("uid"),
        }
      );
      if (res.error != 0) {
        this.$message.error(res.error_msg);
      } else {
        this.follows = [];
        for (let j = 1; j < res.data.project_status.length; j++) {
          this.follows.push(res.data.project_status[j]);
        }
        for (let i = 0; i < this.follows.length; i++) {
          if (this.follows[i].id == id) {
            this.status = Number(id);
            break;
          }
        }
        if (this.status == "") {
          this.status = Number(this.follows[0].id);
        }
        this.close_rate = close_rate;
        this.recordVisible = true;
        this.showTextArea = true;
        var all = document.getElementsByClassName("ant-popover");
        for (var i = 0; i < all.length; i++) {
          all[i].style.display = "none";
        }
      }
    },
    // 记录最后一次滚动条的位置
    changeScrollPosition(e, id) {
      let that = this;
      that.list.map((x, index) => {
        if (x.id == id) {
          if (
            that.scrollData.length > 0 &&
            typeof that.scrollData[index].position != "undefined"
          ) {
            that.scrollData[index].position = e.srcElement.scrollTop;
          }
        }
      });
    },
    // 修改滚动条位置
    changeScrollTop(change = false, scrollPosition = null, id) {
      this.$nextTick(() => {
        this.$refs["part_body_" + id][0].$el.scrollTop = scrollPosition;
      });
    },
    //开始
    startRecord(id) {
      var elements = document.getElementsByClassName("part-body-card");
      Array.prototype.forEach.call(elements, function (element) {
        element.style.border = "";
      });
      let that = this;
      that.cid = id;
      that.$confirm({
        title: "确定开始吗？",
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk() {
          that.startRecord2();
        },
      });
    },
    async startRecord2(id) {
      const { data: res } = await this.axios.post("wait-project/start", {
        uid: localStorage.getItem("uid"),
        id: this.cid,
      });
      if (res.error != 0) {
        this.$message.error(res.error_msg);
      } else {
        this.getAccount();
      }
    },
  },

  created() {
    this.$store.dispatch("getCorp", (info) => {
      this.corpInfo = info;
      this.pages = [];
      this.cid = "";
      this.getAccount();
      this.getprojectList();
    });
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建

    if (from.path == "/customManage/detail") {
      next((vm) => {
        vm.id = "";
        vm.cid = "";
        vm.corpId = vm.customItem.corpId;
        vm.name = vm.customItem.name;
        vm.phone = vm.customItem.phone;
        vm.projectId = vm.customItem.projectId;
        vm.checkedList = vm.customItem.checkedList;
        vm.user = vm.customItem.user;
        vm.chooseNum = vm.customItem.chooseNum;
        vm.chooseUserNum = vm.customItem.chooseUserNum;
        vm.chooseDepartmentNum = vm.customItem.chooseDepartmentNum;
        vm.joinTime = vm.customItem.joinTime;
        if (vm.pages.length == 0 && vm.list.length > 0) {
          vm.list.map((x) => {
            vm.pages.push(x.page);
          });
        }
        vm.getAccount();
        vm.list.map((x, index) => {
          if (
            typeof vm.$refs["part_body_" + x.id][0] !== "undefined" &&
            typeof vm.scrollData[index] !== "undefined" &&
            vm.scrollData[index].position !== null
          ) {
            vm.changeScrollTop(false, vm.scrollData[index].position, x.id);
          }
        });
      });
    } else {
      next((vm) => {
        //因为当钩子执行前，组件实例还没被创建
        // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
        vm.corpId = localStorage.getItem("corpId")
          ? localStorage.getItem("corpId")
          : "";
        vm.id = "";
        vm.cid = "";
        vm.name = "";
        vm.phone = "";
        vm.projectId = "";
        vm.checkedList = [];
        vm.user = [];
        vm.chooseNum = 0;
        vm.chooseUserNum = 0;
        vm.chooseDepartmentNum = 0;
        vm.joinTime = null;
        vm.pages = [];
        // vm.getAccount();
      });
    }

    next();
  },
};
</script>

<style lang='less' scoped>
/deep/ .ant-card-bordered {
  border: 0;
}

.content-bd::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}

.content-bd::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}

p {
  margin-bottom: 0;
}

.select-option {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
}

.select-option label {
  display: inline-block;
  text-align: right;
  width: 100px;
}

.tpl-title {
  float: left;
  font-size: 16px;
  vertical-align: top;
}

.content-bd {
  /*height: calc(100% - 215px);*/
  min-width: 885px;
  margin: 0 20px;
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 20px;
}

a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

a:active {
  text-decoration: none;
}

/*/deep/ .ant-spin-nested-loading, /deep/ .ant-spin-container {*/
/*	height: 100%;*/
/*}*/

.part {
  width: 300px;
  height: 100%;
  display: inline-block;
  background: #f7f7f7;
  margin-right: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  cursor: grabbing;
}

.part:hover {
  background: #f9f9f9;
}

.part-title {
  padding: 15px;
  overflow: hidden;
  height: 56px;
}

.part-body {
  /*height: calc(100% - 57px);*/
  padding: 0 16px;
  box-sizing: border-box;
  overflow: auto;
  position: absolute;
  top: 57px;
  bottom: 0;
  width: 300px;
}

.part-title-left {
  float: left;
  color: rgba(0, 0, 0, 0.6);
  font-size: 16px;
  font-weight: 700;
}

.part-title-right {
  float: right;
  margin-top: 4.5px;
  font-size: 18px;
  cursor: pointer;
}

.part-body-card,
.part-body-card2 {
  background: #fff;
  margin-bottom: 15px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
}

.part-body-card:hover,
.part-body-card2:hover {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.12);
}

.url-btn {
  cursor: pointer;
}

.url-btn:hover,
.part-title-right:hover {
  color: #01b065;
}

.textArea {
  padding: 0 20px;
}

.textArea-btn {
  padding: 20px;
  overflow: hidden;
}

.upload-file /deep/ .ant-upload.ant-upload-select-picture-card {
  background-color: #fff;
  border: 0;
  height: 32px;
}

/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
  padding: 0;
}

.footer {
  position: absolute;
  bottom: 63px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}

/deep/ .ant-spin-spinning:first-child {
  width: 100%;
  margin-top: 100px;
}

/deep/ .ant-spin-nested-loading:first-child {
  height: 100%;
}

/deep/ .ant-spin-container {
  height: 100%;
}

/deep/ .ant-input-number-handler-wrap {
  display: none;
}

/deep/ .ant-popover-inner-content {
  padding: 8px 16px;
}

.content-bd /deep/ .ant-spin-container:first-child {
  display: flex;
}

.part /deep/ .ant-spin-container {
  width: 300px;
}

/deep/ .ant-steps-item-subtitle {
  margin: 0;
}

/deep/ .ant-steps-dot .ant-steps-item-content,
.ant-steps-dot.ant-steps-small .ant-steps-item-content {
  width: calc(100% - 26px);
}

/deep/ .ant-steps-item-title {
  width: 100%;
}

/deep/ .ant-steps-dot .ant-steps-item-process .ant-steps-item-icon,
.ant-steps-dot.ant-steps-small .ant-steps-item-process .ant-steps-item-icon {
  width: 8px;
  height: 8px;
}

/deep/ .ant-progress-status-success .ant-progress-text {
  color: #01b065;
}
</style>