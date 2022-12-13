<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'LineChart',
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
          type: 'line',
          data: [55,23,75,22,88,52,78,29,92],
          // 平滑曲线
          smooth: true,
          // 折点
          itemStyle: {
            opacity: 0
          },
          // 线条
          lineStyle: {
            color: '#9271cf'
          },
          // 填充
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                  offset: 0, color: '#9271cf' // 0% 处的颜色
              }, {
                  offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ],
      grid: {
        top: 0,
        left: -40,
        bottom: 0,
        right: -40
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