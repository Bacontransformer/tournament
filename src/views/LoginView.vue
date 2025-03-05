<template>
  <div class="container">
    <img src="@/assets/login-1.png" class="logo"/>
    <!-- 居中文字“欢迎来到羽毛球赛制系统” -->
    <div class="text-center">欢迎来到羽毛球赛制系统</div>
    <!-- 用户名输入框 -->
    <div class="text-input">
      <el-input placeholder="请输入用户名" v-model="username" class="input-field"></el-input>
    </div>
    <div class="text-input">
      <!-- 密码输入框 -->
      <el-input placeholder="请输入密码" v-model="password" show-password class="input-field"></el-input>
    </div>
    
    <div class="select-button">
      <el-select v-model="value" placeholder="请选择" class="select-field">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    
    <el-button type="primary" @click="login" class="login-button">登录</el-button>
  </div>
</template>

<script>
export default {
  data () {
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
      // 登录逻辑
      console.log('用户名:', this.username);
      console.log('密码:', this.password);
      console.log('角色:', this.value);
    }
  }
}
</script>

<style>
  .container {
    margin-top: 100px;
    text-align: center;
    padding: 0 20px; /* 添加内边距 */
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
    .input-field,
    .select-field,
    .login-button {
      width: 100%;
    }
  }
</style>