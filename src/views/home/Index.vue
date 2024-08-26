<template>
  <!-- <div class="home">
    <div class="top_bg">
      <h1>欢迎登录参数治理管控平台</h1> -->
      <!-- <p>当前登录用户：{{ userName }}（用户ID：{{ userId }}）</p> -->
    <!-- </div>
    <div class="date_time">
      {{ currentDateTime }}
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { ElNotification } from "element-plus";
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../../store/modules/user'

const userStore = useUserStore()

const userName = userStore.userInfo.userName
const userId = userStore.userInfo.userId

const currentDateTime = computed(() => {
  const now = new Date()
  return now.toLocaleString()
})

onMounted(() => {

})
</script>

<style scoped>
.home {
  width: 100%;
  background-color: #ffffff;
  position: relative;
}

.top_bg {
  width: 100%;
  height: 540px;
  background-image: url(../../assets/banner2.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: rgb(255, 255, 255);
  line-height: 60px;
  text-align: center;
  margin: 0 auto 10px;
  /* opacity: 0.5; */
}

.top_bg h1 {
  font-size: calc(12px + 3vw);
  padding-top: 50px;
}

.top_bg p {
  font-weight: bold;
  font-size: calc(14px + .25vw);
}

.date_time {
  font-weight: bold;
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #ffffff;
  font-size: 14px;
}
</style>