<template>
  <div class="app-container">
    <div v-show="showSearch" style="margin-bottom: 20px">
      <span style="margin-right: 10px">班组</span>
        <treeselect v-model="queryParams.teamId" :options="treeData" placeholder="请选择" :clearable="true" :show-count="true"  style="width: 250px;display:inline-block;vertical-align:bottom;" @select="getSelectList" >
        </treeselect>


      <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </div>
   

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
        >新增</el-button>
      </el-col>
     
      
    </el-row>

    <el-table 
        v-loading="loading" 
        :data="roleList.slice((queryParams.pageNum-1)*queryParams.pageSize,queryParams.pageNum*queryParams.pageSize)" 
         
       
        
    >
      <!-- <el-table-column label="班组名称" prop="label"  align="center"/>
      <el-table-column label="负责人名称" prop="userName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="身份证号" prop="userCode" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="手机号" prop="phone" width="100" /> -->
      <el-table-column label="班组名称" align="center" >
        <template slot-scope="scope">
          {{scope.row.teams.label}}
        </template>
      </el-table-column>
       <el-table-column label="负责人名称" align="center" >
        <template slot-scope="scope">
          {{scope.row.siteUserInfo.userName}}
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="center" >
        <template slot-scope="scope">
          {{scope.row.siteUserInfo.userCode}}
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" >
        <template slot-scope="scope">
          {{scope.row.siteUserInfo.phone}}
        </template>
      </el-table-column>
      
      
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <div style="height: 500px; overflow-y: scroll; ">
        <el-form :model="banzuForm" :rules="banzuRules" ref="banzuForm" label-width="100px">
          <el-row>
            <div style="font-size:16px;color:red;">班组信息</div>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="班组名称:" prop="label">
                 <el-input v-model="banzuForm.label"  @input="onInput()"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级班组:" prop="parentId">
                <treeselect v-model="banzuForm.parentId" :options="treeData2" placeholder="请选择" noOptionsText="没有上层节点,请在左侧输入名称创建" :clearable="true" :show-count="true"  style="display:inline-block;vertical-align:bottom;" @select="getSelectList2" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider></el-divider> 
          <el-row>
            <div style="font-size:16px;color:red;">班组负责人信息</div>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="负责人:" prop="userName">
                 <el-input v-model="banzuForm.userName"  />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号:" prop="userCode">
                 <el-input v-model="banzuForm.userCode"  />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="民族" prop="userNationality">
                <el-input v-model="banzuForm.userNationality" placeholder="请输入民族" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年龄" prop="userAge">
                <el-input v-model="banzuForm.userAge" placeholder="请输入年龄" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="性别" prop="userSex">
                <el-radio-group v-model="banzuForm.userSex">
                    <el-radio label="2" >男</el-radio>
                    <el-radio label="1" >女</el-radio>
                </el-radio-group>
               </el-form-item>
            </el-col>
            <el-col :span="12">
               <el-form-item label="学历" prop="userEducation">
                <el-select v-model="banzuForm.userEducation" placeholder="请选择学历" style="width: 50%">
                    <el-option
                        v-for="item in educationList"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
             </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号:" prop="phone">
                 <el-input v-model="banzuForm.phone"  />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职业资格(岗位)证书编号:" prop="userVcode">
                 <el-input v-model="banzuForm.userVcode"  />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="岗位/工种" prop="userPost">
                <el-select v-model="banzuForm.userPost" placeholder="请选择" style="width: 50%">
                    <el-option
                        v-for="item in postList"
                        :key="item.id"
                        :label="item.professionName"
                        :value="item.professionName">
                    </el-option>
                </el-select>
             </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="userStatusStr">
                <el-radio-group v-model="banzuForm.userStatusStr">
                    <el-radio :label="'1'">在职</el-radio>
                    <el-radio :label="'0'">离职</el-radio>
                </el-radio-group>
               </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="特种作业人员" prop="flag">
                <el-radio-group v-model="banzuForm.flag">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
               </el-form-item>
            </el-col>
           
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="照片:" >
                <el-upload
                  class="upload-demo"
                  action="http://121.36.106.18:36080/system/safe/uploadFile"
                  :limit="1"
                  :on-success="handleSuccess"
                  :file-list="fileList"
                >
                  <el-button slot="trigger" type="text" icon="el-icon-upload" style="text-align: center; font-size: 14px; ">选取文件</el-button>
                </el-upload>
                <el-image class="imgStyle" :src="banzuForm.userImg"  v-if="banzuForm.userImg != ''"></el-image>
              </el-form-item>
            </el-col>
            <el-col :span="12">
               <el-form-item label="执业资格(岗位)证书:" >
                <el-upload
                  class="upload-demo"
                  action="http://121.36.106.18:36080/system/safe/uploadFile"
                  :limit="1"
                  :on-success="handleSuccess3"
                  :file-list="fileList"
                >
                  <el-button slot="trigger" type="text" icon="el-icon-upload" style="text-align: center; font-size: 14px; ">选取文件</el-button>
                </el-upload>
                <el-image class="imgStyle"  :src="banzuForm.checkImg"  v-if="banzuForm.checkImg != ''"></el-image>
              </el-form-item>
            </el-col>
          </el-row>
          
          </el-form-item>
        </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitFormPeople">确 定</el-button>
            <el-button @click="cancelPeople">取 消</el-button>
          </div>
      </div>
    </el-dialog>

   
  </div>
