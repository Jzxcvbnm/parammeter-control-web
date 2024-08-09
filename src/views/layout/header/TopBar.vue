<template>
<div class="main">
  <div class="tool-left">
    <CollapseIcon/>
    <Hamburger/>
  </div>
    <div class="linkBox">

        <div class="el-link">
          <span class="truncate">{{userInfo.userName}}</span>
        </div>

      <!--退出系统 start-->
      <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" :icon="SwitchButton" icon-color="#30bcd7"
                    title="确认退出系统吗？" @confirm="exit">
        <template #reference>
          <el-link :underline="false">
            <el-icon>
              <SwitchButton />
            </el-icon>
            <span class="truncate">退出</span>
          </el-link>
        </template>
      </el-popconfirm>
      <!--退出系统 end-->

    </div>
</div>
  <TabsView/>
</template>

<script setup lang="ts">
import { SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '../../../store/modules/user'
import {loginOutApi} from '../../../api/login/login'
import CollapseIcon  from './CollapseIcon.vue'
import Hamburger from './Hamburger.vue'
import TabsView from '../tags/Index.vue'
import {calculateDays, formatTime} from "../../../utils/date";
const { userInfo } = useUserStore()
// 退出登录
const exit = async () => {

  const { data } = await loginOutApi();
  if(data.code===200){
    // 清除用户登录信息
    window.localStorage.removeItem("userStore");
    // 返回登录页
    window.location.href = "/";
  }

}
// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API
</script>

<style scoped>
.main {
  display: flex;
  justify-content: space-between;
  height: 50px;
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 10px;
  background: rgb(48, 48, 48);
}

.linkBox {
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  float: right;
}
.linkBox .el-link {
  margin-right: 30px;
  color: #8c8c8c;
}
.linkBox .el-link:hover {
  color: #ffffff;
}

.truncate {
  display: inline-block;
  max-width: 8ch; /* 限制显示的字符数 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tool-left{
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
