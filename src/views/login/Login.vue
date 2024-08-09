<template>
    <div class="login-container">
      <div class="login-box">
        <!--登录表单 start-->
        <div class="login-form">
          <!--标题和logo start-->
          <div class="login-title">
            <h2 class="title">参数治理管控平台</h2>
          </div>
          <!--标题和logo end-->
          <!--登录表单组件 start-->
          <LoginForm/>
          <!--登录表单组件 end-->
        </div>
        <!--登录表单 end-->
      </div>
    </div>
</template>

<script setup lang="ts">
import LoginForm from './components/LoginForm.vue'
</script>

<style scoped>
.login-container {
  background-color: #ffffff;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  background-image: url("../../assets/login/background2.png");
  background-size: cover;
  background-repeat: no-repeat ;
  justify-content: center;
  align-items: center;
  padding: 25px 25px;
  box-sizing: border-box;
}
.login-box {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-left{
  width: 50%;
}
.login-left img{
  width: 100%;
  max-width: 900px;
}

.login-form{
  max-width: 450px;
  max-height: 375px;
  width: 100%;
  padding: 40px;
  background-color: #ffffffef;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  box-sizing: border-box;
}

.login-title{
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 30px;
}

.login-title .title{
  margin: 0;
  font-size: 30px;
  white-space: nowrap;
  color: #505050;
}
.login-title .icon{
  width: 60px;
}

::v-deep(.el-input__inner){
  height: 40px;
}

</style>