</template>

<script>

import { listBanzu, addBanzu, updateBanzu, delBanzu, getBanzuTree, getGangwei, getDetail } from '@/api/system/banzu';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Banzu",
  components: { Treeselect },
  data() {
    return {
        userInfoId: undefined,
      
        postList: [],
        treeData: [],
        treeData2: [],
        banzuForm: {
            userImg : '',
            constructionSiteId : '',
            id : '',
            userName : '',
            userClass : null,
            teamId : null,
            userPost : '',
            userCode : '',
            userVcode : '',
            userSex : '',
            phone : '',
            userNationality : '',
            userAge : '',
            userEducation : '',
            userSignDeptName : '',
            userSignCompanyName : '',
            checkImg : '',
            leader :'',
            flag :'',
            userStatus :'',
            teamId : '',
            label : '',
            parentId : undefined
      
        },
        banzuRules: {
        label: [
          { required: true, message: "班组姓名不能为空", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "上级班组不能为空", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "负责人不能为空", trigger: "blur" },
        ],
        userCode: [
          { required: true, message: "身份证不能为空", trigger: "blur" },
        ],
        userVcode: [
          { required: true, message: "证书编号不能为空", trigger: "blur" },
        ],
        userStatusStr: [
          { required: true, message: "状态不能为空", trigger: "blur" },
        ],

        phone: [
          { required: true, message: "联系方式不能为空", trigger: "blur" },
        ],
        checkImg: [
          { required: true, message: "资质证书不能为空", trigger: "blur" },
        ],
        userImg: [
          { required: true, message: "照片不能为空", trigger: "blur" },
        ],
        userSex: [
          { required: true, message: "性别不能为空", trigger: "blur" },
        ],
      },
      educationList: ['小学', '初中', '高中', '专科', '本科', '研究生'],
       fileList:[],

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
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 数据范围选项
     
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
     
    this.getList();
    this.getBanzu()
   // this.getTreeselect();
    this.getPofession();
    
  },
  methods: {
    cancelPeople() {
        this.open = false
        this.resetForm2('banzuForm')
    },
    resetForm2(formName) {
      this.userInfoId = undefined
      this.banzuForm.userImg = ''
      this.banzuForm.constructionSiteId = ''
      this.banzuForm.id = ''
      this.banzuForm.userName = ''
      this.banzuForm.userClass = null
      this.form.teamId = null
      this.banzuForm.userPost = ''
      this.banzuForm.userCode = ''
      this.banzuForm.userVcode = ''
      this.banzuForm.userSex = ''
      this.banzuForm.phone = ''
      this.banzuForm.userNationality = ''
      this.banzuForm.userAge = ''
      this.banzuForm.userEducation = ''
      this.banzuForm.userSignDeptName = ''
      this.banzuForm.userSignCompanyName = ''
      this.banzuForm.checkImg = ''
      this.banzuForm.leader = ''
      this.banzuForm.flag = ''
      this.banzuForm.userStatus = ''
      this.banzuForm.teamId = ''
      this.banzuForm.label = ''
      this.banzuForm.parentId = undefined
      this.fileList = []
      
    },
    onInput(){
     this.$forceUpdate();
    },
      handleSuccess(response, file, fileList) {
        this.banzuForm.userImg = response.data
      
        },
        handleSuccess3(response, file, fileList) {
            this.banzuForm.checkImg = response.data
      
        },
    getPofession() {
        var id = localStorage.getItem('deptId')
        getGangwei(id).then((res) => {
            console.log("岗位", res)
            this.postList = res.rows
        })
    },
    getSelectList2(node, instanceId) {
        console.log("node", node)
        console.log("instanceId", instanceId)
        this.banzuForm.userClass = node.label
        this.banzuForm.teamId = node.id
    },
    getSelectList(node, instanceId) {
      this.queryParamsUserclass = node.label
      this.queryParams.userClass = node.label
      this.queryParams.teamId = node.id
    },
    /** 查询角色列表 */
    getBanzu() {
        
      var params = {
          
          siteId: localStorage.getItem("deptId")
      }
      getBanzuTree(params).then(
        response => {
            console.log("获取班组1", response)
            this.treeData = response.data
            this.treeData2 = response.data
        }
      );
    },
    submitFormPeople: function () {
      console.log("班组id",this.banzuForm.parentId)
      if(this.banzuForm.parentId === undefined) {
        this.banzuForm.parentId = 0
      }
      this.$refs["banzuForm"].validate((valid) => {
        if (valid) {
          if(this.banzuForm.id === undefined || this.banzuForm.id === null) {
             var obj = {
              siteId: localStorage.getItem('deptId'),
              label: this.banzuForm.label,
              parentId: this.banzuForm.parentId
            }
             var obj2 = {
              checkImg: this.banzuForm.checkImg,
              constructionSiteId: localStorage.getItem('deptId'),
              flag: this.banzuForm.flag,
              leader: this.banzuForm.leader,
              phone: this.banzuForm.phone,
              userCode: this.banzuForm.userCode,
              userEducation: this.banzuForm.userEducation,
              userImg: this.banzuForm.userImg,
              userName: this.banzuForm.userName,
              userPost: this.banzuForm.userPost,
              userSex: this.banzuForm.userSex,
              userStatus: this.banzuForm.userStatus,
              userVcode: this.banzuForm.userVcode,
              userClass: this.banzuForm.label,
              userNationality: this.banzuForm.userNationality,
              userAge: this.banzuForm.userAge,
              userSignCompanyName: this.currentUserSignCompanyName
            }
            var tijiaoForm = {
              siteUserInfo: obj2,
              teams: obj
            }
            addBanzu(tijiaoForm).then((response) => {
              // console.log("SASAS",response.data)
              if (response.code === 200) {
                this.$message({
                  type: 'success',
                  message: '添加成功！'
                })
                this.open = false;
                this.getList()
                this.getBanzu()
                this.resetForm2('banzuForm')
              }
            });

          } else {
            var obj = {
              id: this.banzuForm.id,
              siteId: localStorage.getItem('deptId'),
              label: this.banzuForm.label,
              parentId: this.banzuForm.parentId
            }
             var obj2 = {
              id: this.userInfoId,
              checkImg: this.banzuForm.checkImg,
              constructionSiteId: localStorage.getItem('deptId'),
              flag: this.banzuForm.flag,
              leader: this.banzuForm.leader,
              phone: this.banzuForm.phone,
              userCode: this.banzuForm.userCode,
              userEducation: this.banzuForm.userEducation,
              userImg: this.banzuForm.userImg,
              userName: this.banzuForm.userName,
              userPost: this.banzuForm.userPost,
              userSex: this.banzuForm.userSex,
              userStatus: this.banzuForm.userStatus,
              userVcode: this.banzuForm.userVcode,
              userClass: this.banzuForm.label,
              userNationality: this.banzuForm.userNationality,
              userAge: this.banzuForm.userAge,
              userSignCompanyName: this.currentUserSignCompanyName
            }
            var tijiaoForm = {
              siteUserInfo: obj2,
              teams: obj
            }
            updateBanzu(tijiaoForm).then((response) => {
              // console.log("SASAS",response.data)
              if (response.code === 200) {
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                })
                this.open = false;
                this.getList()
                this.getBanzu()
                this.resetForm2('banzuForm')
              }
            });

          }
          
         
         
          
          // console.log("班组提交的信息",tijiaoForm)
          
          
          
          
        }
      });
    },

    getList() {
        
      var params = {
         
          siteId: localStorage.getItem("deptId")
      }
      listBanzu(params).then(
        response => {
            console.log("获取班组", response)
          this.roleList = response.data
          this.total = response.data.length;
          this.loading = false;
        }
      );
    },
    
   
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: "0",
        menuIds: [],
        deptIds: [],
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
     
      this.getList();
      var params = {
          label: '',
          parentId: -1,
          siteId: localStorage.getItem("deptId")
      }
      listBanzu(params).then(
        response => {
            console.log("获取班组", response)
          this.roleList = this.handleTree(response.data, "id", "parentId");
          this.total = response.data.length;
          this.loading = false;
        }
      );
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.queryParams.roleName = ''
      this.queryParams.roleKey = ''
      this.queryParams.status = ''
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.resetForm2('banzuForm');
      
      this.open = true;
      this.title = "添加班组";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
        console.log('row', row)
      this.title = "修改班组";
      this.open = true
      this.getInfo(row.teams.id)
    },
    getInfo(id) {
        
        getDetail(id).then((res) => {
            console.log("ASASA", res)
            this.userInfoId = res.data.siteUserInfo.id
            var obj = Object.assign({}, res.data.siteUserInfo, res.data.teams)
            console.log("obj,", obj)
            this.banzuForm = obj
        })
    },
    /** 分配数据权限操作 */
    
    /** 提交按钮 */
   
    /** 提交按钮（数据权限） */
    
    /** 删除按钮操作 */
    handleDelete(row) {
      
      const name = row.teams.label;
      this.$confirm('是否确认删除"' + name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delBanzu(row.teams.id).then((res) => {
            console.log("删除的数据", res)
            if(res.code === 200) {
              this.getList();
              this.msgSuccess("删除成功");
            }
          })
          
        }).catch(function() {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有角色数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRole(queryParams);
        }).then(response => {
        window.open(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style scoped>
.imgStyle {
  width: 200px;
  height: 200px;
}
</style>

