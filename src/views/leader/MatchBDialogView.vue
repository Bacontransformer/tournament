<template>
    <div class="dialog-container">
      <el-form label-width="140px" style="max-width:600px;margin:0 auto">
        <template v-if="form.isTeamA">
          <!-- A队正式球员 -->
          <el-form-item 
            v-for="i in 4" 
            :key="'A'+i" 
            :label="`A队球员${i}`">
            <el-select 
              v-model="form[`teamAPlayerId${i}`]"
              filterable
              clearable
              style="width:100%"
            >
              <el-option
                v-for="p in players"
                :key="p.playerId"
                :label="`${p.name} (${p.phone || '无号码'})`"
                :value="p.playerId"
              />
            </el-select>
          </el-form-item>
  
          <!-- A队替补球员 -->
          <el-form-item 
            v-for="i in 4" 
            :key="'Asub'+i" 
            :label="`A队替补${i}`">
            <el-select 
              v-model="form[`teamASubstitutePlayerId${i}`]"
              filterable
              clearable
              style="width:100%"
            >
              <el-option
                v-for="p in players"
                :key="p.playerId"
                :label="`${p.name} (${p.phone || '无号码'})`"
                :value="p.playerId"
              />
            </el-select>
          </el-form-item>
        </template>
  
        <template v-else>
          <!-- B队正式球员 -->
          <el-form-item 
            v-for="i in 4" 
            :key="'B'+i" 
            :label="`B队球员${i}`">
            <el-select 
              v-model="form[`teamBPlayerId${i}`]"
              filterable
              clearable
              style="width:100%"
            >
              <el-option
                v-for="p in players"
                :key="p.playerId"
                :label="`${p.name} (${p.phone || '无号码'})`"
                :value="p.playerId"
              />
            </el-select>
          </el-form-item>
  
          <!-- B队替补球员 -->
          <el-form-item 
            v-for="i in 4" 
            :key="'Bsub'+i" 
            :label="`B队替补${i}`">
            <el-select 
              v-model="form[`teamBSubstitutePlayerId${i}`]"
              filterable
              clearable
              style="width:100%"
            >
              <el-option
                v-for="p in players"
                :key="p.playerId"
                :label="`${p.name} (${p.phone || '无号码'})`"
                :value="p.playerId"
              />
            </el-select>
          </el-form-item>
        </template>
  
        <div style="text-align:center;margin-top:30px">
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="$router.push('/leader/match-b')">取消</el-button>
        </div>
      </el-form>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    props: ['matchBId'],
    data() {
      return {
        form: {
          isTeamA: null,
          // A队字段
          teamAPlayerId1: null,
          teamAPlayerId2: null,
          teamAPlayerId3: null,
          teamAPlayerId4: null,
          teamASubstitutePlayerId1: null,
          teamASubstitutePlayerId2: null,
          teamASubstitutePlayerId3: null,
          teamASubstitutePlayerId4: null,
          // B队字段
          teamBPlayerId1: null,
          teamBPlayerId2: null,
          teamBPlayerId3: null,
          teamBPlayerId4: null,
          teamBSubstitutePlayerId1: null,
          teamBSubstitutePlayerId2: null,
          teamBSubstitutePlayerId3: null,
          teamBSubstitutePlayerId4: null
        },
        players: []
      }
    },
    async created() {
      await this.loadPlayers()
      if (this.matchBId) {
        await this.loadDetail()
      }
    },
    methods: {
      async loadPlayers() {
        try {
          const { data } = await axios.get('/api/leader-match/player-info', {
            headers: { 'leader_token': localStorage.getItem('leader_token') }
          })
          this.players = data.data
        } catch (error) {
          this.$message.error('加载球员列表失败')
        }
      },
  
      async loadDetail() {
        try {
          const { data } = await axios.get(`/api/leader-match/get-b/${this.matchBId}`, {
            headers: { 'leader_token': localStorage.getItem('leader_token') }
          })
          
          // 直接合并数据并设置isTeamA
          this.form = { 
            ...this.form, // 保留初始字段
            ...data.data  // 覆盖后端返回数据
          }
          this.form.isTeamA = data.data.isTeamA // 明确设置isTeamA
  
        } catch (error) {
          this.$message.error('加载比赛详情失败')
        }
      },
  
      async handleSubmit() {
        try {
          const payload = {
            matchBId: this.matchBId,
            ...this.form
          }
  
          await axios.post('/api/leader-match/set-b', payload, {
            headers: { 'leader_token': localStorage.getItem('leader_token') }
          })
          
          this.$message.success('保存成功')
          this.$router.push('/leader/match-b')
        } catch (error) {
          this.$message.error('保存失败: ' + (error.response?.data?.message || '服务器错误'))
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .dialog-container {
    padding: 30px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0,0,0,.1);
  }
  
  .el-select {
    width: 100%;
  }
  </style>