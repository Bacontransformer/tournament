<template>
    <div class="optimized-match-container">
      <el-card shadow="hover" class="table-card">
        <div class="header-section">
          <h2 class="page-title">B类比赛管理</h2>
          <el-tag type="info">当前页面：裁判评分管理</el-tag>
        </div>
  
        <el-table 
          :data="tableData" 
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
            width="180"
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
            width="120"
            align="center"
          >
            <template #default="{ row }">
              <el-tag 
                :type="row.status === 0 ? 'warning' : 'success'" 
                effect="dark"
                class="status-tag"
              >
                {{ row.status === 0 ? '未开始' : '进行中' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column 
            prop="currentSection" 
            label="当前小节" 
            width="120"
            align="center"
          />
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
                  v-else 
                  type="success" 
                  size="small" 
                  @click="gotoScore(row.matchBId)"
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
          :current-page="currentPage"
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
        currentPage: 1,
        pageSize: 10,
        total: 0,
        loading: false,
        paginationLayout: 'total, prev, pager, next, jumper'
      }
    },
    mounted() {
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
          const res = await axios.post('/api/referee-match/page-b', {
            page: this.currentPage,
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
          this.handleBegin(row.matchBId)
        })
      },
  
      async handleBegin(matchBId) {
        try {
          await axios.post(`/api/referee-match/begin-b/${matchBId}`, null, {
            headers: {
              'referee_token': localStorage.getItem('referee_token')
            }
          })
          this.$message.success('比赛已开始')
          this.loadData()
        } catch (error) {
          const msg = error.response?.data?.message || '操作失败'
          this.$message.error(msg)
        }
      },
  
      gotoScore(matchBId) {
        this.$router.push(`/referee/match-b/${matchBId}`)
      },
  
      handlePageChange(page) {
        this.currentPage = page
        this.loadData()
      },
  
      checkScreenSize() {
        this.paginationLayout = window.innerWidth < 768 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'
      }
    }
  }
  </script>
  
  <style scoped>
  .optimized-match-container {
    max-width: 1400px;
    margin: 24px auto;
    padding: 0 20px;
  }
  
  .table-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }
  
  .header-section {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
  }
  
  .page-title {
    color: #303133;
    margin: 0;
  }
  
  ::v-deep .el-table {
    font-size: 14px;
    border-radius: 8px;
  }
  
  ::v-deep .el-table th.el-table__cell {
    font-weight: 600;
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
    .optimized-match-container {
      padding: 0 12px;
    }
  
    .header-section {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
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