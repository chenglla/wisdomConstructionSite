<template>
  <div class="app-container">
    
    <el-row :gutter="20">
        
        <div style="margin-top:5px;margin-bottom:10px;">
          <!-- <span style="font-size: 14px;margin-right: 10px">检查内容</span><el-input v-model="queryParams.content" placeholder="请输入关键字" clearable size="small" style="width: 200px;margin-right: 10px"/> -->
          <span style="font-size: 14px;margin-right: 10px">检查时间</span>
          <el-date-picker
            style="width: 250px;margin-right: 10px"
            v-model="timeArry"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <!-- <span style="font-size: 14px;margin-right: 10px">类型</span><el-select v-model="queryParams.from" placeholder="请选择" clearable  style="width: 200px;margin-right: 10px">
              <el-option v-for="dict in progressList" :key="dict.value" :label="dict.label" :value="dict.label" ></el-option>
          </el-select> -->
         
         <span style="font-size: 14px;margin-right: 10px">检查结果</span> 
         <!-- <el-select v-model="queryParams.result" placeholder="请选择" clearable  style="width: 200px;margin-right: 10px">
              <el-option v-for="dict in stateList" :key="dict.value" :label="dict.label" :value="dict.label" ></el-option>
          </el-select> -->
           <el-input v-model="queryParams.result" placeholder="请输入关键字" clearable size="small" style="width: 200px;margin-right: 10px"/>
           <!-- <br /> -->
          <span style="font-size: 14px;margin-right: 10px">处理状态</span> <el-select v-model="queryParams.processResult" placeholder="请选择" clearable  style="width: 200px;margin-right: 10px">
              <el-option v-for="dict in state2List" :key="dict.value" :label="dict.label" :value="dict.label" ></el-option>
          </el-select>
          <span style="font-size: 14px;margin-right: 10px">节点名称</span>
          <el-select v-model="selectValue" placeholder="请选择" clearable size="small" ref="selectTree">
            <el-option style="height: auto;" :value="optionValue" :label="optionValue">
              <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree2" @node-click="handleNodeClick2" />
            </el-option>
          </el-select>

          <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </div>

         <el-row :gutter="10" class="mb8" style="margin-top:15px;clear:both;">
          <!-- <el-col :span="1.5">
            <el-button type="primary"  size="mini" @click="handleAdd" v-if="!isAdmin" v-hasPermi="['system:user:add']">新增自检记录</el-button>
          </el-col> -->
         
        </el-row>
       

        

        


        
        <el-table v-loading="loading"  :data="dataList.slice((queryParams.pageNum-1)*queryParams.pageSize,queryParams.pageNum*queryParams.pageSize)" @selection-change="handleSelectionChange">

          <el-table-column label="序号" type="index" align="center" prop="sort" />
          <el-table-column label="检查内容" align="center" prop="content" :show-overflow-tooltip="true" />
          <el-table-column label="检查人员" align="center" prop="person"  />
          <el-table-column label="检查时间" align="center" prop="checkTime" :show-overflow-tooltip="true" />
          <el-table-column label="来源" align="center" prop="from" :show-overflow-tooltip="true" />
          <el-table-column label="检查结果" align="center" prop="result" :show-overflow-tooltip="true" />
          <!-- <el-table-column label="检查结果" align="center" prop="result" :show-overflow-tooltip="true" >
            <template slot-scope="scope">
                <el-tag  v-if="scope.row.result===0" type="danger">整改</el-tag>
                <el-tag  v-if="scope.row.result===1" type="success">正常</el-tag>
            </template>
          </el-table-column> -->

          <el-table-column label="接收人" align="center" prop="receiver" :show-overflow-tooltip="true" />
          <el-table-column label="处理结果" align="center" prop="processResult" :show-overflow-tooltip="true" />
          <!-- <el-table-column label="处理结果" align="center" prop="processResult" :show-overflow-tooltip="true" >
            <template slot-scope="scope">
                <el-tag  v-if="scope.row.processResult===0" type="info">未处理</el-tag>
                <el-tag  v-if="scope.row.processResult===1" type="danger">处理中</el-tag>
                <el-tag  v-if="scope.row.processResult===2" type="success">已处理</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column label="处理时间" align="center" prop="processTime" :show-overflow-tooltip="true" />

          <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleUpdate(scope.row)" >详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getSelfList" />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <!-- <el-dialog title="详情" :visible.sync="open" width="1500px"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="160px" >
          <el-row>
              <el-col :span="12">
                  <el-form-item  label="检查内容" prop="content">
                      <el-input v-model="form.content" placeholder="请输入节点名称" :disabled="true"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="检查人员" prop="person">
                    <el-input v-model="form.person" placeholder="请输计划工期" :disabled="true"/>
                  </el-form-item>
              </el-col>
          </el-row>
           
          <el-row>
              <el-col :span="12">
                  <el-form-item  label="检查时间" prop="checkTime">
                      <el-input v-model="form.checkTime" placeholder="请输入节点名称" :disabled="true"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="检查结果" prop="result">
                    <el-input v-model="form.result" placeholder="请输计划工期" :disabled="true"/>
                  </el-form-item>
              </el-col>
          </el-row>

          <el-row>
              <el-col :span="12">
                  <el-form-item  label="来源" prop="from">
                      <el-input v-model="form.from" placeholder="请输入节点名称" :disabled="true"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="接收人" prop="receiver">
                    <el-input v-model="form.receiver" placeholder="请输计划工期" :disabled="true"/>
                  </el-form-item>
              </el-col>
          </el-row>

          <el-row>
              <el-col :span="12">
                  <el-form-item  label="处理结果" prop="processResult">
                      <el-input v-model="form.processResult" placeholder="请输入节点名称" :disabled="true"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="处理时间" prop="processTime">
                    <el-input v-model="form.processTime" placeholder="请输计划工期" :disabled="true"/>
                  </el-form-item>
              </el-col>
          </el-row>

      </el-form>
     
      <div slot="footer" class="dialog-footer">
        
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->


    <el-dialog :visible.sync="open" title="详细信息" width="60%">
      <div class="divDialog" style="height: 55vh; overflow-y: scroll;">

        <el-form :model="uploadInfo2"  ref="uploadInfo2" label-width="160px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="发起人:" prop="fromUser">
                 <el-input v-model="uploadInfo2.fromUser"  :readonly='true'/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接收人:" prop="toUser">
                 <el-input v-model="uploadInfo2.toUser"  :readonly='true'/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="抄送人:" prop="ccPeople">
                 <el-input v-model="uploadInfo2.ccPeople"  :readonly='true'/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事件类型:" prop="checkType">
                 <el-input v-model="uploadInfo2.checkType"  :readonly='true'/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="详细类型:" prop="checkTypeOffspring">
                 <el-input v-model="uploadInfo2.checkTypeOffspring"  :readonly='true'/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="记录时间:" prop="startTime">
                 <el-input v-model="uploadInfo2.startTime"  :readonly='true'/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="一级进度:" prop="planName">
                 <el-input v-model="uploadInfo2.planName"  :readonly='true'/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="二级进度:" prop="sectionName">
                 <el-input v-model="uploadInfo2.sectionName"  :readonly='true'/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="事件详情:" prop="context">
                 <el-input type="textarea" v-model="uploadInfo2.context"  :readonly='true'/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="发起问题照片:" prop="imageUrl">
                 

              <el-image
                  v-if="uploadInfo2.imageUrl !== null"
                :src="uploadInfo2.imageUrl"
                >
                
              </el-image>
              <span v-else>暂无图片</span>
              </el-form-item>
            </el-col>
            
          </el-row>

           <el-row>
            <el-col :span="24">
              <el-form-item label="发起问题视频:" prop="videoUrl">
                

                 <video  v-if="uploadInfo2.videoUrl !== null" :src="uploadInfo2.videoUrl" controls></video>
                 <span v-else>暂无视频</span>
              </el-form-item>
            </el-col>
            
          </el-row>

          <el-divider></el-divider>

          <el-row>
            <el-col :span="12">
              <el-form-item label="处理时间:" prop="endTime">
                 <el-input v-model="dealDatail.endTime"  :readonly='true'/>
              </el-form-item>
            </el-col>
           
          </el-row>

           <el-row>
            
            <el-col :span="24">
              <el-form-item label="处理结果:" prop="tiltPercentageOne">
                 <el-input type="textarea" v-model="dealDatail.context"  :readonly='true'/>
              </el-form-item>
            </el-col>
          </el-row>
         

          <el-row>
            <el-col :span="24">
              <el-form-item label="处理结果照片:" prop="safetyAndQualityProcessList">
                

              <el-image
                 v-if="dealDatail.imageUrl !== null"
                :src="dealDatail.imageUrl"
                >
              </el-image>
              <span v-else>暂无图片</span>
              </el-form-item>
            </el-col>
           
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="处理结果视频:" prop="safetyAndQualityProcessList">
                 <video  v-if="dealDatail.videoUrl !== null" :src="dealDatail.videoUrl" controls></video>
                 <span v-else>暂无视频</span>
              </el-image>
              </el-form-item>
            </el-col>
           
          </el-row>

         

         

        </el-form>
      </div>
    </el-dialog>

  

   
  </div>
