<template>
  <div>
    <div style="padding: 0.11rem">
      <el-tabs v-model="activeName" class="tabs" @tab-click="handleTabs" >
        <el-tab-pane label="项目情况" name="first" :key="'first'" class="label_top">
          <project-info v-if="info"></project-info>
        </el-tab-pane>
        <el-tab-pane label="参建单位" name="second" :key="'second'" class="label_top">
          <project-manager v-if="manager"></project-manager>
        </el-tab-pane>
       
        <el-tab-pane label="单体记录" name="third" :key="'third'" class="label_top">
          <single-recoder v-if="recoder"> </single-recoder>
        </el-tab-pane>
        
      </el-tabs>
    </div>


  </div>
</template>

<script>

import projectInfo from './projectInfo'
import projectManager from "./projectManager";
import singleRecoder from './singleRecoder';

export default {
  name: "peopleManager",
  components: {
    
    projectInfo,
    projectManager,
    singleRecoder
    
  },
  data(){
    return{
      activeName: 'first',
      info: true,
      manager: false,
      recoder: false,
     
    }

  },
  mounted() {
    // this.$store.dispatch('changeMsg', '人员管理')

  },
  methods:{
    handleTabs(tab, event) {
      console.log("TAB", tab)
       if(tab.name === 'first') {
         this.info = true
         this.manager = false
         this.recoder = false
       } else if(tab.name === 'second') {
         this.info = false
         this.manager = true
         this.recoder = false
       } else {
         this.info = false
         this.manager = false
         this.recoder = true
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

