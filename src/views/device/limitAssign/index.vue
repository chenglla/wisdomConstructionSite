<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <!-- <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入项目名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="deviceOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col> -->
      <!--用户数据-->
      <div v-show="showSearch" style="padding: 10px">
        <span style="font-size: 14px;color: #606266;font-weight: 700;margin-right: 10px">项目序号</span><el-input v-model="queryParams.constructionSiteId" placeholder="请输入项目序号" clearable size="small" style="width: 240px;margin-right: 10px" @keyup.enter.native="handleQuery" />
        <span style="font-size: 14px;color: #606266;font-weight: 700;margin-right: 10px">项目名称</span><el-input v-model="queryParams.constructionSiteName" placeholder="请输入项目名称" clearable size="small" style="width: 240px;margin-right: 10px" @keyup.enter.native="handleQuery" />
        <span style="font-size: 14px;color: #606266;font-weight: 700;margin-right: 10px">是否停用</span>
        <el-select v-model="queryParams.status" placeholder="是否停用" clearable size="small" style="width: 240px;margin-right: 10px">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
        </el-select>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </div>

      <el-col :span="24" :xs="24">
        <!--<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">-->
          <!--<el-form-item label="项目序号" prop="constructionSiteId">-->
            <!--<el-input v-model="queryParams.constructionSiteId" placeholder="请输入项目序号" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />-->
          <!--</el-form-item>-->
          <!--<el-form-item label="项目名称" prop="constructionSiteName">-->
            <!--<el-input v-model="queryParams.constructionSiteName" placeholder="请输入项目名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />-->
          <!--</el-form-item>-->
          <!--<el-form-item label="是否停用" prop="status">-->
              <!--<el-select v-model="queryParams.status" placeholder="是否停用" clearable size="small" style="width: 240px">-->
                <!--<el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />-->
              <!--</el-select>-->
          <!--</el-form-item>-->
          <!--&lt;!&ndash; <el-form-item label="时间">-->
            <!--<el-date-picker v-model="queryParams.time" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="date" placeholder="请选择日期" ></el-date-picker>-->
          <!--</el-form-item> &ndash;&gt;-->
          <!--<el-form-item>-->
            <!--<el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
            <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
          <!--</el-form-item>-->
        <!--</el-form>-->

        <el-row :gutter="10" class="mb8">
<!--          <el-col :span="1.5">-->
<!--            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:user:add']">新增</el-button>-->
<!--          </el-col>-->
<!--          <el-col :span="1.5">-->
<!--            <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:user:edit']">修改</el-button>-->
<!--          </el-col>-->
<!--          <el-col :span="1.5">-->
<!--            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:user:remove']">删除</el-button>-->
<!--          </el-col>-->
<!--          <el-col :span="1.5">-->
<!--            <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['system:user:import']">导入</el-button>-->
<!--          </el-col>-->
          <el-col :span="1.5">
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="dataList.slice((queryParams.pageNum-1)*queryParams.pageSize,queryParams.pageNum*queryParams.pageSize)" @selection-change="handleSelectionChange">

           <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="项目序号" align="center" prop="constructionSiteId" />
          <el-table-column label="项目名称" align="center" prop="constructionSiteName" :show-overflow-tooltip="true" />
          <el-table-column label="负责人" align="center" prop="personInCharge" :show-overflow-tooltip="true" />
          <el-table-column label="联系方式" align="center" prop="phone" />
          <el-table-column label="是否启用" align="center" prop="status" >
           <template slot-scope="scope">
              <el-tag  v-if="scope.row.status===0" type="danger">未启用</el-tag>
              <el-tag  v-if="scope.row.status===1" type="success">启用</el-tag>

            </template>
          </el-table-column>
          <el-table-column label="时间" align="center" prop="time" width="160">

          </el-table-column>


          <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
<!--              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']">分配口令</el-button>-->
              <el-button  size="mini" type="text" icon="el-icon-info" v-clipboard:copy="scope.row.token" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']">复制口令</el-button>
              <!-- <el-button size="mini" type="text" icon="el-icon-key" @click="handleResetPwd(scope.row)" v-hasPermi="['system:user:resetPwd']">重置</el-button> -->
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>

          <el-col :span="12">
            <el-form-item label="设备备案编号" prop="equipmentID">
              <el-input v-model="form.equipmentID" placeholder="设备备案编号"  />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="equipmentName">
              <el-input v-model="form.equipmentName" placeholder="设备名称"  />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            <el-form-item label="负责人" prop="personInCharge">
              <el-input v-model="form.personInCharge" placeholder="请输入负责人名称" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="出厂时间" prop="proTime">
              <el-input v-model="form.proTime" placeholder="请输入出厂时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="12">
            <el-form-item label="分配口令" prop="kouling">
              <el-input v-model="form.kouling" disabled />
              <el-tag type="danger" @click.native="generatorKouLing" style="cursor:pointer;">点击生成口令</el-tag>
            </el-form-item>
          </el-col>


        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listToken, getToken, delToken, addToken, updateToken, exportToken } from "@/api/system/token";
