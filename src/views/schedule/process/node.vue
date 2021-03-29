<template>
  <div class="app-container">
    
    <el-row :gutter="20">
        <!-- <div style="margin-top:5px;margin-bottom: 6px;">
           <el-row :gutter="10" class="mb8" >
              <el-col :span="1.5">
              计划工期{{projectPlanDays}}天，已进行{{doingDays}}天
              </el-col>
          </el-row>
        </div> -->
        <!-- <br /> -->
        <div style="margin-right:10px;">
          <span style="font-size: 14px;margin-right: 10px">节点名称</span><el-input v-model="queryParams.label" placeholder="请输入关键字" clearable size="small" style="width: 200px;margin-right: 10px"/>
          <span style="font-size: 14px;margin-right: 10px">进度</span><el-select v-model="queryParams.progress" placeholder="请选择进度" clearable  style="width: 200px;margin-right: 10px">
              <el-option v-for="dict in progressList" :key="dict.value" :label="dict.label" :value="dict.value" ></el-option>
          </el-select>
         <span style="font-size: 14px;margin-right: 10px">状态</span> <el-select v-model="queryParams.state" placeholder="请选择状态" clearable  style="width: 200px;margin-right: 10px">
              <el-option v-for="dict in stateList" :key="dict.value" :label="dict.label" :value="dict.value" ></el-option>
          </el-select>
          <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
         
        </div>

        <el-row :gutter="10" class="mb8" style="margin-top:15px;clear:both;">
          <el-col :span="1.5">
            <el-button type="primary"  size="mini" @click="handleAdd" v-if="!isAdmin" v-hasPermi="['system:user:add']">编辑节点</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary"  size="mini" @click="downloadFile" v-hasPermi="['system:user:add']">下载模版</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary"  size="mini" @click="importNodeExcel" v-if="!isAdmin" v-hasPermi="['system:user:add']">导入节点</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary"  size="mini" @click="exportExcel" v-hasPermi="['system:user:add']">导出EXCEL</el-button>
          </el-col>
        </el-row>

        


        
        <el-table v-loading="loading"  :data="dataList.slice((queryParams.pageNum-1)*queryParams.pageSize,queryParams.pageNum*queryParams.pageSize)" @selection-change="handleSelectionChange">

          <el-table-column label="编号" align="center" prop="sort" />
          <el-table-column label="节点名称" align="center" prop="label"  />
          <el-table-column label="进度" align="center" prop="progress" :show-overflow-tooltip="true" >
            <template slot-scope="scope">
                <el-tag  v-if="scope.row.progress===0" type="info">未开始</el-tag>
                <el-tag  v-if="scope.row.progress===1" type="danger">进行中</el-tag>
                <el-tag  v-if="scope.row.progress===2" type="success">已完成</el-tag>
            </template>
          </el-table-column>
          
          <el-table-column label="计划开始时间" align="center" prop="planStartTime" :show-overflow-tooltip="true" />
          <el-table-column label="计划结束时间" align="center" prop="planEndTime" :show-overflow-tooltip="true" />
          <el-table-column label="计划工期" align="center" prop="planDays" :show-overflow-tooltip="true" />
          <el-table-column label="实际开始时间" align="center" prop="actualStartTime" :show-overflow-tooltip="true" />
          <el-table-column label="实际结束时间" align="center" prop="actualEndTime" :show-overflow-tooltip="true" />
          <!-- <el-table-column label="实际工期" align="center" prop="actualDays" :show-overflow-tooltip="true" /> -->

           <el-table-column label="开工延期" align="center" prop="classification" :show-overflow-tooltip="true" >
              <template slot-scope="scope">
                  <el-tag  v-if="scope.row.classification=== 0" type="success">否</el-tag>
                  <el-tag  v-if="scope.row.classification=== 1" type="warning">是</el-tag>
              </template>
            </el-table-column>

           <el-table-column label="状态" align="center" prop="state" :show-overflow-tooltip="true" >
              <template slot-scope="scope">
                  <el-tag  v-if="scope.row.state=== 1" type="success">开工延期</el-tag>
                  <el-tag  v-if="scope.row.state=== 2" type="warning">施工延期</el-tag>
                  <el-tag  v-if="scope.row.state=== 3" type="danger">全部延期</el-tag>
                  <el-tag  v-if="scope.row.state=== 4" type="danger">未知</el-tag>
              </template>
            </el-table-column>
          
          <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleView(scope.row)" >修改</el-button>
              <el-button size="mini" type="text" @click="handleDel(scope.row)" >删除</el-button>
              <el-button size="mini" type="text" @click="handleUpdate(scope.row)" >查看延缓说明</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getNodeList" />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
     
      <div style="margin-bottom:10px;">
        <el-button type="primary" size="mini" @click="addNodePlan">新增节点计划</el-button>
      </div>
      <vxe-table
          resizable
          ref="xTable1"
          :data="tableData"
           border="false"
           :edit-config="{trigger: 'click', mode: 'row'}"
           :activeMethod="activeMethod"
          :tree-config="{children: 'children', expandAll: true}"
          :checkbox-config="{labelField: 'name', }"
          @checkbox-change="selectChangeEvent">
          
          <!-- <vxe-table-column type="checkbox" ></vxe-table-column> -->
          <vxe-table-column type="seq" ></vxe-table-column>
          <!-- <vxe-table-column field="id" title="序号"></vxe-table-column> -->
          <vxe-table-column field="templateName" title="名称" :edit-render="{name: 'input', events: {input: nameChangeEvent}}"></vxe-table-column>
          <vxe-table-column type="checkbox" title="施工阶段" width="400" tree-node></vxe-table-column>
          <vxe-table-column title="操作" width="100" show-overflow>
            <template v-slot="{ row }" >
              <vxe-button   @click="editEvent(row)" v-if="row.hasOwnProperty('templateName')">选择</vxe-button>
            </template>
          </vxe-table-column>
        </vxe-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加节点计划对话框 -->
    <el-dialog :title="title" :visible.sync="nodePlan" width="1000px"  append-to-body>
      <el-form ref="nodeForm" :model="nodeForm" :rules="nodeFormRules" label-width="160px" style="height: 500px;">
        <el-col :span="4" :xs="24">
          <div class="dm-aside">
             
            <div class="head-container header_tree">
            <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all  />
            </div>
          </div>
       
        </el-col>
        <el-col :span="20" :xs="24">
          <el-row>

              <el-col :span="12">
                  <el-form-item  label="节点名称" prop="label">
                      <el-input v-model="nodeForm.label" placeholder="请输入节点名称"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="上级节点" prop="parentId">
                    <treeselect v-model="nodeForm.parentId" :options="treeData4" placeholder="请选择" noOptionsText="没有上层节点,请输入创建" :clearable="true" :show-count="true"  @select="getSelectList3" />
                  </el-form-item>
              </el-col>
              
          </el-row>

           <el-row>
              <el-col :span="12">
                  <el-form-item label="绑定班组:" prop="teamId">
                    <treeselect v-model="nodeForm.teamId" :options="treeData2" placeholder="请选择" noOptionsText="目前没有班组，请先创建" :clearable="true" :show-count="true"  style="display:inline-block;vertical-align:bottom;" @select="getSelectList2" />
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="显示排序" prop="sort">
                      <el-input v-model="nodeForm.sort" placeholder="请输入序号" style="width:250px;"/>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="负责人">
                <el-input v-model="nodeForm.leadingCadre" :disabled="disabled" placeholder="请输入负责人" />
                
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责电话">
                <el-input v-model="nodeForm.phone" :disabled="disabled" placeholder="请输入负责人电话" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item  label="计划开始时间" prop="planStartTime">
                  <el-date-picker v-model="nodeForm.planStartTime" align="right" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"  />
              </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item  label="计划结束时间" prop="planEndTime">
                  <el-date-picker v-model="nodeForm.planEndTime" align="right" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"  />                    
                </el-form-item>
            </el-col>
          </el-row>
          
         
          <el-row>
            <el-col :span="12">
                <el-form-item  label="实际开始时间" prop="actualStartTime">
                  <el-date-picker v-model="nodeForm.actualStartTime" align="right" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"  />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item  label="实际结束时间" prop="actualEndTime">
                  <el-date-picker v-model="nodeForm.actualEndTime" align="right" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"  />
                </el-form-item>
            </el-col>
          </el-row>


          <el-row>
              <el-col :span="12">
                   <el-form-item label="开工延期" prop="classification">
                    <el-radio-group v-model="nodeForm.classification">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
              </el-col>
              <el-col :span="12" v-if="nodeForm.classification === 1">
                  <el-form-item  label="状态" prop="state">
                    <el-select v-model="nodeForm.state" placeholder="请选择状态" clearable size="small" style="width: 240px">
                      <el-option v-for="dict in statusOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
              </el-col>
          </el-row>

          <el-row v-if="nodeForm.classification === 1">
              <el-col :span="24">
                  <el-form-item  label="说明" prop="delayInfo">
                    <el-input type="textarea" v-model="nodeForm.delayInfo" style="width: 90%; "></el-input>
                  </el-form-item>
              </el-col>
             
          </el-row>
        
        </el-col>
        
      

      </el-form>
     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitNodeForm">确 定</el-button>
        <el-button @click="cancelPlan">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog :title="title" :visible.sync="viewDialog" width="1000px"  append-to-body>
      <el-form ref="viewForm" :model="viewForm" :rules="viewFormRules" label-width="160px" >
        
       
          <el-row>
              <el-col :span="12">
                  <el-form-item  label="节点名称" prop="label">
                      <el-input v-model="viewForm.label" placeholder="请输入节点名称" />
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="计划工期" prop="planDays">
                    <el-input v-model="viewForm.planDays" placeholder="请输计划工期" :disabled="disabled"/>
                  </el-form-item>
              </el-col>
              
          </el-row>

          <el-row>
              <el-col :span="12">
                  <el-form-item label="绑定班组:" prop="teamId">
                    <treeselect v-model="viewForm.teamId" :options="treeData2" placeholder="请选择" noOptionsText="目前没有班组，请先创建" :clearable="true" :show-count="true"  style="display:inline-block;vertical-align:bottom;" @select="getSelectList2View" />
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="显示排序" prop="sort">
                      <el-input v-model="viewForm.sort" placeholder="请输入序号" style="width:250px;"/>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="负责人" prop="leadingCadre">
                <el-input v-model="viewForm.leadingCadre" :disabled="disabled" placeholder="请输入负责人" />
                
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责电话" prop="phone">
                <el-input v-model="viewForm.phone" :disabled="disabled" placeholder="请输入负责人电话" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
              <el-col :span="12">
                  <el-form-item  label="计划开始时间" prop="planStartTime">
                      <el-date-picker v-model="viewForm.planStartTime" align="right" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"  />
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="计划结束时间" prop="planEndTime">
                    <el-date-picker v-model="viewForm.planEndTime" align="right" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"  />                    
                  </el-form-item>
              </el-col>
              
          </el-row>
          <el-row>
              <el-col :span="12">
                  <el-form-item  label="实际开始时间" prop="actualStartTime">
                    <el-date-picker v-model="viewForm.actualStartTime" align="right" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"  />
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="实际结束时间" prop="actualEndTime">
                    <el-date-picker v-model="viewForm.actualEndTime" align="right" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"  />
                  </el-form-item>
              </el-col>
          </el-row>

          <el-row>
              <el-col :span="12">
                   <el-form-item label="开工延期" prop="classification">
                    <el-radio-group v-model="viewForm.classification">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
              </el-col>
              <el-col :span="12" v-if="viewForm.classification === 1">
                  <el-form-item  label="状态" prop="state">
                    <el-select v-model="viewForm.state" placeholder="请选择状态" clearable size="small" style="width: 240px">
                      <el-option v-for="dict in statusOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
              </el-col>
          </el-row>

          <el-row v-if="viewForm.classification === 1">
              <el-col :span="24">
                  <el-form-item  label="说明" prop="delayInfo">
                    <el-input type="textarea" v-model="viewForm.delayInfo" style="width: 90%; "></el-input>
                  </el-form-item>
              </el-col>
             
          </el-row>
         
        
       
        
      

      </el-form>
     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="!isAdmin" @click="submitViewForm">确 定</el-button>
        <el-button @click="cancelView">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="延缓说明" :visible.sync="delayOpen" width="1000px"  append-to-body>
      <el-button size="mini" type="primary" class="margin-bottom: 10px;" v-if="!isAdmin" @click="showAddDelay">新增施工延期</el-button>
      <el-table  :data="delayList" >

          <el-table-column label="编号" align="center" type="index" />
          <el-table-column label="开始时间" align="center" prop="startTime"  />
          <el-table-column label="结束时间" align="center" prop="endTime"  />
          <el-table-column label="状态" align="center" prop="state" >
            <template slot-scope="scope">
                <el-tag  v-if="scope.row.state===0" type="danger">异常延期</el-tag>
                <el-tag  v-if="scope.row.state===1" type="success">正常延期</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="类别" align="center" prop="classification" >
            <template slot-scope="scope">
                <el-tag  v-if="scope.row.classification===0" type="danger">开工延期</el-tag>
                <el-tag  v-if="scope.row.classification===1" type="success">施工延期</el-tag>
            </template>
          </el-table-column>
          
          <el-table-column label="说明" align="center" prop="explain" :show-overflow-tooltip="true" />

          </el-table-column>
        </el-table>
    </el-dialog>

    <!-- 延缓说明新增 -->
     <el-dialog title="新增延缓说明" :visible.sync="addDelayOpen" width="1000px"  append-to-body>
      <el-form ref="delayForm" :model="delayForm" :rules="delayFormRules" label-width="160px" >

           <el-row>

              <el-col :span="12">
                  <el-form-item  label="开始时间" prop="startTime">
                      <el-date-picker v-model="delayForm.startTime" align="right" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"  />
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item  label="结束时间" prop="endTime">
                    <el-date-picker v-model="delayForm.endTime" align="right" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"  />                    
                  </el-form-item>
              </el-col>
              
          </el-row>
          <el-row>
              <el-col :span="12">
                  <el-form-item  label="状态" prop="state">
                    <el-select v-model="delayForm.state" placeholder="请选择状态" clearable size="small" style="width: 240px">
                      <el-option v-for="dict in statusOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
              </el-col>
             
          </el-row>

           <el-row>
              
              <el-col :span="24">
                  <el-form-item  label="说明" prop="explain">
                    <el-input type="textarea" v-model="delayForm.explain" style="width: 90%; "></el-input>
                  </el-form-item>
              </el-col>
          </el-row>
         
        
       
        
      

      </el-form>
     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDelayForm">确 定</el-button>
        <el-button @click="cancelDelay">取 消</el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="modelOpen" title="导入节点" width="30%" @close="cancelModel">
      <div style="margin:0 auto; ">
        <el-upload
          style="margin-left:15%;margin-bottom:10px;"
          class="upload-demo"
          action=""
          accept=".xls,.xlsx"
          :limit="1"
          drag
          :on-change="handleChange"
          :file-list="fileList12"
          :auto-upload="false"
          >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传.xlsx文件</div>
        </el-upload>
        
        </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitExcel">导入</el-button>
            <el-button @click="cancelModel">取 消</el-button>
          </div>
      </div>
    </el-dialog>

  
  </div>
