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
    <div class="table-box" v-if="showTable">
      <!-- <div class="table-box"> -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="参数状态">
            <el-select v-model="compareStatus" placeholder="请选择参数状态">
              <el-option label="未确认" value="0"></el-option>
              <el-option label="已确认" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

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
        <el-col :span="12" style="margin-bottom: 5px;">
          <!-- <el-input :prefix-icon="Search" v-model="searchValue" @keyup.enter="validateAndSearch"
            placeholder="查询参数（支持模糊查询）" style="width: 213px;" /> -->
          <!-- <el-button type="primary" @click="validateAndSearch" color="#00B890">查询</el-button> -->
          <el-button type="primary" @click="search" color="#00B890">查询</el-button>
          <el-button type="primary" @click="resetSearch" color="#00B890">重置</el-button>
        </el-col>
        <el-col :span="12" style="margin-bottom: 5px; text-align: right;">
          <el-button type="primary" @click="exportExcelData2" color="#00B890"
            style="width: 125px;">导出版本变量excel</el-button>
        </el-col>
      </el-row>
      <el-table element-loading-text="数据加载中..." v-loading="loading" ref="multipleTable" :data="tableData"
        style="width: 100%;text-align: center" :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange" :default-sort="{ prop: '', order: 'ascending' }"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ fontSize: '12px', background: '#484848', color: 'white', textAlign: 'center' }">

        <el-table-column type="selection" width="50" align="center" fixed></el-table-column>

        <el-table-column label="命名空间" prop="namespace" sortable>
        </el-table-column>

        <el-table-column label="参数名称" prop="parameterKey">
        </el-table-column>

        <el-table-column label="参数状态" prop="compareStatus" sortable>
        </el-table-column>

        <el-table-column label="相似公共变量" prop="similarValue" sortable>
        </el-table-column>

        <el-table-column label="公共变量命名空间" prop="allsimilarValue" sortable>
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
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElNotification, ElMessageBox, ElLoading } from 'element-plus'
import { exportExcel } from "../../utils/exprotExcel"
import { paramCheck, saveComparelist } from '../../api/param/paramCheck';


// 状态映射
const compareStatusMap = {
  0: '未确认',
  1: '已确认',
}

// 比对状态
const changeMap = {
  0: '正常',
  1: '新增',
  2: '自身有变更',
  3: '同类有变更',
  4: '未找到使用'
}

// 批量确认状态
const multipleSelection = []
const multipleTable = ref(null);

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
  compareStatus: null,
  namespace: null,
  parameterKey: null,
  // 表格全部信息
  tableData: [],
  // 临时表格
  tempTableData: [],
  // 当前点击的编辑信息
  // paramInfo: null,
  // compareStatus: null,
  // total: 0, //总条数
  // pageSize: 10, //每页显示行数
  // pageIndex: 1, //当前页码
  loading: false, // 数据加载
  showTable: false, // 控制表格显示

})

const theTable = [
  {
    namespace: 'application',
    parameterKey: 'ENV_REDIS_HOST',
    compareStatus: '疑似存在值相同公共变量',
    similarValue: 'ENV_REDIS_HOST',
    allsimilarValue: 'application'

  },
  {
    namespace: 'application',
    parameterKey: 'SWH_DATASOURCE_TYPE',
    compareStatus: '疑似存在值相同公共变量',
    similarValue: 'SWH_DATASOURCE_TYPE',
    allsimilarValue: 'application'

  },
  {
    namespace: 'application',
    parameterKey: 'ENV_REDIS_HOST',
    compareStatus: '疑似存在值相同公共变量',
    similarValue: 'ENV_REDIS_HOST',
    allsimilarValue: 'application'

  },
  {
    namespace: 'application',
    parameterKey: 'SWH_NEWBOS_FLAG',
    compareStatus: '疑似存在名相同公共变量',
    similarValue: 'SWH_NEWBOS_FLAG',
    allsimilarValue: 'application'
  }
]

const loadData = async () => {
  state.loading = true
  // 先清空数据
  state.tableData = []
  state.tempTableData = []
  // if (data.data) {
  //   state.tableData = data.data
  //   state.tempTableData = data.data
  // }
  state.tableData = theTable
  state.tempTableData = theTable
  state.loading = false
  state.showTable = true
}

// 比对状态
//   0: '正常',
//   1: '新增',
//   2: '自身有变更',
//   3: '同类有变更',
//   4: '未找到使用'
const tableRowClassName = ({ row, rowIndex }) => {
  if (row.compareStatus === '疑似存在值相同公共变量') {
    return 'self'
  }
  else if (row.compareStatus === '疑似存在名相同公共变量') {
    return 'same'
  } 
  return '';
}

const getChangeStatus = (status) => {
  if (status === 1) {
    return 'info'
  }
  else if (status === 2) {
    return 'danger'
  }
  else if (status === 3) {
    return 'danger'
  }
  else if (status === 4) {
    return 'warning'
  }
}

