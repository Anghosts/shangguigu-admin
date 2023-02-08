<template>
  <el-row :gutter="10" class="observe">
    <el-col class="mb" :span="12" :xs="24" :sm="24" :md="12"><Search /></el-col>
    <el-col class="mb" :span="12" :xs="24" :sm="24" :md="12"><Category /></el-col>
  </el-row>
</template>

<script>
import Search from '@/views/dashboard/Observe/Search';
import Category from '@/views/dashboard/Observe/Category';

export default {
  name: 'Observe',
  components: {
    Search,
    Category
  }
}
</script>

<style lang="scss" scoped>
  .mb {
    margin-bottom: 5px;
  }
</style>