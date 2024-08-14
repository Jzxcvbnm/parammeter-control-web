<template>
  <el-menu color="white" text-color="#67879b" router
      :default-active="route.path"
      :unique-opened="false"  :default-openeds="[route.path]"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :collapse-transition="false"
  >
    <!--logo start-->
    <div class="title hidden-xs-only" v-if="!isCollapse">
      <h1>
        <a href="javascript:;">参数治理管控平台</a>
      </h1>
    </div>
    <!--logo end-->

    <!--遍历菜单 start-->
    <template v-for="(v, index) in menuData" :key="index+''">
      <!-- 如果菜单有孩子菜单，则循环孩子菜单 -->
      <el-sub-menu v-if="v.isMenu&&v.funcNode!=1" :index="index+''">
        <template #title >
          <el-icon>
            <component :is="v.meta.icon"></component>
          </el-icon>
          <span>{{v.meta.title}}</span>
        </template>
        <el-menu-item v-for="child in v.children" :key="child.path" :index="v.path+'/'+child.path">
            <el-icon>
              <component :is="child.meta.icon"></component>
            </el-icon>
          {{child.meta.title}}
        </el-menu-item>
      </el-sub-menu>
      <!--没有子菜单-->
      <el-menu-item v-else-if="v.isMenu" :key="v.path" :index="v.path">
        <el-icon><component :is="v.children[0].meta.icon"></component></el-icon>
        <span>{{v.children[0].meta.title}}</span>
      </el-menu-item>
    </template>
    <!--遍历菜单 end-->

  </el-menu>
</template>

<script setup lang="ts">
import { computed,ref } from 'vue'
import { useRoute } from 'vue-router'
import {useSettingStore} from "../../../store/modules/setting";
import { useMenuStore } from '../../../store/modules/menu'
const route = useRoute();
const SettingStore = useSettingStore()
const { routers } = useMenuStore()

const menuData = ref()
menuData.value = routers

// 是否折叠
const isCollapse = computed(() => !SettingStore.isCollapse)
</script>

<style scoped>
.title h1 {
  font-size: 1.4em;
  font-weight: bold;
  margin: 0;
  display: block;
  text-align: center;
  background-color: #00B890;
  color: white;
  text-decoration: none;
  padding: 10px;
}

.title h1 a {
  color: white;
  text-decoration: none;
}

.title h1 a:hover {
  color: white;
  text-decoration: none;
  cursor: default;
}

.el-menu {
  height: 100%;
  border: 0px;
  background-color: rgb(48, 48, 48);
}
/* 选中 */
:deep(.el-menu-item.is-active) {
  color: white;
  background: #656565;
}

.el-menu-item {
  height: 50px;
  line-height: 50px;
}

</style>
