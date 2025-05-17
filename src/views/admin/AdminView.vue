<template>
  <el-container class="admin-container">
    <!-- 头部优化 -->
    <el-header class="admin-header">
      <div class="header-content">
        <!-- 退出按钮移到左边 -->
        <el-button 
          type="danger" 
          plain 
          @click="logout"
          class="logout-btn"
        >
          <i class="el-icon-switch-button"></i>
          退出系统
        </el-button>

        <!-- 标题居中 -->
        <div class="title-container">
          <h1 class="admin-title">管理员端</h1>
          <div class="sub-title">ADMIN PANEL</div>
        </div>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏优化 -->
      <el-aside width="160px" class="admin-aside">
        <el-menu
          :default-active="$route.path"
          class="side-menu"
          background-color="#f8f9fa"
          active-text-color="#409EFF"
          router
        >
        <el-menu-item 
            index="/admin/event"
            class="menu-item"
          >
            <i class="el-icon-trophy"></i>
            <span>赛事管理</span>
          </el-menu-item>
          
          <el-menu-item 
            index="/admin/authorize/leader"
            class="menu-item"
          >
            <i class="el-icon-user-solid"></i>
            <span>领队授权</span>
          </el-menu-item>

          <el-menu-item 
            index="/admin/authorize/referee"
            class="menu-item"
          >
            <i class="el-icon-s-opportunity"></i>
            <span>裁判授权</span>
          </el-menu-item>

          
        </el-menu>
      </el-aside>

      <!-- 主内容区优化 -->
      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('admin_token');
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="scss" scoped>
.admin-container {
  height: 100vh;

  .admin-header {
    background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    height: 80px !important;
    padding: 0 40px;

    .header-content {
      position: relative; /* 添加相对定位 */
      display: flex;
      justify-content: center; /* 标题居中 */
      align-items: center;
      height: 100%;

      .title-container {
        text-align: center; /* 文字居中 */

        .admin-title {
          font-size: 24px;
          margin: 0;
          letter-spacing: 2px;
          color: white;
        }

        .sub-title {
          font-size: 12px;
          opacity: 0.8;
          color: white;
        }
      }

      .logout-btn {
        position: absolute; /* 绝对定位 */
        left: 40px; /* 固定在左侧 */
        top: 50%; /* 垂直居中 */
        transform: translateY(-50%);
        padding: 10px 20px;
        border-radius: 20px;

        i {
          margin-right: 8px;
        }
      }
    }
  }

  .admin-aside {
    background: #f8f9fa;
    border-right: 1px solid #ebeef5;

    .side-menu {
      border-right: none;

      .menu-item {
        height: 60px;
        line-height: 60px;
        margin: 8px 12px;
        border-radius: 8px;
        transition: all 0.3s;

        &:hover {
          background-color: #e9f5ff !important;
        }

        &.is-active {
          background-color: #e9f5ff !important;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 60%;
            background: #409EFF;
            border-radius: 2px;
          }
        }

        i {
          font-size: 18px;
          margin-right: 10px;
        }

        span {
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }

  .admin-main {
    background: #f5f7fa;
    padding: 30px;
    min-height: calc(100vh - 80px);
  }
}
</style>