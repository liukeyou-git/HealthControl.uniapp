<template>
    <view class="page-container">
        <!-- 顶部导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar title="健康管理" />

        <!-- 页面内容 -->
        <view class="content-wrapper">
            <!-- 欢迎横幅 -->
            <view class="welcome-banner">
                <view class="banner-content">
                    <view class="welcome-info">
                        <text class="welcome-title">您好，欢迎回来！</text>
                        <text class="welcome-subtitle">让我们一起关注您的健康</text>
                    </view>
                    <view class="health-icon">
                        <text class="icon">🏥</text>
                    </view>
                </view>
            </view>

            <!-- 健康数据概览 -->
            <view class="health-overview">
                <view class="section-title">
                    <text class="title-text">今日健康概览</text>
                    <text class="more-text">查看更多 ></text>
                </view>
                <view class="overview-cards">
                    <view class="overview-card">
                        <view class="card-icon heart">💗</view>
                        <text class="card-label">心率</text>
                        <text class="card-value">72</text>
                        <text class="card-unit">次/分</text>
                    </view>
                    <view class="overview-card">
                        <view class="card-icon blood">🩸</view>
                        <text class="card-label">血压</text>
                        <text class="card-value">120/80</text>
                        <text class="card-unit">mmHg</text>
                    </view>
                    <view class="overview-card">
                        <view class="card-icon weight">⚖️</view>
                        <text class="card-label">体重</text>
                        <text class="card-value">65.5</text>
                        <text class="card-unit">kg</text>
                    </view>
                    <view class="overview-card">
                        <view class="card-icon step">👟</view>
                        <text class="card-label">步数</text>
                        <text class="card-value">8,520</text>
                        <text class="card-unit">步</text>
                    </view>
                </view>
            </view>

            <!-- 快捷功能 -->
            <view class="quick-actions">
                <view class="section-title">
                    <text class="title-text">快捷功能</text>
                </view>
                <view class="action-grid">
                    <view class="action-item">
                        <view class="action-icon record">📊</view>
                        <text class="action-label">健康记录</text>
                    </view>
                    <view class="action-item" @click="ToDietRecordList()">
                        <view class="action-icon diet">🍎</view>
                        <text class="action-label">饮食记录</text>
                    </view>
                    <view class="action-item" @click="ToSportRecordList()">
                        <view class="action-icon sport">🏃‍♂️</view>
                        <text class="action-label">运动记录</text>
                    </view>
                    <view class="action-item">
                        <view class="action-icon reminder">⏰</view>
                        <text class="action-label">健康提醒</text>
                    </view>
                    <view class="action-item">
                        <view class="action-icon article">📖</view>
                        <text class="action-label">健康知识</text>
                    </view>
                    <view class="action-item">
                        <view class="action-icon recipe">🥗</view>
                        <text class="action-label">健康食谱</text>
                    </view>
                </view>
            </view>

            <!-- 最新健康资讯 -->
            <view class="health-news">
                <view class="section-title">
                    <text class="title-text">健康资讯</text>
                    <text class="more-text">查看更多 ></text>
                </view>
                <view class="news-list">
                    <view class="news-item">
                        <view class="news-content">
                            <text class="news-title">春季养生小贴士</text>
                            <text class="news-desc">春季是养生的黄金时期，了解这些小贴士...</text>
                            <text class="news-time">2小时前</text>
                        </view>
                        <view class="news-image">
                            <text class="placeholder-icon">🌸</text>
                        </view>
                    </view>
                    <view class="news-item">
                        <view class="news-content">
                            <text class="news-title">科学运动指南</text>
                            <text class="news-desc">掌握正确的运动方法，让健身更有效果...</text>
                            <text class="news-time">5小时前</text>
                        </view>
                        <view class="news-image">
                            <text class="placeholder-icon">🏃‍♀️</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 底部导航栏 -->
        <footer-bar />
    </view>
</template>

<script setup>
import { useCommonStore } from "@/store";
import { onHide, onLoad, onShow, onUnload } from "@dcloudio/uni-app";

const commonStore = useCommonStore();


