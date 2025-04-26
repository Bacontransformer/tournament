<template>
  <div class="login-container">
    <!-- 动态背景层 -->
    <div class="background-layer"></div>
    
    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- 品牌展示区 -->
      <div class="brand-section">
        <img src="@/assets/login-1.png" class="brand-logo" />
        <h1 class="brand-title">欢迎来到羽毛球赛制系统</h1>
        <p class="brand-subtitle">Professional Badminton Tournament System</p>
      </div>

      <!-- 表单交互区 -->
      <div class="form-section">
        <el-button 
          type="text" 
          class="guest-entry"
          @click="$router.push('/visitor')"
        >
          <i class="el-icon-view"></i> 游客通道
        </el-button>

        <el-input
          v-model="username"
          placeholder="用户名"
          prefix-icon="el-icon-user"
          class="modern-input"
        ></el-input>

        <el-input
          v-model="password"
          type="password"
          placeholder="密码"
          prefix-icon="el-icon-lock"
          show-password
          class="modern-input"
        ></el-input>

        <el-select
          v-model="value"
          placeholder="选择角色"
          class="role-select"
          prefix-icon="el-icon-s-custom"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>

        <el-button 
          type="primary" 
          class="login-btn"
          :loading="loading"
          @click="login"
        >
          <template #default>
            <i class="el-icon-s-promotion"></i> 立即登录
          </template>
        </el-button>

        <div class="registration-links">
          <router-link to="/leader/register" class="reg-link">
            <i class="el-icon-edit-outline"></i> 领队注册
          </router-link>
          <router-link to="/referee/register" class="reg-link">
            <i class="el-icon-document-checked"></i> 裁判注册
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      options: [
        { value: '选项1', label: '管理员' },
        { value: '选项2', label: '领队' },
        { value: '选项3', label: '裁判' }
      ],
      value: '选项1',
      username: '',
      password: '',
      loading: false
    }
  },
  methods: {
    async login() {
      if (!this.validateForm()) return;
      
      this.loading = true;
      try {
        const response = await axios.post(this.getApiUrl(), {
          username: this.username,
          password: this.password
        });

        this.handleLoginResponse(response);
      } catch (error) {
        this.handleLoginError(error);
      } finally {
        this.loading = false;
      }
    },
    validateForm() {
      if (!this.username || !this.password || !this.value) {
        this.$message.error('请填写所有字段');
        return false;
      }
      return true;
    },
    getApiUrl() {
      const urlMap = {
        '选项1': '/api/admin/login',
        '选项2': '/api/leader/login',
        '选项3': '/api/referee/login'
      };
      return urlMap[this.value];
    },
    handleLoginResponse(response) {
      if (response.data.code === 1) {
        console.log('登录成功:', response.data);
        this.$message.success('登录成功');
        const token = response.data.data.token;
        switch (this.value) {
          case '选项1':
            this.$router.push('/admin');
            localStorage.setItem('admin_token', token);
            break;
          case '选项2':
            this.$router.push('/leader');
            localStorage.setItem('leader_token', token);
            break;
          case '选项3':
            this.$router.push('/referee');
            localStorage.setItem('referee_token', token);
            break;
          default:
            this.$message.error('未知的角色');
            break;
        }
      } else {
        this.$message.error(response.data.msg);
      }
    },
    handleLoginError(error) {
      console.error('登录失败:', error);
      this.$message.error('登录失败，请检查用户名和密码');
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  .background-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .login-card {
    width: 420px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    z-index: 1;
    overflow: hidden;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    .brand-section {
      padding: 40px 0;
      background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
      color: white;
      text-align: center;

      .brand-logo {
        width: 120px;
        height: auto;
        margin-bottom: 20px;
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
      }

      .brand-title {
        font-size: 24px;
        margin: 0;
        letter-spacing: 2px;
        font-weight: 600;
      }

      .brand-subtitle {
        font-size: 12px;
        opacity: 0.9;
        margin: 8px 0 0;
      }
    }

    .form-section {
      padding: 40px 30px;

      .modern-input {
        margin-bottom: 24px;
        transition: all 0.3s;

        &:deep(.el-input__inner) {
          height: 48px;
          border-radius: 12px;
          padding-left: 48px;
          border: 1px solid #e4e7ed;
          transition: all 0.3s;

          &:hover {
            border-color: #409EFF;
          }

          &:focus {
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
          }
        }

        &:deep(.el-input__prefix) {
          left: 15px;
          font-size: 18px;
          color: #909399;
        }
      }

      .role-select {
        width: 100%;
        margin-bottom: 24px;

        &:deep(.el-input__inner) {
          border-radius: 12px;
          height: 48px;
          padding-left: 48px;
        }
      }

      .login-btn {
        width: 100%;
        height: 48px;
        border-radius: 12px;
        font-size: 16px;
        letter-spacing: 2px;
        transition: all 0.3s;

        i {
          margin-right: 8px;
          font-size: 18px;
        }

        &:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
        }
      }

      .guest-entry {
        width: 100%;
        color: #409EFF;
        margin-bottom: 24px;
        font-size: 14px;

        i {
          margin-right: 8px;
        }
      }

      .registration-links {
        margin-top: 24px;
        display: flex;
        justify-content: center;
        gap: 24px;

        .reg-link {
          color: #666;
          font-size: 13px;
          text-decoration: none;
          transition: color 0.3s;

          i {
            margin-right: 6px;
            font-size: 14px;
          }

          &:hover {
            color: #409EFF;
          }
        }
      }
    }
  }
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (max-width: 768px) {
  .login-card {
    width: 90% !important;
    margin: 0 5%;

    .brand-section {
      padding: 30px 0;
    }

    .form-section {
      padding: 30px 20px;
    }
  }
}
</style>