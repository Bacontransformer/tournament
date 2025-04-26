<template>
  <div class="optimized-container">
    <el-card shadow="hover" class="table-card">
      <el-table 
        :data="tableData" 
        style="width: 100%"
        stripe
        v-loading="loading"
        empty-text="暂无比赛数据"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column 
          prop="teamADepartment" 
          label="A队部门" 
          width="140"
          align="center"
        />
        <el-table-column 
          prop="teamBDepartment" 
          label="B队部门" 
          width="140"
          align="center"
        />
        <el-table-column 
          prop="beginTime" 
          label="开始时间" 
          width="200"
          align="center"
        >
          <template #default="{ row }">
            <span class="time-text">
              {{ new Date(row.beginTime).toLocaleString() }}
            </span>
          </template>
        </el-table-column>
        <el-table-column 
          prop="venueNumber" 
          label="场地号" 
          width="120"
          align="center"
        />
        <el-table-column 
          label="状态" 
          width="140"
          align="center"
        >
          <template #default="{ row }">
            <el-tag 
              :type="statusTag[row.status]" 
              effect="dark"
              :class="['status-tag', `status-${row.status}`]"
            >
              {{ statusMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column 
          label="操作" 
          width="180"
          align="center"
        >
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button 
                v-if="row.status === 0" 
                type="primary" 
                size="small" 
                @click="confirmBegin(row)"
                icon="el-icon-caret-right"
                class="action-btn"
              >
                开始
              </el-button>
              <el-button 
                v-else-if="row.status === 1" 
                type="success" 
                size="small" 
                @click="goToScore(row.matchModeId)"
                icon="el-icon-edit"
                class="action-btn"
              >
                打分
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination 
        background 
        :layout="paginationLayout" 
        :page-size="pageSize" 
        :total="total"
        :pager-count="5"
        @current-change="handlePageChange"
        class="optimized-pagination"
      />
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      statusMap: { 0: '未开始', 1: '进行中', 2: '已结束' },
      statusTag: { 0: 'warning', 1: 'success', 2: 'info' },
      paginationLayout: 'prev, pager, next, jumper'
    }
  },
  created() {
    this.loadData()
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize)
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const res = await axios.post('/api/referee-match/page-a', {
          page: this.page,
          pageSize: this.pageSize
        }, {
          headers: {
            'referee_token': localStorage.getItem('referee_token')
          }
        })

        this.tableData = res.data.data.records
        this.total = res.data.data.total
      } catch (error) {
        this.$message.error('数据加载失败')
      } finally {
        this.loading = false
      }
    },

    confirmBegin(row) {
      this.$confirm(`确定开始 ${row.teamADepartment} vs ${row.teamBDepartment} 的比赛吗？`, '确认开始', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleBegin(row.matchModeId)
      })
    },

    async handleBegin(matchModeId) {
      try {
        await axios.post(`/api/referee-match/begin-a/${matchModeId}`, {}, {
          headers: {
            'referee_token': localStorage.getItem('referee_token')
          }
        })
        this.$message.success('比赛已开始')
        this.loadData()
      } catch (error) {
        this.$message.error('操作失败')
      }
    },

    goToScore(matchModeId) {
      this.$router.push(`/referee/match-a/${matchModeId}`)
    },

    handlePageChange(page) {
      this.page = page
      this.loadData()
    },

    checkScreenSize() {
      this.paginationLayout = window.innerWidth < 768 ? 'prev, pager, next' : 'prev, pager, next, jumper'
    }
  }
}
</script>

<style scoped>
.optimized-container {
  max-width: 1400px;
  margin: 24px auto;
  padding: 0 20px;
}

.table-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

::v-deep .el-table {
  font-size: 14px;
  border-radius: 8px;
}

::v-deep .el-table th.el-table__cell {
  font-weight: 600;
}

::v-deep .el-table td {
  padding: 12px 0;
}

.time-text {
  font-family: monospace;
  color: #409EFF;
}

.status-tag {
  padding: 8px 12px;
  border-radius: 16px;
  font-weight: 500;
}

.status-0 {
  background-color: #fdf6ec !important;
  border-color: #f5dab1 !important;
  color: #e6a23c !important;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-btn {
  padding: 9px 15px;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.optimized-pagination {
  margin-top: 24px;
  padding: 12px 0;
}

@media (max-width: 768px) {
  .optimized-container {
    padding: 0 12px;
  }

  ::v-deep .el-table td {
    padding: 8px 0;
  }

  .action-btn {
    padding: 7px 12px;
  }

  .time-text {
    font-size: 13px;
  }
}
</style>