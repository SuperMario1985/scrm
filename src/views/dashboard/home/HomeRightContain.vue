<template>
    <div ref="scroll" @mousewheel="scrollWheel" style="width: 100%; height: 100%;overflow: hidden;"
         @mouseover="scroll" @mouseout="scrollOut" @mousemove="scroLineMove" @mouseup="scroLineUp">
        <div ref="scroLeft" class="home-right-container">
            <div class="quick-enter-contain">
                <div class='title'>
                    <label>快速入口</label>
                </div>
                <div class="quick-enters">
                    <div class="quick-enter-item">
                        <i class="quick-item-icon edit-icon">
                            <a-icon type="edit" />
                        </i>
                        <div class="quick-item-detail">
                            <label class="quick-item-title">新建素材</label>
                            <label class="quick-item-desc">便捷编辑，丰富模板</label>
                        </div>
                    </div>
                    <div class="quick-enter-item">
                        <i class="quick-item-icon qrcode-icon">
                            <a-icon type="qrcode" />
                        </i>
                        <div class="quick-item-detail">
                            <label class="quick-item-title">渠道二维码</label>
                            <label class="quick-item-desc">设置带有参数的二维码</label>
                        </div>
                    </div>
                    <div class="quick-enter-item">
                        <i class="quick-item-icon message-icon">
                            <a-icon type="message" />
                        </i>
                        <div class="quick-item-detail">
                            <label class="quick-item-title">客服消息</label>
                            <label class="quick-item-desc">定时推送，不限次数</label>
                        </div>
                    </div>
                </div>
            </div>
            <div style="padding: 24px 20px; border-bottom: 1px solid rgb(233, 233, 233); background: rgb(250, 250, 250);">
                <div class="update-log">
                    <div class="update-log-title">
                        <p>更新日志</p>
                        <button type="button" class="ant-btn"><span>更 多</span></button>
                    </div>
                    <div class="update-log-items-contain">
                        <div class="update-log-item">
                            <div class="update-log-item-title">
                                <a-icon type="clock-circle" class="iconfont" />
                                <p class="update-log-name">渠道二维码支持修改</p>
                                <p class="update-log-time">2019.10.10</p>
                            </div>
                            <div class="update-log-content-contain">
                                <p class="update-log-content">点击修改，可重新设置回复、粉丝标签。</p>
                            </div>
                        </div>
                        <div class="update-log-item">
                            <div class="update-log-item-title">
                                <a-icon type="clock-circle" class="iconfont" />
                                <p class="update-log-name">新功能：自定义菜单上线</p>
                                <p class="update-log-time">2019.9.18</p>
                            </div>
                            <div class="update-log-content-contain">
                                <p class="update-log-content">为不同角色设置个性化菜单；客服消息——文字消息，可插入小程序链接。</p>
                            </div>
                        </div>
                        <div class="update-log-item">
                            <div class="update-log-item-title">
                                <a-icon type="clock-circle" class="iconfont" />
                                <p class="update-log-name">新增3个月高级版，支付宝付款</p>
                                <p class="update-log-time">2019.9.04</p>
                            </div>
                            <div class="update-log-content-contain">
                                <p class="update-log-content">补充每日配额，请点击右上角“升级”查看详情。</p>
                            </div>
                        </div>
                        <div class="update-log-item">
                            <div class="update-log-item-title">
                                <a-icon type="clock-circle" class="iconfont" />
                                <p class="update-log-name">UI改版和删除图文</p>
                                <p class="update-log-time">2019.8.16</p>
                            </div>
                            <div class="update-log-content-contain">
                                <p class="update-log-content">全新素材库、粉丝消息视觉设计；高级群发增加删除已群发的图文按钮。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="common-problem">
                <div class="common-problem-title">
                    <p>常见问题</p>
                    <button type="button" class="ant-btn"><span>更 多</span></button>
                </div>
                <div class="common-problem-items-contain">
                    <div class="common-problem-item">
                        <i class="listIcon"></i>
                        <p>
                            <a href="https://support.qq.com/products/59903/faqs/48432" target="_blank">客服消息怎么用？</a>
                        </p>
                    </div>
                    <div class="common-problem-item">
                        <i class="listIcon"></i>
                        <p>
                            <a href="https://support.qq.com/products/59903/faqs/48528" target="_blank">互动粉丝是指什么？</a>
                        </p>
                    </div>
                    <div class="common-problem-item">
                        <i class="listIcon"></i>
                        <p>
                            <a href="https://support.qq.com/products/59903/faqs/49314" target="_blank">粉丝打标签有几种方法？</a>
                        </p>
                    </div>
                    <div class="common-problem-item">
                        <i class="listIcon"></i>
                        <p>
                            <a href="https://support.qq.com/products/59903/faqs/49315" target="_blank">智能推送是什么？</a>
                        </p>
                    </div>
                    <div class="common-problem-item">
                        <i class="listIcon"></i>
                        <p>
                            <a href="https://support.qq.com/products/59903/faqs/48611" target="_blank">高级群发与公众号的一般群发有什么区别？</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div ref="scroRight" class="scro-right" @mouseover="changeWidthBig"
             @mouseout="changeWidthSmall" @mouseup="jumpScroll">
            <div v-show="scrollFlag && scroRight" ref="scroLine" class="scro-line" @mousedown="scroLineDown">

            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomeRightContain',
    mounted() {
        this.initFirefoxScroll()
        this.setScroLineHeight()
    },
    data() {
        return {
            mouseEnterFlag         : false,
            startY                 : 0,
            scrollFlag             : true,
            scroRight              : true,
        }
    },
    methods: {
        // 滚动条高度
        setScroLineHeight () {
            let that = this
            let winHeight = 0;
            this.$refs.scroLeft.clientHeight
            if (window.innerHeight) {
                winHeight = window.innerHeight;
            } else if ((document.body) && (document.body.clientHeight)) {
                winHeight = document.body.clientHeight;
            }
            if (winHeight >= that.$refs.scroLeft.scrollHeight) {
                that.scroRight = false
            } else {
                that.$refs.scroLine.style.height = winHeight / that.$refs.scroLeft.scrollHeight * that.$refs.scroRight.scrollHeight + "px";
                that.scroRight = true
            }
        },
        // 滚动条变宽
        changeWidthBig () {
            this.$refs.scroLine.style.width = "10px";
            this.$refs.scroLine.style.backgroundColor = '#AAAAAA'
        },
        // 滚动条变窄
        changeWidthSmall () {
            if (!this.mouseEnterFlag) {
                this.$refs.scroLine.style.width = "5px";
                this.$refs.scroLine.style.backgroundColor = '#D3D3D3';
            }
            this.changeWidthSmallFlag = true
            // this.mouseEnterFlag = false;
        },
        // 滑轮滚动（火狐）
        initFirefoxScroll () {
            let that = this
            this.setScroLineHeight()
            if (document.addEventListener) {
                document.addEventListener('DOMMouseScroll', function (e) {
                    let event1 = window.event || e;
                    let Y = that.$refs.scroLeft.scrollTop;
                    let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
                    if (event1.detail >= 0) {
                        Y = Y + 80
                    } else {
                        Y = Y - 80
                    }
                    if (Y < 0) Y = 0;
                    if (Y > H) Y = H;
                    that.$refs.scroLeft.scrollTop = Y;
                    let SH = Y / H * that.$refs.scroRight.clientHeight - that.$refs.scroLine.clientHeight;
                    if (SH < 0) SH = 0;
                    that.$refs.scroLine.style.top = SH + "px";
                }, false)
            }
        },
        // 滑轮滚动
        scrollWheel () {
            var event = event ? event : (window.event ? window.event : null);
            let Y = this.$refs.scroLeft.scrollTop;
            let H = this.$refs.scroLeft.scrollHeight - this.$refs.scroLeft.clientHeight;
            if (event.wheelDelta >= 120) {
                Y = Y - 50
            } else {
                Y = Y + 50
            }
            if (Y < 0) Y = 0;
            if (Y > H) Y = H;
            this.$refs.scroLeft.scrollTop = Y;
            let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
            if (SH < 0) SH = 0;
            this.$refs.scroLine.style.top = SH + "px";
        },
        // 滚动栏点击跳转
        jumpScroll () {
            let that = this
            if (!that.mouseEnterFlag) {
                var event = event ? event : (window.event ? window.event : null);
                let Y = that.$refs.scroLeft.scrollTop;
                let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
                if (event.y - that.startY >= 0) {
                    Y = Y + (event.y - that.startY) / that.$refs.scroLeft.clientHeight * that.$refs.scroLeft.scrollHeight
                } else {
                    Y = Y + (event.y - that.startY) / that.$refs.scroLeft.clientHeight * that.$refs.scroLeft.scrollHeight
                }
                that.$refs.scroLeft.scrollTop = Y;
                if (Y < 0) {
                    Y = 0;
                }
                if (Y > H) {
                    Y = H;
                }
                let SH = Y / H * that.$refs.scroRight.clientHeight - that.$refs.scroLine.clientHeight;
                if (SH < 0) SH = 0;
                that.$refs.scroLine.style.top = SH + "px";
                that.startY = event.y
            }
        },
        // 滚动条点击
        scroLineDown () {
            this.mouseEnterFlag = true
            this.startY = event.y;  // 按下鼠标指针的y轴坐标
            if (window.addEventListener) {
                window.addEventListener('mouseup', this.scroLineUp, false)
                window.addEventListener('mousemove', this.scroLineMove, false)
            }
            this.$emit('banUserSelect', {});
        },
        // 滚动条长按移动
        scroLineMove () {
            let that = this
            if (that.mouseEnterFlag) {
                var event = event ? event : (window.event ? window.event : null);
                let Y = that.$refs.scroLeft.scrollTop;
                let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
                let CH = (event.y - that.startY)/that.$refs.scroLeft.clientHeight*that.$refs.scroLeft.scrollHeight;
                Y = Y + CH;
                that.$refs.scroLeft.scrollTop = Y;
                if (Y < 0) {
                    Y = 0;
                }
                if (Y > H) {
                    Y = H;
                }
                let SH = Y / H * that.$refs.scroRight.clientHeight - that.$refs.scroLine.clientHeight;
                if (SH < 0) SH = 0;
                that.$refs.scroLine.style.top = SH + "px";

                that.startY = event.y;
            }
        },
        // 鼠标左击抬起
        scroLineUp () {
            if(this.mouseEnterFlag == true) {
                var event = event ? event : (window.event ? window.event : null);
                this.mouseEnterFlag = false
                if (this.changeWidthSmallFlag) {
                    this.changeWidthSmall()
                    this.changeWidthSmallFlag = false
                }
                if (this.scrollOutFlag) {
                    this.scrollOut()
                    this.scrollOutFlag = false
                }
                if (window.removeEventListener) {
                    window.removeEventListener('mouseup', this.scroLineUp, false)
                    window.removeEventListener('mousemove', this.scroLineMove, false)
                }
                this.$emit("userSelect", {})
            }
        },
        // 鼠标进入左边页面
        scroll () {
            this.scrollFlag = true
        },
        // 鼠标移出左边页面
        scrollOut () {
            if (!this.mouseEnterFlag) {
                this.scrollFlag = false
            }
            this.scrollOutFlag = true
        },
    }
}
</script>

