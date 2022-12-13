<template>
  <el-card>
    <div class="card-header">
      <span>{{title}}</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="card-content">{{count}}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Card',
  props: ['title', 'count']
}
</script>

<style lang="scss" scoped>
  .card-header {
    display: flex;
    justify-content: space-between;
    color: #aaa;
    i {
      color: #c2c2c2;
    }
  }
  .card-content {
    padding: 7px 0;
    font-size: 24px;
  }
  .card-charts {
    height: 60px;
  }
  .card-footer {
    padding: 10px 0 0;
    margin-top: 3px;
    border-top: 1px solid #eee;
  }
</style>