<template>
  <a-layout>
    <a-layout-content
      :style="{
        background: '#F1F1F1',
        margin: 0,
        minHeight: '280px',
        position: 'relative',
        height: '100%',
        'overflow-x': 'auto',
      }"
    >
      <keep-alive :include="urlList">
        <router-view> </router-view>
      </keep-alive>
    </a-layout-content>
  </a-layout>
</template>

<script>
export default {
  name: "Content",
  data() {
    return {
      urlList: [
        "customManageList",
        "filingCabinetList",
        "fissionList",
        "fissionParticipants",
        "raffleList",
        "raffleParticipants",
        "channelCodeList",
        "welcomeList",
        "massMessageList",
        "smsSendList",
        "smsTemplateList",
        "fansList",
        "replyList",
        "pushList",
        "sceneList",
        "customerList",
        "templateList",
        "seniorList",
        "redPacketEmployeeManagement",
        "redPacketReconciliation",
        "autoCreateList",
        "customCrmKanban",
        "channelCodeBaiduList",
        "redFissionList",
        "redFissionParticipants",
        "customManageList",
        "ViolationsNotice",
        "groupList",
        "tagsCreateList",
        "highSeasCustomerList",
        "wholeMarketFissionList",
        "redForNewRule",
        "redForNewList",
        "wxWholeMarketFission",
        "groupClockIn",
        "customRecord",
        "smartRecommendedList",
      ],
    };
  },
};
</script>

<style scoped>
</style>