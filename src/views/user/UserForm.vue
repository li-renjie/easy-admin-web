<template>
  <div class="user-form">
    <el-dialog 
      @close="handleClose" 
      :visible="visible" 
      :title=" isEditDialog ? '编辑用户' : '新增用户' " 
      :close-on-click-modal="false" 
      width="35%"
    >
      <el-form ref="form" :model="formData" :rules="formRules" :inline="false" label-width="80px">
        <el-form-item v-if="isEditDialog" label="ID" prop="id">
          <el-input type="text" v-model="formData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="formData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input type="text" v-model="formData.mobile"></el-input>
        </el-form-item>
        <el-form-item v-if="!isEditDialog" label="密码" prop="password">
          <el-input type="password" v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item v-if="!isEditDialog" label="确认密码" prop="password2">
          <el-input type="password" v-model="formData.password2"></el-input>
        </el-form-item>
        <!-- <el-form-item label="用户组" prop="group">
          <el-select v-model="formData.group" placeholder="请选择用户组" clearable style="float:left">
            <el-option label="管理员" value="管理员"></el-option>
            <el-option label="普通用户" value="普通用户"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="状态" prop="is_active" style="float:left">
          <el-radio v-model="formData.is_active" label="true">激活</el-radio>
          <el-radio v-model="formData.is_active" label="false">锁定</el-radio>
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
import { addUser, editUser } from '@/api/user'

export default {
  name: 'user-form',
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
          username: '',
          email: '',
          mobile: '',
          password: '',
          password2: '',
          is_active: '',
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
      //formData: {},
      formRules: {
        username: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
        ],
        mobile: [ { required: false, message: '请输入手机号', trigger: 'change' } ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        is_active: [ { required: true, message: '请选择状态', trigger: 'change' } ]
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
              username: this.formData.username,
              email: this.formData.email,
              mobile: this.formData.mobile,
              is_active: this.formData.is_active
            }
            editUser(data).then((res) => {
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
              username: this.formData.username,
              email: this.formData.email,
              mobile: this.formData.mobile,
              password: this.formData.password,
              is_active: this.formData.is_active
            }
            addUser(data).then((res) => {
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