<template>
  <el-row :gutter="16">
    <el-col :span="6">
      <div class="statistic-card">
        <el-statistic :value=totalParamAmount>
          <template #title>
            <div style="display: inline-flex; align-items: center">
              总参数量
            </div>
          </template>
        </el-statistic>

      </div>
    </el-col>
    <el-col :span="6">
      <div class="statistic-card">
        <el-statistic :value=envParamAmount>
          <template #title>
            <div style="display: inline-flex; align-items: center">
              环境变量
            </div>
          </template>
        </el-statistic>

      </div>
    </el-col>
    <el-col :span="6">
      <div class="statistic-card">
        <el-statistic :value=versionParamAmount>
          <template #title>
            <div style="display: inline-flex; align-items: center">
              版本变量
            </div>
          </template>
        </el-statistic>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="statistic-card">
        <el-statistic :value=publicParamAmount>
          <template #title>
            <div style="display: inline-flex; align-items: center">
              公共变量
            </div>
          </template>
        </el-statistic>
      </div>
    </el-col>
  </el-row>

  <!--echarts start-->
  <el-row :gutter="5">
    <el-col :span="12">
      <Trend :chartData="trendChart" :legendData="legendData" height="500px" width="100%" id="trend-chart" />
    </el-col>
    <el-col :span="12">
      <Frequency :chartData="frequencyChart" height="500px" width="100%" id="frequency-chart" />
    </el-col>
  </el-row>
  <!--echarts end-->
</template>


<script setup lang="ts">
import { ArrowRight, CaretBottom, CaretTop, Warning, } from '@element-plus/icons-vue'
import { ElNotification } from "element-plus";
import { ref, onMounted, computed } from 'vue'
import { getParamTotalView } from '../../api/param/paramInfo';
import Trend from './components/Trend.vue'
import Frequency from './components/Frequency.vue'

const totalParamAmount = ref(10025)
const envParamAmount = ref(3512)
const versionParamAmount = ref(6411)
const publicParamAmount = ref(102)
const trendChart = ref([])
const legendData = ['环境变量', '版本变量']
const frequencyChart = ref([])

const loadData = () => {
  const res = getParamTotalView()
  if (res.code === 200) {
    ElNotification({
      title: '获取参数视图成功',
      message: '获取参数视图成功',
      type: 'success'
    });
    totalParamAmount.value = res.data.totalParamAmount
    envParamAmount.value = res.data.envParamAmount
    versionParamAmount.value = res.data.versionParamAmount
    publicParamAmount.value = res.data.publicParamAmount
    trendChart.push(res.data.trendChart)
    frequencyChart.push(res.data.frequencyChart)
  }
  else {
    ElNotification({
      title: '获取参数视图失败',
      message: '获取参数视图失败',
      type: 'error'
    });
  }
}

onMounted(() => {
  // loadData()
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

:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}
</style>