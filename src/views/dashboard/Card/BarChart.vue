<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'BarChart',
  mounted() {
    // 初始化 echarts 
    let lineChart = echarts.init(this.$refs.charts);
    lineChart.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'bar',
          data: [55,23,45,22,32,52,63,29,35,11,22],
          color: '#5170c8'
        }
      ],
      grid: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style lang="scss" scoped>
  .charts {
    height: 100%;
  }
</style>