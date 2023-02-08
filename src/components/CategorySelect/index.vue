<template>
  <div>
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select 
          placeholder="请选择" 
          v-model="formData.category1Id"
          @change="getCategoryList(formData.category1Id, 1)"
          :disabled="!isShowTable"
        >
          <el-option 
            v-for="categoty in categoty1List"
            :key="categoty.id"
            :label="categoty.name" 
            :value="categoty.id"
          >{{categoty.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select 
          placeholder="请选择" 
          v-model="formData.category2Id"
          @change="getCategoryList(formData.category2Id, 2)"
          :disabled="!isShowTable"
        >
          <el-option
            v-for="categoty in categoty2List"
            :key="categoty.id"
            :label="categoty.name" 
            :value="categoty.id"
          >{{categoty.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select 
          placeholder="请选择" 
          v-model="formData.category3Id"
          @change="getCategoryList(formData.category3Id, 3)"
          :disabled="!isShowTable"
        >
          <el-option 
            v-for="categoty in categoty3List"
            :key="categoty.id"
            :label="categoty.name" 
            :value="categoty.id"
          >{{categoty.name}}</el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['isShowTable'],
  data() {
    return {
      categoty1List: [],
      categoty2List: [],
      categoty3List: [],
      formData: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      }
    }
  },
  methods: {
    // 一级分类
    async getCategory1List() {
      let result = await this.$API.attr.reqGetCategoty1();
      this.categoty1List = result.data;
    },
    async getCategoryList(categoryId, level) {
      // 获取二级分类
      if (level == 1) {
        this.formData.category2Id = '';
        this.formData.category3Id = '';
        let result = await this.$API.attr.reqGetCategoty2(categoryId);
        this.categoty2List = result.data;
      // 获取三级分类
      } else if (level == 2) {
        this.formData.category3Id = '';
        let result = await this.$API.attr.reqGetCategoty3(categoryId);
        this.categoty3List = result.data;
      // 发送请求获取属性数据
      } else {
        this.$emit('getAttrList', this.formData);
      }
    },
  },
  mounted() {
    // 请求获取一级分类标签的数据
    this.getCategory1List();
  }
}
</script>

<style  scoped>
  @media screen and (max-width:480px) {
    .demo-form-inline {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: center;
    }
  }
</style>