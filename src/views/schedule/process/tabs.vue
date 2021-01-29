<template>
  <div>
    <div style="padding: 0.11rem">
      <el-tabs v-model="activeName" class="tabs" @tab-click="handleTabs" >
        <el-tab-pane label="进度管理" name="first" :key="'first'" class="label_top">
          <shou-ye v-if="shouye"></shou-ye>
        </el-tab-pane>
        <el-tab-pane label="自检记录" name="second" :key="'second'" class="label_top">
          <self-check v-if="self"></self-check>
        </el-tab-pane>
       
        <el-tab-pane label="监督检查" name="third" :key="'third'" class="label_top">
          <supervise-check v-if="supCheck"> </supervise-check>
          <!-- <special-equ> </special-equ> -->
        </el-tab-pane>
        <el-tab-pane label="劳务考勤" name="fourth" :key="'fourth'" class="label_top">
          <service-kq v-if="serviceKq"></service-kq>
           <!-- <service-kq></service-kq> -->
        </el-tab-pane>
        <el-tab-pane label="资料管理" name="fiveth" :key="'fiveth'" class="label_top">
          <data-index v-if="dataManager"></data-index>
    
        </el-tab-pane>

      </el-tabs>
    </div>


  </div>
</template>

<script>

import shouYe from './node'
import selfCheck from "./selfCheck";
import superviseCheck from './superviseCheck';
import serviceKq from './serviceKq';
import dataIndex from './dataIndex';
export default {
  name: "peopleManager",
  components: {
    
    shouYe,
    selfCheck,
    superviseCheck,
    serviceKq,
    dataIndex
  },
  data(){
    return{
      activeName: 'first',
      shouye: true,
      supCheck: false,
      dataManager: false,
      serviceKq: false,
      self: false
    }

  },
  mounted() {
    // this.$store.dispatch('changeMsg', '人员管理')

  },
  methods:{
    handleTabs(tab, event) {
      console.log("TAB", tab)
       if(tab.name === 'first') {
         this.shouye = true
         this.self = false
         this.supCheck = false
         this.serviceKq = false
         this.dataManager = false
       } else if(tab.name === 'second') {
         this.shouye = false
         this.self = true
         this.supCheck = false
         this.serviceKq = false
         this.dataManager = false
       } else if(tab.name === 'third') {
         this.shouye = false
         this.self = false
         this.supCheck = true
         this.serviceKq = false
         this.dataManager = false
       } else if(tab.name === 'fourth'){
         this.shouye = false
         this.self = false
         this.supCheck = false
         this.serviceKq = true
         this.dataManager = false
       } else {
         this.shouye = false
         this.self = false
         this.supCheck = false
         this.serviceKq = false
         this.dataManager = true
       }
    },
  }

}
</script>

<style scoped>
.tabs  >>>.el-tabs__item{
  /* color: #fff; */
}
.tabs >>>.el-tabs__item.is-active {
  color: #409EFF;
}
.tabs >>> .el-tabs__item:hover {
  color: #409EFF;
}
.tabs >>> .el-tabs__nav-wrap::after {
    height: 0;
  }
/*.tabs >>> .el-tabs__active-bar {*/
  /*height: 1px;*/
/*}*/
.tabs >>> .el-tabs__nav-wrap {
  /* background-image: url("../../assets/homepage/notice_bg.png"); */
  padding-left: 0.3rem;
}
</style>

