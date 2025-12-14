<template>
    <view>
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" title="运动记录列表" />

        <!-- 运动记录列表内容区域 -->
        <view class="content">
            <!-- 运动统计卡片 -->
            <view class="statistics-section">
                <view class="statistics-title">
                    <uni-icons type="bar-chart" size="20" color="#007aff"></uni-icons>
                    <text>运动统计</text>
                </view>
                <view class="statistics-cards">
                    <!-- 总卡路里 -->
                    <view class="stat-card">
                        <view class="stat-value">{{ SportRecordSummary.TotalCalories || 0 }}</view>
                        <view class="stat-label">总消耗卡路里</view>
                        <view class="stat-unit">卡</view>
                    </view>
                    <!-- 本周卡路里 -->
                    <view class="stat-card">
                        <view class="stat-value">{{ SportRecordSummary.TotalCaloriesWeek || 0 }}</view>
                        <view class="stat-label">本周消耗</view>
                        <view class="stat-unit">卡</view>
                    </view>
                    <!-- 本月卡路里 -->
                    <view class="stat-card">
                        <view class="stat-value">{{ SportRecordSummary.TotalCaloriesMonth || 0 }}</view>
                        <view class="stat-label">本月消耗</view>
                        <view class="stat-unit">卡</view>
                    </view>
                </view>
                <view class="statistics-cards">
                    <!-- 本周运动次数 -->
                    <view class="stat-card">
                        <view class="stat-value">{{ SportRecordSummary.TotalSportCountWeek || 0 }}</view>
                        <view class="stat-label">本周运动</view>
                        <view class="stat-unit">次</view>
                    </view>
                    <!-- 本月运动次数 -->
                    <view class="stat-card">
                        <view class="stat-value">{{ SportRecordSummary.TotalSportCountMonth || 0 }}</view>
                        <view class="stat-label">本月运动</view>
                        <view class="stat-unit">次</view>
                    </view>
                    <!-- 平均每次消耗 -->
                    <view class="stat-card">
                        <view class="stat-value">{{ calculateAvgCalories() }}</view>
                        <view class="stat-label">平均消耗</view>
                        <view class="stat-unit">卡/次</view>
                    </view>
                </view>
            </view>

            <!-- 运动记录列表 -->
            <view v-if="SportRecordList.length > 0" class="record-list">
                <view v-for="record in SportRecordList" :key="record.Id" class="record-item">
                    <!-- 运动图标和基本信息 -->
                    <view class="record-header">
                        <image :src="record.SportDto.Cover" class="sport-icon" mode="aspectFill"></image>
                        <view class="sport-info">
                            <text class="sport-name">{{ record.SportDto.Name }}</text>
                            <text class="record-time">{{ formatTime(record.RecordTime) }}</text>
                        </view>
                        <!-- 删除按钮 -->
                        <view class="delete-btn" @click="ShowDeleteModal(record.Id)">
                            <uni-icons type="trash" size="20" color="#ff4757"></uni-icons>
                        </view>
                    </view>

                    <!-- 运动数据 -->
                    <view class="record-data">
                        <view class="data-item">
                            <text class="data-label">运动量</text>
                            <text class="data-value">{{ record.RecordValue }} {{ record.SportUnitDto.UnitName }}</text>
                        </view>
                        <view class="data-item">
                            <text class="data-label">消耗卡路里</text>
                            <text class="data-value calories">{{ calculateCalories(record.RecordValue,
                                record.SportUnitDto.Calories) }} 卡</text>
                        </view>
                    </view>

                    <!-- 运动描述 -->
                    <view class="sport-description">
                        <text>{{ record.SportDto.Content }}</text>
                    </view>
                </view>
            </view>

            <!-- 空状态 -->
            <view v-else class="empty-state">
                <uni-icons type="list" size="80" color="#c0c4cc"></uni-icons>
                <text class="empty-text">暂无运动记录</text>
                <text class="empty-tip">点击右下角按钮添加运动记录</text>
            </view>
        </view>

        <!-- 浮动添加按钮 -->
        <view class="floating-add-btn" @click="goToAddSportRecord">
            <uni-icons type="plus" size="24" color="#fff"></uni-icons>
        </view>
    </view>
</template>

<script setup>

import { useCommonStore } from '@/store';
import { Post } from '@/utils/http';
import { onLoad, onReady, onShow } from "@dcloudio/uni-app";
import { computed, reactive, ref } from 'vue';

// 获取store
const commonStore = useCommonStore();
const Token = computed(() => commonStore.Token)
const UserInfo = computed(() => commonStore.UserInfo)
const RoleType = computed(() => commonStore.RoleType)
const UserId = computed(() => commonStore.UserId)

// 运动记录列表数据
const SportRecordList = ref([]);

const where = reactive({
    UserId: UserId.value,
});

// 生命周期钩子
onLoad(async (option) => {
});
onShow(async () => {
    GetSportRecordListApi();
    SportRecordSummaryApi();
});

onReady(async () => {

});

// 方法
const goBack = () => {
    uni.navigateBack();
};

// 跳转到添加运动记录页面
const goToAddSportRecord = () => {
    uni.navigateTo({
        url: '/pages/Front/SportList'
    });
};

