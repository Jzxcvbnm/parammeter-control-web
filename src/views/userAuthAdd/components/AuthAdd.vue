<template>

  <el-form ref="ruleFormRef" :rules="rules" :model="formAuth" label-width="80px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="formAuth.userId" placeholder="" readonly />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="操作员ID" prop="operatorId">
          <el-input v-model="formAuth.operatorId" placeholder="" readonly />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="添加权限" prop="authIds">
          <el-select v-model="formAuth.authIds" multiple placeholder="请添加新权限">
            <el-option v-for="item in authOptions" :key="item.rank" :label="item.rank" :value="item.id"
              :disabled="userAuthList.includes(item.id)">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

    </el-row>
  </el-form>

  <div class="dialong__button--wrap">
    <el-button @click="close">取消</el-button>
    <el-button color="#124a89" :loading="subLoading" type="success" @click="addAuth(ruleFormRef)">确认</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addAuthApi, getApolloApi } from "../../../api/userAuth/userAuth"
import type { FormInstance, FormRules } from 'element-plus'


const emit = defineEmits(['closeAddUserForm', 'success'])

const props = defineProps(['userAuth'])
const userAuth = ref(props.userAuth)

const authOptions = userAuth.value.authOptions// 权限选项列表
console.log('authOptions', authOptions)
const userAuthList = userAuth.value.userAuthList// 用户已有权限列表

const subLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const formAuth = reactive({
  userId: '',
  operatorId: '',
  authIds: [],
})

// 给表单填充默认数据
formAuth.userId = userAuth.value.userId
formAuth.operatorId = userAuth.value.operatorId

// 定义表单约束规则对象
const rules = reactive<FormRules>({
  authIds: [{ required: true, message: '请选择新权限！', trigger: 'blur' }]
})

// 添加用户权限
const addAuth = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    subLoading.value = true
    if (valid) {
      const { data } = await addAuthApi(formAuth)
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
  emit('closeAddUserForm')
}
</script>

<style scoped>
.dialong__button--wrap {
  text-align: center;
  margin-top: 20px;
}

.no-cursor {
  cursor: default !important;
}
</style>../../../api/userAuth/paramValue../../../api/paramValue/userAuth