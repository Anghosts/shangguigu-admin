<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="SPU描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImagesList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有 ${unSaleAttr.length} 项未添加`" v-model="attrInfo">
          <el-option 
            :label="unselect.name" 
            :value="`${unselect.id}:${unselect.name}`" 
            v-for="unselect in unSaleAttr" 
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button 
          type="primary" 
          icon="el-icon-plus" 
          style="margin-left:10px;" 
          :disabled="!attrInfo" 
          @click="addSaleAttr"
        >添加销售属性</el-button>
        <el-table style="width:100%;margin-top:10px;" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="140">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" >
            <template v-slot="{row}">
              <!-- @close="handleClose(tag)" -->
              <el-tag
                :key="tag.id"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{tag.saleAttrValueName}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="$event.target.blur"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="140">
            <template v-slot="{$index}">
              <el-button 
                title="删除"
                icon="el-icon-delete" 
                type="danger" size="mini" 
                @click="spu.spuSaleAttrList.splice($index,1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="saveSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      tradeMarkList: [],  // 品牌信息
      spuImagesList: [],  // spu 图片信息
      saleAttrList: [],   // 销售属性信息
      spu: {
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: '',
        // 品牌id
        tmId: '',
        // spu名称
        spuName: '',
        // spu图片信息
        spuImageList: [
          // {
          //   "id": 0,
          //   "imgName": "string",
          //   "imgUrl": "string",
          //   "spuId": 0
          // }
        ],
        // spu销售属性信息
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       "baseSaleAttrId": 0,
          //       "id": 0,
          //       "isChecked": "string",
          //       "saleAttrName": "string",
          //       "saleAttrValueName": "string",
          //       "spuId": 0
          //     }
          //   ]
          // }
        ]
      },
      attrInfo: ''  // 未添加的销售属性信息
    };
  },
  methods: {
    // 照片墙删除图片的回调
    handleRemove(_, fileList) {
      this.spuImagesList = fileList;
    },
    // 照片墙预览图片的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 照片墙上传图片成功的回调
    handleSuccess(res, file) {
      if (res.code == 200) {
        this.spuImagesList.push(file);
      } else {
        this.$message({type:'error',message:'图片上传失败！'});
      }
    },
    // 初始化 SpuFrom 数据
    async initSpuData(spu) {
      // 获取 spu 信息
      let spuResult = await this.$API.spu.reqGetSpu(spu.id);
      if (spuResult.code == 200) this.spu = spuResult.data
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqGetTradeMark();
      if (tradeMarkResult.code == 200) this.tradeMarkList = tradeMarkResult.data
      // 获取 spu 图片信息
      let spuImagesResult = await this.$API.spu.reqGetSpuImage(spu.id);
      if (spuImagesResult.code == 200) {
        let imagesList = spuImagesResult.data;
        // 添加 name 和 url 属性
        imagesList.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImagesList = imagesList;
      }
      // 获取销售属性
      let saleAttrResult = await this.$API.spu.reqGetBaseSaleAttr();
      if (saleAttrResult.code == 200) this.saleAttrList = saleAttrResult.data
    },
    // 添加销售属性按钮回调
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrInfo.split(':');
      let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList:[] };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrInfo = '';
    },
    // 添加销售属性值
    addSaleAttrValue(row) {
      // 显示 input 框
      this.$set(row, 'inputVisible', true);
      // 收集数据
      this.$set(row, 'inputValue', '');
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 销售属性值 input 失去焦点
    handleInputConfirm(row) {
      row.inputVisible = false;
      // 收集新增的销售属性值
      const { baseSaleAttrId,inputValue } = row;
      // 新增的销售属性值不能为空
      if (inputValue.trim() == '') { return this.$message('销售属性值不能为空！') }
      // 新增的销售属性值不能重复
      let result = row.spuSaleAttrValueList.some(item=>item.saleAttrValueName==inputValue);
      if (result) { return this.$message('销售属性值不能重复！') }
      // 准备对象
      let newSaleAttrValue = { baseSaleAttrId,saleAttrValueName:inputValue };
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue);
    },
    // 添加 spu
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqGetTradeMark();
      if (tradeMarkResult.code == 200) this.tradeMarkList = tradeMarkResult.data
      // 获取销售属性
      let saleAttrResult = await this.$API.spu.reqGetBaseSaleAttr();
      if (saleAttrResult.code == 200) this.saleAttrList = saleAttrResult.data
    },
    // 保存 spu
    async saveSpu() {
      // 整理 spu 图片参数
      this.spu.spuImageList = this.spuImagesList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response&&item.response.data) || item.imgUrl
        }
      })
      // 发送请求，保存数据
      await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      .then(() => {
        this.$message({type:'success',message:'保存成功！'});
        // 切换场景
        this.$emit('changeScene', {scene:0,flag:this.spu.id ? 'edit':'add'});
        // 重置数据
        Object.assign(this._data, this.$options.data());
      }).catch(err => {
        this.$message({type:'error',message:err.data});
      });
    },
    // 取消按钮
    cancel() {
      // 切换场景
      this.$emit('changeScene', {scene:0,flag:''});
      // 重置数据
      Object.assign(this._data, this.$options.data());
    }
  },
  computed: {
    // 未选择的销售属性
    unSaleAttr() {
      return this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(saleItem => {
          return item.name != saleItem.saleAttrName;
        })
      })
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>