<template>
  <div class="referee-register-container">
    <el-card class="box-card">
      <div class="title">新增裁判</div>
      <el-form :model="refereeForm" :rules="rules" ref="refereeForm" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="refereeForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passwordFirst">
          <el-input v-model="refereeForm.passwordFirst" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordSecond">
          <el-input v-model="refereeForm.passwordSecond" show-password></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="refereeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="refereeForm.department"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="refereeForm.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('refereeForm')">保存</el-button>
          <el-button type="primary" plain @click="resetForm('refereeForm')" style="margin-left: 10px;">取消</el-button>
          <el-button type="primary" plain @click="goToLogin" style="margin-left: 10px;">去登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'; // 引入 axios

export default {
  data() {
    return {
      refereeForm: {
        passwordFirst: '',
        passwordSecond: '',
        name: '',
        username: '',
        department: '',
        phone: ''
      },
      rules: {
        passwordFirst: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
        ],
        passwordSecond: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.validatePassword, trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入部门', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 使用 axios 发送 POST 请求
          axios.post('/api/referee/register', this.refereeForm)
            .then(response => {
              if (response.data.code === 1) {
                console.log('注册成功:', response.data.data);
                this.$message.success('保存成功');
                // 可以在这里添加其他操作，例如重置表单
                this.resetForm(formName);
              } else if (response.data.code === 0) {
                console.log('注册失败:', response.data.msg);
                this.$message.error(response.data.msg);
              } else {
                console.log('未知响应:', response.data);
                this.$message.error('未知错误');
              }
            })
            .catch(error => {
              console.error('注册失败:', error);
              if (error.response && error.response.data && error.response.data.msg) {
                this.$message.error(error.response.data.msg);
              } else {
                this.$message.error('请求失败，请稍后再试');
              }
            });
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    validatePassword(rule, value, callback) {
      if (value !== this.refereeForm.passwordFirst) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    },
    goToLogin() {
      this.$router.push('/login'); // 跳转到登录页面
    }
  }
};
</script>

<style scoped>
.referee-register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.box-card {
  width: 500px;
  padding: 20px;
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}
</style>