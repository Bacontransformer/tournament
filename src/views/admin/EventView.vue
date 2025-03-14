<template>
    <div>
      <el-button type="primary" @click="openCreateDialog">创建活动</el-button>
      <el-table :data="eventList" style="width: 100%">
        <el-table-column prop="name" label="活动名称"></el-table-column>
        <el-table-column prop="introduction" label="活动描述"></el-table-column>
        <el-table-column prop="stadium" label="活动体育馆"></el-table-column>
        <el-table-column prop="requiredAreaCount" label="最大场地数"></el-table-column>
        <el-table-column prop="requiredRefereeCount" label="最大裁判数"></el-table-column>
        <el-table-column prop="beginTime" label="开始日期"></el-table-column>
        <el-table-column prop="endTime" label="结束日期"></el-table-column>
        <el-table-column prop="matchType" label="赛事类型"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="openEditDialog(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteEvent(scope.row.eventId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageQueryDTO.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageQueryDTO.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageResult.total">
      </el-pagination>
  
      <!-- 创建/编辑活动对话框 -->
      <el-dialog :title="dialogTitle" v-model="dialogVisible" width="50%">
        <el-form :model="eventForm" label-width="120px">
          <el-form-item label="活动名称">
            <el-input v-model="eventForm.name"></el-input>
          </el-form-item>
          <el-form-item label="活动描述">
            <el-input v-model="eventForm.introduction" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="活动体育馆">
            <el-input v-model="eventForm.stadium"></el-input>
          </el-form-item>
          <el-form-item label="活动开始日期">
            <el-date-picker v-model="eventForm.beginTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="活动结束日期">
            <el-date-picker v-model="eventForm.endTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="赛事类型">
            <el-input v-model="eventForm.matchType"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveOrEditEvent">保存</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        eventForm: {
          eventId: null,
          name: '',
          introduction: '',
          stadium: '',
          requiredAreaCount: null,
          requiredRefereeCount: null,
          beginTime: '',
          endTime: '',
          matchType: ''
        },
        eventList: [],
        pageQueryDTO: {
          pageNum: 1,
          pageSize: 10
        },
        pageResult: {
          total: 0,
          records: []
        },
        dialogVisible: false,
        isEditing: false,
        dialogTitle: ''
      };
    },
    methods: {
      async fetchEvents() {
        try {
          const response = await axios.post('/api/event/page-event', this.pageQueryDTO, {
            headers: {
              'admin_token': localStorage.getItem('admin_token')
            }
          });
          this.pageResult = response.data.data;
          this.eventList = this.pageResult.records;
        } catch (error) {
          console.error('fetchEvents error:', error);
        }
      },
      async saveEvent() {
        try {
          const response = await axios.post('/api/event/save', this.eventForm, {
            headers: {
              'admin_token': localStorage.getItem('admin_token')
            }
          });
          console.log(response.data);
          this.dialogVisible = false;
          this.fetchEvents();
        } catch (error) {
          console.error('saveEvent error:', error);
        }
      },
      async updateEvent() {
        try {
          const response = await axios.post('/api/event/update', this.eventForm, {
            headers: {
              'admin_token': localStorage.getItem('admin_token')
            }
          });
          console.log(response.data);
          this.dialogVisible = false;
          this.fetchEvents();
        } catch (error) {
          console.error('updateEvent error:', error);
        }
      },
      async deleteEvent(eventId) {
        try {
          const response = await axios.post('/api/event/delete', { id: eventId }, {
            headers: {
              'admin_token': localStorage.getItem('admin_token')
            }
          });
          console.log(response.data);
          this.fetchEvents();
        } catch (error) {
          console.error('deleteEvent error:', error);
        }
      },
      async getEvent(eventId) {
        try {
          const response = await axios.get(`/api/event/${eventId}`, {
            headers: {
              'admin_token': localStorage.getItem('admin_token')
            }
          });
          this.eventForm = response.data.data;
        } catch (error) {
          console.error('getEvent error:', error);
        }
      },
      openCreateDialog() {
        console.log('openCreateDialog called');
        this.dialogTitle = '创建活动';
        this.isEditing = false;
        this.resetForm();
        this.dialogVisible = true;
      },
      openEditDialog(event) {
        console.log('openEditDialog called');
        this.dialogTitle = '修改活动';
        this.isEditing = true;
        this.eventForm = { ...event };
        this.dialogVisible = true;
      },
      saveOrEditEvent() {
        if (this.isEditing) {
          this.updateEvent();
        } else {
          this.saveEvent();
        }
      },
      resetForm() {
        this.eventForm = {
          eventId: null,
          name: '',
          introduction: '',
          stadium: '',
          requiredAreaCount: null,
          requiredRefereeCount: null,
          beginTime: '',
          endTime: '',
          matchType: ''
        };
      },
      handleSizeChange(pageSize) {
        this.pageQueryDTO.pageSize = pageSize;
        this.fetchEvents();
      },
      handleCurrentChange(pageNum) {
        this.pageQueryDTO.pageNum = pageNum;
        this.fetchEvents();
      }
    },
    created() {
      this.fetchEvents();
    }
  };
  </script>
  
  <style scoped>
  /* 你可以在这里添加一些样式 */
  </style>