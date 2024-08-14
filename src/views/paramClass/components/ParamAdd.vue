<template>
    <el-form ref="ruleFormRef" :rules="rules" :model="formParam" label-width="80px">
        <el-row>
            <el-col :span="12">
                <el-form-item label="参数名称" prop="Variable_Name">
                    <el-input v-model="formParam.Variable_Name" placeholder="请输入参数名" />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="参数值" prop="Default_Value">
                    <el-input v-model="formParam.Default_Value" placeholder="请输入参数值" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="参数描述" prop="Description">
                    <el-input v-model="formParam.Description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"
                        placeholder="" />
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="参数分类" prop="type">
                    <el-cascader :options="TypeOptions" @change="typeChange" placeholder="请选择参数分类"></el-cascader>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="一级分类" prop="type1">
                    <el-input v-model="formParam.type1" placeholder="" readonly />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="二级分类" prop="type2">
                    <el-input v-model="formParam.type2" placeholder="" readonly />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="参数状态" prop="status">
                    <el-select v-model="formParam.status" placeholder="请选择参数状态">
                        <el-option label="未启用" value="0"></el-option>
                        <el-option label="生效" value="1"></el-option>
                        <el-option label="作废" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="确认标志" prop="verify">
                    <el-select v-model="formParam.verify" placeholder="请选择确认标志">
                        <el-option label="已确认" value="1"></el-option>
                        <el-option label="未确认" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

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
import { treeDataTranslate } from "../../../utils/typeTree"
import { addParamInfo } from "../../../api/param/paramInfo"
import { getTypeTree } from "../../../api/rule/ruleMaintenance"

const emit = defineEmits(['closeAddParamForm', 'success'])

const TypeOptions = ref([])
const subLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const formParam = reactive({
    Variable_Name: '', // 参数名称
    Default_Value: '', // 参数值
    Description: '', // 参数描述
    type1: '', // 一级分类
    type2: '', // 二级分类
    status: '', // 参数状态
    verify: '', // 确认标志
})

// 定义表单约束规则对象
const rules = reactive<FormRules>({
    Variable_Name: [
        { required: true, message: '请输入参数名称', trigger: 'blur' },
    ],
    Default_Value: [
        { required: true, message: '请输入参数值', trigger: 'blur' },
    ],
    type1: [
        { required: true, message: '请选择一级分类', trigger: 'blur' },
    ],
    type2: [
        { required: true, message: '请选择二级分类', trigger: 'blur' },
    ],
    status: [
        { required: true, message: '请选择参数状态', trigger: 'blur' },
    ],
    verify: [
        { required: true, message: '请选择确认标志', trigger: 'blur' },
    ]
})

// 添加参数信息
const addParam = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        subLoading.value = true
        if (valid) {  // 表单验证通过
            const { data } = await addParamInfo(formParam)
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
        TypeOptions.value = treeDataTranslate(data.data)
    } else {
        ElMessage.error(data.msg)
        console.log('获取分类树失败')
    }
}

const typeChange = (value) => {
    if (value && value.length === 2) {
        formParam.type1 = value[0];
        formParam.type2 = value[1];
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