<style scoped>
    .scro-right {
        position: relative;
        float: right;
        height: 100%;
        width: 12px;
        background-color: #ffffff;
        overflow: hidden;
    }

    /*滚动条*/
    .scro-line {
        position: absolute;
        z-index: 1;
        top: 0px;
        right: 2px;
        width: 5px;
        border-radius: 3px;
        height: 400px;
        overflow: hidden;
        background-color: #D3D3D3;
    }
    .home-right-container{
        float: left;
        width: 100%;
        width: calc(100% - 12px);
        width: -moz-calc(100% - 12px);
        width: -webkit-calc(100% - 12px);
        height: 100%;
        /*background-color: #E9E9E9;*/
        max-height: 100%;
        overflow: hidden;
        /*width: 100%;*/
        /*height:100%;*/
		background-color: #ffffff;
		/*max-height: 100%;*/
		/*overflow-y: scroll;*/
    }
    .quick-enter-contain{
		padding: 24px 20px;
    	border-bottom: 1px solid #e9e9e9;
	}
	.quick-enter-contain .title{
		color: #1a1a1a;
    	font-size: 16px;
	}
    .quick-enter-item {
        border: 1px solid #e0e0e0;
        cursor: pointer;
        margin-top: 16px;
        padding: 20px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }
    .quick-enter-item:hover {
        background-color: #ccc;
    }
	.quick-enter-item .quick-item-icon{
		font-size: 20px;
		text-align: center;
		height: 40px;
		width: 40px;
		min-width: 40px;
		min-height: 40px;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
		border-radius: 2px;
		color: #fff;
	}
	.quick-enter-item .edit-icon{
		background: rgb(59, 116, 255);
	}
	.quick-enter-item .qrcode-icon{
		background: rgb(245, 166, 35);
	}
	.quick-enter-item .message-icon{
		background: rgb(71, 198, 140);
	}
	.quick-item-detail {
		margin-left: 16px;
		min-width: 40px;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-direction: column;
		flex-direction: column;
	}
	.quick-item-title{
        cursor: pointer;
		color: #1a1a1a;
		font-size: 14px;
	}
	.quick-item-desc{
        cursor: pointer;
		padding-top: 2.5px;
		color: #999999;
		font-size: 14px;
		min-width: 40px;
		overflow: hidden;
		word-wrap: normal;
		max-width: 190px;
		height: 21px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
    .update-log {
        padding: 0 0 12px 0;
        background: #fafafa;
        overflow: hidden;
    }
    .update-log .update-log-title {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        /* align-items: center; */
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        color: #1a1a1a;
    }
    .update-log-title p {
        font-size: 16px;
        color: #1a1a1a;
    }
    .update-log-title button {
        margin-left: auto;
        width: 47px;
        height: 24px;
        text-align: center;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        font-size: 14px;
        color: #3b74ff;
        border-color: #3b74ff;
        background: #fafafa;
        cursor: pointer;
    }
    .update-log-title .ant-btn {
        color: #3b74ff;
        border-color: #3b74ff;
        border-radius: 2px;
    }
    .update-log-title .ant-btn:hover{
        background: #1890ff;
        color: #fff;
    }
    /* .update-log-items-contain {
        margin-top: 5px;
    } */
    .update-log-items-contain .update-log-item {
        margin-top: 12px;
        min-width: 150px;
    }
    .update-log-item .update-log-item-title {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        margin: 5px 0px;
    }
    .update-log-item .update-log-item-title i {
        font-size: 14px;
        color: #999999;
    }
    .update-log-item-title .update-log-name {
        color: #1a1a1a;
        font-size: 14px;
        margin: 0;
        padding: 0;
        max-width: 200px;
        margin-left: 9px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .update-log-item-title .update-log-time {
        margin-left: auto;
        font-size: 14px;
        color: #999999;
        margin-bottom: 0px;
    }
    .update-log-item .update-log-content-contain {
        margin-top: 4px;
        padding-top: 4px;
        margin-left: 7px;
        padding-left: 16px;
        padding-bottom: 1px;
        border-left: 1px solid #d8d8d8;
    }
    .update-log-item .update-log-content {
        color: #999999;
        font-size: 14px;
        overflow-wrap: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .common-problem {
        padding: 24px 20px;
        height: 297px;
    }
    .common-problem .common-problem-title {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }
    .common-problem .common-problem-title p {
        color: #1a1a1a;
        font-size: 16px;
        margin-bottom: 0px;
    }
    .common-problem .common-problem-title button {
        margin-left: auto;
        width: 47px;
        height: 24px;
        text-align: center;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        font-size: 14px;
        color: #3b74ff;
        border-color: #3b74ff;
        background: #fff;
        cursor: pointer;
    }
    .common-problem .common-problem-title .ant-btn {
        color: #3b74ff;
        border-color: #3b74ff;
    }
    .common-problem .common-problem-title .ant-btn:hover {
        color: #ffffff;
        background-color: #3b74ff;
    }
    .common-problem .common-problem-items-contain {
        margin-top: -4px;
    }
    .common-problem .common-problem-items-contain .common-problem-item {
        margin-top: 20px;
        color: #686868;
        font-size: 14px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }
    .common-problem .common-problem-items-contain .common-problem-item p {
        margin-left: 8px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 0px;
    }
    .common-problem .common-problem-items-contain .common-problem-item .listIcon{
        display: inline-block;
        width: 4px;
        height: 4px;
        background-color: #999999;
        border-radius: 100%;
    }
    .common-problem .common-problem-items-contain .common-problem-item p a {
        color: #1a1a1a;
    }
    .common-problem .common-problem-items-contain .common-problem-item p a:hover {
        color: #1890ff;
    }
</style>
