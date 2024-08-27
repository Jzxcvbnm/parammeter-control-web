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
    trendChart: {
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
    title: {
        text: 'F-BAM-DAS变化趋势图',
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
    // toolbox: {
    //     feature: {
    //         dataView: { show: true, readOnly: false },
    //         magicType: { show: true, type: ['line', 'bar'] },
    //         restore: { show: true },
    //         saveAsImage: { show: true }
    //     }
    // },
    // legend: {
    //     data: props.legendData
    // },
    xAxis: [
        {
            type: 'category',
            data: ['6月', '7月', '8月', '9月'],
            axisPointer: {
                type: 'shadow'
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '数量',
            min: 0,
            max: 1600,
            interval: 200,
            axisLabel: {
                formatter: '{value}'
            }
        },

    ],
    series: [
        {
            name: '环境变量',
            type: 'bar',
            tooltip: {
                valueFormatter: function (value) {
                    return value + '';
                }
            },
            data: [
                320, 480, 640, 780
            ]
        },
        {
            name: '版本变量',
            type: 'bar',
            tooltip: {
                valueFormatter: function (value) {
                    return value + '';
                }
            },
            data: [
                780, 1020, 1350, 1469
            ]
        },
    ]
};


let chart: EChartsType
const initChart = () => {
    echarts.registerTheme('shine', shine)
    let chart = echarts.init(document.getElementById(props.id), 'walden')
    chart.setOption(options)
    return chart
}

watch([() => props.categoryData, () => props.trendChart], ([newCategoryData, newSeriesData]) => {
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