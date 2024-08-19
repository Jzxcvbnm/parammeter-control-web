<template>
    <el-card class="box-card">
        <!--头部 start-->
        <template #header>
            <div class="card-header">
                <div class="card-search">
                    <el-row :gutter="10">
                        <el-col span="6">
                            <el-button type="primary" @click="addHandle()" color="#00B890">新增</el-button>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </template>
        <!--头部 end-->
        <!--表格区域 start-->
        <div class="table-box" v-if="showTable">
            <!-- <div class="table-box"> -->
            <el-table :data="dataList" v-loading="dataListLoading" row-key="id" border style="width: 100%;"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column type="index" width="60" align="center" label="序号"></el-table-column>

                <el-table-column prop="categoryName" header-align="center" min-width="50" label="类型">
                </el-table-column>

                <el-table-column prop="namespace" header-align="center" align="center" min-width="50" label="命名空间">
                </el-table-column>

                <el-table-column prop="matchType" header-align="center" align="center" min-width="50" label="匹配类型">
                    <template #default="scope">
                        <span v-if="scope.row.matchType === 1">前缀匹配</span>
                        <span v-else-if="scope.row.matchType === 2">代码扫描</span>
                    </template>
                </el-table-column>

                <el-table-column prop="codeUrl" header-align="center" min-width="50" label="代码地址">
                </el-table-column>

                <el-table-column prop="parentId" header-align="center" align="center" label="上级类型">
                    <template #default="scope">
                        <span v-for="item in dataList" :key="item.id">
                            <span v-if="scope.row.parentId === item.id">{{ item.categoryName }}</span>
                        </span>
                    </template>
                </el-table-column>

                <el-table-column prop="prefix" header-align="center" align="center" label="分类前缀">
                </el-table-column>

                <el-table-column fixed="right" header-align="center" align="center" width="200" label="操作">
                    <template #default="scope">
                        <el-button v-if="scope.row.parentId == 0" type="text" size="small"
                            @click="addHandle(2, scope.row)" :disabled="scope.row.id == 1">新增</el-button>
                        <el-button type="text" size="small" @click="UpdateHandle(scope.row)"
                            :disabled="scope.row.id == 1">修改</el-button>
                        <el-button type="text" size="small" @click="deleteHandle(scope.row)"
                            :disabled="(scope.row.children && scope.row.children.length > 0) || (scope.row.id == 1)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--表格区域 end-->
    </el-card>

    <!-- 修改参数弹出框 start-->
    <el-dialog align-center v-model="editTypeDialogFormVisible" width="42%" destroy-on-close
        :before-close="closeEditTypeForm">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <el-icon size="26px">
                    <EditPen />
                </el-icon>
                <h1 id="titleId">{{ editTitle }}</h1>
            </div>
        </template>
        <!--修改参数组件 start-->
        <TypeModify :typeInfo="typeInfo" @closeEditTypeForm="closeEditTypeForm" @success="success" />
        <!--修改参数组件 end-->
    </el-dialog>
    <!--修改参数弹出框 end -->

    <!-- 添加参数弹出框 start-->
    <el-dialog align-center v-model="addTypeDialogFormVisible" width="42%" destroy-on-close
        :before-close="closeAddTypeForm">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <el-icon size="26px">
                    <EditPen />
                </el-icon>
                <h1 id="titleId">{{ addTitle }}</h1>
            </div>
        </template>
        <!--添加参数组件 start-->
        <TypeAdd :typeInfo="typeInfo" :isAddInFirstLevel="isAddInFirstLevel" @closeAddTypeForm="closeAddTypeForm"
            @success="success" />
        <!--添加参数组件 end-->
    </el-dialog>
    <!-- 添加参数弹出框 end -->
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { exportExcel } from "../../utils/exprotExcel"
import { getTypeTree, deleteType } from '../../api/rule/ruleMaintenance';
import TypeModify from './components/TypeModify.vue'
import TypeAdd from './components/TypeAdd.vue'

