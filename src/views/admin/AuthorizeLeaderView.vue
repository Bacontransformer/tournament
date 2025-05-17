<template>
  <div class="authorize-leader">
    <!-- 数据表格 -->
    <el-table 
      :data="tableData" 
      style="width: 100%; margin-top: 20px;" 
      v-loading="loading" 
      border 
      stripe 
      class="custom-table"
    >
      <el-table-column label="操作" width="150" fixed="left">
        <template slot-scope="scope">
          <el-button 
            size="mini" 
            type="success" 
            plain 
            @click="handlePass(scope.$index, scope.row)"
          >
            <i class="el-icon-check"></i> 通过
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="phone" label="手机号" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="name" label="姓名" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="teamName" label="队伍名" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="gender" label="性别" width="100" align="center"></el-table-column>
      <el-table-column prop="age" label="年龄" width="100" align="center"></el-table-column>
      <el-table-column prop="department" label="部门" width="150" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      class="pagination-center"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
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
      total: 0,
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
        pageSize: this.pageSize,
      };
      const adminToken = localStorage.getItem('admin_token');
      axios
        .post('/api/authorize/leader/page', pageQueryDTO, {
          headers: {
            admin_token: adminToken,
          },
        })
        .then((response) => {
          if (response.data.code === 1) {
            this.tableData = response.data.data.records;
            this.total = response.data.data.total;
            this.loading = false;
          }
        })
        .catch((error) => {
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
        type: 'warning',
      })
        .then(() => {
          const adminToken = localStorage.getItem('admin_token');
          axios
            .post(`/api/authorize/leader/pass/${row.leaderId}`, null, {
              headers: {
                admin_token: adminToken,
              },
            })
            .then((response) => {
              if (response.data.code === 1) {
                this.$message({
                  type: 'success',
                  message: '通过成功!',
                });
                this.fetchLeaders();
              } else if (response.data.code === 0) {
                this.$message({
                  type: 'error',
                  message: response.data.msg,
                });
              }
            })
            .catch((error) => {
              console.error('Error passing leader:', error);
              this.$message.error('通过失败!');
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消通过',
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
.authorize-leader {
  padding: 20px;

  .custom-table {
    margin-top: 20px;
    border-radius: 8px;
    overflow: hidden;

    ::v-deep(.el-table__header th) {
      background-color: #f0f9eb;
      color: #333;
      font-weight: bold;
      text-align: center;
    }

    ::v-deep(.el-table__row) {
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f5f7fa;
      }
    }

    .el-button {
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        margin-right: 4px;
      }
    }
  }

  .pagination-center {
    margin-top: 20px;
    text-align: center; /* 修改为居中对齐 */
  }
}
</style>