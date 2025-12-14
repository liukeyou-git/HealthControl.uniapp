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

</script>

<style scoped lang="scss">
/* 文章容器 */
.article-container {


    background-color: #f8f9fa;
    min-height: calc(100vh - 176upx);
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