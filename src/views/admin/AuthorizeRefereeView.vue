<template>
  <div class="authorize-referee">
    <el-table :data="tableData" style="width: 100%" v-loading="loading" border class="custom-table">
      <el-table-column label="操作" width="180" resizable>
        <template slot-scope="scope">
          <el-button size="mini" @click="handlePass(scope.$index, scope.row)">通过</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="180" resizable></el-table-column>
      <el-table-column prop="phone" label="手机号" width="180" resizable></el-table-column>
      <el-table-column prop="name" label="姓名" width="180" resizable></el-table-column>
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
    this.fetchReferees();
  },
  methods: {
    fetchReferees() {
      this.loading = true;
      const pageQueryDTO = {
        page: this.currentPage,
        pageSize: this.pageSize
      };
      const adminToken = localStorage.getItem('admin_token');
      axios.post('/api/authorize/referee/page', pageQueryDTO, {
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
          console.error('Error fetching referees:', error);
          this.loading = false;
        });
    },
    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize;
      this.fetchReferees();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchReferees();
    },
    handlePass(index, row) {
      this.$confirm('是否通过该裁判的申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const adminToken = localStorage.getItem('admin_token');
        // 修改后的接口调用方式
        axios.post(`/api/authorize/referee/pass/${row.refereeId}`, null, {
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
              this.fetchReferees();
            } else if (response.data.code === 0) {
              this.$message({
                type: 'error',
                message: response.data.msg
              });
            }
          })
          .catch(error => {
            console.error('Error passing referee:', error);
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
.authorize-referee {
  padding: 20px;
}

.el-pagination {
  margin-top: 20px;
  text-align: right;
}

.custom-table .el-table__header-wrapper th {
  height: 40px;
  line-height: 40px;
  background-color: #f0f9eb;
  text-align: center;
}

.custom-table .el-table__body-wrapper td {
  height: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-center {
  text-align: center;
  margin-top: 20px;
}
</style>