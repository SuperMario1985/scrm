<template>
	<div class="sider-one">
		<div class="sider-one-txt">选择企业微信</div>
		<a-select
				showSearch
				optionFilterProp="children"
				style="width: 200px;margin-bottom: 20px;"
				@change="handleChange"
				v-model="changeBackground"
				v-if="corpInfo[0]"
		>
			<template v-for="item in corpInfo">
				<a-select-option :value="item.corpid">{{item.corp_name}}</a-select-option>
			</template>
		</a-select>
		<div class="wx-info" style="position: absolute;" ref="corpInfo" @mousemove="corpInfoMouseOver"
		     @mouseout="corpInfoMouseOut">
			<template v-for="(item,index) in corpInfo">
				<div
						@click="selectWx(item.corpid)"
						class="selectWx"
						:class="{ active:changeBackground == item.corpid}"
				>
					<img src="../../assets/WeChatLogo.png" alt="" style="width: 32px;border-radius: 4px;">
					<span style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;float: right;width: calc(100% - 35px);">{{item.corp_name}}</span>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
	export default {
		name   : "eWechat",
		props  : {
			callback: {
				type   : Function,
				default: null
			}
		},
		data () {
			let changeBackground =
				localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpInfo        : [],
				changeBackground: changeBackground,
			}
		},
		created () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				// if (!this.changeBackground && this.corpInfo.length > 0) {
				// 	this.changeBackground = this.$store.state.corpId;
				// }
				// else if (this.corpInfo.length > 0) {
				// 	this.changeBackground = this.corpInfo[0].corpid
				// }
				if (this.callback !== null && typeof this.callback === "function") {
					this.callback(this.changeBackground);
				}
			});
		},
		methods: {
			// 企业微信号
			handleChange (value) {
				let name = ''
				this.corpInfo.map((x) => {
					if (value == x.corpid) {
						name = x.corp_name
						this.$store.dispatch("changeCorp", x);
					}
				})
				this.changeBackground = value;
				this.$emit('changeWxId', value, name)
				if(localStorage.getItem('isMasterAccount') == 2){
					this.$store.dispatch('getPermissionButton')
				}
			},
			selectWx (id) {
				this.handleChange(id)
			},
			corpInfoMouseOver () {
				this.$refs.corpInfo.style.overflowY = "auto";
			},
			corpInfoMouseOut () {
				this.$refs.corpInfo.style.overflowY = "hidden";
			},
		}
	}
</script>

<style scoped>
	.sider-one {
		padding: 0 20px;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
	}

	.wx-info {
		width: 100%;
		position: absolute;
		left: 0;
		top: 100px;
		bottom: 0;
		overflow: hidden;
	}

	.wx-info::-webkit-scrollbar {
		width: 2px;
		height: 100%;
	}

	.wx-info::-webkit-scrollbar-track-piece {
		background-color: #FFFFFF;
	}

	.wx-info::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
		background: #FFFFFF;
	}

	.selectWx {
		width: 200px;
		margin-left: 20px;
		height: 50px;
		line-height: 50px;
		cursor: pointer;
		padding-left: 10px;
	}

	.active {
		background: #1E90FF;
		color: white;
	}
</style>