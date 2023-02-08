<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="addTradeMark" class="add-btn">添加</el-button>
    <!-- 表格 -->
    <el-table 
      :data="dataList" 
      border 
      style="margin-top: 20px;"
      v-loading="listLoading"
      height="540"
    >
      <el-table-column type="index" label="序号" :width="styles.tableIndexWidth" align="center"></el-table-column>
      <el-table-column label="品牌名称" prop="tmName" width="150"></el-table-column>
      <el-table-column label="品牌 LOGO" :width="styles.logoWidth">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" style="height:50px;">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="115px">
        <template v-slot="{row}">
          <el-button type="warning" icon="el-icon-edit" :size="styles.buttonSize" @click="updateTradeMark(row)"></el-button>
          <el-popconfirm 
            :title="`你确定删除【 ${row.tmName} 】吗？`" 
            @onConfirm="removeTradeMark(row.id)"
            
          >
            <el-button 
              slot="reference"
              type="danger" 
              icon="el-icon-delete" 
              :size="styles.buttonSize" 
              style="margin:var(--button-margin);"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
      background: 加上背景
      current-page: 当前页码
      page-size: 一页展示的数量
      page-sizes: 设置一页展示的数量
      total: 总数据
    -->
    <el-pagination
      style="margin-top:20px; textAlign:center"
      background
      :current-page="page"
      :page-size="limit"
      :page-sizes="[5,10,20]"
      :layout="styles.paginationLayout"
      :pager-count="styles.paginationCount"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form style="width:70%;" :rules="rules" ref="ruleForm" :model="tmForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 上传LOGO -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" ref="fileLoad"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { call } from 'body-parser';

export default {
  name: 'tradeMark',
  data() {
    // 自定义表单验证规则
    var validatePass = (rule, value, callback) => {
      if (value.length < 2 || value.length > 16) {
        callback(new Error('长度在 2 到 16 个字符'));
      } else {
        callback();
      }
    }
    return {
      page: 1,                  // 当前页数
      limit: 5,                 // 每页展示的数据的个数
      total: 0,                 // 数据总数
      dataList: [],             // 品牌数据
      dialogTitle: '',          // 对话框标题
      dialogFormVisible: false, // 对话框显示
      listLoading: false,       // 品牌数据状态
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 提交数据表单验证规则
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'change' }
          { validator: validatePass, trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择品牌图片' },
        ]
      },
      // 布局参数
      styles: {}

    }
  },
  methods: {
    // 获取品牌数据
    async getPageList() {
      // 加载数据
      this.listLoading = true;
      // 解构数据
      const {page, limit} = this;
      // 获取品牌数据
      await this.$API.tradeMark.reqTradeMarkList(page, limit).then((result) => {
        this.dataList = result.data.records;
        this.total = result.data.total;
        // 加载成功
        this.listLoading = false;
      });
    },
    // 切换页码事件
    handleCurrentChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    // 切换页面展示数量事件
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 添加品牌
    addTradeMark() {
      // 先清空数据
      this.tmForm.tmName = '';
      this.tmForm.logoUrl = '';

      this.dialogFormVisible = true;
      this.dialogTitle = '添加品牌';

      this.$nextTick(() => {
        // 初始化图标
        let i = this.$refs.fileLoad;
        i.className = 'el-icon-plus avatar-uploader-icon';
      })
    },
    // 修改品牌数据
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      this.dialogTitle = '修改品牌';
      this.tmForm = {...row};
    },
    // 删除品牌
    async removeTradeMark(id) {
      try {
        await this.$API.tradeMark.reqRemoveTradeMark(id);
        this.$message.success('删除品牌成功')
      } catch(err) {
        this.$message.error(err.data);
      }
      // 重新请求页面数据
      this.page = this.dataList.length > 1 ? this.page : (this.page > 1 ? this.page-1 : 1);
      this.getPageList();
    },
    // LOGO上传成功
    handleAvatarSuccess(res) {
      this.tmForm.logoUrl = res.data;
    },
    // LOGO上传之前
    beforeAvatarUpload(file) {
      const isType = file.type === 'image/png' || 'image/jpg' || 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // 显示加载图标
      if (isType && isLt2M) {
        this.tmForm.logoUrl = '';
        this.$nextTick(function() {
          let i = this.$refs.fileLoad;
          i.className = 'el-icon-loading avatar-uploader-icon';
        })
      }

      if (!isType) {
        this.$message.error('上传头像图片只能是 JPG/JPEG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }

      return isType && isLt2M;
    },
    // 对话框确认按钮，添加品牌或者修改品牌
    addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return false;

        // 隐藏对话框
        this.dialogFormVisible = false;
        try {
          // 发送请求，添加品牌|修改品牌
          await this.$API.tradeMark.reqAddorUpdateTradeMark(this.tmForm);
          // 弹出成功提示消息
          this.$message({
            message: this.tmForm.id ? '修改品牌数据成功' : '添加品牌数据成功',
            type: 'success'
          })
        } catch(err) {
          // 弹出失败提示消息
          this.$message.error(err.data);
        }
        // 重新获取品牌数据
        this.getPageList();
      });

      
    },
  },
  mounted() {
    // 获取品牌数据
    this.getPageList()
    // 获取布局参数
    this.styles = this.$store.state.styles
  }
}
</script>

<style lang="less" scoped>
  
</style>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>