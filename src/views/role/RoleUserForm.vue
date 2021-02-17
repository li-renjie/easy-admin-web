<template>
  <div class="role-user-form">
    <el-dialog 
      @close="handleClose" 
      :visible="visible" 
      title="设置角色用户"
      :close-on-click-modal="false" 
      width="35%"
    >
      <el-form ref="form" :model="formData" :rules="formRules" :inline="false" label-width="80px">
        <el-form-item label="角色" prop="username">
          <el-input type="text" v-model="formData.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="选择用户">
          <el-select
            v-model="selectedUserIDs"
            multiple
            filterable
            placeholder="输入用户名/邮箱查找用户"
            style="width: 100%">
            <el-option
              v-for="user in allUsers"
              :key="user.username"
              :label="user.username"
              :value="user.id">
              <span style="float: left">{{ user.username }}</span>
              <span style="float: right; color: #8492a6; margin-right: 25px">{{ user.email }}</span>
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
import { getRoleUsers, updateRoleUsers } from '@/api/role'
import { getUsers, searchUsers} from '@/api/user'

export default {
  name: 'role-user-form',
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
          name: '',
        }
      }
    }
  },
  data() {
    return {
      formRules: {},
      allUsers: [],            // 所有用户
      roleUsers: [],           // 角色已有用户
      selectedUserIDs: [],     // 选择的用户 ID
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
        users: this.selectedUserIDs
      }
      updateRoleUsers(this.formData.id, data).then((res) => {
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
    getAllUsers() {
      getUsers().then((res) => {
        this.allUsers = res.data
      }).catch(() => {
        console.log('Get users error.')
        this.$notify({
          title: '错误',
          message: '获取用户列表失败！',
          type: 'error'
        })
      })
    },
    searchForUsers(keyword) {
      searchUsers(keyword).then((res) => {
        this.foundUsers = res.data
      }).catch(() => {
        console.log('Search users error.')
        this.$notify({
          title: '错误',
          message: '搜索用户失败！',
          type: 'error'
        })
      })
    },
    getRoleUsersData() {
      getRoleUsers(this.formData.id).then((res) => {
        this.roleUsers = res.data.users
        this.selectedUserIDs = this.roleUsers.map((value, index) => {
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
    this.getAllUsers()
    this.getRoleUsersData()
  }
}
</script>

<style lang="less">

</style>