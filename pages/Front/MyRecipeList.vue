<template>
    <view class="recipe-container">
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" title="我的食谱" />

        <!-- 内容区域 -->
        <view class="content-wrapper">
            <!-- 食谱列表 -->
            <view class="recipe-list" v-if="RecipeList.length > 0">
                <view class="recipe-item" v-for="recipe in RecipeList" :key="recipe.Id">
                    <!-- 视频区域 -->
                    <view class="recipe-video" v-if="recipe.VideoUrl">
                        <video :src="recipe.VideoUrl" class="video-player" controls></video>
                        <view class="audit-status" :class="getStatusClass(recipe.AuditStatus)">
                            {{ recipe.AuditStatusFormat }}
                        </view>
                    </view>

                    <!-- 食谱信息 -->
                    <view class="recipe-info">
                        <view class="recipe-title">{{ recipe.Title }}</view>
                        <view class="recipe-meta">
                            <text class="meta-item">
                                <uni-icons type="eye" size="14" color="#999"></uni-icons>
                                {{ recipe.ViewCount }}次浏览
                            </text>
                            <text class="meta-item">
                                <uni-icons type="calendar" size="14" color="#999"></uni-icons>
                                {{ formatDate(recipe.CreationTime) }}
                            </text>
                        </view>

                        <!-- 审核回复 -->
                        <view class="audit-reply" v-if="recipe.AuditReply">
                            <text class="reply-label">审核意见：</text>
                            <text class="reply-content">{{ recipe.AuditReply }}</text>
                        </view>
                    </view>

                    <!-- 操作按钮 -->
                    <view class="recipe-actions">
                        <view class="action-btn edit-btn" @click="goToEdit(recipe.Id)">
                            <uni-icons type="compose" size="16" color="#007AFF"></uni-icons>
                            <text class="btn-text">编辑</text>
                        </view>
                        <view class="action-btn delete-btn" @click="ShowDeleteModal(recipe.Id)">
                            <uni-icons type="trash" size="16" color="#FF3B30"></uni-icons>
                            <text class="btn-text">删除</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 空状态 -->
            <view class="empty-state" v-else>
                <uni-icons type="document" size="80" color="#ccc"></uni-icons>
                <text class="empty-text">暂无食谱</text>
                <text class="empty-desc">点击上方按钮创建您的第一个食谱吧</text>
            </view>
        </view>

        <!-- 底部新增按钮 -->
        <view class="add-button-container">
            <view class="add-button" @click="goToAdd">
                <uni-icons type="plus" size="20" color="#fff"></uni-icons>
                <text class="add-text">新增食谱</text>
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

// 食谱列表数据
const RecipeList = ref([]);

const where = reactive({
    // 可以添加筛选条件
    PublishUserId: UserId.value
});

// 生命周期钩子
onLoad(async (option) => {
});

onShow(async () => {
    GetRecipeListApi();
});

onReady(async () => {

});

// 方法
const goBack = () => {
    uni.navigateBack();
};

// 跳转到新增页面
const goToAdd = () => {
    uni.navigateTo({
        url: '/pages/Front/RecipeForm'
    });
};

// 跳转到编辑页面
const goToEdit = (id) => {
    uni.navigateTo({
        url: `/pages/Front/RecipeForm?Id=${id}`
    });
};

// 获取食谱列表
const GetRecipeListApi = async () => {
    try {
        let {
            Data: {
                Items
            }
        } = await Post('/Recipe/List', where);
        RecipeList.value = Items || [];
    } catch (error) {
        console.error('获取食谱列表失败:', error);
        uni.showToast({
            title: '获取数据失败',
            icon: 'none'
        });
    }
}

