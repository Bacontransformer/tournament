<template>
  <div class="optimized-score-container">
    <el-card shadow="hover" class="score-card">
      <div class="header-section">
        <h2 class="match-title">比赛得分录入</h2>
        <div class="match-info">
          <el-tag type="info">比赛ID: {{ matchModeId }}</el-tag>
          <el-tag type="success">总局数: {{ gameCount }}</el-tag>
        </div>
      </div>

      <el-form 
        label-position="top" 
        class="optimized-score-form"
        v-loading="loading"
      >
        <div class="round-group" v-for="n in gameCount" :key="n">
          <el-card shadow="never" class="round-card">
            <div class="round-header">
              <span class="round-title">第{{ n }}局</span>
              <el-tag v-if="showRoundWinner(n)" :type="roundWinnerType(n)" effect="dark">
                {{ roundWinnerText(n) }}
              </el-tag>
            </div>
            
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <div class="team-score a-team">
                  <h4 class="team-label">A队得分</h4>
                  <div class="score-control">
                    <el-button 
                      circle 
                      @click="scores[`teamARoundScore${n}`]--" 
                      :disabled="scores[`teamARoundScore${n}`] <= 0"
                      icon="el-icon-minus"
                    />
                    <el-input-number 
                      v-model="scores[`teamARoundScore${n}`]" 
                      :min="0" 
                      controls-position="right"
                      class="score-input"
                      @change="updateTotal"
                    />
                    <el-button 
                      circle 
                      @click="scores[`teamARoundScore${n}`]++"
                      icon="el-icon-plus"
                    />
                  </div>
                </div>
              </el-col>

              <el-col :xs="24" :sm="12">
                <div class="team-score b-team">
                  <h4 class="team-label">B队得分</h4>
                  <div class="score-control">
                    <el-button 
                      circle 
                      @click="scores[`teamBRoundScore${n}`]--" 
                      :disabled="scores[`teamBRoundScore${n}`] <= 0"
                      icon="el-icon-minus"
                    />
                    <el-input-number 
                      v-model="scores[`teamBRoundScore${n}`]" 
                      :min="0" 
                      controls-position="right"
                      class="score-input"
                      @change="updateTotal"
                    />
                    <el-button 
                      circle 
                      @click="scores[`teamBRoundScore${n}`]++"
                      icon="el-icon-plus"
                    />
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>

        <div class="total-score">
          <el-tag type="warning" class="total-tag">
            A队总分: {{ totalA }}
          </el-tag>
          <el-tag type="warning" class="total-tag">
            B队总分: {{ totalB }}
          </el-tag>
        </div>

        <div class="optimized-actions">
          <el-button 
            type="primary" 
            @click="handleSubmit"
            :loading="submitting"
            icon="el-icon-check"
            class="action-btn"
          >
            保存进度
          </el-button>
          <el-button 
            type="danger" 
            @click="confirmEndMatch"
            :loading="ending"
            icon="el-icon-switch-button"
            class="action-btn"
          >
            结束比赛
          </el-button>
          <el-button 
            @click="$router.push('/referee/match-a')"
            icon="el-icon-close"
            class="action-btn"
          >
            返回列表
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['matchModeId'],
  data() {
    return {
      matchAId: '',
      gameCount: 3,
      scores: {
        teamARoundScore1: 0,
        teamBRoundScore1: 0,
        teamARoundScore2: 0,
        teamBRoundScore2: 0,
        teamARoundScore3: 0,
        teamBRoundScore3: 0
      },
      loading: false,
      submitting: false,
      ending: false
    }
  },
  computed: {
    totalA() {
      return Object.keys(this.scores)
        .filter(k => k.startsWith('teamAScore'))
        .reduce((sum, key) => sum + this.scores[key], 0)
    },
    totalB() {
      return Object.keys(this.scores)
        .filter(k => k.startsWith('teamBScore'))
        .reduce((sum, key) => sum + this.scores[key], 0)
    }
  },
  async created() {
    await this.loadMatchData()
  },
  methods: {
    async loadMatchData() {
      this.loading = true
      try {
        const res = await axios.get(`/api/referee-match/get-a/${this.matchModeId}`, {
          headers: {
            'referee_token': localStorage.getItem('referee_token')
          }
        })

        const data = res.data.data
        this.matchAId = data.matchAId
        this.gameCount = data.gameCount
        this.scores = {
          teamARoundScore1: data.teamARoundScore1,
          teamBRoundScore1: data.teamBRoundScore1,
          teamARoundScore2: data.teamARoundScore2 || 0,
          teamBRoundScore2: data.teamBRoundScore2 || 0,
          teamARoundScore3: data.teamARoundScore3 || 0,
          teamBRoundScore3: data.teamBRoundScore3 || 0
        }
      } catch (error) {
        this.$message.error('数据加载失败')
      } finally {
        this.loading = false
      }
    },

    showRoundWinner(n) {
      return this.scores[`teamAScore${n}`] !== this.scores[`teamBScore${n}`]
    },

    roundWinnerType(n) {
      return this.scores[`teamAScore${n}`] > this.scores[`teamBScore${n}`] 
        ? 'success' 
        : 'danger'
    },

    roundWinnerText(n) {
      return this.scores[`teamAScore${n}`] > this.scores[`teamBScore${n}`]
        ? 'A队胜'
        : 'B队胜'
    },

    updateTotal() {
      // 触发计算属性更新
    },

    async handleSubmit() {
      this.submitting = true
      try {
        const scoreData = {
          matchAId: this.matchAId,
          matchModeId: this.matchModeId,
          ...this.scores
        }

        await axios.post('/api/referee-match/score-a', scoreData, {
          headers: {
            'referee_token': localStorage.getItem('referee_token')
          }
        })

        this.$message.success('得分保存成功')
      } catch (error) {
        this.$message.error('保存失败: ' + (error.response?.data?.message || ''))
      } finally {
        this.submitting = false
      }
    },

    confirmEndMatch() {
      this.$confirm(`确定要结束比赛吗？结束后将不可修改`, '确认结束', {
        confirmButtonText: '确定结束',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }).then(this.handleEndMatch)
    },

    async handleEndMatch() {
      this.ending = true
      try {
        await axios.post(`/api/referee-match/end-a/${this.matchModeId}`, null, {
          headers: {
            'referee_token': localStorage.getItem('referee_token')
          }
        })

        this.$message.success('比赛已结束')
        this.$router.push('/referee/match-a')
      } catch (error) {
        this.$message.error('结束失败: ' + (error.response?.data?.message || ''))
      } finally {
        this.ending = false
      }
    }
  }
}
</script>

