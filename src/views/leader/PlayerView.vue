<template>
    <div class="player-container">
      <el-button type="primary" @click="handleCreate" style="margin-bottom:20px">+ 新建</el-button>
      
      <el-table :data="playerList" border style="width: 100%">
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="gender" label="性别" align="center"></el-table-column>
        <el-table-column prop="age" label="年龄" align="center"></el-table-column>
        <el-table-column prop="department" label="部门" align="center"></el-table-column>
        <el-table-column prop="phone" label="电话" align="center"></el-table-column>
        <el-table-column prop="role" label="角色" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="{row}">
            <el-button size="mini" @click="handleEdit(row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.page"
        :page-sizes="[10, 20, 30]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    data() {
      return {
        queryParams: {
          page: 1,
          pageSize: 10
        },
        total: 0,
        playerList: []
      }
    },
    mounted() {
      this.loadData()
    },
    methods: {
      async loadData() {
        try {
          const { data } = await axios.post('/api//player/page', this.queryParams, {
            headers: { 'leader_token': localStorage.getItem('leader_token') }
          })
          this.playerList = data.data.records
          this.total = data.data.total
        } catch (error) {
          console.error('加载数据失败:', error)
        }
      },
      handleCreate() {
        this.$router.push('/leader/player/edit')
      },
      handleEdit(row) {
        this.$router.push(`/leader/player/edit/${row.playerId}`)
      },
      async handleDelete(row) {
        try {
          await this.$confirm('确认删除该队员？', '提示', { type: 'warning' })
          const params = new URLSearchParams()
          params.append('id', row.playerId)
          await axios.post('/api/player/delete', params , {
            headers: { 'leader_token': localStorage.getItem('leader_token') }
          })
          this.loadData()
        } catch (error) {
          console.error('删除失败:', error)
        }
      },
      handleSizeChange(val) {
        this.queryParams.pageSize = val
        this.loadData()
      },
      handleCurrentChange(val) {
        this.queryParams.page = val
        this.loadData()
      }
    }
  }
  </script>
  
  <style scoped>
  .player-container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
  }
  </style>