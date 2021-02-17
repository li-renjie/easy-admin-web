<template>
  <div class="role-permission-form">
    <el-dialog 
      @close="handleClose" 
      :visible="visible" 
      title="设置角色权限"
      :close-on-click-modal="false" 
      width="40%"
    >
      <el-row>
        <el-col :span="4"> 所有 </el-col>
        <el-col :span="20" style="text-align:left">
          <el-checkbox 
            :indeterminate="isIndeterminate" 
            v-model="checkAll" 
            @change="handleCheckAllChange">
            全选
          </el-checkbox>
        </el-col>
      </el-row>
      <el-checkbox-group v-model="selectedPermissionIDs">
        <el-row v-for="(value, key) in sortedPermissions" :key="key">
          <el-col :span="4" style="font-size:14px">{{key}}</el-col>
          <el-col :span="20" style="text-align:left">
            <el-checkbox 
              v-for="item in value" 
              :key="item.id" 
              :label="item.id">
              <el-tooltip class="item" effect="dark" :content="item.description" placement="top-start">
                <div>{{item.action}}</div>
              </el-tooltip>
            </el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancle">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolePermissions, updateRolePermissions } from '@/api/role'
import { getPermissions, } from '@/api/permission'

export default {
  name: 'role-permission-form',
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
        }
      }
    }
  },
  data() {
    return {
      
      allPermissions: [],      // 所有权限
      rolePermissions: [],
      sortedPermissions: [],
      selectedPermissionIDs: [],

      checkAll: false,
      isIndeterminate: true,
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
      let data = {
        permissions: this.selectedPermissionIDs
      }
      console.log(JSON.stringify(data))
      updateRolePermissions(this.formData.id, data).then((res) => {
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
    getAllPermissions() {
      getPermissions().then((res) => {
        this.allPermissions = res.data
        // console.log(this.allPermissions)
        this.sortedPermissions = this.sortPermissions(this.allPermissions)
      }).catch(() => {
        console.log('Get permissions error.')
        this.$notify({
          title: '错误',
          message: '获取权限列表失败！',
          type: 'error'
        })
      })
    },
    getRolePermissionsData() {
      getRolePermissions(this.formData.id).then((res) => {
        this.rolePermissions = res.data.permissions
        // console.log(this.rolePermissions)
        this.selectedPermissionIDs = this.rolePermissions.map((value, index) => {
          return value.id
        })
      }).catch(() => {
        console.log('Get role permissions error.')
        this.$notify({
          title: '错误',
          message: '获取权限失败！',
          type: 'error'
        })
      })
    },
    sortPermissions(perms) {
      let sortedPerms = {}
      perms.map((value, index) => {
        if (!(value.name in sortedPerms)) {
          sortedPerms[value.name] = []
        }
        sortedPerms[value.name].push(value)
      })
      // console.log(JSON.stringify(sortedPerms))
      return sortedPerms
    },
    handleCheckAllChange(val) {
      if (val) {
        this.selectedPermissionIDs = this.allPermissions.map((value, index) => {
          return value.id
        })
        this.isIndeterminate = false
      } else {
        this.selectedPermissionIDs = []
      }
    },
  },
  mounted() {
    this.getAllPermissions()
    this.getRolePermissionsData()
  }
}
</script>

<style lang="less">
.el-row {
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
}
.item {
  margin: 4px;
}
</style>