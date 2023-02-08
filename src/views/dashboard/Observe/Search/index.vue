<template>
  <el-card>
    <div slot="header" class="search-head">
      <span>线上热门搜索</span>
      <el-dropdown  style="float:right;">
        <i class="el-icon-more head-select"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-row :gutter="40">
      <el-col :span="12" class="left" :xs="24">
        <span>搜索用户数</span> <i class="el-icon-info"></i>
        <p>
          <span class="count">123321</span> 
          <span>17.2</span> <i class="el-icon-caret-top"></i>
        </p>
        <LineChart />
      </el-col>
      <el-col :span="12" class="right" :xs="24">
        <span>人均搜索次数</span> <i class="el-icon-info"></i>
        <p>
          <span class="count">15</span> 
          <span>2.5</span> <i class="el-icon-caret-top"></i>
        </p>
        <LineChart />
      </el-col>
    </el-row>
    <el-table style="width:100%;margin:20px 0 10px;" border>
      <el-table-column label="排名" :width="styles.dashboardTableWidth" type="index" align="center">
      </el-table-column>
      <el-table-column prop="prop" label="搜索关键字" :width="styles.dashboardTableWidth">
      </el-table-column>
      <el-table-column prop="prop" label="用户数" :width="styles.dashboardTableWidth" sortable>
      </el-table-column>
      <el-table-column prop="prop" label="周涨幅" :width="styles.dashboardTableWidth" sortable>
      </el-table-column>
    </el-table>
    <el-pagination
      align="center"
      layout="prev, pager, next"
      :page-size="5"
      :total="0">
    </el-pagination>
  </el-card>
</template>

<script>
import LineChart from '@/views/dashboard/Observe/Search/LineChart';

export default {
  name: 'Search',
  data() {
    return {
      styles: {}
    }
  },
  components: {
    LineChart
  },
  mounted() {
    // 获取布局参数
    this.styles = this.$store.state.styles
  }
}
</script>

<style lang="scss" scoped>
.search-head {
  line-height: 32px;
  >span {
    font-size: 18px;
  }
}
.head-select {
  cursor: pointer;
  &:hover {
    color: #48c6ef;
  }
}
.left,
.right {
  >span {
    margin-right: 5px;
    color: #aaa;
  }
  >i {
    color: #c2c2c2;
  }
  p {
    .count {
      margin-right: 15px;
      font-size: 24px;
    }
  }
}
</style>