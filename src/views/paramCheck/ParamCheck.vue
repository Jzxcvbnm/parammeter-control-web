<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <div class="card-search">
          <el-row :gutter="10">
            <el-col span="6">
              <el-button type="primary" @click="uploadFile" color="#00B890">上传版本变量清单</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </template>
    <!--头部 end-->
    <!--表格区域 start-->
    <!-- <div class="table-box" v-if="showTable"> -->
    <div class="table-box">
      <el-row :gutter="10">
        <el-col :span="12" style="margin-bottom: 5px;">
          <el-input :prefix-icon="Search" v-model="paramValue" @keyup.enter="validateAndSearch"
            placeholder="查询参数（支持模糊查询）" style="width: 213px;" />

          <el-button type="primary" @click="validateAndSearch" color="#00B890">查询</el-button>
          <el-button type="primary" @click="resetSearch" color="#00B890">重置</el-button>
        </el-col>
        <el-col :span="12" style="margin-bottom: 5px; text-align: right;">
          <el-button type="primary" @click="exportExcelData" color="#00B890" style="width: 125px;">导出excel文件</el-button>
        </el-col>
      </el-row>
      <!-- <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData" -->
      <el-table element-loading-text="数据加载中..." v-loading="false" :data="tableData"
        style="width: 100%;text-align: center" :row-class-name="tableRowStatus"
        :default-sort="{ prop: 'type1', order: 'ascending' }" :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ fontSize: '12px', background: '#484848', color: 'white', textAlign: 'center' }">

        <el-table-column label="一级分类" porp="type1" sortable>
          <template #default="scope">
            <el-tooltip :content="scope.row.type1" placement="top" effect="light">
              <span class="highlight">{{ scope.row.type1 }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="二级分类" sortable>
          <template #default="scope">
            <el-tooltip :content="scope.row.type2" placement="top" effect="light">
              <span class="highlight">{{ scope.row.type2 }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="参数状态" sortable>
          <template #default="scope">
            <el-tooltip :content="scope.row.status" placement="top" effect="light">
              <span class="highlight">{{ statusMap[scope.row.status] }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="命名空间" prop="namespace" sortable>
          <template #default="scope">
            <el-tooltip :content="scope.row.namespace" placement="top" effect="light">
              <span class="highlight">{{ scope.row.namespace }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="变量名称">
          <template #default="scope">
            <el-tooltip :content="scope.row.variableName" placement="top" effect="light">
              <span class="highlight">{{ scope.row.variableName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="功能环境">
          <template #default="scope">
            <el-tooltip :content="scope.row.valueFunc" placement="top" effect="light">
              <span class="highlight">{{ scope.row.valueFunc }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="回装环境">
          <template #default="scope">
            <el-tooltip :content="scope.row.valueReinstall" placement="top" effect="light">
              <span class="highlight">{{ scope.row.valueReinstall }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="生产环境">
          <template #default="scope">
            <el-tooltip :content="scope.row.valueProd" placement="top" effect="light">
              <span class="highlight">{{ scope.row.valueProd }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="新值">
          <template #default="scope">
            <el-input v-model="scope.row.newValue" placeholder=""></el-input>
          </template>
        </el-table-column>

        <el-table-column label="变量描述">
          <template #default="scope">
            <el-tooltip :content="scope.row.description" placement="top" effect="light">
              <span class="highlight">{{ scope.row.description }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="确认标志" sortable>
          <template #default="scope">
            <el-tooltip :content="scope.row.verify" placement="top" effect="light">
              <span class="highlight">{{ verifyMap[scope.row.verify] }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" style="margin: 0 0 10px 10px;" @click="paramModify(scope.row)">修改</el-button>
            <el-button size="small" style="margin: 0 0 10px 10px;" @click="paramDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-col :span="24" style="margin-top: 5px; text-align: right;">
        <el-button type="primary" @click="confirmChange" color="#00B890">保存</el-button>
        <el-button type="primary" @click="resetSearch" color="#00B890">取消</el-button>
      </el-col>
    </div>
    <!--表格区域 end-->
  </el-card>

  <!-- 上传配置弹出框 start-->
  <el-dialog title="上传版本变量清单" v-model="uploadDialogVisible" width="25%">
    <el-form>
      <el-form-item label="文件路径">

        <el-row :gutter="10">
          <el-col :span="20">
            <el-input v-model="filePath" placeholder="请选择文件" style="width: 100%;" readonly></el-input>
          </el-col>

          <el-col :span="4">
            <el-button type="primary" @click="selectFile" color="#00B890" style="width: 49px;">
              <el-icon>
                <UploadFilled />
              </el-icon>
            </el-button>
            <input type="file" ref="fileInput" style="display: none;" @change="handleFileChange" />
          </el-col>
        </el-row>

      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpload" color="#00B890">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 上传配置弹出框 end -->

  <!-- 修改参数弹出框 start-->
  <el-dialog align-center v-model="editParamDialogFormVisible" width="42%" destroy-on-close>
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <el-icon size="26px">
          <EditPen />
        </el-icon>
        <h1 id="titleId">{{ editTitle }}</h1>
      </div>
    </template>
    <!--修改参数组件 start-->
    <ParamModify :paramInfo="paramInfo" :tableData="tableData" :updateTableData="updateTableData" @closeEditParamForm="closeEditParamForm" @success="success" />
    <!--修改参数组件 end-->
  </el-dialog>
  <!--修改参数弹出框 end -->
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { exportExcel } from "../../utils/exprotExcel"
import { uploadConfig, getParamInfoAll, getParamInfo, saveChecklist } from '../../api/param/paramInfo';

// 状态映射
const statusMap = {
  '0': '未启用',
  '1': '生效',
  '2': '作废'
}

// 标志映射
const verifyMap = {
  '0': '未确认',
  '1': '已确认'
}

// 修改参数弹窗状态
const editParamDialogFormVisible = ref(false)
const editTitle = ref('修改参数信息')

// 上传配置弹窗状态
const uploadDialogVisible = ref(false)
const filePath = ref('')
const fileInput = ref(null)
const selectedFile = ref(null)

// 上传代码地址弹窗状态
const uploadUrlDialogVisible = ref(false)
const codeUrl = ref('')

const state = reactive({
  // 搜索表单内容
  paramValue: '',
  // 表格全部信息
  tableData: [],
  // 当前点击的编辑信息
  paramInfo: null,
  // status: null,
  // total: 0, //总条数
  // pageSize: 10, //每页显示行数
  // pageIndex: 1, //当前页码
  loading: false, // 数据加载
  showTable: false, // 控制表格显示

})

// 获取参数列表数据
const params = {
  // 'pageIndex': state.pageIndex,
  // 'pageSize': state.pageSize,
  // 'status': state.status ==-1 ? '':state.status,
  'variableName': state.paramValue,
}
const loadData = async (state: any) => {
  state.loading = true
  // 先清空数据
  state.tableData = []

  const { data } = await getParamInfoAll()
  if (data.code !== 200) {
    ElNotification({
      type: 'error',
      title: '错误',
      message: data.msg,
    })
  } else {
    state.tableData = data.data
    state.loading = false
    state.showTable = true
  }

}

// 筛选未分类参数
const tableRowStatus = ({ row, rowIndex }) => {
  if (row.type1 === '其他' || row.type2 === '其他') {
    return 'danger-row';
  }
  if (row.status !== 1) {
    return 'warning-row';
  }

  return '';
}


// 验证参数并进行搜索
const validateAndSearch = () => {
  const variableNameRegex = /^[a-zA-Z0-9_.]{1,100}$/
  if (state.paramValue === '') {
    ElMessage({
      type: 'error',
      message: '请输入参数名称',
    })
  }
  else if (!variableNameRegex.test(state.paramValue) && state.paramValue !== '') {
    ElMessage({
      type: 'error',
      message: '参数名称不合法！（仅限字母、数字、小数点和下划线，长度不超过100个字符）',
    })
  } else {
    // state.pageIndex = 1
    // state.pageSize = 10
    search()
  }
}

// 搜索
const search = () => {
  if (state.paramValue !== null) {
    ElMessage({
      type: 'info',
      message: `参数: ${state.paramValue} 搜索内容如下`,
    })
    loadData(state)
  }
}

// 全部查询
const searchAll = () => {
  state.paramValue = ""
  loadData(state)
}

// 重置搜索
const resetSearch = () => {
  state.paramValue = ""
  state.showTable = false
  state.tableData = []
  // state.pageSize = 10 //每页显示行数
  // state.pageIndex = 1 //当前页码
  loadData(state)
}

// 提交表单回调函数
const success = () => {
  loadData(state);
  editParamDialogFormVisible.value = false
}

// 上传配置文件
const uploadFile = () => {
  uploadDialogVisible.value = true
}

const selectFile = () => {
  fileInput.value.click()
}

// 处理文件上传
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    filePath.value = file.name
    selectedFile.value = file
  }
}

// 确认上传配置文件
const confirmUpload = async () => {
  if (!selectedFile.value) {
    alert('请选择文件')
    return
  }

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const response = await uploadConfig(formData)
    console.log('文件上传成功', response)
    uploadDialogVisible.value = false

    selectedFile.value = null
    filePath.value = ''

    loadData(state) // 上传成功后重新查询
    ElMessage({
      type: 'success',
      message: '文件上传成功',
    })

  } catch (error) {
    console.error('文件上传失败', error)
    uploadDialogVisible.value = false
    selectedFile.value = null
    filePath.value = ''

    ElMessage({
      type: 'error',
      message: '文件上传失败',
    })

  }
}

// 参数信息
const paramInfo = ref({
  paramId: '',// 参数ID
  variableName: '',// 参数名称
  valueProd: '',// 参数值
  description: '',// 参数描述
  type1: '',// 一级分类
  type2: '',// 二级分类
  status: '',// 参数状态
  verify: '',// 确认标志
})

// 修改参数信息
const paramModify = async (row) => {
  editParamDialogFormVisible.value = true;

  paramInfo.value.paramId = row.paramId;
  paramInfo.value.variableName = row.variableName;
  paramInfo.value.valueProd = row.valueProd;
  paramInfo.value.description = row.description;
  paramInfo.value.type1 = row.type1;
  paramInfo.value.type2 = row.type2;
  paramInfo.value.status = row.status;
  paramInfo.value.verify = row.verify;
}

// 更新 tableData
const updateTableData = (paramId, updatedData) => {
  const index = state.tableData.findIndex(item => item.paramId === paramId);
  if (index !== -1) {
    state.tableData[index] = { ...updatedData };
  }
}

// 关闭修改参数弹出框
const closeEditParamForm = () => {
  editParamDialogFormVisible.value = false
  // 重置表单数据
  paramInfo.value = {
    paramId: '',// 参数ID
    variableName: '',// 参数名称
    valueProd: '',// 参数值
    description: '',// 参数描述
    type1: '',// 一级分类 
    type2: '',// 二级分类
    status: '',// 参数状态
    verify: '',// 确认标志
  }
}

// 确认删除参数信息
const paramDelete = (row) => {
  ElMessageBox.confirm(
    '此操作将删除该记录, 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 直接在tableData中删除对应的行
    const index = tableData.value.findIndex(item => item.paramId === row.paramId);
    if (index !== -1) {
      tableData.value.splice(index, 1);
      ElMessage({
        type: 'success',
        message: '删除成功!',
      });
    } else {
      ElMessage({
        type: 'error',
        message: '未找到对应记录',
      });
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除',
    });
  });
};


// 保存清单信息
const confirmChange = async () => {
  const params = {
    'data': state.tableData,
  }
  const { data } = await saveChecklist(params)
  if (data.code === 200) {
    ElMessage({
      type: 'success',
      message: '保存成功!',
    })
    loadData(state) // 保存成功后重新查询
    closeEditParamForm()
  } else {
    ElMessage({
      type: 'error',
      message: data.msg,
    })
  }
}

// 导出列表
const column = [
  {
    label: '一级分类',
    name: 'type1',
  },
  {
    label: '二级分类',
    name: 'type2',
  },
  {
    label: '参数状态',
    name: 'status',
  },
  {
    label: '命名空间',
    name: 'namespace',
  },
  {
    label: '参数名称',
    name: 'variableName',
  },
  {
    label: '功能环境',
    name: 'valueFunc',
  },
  {
    label: '回装环境',
    name: 'valueReinstall',
  },
  {
    label: '生产环境',
    name: 'valueProd',
  },
  {
    label: '参数描述',
    name: 'description',
  },
  {
    label: '确认标志',
    name: 'verify',
  },
]
// 导出excel
const exportExcelData = () => {
  exportExcel({
    column,
    data: state.tableData,
    filename: '参数分类信息',
    format: 'xlsx',
    autoWidth: true,
  })
}

// // 分页序号不乱
// const Nindex = (index) => {
//   // 当前页数 - 1 * 每页数据条数 + 1
//   const page = state.pageIndex // 当前页码
//   const pagesize = state.pageSize // 每页条数
//   return index + 1 + (page - 1) * pagesize
// }

// // 处理页大小变化
// const handleSizeChange = (newSize: number) => {
//   state.pageSize = newSize
//   loadData(state)
// }

// // 切换页面的执行事件，  val 当前页码
// const changePage = (val) => {
//   state.pageIndex = val;
//   loadData(state);
// }

//挂载后加载数据
onMounted(() => {

})

const { tableData, loading, paramValue, showTable } = toRefs(state)
</script>

<style scoped>
.card-header {
  display: flex;
  /* 弹性布局 */
  justify-content: space-between;
  /*内容对齐方式 */
  align-items: center;
  /*设置或检索弹性盒子元素在侧轴（纵轴）方向上的对齐方式*/
}

.card-header h3 {
  display: inline-flex;
  /*行内块元素*/
  justify-content: center;
  align-items: center;
}

:deep(.el-card__header) {
  border-bottom: 1px solid rgb(238 238 238);
  color: #484848;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.el-card {
  border-radius: 0px;
  border: none;
}

/*分页样式*/
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #484848;
}

.el-pagination {
  margin-top: 20px;
  justify-content: center;
}

/*新增用户弹出框自定义头部样式*/
.my-header {
  display: flex;
  justify-content: flex-start;
}

/*自定义按钮样式*/
.my-button {
  display: flex;
  justify-content: center;
}

/*修改v-loading样式*/
:deep(.el-loading-spinner .el-loading-text) {
  color: #484848;
}

:deep(.el-loading-spinner .path) {
  stroke: #484848;
}
</style>
