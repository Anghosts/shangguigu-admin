<template>
  <div class="dashboard-container">
    <el-row :gutter="10">
      <el-col :span="6" :xs="24" :sm="12" :md="12" :lg="6">
        <Card title="总销售额" count="￥123456">
          <template v-slot:charts>
            <div class="sales">
              <span>周同比 56.67% <i class="el-icon-caret-top"></i></span>
              <span style="margin-left:10px;">日同比 19.16% <i class="el-icon-caret-bottom"></i></span>
            </div>
          </template>
          <template v-slot:footer>
            <span>日销售额 &yen;123456</span>
          </template>
        </Card>
      </el-col>
      <el-col :span="6" :xs="24" :sm="12" :md="12" :lg="6">
        <Card title="访问量" :count="456789">
          <template v-slot:charts>
            <LineChart />
          </template>
          <template v-slot:footer>
            <span>日访问量 123456</span>
          </template>
        </Card>
      </el-col>
      <el-col :span="6" :xs="24" :sm="12" :md="12" :lg="6">
        <Card title="支付笔数" :count="987654">
          <template v-slot:charts>
            <BarChart />
          </template>
          <template v-slot:footer>
            <span>折化率 65%</span>
          </template>
        </Card>
      </el-col>
      <el-col :span="6" :xs="24" :sm="12" :md="12" :lg="6">
        <Card title="运营活动效果" count="78%">
          <template v-slot:charts>
            <ProgressChart />
          </template>
          <template v-slot:footer>
            <span>周同比 46.13% <i class="el-icon-caret-top"></i></span>
            <span style="margin-left:10px;">日同比 5.75% <i class="el-icon-caret-bottom"></i></span>
          </template>
        </Card>
      </el-col>
    </el-row>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Card from '@/views/dashboard/Card';
import LineChart from '@/views/dashboard/Card/LineChart';
import BarChart from '@/views/dashboard/Card/BarChart';
import ProgressChart from '@/views/dashboard/Card/ProgressChart';
import Sale from '@/views/dashboard/Sale';
import Observe from '@/views/dashboard/Observe';

export default {
  name: 'Dashboard',
  components: {
    Card,
    LineChart,
    BarChart,
    ProgressChart,
    Sale,
    Observe
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 0px;
    ::v-deep .el-icon-caret-top {
        color: red;
    }
    ::v-deep .el-icon-caret-bottom {
      color: #00c000;
    }
    .sales {
      position: relative;
      top: 35px;
      span {
        font-size: 14px;
      }
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
