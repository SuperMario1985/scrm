<template>
	<div class="guide">
		<a-layout style="position: relative; height: 100%; overflow: hidden">
			<a-layout class="scroll" style="position: absolute;left: 0;top:0;bottom:0;right:0; overflow-x: hidden; overflow-y: auto;">
				<!-- 头部 -->
				<a-layout-header>导购管理</a-layout-header>
				<!-- 内容 -->
				<a-layout-content>
					<div style="padding: 15px 20px;background: #FFF;">
						<div class="content-msg">
							<p style="margin-bottom: 2px;">
								1、导购是本企业的已实名员工，需要是已激活未删除状态，且拥有外部联系人权限，当前未离职。
							</p>
							<p style="margin-bottom: 2px;">
								2、建议先前往<router-link to="/store/list">【门店管理】</router-link>页面设置门店和员工，会显示员工和所属门店，如果一个员工同时在两个门店是作为两个导购处理。
							</p>
							<p style="margin-bottom: 2px;">
								3、顾客关联导购之后，导购可以在企微侧边栏菜单对顾客进行相应的操作。企微顾客可以根据相关规则自动关联，点击<router-link to="/shopCustom/guideSet">【导购设置】</router-link>。
							</p>
							<p style="margin-bottom: 2px;">
								4、一个顾客可能会关联多个导购人员。
							</p>
						</div>
						<div class="content-hd">
							<span class="select-option">
								<!-- <a-button @click="showDepartmentList" style="width: 210px;margin-right: 5px;">
									<span v-if="chooseNum > 0">已选择{{chooseUserNum}}名导购，{{chooseDepartmentNum}}个部门</span>
									<span v-else>选择导购</span>
								</a-button> -->
								<a-button style="width: 210px;margin-right: 5px;" @click="showStoreModal" v-if="storeIds.length == 0">
									<span>选择门店</span>
								</a-button>
								<template v-if="storeIds.length > 0">
									<a-popover placement="right">
										<span slot="content">
											<div style="max-width: 375px;">
												<a-tag color="orange" 
													v-for="(item,index) in storeDetail"
													style="display: inline-block; margin: 0 10px 5px 0;" :key="index">
													{{item.title}}
												</a-tag>
											</div>
										</span>
										<a-button @click="showStoreModal" style="width: 210px;margin-right: 5px;">
											已选择{{storeIds.length}}个门店
										</a-button>
									</a-popover>
								</template>
							</span>
							<span class="select-option">
								<label>快速搜索：</label>
								<a-input placeholder="员工姓名/昵称/手机号" @keyup.enter="searchStaff" v-model="keyWord"></a-input>
							</span>
							<span class="select-option" v-if="roleArr.length>0">
								<label>角色选择：</label>
								<a-select
									showSearch
									optionFilterProp="children" 
									placeholder="角色选择"
									v-model="roleVal"
								>
									<a-select-option :value="-1">角色选择</a-select-option>
									<a-select-option :value="index" v-for="(item,index) in roleArr" :key="index">{{item}}</a-select-option>
								</a-select>
							</span>
							<span class="select-option">
								<a-button type="primary" style="margin-right: 5px;" @click="searchStaff">查找</a-button>
								<a-button style="margin-right: 10px;" @click="reset">清空</a-button>
							</span>
						</div>
						<div class="content-bd">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table 
									:rowSelection="rowSelection"
									:columns="columns"
									:dataSource="customList"
									:pagination="false">
									<div slot="custom_amount" slot-scope="text, record">
										<router-link :to="'/shopCustom/CustomManage?guide_id='+record.id+'&store_id='+record.store_id">{{text}}</router-link>
									</div>
									<template slot="handle" slot-scope="text, record">
										<a-button @click="downCode(record.qc_url,1)" v-if="record.qc_url">下载码</a-button>
										<a-button v-else>暂无下载码</a-button>
									</template>
								</a-table>
								
								<div style="padding: 0 15px;">
									<div style="margin: 20px 0px;line-height: 32px;" v-show="total > 0">
										<a-checkbox v-model="batchTypeValue" @click="batchTypeChange"></a-checkbox>
										当前页
										<a-button type="primary" 
											style="margin-right: 5px"
											:disabled="this.selectedRowKeys.length > 0 ? false : true"
											@click="downCode(codeId)">下载码
										</a-button>
									</div>
									<!--分页 -->
									<div class="pagination" style="margin: 20px 0px;overflow:hidden;"
										v-show="total > 0">
										<div class="pagination" style="display: inline-block;height: 32px;float: right;">
											<a-pagination :total="total" showSizeChanger
												:showQuickJumper="quickJumper"
												:current="page"
												:pageSize="pageSize"
												:pageSizeOptions="['15','30','50','100']"
												@change="changePage"
												@showSizeChange="showSizeChange"/>
										</div>
									</div>
								</div>
							</a-spin>
						</div>
					</div>
					
					<!--部门选择框-->
					<chooseDepartment 
						ref="user" 
						:id="corpId" 
						:show="showModalDepartment" 
						:chooseNum="chooseNum" 
						:callback="modalVisibleChange" 
						:is_special="1"></chooseDepartment>
					<!-- 门店或分组 -->
					<store-list 
						:groupVisible="storeVisible" 
						:storeIds="JSON.parse(JSON.stringify(storeIds))"
						:storeDetail="JSON.parse(JSON.stringify(storeDetail))"
						@setGroupId="setGroupId"></store-list>
					
				</a-layout-content>
			</a-layout>
		</a-layout>
	</div>
