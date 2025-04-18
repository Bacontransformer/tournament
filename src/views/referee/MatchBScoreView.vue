<template>
    <div class="score-container">
      <el-form label-width="120px" class="score-form">
        <!-- 当前小节 -->
        <el-form-item label="当前小节">
          <div class="score-input">
            <el-input 
              v-model="form.currentSection" 
              disabled
              style="width: 200px;"
            />
          </div>
        </el-form-item>
  
        <!-- A队得分项 -->
        <el-form-item label="A队当前得分">
          <div class="score-input">
            <el-button 
              @click="adjustScore('teamAScore', -1)" 
              :disabled="form.teamAScore <= 0"
            >-</el-button>
            <el-input-number 
              v-model="form.teamAScore"
              :min="0"
              controls-position="right"
              disabled
            />
            <el-button @click="adjustScore('teamAScore', 1)">+</el-button>
          </div>
        </el-form-item>
  
        <!-- B队得分项 -->
        <el-form-item label="B队当前得分">
          <div class="score-input">
            <el-button 
              @click="adjustScore('teamBScore', -1)"
              :disabled="form.teamBScore <= 0"
            >-</el-button>
            <el-input-number 
              v-model="form.teamBScore"
              :min="0"
              controls-position="right"
              disabled
            />
            <el-button @click="adjustScore('teamBScore', 1)">+</el-button>
          </div>
        </el-form-item>
  
        <div class="action-buttons">
          <el-button type="danger" @click="handleEnd">结束比赛</el-button>
          <el-button @click="$router.push('/referee/match-b')">返回</el-button>
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
          teamAScore: 0,
          teamBScore: 0,
          currentSection: 1,
          sectionScore: '' // 每节分数
        }
      }
    },
    async created() {
      try {
        const res = await axios.get(`/api/referee-match/get-b/${this.matchBId}`, {
          headers: { 
            'referee_token': localStorage.getItem('referee_token') 
          }
        })
        this.form = {
          teamAScore: res.data.data.teamAScore,
          teamBScore: res.data.data.teamBScore,
          currentSection: res.data.data.currentSection,
          sectionScore: res.data.data.sectionScore
        }
      } catch (error) {
        console.error(error)
      }
    },
    methods: {
      async adjustScore(field, delta) {
        try {
          // 更新分数
          this.form[field] += delta
  
          // 调用后端接口
          await axios.post('/api/referee-match/score-b', {
            matchBId: this.matchBId,
            teamAScore: this.form.teamAScore,
            teamBScore: this.form.teamBScore
          }, {
            headers: { 
              'referee_token': localStorage.getItem('referee_token') 
            }
          })
  
          // 成功提示
          this.$message.success('分数更新成功')
  
          // 判断是否需要刷新页面
          if (
            this.form.teamAScore % this.form.sectionScore === 0 &&
            [1, 2, 3].includes(this.form.teamAScore / this.form.sectionScore)
          ) {
            window.location.reload()
          } else if (
            this.form.teamBScore % this.form.sectionScore === 0 &&
            [1, 2, 3].includes(this.form.teamBScore / this.form.sectionScore)
          ) {
            window.location.reload()
          }
        } catch (error) {
          // 错误提示
          this.$message.error('分数更新失败，请重试')
          console.error(error)
        }
      },
      async handleEnd() {
        try {
          // 校验得分是否满足条件
          const requiredScore = this.form.sectionScore * 4
          if (
            this.form.teamAScore !== requiredScore &&
            this.form.teamBScore !== requiredScore
          ) {
            this.$message.error(`比赛得分必须等于 ${requiredScore} 分`)
            return
          }
  
          // 调用后端接口结束比赛
          await axios.post(`/api/referee-match/end-b/${this.matchBId}`, null, {
            headers: { 
              'referee_token': localStorage.getItem('referee_token') 
            }
          })
  
          // 成功提示
          this.$message.success('比赛已结束')
          this.$router.push('/referee/match-b')
        } catch (error) {
          this.$message.error('结束比赛失败，请重试')
          console.error(error)
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
    align-items: center;
    gap: 10px;
    margin: 10px 0;
  }
  .action-buttons {
    margin-top: 30px;
    text-align: center;
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  </style>