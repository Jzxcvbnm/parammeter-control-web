<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px;">
            <UserFilled />
          </el-icon>添加用户权限
        </h3>

        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="10" justify="end">
            <el-col :span="12">
              <el-input :prefix-icon="Search" v-model="userId" @keyup.enter="validateAndSearch" placeholder="请输入用户ID" />
            </el-col>
            <el-col :span="7.5">
              <el-button type="primary" @click="validateAndSearch" color="#0554af">查询</el-button>
            </el-col>
            <el-col :span="4.5">
              <el-button type="primary" @click="resetSearch" color="#0554af">重置</el-button>
            </el-col>
          </el-row>
        </div>
        <!--搜索区域 end-->
      </div>
    </template>
    <!--头部 end-->

    <!--表格区域 start-->
    <div class="table-box" v-if="showTable">

      <div class="card-footer">
        <el-row :gutter="10">
          <el-col>
            <el-button type="primary" @click="authAdd" color="#0554af">添加权限</el-button>
          </el-col>
        </el-row>
      </div>

      <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
        style="width: 100%; text-align: center" :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ fontSize: '15px', background: '#124a89', color: 'white', textAlign: 'center' }">

        <el-table-column label="序号" width="100" type="index" :index="Nindex" />

        <el-table-column label="用户ID">
          <template #default="scope">
            <el-tooltip :content="scope.row.userId" placement="top" effect="light">
              <span class="highlight">{{ scope.row.userId }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="用户姓名">
          <template #default="scope">
            <el-tooltip :content="scope.row.userName" placement="top" effect="light">
              <span class="highlight">{{ scope.row.userName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="权限">
          <template #default="scope">
            <el-tooltip :content="getAuthNameById(scope.row.authId)" placement="top" effect="light">
              <span class="highlight">{{ getAuthNameById(scope.row.authId) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>

      <!--分页 start-->
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
        v-model:page-size="pageSize" @size-change="handleSizeChange" @current-change="changePage"
        :page-sizes="[10, 20, 30, 40]" />
      <!--分页 end-->
    </div>
    <!--表格区域 end-->

  </el-card>

  <!-- 添加权限弹出框 start-->
  <el-dialog align-center v-model="addAuthDialogFormVisible" width="42%" destroy-on-close>
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <el-icon size="26px">
          <EditPen />
        </el-icon>
        <h1 id="titleId">{{ addTitle }}</h1>
      </div>
    </template>
    <!--添加权限组件 start-->
    <AuthAdd :userAuth="userAuth" @closeAddUserForm="closeAddUserForm" @success="success" />
    <!--添加权限组件 end-->
  </el-dialog>
  <!--添加权限弹出框 end -->
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs, watch, ref } from 'vue'
import { Search, Refresh, EditPen } from '@element-plus/icons-vue'

// import { gql, useQuery } from 'vue-apollo'

import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { getUserAuthApi, getApolloApi } from "../../api/userAuth/userAuth"
import AuthAdd from './components/AuthAdd.vue'
import { useUserStore } from "../../store/modules/user"
import { ta } from 'element-plus/es/locale'

const userStore = useUserStore()
// 添加用户弹窗状态
const addAuthDialogFormVisible = ref(false)
const addTitle = ref('添加权限信息')

const state = reactive({
  // 搜索表单内容
  userId: "",
  // 表格全部信息
  tableData: [],

  userAuthList: [], // 所需添加权限的用户已有的权限列表
  total: 0, //总条数
  pageSize: 10, //每页显示行数
  pageIndex: 1, //当前页码
  loading: false, // 数据加载
  showTable: false, // 控制表格显示
})

// 获取权限列表数据
const loadData = async (state: any) => {
  state.loading = true
  // 先清空数据
  state.tableData = []
  state.userAuthList = []
  state.showTable = false // 控制表格显示
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    'userId': state.userId
  }

  const { data } = await getUserAuthApi(params)
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
    for (let i = 0; i < state.total; i++) {
      state.userAuthList.push(state.tableData[i].authId)
    }
    state.loading = false
    state.showTable = true
  }
}

// 分页序号不乱
const Nindex = (index) => {
  // 当前页数 - 1 * 每页数据条数 + 1
  const page = state.pageIndex // 当前页码
  const pagesize = state.pageSize // 每页条数
  return index + 1 + (page - 1) * pagesize
}

// 处理页大小变化
const handleSizeChange = (newSize: number) => {
  state.pageSize = newSize
  loadData(state)
}

// 切换页面的执行事件，  val 当前页码
const changePage = (val) => {
  state.pageIndex = val;
  loadData(state);
}

// 提交表单回调函数
const success = () => {
  loadData(state);
  addAuthDialogFormVisible.value = false
}

// 添加用户权限
const userAuth = ref({
  userId: '',// 用户ID
  operatorId: '',// 操作人ID
  userAuthList: [],// 用户已有的权限列表
  authOptions: <object[]>([])// 权限下拉选择项
})

// 打开添加用户弹出框
const authAdd = async () => {
  addAuthDialogFormVisible.value = true;

  userAuth.value.operatorId = userStore.userInfo.userId;
  userAuth.value.userAuthList = state.userAuthList;
  userAuth.value.userId = state.userId;
  userAuth.value.authOptions = authOptions.value;
}

// 关闭添加用户弹出框
const closeAddUserForm = () => {
  addAuthDialogFormVisible.value = false
}

// 验证用户ID并进行搜索
const validateAndSearch = () => {
  const userIdRegex = /^GHCD\d{5}$/
  let userIdValid = userIdRegex.test(state.userId)

  if (!state.userId) {
    ElMessage({
      type: 'error',
      message: '请填写用户ID',
    })
  } else if (!userIdValid) {
    ElMessage({
      type: 'error',
      message: '用户ID格式不正确，必须以GHCD开头，且最后一位为数字，总长度为9位',
    })
  } else {
    search()
  }
}

// 搜索
const search = () => {
  if (state.userId !== "") {
    ElMessage({
      type: 'info',
      message: `用户ID: ${state.userId} 搜索内容如下`,
    })
    state.pageIndex = 1
    state.pageSize = 10
    loadData(state)
  }
}

// 重置搜索
const resetSearch = () => {
  state.userId = ""
  // state.authId = ""
  state.showTable = false
  state.tableData = []
  state.pageSize = 10 //每页显示行数
  state.pageIndex = 1 //当前页码
}

// // 定义权限下拉选择项
// const authOptions = ref<object[]>([])

// // 定义 GraphQL 查询
// const GET_AUTH_DICT = gql`
//   query GetAuthDict {
//     application(appId: "parameter-governance-web") {
//       configurations(key: "auth_dict")
//     }
//   }
// `

// // 获取所有权限列表
// const getAllAuthList = async () => {
//   try {
//     const { loading, error, data } = useQuery(GET_AUTH_DICT);
//     if (error) {
//       ElNotification({
//         type: 'error',
//         title: '错误',
//         message: '获取权限列表失败，请重试',
//         duration: 0
//       });
//       return;
//     }
//     if (data) {
//       authOptions.value = JSON.parse(data.application.configurations).map(item => ({
//         id: item.id,
//         rank: item.rank
//       }));
//     }
//   } catch (error) {
//     ElNotification({
//       type: 'error',
//       title: '错误',
//       message: '获取权限列表失败，请重试',
//       duration: 0
//     });
//   }
// };

// // 根据权限ID获取权限名称
// const getAuthNameById = (authId: number) => {
//   const auth = authOptions.value.find(option => option.id === authId)
//   return auth ? auth.rank : ''
// }

// 定义权限下拉选择项
const authOptions = ref<{ id: number, rank: string }[]>([])
const clusterName = 'default'
const namespaceName = 'web-client'

// 获取所有权限列表
const getAllAuthList = async () => {
  try {
    const { data } = await getApolloApi(clusterName, namespaceName)
    if (data.configurations.PermissionDict) {
      authOptions.value = JSON.parse(data.configurations.PermissionDict)
      console.log('权限列表:', authOptions.value)
    } else {
      ElMessage.error('获取权限列表失败，请重试')
      console.error('获取权限列表失败')
    }
  } catch (error) {
    ElMessage.error('获取权限列表失败，请重试')
    console.error('获取权限列表失败:', error)
  }
}

const getAuthNameById = (authId: number) => {
  const auth = authOptions.value.find(option => option.id === authId)
  return auth ? auth.rank : ''
}

// 挂载后加载数据
onMounted(() => {
  getAllAuthList()
})

const { tableData, pageIndex, pageSize, loading, total, userId, showTable } = toRefs(state)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.card-footer {
  margin-bottom: 20px;
}

:deep(.el-card__header) {
  border-bottom: 1px solid rgb(238 238 238);
  color: #124a89;
}

.el-card {
  border-radius: 0px;
  border: none;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #124a89;
}

.el-pagination {
  margin-top: 20px;
  justify-content: center;
}

.my-header {
  display: flex;
  justify-content: flex-start;
}

:deep(.el-loading-spinner .el-loading-text) {
  color: #124a89;
}

:deep(.el-loading-spinner .path) {
  stroke: #124a89;
}
</style>
../../api/userAuth/paramValue../../api/paramValue/userAuth