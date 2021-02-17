<template>
  <div class="user">
    <el-col :span="24">
      <el-form :inline="true" @submit.native.prevent style="float:left">
        <el-form-item>
          <el-input v-model="searchKey" @keyup.enter.native="handleSearch" placeholder="用户名/邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" icon="el-icon-search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd" icon="el-icon-plus">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleExport" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange" 
      v-loading="loading" 
      element-loading-text="拼命加载中" 
      highlight-current-row border 
      style="width:100%"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <!-- <el-table-column type="index" :index="id" width="50"></el-table-column> -->
      <el-table-column label="ID" prop="id" width="60" sortable></el-table-column>
      <el-table-column label="用户名" prop="username" width="110" sortable></el-table-column>
      <el-table-column label="邮箱" prop="email" sortable></el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :key="role"
            v-for="role in scope.row.roles">
            {{role}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="手机" prop="mobile" sortable></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">{{ scope.row.create_time | formatDate }}</template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">{{ scope.row.update_time | formatDate }}</template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.is_active ? '激活 ':'锁定 ' }}</span> -->
          <el-tag v-if="scope.row.is_active" size="small">正常</el-tag>
          <el-tag v-else type="danger" size="small">锁定</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" @click="hendleDelete(scope.$index, scope.row)" type="danger">删除</el-button>
          <el-dropdown>
            <el-button size="mini" type="primary">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleEditRole(scope.row)">设置角色</el-dropdown-item>
              <el-dropdown-item  @click.native="handleChangePassword(scope.row)">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    
    <el-col :span="24" style="margin-top:15px">
      <el-button 
        :disabled="this.selected.length===0" 
        @click="handleMultipleDelete" 
        size="small" 
        type="danger" 
        style="float:left"
      >
        批量删除
      </el-button>
      <el-pagination
        :total="total" 
        :page-size="pageSize" 
        :disabled="disablePagination"
        @current-change="handleCurrentChange" 
        @size-change="handleSizeChange" 
        :page-sizes="[10, 20, 30, 50]" 
        background layout="total, sizes, prev, pager, next, jumper" 
        style="float:right"
      >
      </el-pagination>
    </el-col>
    <user-form 
      v-if="dialogVisible"
      :dialog-visible="dialogVisible" 
      :is-edit-dialog="isEditDialog" 
      :initial-form-data="initialFormData"
      @close-dialog="handleCloseDialog"
      @update-data="getTableData"
    ></user-form>
    <password-form 
      v-if="passwordDialogVisible"
      :dialog-visible="passwordDialogVisible" 
      :initial-form-data="initialPasswordFormData"
      @close-dialog="handleClosePasswordDialog"
    ></password-form>
    <user-role-form 
      v-if="roleDialogVisible"
      :dialog-visible="roleDialogVisible" 
      :initial-form-data="initialRoleFormData"
      @close-dialog="handleCloseRoleDialog"
      @update-data="getTableData"
    ></user-role-form>
  </div>
</template>

<script>
import UserForm from '@/views/user/UserForm'
import PasswordForm from '@/views/user/PasswordForm'
import UserRoleForm from '@/views/user/UserRoleForm'
import { getUsers, delUser, batchDelUser } from '@/api/user'
import { formatDate } from '@/utils/date'

