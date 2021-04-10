<template>
	<div class='py-10'>
		<div v-for="(t_item, t_index) in rules" :key='t_index'>

			<!--所有文本-->
			<div class="p-10 text-14 text-gray-900 ss-pre my-10 block br5 ss-break-all" :class="[isAdd?'bg-white': 'ss-add-rules']" v-if='t_item.context'>{{t_item.context}}</div>

			<!--图片-->
			<div class="my-10 flex flex-wrap" v-if="t_item.file_type==1 && t_item.uploadImg.length>0">
				<div class="mr-10" v-for="(f_item, f_index) in t_item.uploadImg" :key="f_index">
					<img class="w-100 h-100 object-cover" :src=" $store.state.commonUrl +f_item.local_path" alt="">
				</div>
			</div>

			<!--视频xxx-->
			<div class="my-10" v-if="t_item.uploadVideo&&t_item.uploadVideo.local_path&&t_item.add_type==0&&t_item.file_type==3">
				<app-video :src=" $store.state.commonUrl+ t_item.uploadVideo.local_path"></app-video>
			</div>
			<div class="my-10" v-if="t_item.materialVideo&&t_item.materialVideo.local_path&&t_item.add_type==1&&t_item.file_type==3">
				<app-video :src=" $store.state.commonUrl+t_item.materialVideo.local_path"></app-video>
			</div>


			<!--图文-->
			<div class="p-10 flex bg-white my-10 bg-white flex br5 bg-white"   v-if="t_item.uploadText&&t_item.add_type==0&&t_item.file_type==4 && (t_item.uploadText.url || t_item.uploadText.title || t_item.uploadText.description)">
				<div class='bg-gray-201 w-80 h-80 mr-10'>
					<img v-if='t_item.uploadText.url' :src="$store.state.commonUrl + t_item.uploadText.url " alt="" class="w-80 h-80 block object-cover">
					<img v-else src="../../../../assets/url.png" alt="" class="w-80 h-80 block object-cover">
				</div>
				<div class=" ">
					<div class="text-15 text-gray-900 mb-5 ss-break-all ss-ellipsis">{{t_item.uploadText.title}}</div>
					<div class="text-12 text-gray-501 ss-ellipsis-2 ss-break-all">{{t_item.uploadText.description}}</div>
				</div>
			</div>

			<div class="p-10 flex bg-white my-10 bg-white br5 bg-white" v-if="t_item.materialText&&t_item.add_type==1&&t_item.file_type==4">
				<div v-if='t_item.materialText.url' class='bg-gray-201 w-80 h-80 mr-10'>
					<img v-if='t_item.materialText.url' :src="$store.state.commonUrl  + t_item.materialText.url" alt="" class="w-80  h-80 block object-cover">
					<img v-else src="../../../../assets/url.png" alt="" class="w-80 h-80 block object-cover">
				</div>
				<div class="">
					<div class="text-15 text-gray-900 mb-5 ss-break-all ss-ellipsis">{{t_item.materialText.title}}</div>
					<div class="text-12 text-gray-501 ss-ellipsis-2 ss-break-all">{{t_item.materialText.description}}</div>
				</div>
			</div>

		</div>

		<div class='py-5 text-gray-501 text-14' v-if='!isAdd'>共{{count}}条</div>
	</div>
</template>

<script>
    import appVideo from '../../../../components/AppVideo'

    export default {
        name: "rulesPay",
        components: {
            appVideo
        },
        props: {
            rules: {
                type: Array,
                default() {
                    return []
                }
            },
            isAdd: { // 是否是添加
                type: [Number, Array],
                default() {
                    return 0
                }
            }
        },
	    computed:{
            count () {
                var n = 0
	            this.rules.forEach((t_item, t_index) => {
	                if (t_item.context) {
	                    n++
	                }

                    if (t_item.file_type==1 && t_item.uploadImg.length>0) {
                        n++
                    }

                    if (t_item.uploadVideo&&t_item.uploadVideo.local_path&&t_item.add_type==0&&t_item.file_type==3) {
                        n++
                    }

                    if(t_item.materialVideo&&t_item.materialVideo.local_path&&t_item.add_type==1&&t_item.file_type==3) {
                        n++
                    }

                    if(t_item.uploadText&&t_item.add_type==0&&t_item.file_type==4 && (t_item.uploadText.url || t_item.uploadText.title || t_item.uploadText.description)){
                        n++
                    }

                    if(t_item.materialText&&t_item.add_type==1&&t_item.file_type==4){
                        n++
                    }
	            })

	            return n
            }
	    },
        data() {
            return {}
        },
    }
</script>

<style scoped>
	.ss-pre {max-height: 13rem;white-space: pre-wrap; overflow: auto}
	.ss-add-rules{background: #fff;   }
</style>
