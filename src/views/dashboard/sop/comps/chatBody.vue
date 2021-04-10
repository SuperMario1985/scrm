<template>
	<div>
		<div class="flex items-center ss-chat-body p-2 br2 pr-10 inline-block">
			<chatImgs :imgs="chat_item.avatarData"></chatImgs>
			<div class="pl-10">
				<div class="">
					<a-popover placement="top">
						<div slot="content">
							<div>{{chat_item.name}}</div>
						</div>
						<div>
							<div class="flex items-center text-blue-501">
								<div class="ss-chat-text ss-ellipsis-1 ss-break-all">{{chat_item.name}}</div>
								<div class="flex-none">({{chat_item.member_num}})</div>
							</div>
							<div>
								<div class="ss-chat-text ss-ellipsis-1 ss-break-all text-gray-501 text-12">群主：{{chat_item.ownerName}}</div>
							</div>
						</div>


					</a-popover>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
    import chatImgs from '../../../../components/chatImgs'
    export default {
        name: "chatBody",
	    props: {
            chat_item: { // 群
                type : Object,
	            default () {
                    return {}
	            }
            }
	    },
	    components: {
            chatImgs
	    },
    }
</script>

<style scoped>
	.ss-chat-text{max-width: 160px}
	.ss-chat-body {background: #fafafa; border: 1px solid #e6e6e6; width: fit-content;}
</style>