// 删除食谱
const ShowDeleteModal = async (Id) => {
    uni.showModal({
        title: '提示',
        content: '确认删除该食谱吗？',
        success: async (res) => {
            if (res.confirm) {
                try {
                    const { Success } = await Post(`/Recipe/Delete`, { Id: Id });
                    if (Success) {
                        await GetRecipeListApi();
                        uni.showToast({
                            title: '删除成功',
                            icon: 'success'
                        });
                    }
                } catch (error) {
                    console.error('删除失败:', error);
                    uni.showToast({
                        title: '删除失败',
                        icon: 'none'
                    });
                }
            }
        }
    })
};

// 获取审核状态样式类
const getStatusClass = (status) => {
    switch (status) {
        case 2: return 'status-approved'; // 审核通过
        case 1: return 'status-pending';  // 待审核
        case 3: return 'status-rejected'; // 审核拒绝
        default: return 'status-pending';
    }
};

// 格式化日期
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}-${date.getDate()}`;
};

</script>

<style scoped lang="scss">
/* 容器样式 */
.recipe-container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

/* 内容区域 */
.content-wrapper {
    padding: 20rpx 30rpx 100rpx 30rpx;
    min-height: calc(100vh - 360rpx);
}

/* 食谱列表样式 */
.recipe-list {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
}

.recipe-item {
    background: white;
    border-radius: 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.recipe-item:active {
    transform: translateY(-2rpx);
    box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.12);
}

/* 视频区域 */
.recipe-video {
    position: relative;
    height: 400rpx;
    background-color: #000;
    /* 确保视频背景为黑色 */
}

.video-player {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.audit-status {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
    color: white;
    font-weight: 500;
}

.status-approved {
    background-color: #34c759;
}

.status-pending {
    background-color: #ff9500;
}

.status-rejected {
    background-color: #ff3b30;
}

/* 食谱信息 */
.recipe-info {
    padding: 30rpx;
}

.recipe-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 20rpx;
    line-height: 1.4;
}

.recipe-meta {
    display: flex;
    gap: 30rpx;
    margin-bottom: 20rpx;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 26rpx;
    color: #999;
}

/* 审核回复 */
.audit-reply {
    background-color: #f8f9fa;
    padding: 20rpx;
    border-radius: 12rpx;
    border-left: 4rpx solid var(--primary-color);
}

.reply-label {
    font-size: 24rpx;
    color: #666;
    font-weight: 500;
}

.reply-content {
    font-size: 26rpx;
    color: #333;
    margin-left: 10rpx;
}

/* 操作按钮区 */
.recipe-actions {
    display: flex;
    padding: 0 30rpx 30rpx;
    gap: 24rpx;
    margin-top: auto;
}

/* 操作按钮 */
.action-btn {
    display: flex;
    align-items: center;
    padding: 12rpx 24rpx;
    border-radius: 12rpx;
    border: 2rpx solid;

    .btn-text {
        font-size: 24rpx;
        margin-left: 8rpx;
    }

    &.edit-btn {
        border-color: var(--primary-color);
        background: rgba(16, 185, 129, 0.1);

        .btn-text {
            color: var(--primary-color);
        }
    }

    &.delete-btn {
        border-color: #FF3B30;
        background: rgba(255, 59, 48, 0.1);

        .btn-text {
            color: #FF3B30;
        }
    }
}

/* 空状态 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 60rpx;
    text-align: center;
}

.empty-text {
    font-size: 32rpx;
    color: #999;
    margin: 30rpx 0 15rpx;
    font-weight: 500;
}

.empty-desc {
    font-size: 26rpx;
    color: #ccc;
    line-height: 1.5;
}

/* 底部新增按钮容器 */
.add-button-container {
    position: fixed;
    bottom: 40rpx;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
}

/* 新增按钮 */
.add-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-color, #10b981);
    border-radius: 50rpx;
    padding: 24rpx 48rpx;
    box-shadow: 0 8rpx 24rpx rgba(16, 185, 129, 0.3);

    .add-text {
        color: #fff;
        font-size: 32rpx;
        font-weight: 500;
        margin-left: 12rpx;
    }
}
</style>