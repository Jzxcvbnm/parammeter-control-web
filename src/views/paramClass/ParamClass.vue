<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <div class="card-search">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-button type="primary" @click="uploadFile" color="#00B890">上传配置</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </template>
    <!--头部 end-->
    <!--表格区域 start-->
    <div class="table-box" v-if="showTable">
      <!-- <div class="table-box"> -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="一级分类">
            <el-input v-model="parentName" placeholder="请输入一级分类"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="二级分类">
            <el-input v-model="categoryName" placeholder="请输入二级分类"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="参数状态">
            <el-select v-model="useStatus" placeholder="请选择参数状态">
              <el-option label="已启用" value="0"></el-option>
              <el-option label="未启用" value="1"></el-option>
              <el-option label="已作废" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="命名空间">
            <el-input v-model="namespace" placeholder="请输入命名空间"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="参数名称">
            <el-input v-model="parameterKey" placeholder="请输入参数名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <!-- <el-col :span="12" style="margin-bottom: 5px;">
          <el-input :prefix-icon="Search" v-model="searchValue" @keyup.enter="validateAndSearch"
            placeholder="查询参数（支持模糊查询）" style="width: 213px;" />
          <el-button type="primary" @click="validateAndSearch" color="#00B890">查询</el-button>
        </el-col> -->
        <el-col :span="8" style="margin-bottom: 5px;">
          <el-button type="primary" @click="search" color="#00B890">查询</el-button>
          <el-button type="primary" @click="resetSearch" color="#00B890">重置</el-button>
        </el-col>
        <el-col :span="16" style="margin-bottom: 5px; text-align: right;">
          <el-button type="primary" @click="paramAdd" color="#00B890" style="width: 125px;">添加参数</el-button>
          <el-button type="primary" @click="batchEnable" color="#00B890" style="width: 125px;">批量启用</el-button>
          <el-button type="primary" @click="batchConfirm" color="#00B890" style="width: 125px;">批量确认</el-button>
          <!-- <el-button type="primary" @click="batchDelete" color="#00B890" style="width: 125px;">批量删除</el-button> -->
          <el-button type="primary" @click="exportExcelData1" color="#00B890"
            style="width: 125px;">导出分类信息excel</el-button>
          <el-button type="primary" @click="exportExcelData2" color="#00B890"
            style="width: 125px;">导出参数配置excel</el-button>
        </el-col>
      </el-row>
      <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
        style="width: 100%;text-align: center" :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange" :default-sort="{ prop: '', order: 'ascending' }"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ fontSize: '12px', background: '#484848', color: 'white', textAlign: 'center' }">

        <el-table-column type="selection" width="50" align="center" fixed></el-table-column>

        <el-table-column label="一级分类" prop="parentName" sortable>
        </el-table-column>

        <el-table-column label="二级分类" prop="categoryName" sortable>
        </el-table-column>

        <el-table-column label="参数状态" prop="useStatus" sortable>
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.useStatus)">
              {{ useStatusMap[scope.row.useStatus] }}
            </el-tag>
          </template>
        </el-table-column>


        <el-table-column label="命名空间" prop="namespace" sortable>
        </el-table-column>

        <el-table-column label="参数名称" prop="parameterKey">
          <template #default="scope">
            <el-tooltip :content="scope.row.parameterKey" placement="top" effect="light">
              <span class="highlight">{{ scope.row.parameterKey }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="参数描述" prop="description">
          <template #default="scope">
            <el-tooltip :content="scope.row.description" placement="top" effect="light">
              <span class="highlight">{{ scope.row.description }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="确认状态" prop="categoryStatus" sortable>
          <template #default="scope">
            <el-tag :type="getCheckStatus(scope.row.categoryStatus)">
              {{ categoryStatusMap[scope.row.categoryStatus] }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" style="margin: 0 0 10px 10px;" @click="paramModify(scope.row)">修改</el-button>
            <el-button size="small" style="margin: 0 0 10px 10px;" @click="paramDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <!--表格区域 end-->
  </el-card>

  <!-- 上传配置弹出框 start-->
  <el-dialog title="上传配置文件" v-model="uploadDialogVisible" width="30%" destroy-on-close
    :before-close="cancelUploadConfig">
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
        <el-button @click="cancelUploadConfig">取消</el-button>
        <el-button type="primary" @click="confirmUpload" color="#00B890">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 上传配置弹出框 end -->

  <!-- 修改参数弹出框 start-->
  <el-dialog align-center v-model="editParamDialogFormVisible" width="42%" destroy-on-close
    :before-close="closeEditParamForm">
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

  <!-- 添加参数弹出框 start-->
  <el-dialog align-center v-model="addParamDialogFormVisible" width="42%" destroy-on-close
    :before-close="closeAddParamForm">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <el-icon size="26px">
          <EditPen />
        </el-icon>
        <h1 id="titleId">{{ addTitle }}</h1>
      </div>
    </template>
    <!--添加参数组件 start-->
    <ParamAdd :paramInfo="paramInfo" @closeAddParamForm="closeAddParamForm" @success="success" />
    <!--添加参数组件 end-->
  </el-dialog>
  <!-- 添加参数弹出框 end -->
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElNotification, ElMessageBox, ElLoading } from 'element-plus'
import { exportExcel } from "../../utils/exprotExcel"
import { uploadConfig, getParamInfoAll, deleteParamInfo, saveChecklist, deleteChecklist, enableChecklist } from '../../api/param/paramInfo';
import { getTypeTree } from '../../api/rule/ruleMaintenance';
import ParamModify from './components/ParamModify.vue'
import ParamAdd from './components/ParamAdd.vue'


// 状态映射
const useStatusMap = {
  0: '已启用',
  1: '未启用',
  2: '已作废',
}

// 确认状态映射
const categoryStatusMap = {
  0: '推荐分类',
  1: '已确认',
  2: '未找到分类',
  3: '未找到使用',
}

// 批量确认状态
const multipleSelection = []

// 修改参数弹窗状态
const editParamDialogFormVisible = ref(false)
const editTitle = ref('修改参数信息')

// 添加参数弹窗状态
const addParamDialogFormVisible = ref(false)
const addTitle = ref('添加参数信息')

// 上传配置弹窗状态
const uploadDialogVisible = ref(false)
const filePath = ref('')
const fileInput = ref(null)
const selectedFile = ref(null)


const state = reactive({
  // 搜索表单内容
  searchValue: null,
  parentName: null,
  categoryName: null,
  useStatus: null,
  namespace: null,
  parameterKey: null,
  // 表格全部信息
  tableData: [],
  // 临时表格
  tempTableData: [],
  // 当前点击的编辑信息
  // paramInfo: null,
  // useStatus: null,
  // total: 0, //总条数
  // pageSize: 10, //每页显示行数
  // pageIndex: 1, //当前页码
  loading: false, // 数据加载
  showTable: false, // 控制表格显示

})

const loadData = async (state: any) => {
  state.loading = true
  // 先清空数据
  state.tableData = []
  state.tempTableData = []

  const { data } = await getParamInfoAll()
  if (data.code !== 200) {
    ElMessage({
      type: 'error',
      message: '数据加载失败',
    })
  } else {
    ElMessage({
      type: 'success',
      message: '数据加载成功',
    })
    state.tableData = data.data
    state.tempTableData = data.data
    state.loading = false
    state.showTable = true
  }

}

// 标识确认状态
//   0: '推荐分类',
//   1: '已确认',
//   2: '未找到分类',
//   3: '未找到使用',
const tableRowClassName = ({ row, rowIndex }) => {
  if (row.categoryStatus === 0) {
    return 'info-row'
  } else if (row.categoryStatus === 2) {
    return 'danger-row'
  } else if (row.categoryStatus === 3) {
    return 'warning-row'
  }
  return '';
}

const getCheckStatus = (status) => {
  if (status === 0) {
    return 'info'
  }
  else if (status === 1) {
    return 'success'
  }
  else if (status === 2) {
    return 'danger'
  }
  else if (status === 3) {
    return 'danger'
  }
}

// 标识参数状态
const getStatusType = (status) => {
  if (status === 0) {
    return 'success'
  }
  else if (status === 1) {
    return 'info'
  }
  else if (status === 2) {
    return 'danger'
  }
}

// 验证参数并进行搜索
// const validateAndSearch = () => {
//   const variableNameRegex = /^[a-zA-Z0-9_.\u4e00-\u9fa5]{1,150}$/

//   if (state.searchValue === '') {
//     ElMessage({
//       type: 'error',
//       message: '请输入参数名称',
//     })
//   } else if (!variableNameRegex.test(state.searchValue) && state.searchValue !== '') {
//     ElMessage({
//       type: 'error',
//       message: '参数名称不合法！（仅限字母、数字、小数点、下划线和中文字符，长度不超过150个字符）',
//     })
//   } else {
//     search()
//   }
// }


// 搜索
const search = () => {
  // 使用完整表格查询
  state.tableData = state.tempTableData

  if (state.parentName !== null || state.categoryName !== null || state.useStatus !== null || state.namespace !== null || state.parameterKey !== null) {

    ElMessage({
      type: 'info',
      message: '查询成功',
    })

    // 根据输入条件过滤数据
    const searchData = state.tableData.filter(item => {
      return (state.parentName === null || item.parentName.includes(state.parentName)) &&
        (state.categoryName === null || item.categoryName.includes(state.categoryName)) &&
        (state.useStatus === null || item.useStatus.toString() === state.useStatus.toString()) &&
        (state.namespace === null || item.namespace.includes(state.namespace)) &&
        (state.parameterKey === null || item.parameterKey.includes(state.parameterKey))
    })

    state.tableData = searchData;
  }
  else {
    ElMessage({
      type: 'info',
      message: `请输入搜索内容`,
    })
  }

}

// 重置搜索
const resetSearch = () => {
  // state.searchValue = ""
  state.parentName = null
  state.categoryName = null
  state.useStatus = null
  state.namespace = null
  state.parameterKey = null
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
  addParamDialogFormVisible.value = false
}

// 上传配置文件
const uploadFile = () => {
  uploadDialogVisible.value = true
}

// 选择文件
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

  // 显示加载状态
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '上传中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  try {
    const response = await uploadConfig(formData)
    // selectedFile.value = null
    filePath.value = ''
    if (response.data.code === 200) {
      ElMessage({
        type: 'success',
        message: '文件上传成功',
      })
      uploadDialogVisible.value = false
      loadData(state) // 上传成功后重新查询
    }
    else {
      ElMessage({
        type: 'error',
        message: response.data.msg,
      })
      uploadDialogVisible.value = false
      filePath.value = ''
    }

  } catch (error) {
    console.error('文件上传失败', error)
    uploadDialogVisible.value = false
    filePath.value = ''

    ElMessage({
      type: 'error',
      message: '文件上传失败',
    })
  } finally {
    loadingInstance.close()
  }
}

