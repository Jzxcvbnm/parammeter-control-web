<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="10" style="margin-top: 10px;">
            <el-col span="6">
              <el-button type="primary" @click="uploadFile" color="#00B890">上传配置</el-button>
            </el-col>
            <el-col span="6">
              <el-button type="primary" @click="uploadUrl" color="#00B890">上传代码地址</el-button>
            </el-col>
          </el-row>
        </div>
        <!--搜索区域 end-->
      </div>
    </template>
    <!--头部 end-->
    <!--表格区域 start-->
    <!-- <div class="table-box" v-if="showTable"> -->
    <div class="table-box">
      <el-row :gutter="10">
        <el-col span="6" style="margin-bottom: 10px;">
          <el-input :prefix-icon="Search" v-model="paramValue" @keyup.enter="validateAndSearch"
            placeholder="查询参数（支持模糊查询）" style="width: 213px;" />
        </el-col>
        <el-col span="6" style="margin-bottom: 10px;">
          <el-button type="primary" @click="validateAndSearch" color="#00B890">查询</el-button>
          <el-button type="primary" @click="searchAll" color="#00B890">全部查询</el-button>
          <el-button type="primary" @click="resetSearch" color="#00B890">重置</el-button>
        </el-col>
      </el-row>
      <!-- <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData" -->
      <el-table element-loading-text="数据加载中..." v-loading="false" :data="tableData"
        style="width: 100%;text-align: center" :row-class-name="tableRowStatus"
        :default-sort="{ prop: 'Namespace_Name', order: 'ascending' }" :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ fontSize: '12px', background: '#484848', color: 'white', textAlign: 'center' }">

        <el-table-column label="namespace" prop="Namespace_Name" sortable>
          <template #default="scope">
            <el-tooltip :content="scope.row.Namespace_Name" placement="top" effect="light">
              <span class="highlight">{{ scope.row.Namespace_Name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="namespace类型">
          <template #default="scope">
            <el-tooltip :content="scope.row.Namespace_Type" placement="top" effect="light">
              <span class="highlight">{{ scope.row.Namespace_Type }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="变量名称">
          <template #default="scope">
            <el-tooltip :content="scope.row.Variable_Name" placement="top" effect="light">
              <span class="highlight">{{ scope.row.Variable_Name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="默认值">
          <template #default="scope">
            <el-tooltip :content="scope.row.Default_Value" placement="top" effect="light">
              <span class="highlight">{{ scope.row.Default_Value }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="变量描述">
          <template #default="scope">
            <el-tooltip :content="scope.row.Description" placement="top" effect="light">
              <span class="highlight">{{ scope.row.Description }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="一级分类" sortable>
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
              <span class="highlight">{{ scope.row.status }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="确认标志" sortable>
          <template #default="scope">
            <el-tooltip :content="scope.row.verify" placement="top" effect="light">
              <span class="highlight">{{ scope.row.verify }}</span>
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
    </div>
    <!--表格区域 end-->
  </el-card>

  <!-- 上传配置弹出框 start-->
  <el-dialog title="上传配置文件" v-model="uploadDialogVisible" width="25%">
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
    <ParamModify :paramInfo="paramInfo" @closeEditParamForm="closeEditParamForm" @success="success" />
    <!--修改参数组件 end-->
  </el-dialog>
  <!--修改参数弹出框 end -->
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { formatTime } from "../../utils/date"
import { uploadConfig, getParamInfoAll, getParamInfo, deleteParamInfo } from '../../api/paramClass/paramClass';
import ParamModify from './components/ParamModify.vue'


// 修改参数弹窗状态
const editParamDialogFormVisible = ref(false)
const editTitle = ref('修改参数信息')

// 上传配置弹窗状态
const uploadDialogVisible = ref(false)
const filePath = ref('')
const fileInput = ref(null)
const selectedFile = ref(null)

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

  codeUrl: '', // 代码地址
})

// 获取参数列表数据
const params = {
  // 'pageIndex': state.pageIndex,
  // 'pageSize': state.pageSize,
  // 'status': state.status ==-1 ? '':state.status,
  'Variable_Name': state.paramValue,
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
      duration: 0
    })
  } else {
    state.tableData = data.data.list
    state.total = data.data.totalCount
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
  const Variable_NameRegex = /^[a-zA-Z0-9_.]{1,100}$/
  if (state.paramValue === '') {
    ElMessage({
      type: 'error',
      message: '请输入参数名称',
    })
  }
  else if (!Variable_NameRegex.test(state.paramValue) && state.paramValue !== '') {
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
  } catch (error) {
    console.error('文件上传失败', error)
    uploadDialogVisible.value = false

    ElMessage({
      type: 'error',
      message: '文件上传失败',
    })

  }
}

// 上传代码地址
const uploadUrl = () => {

}

// 修改参数信息
const paramInfo = ref({
  paramId: '',// 参数ID
  Variable_Name: '',// 参数名称
  Default_Value: '',// 参数值
  Description: '',// 参数描述
  type1: '',// 一级分类
  type2: '',// 二级分类
  status: '',// 参数状态
  verify: '',// 确认标志
})
const paramModify = async (row) => {
  editParamDialogFormVisible.value = true;

  paramInfo.value.paramId = row.paramId;
  paramInfo.value.Variable_Name = row.Variable_Name;
  paramInfo.value.Default_Value = row.Default_Value;
  paramInfo.value.Description = row.Description;
  paramInfo.value.type1 = row.type1;
  paramInfo.value.type2 = row.type2;
  paramInfo.value.status = row.status;
  paramInfo.value.verify = row.verify;
}

// 关闭修改用户弹出框
const closeEditParamForm = () => {
  editParamDialogFormVisible.value = false
}

// 确认删除用户权限
const paramDelete = (row) => {
  ElMessageBox.confirm(
    '此操作将删除该参数, 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    const params = {
      'paramId': row.paramId,
    }
    const { data } = await deleteParamInfo(params)
    if (data.code === 200) {
      ElMessage({
        type: 'success',
        message: '删除成功!',
      })
      loadData(state) // 删除成功后重新查询
    } else {
      ElMessage({
        type: 'error',
        message: data.msg,
      })
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除',
    })
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
  loadData(state)
})

const { tableData, loading, paramValue, showTable, codeUrl } = toRefs(state)
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
</style>./components/ParamModify.vue
