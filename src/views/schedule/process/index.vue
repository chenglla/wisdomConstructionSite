<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container header_tree">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <div v-if="leafNode === false ">  
          <task :selectNode="propData"    @updateTree="updateTree" ></task>
        </div>
        <div v-else>
          <node :selectNode="propData"  @updateTree="updateTree"></node>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>


import { getLeftTree } from "@/api/system/process";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters, mapState } from "vuex";
import { getUserProfile } from "@/api/system/user";
import Task from './task';
import Node from './tabs';
import { setTimeout } from 'timers';

export default {
  name: "Porcess",
  components: { Task, Node },
  computed: {
    ...mapState({ 
      isLeaf: state => state.isLeaf,
      nodeState: state => state.nodeState,
      nodeStateId: state => state.nodeStateId
    }),
  },
  data() {
    return {
      propData: {},
      propData1: {},
      leafNode: false,
      deptOptions: [],
      currentDeptName: '',
      defaultProps: {
        children: "children",
        label: "label",

      },
    };
  },
  watch: {
    
  //  "$store.state.task.isLeaf"(old, newd) {
  //     console.log("旧的", old)
  //     console.log("新的", newd)
      
  //   },
    "$store.state.task.nodeStateId"(old, newd) {
      console.log("旧的", old)
      console.log("新的", newd)
      console.log("当前页面是否是叶子节点", this.$store.state.task.isLeaf)
      this.leafNode = this.$store.state.task.isLeaf
    }
    
  },
  mounted() {
    this.getUser()
  },
  created() {
    
    
    this.getTree();
    
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        localStorage.setItem('userName', response.data.userName)
      });
    },
    
    getTree() {
      var id = localStorage.getItem("deptId")
      getLeftTree(id).then((res) => {
        // console.log("传输节点", res.data)
        this.deptOptions = res.data
        this.propData = res.data[0]
        // console.log("初始的propData", this.propData)
      })
    },
    updateTree(val) {
      if(val === 'updateTree') {
        this.getTree()
      }
    },

    

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
   
    // 节点单击事件
    handleNodeClick(data, node, e) {
      
      console.log("进度Index",data)
      
      this.currentDeptName = data.name
      this.propData = data
      

      this.$store.commit('task/CHANGE_NODE', data)  
      this.$store.commit('task/CHANGE_NODE_ID', data.id) 
      this.$store.commit('task/CHANGE_OTHERID', data.otherId) 
      console.log("立即获取", this.$store.state.task.nodeStateId)
      
      
      if(data.display === 1) {
        this.$store.commit('task/CHANGE_ISLEAF', true) 
        this.leafNode = true
       
      } else {
        this.$store.commit('task/CHANGE_ISLEAF', false) 
        this.leafNode = false
      }
     
      

    },
  
  
  },
};
</script>

<style lang="css" scoped>
.header_tree {
  overflow:auto;
  /* max-height: 600px; */
}
.header_tree .el-tree {
  min-width: 100%;
  display: inline-block;
}
</style>
