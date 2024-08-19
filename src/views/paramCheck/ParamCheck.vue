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
          <el-input :prefix-icon="Search" v-model="searchValue" @keyup.enter="validateAndSearch"
            placeholder="查询参数（支持模糊查询）" style="width: 213px;" />

          <el-button type="primary" @click="validateAndSearch" color="#00B890">查询</el-button>
          <el-button type="primary" @click="resetSearch" color="#00B890">重置</el-button>
        </el-col>
        <el-col :span="12" style="margin-bottom: 5px; text-align: right;">
          <el-button type="primary" @click="batchConfirm" color="#00B890" style="width: 125px;">批量保存</el-button>
          <el-button type="primary" @click="exportExcelData" color="#00B890" style="width: 125px;">导出excel文件</el-button>
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

        <el-table-column label="参数状态" prop="compareStatus" sortable>
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.compareStatus)">
              {{ compareStatusMap[scope.row.compareStatus] }}
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

        <el-table-column label="功能环境" prop="valueFunc">
          <template #default="scope">
            <el-tooltip :content="scope.row.valueFunc" placement="top" effect="light">
              <span class="highlight">{{ scope.row.valueFunc }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="回装环境" prop="valueReinstall">
          <template #default="scope">
            <el-tooltip :content="scope.row.valueReinstall" placement="top" effect="light">
              <span class="highlight">{{ scope.row.valueReinstall }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="生产环境" prop="valueProd">
          <template #default="scope">
            <el-tooltip :content="scope.row.valueProd" placement="top" effect="light">
              <span class="highlight">{{ scope.row.valueProd }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="生产更新">
          <template #default="scope">
            <el-tooltip :content="scope.row.newValue" placement="top" effect="light">
              <el-input v-model="scope.row.newValue" placeholder=""></el-input>
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

        <el-table-column label="比对状态" prop="change" sortable>
          <template #default="scope">
            <el-tag :type="getChangeStatus(scope.row.change)">
              {{ changeMap[scope.row.change] }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button size="small" style="margin: 0 0 10px 10px;" @click="paramDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--表格区域 end-->
  </el-card>

  <!-- 上传配置弹出框 start-->
  <el-dialog title="上传配置文件" v-model="uploadDialogVisible" width="25%" destroy-on-close
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
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { exportExcel } from "../../utils/exprotExcel"
import { paramCheck, saveComparelist } from '../../api/param/paramCheck';


// 状态映射
const compareStatusMap = {
  '0': '未确认',
  '1': '已确认',
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
  searchValue: '',
  // 表格全部信息
  tableData: [],
  // 当前点击的编辑信息
  // paramInfo: null,
  // compareStatus: null,
  // total: 0, //总条数
  // pageSize: 10, //每页显示行数
  // pageIndex: 1, //当前页码
  loading: false, // 数据加载
  showTable: false, // 控制表格显示

})

const loadData = async (data) => {
  state.loading = true
  // 先清空数据
  state.tableData = []
  if (data.data) {
    state.tableData = data.data
  }
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
  if (row.change === 1) {
    return 'add'
  }
  else if (row.change === 2) {
    return 'self'
  }
  else if (row.change === 3) {
    return 'same'
  }
  else if (row.change === 4) {
    return 'not-found'
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
const validateAndSearch = () => {
  const variableNameRegex = /^[a-zA-Z0-9_.\u4e00-\u9fa5]{1,150}$/

  if (state.searchValue === '') {
    ElMessage({
      type: 'error',
      message: '请输入参数名称',
    })
  } else if (!variableNameRegex.test(state.searchValue) && state.searchValue !== '') {
    ElMessage({
      type: 'error',
      message: '参数名称不合法！（仅限字母、数字、小数点、下划线和中文字符，长度不超过150个字符）',
    })
  } else {
    search()
  }
}


// 搜索
const search = () => {
  if (state.searchValue !== null) {
    ElMessage({
      type: 'info',
      message: `参数: ${state.searchValue} 搜索内容如下`,
    })

    // 创建忽略大小写的正则表达式
    const regex = new RegExp(state.searchValue, 'i');

    // 使用正则表达式进行多字段查询
    const searchData = state.tableData.filter(item => {
      return regex.test(item.parameterKey) ||  // 参数名称
        regex.test(item.namespace) ||  // 命名空间
        regex.test(item.parentName) ||  // 一级分类
        regex.test(item.categoryName) ||  // 二级分类
        regex.test(item.compareStatus) ||  // 参数状态
        regex.test(item.change);  // 确认状态
    })

    state.tableData = searchData;
  }
}

// 重置搜索
const resetSearch = () => {
  state.searchValue = ""
  state.showTable = false
  state.tableData = []
  // state.pageSize = 10 //每页显示行数
  // state.pageIndex = 1 //当前页码
  loadData(state)
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

  try {
    const response = await paramCheck(formData)
    uploadDialogVisible.value = false

    // selectedFile.value = null
    filePath.value = ''
    if (response.data.code === 200) {
      ElMessage({
        type: 'success',
        message: '文件上传成功',
      })
      loadData(response.data) // 上传成功后重新查询
    }
    else {
      ElMessage({
        type: 'error',
        message: response.data.msg,

      })
    }

  } catch (error) {
    console.error('文件上传失败', error)
    uploadDialogVisible.value = false
    // selectedFile.value = null
    filePath.value = ''

    ElMessage({
      type: 'error',
      message: '文件上传失败',
    })
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

// 导出列表
const column = [
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
    label: '参数名称',
    name: 'parameterKey',
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
    label: '比对状态',
    name: 'change',
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

//挂载后加载数据
onMounted(() => {

})

const { tableData, loading, searchValue, showTable } = toRefs(state)
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
