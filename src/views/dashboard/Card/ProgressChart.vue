<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'ProgressChart',
  mounted() {
    // 初始化 echarts 
    let lineChart = echarts.init(this.$refs.charts);
    lineChart.setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: [75],
          color: 'yellowgreen',
          barWidth: 10,
          showBackground: true,
          label: {
            show: true,
            formatter: '|',
            position: 'right'
          }

        }
      ],
      grid: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .charts {
    height: 100%;
  }
</style>