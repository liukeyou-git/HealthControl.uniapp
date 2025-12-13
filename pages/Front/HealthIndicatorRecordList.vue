<template>
    <view>
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" title="我的健康记录" />

        <!-- 主要内容区域 -->
        <view class="content">
            <!-- 时间范围查询 -->
            <view class="query-section">
                <view class="query-item">
                    <text class="query-label">记录时间:</text>
                    <view class="time-range-container">
                        <uni-datetime-picker type="datetime" v-model="timeRange[0]" placeholder="开始时间"
                            @change="onStartTimeChange">
                        </uni-datetime-picker>
                        <text class="time-separator">至</text>
                        <uni-datetime-picker type="datetime" v-model="timeRange[1]" placeholder="结束时间"
                            @change="onEndTimeChange">
                        </uni-datetime-picker>
                    </view>
                </view>
                <view class="query-buttons">
                    <button class="query-btn" @click="handleQuery">查询</button>
                    <button class="reset-btn" @click="handleReset">重置</button>
                </view>
            </view>

            <!-- 记录列表 -->
            <view class="record-list">
                <view v-if="HealthIndicatorRecordList.length === 0" class="empty-state">
                    <text class="empty-text">暂无健康记录</text>
                </view>

                <view v-else>
                    <view v-for="(item, index) in HealthIndicatorRecordList" :key="item.Id" class="record-item">
                        <!-- 记录卡片 -->
                        <view class="record-card">
                            <!-- 指标信息头部 -->
                            <view class="record-header">
                                <view class="indicator-main">
                                    <!-- 指标图标 -->
                                    <view class="indicator-icon">
                                        <image v-if="item.HealthIndicatorDto.Cover" :src="item.HealthIndicatorDto.Cover"
                                            class="icon-image" mode="aspectFit">
                                        </image>
                                        <view v-else class="icon-placeholder">
                                            <text class="placeholder-text">{{ item.HealthIndicatorDto.Name.charAt(0)
                                            }}</text>
                                        </view>
                                    </view>
                                    <!-- 指标信息 -->
                                    <view class="indicator-info">
                                        <text class="indicator-name">{{ item.HealthIndicatorDto.Name }}</text>
                                        <text class="indicator-type">{{ item.HealthIndicatorTypeDto.Name }}</text>
                                    </view>
                                </view>
                                <view class="record-actions">
                                    <button class="delete-btn" @click="ShowDeleteModal(item.Id)">删除</button>
                                </view>
                            </view>

                            <!-- 记录值和异常状态 -->
                            <view class="record-value-section">
                                <view class="value-container">
                                    <text class="value-label">记录值:</text>
                                    <text class="record-value" :class="{ 'abnormal': item.IsAbnormity === 'Y' }">
                                        {{ item.RecordValue }}
                                    </text>
                                </view>
                                <view v-if="item.IsAbnormity === 'Y'" class="abnormal-tag">
                                    <text class="abnormal-text">异常</text>
                                </view>
                            </view>

                            <!-- 阈值信息 -->
                            <view class="threshold-section">
                                <text class="threshold-label">正常范围:</text>
                                <text class="threshold-value">{{ item.HealthIndicatorDto.Threshold }}</text>
                            </view>

                            <!-- 记录时间和记录人 -->
                            <view class="record-meta">
                                <view class="meta-item">
                                    <text class="meta-label">记录时间:</text>
                                    <text class="meta-value">{{ formatDateTime(item.RecordTime) }}</text>
                                </view>
                                <view class="meta-item">
                                    <text class="meta-label">记录人:</text>
                                    <text class="meta-value">{{ item.RecordUserDto.Name }}</text>
                                </view>
                            </view>

                            <!-- 指标描述 -->
                            <view v-if="item.HealthIndicatorDto.Content" class="indicator-description">
                                <text class="description-label">指标说明:</text>
                                <text class="description-text">{{ item.HealthIndicatorDto.Content }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
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

// 健康记录列表数据
const HealthIndicatorRecordList = ref([]);

// 获取当天的开始和结束时间
const getTodayRange = () => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    };

    return [formatDateTime(startOfDay), formatDateTime(endOfDay)];
};

// 时间范围 - 默认为当天
const timeRange = ref(getTodayRange());

// 查询参数
const where = reactive({
    RecordTimeRange: getTodayRange()
});

// 生命周期钩子
onLoad(async (option) => {
});

onShow(async () => {
    where.RecordUserId = UserId.value;
    GetHealthIndicatorRecordListApi();
});

onReady(async () => {

});

// 方法
const goBack = () => {
    uni.navigateBack();
};

// 获取健康记录列表
const GetHealthIndicatorRecordListApi = async () => {
    try {
        let {
            Data: {
                Items
            }
        } = await Post('/HealthIndicatorRecord/List', where);
        HealthIndicatorRecordList.value = Items || [];
    } catch (error) {
        console.error('获取健康记录失败:', error);
        HealthIndicatorRecordList.value = [];
    }
}

