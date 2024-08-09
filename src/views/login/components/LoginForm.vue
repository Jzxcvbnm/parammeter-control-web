<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
    <!-- input: 用户名 -->
    <el-form-item label="" prop="userId">
      <el-input placeholder="请输入账号" autoComplete="on" style="position: relative" v-model="ruleForm.userId">
        <template #prefix>
          <el-icon class="el-input__icon"><UserFilled /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <!-- input: 密码 -->
    <el-form-item label="" prop="password">
      <el-input placeholder="请输入密码" autoComplete="on" v-model="ruleForm.password" :type="passwordType">
        <template #prefix>
          <el-icon class="el-input__icon"><GoodsFilled /></el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </div>
        </template>
      </el-input>
    </el-form-item>

    <!-- 验证码 -->
    <el-form-item label="" prop="captcha">
      <el-input placeholder="请输入验证码" autoComplete="on" v-model="ruleForm.captcha"  @keyup.enter="submitForm(ruleFormRef)">
        <template #suffix>
          <img :src="captchaSrc" @click="refreshCaptcha" style="cursor: pointer; width: 75%;" />
        </template>
      </el-input>
    </el-form-item>

    <!-- button: 登录/注册 -->
    <el-form-item style="width: 100%">
      <el-button :loading="loading" class="primary-btn" type="success" color="#c41717cc" @click="submitForm(ruleFormRef)">
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElNotification } from "element-plus";
import { useRouter } from 'vue-router'
import axios from 'axios'
import { loginApi,getCaptchaApi } from '../../../api/login/login'
import { useUserStore } from '../../../store/modules/user'

const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const passwordType = ref('password')
const loading = ref(false)
const captchaSrc = ref('')
const uuid = ref('')

// 生成UUID
function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

const rules = reactive({
  userId: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
})

// 表单数据
const ruleForm = reactive({
  userId: 'GHCD20241',
  password: '123456',
  captcha: '',
  uuid: ''
})

// 显示密码图标
const showPwd = () => {
  passwordType.value = passwordType.value === 'password' ? '' : 'password'
}

// 刷新验证码
const refreshCaptcha = async () => {
  uuid.value = getUUID()
  const { data } = await getCaptchaApi(uuid.value)
  const base64 = data.captcha
  captchaSrc.value = `data:image/png;base64,${base64}`
  ruleForm.uuid = uuid.value // 更新表单中的UUID
}

onMounted(() => {
  refreshCaptcha()
})

const userStore = useUserStore()

// 提交：登录表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async(valid) => {
    if (valid) {
      loading.value = true
      // 登录
      const { data } = await loginApi({ ...ruleForm });
      if(data.code===200){
        login(data)
      } else {
        ElNotification({
          title: '温馨提示',
          message: data.msg,
          type: "error",
          duration: 3000
        });
        loading.value = false
      }
    } else {
      console.log('error submit!')
      loading.value = false
      return false
    }
  })
}

// 登录到首页
async function login(data): Promise<void> {
  const value = await setDatas(data);
  console.log(value);
  
  router.push({
    path: '/index',
  })
  console.log("[Login] Push to Index");

  ElNotification({
    title: '登录成功',
    message: "欢迎登录 参数治理管控平台",
    type: "success",
    duration: 3000
  })
}

// 设置用户数据
async function setDatas(data): Promise<string> {
  userStore.setToken(data.data.token)
  userStore.setUserInfo({
    userId: data.data.userId,
    userName: data.data.userName,
  })
  return "[Login] Set Datas"
}
</script>

<style scoped>
.primary-btn {
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  height: 40px;
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}

::v-deep(.svg-icon) {
  vertical-align: 0;
}
</style>
