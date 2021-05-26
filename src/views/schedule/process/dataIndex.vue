<template>
  <div>
    <div style="padding: 0.11rem">
      <el-tabs v-model="activeName" class="tabs" @tab-click="handleTabs" addable>
        <el-tab-pane label="文件管理" name="first" class="label_top">
          <file-manager v-if="fileFlag"></file-manager>
        </el-tab-pane>
        <el-tab-pane label="图纸管理" name="second" class="label_top">
          <pdf-manager v-if="pdfFlag"></pdf-manager>
        </el-tab-pane>
       
        <el-tab-pane label="模型管理(CAD)" name="third" class="label_top">
          <cad-manager v-if="cadFlag"></cad-manager>
        </el-tab-pane>
       

      </el-tabs>
    </div>


  </div>
</template>

<script>
import fileManager from './fileManager'

import pdfManager from "./pdfManager";
import cadManager from './cadManager';

export default {
  name: "dataManage",
  components: {
    fileManager,
    pdfManager,
    cadManager
  },
  data(){
    return{
      activeName: 'first',
      fileFlag: true,
      pdfFlag: false,
      cadFlag: false
    }

  },
  mounted() {
    // this.$store.dispatch('changeMsg', '资料管理')

  },
  methods:{
    handleTabs(tab, event) {
       console.log(tab, event);
       if(tab.name === 'first') {
         this.fileFlag = true
         this.pdfFlag = false
         this.cadFlag = false
         
       } else if(tab.name === 'second') {
         this.fileFlag = false
         this.pdfFlag = true
         this.cadFlag = false
       } else {
         this.fileFlag = false
         this.pdfFlag = false
         this.cadFlag = true
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

