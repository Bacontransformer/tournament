<template>
    <el-container>
        <el-header>admin管理端</el-header>
        <el-container>
            <el-aside width="100px">
                <router-link to="/admin/authorize/leader" class="aside-link">领队授权</router-link>
                <router-link to="/admin/authorize/referee" class="aside-link">裁判授权</router-link>
            </el-aside>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
  </template>
  
  <style>
  .el-header {
    background-color: #409EFF; /* 蓝色 */
    color: #fff;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #f0f2f5; /* 浅灰色 */
    color: #333;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .el-main {
    background-color: #ffffff; /* 白色 */
    color: #333;
    text-align: center;
    line-height: 160px;
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
  </style>