</template>

<script>


import { getList, nodeList, nodeTemplate, getTeamTree, broadsideInfo, getPicInfo } from "@/api/system/selfCheck";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import { getLeftColumn } from "@/api/system/dept";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapState } from 'vuex'
import { unionTypeAnnotation } from '@babel/types';

export default {
  name: "selfCheck",
  props: {
        selectNode: {
            type: Object,
            default () {
                return {}
            }
        }
    },
  components: { Treeselect },
  computed: {
    ...mapState({ 
      nodeState: state => state.nodeState,
      nodeStateId: state => state.nodeStateId
    }),
  },

    
  data() {
    return {
      selectValue: undefined,
      optionValue: undefined,
      dealDatail : {
        context: '',
        endTime: '',
        imageUrl: null,
        videoUrl: null
      },
      uploadInfo2: {
        ccPeople: '',
        checkType: '',
        checkTypeOffspring: '',
        context: '',
        flag: '',
        fromUser: '',
        handingTime:'',
        imageUrl: '',
        toUser: '',
        processStatus: '',
        planName: '',
        sectionName: ''
      },
        
        nodeForm: {
          id: '',
          label: '',
          parentId: null,
          sort: '',
          taskId: '',
          teamId: null,
          leadingCadre: '',
          phone: '',
        },
        treeData4: [],
        treeData2: [],
        projectTotal: 4,
        projectPlanDays: 194,
        doingDays: 110,
        progressList:[
          {
            value: 0,
            label: '随手拍'
          },
          {
            value: 1,
            label: '视频监控'
          }
        ],
        stateList: [
          {
            value: 0,
            label: '整改'
          },
          {
            value: 1,
            label: '正常'
          }
        ],
        state2List: [
         {
            value: 1,
            label: '未处理'
          },
          {
            value: 2,
            label: '正在处理'
          },
          {
             value: 3,
            label: '已处理'
          },
          {
             value: 4,
            label: '预警'
          }
        ],
        nodePlan: false,
        tableData: [
               {
                 nodeIndex:1,
                 nodeName: '参考一',
                 children: [
                   {
                    id: 1,
                    name: '地基与基础',
                    children: [
                      { id: 1.1, name: '基层与保护' },
                      { id: 1.2, name: '保温与隔热' }
                    ]
                  },
                  {
                    id: 2,
                    name: '主体结构',
                    children: [
                      { id: 2.1, name: '基层与保护' },
                      { id: 2.2, name: '保温与隔热' }
                    ]
                  },
                  {
                    id: 3,
                    name: '地基与基础',
                    children: [
                      { id: 3.1, name: '基层与保护' },
                      { id: 3.2, name: '保温与隔热' }
                    ]
                  },
                  {
                    id: 1005,
                    name: '地基与基础',
                    children: [
                      { id: 24300, name: '基层与保护' },
                      { id: 24301, name: '保温与隔热' }
                    ]
                  }
                 ]
               }
               
                
              ],






      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      dataList: [],
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: [],
      currentDeptName: '',
      // 设备树选项
      
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      deviceModelOptions:[{
        dictValue: 0,
        dictLabel: '起重机'
      },{
        dictValue: 1,
        dictLabel: '塔吊'
      },{
        dictValue: 2,
        dictLabel: '升降机'
      },{
        dictValue: 3,
        dictLabel: '物料提升机'
      },{
        dictValue: 4,
        dictLabel: '摄像头'
      },{
        dictValue: 5,
        dictLabel: '人脸识别设备'
      },{
        dictValue: 6,
        dictLabel: '水质检测设备'
      },{
        dictValue: 7,
        dictLabel: '大气采样设备'
      }],
      constructionUnitList:["建设方", "监理方", "施工方"],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {
          id: '',
          content: '',
          checkTime: '',
          endTime: '',
          from: '',
          person: '',
          processResult: '',
          processTime: '',
          receiver: '',
          recordId: '',
          result: '',
          startTime: '',
          taskId: ''

      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      timeArry: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        content: '',
        
        from: '',
        result: '',
        processResult: '',
        taskId: '',
        startTime: '',
        endTime: '',
        nodeId: ''

      },
      // 表单校验
      rules: {
        leadingCadre: [
          { required: true, message: "负责人不能为空", trigger: "blur" },
        ],
        label: [
          { required: true, message: "节点名称不能为空", trigger: "blur" },
        ]
      },
    };
  },
  watch: {
    // 根据名称筛选部门树
    
    "$store.state.task.nodeStateId"(old, newd) {
      console.log("旧的", old)
      console.log("新的", newd)
      this.getSelfList()
    }
  },
  mounted() {
       
  },
  created() {

    this.getSelfList();
    this.getBroadsideInfo()

  },
  methods: {
    getBroadsideInfo() {
      
      var id = this.$store.state.task.nodeStateId
      broadsideInfo(id).then((res) => {
        console.log("自检记录", res.data)
        this.deptOptions = res.data
      })
    },
    handleNodeClick2(data, node, nodeData){
      console.log("打印data", data)
      console.log("打印node", node)
      console.log("打印nodeData", nodeData)
      this.selectValue = data
      this.optionValue = data.label
        setTimeout(() => {
            this.$refs.selectTree.blur()
        }, 50)
    },
    
    getBanZu() {
      var id = localStorage.getItem('deptId')
      getTeamTree(id).then((res) => {
        this.treeData2 = res.data.data
      })
    },
    getSelectList2(node, instanceId) {
      // console.log("node", node)
      // console.log("instanceId", instanceId)
      this.nodeForm.userClass = node.label
      this.nodeForm.teamId = node.id
    },
    getSelectList3(node, instanceId) {
      console.log("FolderNode", node)
      this.nodeForm.parentId = node.id
    },
    activeMethod(row, rowIndex, column, columnIndex) {
      console.log("row", row)
      console.log("rowIndex", rowIndex)
      console.log("column", column)
      console.log("columnIndex", columnIndex)
    },
    
    selectChangeEvent ({ records }) {
      console.info(`勾选${records.length}个树形节点`, records)
    },
    getSelfList() {
      var params = {
        // taskId: this.selectNode.id
        taskId: this.$store.state.task.nodeStateId
      }
      this.loading = true;
      getList(params).then((res) => {
        this.dataList = res.rows
        this.total = res.total;
        this.loading = false;
      })
    },
    downloadFile() {},
    importNode() {},
    exportExcel() {},
    getNodeTemplate() {
      // var id = 
    },
    
   
   
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data, node, e) {
      console.log("data",data)
      console.log(node)
      console.log(e)
      this.currentDeptName = data.name
      
      if(data.flag === null) {
        var params = {
          constructionSiteId: data.deptId,
        }
      } else if(data.flag === 1){
        var params = {
          constructionSiteId: data.deptId,
          devType: data.name

        }
      } else {
        var params = {
          constructionSiteId: data.deptId,
          type: data.name

        }
      }
      this.loading = true;
      listDevice(params).then(response => {
        // this.dataList = response.rows;
        // this.total = response.total;
        // this.loading = false;
      });

    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '' + '"该设备吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          console.log("123")
          var tmp = ''
          if(row.status === '0') {
            tmp = '1'
          } else {
            tmp = '0'
          }
          var form = {
            id: row.id,
            status: tmp
          }

          updateDevice(form);
        })
        .catch(function () {
          console.log("456")
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        devFactory: undefined,
        devType: undefined,
        devModel: undefined,
        content: undefined,
        status: undefined

      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {

      // this.queryParams.page = 1;
      //this.loading = true;
      // console.log("时间判断", this.timeArry)
      // this.queryParams.nodeId = this.selectValue.id
      if(this.selectValue !== undefined) {
        this.queryParams.nodeId = this.selectValue.id
      }
      this.queryParams.taskId = this.$store.state.task.nodeStateId
      this.queryParams.startTime = this.timeArry[0]
      this.queryParams.endTime = this.timeArry[1]
      getList(this.queryParams).then(response => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });

    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.dateRange = [];
      // this.resetForm("queryForm");
      this.queryParams.content = ''
      this.queryParams.result = ''
      this.queryParams.processResult = ''
      this.queryParams.from = ''
      this.queryParams.taskId = ''
      this.timeArry = []
      this.queryParams.startTime = ''
      this.queryParams.endTime = ''
      this.queryParams.nodeId = ''
      this.selectValue = undefined
      this.optionValue = undefined
      this.getSelfList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
        

    },
    addNodePlan() {
      this.nodePlan = true;
      this.title = "新增节点计划";
      console.log(this.form)
      this.getBanZu()
      
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row)
      this.open = true
      this.getSuiShouPaiInfoById(row.id)
    },

    getSuiShouPaiInfoById(id) {
      getPicInfo(id).then((res) => {
        console.log("随手拍的数据", res)
        var resData = res.data
        if(resData.safetyAndQualityProcessList.length !== 0) {
        this.dealDatail = resData.safetyAndQualityProcessList[0]
      }
      this.uploadInfo2 = resData
      })
    },
    /** 重置密码按钮操作 */

    /** 提交按钮 */
    submitForm: function () {

      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateDevice(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.reset()
                this.getSelfList();
              }
            });
          } else {
            addDevice(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.reset()
                this.getSelfList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.id ;
      this.$confirm(
        '是否确认删除该数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
            // for(let i = 0; i < this.dataList.length; i++) {
            //     let obj = this.dataList[i]
            //     if(obj.userId === userIds) {
            //         this.dataList.splice(i, 1)
            //     }
            // }
          return delDevice(userIds);
        })
        .then(() => {
          this.getSelfList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {

          return exportDevice(queryParams);
        })
        .then((response) => {


          window.location.href = response.msg
        })
        .catch(function () {
          console.log("789")
        });
    },
    /**  下载按钮操作 */
    handledown() {
      console.log("Aaaaa")
      var queryParams = this.queryParams;
      console.log("aaa", queryParams)

      this.$confirm("是否下载数据对接模板?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportDevice(queryParams);
        })
        .then((response) => {
          window.location.href = response.msg
        })
        .catch(function () {});
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getSelfList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
};
</script>

<style scoped>
.dm-aside {
  background-color: rgba(0, 36, 78, 0.5);
  height: 80vh;
  margin: 0 5px;
  border-radius: 2px;
}
.header_tree {
  overflow:auto;
  height: 400px;
  
}
</style>

