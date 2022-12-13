<template>
  <el-card>
    <div slot="header" class="category-head">
      <span>销售额类别占比</span>
      <el-radio-group size="small" v-model="channelValue">
        <el-radio-button label="全部渠道" ></el-radio-button>
        <el-radio-button label="线上"></el-radio-button>
        <el-radio-button label="门店"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="charts" ref="charts"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'category',
  data() {
    return {
      channelValue: '全部渠道'
    }
  },
  mounted() {
    let charts = echarts.init(this.$refs.charts);
    charts.setOption({
      title: {
        text: '',
        subtext: '',
        top: 'center',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside'
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    })
    charts.on('mouseover', params => {
      let {name, value} = params.data;
      charts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.category-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  >span {
    font-size: 18px;
  }
}
.charts {
  height: 320px;
}
</style>