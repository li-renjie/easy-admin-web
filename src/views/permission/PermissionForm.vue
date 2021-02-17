<template>
  <div class="permission-form">
    <el-dialog 
      @close="handleClose" 
      :visible="visible" 
      :title=" isEditDialog ? '编辑权限' : '新增权限' " 
      :close-on-click-modal="false" 
      width="35%"
    >
      <el-form ref="form" :model="formData" :rules="formRules" :inline="false" label-width="80px">
        <el-form-item v-if="isEditDialog" label="ID" prop="id">
          <el-input type="text" v-model="formData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="资源" prop="name">
          <el-input type="text" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="操作" prop="action">
          <el-input type="text" v-model="formData.action"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="text" v-model="formData.description"></el-input>
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
  name: 'permission-form',
  props: {
    isEditDialog: {
      type: Boolean,
      default: false
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    initialFormData: {
      type: Object,
      default: () => {
        return {
          id: '',
          name: '',
          action: '',
          description: '',
        }
      }
    }
  },
  data() {
    return {
      formRules: {
        name: [ { required: true, message: '请输入资源名称', trigger: 'blur' } ],
        action: [ { required: true, message: '请输入操作名称', trigger: 'blur' } ],
      },
    }
  },
  computed: {
    visible() {
      return this.dialogVisible
    },
    formData() {
      return this.initialFormData
    }
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
          if (this.isEditDialog) {
            // 编辑
            // let data = this.formData
            let data = {
              id: this.formData.id,
              name: this.formData.name,
              action: this.formData.action,
              description: this.formData.description,
            }
            editPermission(data).then((res) => {
              this.loading = false
              this.$message({
                message:'修改成功',
                type:'success'
              })
              this.updateData()
              this.$emit('close-dialog')    // 触发关闭对话框事件
            }).catch(() => {
              this.$message({
                message:'修改失败！',
                type:'error'
              })
            })
          } else {
            // 添加
            let data = {
              name: this.formData.name,
              action: this.formData.action,
              description: this.formData.description,
            }
            addPermission(data).then((res) => {
              this.loading = false
              this.$message({
                message:'添加成功',
                type:'success'
              })
              this.updateData()
              this.$emit('close-dialog')
            }).catch(() => {
              this.$message({
                message:'添加失败！',
                type:'error'
              })
            })
          }
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