<style scoped>
.optimized-score-container {
  max-width: 1000px;
  margin: 24px auto;
  padding: 0 20px;
}

.score-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.header-section {
  text-align: center;
  margin-bottom: 32px;
}

.match-title {
  color: #303133;
  margin-bottom: 16px;
}

.match-info {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

.round-card {
  margin-bottom: 24px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.round-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.round-title {
  font-size: 16px;
  font-weight: 600;
  color: #409EFF;
}

.team-score {
  padding: 16px;
  border-radius: 8px;
  margin: 12px 0;
}

.a-team {
  background: #f0faff;
  border: 1px solid #c6e2ff;
}

.b-team {
  background: #fff6f0;
  border: 1px solid #ffdbc7;
}

.team-label {
  color: #606266;
  margin: 0 0 12px 0;
}

.score-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.score-input {
  width: 120px;
}

::v-deep .score-input .el-input__inner {
  text-align: center;
  font-weight: bold;
  font-size: 16px;
}

.total-score {
  margin: 32px 0;
  text-align: center;
  display: flex;
  gap: 24px;
  justify-content: center;
}

.total-tag {
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 20px;
}

.optimized-actions {
  margin-top: 40px;
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 6px;
  min-width: 140px;
}

@media (max-width: 768px) {
  .optimized-score-container {
    padding: 0 12px;
  }

  .score-control {
    gap: 8px;
  }

  .score-input {
    width: 100px;
  }

  .team-score {
    padding: 12px;
  }

  .action-btn {
    width: 100%;
    margin-bottom: 8px;

  }
}
</style>