<template>
  <div class="app-container">
   

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="singleProjectList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <!-- <el-table-column label="工地id" align="center" prop="constructionSiteId" />
      <el-table-column label="工地名称" align="center" prop="constructionSiteName" />
      <el-table-column label="父级id" align="center" prop="spParentId" />
      <el-table-column label="祖级列表" align="center" prop="spAncestors" />
      <el-table-column label="是否已删除(1已经删除，0未删除)" align="center" prop="statuss" />
      <el-table-column label="是否可以删除(1可以删除，0不可以)" align="center" prop="isDelete" /> -->
      <el-table-column label="单体工程名称" align="center" prop="spName" />
      <el-table-column prop="orderNum" label="排序" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
           
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改单体工程对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="id" prop="id">
          <el-input v-model="form.id" placeholder="请输入id" />
        </el-form-item>
        <el-form-item label="工地id" prop="constructionSiteId">
          <el-input v-model="form.constructionSiteId" placeholder="请输入工地id" />
        </el-form-item>
        <el-form-item label="工地名称" prop="constructionSiteName">
          <el-input v-model="form.constructionSiteName" placeholder="请输入工地名称" />
        </el-form-item> -->
        <el-form-item label="上级单体" prop="spParentId">
          <treeselect v-model="form.spParentId" :options="singleProjectOptions" :normalizer="normalizer" placeholder="请选择父级id" />
        </el-form-item>
        <!-- <el-form-item label="祖级列表" prop="spAncestors">
          <el-input v-model="form.spAncestors" placeholder="请输入祖级列表" />
        </el-form-item>
        <el-form-item label="是否已删除(1已经删除，0未删除)" prop="statuss">
          <el-input v-model="form.statuss" placeholder="请输入是否已删除(1已经删除，0未删除)" />
        </el-form-item>
        <el-form-item label="是否可以删除(1可以删除，0不可以)" prop="isDelete">
          <el-input v-model="form.isDelete" placeholder="请输入是否可以删除(1可以删除，0不可以)" />
        </el-form-item> -->
        <el-form-item label="单体工程名称" prop="spName">
          <el-input v-model="form.spName" placeholder="请输入单体工程名称" />
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSingleProject, getSingleProject, delSingleProject, addSingleProject, updateSingleProject, exportSingleProject } from "@/api/singleProject/singleProject";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "SingleProject",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 单体工程表格数据
      singleProjectList: [],
      // 单体工程树选项
      singleProjectOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        constructionSiteId: null,
        constructionSiteName: null,
        spParentId: null,
        spAncestors: null,
        statuss: null,
        isDelete: null,
        spName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        spName: [
          { required: true, message: "单体名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "顺序不能为空", trigger: "blur" }
        ],
        spParentId: [
          { required: true, message: "父级单体不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询单体工程列表 */
    getList() {
      this.loading = true;
      var params = {
        constructionSiteId: localStorage.getItem("deptId")
      }
      listSingleProject(params).then(response => {
        this.singleProjectList = this.handleTree(response.data, "id", "spParentId");
        this.loading = false;
      });
    },
    /** 转换单体工程数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.spName,
        children: node.children
      };
    },
	/** 查询部门下拉树结构 */
    getTreeselect() {
      var params = {
        constructionSiteId: localStorage.getItem("deptId")
      }
      listSingleProject(params).then(response => {
        this.singleProjectOptions = [];
        const data = { id: 0, spName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "id", "spParentId");
        this.singleProjectOptions.push(data);
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
        id: null,
        constructionSiteId: null,
        constructionSiteName: null,
        spParentId: null,
        spAncestors: null,
        statuss: null,
        isDelete: null,
        spName: null,
        updateTime: null,
        createTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
	  this.getTreeselect();
      this.open = true;
      this.title = "添加单体工程";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
	  this.getTreeselect();
      if (row != null) {
        this.form.spParentId = row.id;
      }
      getSingleProject(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改单体工程";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.constructionSiteId = localStorage.getItem("deptId")
          if (this.form.id != null) {
            updateSingleProject(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addSingleProject(this.form).then(response => {
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
      this.$confirm('是否确认删除单体工程为"' + row.spName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSingleProject(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>