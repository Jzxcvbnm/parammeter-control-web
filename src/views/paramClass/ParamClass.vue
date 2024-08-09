<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px;">
            <UserFilled />
          </el-icon>参数分类
        </h3>

        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="10" justify="end">
            <el-col span="6">
              <el-input :prefix-icon="Search" v-model="userId" @keyup.enter="validateAndSearch" placeholder="请输入用户ID" style="width: 150px;"/>
            </el-col>
            <el-col span="6">
              <el-select v-model="city" placeholder="请选择城市" style="width: 150px;">
                <el-option v-for="item in cityOptions" :key="item.label" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col span="4">
              <el-button type="primary" @click="validateAndSearch" color="#0554af">查询</el-button>
            </el-col>
            <el-col span="4">
              <el-button type="primary" @click="searchAll" color="#0554af">查询全部</el-button>
            </el-col>
            <el-col span="4">
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
      <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
        style="width: 100%;text-align: center" :cell-style="{ textAlign: 'center' }"
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
        <el-table-column label="手机号">
          <template #default="scope">
            <el-tooltip :content="scope.row.userPhone" placement="top" effect="light">
              <span class="highlight">{{ scope.row.userPhone }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template #default="scope">
            <el-tooltip :content="scope.row.createTime" placement="top" effect="light">
              <span class="highlight">{{ formatTime(scope.row.createTime, 'yyyy-MM-dd') }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="更新时间">
          <template #default="scope">
            <el-tooltip :content="scope.row.updateTime" placement="top" effect="light">
              <span class="highlight">{{ formatTime(scope.row.updateTime, 'yyyy-MM-dd') }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="邮箱">
          <template #default="scope">
            <el-tooltip :content="scope.row.email" placement="top" effect="light">
              <span class="highlight">{{ scope.row.email }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="注册地址">
          <template #default="scope">
            <el-tooltip :content="scope.row.registerAddress" placement="top" effect="light">
              <span class="highlight">{{ scope.row.registerAddress }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>

      <!--分页 start-->
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
        v-model:page-size="pageSize" @size-change="handleSizeChange" @current-change="changePage" :page-sizes="[10, 20, 30, 40]" />
      <!--分页 end-->
    </div>
    <!--表格区域 end-->
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { formatTime } from "../../utils/date"

const state = reactive({
  // 搜索表单内容
  userId: '',
  city: '',
  // 表格全部信息
  tableData: [],
  // 当前点击的编辑信息
  userInfo: null,
  // status: null,
  total: 0, //总条数
  pageSize: 10, //每页显示行数
  pageIndex: 1, //当前页码
  loading: false, // 数据加载
  showTable: false, // 控制表格显示
})

// 获取用户列表数据
const loadData = async (state: any) => {
  state.loading = true
  // 先清空数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    // 'status': state.status ==-1 ? '':state.status,
    'userId': state.userId,
    'city': state.city
  }
  const { data } = await getUserInfoApi(params)
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

// 验证用户ID并进行搜索
const validateAndSearch = () => {
  const userIdRegex = /^GHCD\d{5}$/
  if(state.userId===''&&state.city===''){
    ElMessage({
      type: 'error',
      message: '请输入用户ID或城市',
    })
  }
  else if (!userIdRegex.test(state.userId)&&state.userId!=='') {
    ElMessage({
      type: 'error',
      message: '用户ID格式不正确，必须以GHCD开头，且最后一位为数字，总长度为9位',
    })
  } else {
    state.pageIndex = 1
    state.pageSize = 10
    search()
  }
}

// 搜索
const search = () => {
  if (state.userId !== null) {
    ElMessage({
      type: 'info',
      message: `用户ID: ${state.userId} 搜索内容如下`,
    })
    loadData(state)
  }
}

// 全部查询
const searchAll = () => {
  state.userId = ""
  state.city = ""
  loadData(state)
}

// 重置搜索
const resetSearch = () => {
  state.userId = ""
  state.showTable = false
  // 搜索表单内容
  state.userId = ''
  // 筛选下拉框内容
  state.city = ''
  state.tableData = []

  state.pageSize = 10 //每页显示行数
  state.pageIndex = 1 //当前页码
}

// // 定义城市下拉选择项
// const cityOptions = ref<object[]>([])
// const clusterName = 'default'
// const namespaceName = 'web-client'

// // 获取所有权限列表
// const getCityList = async () => {
//   try {
//     const { data } = await getApolloApi(clusterName, namespaceName)
//     if (data.configurations.city) {
//       cityOptions.value = JSON.parse(data.configurations.city)
//       console.log('城市列表:', cityOptions.value)
//     } else {
//       ElMessage.error('获取权限列表失败，请重试')
//       console.error('获取权限列表失败')
//     }
//   } catch (error) {
//     ElMessage.error('获取权限列表失败，请重试')
//     console.error('获取权限列表失败:', error)
//   }
// }

// const getCityNameById = (cityId: string) => {
//   const city = cityOptions.value.find(option => option.value === cityId)
//   return city ? city.label : ''
// }

//挂载后加载数据
onMounted(() => {

})

const { tableData, pageIndex, pageSize, loading, total, userId, city, showTable } = toRefs(state)
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
  color: #124a89;
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
  background-color: #124a89;
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
  color: #124a89;
}

:deep(.el-loading-spinner .path) {
  stroke: #124a89;
}
</style>