export default {
  name: 'user-table',
  components: {
    UserForm,
    PasswordForm,
    UserRoleForm
  },
  props: {
    //
  },
  data() {
    return {
      searchKey: '',               // 搜索框输入
      tableData: [],               // 保存当前显示的数据
      allTableData: [],            // 保存所有数据
      loading: false,              // 是否提示加载中
      selected: [],                // 保存被选中的行
      total: 0,                    // 总行数
      page: 1,                     // 当前页码
      pageSize: 10,                // 每页显示行数
      disablePagination: false,    // 禁用分页
      dialogVisible: false,        // 是否显示新增/编辑对话框
      isEditDialog: false,         // 是否为编辑对话框
      initialFormData: {           // 传递给新增/编辑对话框的表单数据
        id: '',
        username: '',
        email: '',
        mobile: '',
        is_active: 'true',
      },
      passwordDialogVisible: false,
      initialPasswordFormData: {
        id: '',
        username: ''
      },
      roleDialogVisible: false,
      initialRoleFormData: {
        id: '',
        username: '',
        roles: []
      }
    }
  },
  methods:{
    handleSelectionChange(val) {
      // 选择项发生变化时触发执行
      this.selected = val;
    },
    handleEdit(index, row) {
      // 编辑指定行
      this.initialFormData = {
        id: row.id,
        username: row.username,
        email: row.email,
        mobile: row.mobile,
        is_active: row.is_active.toString(),
      }
      this.dialogVisible = true
      this.isEditDialog = true
    },
    hendleDelete(index, row) {
      // 删除指定行
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确认',
        cancleButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.loading = true
        delUser(row.id).then((res) => {
          this.loading = false
          this.$message({
            message:'删除成功',
            type:'success'
          })
          this.getTableData()   // 重新获取表格数据
        }).catch(() => {
          this.$message({
            message:'删除失败！',
            type:'error'
          })
        })
      }).catch(() => {
        // 取消删除
      })
    },
    handleMultipleDelete() {
      // 批量删除
      this.$confirm('确认删除选中记录？', '提示', {
        confirmButtonText: '确认',
        cancleButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        let idList = this.selected.map(item => { return item.id })
        batchDelUser(idList).then((res) => {
          this.loading = false
          this.$message({
            message:'批量删除成功',
            type:'success'
          })
          this.getTableData()   // 重新获取表格数据
        }).catch(() => {
          this.$message({
            message:'批量删除失败！',
            type:'error'
          })
        })
      }).catch(() => {
        // 取消删除
      })
    },
    handleSearch() {
      // 搜索
      if (this.searchKey === '') {
        this.tableData = this.getPage(this.page, this.pageSize)
        this.disablePagination = false
      } else {
        let result =  this.allTableData.filter((row) => {
          if (row.username.includes(this.searchKey) || row.email.includes(this.searchKey)) {
            return true
          } else {
            return false
          }
        })
        this.tableData = result
        this.disablePagination = true
      }
    },
    handleAdd() {
      // 新增
      this.initialFormData = {
        id: '',
        username: '',
        email: '',
        mobile: '',
        is_active: 'true',
      }
      this.dialogVisible = true
      this.isEditDialog = false
    },
    handleRefresh() {
      this.getTableData()
    },
    handleExport() {
      // 导出表数据
    },
    getPage(page, pageSize) {
      // 从allTableData数组中获取某页数据
      // if( page>0 && (page+pageSze) < this.allTableData.length ){
        return this.allTableData.slice(pageSize*(page-1), pageSize*(page))
      // }
    },
    getTableData() {
      // 获取表格数据
      this.loading = true
      getUsers().then(res => {
        this.allTableData = res.data
        this.total = res.data.length
        this.tableData = this.getPage(this.page, this.pageSize)
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      // 选择分页时触发
      this.page = val
      this.tableData = this.getPage(this.page, this.pageSize)
    },
    handleSizeChange(val) {
      // pageSize改变时触发
      this.pageSize = val
      this.tableData = this.getPage(this.page, this.pageSize)
    },
    handleCloseDialog() {
      // 关闭对话框
      this.dialogVisible = false
    },
    handleEditRole(row) {
      // 设置角色
      this.initialRoleFormData = {
        id: row.id,
        username: row.username,
        roles: row.roles
      }
      this.roleDialogVisible = true
    },
    handleCloseRoleDialog() {
      // 关闭设置角色对话框
      this.roleDialogVisible = false
    },
    handleChangePassword(row) {
      // 修改密码
      this.initialPasswordFormData = {
        id: row.id,
        username: row.username,
      }
      this.passwordDialogVisible = true
    },
    handleClosePasswordDialog() {
      // 关闭密码修改对话框
      this.passwordDialogVisible = false
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  mounted() {
    this.getTableData();
  }
}
</script>

<sytle lang="less">
.el-table td, .el-table th {
  padding: 8px 0px 8px 0px
}
.el-dropdown {
  padding: 10px
}
.el-tag {
  margin-right: 5px;
}
</sytle>