// 修改类型弹窗状态
const editTypeDialogFormVisible = ref(false)
const editTitle = ref('修改类型信息')

// 新增类型弹窗状态
const addTypeDialogFormVisible = ref(false)
const addTitle = ref('新增类型信息')
// 是否在一级分类下添加
const isAddInFirstLevel = ref(false)

// 分类树获取
const dataList = ref<any[]>([])
const dataListLoading = ref(false)
const showTable = ref(false)

// 提交表单回调函数
const success = () => {
    getDataList()
    editTypeDialogFormVisible.value = false
    addTypeDialogFormVisible.value = false
    isAddInFirstLevel.value = false
}

// 获取数据列表
const getDataList = async () => {
    showTable.value = true
    dataListLoading.value = true
    const { data } = await getTypeTree()

    if (data.code !== 200) {
        ElMessage({
            type: 'error',
            message: data.msg
        })
    }
    else {
        ElMessage({
            type: 'success',
            message: '获取分类成功'
        })
        dataList.value = data.data
        dataListLoading.value = false
    }

}

// 添加类型信息
const addHandle = (level = null, row = null) => {
    if (level && row) {
        typeInfo.value.level = level;
        typeInfo.value.parentId = row.id;
        typeInfo.value.matchType = row.matchType;
        typeInfo.value.namespace = row.namespace;
        typeInfo.value.codeUrl = row.codeUrl;
        isAddInFirstLevel.value = true;
    }

    addTypeDialogFormVisible.value = true;
}

// 类型信息
const typeInfo = ref({
    level: null,// 分类级别
    id: null,// 分类ID
    parentId: null,// 上级分类ID
    categoryName: null,// 分类名称
    prefix: null,// 分类前缀
    matchType: null,// 匹配类型
    namespace: null,// 命名空间
    codeUrl: null,// 代码地址
})

// 修改类型信息
const UpdateHandle = (row) => {
    typeInfo.value.id = row.id;
    typeInfo.value.parentId = row.parentId;
    typeInfo.value.categoryName = row.categoryName;
    typeInfo.value.prefix = row.prefix;
    typeInfo.value.matchType = row.matchType;
    typeInfo.value.namespace = row.namespace;
    typeInfo.value.codeUrl = row.codeUrl;

    editTypeDialogFormVisible.value = true;
}

// 关闭修改类型弹出框
const closeEditTypeForm = () => {
    editTypeDialogFormVisible.value = false
    // 重置表单数据
    typeInfo.value = {
        level: null,// 分类级别
        id: null,// 分类ID
        parentId: null,// 上级分类ID
        categoryName: null,// 分类名称
        prefix: null,// 分类前缀
        matchType: null,// 匹配类型
        namespace: null,// 命名空间
        codeUrl: null,// 代码地址
    }
}

// 关闭添加类型弹出框
const closeAddTypeForm = () => {
    addTypeDialogFormVisible.value = false
    isAddInFirstLevel.value = false
    // 重置表单数据
    typeInfo.value = {
        level: null,// 分类级别
        id: null,// 分类ID
        parentId: null,// 上级分类ID
        categoryName: null,// 分类名称
        prefix: null,// 分类前缀
        matchType: null,// 匹配类型
        namespace: null,// 命名空间
        codeUrl: null,// 代码地址
    }
}

// 删除类型信息
const deleteHandle = (row) => {
    ElMessageBox.confirm(`确定对类型：[${row.categoryName}] 进行 [删除] 操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            const { data } = await deleteType(row.id)

            if (data.code === 200) {
                ElMessage({
                    message: '删除成功',
                    type: 'success',
                });

                getDataList();
            } else {
                ElMessage.error(data.msg);
            }
        } catch (error) {
            ElMessage.error('删除失败');
        }
    }).catch(() => { });
};

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
    getDataList()
})

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

.no-cursor {
    cursor: default !important;
}

/*修改v-loading样式*/
:deep(.el-loading-spinner .el-loading-text) {
    color: #484848;
}

:deep(.el-loading-spinner .path) {
    stroke: #484848;
}
</style>