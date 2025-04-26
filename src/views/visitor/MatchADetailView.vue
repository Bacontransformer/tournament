<template>
    <div class="optimized-detail-container">
      <el-card v-loading="!matchDetail" class="enhanced-detail-card">
        <!-- 头部信息 -->
        <div class="enhanced-header">
          <div class="header-content">
            <h1 class="match-title">{{ matchDetail.mode }}比赛详情</h1>
            <el-tag 
              :type="statusTypeMap[matchDetail.status]" 
              effect="dark"
              class="status-tag"
            >
              {{ getStatusLabel(matchDetail.status) }}
            </el-tag>
          </div>
          <div class="match-time-location">
            <div class="time">
              <i class="el-icon-time"></i>
              {{ formatTime(matchDetail.beginTime) }}
            </div>
            <div class="location">
              <i class="el-icon-location-outline"></i>
              场地 {{ matchDetail.venueNumber }}
            </div>
          </div>
        </div>
  
        <!-- 得分信息 -->
        <div v-if="matchDetail.status !== 0" class="score-section">
          <div class="score-display">
            <div class="team-score team-a">
              <div class="department">{{ matchDetail.teamADepartment }}</div>
              <div class="round-scores">
                <div 
                  v-for="(score, index) in teamAScores"
                  :key="`a-${index}`"
                  class="score-box"
                  :class="{ active: isCurrentRound(index) }"
                >
                  <div class="round-label">第{{ index + 1 }}局</div>
                  <div class="score-value">{{ score || '-' }}</div>
                </div>
              </div>
            </div>
            
            <div class="vs-badge">
              <span>VS</span>
            </div>
  
            <div class="team-score team-b">
              <div class="department">{{ matchDetail.teamBDepartment }}</div>
              <div class="round-scores">
                <div 
                  v-for="(score, index) in teamBScores"
                  :key="`b-${index}`"
                  class="score-box"
                  :class="{ active: isCurrentRound(index) }"
                >
                  <div class="round-label">第{{ index + 1 }}局</div>
                  <div class="score-value">{{ score || '-' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 队伍信息 -->
        <div class="team-section">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="team-card team-a-card">
                <div class="card-header">
                  <i class="el-icon-user-solid"></i>
                  <h3>{{ matchDetail.teamADepartment }}队</h3>
                </div>
                <div class="player-list">
                  <div class="player-item starter">
                    <span class="label">选手1：</span>
                    <span class="name">{{ matchDetail.teamAPlayer1Name }}</span>
                  </div>
                  <div v-if="matchDetail.teamAPlayer2Name" class="player-item starter">
                    <span class="label">选手2：</span>
                    <span class="name">{{ matchDetail.teamAPlayer2Name }}</span>
                  </div>
                  <template v-if="matchDetail.teamASubstitutePlayer1Name">
                    <div class="substitute-divider">替补队员</div>
                    <div class="player-item substitute">
                      <span class="name">{{ matchDetail.teamASubstitutePlayer1Name }}</span>
                    </div>
                    <div 
                      v-if="matchDetail.teamASubstitutePlayer2Name" 
                      class="player-item substitute"
                    >
                      <span class="name">{{ matchDetail.teamASubstitutePlayer2Name }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </el-col>
  
            <el-col :span="12">
              <div class="team-card team-b-card">
                <div class="card-header">
                  <i class="el-icon-user-solid"></i>
                  <h3>{{ matchDetail.teamBDepartment }}队</h3>
                </div>
                <div class="player-list">
                  <div class="player-item starter">
                    <span class="label">选手1：</span>
                    <span class="name">{{ matchDetail.teamBPlayer1Name }}</span>
                  </div>
                  <div v-if="matchDetail.teamBPlayer2Name" class="player-item starter">
                    <span class="label">选手2：</span>
                    <span class="name">{{ matchDetail.teamBPlayer2Name }}</span>
                  </div>
                  <template v-if="matchDetail.teamBSubstitutePlayer1Name">
                    <div class="substitute-divider">替补队员</div>
                    <div class="player-item substitute">
                      <span class="name">{{ matchDetail.teamBSubstitutePlayer1Name }}</span>
                    </div>
                    <div 
                      v-if="matchDetail.teamBSubstitutePlayer2Name" 
                      class="player-item substitute"
                    >
                      <span class="name">{{ matchDetail.teamBSubstitutePlayer2Name }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
  
        <!-- 操作栏 -->
        <div class="enhanced-action-bar">
          <el-button 
            type="primary" 
            icon="el-icon-back" 
            @click="$router.go(-1)"
            class="back-btn"
          >
            返回比赛列表
          </el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import dayjs from 'dayjs'
  
  const API_MAP = {
    'un-start': '/api/common/match-a/un-start',
    'doing': '/api/common/match-a/doing',
    'end': '/api/common/match-a/end'
  }
  
  export default {
    data() {
      return {
        matchDetail: null,
        statusTypeMap: {
          0: 'info',
          1: 'warning',
          2: 'success'
        }
      }
    },
    computed: {
      teamAScores() {
        return [
          this.matchDetail?.teamARoundScore1,
          this.matchDetail?.teamARoundScore2,
          this.matchDetail?.teamARoundScore3
        ]
      },
      teamBScores() {
        return [
          this.matchDetail?.teamBRoundScore1,
          this.matchDetail?.teamBRoundScore2,
          this.matchDetail?.teamBRoundScore3
        ]
      }
    },
    created() {
      this.fetchDetail()
    },
    methods: {
      getStatusLabel(status) {
        return ['未开始', '进行中', '已结束'][status] || '未知'
      },
      formatTime(time) {
        return dayjs(time).format('YYYY-MM-DD HH:mm')
      },
      isCurrentRound(index) {
        return this.matchDetail.status === 1 && 
               index === this.matchDetail.currentRound - 1
      },
      async fetchDetail() {
        try {
          const { status, matchModeId } = this.$route.params
          const { data } = await axios.get(`${API_MAP[status]}/${matchModeId}`)
          this.matchDetail = data.data
        } catch (error) {
          console.error('获取详情失败:', error)
          this.$message.error('获取比赛详情失败')
          this.$router.go(-1)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .optimized-detail-container {
    padding: 20px;
    background: #f5f7fa;
    min-height: 100vh;
  }
  
  .enhanced-detail-card {
    max-width: 1000px;
    margin: 0 auto;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }
  
  .enhanced-header {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  
  .match-title {
    margin: 0;
    font-size: 24px;
    color: #303133;
  }
  
  .status-tag {
    font-size: 16px;
    padding: 8px 15px;
    border-radius: 20px;
  }
  
  .match-time-location {
    display: flex;
    gap: 30px;
    color: #606266;
  }
  
  .match-time-location i {
    margin-right: 6px;
  }
  
  .score-section {
    padding: 25px;
    background: #f8f9fc;
    margin: 20px;
    border-radius: 8px;
  }
  
  .score-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
  }
  
  .team-score {
    flex: 1;
    max-width: 300px;
  }
  
  .department {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 15px;
    text-align: center;
  }
  
  .round-scores {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
  
  .score-box {
    background: #fff;
    border-radius: 8px;
    padding: 12px;
    text-align: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    transition: all 0.3s;
  }
  
  .score-box.active {
    background: #409EFF;
    color: white;
  }
  
  .score-box.active .round-label {
    opacity: 0.8;
  }
  
  .round-label {
    font-size: 12px;
    color: inherit;
    opacity: 0.6;
    margin-bottom: 6px;
  }
  
  .score-value {
    font-size: 20px;
    font-weight: bold;
  }
  
  .vs-badge {
    width: 60px;
    height: 60px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: #F56C6C;
    box-shadow: 0 2px 12px rgba(245,108,108,0.15);
  }
  
  .team-section {
    padding: 20px;
  }
  
  .team-card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    height: 100%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .card-header i {
    font-size: 24px;
    color: #409EFF;
  }
  
  .card-header h3 {
    margin: 0;
    font-size: 18px;
    color: #303133;
  }
  
  .player-list {
    display: grid;
    gap: 12px;
  }
  
  .player-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-radius: 6px;
    background: #f8f9fc;
  }
  
  .player-item.starter {
    border-left: 4px solid #67C23A;
  }
  
  .player-item.substitute {
    border-left: 4px solid #909399;
  }
  
  .substitute-divider {
    margin: 15px 0;
    color: #909399;
    font-size: 12px;
    text-align: center;
    position: relative;
  }
  
  .substitute-divider::before,
  .substitute-divider::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 30%;
    height: 1px;
    background: #ebeef5;
  }
  
  .substitute-divider::before {
    left: 0;
  }
  
  .substitute-divider::after {
    right: 0;
  }
  
  .enhanced-action-bar {
    padding: 20px;
    border-top: 1px solid #ebeef5;
    text-align: center;
  }
  
  .back-btn {
    padding: 12px 40px;
    border-radius: 20px;
    transition: all 0.3s;
  }
  
  .back-btn:hover {
    transform: translateX(-5px);
  }
  
  @media (max-width: 768px) {
    .score-display {
      flex-direction: column;
      gap: 20px;
    }
  
    .vs-badge {
      transform: rotate(90deg);
      margin: 15px 0;
    }
  
    .team-section {
      padding: 0;
    }
  
    .team-card {
      margin-bottom: 15px;
    }
  }
  </style>