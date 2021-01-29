<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <div v-if="leafNode === false ">  
          <task :selectNode="propData" v-if="propData"   @updateTree="updateTree"></task>
        </div>
        <div v-else>
          <node :selectNode="propData" v-if="propData" @updateTree="updateTree"></node>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>


import { getLeftTree } from "@/api/system/process";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters, mapState } from "vuex";
import Task from './task';
import Node from './tabs';
import { setTimeout } from 'timers';

export default {
  name: "Porcess",
  components: { Task, Node },
  computed: {
  ...mapState({
    selectNode: state => state.selectNode
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
    
  },
  mounted() {
    
  },
  created() {
    
    
    this.getTree();
    
  },
  methods: {
    
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
      console.log("立即获取", this.$store.state.task.nodeStateId)
      
      
      if(data.children === null) {
        this.leafNode = true
      } else {
        this.leafNode = false
      }
     
      

    },
  
  
  },
};
</script>
