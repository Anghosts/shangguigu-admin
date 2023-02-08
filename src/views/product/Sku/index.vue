<template>
  <div>
    <!-- 表格 -->
    <el-table :data="records" style="width: 100%" border v-loading="loading" height="600">
      <el-table-column type="index" label="序号" :width="styles.tableIndexWidth" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" :width="styles.skuWidth">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" :width="styles.skuWidth">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="140" align="center">
        <template v-slot="{row}">
          <el-image :style="{widht:styles.skuImgWidth,height:styles.skuImgWidth}" :src="row.skuDefaultImg"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="100">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="100">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="250">
        <template v-slot="{row}">
          <el-button 
            type="success" 
            icon="el-icon-top" 
            size="mini" 
            title="上架" 
            v-if="row.isSale==0"
            @click="sale(row)"
            style="margin:var(--button-margin);"
          >上架</el-button>
          <el-button
           type="success"
           icon="el-icon-bottom" 
           size="mini" 
           title="下架"
           v-else 
           @click="cancelSale(row)"
           style="margin:var(--button-margin);"
          >下架</el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" title="编辑" @click="edit" style="margin:var(--button-margin);"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" title="详情" @click="showSkuInfo(row)" style="margin:var(--button-margin);"></el-button>
          <el-popconfirm :title="`你确定删除【 ${row.skuName} 】吗？`" @onConfirm="deleteSku(row.id)">
            <el-button 
              slot="reference"
              type="danger" 
              icon="el-icon-delete" 
              size="mini" 
              title="删除"
              style="margin:var(--button-margin);"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页  -->
    <el-pagination
      style="margin-top:20px;"
      align="center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 20]"
      :page-size="limit"
      :layout="styles.paginationLayout"
      :pager-count="styles.paginationCount"
      :total="total"
      background>
    </el-pagination>
    <!-- sku 详情 -->
    <el-drawer :visible.sync="drawer" :with-header="false" :size="styles.skuDrawerSize">
      <el-row :gutter="20">
        <el-col :span="6" :xs="8">名称</el-col>
        <el-col :span="16" :xs="14">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :xs="8">描述</el-col>
        <el-col :span="16" :xs="14">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :xs="8">价格</el-col>
        <el-col :span="16" :xs="14">{{skuInfo.price}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :xs="8">平台属性</el-col>
        <el-col :span="16" :xs="14">
          <el-tag 
            style="margin-right:10px;"
            type="success" 
            v-for="attr in skuInfo.skuAttrValueList" 
            :key="attr.id"
          >{{attr.attrId}}-{{attr.valueId}}</el-tag>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :xs="8">商品图片</el-col>
        <el-col :span="16" :xs="14">
          <el-carousel 
            :interval="5000" 
            indicator-position="none" 
            :style="{width:styles.skuDrawerImgWidth}" 
            :height="styles.skuDrawerImgWidth"
          >
            <el-carousel-item v-for="image in skuInfo.skuImageList" :key="image.id">
              <el-image 
                style="border:1px solid #eee;" 
                :styles="{width:styles.skuDrawerImgWidth}"
                :src="image.imgUrl"
              ></el-image>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,
      limit: 5,
      total: 0,
      // sku 列表数据
      records: [],
      // 列表加载状态
      loading: false,
      // sku 详情信息
      skuInfo: {},
      // sku 详情显示状态
      drawer: false,
      // 布局参数
      styles: {}
    }
  },
  methods: {
    // 获取 sku 数据
    async getSkuList() {
      this.loading = true;
      await this.$API.sku.reqGetSkuList(this.page, this.limit).then(result => {
        this.total = result.data.total;
        this.records = result.data.records;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    // 分页器切换页码
    handleSizeChange(limit) {  
      this.limit = limit;
      this.getSkuList();
    },
    // 分页器切换页面展示数量
    handleCurrentChange(pager) {
      this.page = pager;
      this.getSkuList();
    },
    // 上架
    async sale(row) {
      await this.$API.sku.reqOnSale(row.id).then(() => {
        this.$message({type:'success',message:'上架成功！'})
        this.getSkuList();
      }).catch(()=>{})
    },
    // 下架
    async cancelSale(row) {
      await this.$API.sku.reqCancelSale(row.id).then(() => {
        this.$message({type:'success',message:'下架成功！'})
        this.getSkuList();
      }).catch(()=>{})
    },
    // 编辑
    edit() {
      this.$message({type:'info',message:'该功能正在开发中...'});
    },
    // 显示 sku 详情信息
    async showSkuInfo(row) {
      this.drawer = true;
      await this.$API.sku.reqGetSkuInfo(row.id).then(result => {
        this.skuInfo = result.data;
      }).catch(err => {
        console.log(err);
      })
    },
    // 删除 sku
    async deleteSku(skuId) {
      await this.$API.sku.reqDeleteSku(skuId).then(() => {
        this.$message({type:'success',message:'删除成功！'})
        this.getSkuList();
      }).catch(()=>{})
    }
  },
  mounted() {
    this.getSkuList()
    // 获取布局参数
    this.styles = this.$store.state.styles
  }
}
</script>

<style  scoped>
  .el-row {
    margin-top: 20px;
  }
  .el-row .el-col-6 {
    line-height: 2;
    text-align: right;
    font-weight: bold;
    font-size: 1.125em;
  }
  .el-row .el-col-16 {
    line-height: 2;
    font-size: 1.125em;
    text-align: justify;
  }
</style>
