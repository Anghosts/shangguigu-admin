<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">{{spuName}}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="sku名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" v-model="skuInfo.skuDesc" placeholder="规格描述" rows="4"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item 
            :label="attr.attrName" 
            v-for="attr in spuAttrList" 
            :key="attr.id"
            style="margin-bottom:5px;">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option 
                :label="attrValue.valueName" 
                :value="`${attr.id}:${attrValue.id}`" 
                v-for="attrValue in attr.attrValueList" 
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item 
          :label="sale.saleAttrName" 
          v-for="sale in spuSaleAttrList" 
          :key="sale.id" 
          style="margin-bottom:5px;">
            <el-select v-model="sale.saleIdAndValueId" placeholder="请选择">
              <el-option 
                :label="saleValue.saleAttrValueName" 
                :value="`${sale.id}:${saleValue.id}`" 
                v-for="saleValue in sale.spuSaleAttrValueList" 
                :key="saleValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表"></el-form-item>
    </el-form>
    <el-table style="width: 100%" :data="spuImagesList" border @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        :width="styles.tableIndexWidth"
        align="center">
      </el-table-column>
      <el-table-column prop="" label="图片" :width="styles.skuWidth">
        <template v-slot="{row}">
          <el-image style="width: 100px; height: 100px" :src="row.imgUrl"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="imgName" label="名称" :width="styles.skuWidth">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="105">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" v-if="row.isDefault == 0" @click="changeDefault(row)">设为默认</el-button>
          <el-tag type="success" v-else :disable-transitions="true">默认</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:10px;">
      <el-button type="primary" @click="saveSku">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  props: ['styles'],
  data() {
    return {
      baseImgUrl: 'http://139.198.127.41:9000/sph/20221123/',
      spuImagesList: [],    // 图片信息
      spuSaleAttrList: [],  // 销售属性
      spuAttrList: [],      // 平台属性
      spuName: '',          // spu名称
      skuInfo: {
        category3Id: 0,
        price: 0,
        spuId: 0,
        tmId: 0,
        skuName: '',
        weight: 0,
        skuDesc: '',
        skuDefaultImg: '',
        // 平台属性
        skuAttrValueList: [],
        // 图片信息
        skuImageList: [],
        // 销售属性
        skuSaleAttrValueList: [],
      }
    }
  },
  methods: {
    // 初始化 sku 数据
    async initSkuData(categoryId, spu) {
      this.spuName = spu.spuName;
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      // 获取图片信息
      await this.$API.spu.reqGetSpuImage(spu.id).then(result => {
        let imgList = result.data;
        imgList.forEach(item => { 
          // 添加 isDefault 属性
          item.isDefault = 0;
          // 如果图片地址为空并且存在图片名称，我会尝试拼接一个地址
          if (!item.imgUrl && item.imgName) item.imgUrl = this.baseImgUrl + item.imgName;
        });
        this.spuImagesList = imgList;
      }).catch(err => {
        console.log(err);
      })
      // 获取销售属性
      await this.$API.spu.reqGetSaleAttr(spu.id).then(result => {
        this.spuSaleAttrList = result.data;
      }).catch(err => {
        console.log(err);
      })
      // 获取平台属性
      await this.$API.spu.reqGetAttrInfo(categoryId).then(result => {
        this.spuAttrList = result.data;
      }).catch(err => {
        console.log(err);
      })
    },
    // 图片列表选择图片
    handleSelectionChange(params) {
      this.skuInfo.skuImageList = params;
    },
    // 图片列表设置为默认
    changeDefault(row) {
      this.spuImagesList.forEach(item => { item.isDefault = 0 });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl || '';
    },
    // 取消按钮
    cancel() {
      // 切换场景
      this.$emit('changeScene', {scene:0});
      // 重置数据
      Object.assign(this._data, this.$options.data());
    },
    async saveSku() {
      // 整理参数
      const { spuSaleAttrList,spuAttrList,skuInfo } = this;
      // 整理平台属性参数
      skuInfo.skuAttrValueList = spuAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':');
          prev.push({attrId, valueId});
        }
        return prev;
      }, []);
      // 整理销售属性参数
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleIdAndValueId) {
          const [saleId, valueId] = item.saleIdAndValueId.split(':');
          prev.push({saleId, valueId});
        }
        return prev;
      }, []);
      // 整理图片参数
      skuInfo.skuImageList = skuInfo.skuImageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // 发送请求，保存
      await this.$API.spu.reqAddSku(skuInfo).then(() => {
        this.$message({type:'success',message:'保存成功！'});
        // 切换场景
        this.$emit('changeScene', {scene:0});
        // 重置数据
      Object.assign(this._data, this.$options.data());
      }).catch(() => {});
    }
  }
}
</script>

<style>

</style>