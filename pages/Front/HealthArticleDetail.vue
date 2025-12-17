<template>
    <view>
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" title="健康知识" />

        <!-- 文章内容区域 -->
        <view class="article-container">
            <!-- 文章头部信息 -->
            <view class="article-header">
                <!-- 文章标题 -->
                <view class="article-title">{{ HealthArticle.Title }}</view>

                <!-- 作者信息 -->
                <view class="author-info-header" v-if="HealthArticle.PublishUserDto">
                    <image :src="HealthArticle.PublishUserDto.ImageUrls || userInfoIcon" class="author-avatar"
                        mode="aspectFill" />
                    <text class="author-name">{{ HealthArticle.PublishUserDto.Name || HealthArticle.PublishUserDto.UserName
                    }}</text>
                </view>

                <!-- 文章基本信息 -->
                <view class="article-info">
                    <view class="info-item">
                        <text class="info-label">分类：</text>
                        <text class="info-value">{{ HealthArticle.HealthArticleTypeDto &&
                            HealthArticle.HealthArticleTypeDto.Name }}</text>
                    </view>
                </view>


            </view>



            <!-- 文章内容 -->
            <view class="article-content">
                <rich-text :nodes="HealthArticle.Content" class="content-text"></rich-text>
            </view>

            <!-- 文章底部信息 -->
            <view class="article-footer">
                <view class="footer-item">
                    <text class="footer-label">发布时间：</text>
                    <text class="footer-value">{{ formatDate(HealthArticle.CreationTime) }}</text>
                </view>
                <view class="footer-item">
                    <text class="footer-label">浏览量：</text>
                    <text class="footer-value">{{ HealthArticle.ViewCount }}</text>
                </view>
            </view>

            <!-- 推荐文章区域 -->
            <view class="recommend-section" v-if="RecommendList.length > 0">
                <view class="recommend-title">
                    <text class="title-text">相关推荐</text>
                </view>
                <view class="recommend-list">
                    <view class="recommend-item" v-for="item in RecommendList" :key="item.Id" @click="goToDetail(item.Id)">
                        <!-- 文章封面 -->
                        <view class="recommend-cover">
                            <image :src="item.Cover" mode="aspectFill" class="cover-image" />
                        </view>

                        <!-- 文章信息 -->
                        <view class="recommend-content">
                            <!-- 文章标题和统计信息 -->
                            <view class="title-section">
                                <view class="recommend-item-title">{{ item.Title }}</view>
                                <view class="recommend-stats">
                                    <text class="stats-views">{{ item.ViewCount }}次浏览</text>
                                    <text class="stats-time">{{ formatDate(item.CreationTime) }}</text>
                                </view>
                            </view>

                            <!-- 分类和作者信息 -->
                            <view class="recommend-meta">
                                <text class="meta-category">{{ item.HealthArticleTypeDto && item.HealthArticleTypeDto.Name
                                }}</text>
                                <text class="meta-author">{{ item.PublishUserDto && (item.PublishUserDto.Name ||
                                    item.PublishUserDto.UserName) }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

        </view>

        <!-- 底部操作栏 -->
        <view class="bottom-actions">
            <view class="action-button" :class="{ active: CollectId > 0 }" @click="CollectApi">
                <text class="action-icon">{{ CollectId > 0 ? '❤️' : '🤍' }}</text>
                <text class="action-text" :class="{ active: CollectId > 0 }">
                    {{ CollectId > 0 ? '已收藏' : '收藏' }}
                </text>
            </view>
            <view class="action-button" :class="{ active: LikeRecordId > 0 }" @click="LikeRecordApi">
                <text class="action-icon">{{ LikeRecordId > 0 ? '👍' : '👍🏻' }}</text>
                <text class="action-text" :class="{ active: LikeRecordId > 0 }">
                    {{ LikeRecordId > 0 ? '已点赞' : '点赞' }}
                </text>
            </view>
        </view>
    </view>
</template>

<script setup>

import { useCommonStore } from '@/store';
import { Post } from '@/utils/http';
import { onLoad, onReady, onShow } from "@dcloudio/uni-app";
import { computed, reactive, ref } from 'vue';
import userInfoIcon from '@/assets/默认头像.png';
// 获取store
const commonStore = useCommonStore();
const Token = computed(() => commonStore.Token)
const UserInfo = computed(() => commonStore.UserInfo)
const RoleType = computed(() => commonStore.RoleType)
const UserId = computed(() => commonStore.UserId)

const TestInfoList = ref([]);

const where = reactive({

});
const HealthArticleId = ref(0);

// 生命周期钩子
onLoad(async (option) => {
    HealthArticleId.value = option.HealthArticleId;
});

onShow(async () => {
    await AddViewCountApi();
    await GetHealthArticleApi();
    await CheckIsCollectApi();
    await CheckIsLikeRecordApi();
    await RecommendListApi();
});

onReady(async () => {

});

// 方法
const goBack = () => {
    uni.navigateBack();
};

const HealthArticle = ref({});

const GetHealthArticleApi = async () => {
    let {
        Data
    } = await Post('/HealthArticle/Get', { Id: HealthArticleId.value });
    HealthArticle.value = Data;
}
const AddViewCountApi = async () => {
    let {
        Success
    } = await Post('/HealthArticle/AddViewCount', { Id: HealthArticleId.value });

}


const CollectId = ref(0);
const LikeRecordId = ref(0);

//检查是否收藏
const CheckIsCollectApi = async () => {
    let {
        Success, Data
    } = await Post('/CollectRecord/Get', {
        Id: 0,
        CollectUserId: UserId.value,
        CollectType: "健康知识",
        RelativeId: HealthArticleId.value
    });
    CollectId.value = Data.Id;

}
const CollectApi = async () => {
    //如果是收藏状态
    if (CollectId.value > 0) {
        let {
            Success
        } = await Post('/CollectRecord/Delete', {
            Id: CollectId.value
        });
        if (Success) {
            CollectId.value = 0;
            uni.showToast({
                title: "取消收藏",
                icon: "none"
            });
        }

    } else {
        let {
            Success, Data
        } = await Post('/CollectRecord/CreateOrEdit', {

            CollectUserId: UserId.value,
            CollectType: "健康知识",
            RelativeId: HealthArticleId.value
        });
        if (Success) {
            CollectId.value = Data.Id;
            uni.showToast({
                title: "收藏成功",
                icon: "none"
            });
        }
    }

}

//检查是否点赞
const CheckIsLikeRecordApi = async () => {
    let {
        Success, Data
    } = await Post('/LikeRecord/Get', {
        Id: 0,
        LikeUserId: UserId.value,
        LikeType: "健康知识",
        RelativeId: HealthArticleId.value
    });
    LikeRecordId.value = Data.Id;

}
const LikeRecordApi = async () => {
    //如果是点赞状态
    if (LikeRecordId.value > 0) {
        let {
            Success
        } = await Post('/LikeRecord/Delete', {
            Id: LikeRecordId.value
        });
        if (Success) {
            LikeRecordId.value = 0;
            uni.showToast({
                title: "取消点赞",
                icon: "none"
            });
        }

    } else {
        let {
            Success, Data
        } = await Post('/LikeRecord/CreateOrEdit', {

            LikeUserId: UserId.value,
            LikeType: "健康知识",
            RelativeId: HealthArticleId.value
        });
        if (Success) {
            LikeRecordId.value = Data.Id;
            uni.showToast({
                title: "点赞成功",
                icon: "none"
            });
        }
    }

}

const RecommendList = ref([]);
//推荐
const RecommendListApi = async () => {
    let {
        Data
    } = await Post('/HealthArticle/RecommendList', {
        Id: HealthArticleId.value
    });
    RecommendList.value = Data;
}

// 格式化日期
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 跳转到推荐文章详情页
const goToDetail = (articleId) => {
    uni.redirectTo({
        url: `/pages/Front/HealthArticleDetail?HealthArticleId=${articleId}`
    });
}

</script>

<style scoped lang="scss">
/* 文章容器 */
.article-container {
    background-color: #f8f9fa;
    min-height: calc(100vh - 176upx);
    padding-bottom: 120upx;
    /* 为底部操作栏留出空间 */
}

/* 文章头部信息 */
.article-header {
    background-color: #fff;
    border-radius: 24upx;
    padding: 40upx;
    margin-bottom: 32upx;
    box-shadow: 0 4upx 16upx rgba(0, 0, 0, 0.1);
}

/* 文章标题 */
.article-title {
    font-size: 48upx;
    font-weight: bold;
    color: #333;
    line-height: 1.4;
    margin-bottom: 24upx;
}

/* 作者信息头部 */
.author-info-header {
    display: flex;
    align-items: center;
    margin-bottom: 32upx;
    padding: 16upx 0;
}

.author-avatar {
    width: 64upx;
    height: 64upx;
    border-radius: 50%;
    margin-right: 16upx;
    border: 4upx solid #f0f0f0;
}

.author-name {
    font-size: 28upx;
    color: #666;
    font-weight: 500;
}

/* 文章基本信息 */
.article-info {
    display: flex;
    flex-direction: column;
    gap: 16upx;
    margin-bottom: 24upx;
}

.info-item {
    display: flex;
    align-items: center;
}

.info-label {
    font-size: 28upx;
    color: #666;
    width: 160upx;
}

.info-value {
    font-size: 28upx;
    color: #333;
    flex: 1;
}

/* 审核状态 */
.audit-status {
    display: flex;
    justify-content: flex-end;
}



/* 文章内容 */
.article-content {
    background-color: #fff;
    border-radius: 24upx;
    padding: 40upx;
    margin-bottom: 32upx;
    box-shadow: 0 4upx 16upx rgba(0, 0, 0, 0.1);
}

.content-text {
    font-size: 32upx;
    line-height: 1.6;
    color: #333;
}

/* 文章底部信息 */
.article-footer {
    background-color: #fff;
    border-radius: 24upx;
    padding: 32upx 40upx;
    box-shadow: 0 4upx 16upx rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.footer-item {
    display: flex;
    align-items: center;
}

.footer-label {
    font-size: 26upx;
    color: #999;
    margin-right: 8upx;
}

.footer-value {
    font-size: 26upx;
    color: #666;
}

/* 底部操作栏 */
.bottom-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20upx 40upx;
    box-shadow: 0 -4upx 16upx rgba(0, 0, 0, 0.1);
    border-top: 1upx solid #f0f0f0;
    z-index: 1000;
}

/* 操作按钮 */
.action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16upx 32upx;
    border-radius: 12upx;
    transition: all 0.3s ease;
    min-width: 120upx;
    height: 80upx;
}

