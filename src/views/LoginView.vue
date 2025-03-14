<template>
  <div class="container">
    <img src="@/assets/login-1.png" class="logo" />
    <!-- 居中文字“欢迎来到羽毛球赛制系统” -->
    <div class="text-center">欢迎来到羽毛球赛制系统</div>
    <div class="visitor-link">
      <router-link to="/visitor">游客访问</router-link>
    </div>
    <!-- 用户名输入框 -->
    <div class="text-input">
      <el-input placeholder="请输入用户名" v-model="username" class="input-field"></el-input>
    </div>
    <div class="text-input">
      <!-- 密码输入框 -->
      <el-input placeholder="请输入密码" v-model="password" show-password class="input-field"></el-input>
    </div>
    <div class="select-button">
      <el-select v-model="value" placeholder="请选择角色" class="select-field">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-button type="primary" @click="login" class="login-button">登录</el-button>
    <div class="registration-links">
      <router-link to="/leader/register" class="registration-link">领队注册</router-link>
      <router-link to="/referee/register" class="registration-link">裁判注册</router-link>
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
      value: '',
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      if (!this.username || !this.password || !this.value) {
        this.$message.error('请填写所有字段');
        return;
      }

      const urlMap = {
        '选项1': '/api/admin/login',
        '选项2': '/api/leader/login',
        '选项3': '/api/referee/login'
      };

      const url = urlMap[this.value];

      if (!url) {
        this.$message.error('请选择一个有效的角色');
        return;
      }

      axios.post(url, {
        username: this.username,
        password: this.password
      })
        .then(res => {
          if (res.data.code == 1) {
            console.log('登录成功:', res.data);
            this.$message.success('登录成功');
            const token = res.data.data.token;
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
          }
          else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.error('登录失败:', error);
          this.$message.error('登录失败，请检查用户名和密码');
        });
    }
  }
}
</script>

<style>
.container {
  margin-top: 100px;
  text-align: center;
  padding: 0 20px;
  /* 添加内边距 */
}

.logo {
  width: 149px;
  height: 138px;
  margin-bottom: 20px;
}

.text-center {
  text-align: center;
  margin-bottom: 20px;
}

.visitor-link {
  margin-bottom: 20px;
  /* 添加底部外边距 */
}

.select-button {
  margin-bottom: 20px;
}

.text-input {
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  max-width: 300px;
}

.select-field {
  width: 100%;
  max-width: 300px;
}

.login-button {
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
  /* 添加底部外边距 */
}

.registration-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  /* 添加链接之间的间距 */
}

.registration-link {
  text-decoration: none;
  color: #409EFF;
  /* 设置链接颜色 */
  font-size: 14px;
  /* 设置链接字体大小 */
}

@media (max-width: 600px) {
  .container {
    margin-top: 50px;
  }

  .logo {
    width: 100px;
    height: 95px;
    margin-bottom: 10px;
  }

  .text-center {
    margin-bottom: 10px;
  }

  .visitor-link {
    margin-bottom: 10px;
    /* 调整底部外边距 */
  }

  .input-field,
  .select-field,
  .login-button {
    width: 100%;
  }

  .registration-links {
    flex-direction: column;
    /* 在小屏幕上垂直排列 */
    gap: 10px;
    /* 调整链接之间的间距 */
  }

  .registration-link {
    font-size: 12px;
    /* 调整链接字体大小 */
  }
}
</style>