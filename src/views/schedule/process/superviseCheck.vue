<template>
  <div class="app-container">
    
    <el-row :gutter="20">
        
        <div style="margin-top:5px;margin-bottom:10px;">
          <span style="font-size: 14px;margin-right: 10px">检查内容</span><el-input v-model="queryParams.content" placeholder="请输入关键字" clearable size="small" style="width: 200px;margin-right: 10px"/>
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
         
         <span style="font-size: 14px;margin-right: 10px">检查结果</span> <el-select v-model="queryParams.result" placeholder="请选择" clearable  style="width: 200px;margin-right: 10px">
              <el-option v-for="dict in stateList" :key="dict.value" :label="dict.label" :value="dict.label" ></el-option>
          </el-select>
           <br />
          <span style="font-size: 14px;margin-right: 10px">回复结果</span> <el-select v-model="queryParams.reply" placeholder="请选择" clearable  style="width: 200px;margin-right: 10px">
              <el-option v-for="dict in state2List" :key="dict.value" :label="dict.label" :value="dict.label" ></el-option>
          </el-select>
          <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </div>
       

         <el-row :gutter="10" class="mb8" style="margin-top:15px;clear:both;">
          <el-col :span="1.5">
            <el-button type="primary"  size="mini" @click="handleAdd" v-if="!isAdmin" v-hasPermi="['system:user:add']">新增监督检查记录</el-button>
          </el-col>
         
        </el-row>

        


        
        <el-table v-loading="loading"  :data="dataList.slice((queryParams.pageNum-1)*queryParams.pageSize,queryParams.pageNum*queryParams.pageSize)" @selection-change="handleSelectionChange">

          <el-table-column label="序号" type="index" align="center" prop="sort" />
           <el-table-column label="检查机构" align="center" prop="organization" :show-overflow-tooltip="true" />
          <el-table-column label="检查内容" align="center" prop="content" :show-overflow-tooltip="true" />
          <el-table-column label="类型" align="center" prop="type"  />
          <el-table-column label="检查时间" align="center" prop="checkTime" :show-overflow-tooltip="true" />
          <el-table-column label="检查结果" align="center" prop="result" :show-overflow-tooltip="true" />
          <el-table-column label="回复情况" align="center" prop="reply" :show-overflow-tooltip="true" />
          <el-table-column label="回复时间" align="center" prop="replyTime" :show-overflow-tooltip="true" />

          <!-- <el-table-column label="检查结果" align="center" prop="result" :show-overflow-tooltip="true" >
            <template slot-scope="scope">
                <el-tag  v-if="scope.row.result===0" type="danger">整改</el-tag>
                <el-tag  v-if="scope.row.result===1" type="success">正常</el-tag>
            </template>
          </el-table-column> -->

          
          <!-- <el-table-column label="处理结果" align="center" prop="processResult" :show-overflow-tooltip="true" >
            <template slot-scope="scope">
                <el-tag  v-if="scope.row.processResult===0" type="info">未处理</el-tag>
                <el-tag  v-if="scope.row.processResult===1" type="danger">处理中</el-tag>
                <el-tag  v-if="scope.row.processResult===2" type="success">已处理</el-tag>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="处理时间" align="center" prop="processTime" :show-overflow-tooltip="true" /> -->

          <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleEdit(scope.row)" >修改</el-button>
                <el-button size="mini" type="text" @click="handleUpdate(scope.row)" >详情</el-button>
                <el-button size="mini" type="text" @click="handleDel(scope.row)" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" /> -->
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="详情" :visible.sync="open" width="1500px"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="160px" >
          <el-row>
              <el-col :span="12">
                  <el-form-item  label="检查内容" prop="content">
                      <el-input v-model="form.content" placeholder="请输入节点名称" :disabled="true"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="检查机构" prop="organization">
                    <el-input v-model="form.organization" placeholder="请输计划工期" :disabled="true"/>
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
                  <el-form-item  label="类型" prop="type">
                      <el-input v-model="form.type" placeholder="请输入节点名称" :disabled="true"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="回复情况" prop="reply">
                    <el-input v-model="form.reply" placeholder="请输计划工期" :disabled="true"/>
                  </el-form-item>
              </el-col>
          </el-row>

          <el-row>
              <el-col :span="12">
                  <el-form-item  label="回复时间" prop="replyTime">
                      <el-input v-model="form.replyTime" placeholder="请输入节点名称" :disabled="true"/>
                  </el-form-item>
              </el-col>
              
          </el-row>

      </el-form>
     
      <div slot="footer" class="dialog-footer">
        
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


     <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="新增监督检查" :visible.sync="checkOpen" width="1000px"  append-to-body>
      <el-form ref="checkForm" :model="checkForm" :rules="checkFormRules" label-width="160px" >
          <el-row>
              <el-col :span="12">
                  <el-form-item  label="检查内容" prop="content">
                      <el-input v-model="checkForm.content" placeholder="请输入检查内容" style="width:250px;"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="检查机构" prop="organization">
                    <el-input v-model="checkForm.organization" placeholder="请输入检查机构" style="width:250px;"/>
                  </el-form-item>
              </el-col>
          </el-row>
           
          <el-row>
              <el-col :span="12">
                  <el-form-item  label="检查时间" prop="checkTime">
                    <el-date-picker v-model="checkForm.checkTime" align="right" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"  style="width:250px;"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="检查结果" prop="result">
                    
                    <el-select v-model="checkForm.result" placeholder="请选择检查结果" style="width:250px;">
                      <el-option label="正常" value="正常" />
                      <el-option label="整改" value="整改" />
                      <el-option label="停工整改" value="停工整改" />
                    </el-select>
                  </el-form-item>
              </el-col>
          </el-row>

          <el-row>
              <el-col :span="12">
                  <el-form-item  label="类型" prop="type">
                      <el-input v-model="checkForm.type" placeholder="请输入类型" style="width:250px;" />
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="回复情况" prop="reply">
                    <el-select v-model="checkForm.reply" placeholder="请选择回复情况" style="width:250px;">
                      <el-option label="已回复" value="已回复" />
                      <el-option label="未回复" value="未回复" />
                    </el-select>
                  </el-form-item>
              </el-col>
          </el-row>

          <el-row>
              <el-col :span="12">
                  <el-form-item  label="回复时间" prop="replyTime">
                    <el-date-picker v-model="checkForm.replyTime" align="right" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd" style="width:250px;" />
                  </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                  <el-form-item  label="回复内容" prop="replyTime">
                    <el-input v-model="form.type" placeholder="请输入类型" :disabled="true"/>
                  </el-form-item>
              </el-col> -->
              
          </el-row>

      </el-form>
     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button type="primary" @click="cancelCheck">取 消</el-button>
      </div>
    </el-dialog>

  

   
  </div>
