<template>
    <view class="health-article-container">
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" title="健康知识列表" />

        <!-- 内容区域 -->
        <view class="content-wrapper">
            <!-- 搜索栏 -->
            <view class="search-section">
                <uni-search-bar v-model="searchKeyword" placeholder="搜索健康知识..." @input="onSearchInput"
                    @clear="onSearchClear" cancelButton="none" />
            </view>

            <!-- 分类筛选 -->
            <view class="category-filter">
                <scroll-view scroll-x="true" class="category-scroll">
                    <view class="category-list">
                        <view class="category-item" :class="{ active: selectedCategoryId === 0 }"
                            @click="selectCategory(0)">
                            全部
                        </view>
                        <view v-for="category in HealthArticleTypeList" :key="category.Id" class="category-item"
                            :class="{ active: selectedCategoryId === category.Id }" @click="selectCategory(category.Id)">
                            {{ category.Name }}
                        </view>
                    </view>
                </scroll-view>
            </view>

            <!-- 文章列表 -->
            <view class="article-list">
                <view v-for="article in filteredArticleList" :key="article.Id" class="article-card"
                    @click="goToArticleDetail(article.Id)">
                    <!-- 文章封面 -->
                    <view class="article-cover">
                        <image :src="article.Cover" mode="aspectFill" class="cover-image" />
                        <!-- 审核状态标签 -->
                        <view class="audit-status" :class="{
                            'status-approved': article.AuditStatus === 2,
                            'status-pending': article.AuditStatus === 1
                        }">
                            {{ article.AuditStatusFormat }}
                        </view>
                    </view>

                    <!-- 文章信息 -->
                    <view class="article-info">
                        <!-- 标题 -->
                        <view class="article-title">{{ article.Title }}</view>

                        <!-- 分类和浏览量 -->
                        <view class="article-meta">
                            <view class="category-tag">
                                {{ article.HealthArticleTypeDto.Name }}
                            </view>
                            <view class="view-count">
                                <uni-icons type="eye" size="14" color="#999" />
                                <text class="count-text">{{ article.ViewCount }}</text>
                            </view>
                        </view>

                        <!-- 发布信息 -->
                        <view class="publish-info">
                            <view class="author">{{ article.PublishUserDto.Name }}</view>
                            <view class="publish-time">{{ formatTime(article.CreationTime) }}</view>
                        </view>
                    </view>
                </view>

                <!-- 空状态 -->
                <view v-if="filteredArticleList.length === 0" class="empty-state">
                    <uni-icons type="info" size="48" color="#ccc" />
                    <text class="empty-text">暂无相关健康知识</text>
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

// 数据定义
const HealthArticleList = ref([]); // 健康知识文章列表
const HealthArticleTypeList = ref([]); // 健康知识分类列表
const searchKeyword = ref(''); // 搜索关键词
const selectedCategoryId = ref(0); // 选中的分类ID，0表示全部

const where = reactive({
    KeyWord: '',
    HealthArticleTypeId: null,
    AuditStatus: 2
});

// 计算属性 - 过滤后的文章列表（仅用于分类筛选）
const filteredArticleList = computed(() => {
    let filtered = HealthArticleList.value;

    // 按分类筛选
    if (selectedCategoryId.value !== 0) {
        filtered = filtered.filter(article =>
            article.HealthArticleTypeId === selectedCategoryId.value
        );
    }

    return filtered;
});

// 生命周期钩子
onLoad(async (option) => {
    await GetHealthArticleTypeListApi();
    await GetHealthArticleListApi();
});

onShow(async () => {
    // 页面显示时刷新数据
});

onReady(async () => {
    // 页面准备完毕
});

// 方法定义
const goBack = () => {
    uni.navigateBack();
};

// 获取健康知识分类列表
const GetHealthArticleTypeListApi = async () => {
    try {
        const { Success, Data: { Items } } = await Post('/HealthArticleType/List', {});
        if (Success) {
            // 按Sort字段升序排序
            HealthArticleTypeList.value = Items.sort((a, b) => a.Sort - b.Sort);
        }
    } catch (error) {
        console.error('获取健康知识类型列表失败:', error);
    }
};