// import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { setTimeout } from 'timers';

export default {
  name: "limitAssign",
  components: { Treeselect },
  data() {
    return {
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
      dataList: [{
            equipmentID: '2357857',
            equipmentName: '塔吊1型号',
            people: '张强',
            tel:1345678321,
            transfer: '模板一',
            proTime: '2016-05-23 19:30:23',
            status: "0"
          },{
            equipmentID: '3579078',
            equipmentName: '塔吊2型号',
            people: '李四',
            tel:1308312321,
            transfer: '模板二',
            proTime: '2016-06-23 20:30:43',
            status: "0"
          },{
            equipmentID: '4564549',
            equipmentName: '塔吊3型号',
            people: '李四',
            tel:1386313321,
            transfer: '模板三',
            proTime: '2016-06-23 20:30:43',
            status: "0"
          },{
            equipmentID: '1238089',
            equipmentName: '起重机1型号',
            people: '张叁',
            tel:1397625121,
            transfer: '模板四',
            proTime: '2015-11-03 07:33:43',
            status: "0"
          },{
            equipmentID: '4322321',
            equipmentName: '起重机2型号',
            people: '王芳',
            tel:1345853141,
            transfer: '模板五',
            proTime: '2015-02-12 09:05:56',
            status: "0"
          },{
            equipmentID: '8907554',
            equipmentName: '起重机3型号',
            people: '张爽',
            tel:1345602141,
            transfer: '模板六',
            proTime: '2014-06-13 12:23:23',
            status: "0"
          },{
            equipmentID: '6748543',
            equipmentName: '升降机1型号',
            people: '刘东',
            tel:1301278321,
            transfer: '模板七',
            proTime: '2016-12-12 12:12:23',
            status: 1
          },{
            equipmentID: '7893215',
            equipmentName: '升降机2型号',
            people: '王大强',
            tel:1309873321,
            transfer: '模板八',
            proTime: '2012-10-13 14:34:54',
            status: "0"
          },{
            equipmentID: '9086757',
            equipmentName: '升降机3型号',
            people: '张伟',
            tel:1345765421,
            transfer: '模板九',
            proTime: '2012-10-13 14:34:54',
            status: "0"
          }],

      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 设备树选项
      deviceOptions: [{
          id: 100,
          label: "项目总览",
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
      statusOptions: [
       {
          dictValue: 0,
          dictLabel: '未启用'
        },
        {
          dictValue: 1,
          dictLabel: '启用'
        }
      ],
      templateOptions:[
          {
            dictValue: 0,
            dictLabel: '模版一'
          },{
              dictValue: 1,
              dictLabel: '模版二'
          },{
              dictValue: 2,
              dictLabel: '模版三'
          },{
              dictValue: 3,
              dictLabel: '模版四'
          }
      ],
      deviceStatusOptions:[
          {
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
          }
      ],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {
        kouling: '123',
        equipmentID: undefined,
        equipmentName: undefined,
        people: undefined,
        proTime: undefined
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

        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "归属部门不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phonenumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    //this.getTreeselect();
    // this.getDicts("sys_normal_disable").then((response) => {
    //   this.statusOptions = response.data;
    // });
    // this.getDicts("sys_user_sex").then((response) => {
    //   this.sexOptions = response.data;
    // });
    // this.getConfigKey("sys.user.initPassword").then((response) => {
    //   this.initPassword = response.msg;
    // });
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;

      listToken().then(
        (response) => {
          this.dataList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
        console.log(response.data)
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
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

          updateToken(form);
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
        userId: undefined,

        userName: undefined,
        nickName: undefined,

        phonenumber: undefined,
        email: undefined,
        kouling: undefined,
        status: "0",
        deviceType: undefined,

        height: undefined,
        slope: undefined,
        rotaRate: undefined,
        maxWeight: undefined,
        speed: undefined,
        knm: undefined,
        wind: undefined,
        weight: undefined,
        range: undefined




      };
      this.resetForm("form");
    },

    changeStatus(row) {
      //console.log("row", row)
      if(row.status === 0) {
        return '停用'
      } else {
        return '启用'
      }
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;

      this.loading = true;
      listToken(this.queryParams).then(response => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.time = '';
      this.queryParams.constructionSiteId = ''
      this.queryParams.constructionSiteName = ''
      this.queryParams.status = ''
      // this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    selectTemplate(event) {
        console.log("aaaaaa",event)
        console.log(event === 0)
        if(event === 0) {
            this.form.deviceName = "山西百脉建筑机械有限公司"
            this.form.deviceType = "塔吊"
            this.form.deviceModel = "TC6024"
        } else if(event===1) {
            this.form.deviceName = "中联重科股份有限公司"
            this.form.deviceType = "起重机"
            this.form.deviceModel = "TC7036"
        } else if(event===2) {
            this.form.deviceName = "利勃海尔机械服务(上海)有限公司"
            this.form.deviceType = "升降机"
            this.form.deviceModel = "TC5516"
        } else {
            this.form.deviceName = "科尼起重机设备(上海)有限公司"
            this.form.deviceType = "水质检测设备"
            this.form.deviceModel = "TC5513"
        }

    },
    /** 新增按钮操作 */
    handleAdd() {
        this.open = true;
        this.title = "添加模板";
        console.log(this.form)
    //   this.reset();
    //   this.getTreeselect();
    //   getUser().then((response) => {
    //     this.postOptions = response.posts;
    //     this.roleOptions = response.roles;
    //     this.open = true;
    //     this.title = "添加用户";
    //     this.form.password = this.initPassword;
    //   });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
        console.log(row)
      //this.reset();
    //   this.getTreeselect();

      this.form.equipmentID = row.equipmentID
      this.form.equipmentName = row.equipmentName
      this.form.people = row.people
      this.form.proTime = row.proTime
      this.form.status = row.status
      this.form.kouling = ""

    //   this.form.height = row.height
    //   this.form.slope = row.slope
    //   this.form.rotaRate = row.rotaRate
    //   this.form.weight = row.weight
    //   this.form.maxWeight = row.maxWeight
    //   this.form.speed = row.speed
    //   this.form.knm = row.knm
    //   this.form.wind = row.wind
    //   this.form.range = row.range
      this.open = true
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("修改成功，新密码是：" + value);
            }
          });
        })
        .catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function () {
        // console.log(this.form)
        // this.$refs["form"].validate((valid) => {
        //     if(valid) {
        //         if(this.form.userId !== undefined) {
        //             //更新操作
        //         } else {

        //             this.form.userId = Math.floor(Math.random() * 100) + 5
        //              console.log(this.form)
        //             this.dataList.push(this.form)
        //             console.log(this.dataList)

        //         }
        //     }
        // })
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addUser(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$message({
          message: '复制成功',
          type: 'success'
        });
      // this.$confirm(
      //   '是否确认删除模板编号为"' + userIds + '"的数据项?',
      //   "警告",
      //   {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      //   }
      // )
      //   .then(function () {
      //       // for(let i = 0; i < this.dataList.length; i++) {
      //       //     let obj = this.dataList[i]
      //       //     if(obj.userId === userIds) {
      //       //         this.dataList.splice(i, 1)
      //       //     }
      //       // }
      //     return delUser(userIds);
      //   })
      //   .then(() => {
      //     this.getList();
      //     this.msgSuccess("删除成功");
      //   })
      //   .catch(function () {});
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
          return exportToken(queryParams);
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

    // 生成口令
    generatorKouLing() {
      var str = this.randomStr()
      console.log(str)
      this.form.kouling = str
      console.log(this.form.kouling)
    },
    random(max,min){
        return Math.round(Math.random()*(max-min)+min);
    },
    randomStr(){  //封装，以便日后使用。
       //创建一个空字符，用于存放随机数/字母
        var strData = "";
		//生成随机字符库 (验证码四位，随机数三种，取公倍数12,所以循环4次。也可以是120次，1200次。)
        for(var i=0;i<4;i++){
            var num = this.random(0,9);//生成0-9的随机数
            var az = String.fromCharCode(this.random(97,122));//生成a-z
            var AZ = String.fromCharCode(this.random(65,90));//生成A-Z

            strData = strData + num + az + AZ;//将生成的字符进行字符串拼接

        }
        // 开始真正的随机(从随机字符库中随机取出四个)
        var str = "";
        for(var i=0;i<8;i++){
            str += strData[this.random(0,strData.length-1)]
        }
        // console.log(str)
        return str;
    }
  },
};
</script>
