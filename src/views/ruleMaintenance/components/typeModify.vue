<template>
  <el-form ref="ruleFormRef" :rules="rules" :model="formType" label-width="80px">
    <el-row>

      <el-col :span="24" v-if="level == 1">
        <el-form-item label="匹配类型" prop="matchType">
          <el-select v-model="formType.matchType" @change="handleMatchTypeChange" :disabled="true">
            <el-option v-for="item in matchTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="24" v-if="level == 1">
        <el-form-item label="命名空间" prop="namespace">
          <el-input v-model="formType.namespace" placeholder="请输入命名空间" />
        </el-form-item>
      </el-col>

      <el-col :span="24" v-if="level == 1">
        <el-form-item label="代码地址" prop="codeUrl">
          <el-input v-model="formType.codeUrl" placeholder="请输入代码地址（如：https://gitee.com/xxx/xxx.git）" />
        </el-form-item>
      </el-col>

      <el-col :span="24" v-if="level == 2">
        <el-form-item label="上级分类" prop="parentId">
          <el-select v-model="formType.parentId" placeholder="请选择上级分类" @change="handleParentChange">
            <el-option v-for="item in TypeOptions" :key="item.id" :label="item.categoryName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="类型名称" prop="categoryName">
          <el-input v-model="formType.categoryName" placeholder="请输入类型名称" />
        </el-form-item>
      </el-col>

      <el-col :span="24" v-if="formType.matchType == 1 && level != 1">
        <el-form-item label="匹配前缀" prop="prefix">
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
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getTypeTree, updateType } from "../../../api/rule/ruleMaintenance"

const emit = defineEmits(['closeEditTypeForm', 'success'])

const props = defineProps(['typeInfo'])
const typeInfo = ref(props.typeInfo)

// 分类树
const TypeOptions = ref([])
// 匹配类型名称
const matchTypeOptions = [
  { label: '前缀匹配', value: 1 },
  { label: '代码扫描', value: 2 }
]

const subLoading = ref(false)
const ruleFormRef = ref<FormInstance>()

// 分类层级
const level = ref<number | null>(null);

// 表单数据
const formType = reactive({
  id: null,// 分类ID
  parentId: null,// 上级分类ID
  categoryName: null,// 分类名称
  prefix: null,// 分类前缀
  matchType: null,// 匹配类型
  namespace: null,// 命名空间
  codeUrl: null,// 代码地址
})

// 给表单填充数据
for (const key in formType) {
  formType[key] = typeInfo.value[key]
  // 若parentId为0，则说明是一级分类
  if (key === 'parentId' && typeInfo.value[key] === 0) {
    level.value = 1
  }
  else if (key === 'parentId' && typeInfo.value[key] === 1) {
    level.value = 0
  }
}

// 定义表单约束规则对象
const rules = reactive<FormRules>({
  categoryName: [
    { required: true, message: '请填写类型名称', trigger: 'blur' }
  ],
  matchType: [
    { required: true, message: '请选择匹配类型', trigger: 'blur' }
  ],
  parentId: [
    { required: true, message: '请选择上级分类', trigger: 'blur' }
  ],
  prefix: [
    { required: true, message: '请填写匹配前缀', trigger: 'blur' }
  ]
})

// 根据level动态调整校验规则
watch(() => level.value, (newValue) => {
  if (newValue === 1) {
    rules.matchType[0].required = true;
    rules.parentId[0].required = false;
    rules.prefix[0].required = false;
  } else if (newValue === 2) {
    rules.matchType[0].required = false;
    rules.parentId[0].required = true;
    rules.prefix[0].required = formType.matchType === 1;
  }
});

// 根据matchType动态调整校验规则
watch(() => formType.matchType, (newValue) => {
  if (level.value === 2) {
    rules.prefix[0].required = newValue === 0;
  }
});

// 初始化时根据level和matchType设置校验规则
if (level.value === 1) {
  rules.matchType[0].required = true;
  rules.parentId[0].required = false;
  rules.prefix[0].required = false;
} else if (level.value === 2) {
  rules.matchType[0].required = false;
  rules.parentId[0].required = true;
  rules.prefix[0].required = formType.matchType === 1;
}

// 选择上级分类时，获取匹配类型
const handleParentChange = (selectedId) => {
  const selectedType = TypeOptions.find(item => item.id === selectedId);
  if (selectedType) {
    formType.matchType = selectedType.matchType;
  }
}

// 修改参数信息
const confirmModify = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    subLoading.value = true
    if (valid) {  // 表单验证通过
      const { data } = await updateType(formType)
      if (data.code === 200) {
        ElMessage.success('修改成功')
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
  emit('closeEditTypeForm')
}

// 获取分类树
const getTree = async () => {
  const { data } = await getTypeTree()
  if (data.code === 200) {
    TypeOptions.value = data.data
  }
  else {
    ElMessage.error(data.msg)
  }
}

// 通过值获取匹配类型名称
const selectedMatchType = {
  get() {
    // 根据 formType.matchType 的值找到对应的 label
    const option = matchTypeOptions.find(opt => opt.value === formType.matchType);
    return option ? option.label : '';
  },
  set(newValue) {
    // 根据选择的 label 找到对应的 value
    const option = matchTypeOptions.find(opt => opt.value === newValue);
    if (option) {
      formType.matchType = option.value;
    } else {
      console.error('Invalid label:', newValue);
    }
  }
};

// 处理匹配类型变化
const handleMatchTypeChange = (value) => {
  selectedMatchType.set(value);
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