const ToDietRecordList = () => {
    uni.navigateTo({
        url: '/pages/Front/DietRecordList'
    });
};

const ToSportRecordList = () => {
    uni.navigateTo({
        url: '/pages/Front/SportRecordList'
    });
};

onLoad(() => {

});

onShow(() => {
    if (commonStore.CheckIsLogin()) {

    }
});

onHide(() => {

});

onUnload(() => {

});
</script>

<style scoped lang="scss">
/* 页面容器 */
.page-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fffe 0%, #ecfdf5 100%);
}

/* 内容包装器 */
.content-wrapper {
    padding: 20upx;
    padding-bottom: 140upx;
    /* 给底部导航留出空间 */
}

/* 欢迎横幅 */
.welcome-banner {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
    border-radius: var(--border-radius-lg);
    margin-bottom: var(--spacing-base);
    box-shadow: var(--box-shadow-base);
}

.banner-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-lg);
}

.welcome-info {
    display: flex;
    flex-direction: column;
}

.welcome-title {
    color: white;
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
}

.welcome-subtitle {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-base);
}

.health-icon {
    .icon {
        font-size: 60upx;
    }
}

/* 健康概览 */
.health-overview {
    margin-bottom: var(--spacing-base);
}

.section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-base);
    padding: 0 var(--spacing-xs);
}

.title-text {
    font-size: var(--font-size-md);
    font-weight: 600;
    color: var(--text-color);
}

.more-text {
    font-size: var(--font-size-sm);
    color: var(--primary-color);
}

.overview-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-base);
}

.overview-card {
    background: white;
    border-radius: var(--border-radius-base);
    padding: var(--spacing-base);
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: var(--box-shadow-sm);
    transition: var(--transition-base);
}

.overview-card:active {
    transform: scale(0.98);
}

.card-icon {
    font-size: 48upx;
    margin-bottom: var(--spacing-xs);
}

.card-label {
    font-size: var(--font-size-sm);
    color: var(--text-color-light);
    margin-bottom: var(--spacing-xs);
}

.card-value {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 4upx;
}

.card-unit {
    font-size: var(--font-size-xs);
    color: var(--text-color-lighter);
}

/* 快捷功能 */
.quick-actions {
    margin-bottom: var(--spacing-base);
}

.action-grid {
    background: white;
    border-radius: var(--border-radius-base);
    padding: var(--spacing-base);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
    box-shadow: var(--box-shadow-sm);
}

.action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: var(--transition-base);
}

.action-item:active {
    transform: scale(0.95);
}

.action-icon {
    width: 80upx;
    height: 80upx;
    border-radius: var(--border-radius-circle);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40upx;
    margin-bottom: var(--spacing-xs);
    background: var(--bg-color-light);
}

.action-label {
    font-size: var(--font-size-sm);
    color: var(--text-color);
    text-align: center;
}

/* 健康资讯 */
.health-news {
    margin-bottom: var(--spacing-base);
}

.news-list {
    background: white;
    border-radius: var(--border-radius-base);
    overflow: hidden;
    box-shadow: var(--box-shadow-sm);
}

.news-item {
    display: flex;
    padding: var(--spacing-base);
    border-bottom: 1upx solid var(--border-color-light);
    transition: var(--transition-base);
}

.news-item:last-child {
    border-bottom: none;
}

.news-item:active {
    background-color: var(--bg-color-hover);
}

.news-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-right: var(--spacing-base);
}

.news-title {
    font-size: var(--font-size-base);
    color: var(--text-color);
    font-weight: 500;
    margin-bottom: var(--spacing-xs);
}

.news-desc {
    font-size: var(--font-size-sm);
    color: var(--text-color-light);
    margin-bottom: var(--spacing-xs);
    line-height: 1.4;
}

.news-time {
    font-size: var(--font-size-xs);
    color: var(--text-color-lighter);
}

.news-image {
    width: 120upx;
    height: 80upx;
    border-radius: var(--border-radius-sm);
    background: var(--bg-color-light);
    display: flex;
    align-items: center;
    justify-content: center;
}

.placeholder-icon {
    font-size: 40upx;
}
</style>