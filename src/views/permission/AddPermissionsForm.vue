<template>
  <div class="add-permissions-form">
    <el-dialog 
      @close="handleClose" 
      :visible="visible" 
      title="批量添加权限" 
      :close-on-click-modal="false" 
      width="35%"
    >
      <el-form ref="form" :model="formData" :rules="formRules" :inline="false" label-width="80px">
        <el-form-item label="资源" prop="name">
          <el-input type="text" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="操作">
          <el-select v-model="formData.selectActions"
            multiple 
            filterable
            allow-create 
            placeholder="请选择" 
            style="width: 100%">
            <el-option
              v-for="item in formData.selectActions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancle">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addPermission, editPermission } from '@/api/permission'

export default {
  name: 'add-permission-form',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      formRules: {
        name: [ { required: true, message: '请输入资源名称', trigger: 'blur' } ],
      },
      formData: {
        name: '',
        selectActions: ['view', 'add', 'change', 'delete']
      }
    }
  },
  computed: {
    visible() {
      return this.dialogVisible
    },
  },
  methods:{
    handleClose() {
      this.$emit('close-dialog')
    },
    handleCancle() {
      this.$emit('close-dialog')
    },
    handleSubmit() {
      // 提交表单
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let data = this.formData.selectActions.map((value, index) => {
            return {
              name: this.formData.name,
              action: value,
              description: value + ' ' + this.formData.name
            }
          })
          addPermission(data).then((res) => {
            this.loading = false
            this.$message({
              message:'创建成功',
              type:'success'
            })
            this.updateData()
            this.$emit('close-dialog')    // 触发关闭对话框事件
          }).catch(() => {
            this.$message({
              message:'创建失败！',
              type:'error'
            })
          })
        }
      })
    },
    updateData() {
      // 触发事件，让父组件更新表格数据
      this.$emit('update-data')
    },
    resetForm() {
      this.$refs['form'].resetFields()
    },
  }
}
</script>

<sytle lang="less">

</sytle>