</template>

<script>


import { getList, nodeList, nodeTemplate, getTeamTree, broadsideInfo,  addSuperviseCheck, updateSuperviseCheck, delSuperviseCheck } from "@/api/system/superviseCheck";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import { getLeftColumn } from "@/api/system/dept";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapState } from 'vuex'
import { unionTypeAnnotation } from '@babel/types';

export default {
  name: "superviseCheck",
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
      isAdmin: false,
      checkForm: {
        checkTime: '',
        content: '',
        endTime: '',
        id: '',
        organization: '',
        reply: '',
        replyTime: '',
        result: '',
        startTime: '',
        taskId: '',
        type: ''
      },
      checkOpen: false,
        
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
          },
          {
            value: 2,
            label: '停工整改'
          },
        ],
        state2List: [
          {
            value: 0,
            label: '未回复'
          },
          {
             value: 1,
            label: '已回复'
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
      deviceOptions: [{
        id: 100,
        label: "企业总览",
        children: [{
          id: 200,
          label: "河北创巨圆科技发展有限公司",
          children: [{
            id: 101,
            label: "特种设备",
            children: [{
              id: 102,
              label: "起重机"
            }, {
              id: 103,
              label: "塔吊"
            }, {
              id: 104,
              label: "升降机"
            }, {
              id: 105,
              label: "物料提升机"
            }]
          }, {
            id: 201,
            label: "视频设备",
            children: [{
              id: 202,
              label: "摄像头"
            }, {
              id: 203,
              label: "人脸识别设备"
            }]
          }, {
            id: 301,
            label: "环境检测设备",
            children: [{
              id: 302,
              label: "水质检测设备"
            }, {
              id: 303,
              label: "大气采样设备"
            }]
          }]
        }]
      }],
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
          taskId: '',
          reply: '',
          replyTime: ''

      },
      defaultProps: {
        children: "childs",
        label: "name",
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
        reply: '',
        taskId: '',
        startTime: '',
        endTime: '',
        replyTime: ''

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
       checkFormRules: {
        organization: [
          { required: true, message: "检查机构不能为空", trigger: "blur" },
        ],
        content: [
          { required: true, message: "检查内容不能为空", trigger: "blur" },
        ]
      }
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
       if(localStorage.getItem('userName') === 'admin-1') {
          
          this.isAdmin = true
        } else {
          this.isAdmin = false
        }
  },
  created() {

    this.getSelfList();

  },
  methods: {
    handleDel(row) {
      // console.log("删除", row)
      delSuperviseCheck(row.id).then((res) => {
        console.log("123", res)
        if(res.code === 200) {
           this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.getSelfList();
        } else {
          this.$message({
              type: 'error',
              message: '删除失败！'
            })
        }
      })
    },
    handleEdit(row) {
      this.checkOpen = true
      this.checkForm = row
    },
     handleAdd() {
       console.log("123")
        this.checkOpen = true
    },
    cancelCheck() {
      this.checkOpen = false;
      this.reset();
    },
    getBroadsideInfo() {
      var id = localStorage.getItem('deptId')
      var id = 10
      broadsideInfo(id).then((res) => {
        this.deptOptions = res.data.data
      })
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
     this.checkForm = {
        checkTime: '',
        content: '',
        endTime: '',
        id: '',
        organization: '',
        reply: '',
        replyTime: '',
        result: '',
        startTime: '',
        taskId: '',
        type: ''
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {

      // this.queryParams.page = 1;
      //this.loading = true;
      // console.log("时间判断", this.timeArry)
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
      this.queryParams.reply = ''
      this.queryParams.from = ''
      this.queryParams.taskId = ''
      this.timeArry = []
      this.queryParams.startTime = ''
      this.queryParams.endTime = ''
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    
    addNodePlan() {
      this.nodePlan = true;
      this.title = "新增节点计划";
      console.log(this.form)
      this.getBanZu()
      this.getBroadsideInfo()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row)
      this.open = true
      this.form = row
    },
    /** 重置密码按钮操作 */

    /** 提交按钮 */
    submitForm: function () {

      this.$refs["checkForm"].validate((valid) => {
        if (valid) {
          this.checkForm.taskId = this.$store.state.task.nodeStateId
          
          if(this.checkForm.id === '') {
            addSuperviseCheck(this.checkForm).then((response) => {
              console.log("resp", response)
              if (response.code === 200) {
                 this.$message({
                  type: 'success',
                  message: '新增成功！'
                })
                this.checkOpen = false;
                this.reset()
                this.getSelfList();
              }
            });
          } else {
            updateSuperviseCheck(this.checkForm).then((response) => {
              console.log("resp", response)
              if (response.code === 200) {
                 this.$message({
                  type: 'success',
                  message: '更新成功！'
                })
                this.checkOpen = false;
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
          this.getList();
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
      this.getList();
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