</template>

<script>

import { nodeList, nodeTemplate, getTeamTree, broadsideInfo, addNodeTemplate, addNode, putNode, delNode, exportNodeTemplate, exportNodeList, importNodeList, delayList, addDelay, importNode, getBanzuPeople } from "@/api/system/process";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import { getLeftColumn } from "@/api/system/dept";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapState } from 'vuex'

export default {
  name: "Node",
  // props: {
  //     selectNode: {
  //         type: Object,
  //         default: function() {
  //           return {}
  //         }
  //     }  
  //   },
  components: { Treeselect },
  computed: {
    ...mapState({ 
      nodeState: state => state.nodeState,
      nodeStateId: state => state.nodeStateId
    }),
  },

    
  data() {
    return {
      disabled: true,
      isAdmin: false,
      modelOpen: false,
      fileList12: [],
      delayId: '',
      addDelayOpen: false,
      delayList: [],
      delayOpen: false,
      selectParentId: '',
      templateId: '',
      currentTemplateName: '',
      viewDialog: false,
        recordsList: [],
        nodeDelayForm: {
          state: undefined,
          nodeId: '',
          explain: ''
        },
        viewForm:{
          id: '',
          actualEndTime: '',
          actualStartTime: '',
          label: '',
          leadingCadre: '',
          parentId: '',
          phone: '',
          planDays:'',
          planEndTime: '',
          planStartTime: '',
          taskId: '',
          teamId: null,
          classification: undefined,
          state: undefined,
          delayInfo: ''
        },
        viewFormRules: {
          label: [
            { required: true, message: "节点名称不能为空", trigger: "blur" },
          ],
          teamId: [
            { required: true, message: "班组不能为空", trigger: "blur" },
          ],
          sort: [
            { required: true, message: "排序不能为空", trigger: "blur" },
          ],
          planStartTime: [
            { required: true, message: "计划结束时间不能为空", trigger: "blur" },
          ],
          planEndTime: [
            { required: true, message: "计划结束时间不能为空", trigger: "blur" },
          ],
          classification: [
            { required: true, message: "开工延期设置不能为空", trigger: "blur" },
          ]
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
          planStartTime: '',
          planEndTime: '',
          actualStartTime: '',
          actualEndTime: '',
          classification: undefined,
          state: undefined,
          delayInfo: ''
        },
        nodeAddDelayForm: {
          state: undefined,
          explain: ''
        },
        delayForm:{
          startTime: '',
          endTime: '',
          state: '',
          explain: '',
          id: '',
          nodeId: ''
        },
        treeData4: [],
        treeData2: [],
        projectTotal: 4,
        projectPlanDays: 194,
        doingDays: 110,
        progressList:[
          {
            value: 0,
            label: '未开始'
          },
          {
            value: 1,
            label: '进行中'
          },
          {
            value: 2,
            label: '已完成'
          },
        ],
        stateList: [
          {
            value: 0,
            label: '正常'
          },
          {
            value: 1,
            label: '延期'
          }
        ],
        nodePlan: false,
        tableData: [
               {
                 id:1,
                 name: '参考一',
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
      statusOptions: [
        {
          value: 0,
          label: '异常延期'
        },
        {
          value: 1,
          label: '正常延期'
        }
      ],
      
      constructionUnitList:["建设方", "监理方", "施工方"],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {
          actualDays: '',
          actualEndTime: '',
          actualStartTime: '',
          constructionUnit: '',
          contactInformation: '',
          contractPayment: '',
          id: '',
          label: '',
          leadingCadre: '',
          planDays: '',
          planEndTime: '',
          planStartTime: '',
          remarks: '',
          serialNumber: '',
          siteId: '',

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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        label: '',
        progress: '',
        state: '',
        siteId: ''
      },
      // 表单校验
      nodeFormRules: {
        leadingCadre: [
          { required: true, message: "负责人不能为空", trigger: "blur" },
        ],
        label: [
          { required: true, message: "节点名称不能为空", trigger: "blur" },
        ],
        teamId: [
          { required: true, message: "绑定班组不能为空", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "排序序号不能为空", trigger: "blur" },
        ],
        planStartTime: [
          { required: true, message: "计划开始时间不能为空", trigger: "blur" },
        ],
        planEndTime: [
          { required: true, message: "计划结束时间不能为空", trigger: "blur" },
        ],
        classification: [
            { required: true, message: "开工延期设置不能为空", trigger: "blur" },
          ],
          state: [
            { required: true, message: "状态设置不能为空", trigger: "blur" },
        ],

      },
      delayFormRules: {
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" },
        ],
        state: [
          { required: true, message: "状态不能为空", trigger: "blur" },
        ],
        explain: [
          { required: true, message: "说明不能为空", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选部门树
    // nodeStateId(val){
    //   console.log("node-val", val)
    //   // console.log("node-oldVal", oldVal)
    //   // if(val.label !== oldVal.label) {
    //   //   this.getNodeList()
    //   // }
    // },
   "$store.state.task.nodeStateId"(old, newd) {
      console.log("旧的", old)
      console.log("新的", newd)
      this.getNodeList()
    }
    
  },
  mounted() {
        if(localStorage.getItem('userName') === 'admin-1') {
          
          this.isAdmin = true
        } else {
          this.isAdmin = false
        }
         
        this.getNodeList();
        this.getBanZu()
  },
  created() {
    
    
  },
  methods: {
    cancelModel() {
      this.modelOpen = false
    },
    handleChange(file, fileList) {
      this.fileList12 = fileList
    },
    submitExcel() {
      var id = this.$store.state.task.nodeStateId
      const formData = new FormData()
      formData.append('file', this.fileList12[0].raw)
      importNode(id, formData).then((res) => {
        console.log("导入的文件res", res)
        if(res.code === 200) {
          this.fileList12 = []
          this.modelOpen = false
          this.getNodeList()
        }
      })
    },
    editEvent(row) {
      console.log("row", row)
      this.templateId = row.id
    },

    nameChangeEvent ({ column }) {
      console.log(`${column} 触发 input 事件`)
      console.log(column.model.value)
      this.currentTemplateName = column.model.value
    },
    
    getBroadsideInfo() {
      // var id = localStorage.getItem('deptId')
      var id = this.$store.state.task.nodeStateId
      broadsideInfo(id).then((res) => {
        console.log("ASASA", res.data)
        this.deptOptions = res.data
        this.treeData4 = res.data
      })
    },
    getBanZu() {
      var id = localStorage.getItem('deptId')
      getTeamTree(id).then((res) => {
        
        this.treeData2 = res.data
      })
    },
    getSelectList2(node, instanceId) {
       this.nodeForm.userClass = node.label
      this.nodeForm.teamId = node.id
      var params = {
        siteId: localStorage.getItem('deptId'),
        teamId: node.id
      }
      getBanzuPeople(params).then((res) => {
        console.log("信息", res.data[0])
        var obj = res.data[0]
        this.nodeForm.leadingCadre = obj.user_name
        this.nodeForm.phone = obj.phone
        
        

      })
    },
    getSelectList2View(node, instanceId) {
      // console.log("node", node)
      // console.log("instanceId", instanceId)
      this.viewForm.userClass = node.label
      this.viewForm.teamId = node.id
      var params = {
        siteId: localStorage.getItem('deptId'),
        teamId: node.id
      }
      getBanzuPeople(params).then((res) => {
        console.log("信息", res.data[0])
        var obj = res.data[0]
        this.$nextTick(() => {
          this.viewForm.leadingCadre = obj.user_name
          this.viewForm.phone = obj.phone
        })
        

      })

    },
    

    getSelectList3(node, instanceId) {
      console.log("FolderNode", node)
      this.selectParentId = node.sort
      // this.nodeForm.parentId = node.sort
    },
    activeMethod(row, rowIndex, column, columnIndex) {
      console.log("row", row)
      console.log("rowIndex", rowIndex)
      console.log("column", column)
      console.log("columnIndex", columnIndex)
    },
    panduanObj(id, arr, paramsObj) {
      var params = {}
      for(var i = 0; i < arr.length; i++) {
        var obj = arr[i]
        if(obj.sortId === id) {
          params = {
            children: [],
            name: obj.name,
            parentId: obj.parentId,
            sortId: obj.sortId
          }
          break
        }
      }
      params.children.push(paramsObj)
      return params;
    },
    dealData(arr, allArr) {
      var params = []
      var currentParentId = ''
      var obj = {}
      for(var i = 0; i < arr.length; i++) {
        var arrObj = arr[i]
        if(arrObj.parentId === 0) {
          params.push(arrObj)
          i = i + arrObj.children.length
          
        } else {
          if(currentParentId ===  arrObj.parentId) {
            obj.children.push(arrObj)
          } else {
            currentParentId = arrObj.parentId
            obj = this.panduanObj(currentParentId, allArr, arrObj)
            params.push(obj)
          }
        }
      }
      console.log("最终的", params)
      return params;
    },
    
    selectChangeEvent ({ records, indeterminates  }) {
      console.info(`勾选${records.length}个树形节点`, records)
      // console.log(indeterminates)
      var allArr = []
      for(var i = 0; i < indeterminates.length; i++) {
        var obj = indeterminates[i]
        if(obj.hasOwnProperty('templateName')) {
          allArr = obj.children
          break;
        }
      }
      // console.log('全部数组', allArr)
      this.recordsList = this.dealData(records, allArr)
      // this.recordsList = records
    },
    getNodeList() {
      
      var id = this.$store.state.task.nodeStateId
      var params = {
        taskId: id
        
      }
      this.loading = true;
      nodeList(params).then((res) => {
        this.dataList = res.rows
        this.total = res.total;
        this.loading = false;
      })
    },
    downloadFile() {
      window.location.href = 'http://121.36.106.18:38082/node_template.xlsx'
      
    },
    importNodeExcel() {
      var id = this.$store.state.task.nodeStateId
      this.modelOpen = true;
      this.actionUrl = `http://121.36.106.18:38080/scheduleManage/node/importData?taskId=${id}`
    },
    exportExcel() {
      var params = {
        taskId: this.$store.state.task.nodeStateId,
      }
      exportNodeList(params).then((res) => {
        if(res.code === 200) {
          window.location.href = res.msg
        }
      })
    },
    
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    
    
    // 取消按钮
    cancel() {
      this.open = false;
      
    },
    cancelPlan() {
      this.nodePlan = false;
      this.reset()
    },
    cancelView() {
      this.viewDialog = false;
      this.getNodeList()
    },
    cancelDelay() {
      this.addDelayOpen = false
    },
    // 表单重置
    reset() {
      this.nodeForm = {
          id: '',
          label: '',
          parentId: null,
          sort: '',
          taskId: '',
          teamId: null,
          leadingCadre: '',
          phone: '',
          planStartTime: '',
          planEndTime: '',
          actualStartTime: '',
          actualEndTime: ''
          
        }
    },
    resetView() {
      this.viewForm.actualEndTime = ''
      this.viewForm.actualStartTime = ''
    },
    resetDelay() {
      this.delayForm = {
        startTime: '',
        endTime: '',
        nodeId: '',
        id: '',
        state: '',
        explain: ''
      }
    },
    
    /** 搜索按钮操作 */
    handleQuery() {

      this.queryParams.page = 1;
      var id = this.$store.state.task.nodeStateId
      this.queryParams.taskId = id
      //this.loading = true;
      nodeList(this.queryParams).then(res => {
        this.dataList = res.rows
        this.total = res.total;
        this.loading = false;
      });

    },
    /** 重置按钮操作 */
    resetQuery() {
      console.log("重置")
      // this.dateRange = [];
      this.queryParams.label = ''
      this.queryParams.progress = ''
      this.queryParams.state = ''
      this.getNodeList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
        this.open = true;
        this.title = "设置节点计划";
        this.getNodeTemplate()
        //console.log(this.form)
        // this.reset()
        // this.form.siteId = localStorage.getItem("deptId")

    },
    getNodeTemplate() {
      var params = {
        siteId: localStorage.getItem('deptId')
      }
      nodeTemplate(params).then((res) => {
        console.log("节点模版", res.data)
        this.tableData = res.data
      })
    },
    addNodePlan() {
      this.nodePlan = true;
      this.title = "新增节点计划";

      console.log(this.form)
      
      this.getBroadsideInfo()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
        console.log(row)
        this.delayOpen = true
        this.delayId = row.id
        this.getDelayList(row.id)
    },
    getDelayList(id) {
      
      delayList(id).then((res) => {
        console.log("延期", res.data)
        this.delayList = res.data
      })
    },
    showAddDelay() {
      this.addDelayOpen = true
    },
    submitDelayForm() {
      this.delayForm.nodeId = this.delayId
      console.log("新增延缓", this.delayForm)
      this.$refs["delayForm"].validate((valid) => {
       
        if (valid) {
             addDelay(this.delayForm).then((response) => {
               console.log("打印res",)
              if (response.code === 200) {
              
                this.$message({
                  type: 'success',
                  message: '新增成功！'
                })
                this.addDelayOpen = false;
                this.getDelayList(this.delayId)
                this.delayId = ''
                this.getNodeList();
                //this.getBroadsideInfo()
                
                this.resetDelay()
              }
            }); 
          }
       
      });
    },
    handleView(row) {
      console.log(row)
      this.viewDialog = true
      this.viewForm = row
      this.nodeDelayForm.nodeId = row.id
      this.title = '修改节点'
    },
    handleDel(row) {

      console.log("row", row)
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          delNode(row.id).then((res) => {
            if(res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              this.getNodeList();
              
            } else {
              this.$message({
                type: 'error',
                message: '删除失败！'
              })
            }
          })
              
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      
      
    },
    

    importNodeListByTemplate(id) {
      var params = {
        nodeTemplateId: id,
        taskId: this.$store.state.task.nodeStateId
      }
      importNodeList(params).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '导入节点成功！'
          })
          this.getNodeList()
          this.templateId = ''
        }
      })
    },
    getSelectEvent() {
      let selectRecords = this.$refs.xTable1.getCheckboxRecords()
      console.log("123", selectRecords)
    },
    /** 提交按钮 */
    submitForm: function () {
      if(this.templateId === '') {
        var params = {
          children: this.recordsList,
          siteId: localStorage.getItem('deptId'),
          templateName: this.currentTemplateName
        }
        console.log("提交的数据", params)
        addNodeTemplate(params).then((response) => {
          console.log("测试res", response.data)
          this.templateId = response.data
        
          if (response.code === 200) {
            this.$message({
              type: 'success',
              message: '新增模版成功！'
            })
            this.importNodeListByTemplate(this.templateId.toString())
            this.open = false;
          }
        })
      } else {
        this.importNodeListByTemplate(this.templateId.toString())
        this.open = false;
      }
      
    },
   

    submitNodeForm: function () {
       this.nodeForm.taskId = this.$store.state.task.nodeStateId
       if(this.selectParentId === '') {
         this.nodeForm.parentId = 0
       } else {
         this.nodeForm.parentId = this.selectParentId
       }
       
       console.log("提交的node", this.nodeForm)
       console.log("提交的node延期", this.nodeAddDelayForm)
       var params = {
         state: this.nodeForm.state
       }
      this.$refs["nodeForm"].validate((valid) => {
       
        if (valid) {
             addNode(params, this.nodeForm).then((response) => {
               console.log("打印res",)
              if (response.code === 200) {
              
                this.$message({
                  type: 'success',
                  message: '新增成功！'
                })
                this.selectParentId = ''
                this.nodePlan = false;
                //this.getBroadsideInfo()
                this.reset()
                this.getNodeList()
              }
            }); 
          }
       
      });
    },
    submitViewForm: function () {
       this.nodeForm.taskId = this.$store.state.task.nodeStateId
       console.log("提交的node", this.viewForm)
       console.log("提交的node延期", this.nodeDelayForm)
      
       var params = {
         nodeId: this.nodeDelayForm.nodeId,
        explain: this.viewForm.delayInfo,
        state: this.viewForm.state
      }
      this.$refs["viewForm"].validate((valid) => {
       
        if (valid) {
             putNode(params, this.viewForm).then((response) => {
              if (response.code === 200) {
              
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                })
                this.viewDialog = false;
                this.getNodeList()
               this.resetView()
              }
            }); 
          }
       
      });
    },
    

  
    /** 导出按钮操作 */
   
    
    
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg);
      });
    },
  }
   
    
}
</script>

<style scoped>
.dm-aside {
  height: 80vh;
  margin: 0 5px;
  border-radius: 2px;
}
.header_tree {
  overflow:auto;
  height: 500px;
  
}
</style>
<style>
.el-input--medium {
  font-size: 14px;
  width:200px;
}
.vue-treeselect__control {
  padding-left: 5px;
    padding-right: 5px;
    display: table;
    table-layout: fixed;
    width: 200px;
    height: 36px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #fff;
    -webkit-transition-duration: 200ms;
    transition-duration: 200ms;
    -webkit-transition-property: border-color, width, height, background-color, opacity, -webkit-box-shadow;
    transition-property: border-color, width, height, background-color, opacity, -webkit-box-shadow;
    transition-property: border-color, box-shadow, width, height, background-color, opacity;
    transition-property: border-color, box-shadow, width, height, background-color, opacity, -webkit-box-shadow;
    -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}



</style>


