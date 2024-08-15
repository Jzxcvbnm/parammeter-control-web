<template>
  <el-form ref="ruleFormRef" :rules="rules" :model="formType" label-width="80px">
      <el-row>
          <el-col :span="12">
              <el-form-item label="上级分类" prop="parentId">
                  <el-select v-model="formType.parentId" placeholder="请选择上级分类">
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
              <el-form-item label="匹配前缀" prop="prefix" v-if="formType.parentId === '2'">
                  <el-input v-model="formType.prefix" placeholder="（格式类似于：spring.cloud.netflix.eureka）" />
              </el-form-item>
          </el-col>
      </el-row>
  </el-form>

  <div class="dialong__button--wrap">
    <el-button @click="close">取消</el-button>
    <el-button color="#00B890" :loading="subLoading" type="success" @click="confirmModify(ruleFormRef)">确认</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getTypeTree, updateType } from "../../../api/rule/ruleMaintenance"

const emit = defineEmits(['closeEditTypeForm', 'success'])

const props = defineProps(['typeInfo'])
const typeInfo = ref(props.typeInfo)

const TypeOptions = ref([])

const subLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const formType = reactive({
    id: '',
    parentId: '',
    categoryName: '',
    prefix: ''
})
// 给表单填充数据
console.log("typeInfo:",typeInfo.value)
for (const key in formType) {
  formType.value[key] = typeInfo.value[key]
}
// 定义表单约束规则对象
const rules = reactive<FormRules>({
  parentId: [
        { required: true, message: '请选择上级分类', trigger: 'blur' },
    ],
    categoryName: [
        { required: true, message: '请输入类型名称', trigger: 'blur' },
    ],
    prefix: [
        { required: true, message: '请输入匹配前缀', trigger: 'blur' },
    ],
})

// 修改参数信息
const confirmModify = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    subLoading.value = true
    if (valid) {  // 表单验证通过
      const { data } = await updateType(formType)
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
  emit('closeEditTypeForm')
}

// 获取分类树
const getTree = async () => {
  const { data } = await getTypeTree()
  if (data.code === 200) {
        TypeOptions.value = data.data
        // 添加无上级分类时的选项
        TypeOptions.value.unshift({
        id: '0',
        parentId: '0',
        categoryName: '无',
        prefix: '' ,
        children: [],
    })
  }
  else{
    ElMessage.error(data.msg)
    console.log('获取分类树失败')
  }
}

// 页面加载完成后，获取分类树
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