// 删除记录
const ShowDeleteModal = async (Id) => {
    uni.showModal({
        title: '提示',
        content: '确认删除该健康记录吗？',
        success: async (res) => {
            if (res.confirm) {
                try {
                    const { Success } = await Post(`/HealthIndicatorRecord/Delete`, { Id: Id });
                    if (Success) {
                        await GetHealthIndicatorRecordListApi();
                        uni.showToast({
                            title: '删除成功',
                            icon: 'success'
                        });
                    }
                } catch (error) {
                    console.error('删除失败:', error);
                    uni.showToast({
                        title: '删除失败',
                        icon: 'error'
                    });
                }
            }
        }
    })
};

// 开始时间变化
const onStartTimeChange = (e) => {
    timeRange.value[0] = e;
    updateTimeRange();
};

// 结束时间变化
const onEndTimeChange = (e) => {
    timeRange.value[1] = e;
    updateTimeRange();
};

// 更新时间范围到查询参数
const updateTimeRange = () => {
    if (timeRange.value[0] && timeRange.value[1]) {
        where.RecordTimeRange = [timeRange.value[0], timeRange.value[1]];
    } else {
        where.RecordTimeRange = [];
    }
};

// 查询按钮点击
const handleQuery = () => {
    if (timeRange.value[0] && timeRange.value[1]) {
        if (new Date(timeRange.value[0]) > new Date(timeRange.value[1])) {
            uni.showToast({
                title: '开始时间不能大于结束时间',
                icon: 'none'
            });
            return;
        }
    }
    GetHealthIndicatorRecordListApi();
};

// 重置查询条件
const handleReset = () => {
    const todayRange = getTodayRange();
    timeRange.value = todayRange;
    where.RecordTimeRange = todayRange;
    GetHealthIndicatorRecordListApi();
};

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

</script>

<style scoped lang="scss">
.content {

    /* 导航栏高度 */
    min-height: 100vh;
    background-color: #f5f5f5;
    margin-top: 10rpx;
}

/* 查询区域样式 */
.query-section {
    background-color: #fff;
    padding: 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    margin: 0 20rpx 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.query-item {
    margin-bottom: 20rpx;
}

.query-label {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 10rpx;
    display: block;
}

.time-range-container {
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.time-separator {
    font-size: 28rpx;
    color: #666;
    margin: 0 10rpx;
}

.query-buttons {
    display: flex;
    gap: 20rpx;
    margin-top: 30rpx;
}

.query-btn,
.reset-btn {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    border: none;
}

.query-btn {
    background-color: var(--primary-color, #007aff);
    color: #fff;
}

.reset-btn {
    background-color: #f0f0f0;
    color: #333;
}

/* 记录列表样式 */
.record-list {
    padding: 0 20rpx;
}

.empty-state {
    text-align: center;
    padding: 100rpx 0;
}

.empty-text {
    font-size: 32rpx;
    color: #999;
}

.record-item {
    margin-bottom: 20rpx;
}

.record-card {
    background-color: #fff;
    border-radius: 10rpx;
    padding: 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

/* 记录头部 */
.record-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20rpx;
}

.indicator-main {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 20rpx;
}

/* 指标图标样式 */
.indicator-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 12rpx;
    overflow: hidden;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.icon-image {
    width: 100%;
    height: 100%;
    border-radius: 12rpx;
}

.icon-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12rpx;
}

.placeholder-text {
    color: #fff;
    font-size: 28rpx;
    font-weight: bold;
}

.indicator-info {
    flex: 1;
}

.indicator-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 8rpx;
}

.indicator-type {
    font-size: 24rpx;
    color: #666;
    background-color: #f0f0f0;
    padding: 4rpx 12rpx;
    border-radius: 12rpx;
}

.record-actions {
    margin-left: 20rpx;
}

.delete-btn {
    background-color: #ff4757;
    color: #fff;
    border: none;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
}

/* 记录值区域 */
.record-value-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    padding: 20rpx;
    background-color: #f8f9fa;
    border-radius: 8rpx;
}

.value-container {
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.value-label {
    font-size: 28rpx;
    color: #666;
}

.record-value {
    font-size: 36rpx;
    font-weight: bold;
    color: #28a745;

    &.abnormal {
        color: #dc3545;
    }
}

.abnormal-tag {
    background-color: #dc3545;
    color: #fff;
    padding: 4rpx 12rpx;
    border-radius: 12rpx;
    font-size: 20rpx;
}

.abnormal-text {
    font-size: 20rpx;
}

/* 阈值信息 */
.threshold-section {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-bottom: 20rpx;
    padding: 15rpx;
    background-color: #e8f4f8;
    border-radius: 8rpx;
}

.threshold-label {
    font-size: 26rpx;
    color: #666;
}

.threshold-value {
    font-size: 26rpx;
    color: #007aff;
    font-weight: 500;
}

/* 元数据信息 */
.record-meta {
    margin-bottom: 20rpx;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-bottom: 8rpx;
}

.meta-label {
    font-size: 26rpx;
    color: #666;
    min-width: 120rpx;
}

.meta-value {
    font-size: 26rpx;
    color: #333;
}

/* 指标描述 */
.indicator-description {
    border-top: 1rpx solid #eee;
    padding-top: 20rpx;
}

.description-label {
    font-size: 26rpx;
    color: #666;
    display: block;
    margin-bottom: 8rpx;
}

.description-text {
    font-size: 26rpx;
    color: #333;
    line-height: 1.5;
}
</style>