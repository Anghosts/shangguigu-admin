<template>
  <div class="attr">
    <el-card style="margin-bottom:20px;">
      <CategorySelect @getAttrList="getAttrList" :isShowTable="isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示属性表格 -->
      <div v-show="isShowTable">
        <el-button 
          type="primary" 
          icon="el-icon-plus" 
          :disabled="!categoryId.category3Id"
          @click="addAttr"
        >添加属性</el-button>
        <!-- 表格 -->
        <el-table style="margin-top:20px;" border :data="attrList" v-loading="listLoading" height="500">
          <el-table-column type="index" label="序号" :width="styles.tableIndexWidth" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="160">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" :width="styles.attrValueWdith">
            <template slot-scope="{row}">
              <el-tag 
                type="success"
                v-for="attrValue in row.attrValueList" 
                :key="attrValue.id"
                style="margin:0 5px 5px 0;"
              >
                {{attrValue.valueName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="120">
            <template v-slot="{row}">
              <el-button 
                type="warning" 
                icon="el-icon-edit" 
                :size="styles.buttonSize" 
                title="修改"
                @click="editAttr(row)"
              ></el-button>
              <el-popconfirm :title="`你确定删除【 ${row.attrName} 】吗？`" @onConfirm="delAttr(row)" style="margin-left:10px;">
                <el-button 
                  slot="reference" 
                  type="danger" 
                  icon="el-icon-delete" 
                  :size="styles.buttonSize"  
                  title="删除"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" :model="attrInfo">
          <el-form-item label="属性名称" >
            <el-input placeholder="请输入属性名称" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button 
          type="primary" 
          icon="el-icon-plus" 
          :disabled="!isAttrAuth || !attrInfo.attrName"
          @click="addAttrValue"
        >添加属性值</el-button>
        <el-table border style="margin:20px 0;" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="prop" label="属性值名称">
            <template slot-scope="{row,$index}">
              <el-input 
                v-model="row.valueName" 
                placeholder="请输入属性值" 
                size="mini"
                v-if="row.isEdit"
                @blur="toLook(row, $index)"
                @keyup.native.enter="row.isEdit = false"
                :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row,$index)" style="display:block;">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{row,$index}">
              <el-button 
                type="warning" 
                size="mini" 
                icon="el-icon-edit" 
                @click="toEdit(row,$index)"
              ></el-button>
              <el-popconfirm 
                :title="`你确定删除【${row.valueName}】这个属性值吗？`" 
                @onConfirm="deleteAttr($index)"
              >
                <el-button 
                  slot="reference"
                  type="danger" 
                  size="mini" 
                  icon="el-icon-delete" 
                  style="margin-left:10px;"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button 
          type="primary" 
          :disabled="attrInfo.attrValueList.length==0 || !attrInfo.attrName || !isAttrAuth"
          @click="addOrUpdateAttr"
        >保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  data() {
    return {
      categoryId: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      // 平台属性
      attrList: [],
      isShowTable: true,
      // 添加平台属性的请求参数
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
      // 表格属性数据加载状态
      listLoading: false,
      // 属性值验证是否通过
      isAttrAuth: true,
      styles: {}
    }
  },
  methods: {
    async getAttrList(categoryId, loading=true) {
      // 显示加载
      this.listLoading = loading;
      // 解构数据
      let {category1Id,category2Id,category3Id} = categoryId;
      this.categoryId = categoryId;
      // 发送请求，获取属性数据
      let result = await this.$API.attr.reqGetAttrList(category1Id,category2Id,category3Id);
      this.attrList = result.data;
      // 加载完成
      this.listLoading = false;
    },
    // 添加属性值按钮
    addAttrValue() {
      // 暂时不能再继续添加属性值，禁用添加属性值按钮
      this.isAttrAuth = false;
      // 添加对象
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        isEdit: true
      })
      // 自动聚焦
      let length = this.attrInfo.attrValueList.length - 1;
      this.$nextTick(() => {
        this.$refs[length].focus();
      })
    },
    // 添加属性按钮
    addAttr() {
      // 显示界面，并禁用三级分类栏的选择
      this.isShowTable = false;
      // 初始化数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.categoryId.category3Id,
        categoryLevel: 3,
      }
      this.isAttrAuth = true;
    },
    // 修改属性按钮
    editAttr(row) {
      // 显示界面
      this.isShowTable = false;
      // 深拷贝
      this.attrInfo = JSON.parse(JSON.stringify(row));
      // 遍历属性值，为每一个属性值对象添加一个响应式变化的属性
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'isEdit', false);
      })
    },
    // 删除属性按钮
    async delAttr(row) {
      await this.$API.attr.reqDeleteAttr(row.id).then(() => {
        this.$message({type:'success',message:'删除成功！'});
        this.getAttrList(this.categoryId, false);
      }).catch(err => {
        this.$message({type:'error',message:err.data});
      })
    },
    // 属性值验证
    toLook(row, index) {
      // 不能为空
      if (row.valueName.trim() == '')  {
        // 删除这个属性值
        this.attrInfo.attrValueList.splice(index,1);
        // 可以继续添加属性值
        this.isAttrAuth = true;
      }
      // 不能添加已有的属性值
      let isRepat = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      })
      if (isRepat) {
        // this.$refs[index].focus();
        this.isAttrAuth = false;
        // 弹出错误提示
        return this.$message.error('不能添加已有的属性值')
      }

      // 可以继续添加属性值
      this.isAttrAuth = true;
      // 退出编辑模式
      row.isEdit = false;
    },
    // 属性值编辑模式
    toEdit(row, index) {
        row.isEdit = true;
      // 自动聚焦
      this.$nextTick(() => {
        this.$refs[index].focus();
      })
    },
    // 删除属性值
    deleteAttr(index) {
      this.attrInfo.attrValueList.splice(index,1);
      this.isAttrAuth = true;
    },
    // 保存属性
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 过滤掉属性值为空的，并删除掉 isEdit 属性
        if (item.valueName != '') {
          delete item.isEdit;
          return true;
        }
      })
      try {
        // 发送请求保存数据
        await this.$API.attr.reqSaveAttrInfo(this.attrInfo).then(() => {
          this.$message.success('保存成功！');
          this.isShowTable = true;
          this.getAttrList(this.categoryId);
        });
      } catch(err) {
        this.$message.error('保存失败！' + err.data);
      }
    }
  },
  mounted() {
    // 获取布局参数
    this.styles = this.$store.state.styles
  }
}
</script>

<style lang="scss" scoped>

</style>