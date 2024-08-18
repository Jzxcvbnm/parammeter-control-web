<template>
    <el-form ref="ruleFormRef" :rules="rules" :model="formType" label-width="80px">
        <el-row>
            <el-col :span="24">
                <el-form-item label="新增分类" prop="level">
                    <el-select v-model="formType.level" :disabled="isAddInFirstLevel" placeholder="请选择分类层级"
                        @change="handleLevelChange">
                        <el-option v-for="item in levelOptions" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="类型名称" prop="categoryName">
                    <el-input v-model="formType.categoryName" placeholder="请输入类型名称" />
                </el-form-item>
            </el-col>

            <el-col :span="24" v-if="formType.level == 1">
                <el-form-item label="匹配类型" prop="matchType">
                    <el-select v-model="formType.matchType" placeholder="请选择匹配类型">
                        <el-option label="前缀匹配" value="1"></el-option>
                        <el-option label="代码扫描" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="24" v-if="formType.level == 1">
                <el-form-item label="命名空间" prop="namespace">
                    <el-input v-model="formType.namespace" placeholder="请输入命名空间" />
                </el-form-item>
            </el-col>

            <el-col :span="24" v-if="formType.level == 1">
                <el-form-item label="代码地址" prop="codeUrl">
                    <el-input v-model="formType.codeUrl" placeholder="请输入代码地址（如：https://gitee.com/xxx/xxx.git）" />
                </el-form-item>
            </el-col>

            <el-col :span="24" v-if="formType.level == 2">
                <el-form-item label="上级分类" prop="parentId">
                    <el-select v-model="formType.parentId" :disabled="isAddInFirstLevel" placeholder="请选择上级分类"
                        @change="handleParentChange">
                        <el-option v-for="item in TypeOptions" :key="item.id" :label="item.categoryName"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="24" v-if="formType.matchType == 1 && formType.level != 1">
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
import { getTypeTree, addType } from "../../../api/rule/ruleMaintenance"

const emit = defineEmits(['closeAddTypeForm', 'success'])

const props = defineProps(['typeInfo', 'isAddInFirstLevel'])
const typeInfo = ref(props.typeInfo)
const isAddInFirstLevel = ref(props.isAddInFirstLevel)

// 分类层级名称
const levelOptions = [
    { label: '一级分类', value: 1 },
    { label: '二级分类', value: 2 },
]

const TypeOptions = ref([])
const subLoading = ref(false)
const ruleFormRef = ref<FormInstance>()

// 表单数据
const formType = reactive({
    level: null,// 分类层级
    matchType: null,// 匹配类型 0-前缀匹配 1-代码扫描
    parentId: null,// 上级分类
    categoryName: null,// 类型名称
    prefix: null,// 匹配前缀
    namespace: null,// 命名空间
    codeUrl: null,// 代码地址
})

// 给表单填充数据
for (const key in formType) {
    formType[key] = typeInfo.value[key]
}

// 定义表单约束规则对象
const rules = reactive<FormRules>({
    level: [
        { required: true, message: '请选择分类层级', trigger: 'blur' },
    ],
    matchType: [
        { required: (form) => form.level === 1, message: '请选择匹配类型', trigger: 'blur' },
    ],
    namespace: [
        { required: (form) => form.level === 1, message: '请输入命名空间', trigger: 'blur' },
    ],
    codeUrl: [
        { required: (form) => form.level === 1, message: '请输入代码地址', trigger: 'blur' },
    ],
    parentId: [
        { required: (form) => form.level === 2, message: '请选择上级分类', trigger: 'blur' },
    ],
    categoryName: [
        { required: true, message: '请输入类型名称', trigger: 'blur' },
    ],
    prefix: [
        { required: (form) => form.level === 2 && form.matchType !== null && form.matchType === 1, message: '请输入匹配前缀', trigger: 'blur' },
    ],
})


// 选择上级分类时，获取匹配类型
const handleParentChange = (selectedId) => {
    const selectedType = TypeOptions.value.find(item => item.id === selectedId);
    if (selectedType) {
        formType.matchType = selectedType.matchType;
    }
}

// 选择分类层级时，清空上级分类和匹配类型
const handleLevelChange = (value) => {
    formType.level = value
    if (formType.level == 1) {
        formType.parentId = 0
    }
    else {
        formType.parentId = null
    }
    formType.matchType = null
}

// 添加参数信息
const confirmAdd = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        subLoading.value = true
        if (valid) {  // 表单验证通过
            const params = {
                matchType: formType.matchType,
                parentId: formType.parentId,
                categoryName: formType.categoryName,
                prefix: formType.prefix,
                namespace: formType.namespace,
                codeUrl: formType.codeUrl,
            }
            const { data } = await addType(params)
            if (data.code === 200) {
                ElMessage.success('添加成功')
                emit('success')
            } else {
                ElMessage.error(data.msg)
            }
        } else {
            ElMessage.error('提交失败，你还有未填写的项！')
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
        TypeOptions.value = data.data
    } else {
        ElMessage.error(data.msg)
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