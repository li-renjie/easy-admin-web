<template>
  <div class="password-form">
    <el-dialog 
      @close="handleClose" 
      :visible="visible" 
      title="修改密码"
      :close-on-click-modal="false" 
      width="35%"
    >
      <el-form ref="form" :model="formData" :rules="formRules" :inline="false" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="formData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input type="password" v-model="formData.password2"></el-input>
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
import { editUser } from '@/api/user'

export default {
  name: 'password-form',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    initialFormData: {
      type: Object,
      default: () => {
        return {
          id: '',
          username: '',
          password: '',
          password2: '',
        }
      }
    }
  },
  data() {
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // formData: {},
      formRules: {
        // username: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
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
          let data = {
            id: this.formData.id,
            password: this.formData.password
          }
          editUser(data).then((res) => {
            this.loading = false
            this.$message({
              message:'修改成功',
              type:'success'
            })
            this.updateData()
            this.$emit('close-dialog')
          }).catch(() => {
            this.$message({
              message:'修改失败！',
              type:'error'
            })
          })
        }
      })
    },
    updateData() {
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
