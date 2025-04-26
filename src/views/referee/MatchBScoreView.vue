<template>
    <div class="optimized-score-container">
      <el-card shadow="hover" class="score-card">
        <div class="header-section">
          <h2 class="match-title">B类比赛计分</h2>
          <div class="match-info">
            <el-tag type="info" effect="dark">比赛ID: {{ matchBId }}</el-tag>
            <el-tag type="warning" effect="dark">每节目标分数: {{ form.sectionScore }}</el-tag>
          </div>
        </div>
  
        <el-form 
          label-position="top" 
          class="optimized-score-form"
          v-loading="loading"
        >
          <!-- 当前小节 -->
          <div class="current-section">
            <el-statistic title="当前小节" :value="form.currentSection" class="section-display">
              <template #suffix>
                <el-tag type="primary" effect="plain" size="small">节</el-tag>
              </template>
            </el-statistic>
          </div>
  
          <!-- A队计分 -->
          <el-card shadow="never" class="team-card a-team">
            <div class="team-header">
              <h3 class="team-title">A队得分</h3>
              <el-tag type="info">目标: {{ form.sectionScore * 4 }} 分</el-tag>
            </div>
            <div class="score-control-group">
              <el-button 
                circle 
                icon="el-icon-minus" 
                @click="adjustScore('teamAScore', -1)" 
                :disabled="form.teamAScore <= 0"
              />
              <el-input-number 
                v-model="form.teamAScore" 
                :min="0" 
                controls-position="right"
                class="score-input"
                :class="{ 'score-complete': form.teamAScore >= form.sectionScore * 4 }"
              />
              <el-button 
                circle 
                icon="el-icon-plus"
                @click="adjustScore('teamAScore', 1)"
              />
            </div>
            <div class="score-progress">
              <el-progress 
                :percentage="(form.teamAScore / (form.sectionScore * 4)) * 100" 
                :color="form.teamAScore >= form.sectionScore * 4 ? '#67C23A' : '#409EFF'"
                :stroke-width="12"
                :show-text="false"
              />
            </div>
          </el-card>
  
          <!-- B队计分 -->
          <el-card shadow="never" class="team-card b-team">
            <div class="team-header">
              <h3 class="team-title">B队得分</h3>
              <el-tag type="info">目标: {{ form.sectionScore * 4 }} 分</el-tag>
            </div>
            <div class="score-control-group">
              <el-button 
                circle 
                icon="el-icon-minus" 
                @click="adjustScore('teamBScore', -1)" 
                :disabled="form.teamBScore <= 0"
              />
              <el-input-number 
                v-model="form.teamBScore" 
                :min="0" 
                controls-position="right"
                class="score-input"
                :class="{ 'score-complete': form.teamBScore >= form.sectionScore * 4 }"
              />
              <el-button 
                circle 
                icon="el-icon-plus"
                @click="adjustScore('teamBScore', 1)"
              />
            </div>
            <div class="score-progress">
              <el-progress 
                :percentage="(form.teamBScore / (form.sectionScore * 4)) * 100" 
                :color="form.teamBScore >= form.sectionScore * 4 ? '#67C23A' : '#F56C6C'"
                :stroke-width="12"
                :show-text="false"
              />
            </div>
          </el-card>
  
          <!-- 操作按钮 -->
          <div class="optimized-actions">
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
              @click="$router.push('/referee/match-b')"
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
    props: ['matchBId'],
    data() {
      return {
        form: {
          teamAScore: 0,
          teamBScore: 0,
          currentSection: 1,
          sectionScore: 0
        },
        loading: false,
        ending: false
      }
    },
    async created() {
      await this.loadMatchData()
    },
    methods: {
      async loadMatchData() {
        this.loading = true
        try {
          const res = await axios.get(`/api/referee-match/get-b/${this.matchBId}`, {
            headers: {
              'referee_token': localStorage.getItem('referee_token')
            }
          })
          
          const data = res.data.data
          this.form = {
            teamAScore: data.teamAScore,
            teamBScore: data.teamBScore,
            currentSection: data.currentSection,
            sectionScore: data.sectionScore
          }
        } catch (error) {
          this.$message.error('比赛数据加载失败')
        } finally {
          this.loading = false
        }
      },
  
      async adjustScore(field, delta) {
        try {
          this.form[field] = Math.max(0, this.form[field] + delta)
          
          await axios.post('/api/referee-match/score-b', {
            matchBId: this.matchBId,
            teamAScore: this.form.teamAScore,
            teamBScore: this.form.teamBScore
          }, {
            headers: {
              'referee_token': localStorage.getItem('referee_token')
            }
          })
  
          this.$message.success('分数更新成功')
          this.checkSectionComplete()
        } catch (error) {
          this.$message.error('更新失败: ' + (error.response?.data?.message || ''))
          this.form[field] -= delta // 回滚分数
        }
      },
  
      checkSectionComplete() {
        const target = this.form.sectionScore
        const checkTeam = (score) => score > 0 && score % target === 0 && score / target <= 4
        
        if (checkTeam(this.form.teamAScore) || checkTeam(this.form.teamBScore)) {
          this.$confirm('小节分数已达标，是否进入下一节？', '小节完成', {
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          }).then(() => {
            window.location.reload()
          })
        }
      },
  
      confirmEndMatch() {
        this.$confirm(`确定要结束比赛吗？必须有一方达到 ${this.form.sectionScore * 4} 分`, '确认结束', {
          confirmButtonText: '确定结束',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'el-button--danger'
        }).then(this.handleEnd)
      },
  
      async handleEnd() {
        this.ending = true
        try {
          await axios.post(`/api/referee-match/end-b/${this.matchBId}`, null, {
            headers: {
              'referee_token': localStorage.getItem('referee_token')
            }
          })
          
          this.$message.success('比赛已结束')
          this.$router.push('/referee/match-b')
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
    max-width: 800px;
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
    padding: 16px 0;
    border-bottom: 1px solid #ebeef5;
  }
  
  .match-title {
    color: #303133;
    margin-bottom: 16px;
  }
  
  .match-info {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
  
  .team-card {
    margin-bottom: 24px;
    border-radius: 8px;
  }
  
  .a-team {
    border: 2px solid #409EFF;
    background: #f0faff;
  }
  
  .b-team {
    border: 2px solid #F56C6C;
    background: #fef0f0;
  }
  
  .team-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .team-title {
    margin: 0;
    font-size: 16px;
  }
  
  .score-control-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin: 20px 0;
  }
  
  .score-input {
    width: 120px;
  }
  
  ::v-deep .score-input .el-input__inner {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
  
  .score-complete ::v-deep .el-input__inner {
    color: #67C23A;
    border-color: #67C23A;
  }
  
  .score-progress {
    margin: 16px 0 8px;
  }
  
  ::v-deep .el-progress-bar {
    padding-right: 0;
  }
  
  .section-display {
    text-align: center;
    margin: 24px 0;
  }
  
  ::v-deep .section-display .el-statistic__content {
    font-size: 36px;
    color: #409EFF;
  }
  
  .optimized-actions {
    margin-top: 32px;
    display: flex;
    gap: 16px;
    justify-content: center;
  }
  
  .action-btn {
    padding: 12px 24px;
    border-radius: 6px;
    min-width: 160px;
  }
  
  @media (max-width: 768px) {
    .optimized-score-container {
      padding: 0 12px;
    }
  
    .score-control-group {
      gap: 12px;
    }
  
    .score-input {
      width: 100px;
    }
  
    .action-btn {
      width: 100%;
      margin-bottom: 8px;
    }
  
    ::v-deep .section-display .el-statistic__content {
      font-size: 28px;
    }
  }
  </style>