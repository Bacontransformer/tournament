<template>
    <div class="authorize-leader">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" border class="custom-table">
        <el-table-column label="操作" width="180" resizable>
          <template slot-scope="scope">
            <el-button size="mini" @click="handlePass(scope.$index, scope.row)">通过</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="180" resizable></el-table-column>
        <el-table-column prop="phone" label="手机号" width="180" resizable></el-table-column>
        <el-table-column prop="name" label="姓名" width="180" resizable></el-table-column>
        <el-table-column prop="teamName" label="队伍名" width="180" resizable></el-table-column>
        <el-table-column prop="gender" label="性别" width="100" resizable></el-table-column>
        <el-table-column prop="age" label="年龄" width="100" resizable></el-table-column>
        <el-table-column prop="department" label="部门" width="180" resizable></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination-center">
      </el-pagination>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        tableData: [],
        loading: false,
        currentPage: 1,
        pageSize: 10,
        total: 0
      };
    },
    created() {
      this.fetchLeaders();
    },
    methods: {
      fetchLeaders() {
        this.loading = true;
        const pageQueryDTO = {
          page: this.currentPage,
          pageSize: this.pageSize
        };
        const adminToken = localStorage.getItem('admin_token');
        axios.post('/api/authorize/leader/page', pageQueryDTO, {
          headers: {
            'admin_token': adminToken
          }
        })
          .then(response => {
            if (response.data.code === 1) {
              this.tableData = response.data.data.records;
              this.total = response.data.data.total;
              this.loading = false;
            }
          })
          .catch(error => {
            console.error('Error fetching leaders:', error);
            this.loading = false;
          });
      },
      handleSizeChange(newPageSize) {
        this.pageSize = newPageSize;
        this.fetchLeaders();
      },
      handleCurrentChange(newPage) {
        this.currentPage = newPage;
        this.fetchLeaders();
      },
      handlePass(index, row) {
        this.$confirm('是否通过该领队的申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const adminToken = localStorage.getItem('admin_token');
          axios.post('/api/authorize/leader/pass', [row.leaderId], {
            headers: {
              'admin_token': adminToken
            }
          })
            .then(response => {
              if (response.data.code === 1) {
                this.$message({
                  type: 'success',
                  message: '通过成功!'
                });
                this.fetchLeaders();
              } else if (response.data.code === 0) {
                this.$message({
                  type: 'error',
                  message: response.data.msg
                });
              }
            })
            .catch(error => {
              console.error('Error passing leader:', error);
              this.$message.error('通过失败!');
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消通过'
          });
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .authorize-leader {
    padding: 20px;
  }
  
  .el-pagination {
    margin-top: 20px;
    text-align: right;
  }
  
  /* 自定义表头单元格高度 */
  .custom-table .el-table__header-wrapper th {
    height: 40px;
    line-height: 40px;
    background-color: #f0f9eb;
    text-align: center;
  }
  
  /* 自定义表格单元格样式 */
  .custom-table .el-table__body-wrapper td {
    height: 40px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 居中分页组件 */
  .pagination-center {
    text-align: center;
    margin-top: 20px;
  }
  </style>