</template>

<script>
	import chooseDepartment from "@/components/ChooseDepartment.vue";//部门选择框
	import storeList from '@/components/storeGroup/CheckboxIndex';//选择门店或分组
	
	const columns = [
		{
			title      : "姓名",
			dataIndex  : "name",
			key        : "name",
		},
		{
			title      : "类型",
			dataIndex  : "type",
			key        : "type",
		},
		// {
		// 	title      : "角色",
		// 	dataIndex  : "role",
		// 	key        : "role",
		// },
		{
			title      : "所属门店",
			dataIndex  : "group_name",
			key        : "group_name",
			ellipsis: true,
		},
		{
			title      : "顾客总数",
			dataIndex  : "num",
			key        : "num",
			scopedSlots: {customRender: "custom_amount"},
		},
		{
			title      : "本月关联顾客",
			dataIndex  : "month_num",
			key        : "month_num",
		},
		{
			title      : "操作",
			scopedSlots: {customRender: "handle"},
		}
	];
	export default{
		name: "guideSet",
		components:{
			chooseDepartment,
			storeList,
		},
		data(){
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpId,
				
				showModalDepartment: false, //成员选择框显示与隐藏
				guideList: [],//选择的导购
				guideListId: [],//选择的导购id
				chooseNum: 0,//导购成员总个数
				chooseUserNum: 0,//导购个数
				chooseDepartmentNum: 0,//导购部门个数
				
				keyWord: '',//快速搜索关键词
				roleVal: -1,//角色的默认值
				roleArr: ['销售','店长','副店长'],//角色数组
				
				isLoading: false,//Loading 组件显示与隐藏
				columns,//表头
				customList:[],//表格信息
				page: 1, //页码
				pageSize: 15,//分页个数
				total: 1, //总条数
				quickJumper: false, // 是否显示快速跳转的控件
				batchTypeValue: false,//选择当前页，是否选中
				selectedRowKeys: [], // 选择多少条
				checkArr: [],//选择当前页，保存的key
				checkList: {},//全选时数据
				codeId: [],//下载码id
				
				storeVisible: false, // 选择门店或分组弹窗显示
				storeIds: [], // 选择的门店或分组列表
				storeDetail: [], // 选择门店或分组弹窗的数据
			}
		},
		methods: {
			
			showDepartmentList(){//导购弹窗显示与数据回填
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.guideListId))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.guideList))
				
				this.showModalDepartment = true
			},
			modalVisibleChange(event, arr, userNum, departmentNum, list){//导购弹窗回调
				if(event == "ok"){
					this.guideList = list
					this.guideListId = arr
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
				}
				this.showModalDepartment = false
			},
			searchStaff(){//查找
				this.getCustomList();
			},
			reset(){//清空
				let that = this
				that.guideList = []
				that.guideListId = []
				that.chooseNum = 0
				that.chooseUserNum = 0
				that.chooseDepartmentNum = 0
				that.keyWord = ""
				that.roleVal = -1
				
				that.storeIds = []
				that.storeDetail = []
				
				that.getCustomList();
			},
			//获取表格内容
			async getCustomList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				let that = this
				let params={
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					page: page,
					page_size: pageSize,
					guide_keyword: that.keyWord,
					operator: 1,
					store_id: that.storeIds.toString()
				}
				const {data: res} = await this.axios.post("shop-customer-guide/list", params);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					
					this.roleArr = []
					this.customList = res.data.result;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
					
					this.checkArr = []
					this.customList.map(x => {
						this.checkArr.push(x.key)
					})
					this.batchTypeValue = false
					if (this.selectedRowKeys.length > 0) {
						this.batchTypeValue = true
						this.checkArr.map(y => {
							if (this.selectedRowKeys.indexOf(y) == -1) {
								this.batchTypeValue = false
							}
						})
					}
				}
			},
			changePage (page, pageSize) {// 分页
				this.getCustomList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 40)
				})
			},
			showSizeChange (page, pageSize) {//改变每页条数
				this.getCustomList(1, pageSize);
			},
			
			onSelectChange (selectedRowKeys, value) {//表格复选框事件
				this.selectedRowKeys = selectedRowKeys;
				this.batchTypeValue = this.checkArr.every(val => selectedRowKeys.includes(val))
				this.checkList = value
				this.codeId = []
				this.checkList.map(x => {
					this.codeId.push(x.code_id)
				})
			},
			batchTypeChange () {// 当前页多选框变化
				if (!this.batchTypeValue) {
					// 添加
					this.selectedRowKeys = this.checkArr
					this.checkList = this.customList
					this.checkList.map(x => {
						this.codeId.push(x.code_id)
					})
				} else {
					// 移除
					this.selectedRowKeys = []
					this.checkList = []
					this.codeId = []
				}
			},
			
			async downCode(code_id,type) {//下载码
				let that = this
				that.loading = true
				if(type == 1){//下载图片
					let url = this.$store.state.commonUrl + code_id
					let image = new Image()
					let arr = url.split('\/')
					let name = 'qc.png'
					if (arr.length > 0) {
						name = arr[arr.length - 1]
					}
					image.setAttribute('crossOrigin', 'anonymous')
					image.src = url
					image.onload = () => {
						let canvas = document.createElement('canvas')
						canvas.width = 200
						canvas.height = 200
						let ctx = canvas.getContext('2d')
						ctx.drawImage(image, 0, 0, 200, 200)
						canvas.toBlob((blob) => {
							let url = URL.createObjectURL(blob)
							that.download(url, name)
							// 用完释放URL对象
							URL.revokeObjectURL(url)
						})
					}
				}else{
					let params={
						corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
						code_id: code_id.toString()
					}
					let url="shop-customer-guide/download-code";
					const {data: res} = await that.axios.post(url, params);
					if (res.error != 0) {
						that.loading = false
						that.$message.error(res.error_msg);
					} else {
						that.loading = false
						window.open(res.data.url);
					}
				}
			},
			download (href, name) {
				let eleLink = document.createElement('a')
				eleLink.download = name
				eleLink.href = href
				eleLink.click()
				eleLink.remove()
			},
			
			showStoreModal() {// 展示门店列表弹窗
				this.storeVisible = true
			},
			setGroupId (evt, ids, stores) {// 确认门店回调
				if (evt == 'ok') {
					this.storeIds = JSON.parse(JSON.stringify(ids))
					this.storeDetail = JSON.parse(JSON.stringify(stores))
				}
				this.storeVisible = false
			},
			
		},
		computed: {
			rowSelection () {//表格选择框
				const {selectedRowKeys} = this;
				let that = this
				return {
					selectedRowKeys,
					onChange: this.onSelectChange,
					hideDefaultSelections: true,
					onSelection: that.onSelection
				};
			},
		},
		mounted() {
			this.$store.dispatch('getCorp', (info) => {
			
				this.getCustomList()
			});
		}
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	
	.guide{
		width: 100%;
		height: 100%;
	}
	.ant-layout-header{
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}
	
	.ant-layout-content{
		margin: 20px;
		min-width: 885px;
		background-color: #FFFFFF;
	}
	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		text-align: left;
		margin-bottom: 20px;
	}
	.content-hd {
		margin-top: 20px;
		width: 100%;
		min-width: 885px;
		.select-option{
			display: inline-block;
			margin-right: 10px;
			margin-bottom: 10px;
			label{
				margin-right: 5px;
				display: inline-block;
				text-align: right;
				width: 100px;
			}
			.ant-input,.ant-select{
				margin-right: 5px;
				width: 210px;
			}
		}
	}
	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		width: 100%;
	}
</style>
