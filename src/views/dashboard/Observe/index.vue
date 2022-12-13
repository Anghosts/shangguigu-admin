<template>
  <el-row :gutter="10">
    <el-col :span="12"><Search /></el-col>
    <el-col :span="12"><Category /></el-col>
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
  
</style>