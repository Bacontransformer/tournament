<template>
    <div class="container">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="teamADepartment" label="A队部门" width="120" />
        <el-table-column prop="teamBDepartment" label="B队部门" width="120" />
        <el-table-column prop="beginTime" label="开始时间" width="180">
          <template #default="{row}">
            {{ new Date(row.beginTime).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="venueNumber" label="场地号" width="100" />
        <el-table-column label="状态" width="120">
          <template #default="{row}">
            <el-tag :type="statusTag[row.status]">
              {{ statusMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{row}">
            <el-button 
              v-if="row.status === 0"
              type="primary" 
              size="small"
              @click="handleBegin(row.matchModeId)">
              开始
            </el-button>
            <el-button
              v-else-if="row.status === 1"
              type="success"
              size="small"
              @click="goToScore(row.matchModeId)">
              进入打分
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      />
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
        statusMap: {0: '未开始', 1: '进行中', 2: '已结束'},
        statusTag: {0: 'warning', 1: 'success', 2: 'info'}
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      async loadData() {
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
        }
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
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
  }
  .el-pagination {
    margin-top: 20px;
    justify-content: center;
  }
  </style>