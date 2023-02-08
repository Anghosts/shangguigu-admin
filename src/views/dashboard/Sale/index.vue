<template>
  <el-card style="margin:10px 0;">
    <div slot="header" class="sale-head">
      <el-row>
        <el-col :span="14" :xs="24" :sm="8" :md="12" :lg="14" :xl="16">
          <el-tabs class="tab" v-model="activeName">
            <el-tab-pane label="销售额" name="sale"></el-tab-pane>
            <el-tab-pane label="访问量" name="visits"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="10" :xs="24" :sm="16" :md="12" :lg="10" :xl="8">
          <div class="right">
            <div class="date-time">
              <span @click="setToday">今日</span>
              <span @click="setWeek">本周</span>
              <span @click="setMonth">本月</span>
              <span @click="setYear">今年</span>
            </div>
            <el-date-picker
              class="date"
              v-model="date"
              value-format="yyyy-MM-dd"
              size="small"
              type="daterange"
              placeholder="选择日期"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </div>
        </el-col>
      </el-row>  
    </div>
    <el-row :gutter="10" class="sale-content">
      <el-col :span="18" :xs="24" :sm="24" :md="24" :xl="18">
        <div class="charts" ref="charts"></div>
      </el-col>
      <el-col :span="6" class="right" :xs="24" :sm="24" :md="24" :xl="6">
        <h3>门店{{title}}排名</h3>
        <ul class="sale-sort">
          <li v-for="sale in saleSort" :key="sale.id">
            <span :class="sale.index <= 3 ? 'rindex':'index'">{{sale.index}}</span>
            <span class="text">{{sale.name}}</span>
            <span class="rvlaue">{{sale.count}}</span>
          </li>
        </ul>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import echarts from 'echarts';
import * as dayjs from 'dayjs';

export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'sale',
      charts: null,
      date: [],
      date2: '',
      saleSort: [
        {id:1,name:'蜜雪冰城',index:1,count:'323,578'},
        {id:2,name:'麦当劳',index:2,count:'315,598'},
        {id:3,name:'汉堡王',index:3,count:'299,354'},
        {id:4,name:'海底捞',index:4,count:'254,668'},
        {id:5,name:'西贝筱面村',index:5,count:'201,129'},
        {id:6,name:'真功夫',index:6,count:'126,259'},
        {id:7,name:'甲功夫',index:7,count:'56,268'},
      ]
    }
  },
  computed: {
    title() {
      return this.activeName == 'sale' ? '销售额' : '访问量';
    }
  },
  watch: {
    title() {
      this.charts.setOption({
        title: { text: this.title + '趋势' }
      })
    }
  },
  methods: {
    setToday() {
      let day = dayjs().format('YYYY-MM-DD');
      this.date = [day,day];
    },
    setWeek() {
      let start = dayjs().day(1).format('YYYY-MM-DD');
      let end = dayjs().day(7).format('YYYY-MM-DD');
      this.date = [start, end];
    },
    setMonth() {
      let start = dayjs().startOf('month').format('YYYY-MM-DD');
      let end = dayjs().endOf('month').format('YYYY-MM-DD');
      this.date = [start, end];
    },
    setYear() {
      let start = dayjs().startOf('year').format('YYYY-MM-DD');
      let end = dayjs().endOf('year').format('YYYY-MM-DD');
      this.date = [start, end];
    }
  },
  mounted() {
    this.charts = echarts.init(this.$refs.charts);
    this.charts.setOption({
      title: {
        text: '销售额趋势',
        textStyle: {
          fontSize: 19
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '销售额',
          type: 'bar',
          barWidth: '40%',
          color: '#5170c8',
          data: [10, 52, 200, 334, 390, 330, 220, 125, 69, 85, 299, 257]
        }
      ]
    })
  }
}
</script>

<style lang="scss" scoped>
.sale-head {
  .tab {
    width: 100%;
  }

  .right {
    display: flex;
    align-items: center;
    .date-time {
      min-width: 176px;
      >span {
        margin: 0 8px;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: #409EFF;
        }
      }
    }
    .date {
      flex: 1;
      margin-left: 25px;
    }
  }
}

.sale-content {
  .charts {
    width: 100%;
    height: 470px;
  }
  .right {
    h3 {
      margin: 0;
      margin-bottom: 30px;
    }
  }
  .sale-sort {
    padding: 0;
    padding-left: 4px;
    li {
      padding-right: 20px;
      height: 46px;
      list-style: none; 
      .rindex {
        float: left;
        margin-right: 20px;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        text-align: center;
        line-height: 20px;
        color: #fff;
        background-color: #2b2b2b;
      }
      .index {
        float: left;
        margin-right: 20px;
        width: 20px;
        height: 20px;
        text-align: center;
      }
      .text {
        font-size: 18px;
      }
      .rvlaue {
        float: right;
        font-size: 18px;
      }
    }
  }
}

::v-deep .el-tabs__item {
  font-size: 20px;
}
::v-deep #tab-销售额 {
  padding: 0;
}
::v-deep .el-tabs__header {
  margin-bottom: 0;
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0;
}
::v-deep .el-card__header {
  padding-bottom: 0;
}
::v-deep .el-date-editor--daterange.el-input__inner {
  width: 100%;
}

@media screen and (max-width: 580px) {
  .sale-head {
    .right {
      flex-direction: column;
      align-items: flex-start;

      .date-time {
        margin: 10px 0 5px;
      }
      .date {
        margin-left: 0;
      }
    }
  }
  .sale-content {
    .right {
      margin-top: 10px;
    }
  }
}
@media screen and (max-width: 768px) {
  .sale-head {
    .right {
      margin-bottom: 8px;
    }
  }
}
</style>