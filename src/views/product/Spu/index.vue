<template>
  <div>
    <el-card style="margin-bottom:20px;">
      <CategorySelect @getAttrList="getCategoryId" :isShowTable="scene==0"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene==0">
        <!-- 添加spua按钮 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="records.length==0" @click="addSpu">添加SPU</el-button>
        <!-- spu数据列表 -->
        <el-table :data="records" style="width:100%; margin-top:20px;" border v-loading="listLoading">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述">
          </el-table-column>
          <el-table-column prop="prop" label="操作">
            <template v-slot="{row}">
              <el-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="editSpu(row)"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="showSkuTable(row)"></el-button>
              <el-popconfirm :title="`你确定删除【 ${row.spuName} 】吗？`" @onConfirm="deleteSpu(row)" style="margin-left:10px;">
                <el-button 
                  slot="reference" 
                  type="danger" 
                  icon="el-icon-delete" 
                  size="mini" 
                  title="删除spu"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          style="text-align:center; margin-top:20px;"
          background
          layout="prev, pager, next, jumper, ->,sizes, total"
          :total="total"
          :page-size="limit"
          :page-sizes="[5,10,20]"
          :current-page="page"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
        <!-- sku列表 -->
        <el-dialog :title="`${skuTableTitle}`" :visible.sync="skuTable" @close="skuTableList=[]">
          <el-table :data="skuTableList" style="width: 100%" border v-loading="skuTableLoading">
            <el-table-column  prop="skuName" label="名称">
            </el-table-column>
            <el-table-column  prop="price" label="价格(元)">
            </el-table-column>
            <el-table-column  prop="weight" label="重量(千克)">
            </el-table-column>
            <el-table-column  prop="prop" label="默认图片">
              <template v-slot="{row}">
                <el-image style="width: 100px; height: 100px" :src="row.skuDefaultImg"></el-image>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </div>
      <SpuForm v-show="scene==1" @changeScene="changeScene" ref="spuForm"/>
      <SkuForm v-show="scene==2" @changeScene="changeScene" ref=skuForm />
    </el-card>
  </div>
</template>

<script>
import { reqGetSpuList } from '@/api/product/spu';
import SpuForm from './SpuForm';
import SkuForm from './SkuForm';

export default {
  name: 'Spu',
  components: {
    SpuForm, 
    SkuForm
  },
  data() {
    return {
      categoryId: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      // spu数据
      records: [],
      // spu数据页码
      page: 1,
      // spu数据一页展示数量
      limit: 5,
      // spu数据总数
      total: 0,
      // 场景值，0: 展示spu数据(默认)  1: 添加spu|修改spu  2: 添加sku
      scene: 0,
      // 数据表格加载状态
      listLoading: false,
      // sku 列表显示状态
      skuTable: false,
      // sku 列表标题
      skuTableTitle: '',
      // sku 列表数据
      skuTableList: [],
      // sku 列表加载状态
      skuTableLoading: false
    }
  },
  methods: {
    // 三级联动的自定义事件，获取 CategoryId，并发送请求获取 spu 数据
    getCategoryId(categoryId) {
      this.categoryId = categoryId;
      // 获取 spu 数据
      this.getSpuList();
    },
    // 获取 spu 数据
    async getSpuList() {
      this.listLoading = true;
      const { page,limit,categoryId } = this;
      // page: 当前页码，limit: 一页展示几条数据，category3Id: 3Id
      await reqGetSpuList(page, limit, categoryId.category3Id)
      .then(result => {
        this.records = result.data.records;
        this.total = result.data.total;
      }).catch(err => {
        console.log(err);
      });
      this.listLoading = false;
    },
    // 分页器切换页码
    handleCurrentChange(pager) {
      this.page = pager;
      this.getSpuList();
    },
    // 分页器切换页面展示数量
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加 SPU 按钮回调
    addSpu() {
      this.scene = 1;
      this.$refs.spuForm.addSpuData(this.categoryId.category3Id);
    },
    // 修改 SPU 按钮回调
    editSpu(row) {
      this.scene = 1;
      this.$refs.spuForm.initSpuData(row);
    },
    // 切换场景值自定义事件回调
    changeScene(data) {
      this.scene = data.scene;
      if (data.flag == 'add') {
        this.page = 1;
        this.getSpuList();
      } else {
        this.getSpuList();
      }
    },
    // 删除 spu 按钮
    async deleteSpu(row) {
      await this.$API.spu.reqDeleteSpu(row.id).then(() => {
        // 删除成功
        this.$message({type:'success',message:'删除成功！'});
        // 判断当前页数据是否大于 1，如果数据大于 1 则停留在当前页，否则再判断当前页码是否也大于 1 ，为真停留在上一页，否则停留在第一页
        this.page = this.records.length > 1 ? this.page : (this.page > 1 ? this.page - 1 : 1);
        this.getSpuList();
      }).catch((err) => {
        // 删除失败
        this.$message({type:'error',message:err.data});
      })
    },
    // 添加 sku 按钮
    addSku(row) {
      this.scene = 2;
      this.$refs.skuForm.initSkuData(this.categoryId, row);
    },
    // 显示 sku 列表
    async showSkuTable(row) {
      this.skuTable = true;
      // 获取标题
      this.skuTableTitle = row.spuName;
      // 显示加载
      this.skuTableLoading = true;
      // 发送请求，获取 sku 列表数据
      await this.$API.spu.reqGetSkuList(row.id).then(result => {
        this.skuTableList = result.data;
        this.skuTableLoading = false;
      }).catch(() => {
        this.skuTableLoading = false;
      })
    }
  }
}
</script>

<style lang="less" scoped>
  
</style>