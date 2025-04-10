<template>
  <div class="score-container">
    <el-form label-width="120px" class="score-form">
      <!-- A队得分项 -->
      <el-form-item 
        v-for="n in gameCount" 
        :key="'a-'+n"
        :label="`第${n}局A队得分`"
      >
        <div class="score-input">
          <el-button 
            @click="scores[`teamAScore${n}`]--" 
            :disabled="scores[`teamAScore${n}`] <= 0"
          >
            -
          </el-button>
          <el-input-number 
            v-model="scores[`teamAScore${n}`]"
            :min="0"
            controls-position="right"
          />
          <el-button @click="scores[`teamAScore${n}`]++">
            +
          </el-button>
        </div>
      </el-form-item>

      <!-- B队得分项 -->
      <el-form-item 
        v-for="n in gameCount" 
        :key="'b-'+n"
        :label="`第${n}局B队得分`"
      >
        <div class="score-input">
          <el-button 
            @click="scores[`teamBScore${n}`]--" 
            :disabled="scores[`teamBScore${n}`] <= 0"
          >
            -
          </el-button>
          <el-input-number 
            v-model="scores[`teamBScore${n}`]"
            :min="0"
            controls-position="right"
          />
          <el-button @click="scores[`teamBScore${n}`]++">
            +
          </el-button>
        </div>
      </el-form-item>

      <div class="action-buttons">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button type="danger" @click="handleEndMatch">结束比赛</el-button>
        <el-button @click="$router.push('/referee/match-a')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: ['matchModeId'],
  data() {
    return {
      matchAId: '',
      gameCount: '',
      scores: {
        teamAScore1: 0,
        teamBScore1: 0,
        teamAScore2: 0,
        teamBScore2: 0,
        teamAScore3: 0,
        teamBScore3: 0
      }
    }
  },
  async created() {
    try {
      const res = await axios.get(`/api/referee-match/get-a/${this.matchModeId}`, {
        headers: { 
          'referee_token': localStorage.getItem('referee_token') 
        }
      })
      
      this.matchAId = res.data.data.matchAId
      this.gameCount = res.data.data.gameCount
      this.scores = {
        teamAScore1: res.data.data.teamARoundScore1,
        teamBScore1: res.data.data.teamBRoundScore1,
        teamAScore2: res.data.data.teamARoundScore2 || 0,
        teamBScore2: res.data.data.teamBRoundScore2 || 0,
        teamAScore3: res.data.data.teamARoundScore3 || 0,
        teamBScore3: res.data.data.teamBRoundScore3 || 0
      }
    } catch (error) {
      this.$message.error('数据加载失败')
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const scoreData = {
          matchAId: this.matchAId,
          matchModeId: this.matchModeId,
          teamARoundScore1: this.scores.teamAScore1,
          teamBRoundScore1: this.scores.teamBScore1,
          teamARoundScore2: this.scores.teamAScore2,
          teamBRoundScore2: this.scores.teamBScore2,
          teamARoundScore3: this.scores.teamAScore3,
          teamBRoundScore3: this.scores.teamBScore3
        }

        await axios.post('/api/referee-match/score-a', scoreData, {
          headers: { 
            'referee_token': localStorage.getItem('referee_token') 
          }
        })
        
        this.$message.success('保存成功')
      } catch (error) {
        this.$message.error('保存失败')
      }
    },

    async handleEndMatch() {
      try {
        await axios.post(`/api/referee-match/end-a/${this.matchModeId}`, null, {
          headers: { 
            'referee_token': localStorage.getItem('referee_token') 
          }
        })
        
        this.$message.success('比赛已结束')
        this.$router.push('/referee/match-a')
      } catch (error) {
        this.$message.error('结束比赛失败')
      }
    }
  }
}
</script>

<style scoped>
.score-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}
.score-form {
  text-align: center;
}
.score-input {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
}
.action-buttons {
  margin-top: 30px;
  text-align: center;
}
</style>