// 标识参数状态
const getStatusType = (status) => {
  if (status === 0) {
    return 'warning'
  }
  else if (status === 1) {
    return 'success'
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

  if (state.parentName !== null || state.categoryName !== null || state.compareStatus !== null || state.namespace !== null || state.parameterKey !== null) {

    ElMessage({
      type: 'info',
      message: '查询成功',
    })

    // 根据输入条件过滤数据
    const searchData = state.tableData.filter(item => {
      return (state.parentName === null || item.parentName.includes(state.parentName)) &&
        (state.categoryName === null || item.categoryName.includes(state.categoryName)) &&
        (state.compareStatus === null || item.compareStatus.toString() === state.compareStatus.toString()) &&
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
  state.compareStatus = null
  state.namespace = null
  state.parameterKey = null
  state.tableData = state.tempTableData
  // state.showTable = false
  // state.pageSize = 10 //每页显示行数
  // state.pageIndex = 1 //当前页码
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
    const response = await paramCheck(formData)


    // selectedFile.value = null
    filePath.value = ''
    if (response.data.code === 200) {
      ElMessage({
        type: 'success',
        message: '文件上传成功',
      })
      uploadDialogVisible.value = false
      loadData(response.data) // 上传成功后重新查询
    }
    else {
      ElMessage({
        type: 'error',
        message: response.data.msg,
      })
      filePath.value = ''
      uploadDialogVisible.value = false
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
    const index = tableData.value.findIndex(item => item.id === row.id);
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

// 处理多选框选中事件
const handleSelectionChange = (val) => {
  // 清空 multipleSelection 数组
  multipleSelection.splice(0, multipleSelection.length);

  // 遍历传入的 val 数组
  for (let i = 0; i < val.length; i++) {
    // 将 val 数组中每个元素添加到 multipleSelection 数组中
    multipleSelection.push(val[i]);
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
      const { data } = await saveComparelist(multipleSelection)
      if (data.code === 200) {
        ElMessage({
          type: 'success',
          message: '批量确认成功!',
        })

        // 修改对应行的参数状态
        for (let i = 0; i < multipleSelection.length; i++) {
          const index = state.tableData.findIndex(item => item.id === multipleSelection[i].id);
          if (index !== -1) {
            state.tableData[index].compareStatus = 1;
          }
        }

        // 修改对应行的生产环境
        // state.tableData[state.tableData.findIndex(item => item.id === row.id)].valueProd = row.newValue;
        for (let i = 0; i < multipleSelection.length; i++) {
          const index = state.tableData.findIndex(item => item.id === multipleSelection[i].id);
          if (index !== -1) {
            state.tableData[index].valueProd = multipleSelection[i].newValue;
          }
        }

        // 清空多选框
        multipleTable.value.clearSelection();

        // 更新tempTableData
        state.tempTableData[state.tempTableData.findIndex(item => item.id === row.id)].compareStatus = 1;

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

// 批量删除
const batchDelete = () => {
  if (multipleSelection.length === 0) {
    ElMessage({
      type: 'error',
      message: '请选择需要删除的参数',
    })
  }

  else {
    ElMessageBox.confirm(
      '此操作将删除所选参数, 是否继续?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      // 直接在tableData中删除对应的行
      for (let i = 0; i < multipleSelection.length; i++) {
        const index = state.tableData.findIndex(item => item.id === multipleSelection[i].id);
        if (index !== -1) {
          state.tableData.splice(index, 1);
        }
      }

      // 清空多选框
      multipleTable.value.clearSelection();

      // 更新tempTableData
      for (let i = 0; i < multipleSelection.length; i++) {
        const index = state.tempTableData.findIndex(item => item.id === multipleSelection[i].id);
        if (index !== -1) {
          state.tempTableData.splice(index, 1);
        }
      }

      ElMessage({
        type: 'success',
        message: '批量删除成功!',
      })
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
  }
}

// 单条确认
const singleComfirm = (row) => {
  if (row === null) {
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
      const singleSelection = []
      singleSelection.push(row)
      const { data } = await saveComparelist(singleSelection)
      if (data.code === 200) {
        ElMessage({
          type: 'success',
          message: '确认成功!',
        })

        // 修改对应行的参数状态
        state.tableData[state.tableData.findIndex(item => item.id === row.id)].compareStatus = 1;
        // 修改对应行的生产环境
        state.tableData[state.tableData.findIndex(item => item.id === row.id)].valueProd = row.newValue;

        // 清空该行的多选框
        // multipleTable.value.clearSelection();

        // 更新tempTableData
        state.tempTableData[state.tempTableData.findIndex(item => item.id === row.id)].compareStatus = 1;

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

// 比对信息表格
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
    name: 'compareStatus',
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
  {
    label: '比对状态',
    name: 'change',
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

// 导出比对信息excel
const exportExcelData1 = () => {
  exportExcel({
    column: column1,
    data: state.tableData,
    filename: '参数比对信息',
    format: 'xlsx',
    autoWidth: true,
  })
}

// 导出参数信息excel
const exportExcelData2 = () => {
  exportExcel({
    column: column2,
    data: state.tableData,
    filename: '版本变量清单',
    format: 'xlsx',
    autoWidth: true,
  })
}

//挂载后加载数据
onMounted(() => {

})

const { tableData, loading, searchValue, showTable, parentName, categoryName, compareStatus, namespace, parameterKey } = toRefs(state)
</script>

<style scoped>
/*标识参数状态*/
:deep(.el-table .add) {
  background: #f0f0f080;
}

:deep(.el-table .self) {
  background: #ffdc85;
}

:deep(.el-table .same) {
  background: #ff8888;
}

:deep(.el-table .not-found) {
  background: #ffc9a5;
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
