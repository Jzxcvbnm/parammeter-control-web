<template>
    <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { EChartsType } from 'echarts/core'
import { onMounted, watch } from 'vue'
import shine from '../../../assets/subjects/shine.json';
let props = defineProps({
    legendData: {
        type: Array,
        default: []
    },
    categoryData: {
        type: Array,
        default: []
    },
    frequencyChart: {
        type: Array,
        default: []
    },
    className: {
        type: String,
        default: 'chart',
    },
    config: {
        type: Object,
        default: () => { },
    },
    id: {
        type: String,
        default: 'chart',
    },
    width: {
        type: String,
        default: '200px',
    },
    height: {
        type: String,
        default: '200px',
    },
})

const options = {
    dataset: [
        {
            dimensions: ['param', 'freq'],
            source: [
                ['信用等级', 6],
                ['最低还款额', 5],
                ['贷款类型', 5],
                ['贷款最大利率', 4],
                ['加密算法', 3],
                ['核心线程数', 3],
                ['存款利率', 2],
                ['贷款利率', 2],
                ['信用卡分期', 2],
                ['用户权限', 1]
            ]
        },
        {
            transform: {
                type: 'sort',
                config: { dimension: 'freq', order: 'asc' }
            }
        }
    ],
    title: {
        text: '变量变化频率top10',
        left: 'center'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    xAxis: {
        type: 'value',
        // name: '修改频率'
    },
    yAxis: {
        type: 'category',
        data: ['用户权限', '信用卡分期', '贷款利率', '存款利率', '核心线程数', '加密算法', '贷款最大利率', '贷款类型', '最低还款额', '信用等级'],
        axisLabel: { interval: 0 }
    },
    series: {
        type: 'bar',
        encode: { x: 'freq', y: 'param' },
        datasetIndex: 1,
        label: {
            show: true,
            position: 'right' // 设置标签显示在柱的右侧
        }
    }
};


let chart: EChartsType
const initChart = () => {
    echarts.registerTheme('shine', shine)
    let chart = echarts.init(document.getElementById(props.id), 'walden')
    chart.setOption(options)
    return chart
}

watch([() => props.categoryData, () => props.frequencyChart], ([newCategoryData, newSeriesData]) => {
    console.log(`x is ${newCategoryData} and y is `, newSeriesData)
    options.series = newSeriesData
    options.xAxis.data = newCategoryData
    initChart()
})

onMounted(() => {
    chart = initChart()
    window.addEventListener('resize', function () {
        chart && chart.resize()
    })
})
</script>