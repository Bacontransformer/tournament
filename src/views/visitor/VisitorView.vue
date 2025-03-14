<template>
  <el-container>
    <el-header>
      <div class="header-content">
        <div class="logout-container">
          <el-button type="text" @click="logout" class="logout-button">退出登录</el-button>
        </div>
        <div class="title-container">
          <span>赛事比分</span>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="100px">
        <router-link to="/visitor/match-a" class="aside-link">传统比赛</router-link>
        <router-link to="/visitor/match-b" class="aside-link">趣味赛</router-link>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout() {
      // 跳转到登录页面
      this.$router.push('/login');
    }
  }
}
</script>

<style>
.el-header {
  background-color: #409EFF; /* 蓝色 */
  color: #fff;
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logout-container {
  display: flex;
  align-items: center;
}

.title-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logout-button {
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.el-aside {
  background-color: #f0f2f5; /* 浅灰色 */
  color: #333;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%; /* 确保 el-aside 占据整个高度 */
}

.aside-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 280px; /* 调整高度以适应内容 */
  padding: 10px 0;
  color: #333;
  text-decoration: none;
  border-bottom: 1px solid #ccc;
  transition: background-color 0.3s, color 0.3s;
}

.aside-link:hover {
  background-color: #e0e0e0;
  color: #409EFF;
}

.aside-link:last-child {
  border-bottom: none;
}

.el-main {
  background-color: #ffffff; /* 白色 */
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>