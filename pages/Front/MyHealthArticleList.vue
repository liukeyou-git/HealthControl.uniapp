<template>
    <view>
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" title="我的健康知识" />

        <!-- 文章列表 -->
        <view class="article-container">
            <view v-if="HealthArticleList.length === 0" class="empty-state">
                <text class="empty-text">暂无健康知识文章</text>
            </view>

            <view v-for="article in HealthArticleList" :key="article.Id" class="article-item">
                <!-- 文章封面 -->
                <image :src="article.Cover" class="article-cover" mode="aspectFill"></image>

                <!-- 文章内容 -->
                <view class="article-content">
                    <!-- 文章标题 -->
                    <text class="article-title">{{ article.Title }}</text>

                    <!-- 文章信息 -->
                    <view class="article-info">
                        <text class="info-item">分类: {{ article.HealthArticleTypeDto.Name }}</text>
                        <text class="info-item">浏览: {{ article.ViewCount }}</text>
                        <text class="info-item status"
                            :class="{ 'status-pending': article.AuditStatus === 1, 'status-approved': article.AuditStatus === 2 }">
                            {{ article.AuditStatusFormat }}
                        </text>
                    </view>

                    <!-- 创建时间 -->
                    <text class="article-time">{{ article.CreationTime }}</text>

                    <!-- 操作按钮 -->
                    <view class="article-actions">
                        <view class="action-btn edit-btn" @click="editArticle(article.Id)">
                            <uni-icons type="compose" size="16" color="#007AFF"></uni-icons>
                            <text class="btn-text">修改</text>
                        </view>
                        <view class="action-btn delete-btn" @click="ShowDeleteModal(article.Id)">
                            <uni-icons type="trash" size="16" color="#FF3B30"></uni-icons>
                            <text class="btn-text">删除</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 底部新增按钮 -->
        <view class="add-button-container">
            <view class="add-button" @click="addNewArticle">
                <uni-icons type="plus" size="20" color="#fff"></uni-icons>
                <text class="add-text">新增文章</text>
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

// 文章列表数据
const HealthArticleList = ref([]);

const where = reactive({
    // 可以添加筛选条件，只显示当前用户的文章
    PublishUserId: UserId.value
});

// 生命周期钩子
onLoad(async (option) => {
});

onShow(async () => {
    GetHealthArticleListApi();
});

onReady(async () => {
});

// 方法
const goBack = () => {
    uni.navigateBack();
};

// 获取健康文章列表
const GetHealthArticleListApi = async () => {
    try {
        let {
            Data: {
                Items
            }
        } = await Post('/HealthArticle/List', where);
        HealthArticleList.value = Items;
    } catch (error) {
        console.error('获取文章列表失败:', error);
        uni.showToast({
            title: '获取数据失败',
            icon: 'none'
        });
    }
}

// 修改文章
const editArticle = (articleId) => {
    uni.navigateTo({
        url: `/pages/Front/HealthArticleForm?Id=${articleId}&type=edit`
    });
};

// 新增文章
const addNewArticle = () => {
    uni.navigateTo({
        url: '/pages/Front/HealthArticleForm?type=add'
    });
};

// 删除文章
const ShowDeleteModal = async (Id) => {
    uni.showModal({
        title: '提示',
        content: '确认删除该健康知识文章吗？',
        success: async (res) => {
            if (res.confirm) {
                try {
                    const { Success } = await Post(`/HealthArticle/Delete`, { Id: Id });
                    if (Success) {
                        await GetHealthArticleListApi();
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
</script>

<style scoped lang="scss">
/* 文章容器 */
.article-container {
    padding: 0upx 40upx 160upx;
    min-height: calc(100vh - 360upx);
}

/* 空状态 */
.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 600upx;

    .empty-text {
        color: #999;
        font-size: 32upx;
    }
}

/* 文章项 */
.article-item {
    display: flex;
    background: #fff;
    border-radius: 24upx;
    margin-bottom: 32upx;
    padding: 32upx;
    box-shadow: 0 4upx 16upx rgba(0, 0, 0, 0.1);
}

/* 文章封面 */
.article-cover {
    width: 200upx;
    height: 200upx;
    border-radius: 16upx;
    margin-right: 32upx;
    flex-shrink: 0;
}

/* 文章内容区 */
.article-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* 文章标题 */
.article-title {
    font-size: 32upx;
    font-weight: bold;
    color: #333;
    line-height: 44upx;
    margin-bottom: 16upx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

/* 文章信息 */
.article-info {
    display: flex;
    flex-wrap: wrap;
    gap: 24upx;
    margin-bottom: 16upx;

    .info-item {
        font-size: 24upx;
        color: #666;
        padding: 4upx 12upx;
        background: #f5f5f5;
        border-radius: 8upx;
    }

    .status {
        color: #fff;

        &.status-pending {
            background: #ff9500;
        }

        &.status-approved {
            background: #34c759;
        }
    }
}

/* 创建时间 */
.article-time {
    font-size: 24upx;
    color: #999;
    margin-bottom: 24upx;
}

/* 操作按钮区 */
.article-actions {
    display: flex;
    gap: 24upx;
    margin-top: auto;
}

/* 操作按钮 */
.action-btn {
    display: flex;
    align-items: center;
    padding: 12upx 24upx;
    border-radius: 12upx;
    border: 2upx solid;

    .btn-text {
        font-size: 24upx;
        margin-left: 8upx;
    }

    &.edit-btn {
        border-color: #007AFF;
        background: rgba(0, 122, 255, 0.1);

        .btn-text {
            color: #007AFF;
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

/* 底部新增按钮容器 */
.add-button-container {
    position: fixed;
    bottom: 40upx;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
}

/* 新增按钮 */
.add-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-color, #007AFF);
    border-radius: 50upx;
    padding: 24upx 48upx;
    box-shadow: 0 8upx 24upx rgba(0, 122, 255, 0.3);

    .add-text {
        color: #fff;
        font-size: 32upx;
        font-weight: 500;
        margin-left: 12upx;
    }
}

/* 响应式设计 - 小屏幕适配 */
@media (max-width: 750upx) {
    .article-item {
        flex-direction: column;
    }

    .article-cover {
        width: 100%;
        height: 240upx;
        margin-right: 0;
        margin-bottom: 24upx;
    }
}
</style>