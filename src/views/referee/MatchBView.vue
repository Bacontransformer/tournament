<!-- 文件1: src/views/referee/MatchBView.vue -->
<template>
    <div class="match-b-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="teamADepartment" label="A队部门"></el-table-column>
        <el-table-column prop="teamBDepartment" label="B队部门"></el-table-column>
        <el-table-column prop="beginTime" label="开始时间"></el-table-column>
        <el-table-column prop="venueNumber" label="场地编号"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{row}">
            {{ row.status === 0 ? '未开始' : '进行中' }}
          </template>
        </el-table-column>
        <el-table-column prop="currentSection" label="当前小节"></el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button 
              v-if="row.status === 0" 
              type="primary" 
              @click="handleBegin(row.matchBId)"
            >开始</el-button>
            <el-button 
              v-else 
              type="success" 
              @click="gotoScore(row.matchBId)"
            >进入打分</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
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
        total: 0
      }
    },
    mounted() {
      this.loadData()
    },
    methods: {
      async loadData() {
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
          console.error(error)
        }
      },
      async handleBegin(matchBId) {
        try {
          await axios.post(`/api/referee-match/begin-b/${matchBId}`, null, {
            headers: { 
              'referee_token': localStorage.getItem('referee_token') 
            }
          })
          this.loadData()
        } catch (error) {
          console.error(error)
        }
      },
      gotoScore(matchBId) {
        this.$router.push(`/referee/match-b/${matchBId}`)
      },
      handlePageChange(page) {
        this.currentPage = page
        this.loadData()
      }
    }
  }
  </script>
  
  <style scoped>
  .match-b-container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
  }
  </style>