.action-button:active {
    transform: scale(0.95);
    background-color: #f8f9fa;
}

/* 操作按钮图标 */
.action-icon {
    font-size: 48upx;
    line-height: 1;
    margin-bottom: 4upx;
}

/* 操作按钮文字 */
.action-text {
    font-size: 24upx;
    color: #999;
    margin-top: 8upx;
    transition: color 0.3s ease;
}

/* 激活状态的按钮文字 */
.action-text.active {
    font-weight: 500;
}

/* 收藏按钮激活状态 */
.action-button.active .action-text {
    color: #ff6b6b;
}

/* 点赞按钮激活状态 */
.action-button:last-child.active .action-text {
    color: #4CAF50;
}

/* 推荐文章区域 */
.recommend-section {
    margin-top: 20upx;
    background-color: #fff;
    border-radius: 24upx;
    padding: 40upx;
    margin-bottom: 122upx;
    box-shadow: 0 4upx 16upx rgba(0, 0, 0, 0.1);
}

/* 推荐标题 */
.recommend-title {
    margin-bottom: 32upx;
    padding-bottom: 16upx;
    border-bottom: 2upx solid #f0f0f0;
}

.title-text {
    font-size: 36upx;
    font-weight: bold;
    color: #333;
    position: relative;
}

.title-text::before {
    content: '';
    position: absolute;
    left: -16upx;
    top: 50%;
    transform: translateY(-50%);
    width: 8upx;
    height: 32upx;
    background: linear-gradient(135deg, var(--primary-color), #4CAF50);
    border-radius: 4upx;
}

/* 推荐列表 */
.recommend-list {
    display: flex;
    flex-direction: column;
    gap: 24upx;
}

/* 推荐文章卡片 */
.recommend-item {
    display: flex;
    background-color: #f8f9fa;
    border-radius: 16upx;
    padding: 24upx;
    transition: all 0.3s ease;
    border: 2upx solid transparent;
}

.recommend-item:active {
    transform: scale(0.98);
    background-color: #e9ecef;
    border-color: var(--primary-color);
}

/* 推荐文章封面 */
.recommend-cover {
    flex-shrink: 0;
    width: 160upx;
    height: 120upx;
    border-radius: 12upx;
    overflow: hidden;
    margin-right: 24upx;
}

.cover-image {
    width: 100%;
    height: 100%;
    border-radius: 12upx;
}

/* 推荐文章内容区域 */
.recommend-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* 标题和统计信息区域 */
.title-section {
    margin-bottom: 16upx;
}

/* 推荐文章标题 */
.recommend-item-title {
    font-size: 30upx;
    font-weight: 600;
    color: #333;
    line-height: 1.4;
    margin-bottom: 8upx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 推荐文章元信息 */
.recommend-meta {
    display: flex;
    align-items: center;
    gap: 16upx;
}

.meta-category {
    font-size: 24upx;
    color: var(--primary-color);
    background-color: rgba(74, 144, 226, 0.1);
    padding: 4upx 12upx;
    border-radius: 12upx;
    border: 1upx solid rgba(74, 144, 226, 0.2);
}

.meta-author {
    font-size: 24upx;
    color: #666;
}

/* 推荐文章统计信息 */
.recommend-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.stats-views {
    font-size: 22upx;
    color: #999;
}

.stats-time {
    font-size: 22upx;
    color: #999;
}

/* 响应式设计 */
@media (max-width: 750px) {
    .article-container {
        padding: 30upx;
    }

    .article-title {
        font-size: 40upx;
    }

    .article-footer {
        flex-direction: column;
        gap: 16upx;
        align-items: flex-start;
    }
}
</style>