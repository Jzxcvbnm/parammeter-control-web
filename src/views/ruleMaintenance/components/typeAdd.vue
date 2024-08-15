<template>
    <el-form ref="ruleFormRef" :rules="rules" :model="formType" label-width="80px">
        <el-row>
            <el-col :span="12">
                <el-form-item label="上级分类" prop="parent_id">
                    <el-select v-model="formType.parent_id" placeholder="请选择上级分类">
                        <el-option v-for="item in TypeOptions" :key="item.id" :label="item.categoryName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="类型名称" prop="categoryName">
                    <el-input v-model="formType.categoryName" placeholder="请输入类型名称" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="匹配前缀" prop="prefix">
                    <el-input v-model="formType.prefix" placeholder="（格式类似于：spring.cloud.netflix.eureka）" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>

    <div class="dialong__button--wrap">
        <el-button @click="close">取消</el-button>
        <el-button color="#00B890" :loading="subLoading" type="success" @click="confirmAdd(ruleFormRef)">确认</el-button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { treeDataTranslate } from "../../../utils/typeTree"
import { getTypeTree, addType } from "../../../api/rule/ruleMaintenance"

const emit = defineEmits(['closeAddTypeForm', 'success'])

const TypeOptions = ref([])
const subLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const formType = reactive({
    parent_id: '',
    categoryName: '',
    prefix: '',
})

// 定义表单约束规则对象
const rules = reactive<FormRules>({
    parent_id: [
        { required: true, message: '请选择上级分类', trigger: 'blur' },
    ],
    categoryName: [
        { required: true, message: '请输入类型名称', trigger: 'blur' },
    ],
    prefix: [
        { required: true, message: '请输入匹配前缀', trigger: 'blur' },
    ],
})

// 添加参数信息
const confirmAdd = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        subLoading.value = true
        if (valid) {  // 表单验证通过
            const { data } = await addType(formType)
            if (data.code === 200) {
                ElMessage.success(data.msg)
                emit('success')
            } else {
                ElMessage.error(data.msg)
            }
        } else {
            ElMessage.error('提交失败，你还有未填写的项！')
            console.log('error submit!', fields)
        }
        subLoading.value = false
    })
}

// 取消表单
const close = () => {
    emit('closeAddTypeForm')
}

// 获取分类树
const getTree = async () => {
    const { data } = await getTypeTree()
    if (data.code === 200) {
        TypeOptions.value = treeDataTranslate(data.data)
    } else {
        ElMessage.error(data.msg)
        console.log('获取分类树失败')
    }
}

onMounted(async () => {
    getTree();
})
</script>

<style scoped>
.dialong__button--wrap {
    text-align: center;
    margin-top: 20px;
}

.no-cursor {
    cursor: default !important;
}
</style>