// 获取健康知识列表
const GetHealthArticleListApi = async () => {
    try {
        const response = await Post('/HealthArticle/List', where);
        if (response.Success && response.Data && response.Data.Items) {
            HealthArticleList.value = response.Data.Items;
        }
    } catch (error) {
        console.error('获取健康知识列表失败:', error);
        uni.showToast({
            title: '获取数据失败',
            icon: 'error'
        });
    }
};



// 搜索输入处理
const onSearchInput = (value) => {
    searchKeyword.value = value;
    // 实时搜索，更新where条件并重新获取数据
    where.KeyWord = value.trim();
    GetHealthArticleListApi();
};

// 清除搜索
const onSearchClear = () => {
    searchKeyword.value = '';
    where.KeyWord = '';
    GetHealthArticleListApi();
};

// 选择分类
const selectCategory = (categoryId) => {
    selectedCategoryId.value = categoryId;
    // 更新where条件并重新获取数据
    where.HealthArticleTypeId = categoryId === 0 ? null : categoryId;
    GetHealthArticleListApi();
};

// 跳转到文章详情
const goToArticleDetail = (articleId) => {
    uni.navigateTo({
        url: `/pages/Front/HealthArticleDetail?HealthArticleId=${articleId}`
    });
};

// 格式化时间
const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // 计算时间差
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
        return `${minutes}分钟前`;
    } else if (hours < 24) {
        return `${hours}小时前`;
    } else if (days < 7) {
        return `${days}天前`;
    } else {
        return timeString.split(' ')[0]; // 显示日期部分
    }
};


</script>

<style scoped lang="scss">
.health-article-container {
    min-height: 100vh;
    background-color: #f5f5f5;
}



/* 搜索区域 */
.search-section {
    padding: 30upx;
    background-color: #fff;
    margin-bottom: 20upx;
}

/* 分类筛选区域 */
.category-filter {
    background-color: #fff;
    padding: 30upx 0;
    margin-bottom: 20upx;
}

.category-scroll {
    white-space: nowrap;
    /* 隐藏滚动条但保持滚动功能 */
    overflow-x: auto;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* Internet Explorer 10+ */

    &::-webkit-scrollbar {
        display: none;
        /* WebKit */
    }
}

.category-list {
    display: flex;
    padding: 0 30upx;
}

.category-item {
    flex-shrink: 0;
    padding: 16upx 32upx;
    margin-right: 20upx;
    background-color: #f8f8f8;
    border-radius: 40upx;
    font-size: 28upx;
    color: #666;
    transition: all 0.3s ease;

    &.active {
        background-color: var(--primary-color, #007aff);
        color: #fff;
    }

    &:last-child {
        margin-right: 30upx;
    }
}

/* 文章列表区域 */
.article-list {
    padding: 0 30upx;
}

.article-card {
    background-color: #fff;
    border-radius: 24upx;
    margin-bottom: 30upx;
    overflow: hidden;
    box-shadow: 0 4upx 16upx rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;

    &:active {
        transform: scale(0.98);
    }
}

/* 文章封面 */
.article-cover {
    position: relative;
    height: 360upx;
    overflow: hidden;
}

.cover-image {
    width: 100%;
    height: 100%;
}

.audit-status {
    position: absolute;
    top: 20upx;
    right: 20upx;
    padding: 8upx 16upx;
    border-radius: 24upx;
    font-size: 24upx;
    color: #fff;

    &.status-approved {
        background-color: #4cd964;
    }

    &.status-pending {
        background-color: #ff9500;
    }
}

/* 文章信息 */
.article-info {
    padding: 30upx;
}

.article-title {
    font-size: 32upx;
    font-weight: 600;
    color: #333;
    line-height: 1.4;
    margin-bottom: 20upx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.article-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20upx;
}

.category-tag {
    padding: 8upx 16upx;
    background-color: #f0f0f0;
    border-radius: 16upx;
    font-size: 24upx;
    color: #666;
}

.view-count {
    display: flex;
    align-items: center;

    .count-text {
        margin-left: 8upx;
        font-size: 24upx;
        color: #999;
    }
}

.publish-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24upx;
    color: #999;
}

.author {
    font-weight: 500;
}

.publish-time {
    color: #ccc;
}

/* 空状态 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120upx 40upx;

    .empty-text {
        margin-top: 30upx;
        font-size: 28upx;
        color: #999;
    }
}

/* 响应式适配 */
@media (max-width: 375px) {
    .article-cover {
        height: 320upx;
    }

    .article-title {
        font-size: 30upx;
    }
}
</style>