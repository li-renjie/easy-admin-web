<template>
  <div class="user-role-form">
    <el-dialog 
      @close="handleClose" 
      :visible="visible" 
      title="设置角色"
      :close-on-click-modal="false" 
      width="35%"
    >
      <el-form ref="form" :model="formData" :rules="formRules" :inline="false" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="formData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="selectedRoleIDs"
            multiple
            filterable
            placeholder="请选择角色"
            style="width: 100%">
            <el-option
              v-for="role in allRoles"
              :key="role.name"
              :label="role.name"
              :value="role.id">
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
import { getUserRoles, updateUserRoles } from '@/api/user'
import { getRoles, } from '@/api/role'

export default {
  name: 'user-role-form',
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
          roles: []
        }
      }
    }
  },
  data() {
    return {
      formRules: {
        // username: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
      },
      allRoles: [],            // 所有角色
      userRoles: [],           // 用户已有角色
      selectedRoleIDs: [],     // 选择的角色
    }
  },
  computed: {
    visible() {
      return this.dialogVisible
    },
    formData() {
      return this.initialFormData
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
      let data = {
        roles: this.selectedRoleIDs
      }
      updateUserRoles(this.formData.id, data).then((res) => {
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
    },
    updateData() {
      this.$emit('update-data')
    },
    resetForm() {
      this.$refs['form'].resetFields()
    },
    getAllRoles() {
      getRoles().then((res) => {
        this.allRoles = res.data
      }).catch(() => {
        console.log('Get roles error.')
        this.$notify({
          title: '错误',
          message: '获取角色列表失败！',
          type: 'error'
        })
      })
    },
    getUserRolesData() {
      getUserRoles(this.initialFormData.id).then((res) => {
        this.userRoles = res.data.roles
        this.selectedRoleIDs = this.userRoles.map((value, index) => {
          return value.id
        })
      }).catch(() => {
        console.log('Get roles error.')
        this.$notify({
          title: '错误',
          message: '获取用户角色失败！',
          type: 'error'
        })
      })
    },
  },
  mounted() {
    this.getAllRoles()
    this.getUserRolesData()
  }
}
</script>

<style lang="less">

</style>