// 取消上传配置文件
const cancelUploadConfig = () => {
  uploadDialogVisible.value = false
  selectedFile.value = null
  filePath.value = ''
}

// 参数信息
const paramInfo = ref({
  id: null,// 参数ID
  namespace: null,// 命名空间
  parameterKey: null,// 参数名称
  valueProd: null,// 生产环境参数值
  valueReinstall: null,// 回装环境参数值
  valueFunc: null,//, // 功能环境参数值
  description: null,// 参数描述
  type1: null,// 一级分类
  type2: null,// 二级分类
  useStatus: null,// 参数状态
  categoryStatus: null,// 确认状态
})

// 修改参数信息
const paramModify = async (row) => {
  editParamDialogFormVisible.value = true;

  paramInfo.value.id = row.id;
  paramInfo.value.parameterKey = row.parameterKey;
  // paramInfo.value.valueProd = row.valueProd;
  // paramInfo.value.valueReinstall = row.valueReinstall;
  // paramInfo.value.valueFunc = row.valueFunc;
  paramInfo.value.description = row.description;
  paramInfo.value.type1 = row.type1;
  paramInfo.value.type2 = row.type2;
  paramInfo.value.useStatus = row.useStatus;
  // paramInfo.value.categoryStatus = row.categoryStatus;
}

