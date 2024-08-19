<template>
    <el-form ref="ruleFormRef" :rules="rules" :model="formParam" label-width="80px">
        <el-row>
            <el-col :span="12">
                <el-form-item label="参数名称" prop="parameterKey">
                    <el-input v-model="formParam.parameterKey" placeholder="请输入参数名" />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="命名空间" prop="namespace">
                    <el-input v-model="formParam.namespace" placeholder="请输入命名空间" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="生产环境" prop="valueProd">
                    <el-input v-model="formParam.valueProd" placeholder="请输入生产环境参数值" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="回装环境" prop="valueReinstall">
                    <el-input v-model="formParam.valueReinstall" placeholder="请输入回装环境参数值" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="功能测试" prop="valueFunc">
                    <el-input v-model="formParam.valueFunc" placeholder="请输入功能测试参数值" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="参数描述" prop="description">
                    <el-input v-model="formParam.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"
                        placeholder="" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="参数分类" prop="type">
                    <el-cascader :options="TypeOptions" @change="typeChange" placeholder="请选择参数分类"></el-cascader>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="参数状态" prop="status">
                    <el-select v-model="formParam.status" placeholder="请选择参数状态">
                        <el-option v-for="item in statusMap" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <!-- <el-col :span="12">
                <el-form-item label="确认状态" prop="checkStatus">
                    <el-select v-model="formParam.checkStatus" placeholder="请选择确认状态">
                        <el-option v-for="item in checkStatusMap" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col> -->

        </el-row>
    </el-form>

    <div class="dialong__button--wrap">
        <el-button @click="close">取消</el-button>
        <el-button color="#00B890" :loading="subLoading" type="success" @click="addParam(ruleFormRef)">确认</el-button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { addParamInfo } from "../../../api/param/paramInfo"
import { getTypeTree } from "../../../api/rule/ruleMaintenance"


// 状态映射
const statusMap = [
    { label: '已启用', value: 0 },
    { label: '未启用', value: 1 },
    { label: '已作废', value: 2 },
]

// 确认状态映射
const checkStatusMap = [
    { label: '推荐分类', value: 0 },
    { label: '已确认', value: 1 },
    { label: '未找到分类', value: 2 },
    { label: '未找到使用', value: 3 },
]

const emit = defineEmits(['closeAddParamForm', 'success'])

const TypeOptions = ref([])
const subLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const formParam = reactive({
    parameterKey: null, // 参数名称
    namespace: null, // 命名空间
    valueProd: null,// 生产环境参数值
    valueReinstall: null,// 回装环境参数值
    valueFunc: null,// 功能测试参数值
    description: null, // 参数描述
    type: [], // 参数分类
    type1: null, // 一级分类
    type2: null, // 二级分类
    status: null, // 参数状态
    // checkStatus: null,// 确认状态
})

// 定义表单约束规则对象
const rules = reactive<FormRules>({
    parameterKey: [
        { required: true, message: '请输入参数名称', trigger: 'blur' },
    ],
    namespace: [
        { required: true, message: '请输入命名空间', trigger: 'blur' },
    ],
    valueProd: [
        { required: true, message: '请输入生产环境参数值', trigger: 'blur' },
    ],
    valueReinstall: [
        { required: true, message: '请输入回装环境参数值', trigger: 'blur' },
    ],
    valueFunc: [
        { required: true, message: '请输入功能测试参数值', trigger: 'blur' },
    ],
    type: [
        { required: true, message: '请选择参数分类', trigger: 'blur' },
    ],
    status: [
        { required: true, message: '请选择参数状态', trigger: 'blur' },
    ],
    checkStatus: [
        { required: true, message: '请选择确认状态', trigger: 'blur' },
    ]
})

// 添加参数信息
const addParam = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        subLoading.value = true
        if (valid) {  // 表单验证通过
            const params = {
                parameterKey: formParam.parameterKey,
                namespace: formParam.namespace,
                valueProd: formParam.valueProd,
                valueReinstall: formParam.valueReinstall,
                valueFunc: formParam.valueFunc,
                description: formParam.description,
                type1: formParam.type1,
                type2: formParam.type2,
                status: formParam.status,
                // checkStatus: fields.checkStatus,
            }
            const { data } = await addParamInfo(params)
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
    emit('closeAddParamForm')
}

// 获取分类树
const getTree = async () => {
    const { data } = await getTypeTree()
    if (data.code === 200) {
        TypeOptions.value = transformData(data.data)

    } else {
        ElMessage.error(data.msg)
        console.log('获取分类树失败')
    }
}

const transformData = (data) => {
    return data.map(item => {
        return {
            value: item.id,
            label: item.categoryName,
            children: item.children.length ? transformData(item.children) : undefined
        };
    });
};

const typeChange = (value) => {
    if (value && value.length === 2) {
        formParam.type1 = value[0];
        formParam.type2 = value[1];
        formParam.type = [formParam.type1, formParam.type2]
    } else {
        formParam.type1 = '';
        formParam.type2 = '';
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