// 获取运动记录列表
const GetSportRecordListApi = async () => {
    let {
        Data: {
            Items
        }
    } = await Post('/SportRecord/List', where);
    SportRecordList.value = Items;
}
const SportRecordSummary = ref([]);
const SportRecordSummaryApi = async () => {
    let {
        Data
    } = await Post('/SportRecord/SportRecordSummary', where);
    SportRecordSummary.value = Data;
}

// 格式化时间显示
const formatTime = (timeStr) => {
    if (!timeStr) return '';

    const date = new Date(timeStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    // 如果时间解析失败，直接返回原始字符串
    if (isNaN(date.getTime())) {
        return timeStr;
    }

    if (minutes < 1) {
        return '刚刚';
    } else if (minutes < 60) {
        return `${minutes}分钟前`;
    } else if (hours < 24) {
        return `${hours}小时前`;
    } else if (days < 7) {
        return `${days}天前`;
    } else {
        // 显示完整的日期时间格式
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
};

// 计算消耗的卡路里
const calculateCalories = (recordValue, unitCalories) => {
    return Math.round(recordValue * unitCalories);
};

// 计算平均每次消耗
const calculateAvgCalories = () => {
    if (SportRecordSummary.value.TotalSportCountMonth > 0) {
        return (SportRecordSummary.value.TotalCaloriesMonth / SportRecordSummary.value.TotalSportCountMonth).toFixed(1);
    }
    return 0;
};

// 删除运动记录
const ShowDeleteModal = async (Id) => {
    uni.showModal({
        title: '提示',
        content: '确认删除该运动记录吗？',
        success: async (res) => {
            if (res.confirm) {
                const { Success } = await Post(`/SportRecord/Delete`, { Id: Id });
                if (Success) {
                    await GetSportRecordListApi();
                    uni.showToast({
                        title: '删除成功',
                        icon: 'success'
                    });
                }
            }
        }
    })
};

</script>

<style scoped lang="scss">
/* 内容区域样式 */
.content {

    padding-bottom: 120rpx;
    /* 为浮动按钮留出空间 */
    min-height: calc(100vh - 88rpx);
    background-color: #f8f9fa;
}

/* 运动统计卡片样式 */
.statistics-section {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.statistics-title {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
}

.statistics-title uni-icons {
    margin-right: 10rpx;
}

.statistics-title text {
    font-size: 32rpx;
    font-weight: 600;
    color: #2c3e50;
}

.statistics-cards {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-bottom: 20rpx;
}

.stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
    /* 调整卡片宽度 */
    margin-bottom: 20rpx;
}

.stat-value {
    font-size: 36rpx;
    font-weight: 700;
    color: #e74c3c;
    /* 红色 */
    margin-bottom: 8rpx;
}

.stat-label {
    font-size: 24rpx;
    color: #7f8c8d;
    margin-bottom: 8rpx;
}

.stat-unit {
    font-size: 24rpx;
    color: #7f8c8d;
}

/* 运动记录列表样式 */
.record-list {
    padding: 20rpx;
}

/* 单个记录项样式 */
.record-item {
    background-color: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
}

.record-item:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

/* 记录头部样式 */
.record-header {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
}

.sport-icon {
    width: 60rpx;
    height: 60rpx;
    border-radius: 12rpx;
    margin-right: 16rpx;
}

.sport-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.sport-name {
    font-size: 32rpx;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 4rpx;
}

.record-time {
    font-size: 24rpx;
    color: #95a5a6;
}

.delete-btn {
    padding: 8rpx;
    border-radius: 8rpx;
    background-color: #fee;
    transition: all 0.3s ease;
}

.delete-btn:active {
    background-color: #fdd;
    transform: scale(0.95);
}

/* 运动数据样式 */
.record-data {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
    padding: 16rpx;
    background-color: #f8f9fa;
    border-radius: 12rpx;
}

.data-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
}

.data-label {
    font-size: 24rpx;
    color: #7f8c8d;
    margin-bottom: 4rpx;
}

.data-value {
    font-size: 28rpx;
    font-weight: 600;
    color: #2c3e50;
}

.data-value.calories {
    color: #e74c3c;
}

/* 运动描述样式 */
.sport-description {
    padding: 12rpx 0;
    border-top: 1rpx solid #ecf0f1;
}

.sport-description text {
    font-size: 26rpx;
    color: #7f8c8d;
    line-height: 1.5;
}

/* 空状态样式 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;
    text-align: center;
}

.empty-text {
    font-size: 32rpx;
    color: #95a5a6;
    margin: 24rpx 0 12rpx 0;
    font-weight: 500;
}

.empty-tip {
    font-size: 26rpx;
    color: #bdc3c7;
}

/* 浮动添加按钮样式 */
.floating-add-btn {
    position: fixed;
    bottom: 60rpx;
    right: 60rpx;
    width: 100rpx;
    height: 100rpx;
    background-color: var(--primary-color, #007aff);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.3);
    z-index: 999;
    transition: all 0.3s ease;
}

/* 按钮悬停效果 */
.floating-add-btn:active {
    transform: scale(0.95);
    box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.4);
}
</style>