// 关闭修改参数弹出框
const closeEditParamForm = () => {
  editParamDialogFormVisible.value = false
  // 重置表单数据
  paramInfo.value = {
    id: null,// 参数ID
    namespace: null,// 命名空间
    parameterKey: null,// 参数名称
    valueProd: null,// 生产环境参数值
    valueReinstall: null,// 回装环境参数值
    valueFunc: null,// 功能环境参数值
    description: null,// 参数描述
    type1: null,// 一级分类
    type2: null,// 二级分类
    useStatus: null,// 参数状态
    categoryStatus: null,// 确认状态
  }
}

// 添加参数信息
const paramAdd = () => {
  addParamDialogFormVisible.value = true;
}

// 关闭添加参数弹出框
const closeAddParamForm = () => {
  addParamDialogFormVisible.value = false
  // 重置表单数据
  paramInfo.value = {
    id: null,// 参数ID
    namespace: null,// 命名空间
    parameterKey: null,// 参数名称
    valueProd: null,// 生产环境参数值
    valueReinstall: null,// 回装环境参数值
    valueFunc: null,// 功能环境参数值
    description: null,// 参数描述
    type1: null,// 一级分类
    type2: null,// 二级分类
    useStatus: null,// 参数状态
    categoryStatus: null,// 确认状态
  }
}

// 确认删除参数信息
const paramDelete = (id) => {
  ElMessageBox.confirm(
    '此操作将删除该参数, 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    const { data } = await deleteParamInfo(id)
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

// 处理多选框选中事件
const handleSelectionChange = (val) => {
  // 清空 multipleSelection 数组
  multipleSelection.splice(0, multipleSelection.length);

  // 遍历传入的 val 数组
  for (let i = 0; i < val.length; i++) {
    // 将 val 数组中每个元素的 id 添加到 multipleSelection 数组中
    multipleSelection.push(val[i].id);
  }
};


// 批量确认
const batchConfirm = () => {
  if (multipleSelection.length === 0) {
    ElMessage({
      type: 'error',
      message: '请选择需要确认的参数',
    })
  }

  else {
    ElMessageBox.confirm(
      '此操作将确认所选参数, 是否继续?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(async () => {
      const { data } = await saveChecklist(multipleSelection)
      if (data.code === 200) {
        ElMessage({
          type: 'success',
          message: '批量确认成功!',
        })
        loadData(state) // 确认成功后重新查询
      } else {
        ElMessage({
          type: 'error',
          message: data.msg,
        })
      }
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消确认',
      })
    })
  }
}

// 批量启用
const batchEnable = () => {
  if (multipleSelection.length === 0) {
    ElMessage({
      type: 'error',
      message: '请选择需要启用的参数',
    })
  }

  else {
    ElMessageBox.confirm(
      '此操作将启用所选参数, 是否继续?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(async () => {
      const { data } = await enableChecklist(multipleSelection)
      if (data.code === 200) {
        ElMessage({
          type: 'success',
          message: '批量启用成功!',
        })
        loadData(state) // 启用成功后重新查询
      } else {
        ElMessage({
          type: 'error',
          message: data.msg,
        })
      }
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消启用',
      })
    })
  }
}

// 批量删除
// const batchDelete = () => {
//   if (multipleSelection.length === 0) {
//     ElMessage({
//       type: 'error',
//       message: '请选择需要删除的参数',
//     })
//   }

//   else {
//     ElMessageBox.confirm(
//       '此操作将删除所选参数, 是否继续?',
//       '提示',
//       {
//         confirmButtonText: '确定',
//         cancelButtonText: '取消',
//         type: 'warning',
//       }
//     ).then(async () => {
//       const { data } = await deleteChecklist(multipleSelection)
//       if (data.code === 200) {
//         ElMessage({
//           type: 'success',
//           message: '批量删除成功!',
//         })
//         loadData(state) // 删除成功后重新查询
//       } else {
//         ElMessage({
//           type: 'error',
//           message: data.msg,
//         })
//       }
//     }).catch(() => {
//       ElMessage({
//         type: 'info',
//         message: '已取消删除',
//       })
//     })
//   }
// }

// 分类信息表格
const column1 = [
  {
    label: '一级分类',
    name: 'parentName',
  },
  {
    label: '二级分类',
    name: 'categoryName',
  },
  {
    label: '参数状态',
    name: 'useStatus',
  },
  {
    label: '命名空间',
    name: 'namespace',
  },
  {
    label: '参数变量名',
    name: 'parameterKey',
  },
  {
    label: '变量描述',
    name: 'description',
  },
  {
    label: '确认状态',
    name: 'categoryStatus',
  },
]

// 参数信息表格
const column2 = [
  {
    label: '命名空间',
    name: 'namespace',
  },
  {
    label: '参数变量名',
    name: 'parameterKey',
  },
  {
    label: '参数值(功能环境)',
    name: 'valueFunc',
  },
  {
    label: '参数值(回装环境)',
    name: 'valueReinstall',
  },
  {
    label: '参数值(生产环境)',
    name: 'valueProd',
  },

  {
    label: '变量描述',
    name: 'description',
  },
]

// 导出分类信息excel
const exportExcelData1 = () => {
  exportExcel({
    column: column1,
    data: state.tableData,
    filename: '参数分类信息',
    format: 'xlsx',
    autoWidth: true,
  })
}

// 导出参数信息excel
const exportExcelData2 = () => {
  exportExcel({
    column: column2,
    data: state.tableData,
    filename: '参数配置信息',
    format: 'xlsx',
    autoWidth: true,
  })
}

//挂载后加载数据
onMounted(() => {
  loadData(state)
})

const { tableData, loading, searchValue, parentName, categoryName, useStatus, namespace, parameterKey, showTable } = toRefs(state)
</script>

<style scoped>
/*标识参数状态*/
:deep(.el-table .info-row) {
  background: #f0f0f080;
}

:deep(.el-table .warning-row) {
  background: #ffdc85;
}

:deep(.el-table .danger-row) {
  background: #ff8888;
}

:deep(.el-table .success-row) {
  background: #c5ffa5;
}

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
