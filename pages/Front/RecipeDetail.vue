<template>
    <view class="recipe-detail">
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" title="食谱详情" />

        <!-- 内容区域 -->
        <view class="content-wrapper">
            <!-- 视频播放区域 -->
            <view class="media-section" v-if="RecipeDetail.VideoUrl">
                <view class="section-header">
                    <uni-icons type="videocam" color="#4CAF50" size="20"></uni-icons>
                    <text class="section-title">制作视频</text>
                </view>
                <view class="video-container">
                    <video :src="RecipeDetail.VideoUrl" controls class="recipe-video" poster="" object-fit="cover">
                    </video>
                </view>
            </view>

            <!-- 标题和统计信息 -->
            <view class="title-section">
                <view class="recipe-title">{{ RecipeDetail.Title }}</view>
                <view class="recipe-stats">
                    <view class="stat-item">
                        <uni-icons type="eye" color="#4CAF50" size="16"></uni-icons>
                        <text class="stat-text">{{ RecipeDetail.ViewCount || 0 }} 次浏览</text>
                    </view>
                </view>
            </view>

            <!-- 信息卡片区域 -->
            <view class="info-cards">
                <!-- 发布信息卡片 -->
                <view class="card publisher-card">
                    <view class="card-header">
                        <uni-icons type="person" color="#4CAF50" size="18"></uni-icons>
                        <text class="card-title">发布信息</text>
                    </view>
                    <view class="publisher-info">
                        <view class="publisher-avatar">
                            <image v-if="RecipeDetail.PublishUserDto && RecipeDetail.PublishUserDto.ImageUrls"
                                :src="RecipeDetail.PublishUserDto.ImageUrls" class="avatar-img"></image>
                            <view v-else class="avatar-placeholder">
                                <uni-icons type="person" color="#4CAF50" size="24"></uni-icons>
                            </view>
                        </view>
                        <view class="publisher-details">
                            <view class="publisher-name">{{ RecipeDetail.PublishUserDto && RecipeDetail.PublishUserDto.Name
                                || '匿名用户' }}</view>
                            <view class="publish-meta">
                                <view class="meta-item">
                                    <uni-icons type="calendar" color="#81C784" size="14"></uni-icons>
                                    <text class="meta-text">{{ formatTime(RecipeDetail.CreationTime) }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>


            </view>

            <!-- 图片轮播区域 -->
            <view class="media-section" v-if="imageList.length > 0">
                <view class="section-header">
                    <uni-icons type="image" color="#4CAF50" size="20"></uni-icons>
                    <text class="section-title">效果展示</text>
                </view>
                <view class="gallery-container">
                    <swiper class="gallery-swiper" indicator-dots circular indicator-color="#E8F5E9"
                        indicator-active-color="#4CAF50">
                        <swiper-item v-for="(image, index) in imageList" :key="index">
                            <view class="gallery-item">
                                <image :src="image" mode="aspectFill" class="gallery-image" @click="previewImage(index)">
                                </image>
                                <view class="image-overlay">
                                    <text class="step-number">{{ index + 1 }}</text>
                                </view>
                            </view>
                        </swiper-item>
                    </swiper>
                </view>
            </view>

            <!-- 食谱内容区域 -->
            <view class="content-section">
                <view class="section-header">
                    <uni-icons type="list" color="#4CAF50" size="20"></uni-icons>
                    <text class="section-title">制作详情</text>
                </view>
                <view class="content-card">
                    <rich-text :nodes="RecipeDetail.Content" class="rich-content"></rich-text>
                </view>
            </view>

            <!-- 推荐食谱区域 -->
            <view class="recommend-section" v-if="RecommendList.length > 0">
                <view class="recommend-header">
                    <view class="header-icon">
                        <uni-icons type="heart" color="#4CAF50" size="22"></uni-icons>
                    </view>
                    <text class="recommend-title">猜你喜欢</text>
                    <view class="header-decoration"></view>
                </view>

                <view class="recommend-grid">
                    <view class="recommend-card" v-for="item in RecommendList" :key="item.Id" @click="goToDetail(item.Id)">
                        <!-- 食谱封面区域 -->
                        <view class="card-image-wrapper">
                            <image :src="item.Cover" mode="aspectFill" class="card-image" />
                            <view class="image-overlay">
                                <view class="view-count">
                                    <uni-icons type="eye" color="#fff" size="12"></uni-icons>
                                    <text class="count-text">{{ item.ViewCount }}</text>
                                </view>

                            </view>
                        </view>

                        <!-- 食谱信息区域 -->
                        <view class="card-content">
                            <view class="recipe-title">{{ item.Title }}</view>

                            <!-- 作者信息 -->
                            <view class="author-section">
                                <view class="author-avatar">
                                    <image v-if="item.PublishUserDto && item.PublishUserDto.ImageUrls"
                                        :src="item.PublishUserDto.ImageUrls" class="avatar-img" mode="aspectFill" />
                                    <view v-else class="avatar-placeholder">
                                        <uni-icons type="person" color="#4CAF50" size="14"></uni-icons>
                                    </view>
                                </view>
                                <view class="author-info">
                                    <text class="author-name">{{ item.PublishUserDto && (item.PublishUserDto.Name ||
                                        item.PublishUserDto.UserName) || '匿名用户' }}</text>
                                    <text class="publish-time">{{ formatTime(item.CreationTime) }}</text>
                                </view>
                            </view>

                            <!-- 底部标签 -->
                            <view class="card-tags">
                                <view class="status-tag">{{ item.AuditStatusFormat }}</view>
                                <view class="like-indicator" v-if="item.ViewCount > 200">
                                    <uni-icons type="fire" color="#FF6B35" size="12"></uni-icons>
                                    <text class="hot-text">热门</text>
                                </view>
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

// 获取store
const commonStore = useCommonStore();
const Token = computed(() => commonStore.Token)
const UserInfo = computed(() => commonStore.UserInfo)
const RoleType = computed(() => commonStore.RoleType)
const UserId = computed(() => commonStore.UserId)

const RecipeDetail = ref({});
const imageList = ref([]);

const where = reactive({

});

// 生命周期钩子
onLoad(async (option) => {
    where.Id = option.RecipeId;
});
onShow(async () => {
    await AddViewCountApi();
    await GetRecipeDetailApi();
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

const GetRecipeDetailApi = async () => {
    let {
        Data
    } = await Post('/Recipe/Get', where);
    RecipeDetail.value = Data;

    // 处理图片列表
    if (Data.ImageUrls) {
        imageList.value = Data.ImageUrls.split(',').filter(url => url.trim());
    }
}

const AddViewCountApi = async () => {
    let {
        Success
    } = await Post('/Recipe/AddViewCount', { Id: where.Id });

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
        CollectType: "食谱",
        RelativeId: where.Id
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
            CollectType: "食谱",
            RelativeId: where.Id
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
        LikeType: "食谱",
        RelativeId: where.Id
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
            LikeType: "食谱",
            RelativeId: where.Id
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


// 格式化时间
const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
        return '今天发布';
    } else if (days === 1) {
        return '昨天发布';
    } else if (days < 7) {
        return `${days}天前发布`;
    } else {
        return date.toLocaleDateString().replace(/\//g, '-');
    }
}

// 预览图片
const previewImage = (index) => {
    uni.previewImage({
        current: index,
        urls: imageList.value
    });
}
const RecommendList = ref([]);
//推荐
const RecommendListApi = async () => {
    let {
        Data
    } = await Post('/Recipe/RecommendList', {
        Id: where.Id
    });
    RecommendList.value = Data;
}

// 跳转到推荐食谱详情页
const goToDetail = (recipeId) => {
    uni.redirectTo({
        url: `/pages/Front/RecipeDetail?RecipeId=${recipeId}`
    });
}
</script>

<style scoped lang="scss">
.recipe-detail {
    background: linear-gradient(180deg, #E8F5E9 0%, #F1F8E9 50%, #F9FBE7 100%);
    min-height: 100vh;
}

.content-wrapper {
    padding-bottom: 120upx;
    /* 为底部操作栏留出空间 */
}

/* 标题区域 */
.title-section {
    background: #fff;
    margin: 30upx;
    border-radius: 32upx;
    padding: 40upx;
    box-shadow: 0 8upx 40upx rgba(76, 175, 80, 0.1);
    border: 2upx solid #E8F5E9;

    .recipe-title {
        font-size: 48upx;
        font-weight: bold;
        color: #1B5E20;
        margin-bottom: 24upx;
        line-height: 1.4;
    }

    .recipe-stats {
        .stat-item {
            display: flex;
            align-items: center;

            .stat-text {
                color: #4CAF50;
                font-size: 28upx;
                font-weight: 500;
                margin-left: 12upx;
            }
        }
    }
}

/* 信息卡片区域 */
.info-cards {
    padding: 40upx 30upx 0;
    display: flex;
    flex-direction: column;
    gap: 30upx;
}

.card {
    background: #fff;
    border-radius: 32upx;
    padding: 40upx;
    box-shadow: 0 8upx 40upx rgba(76, 175, 80, 0.1);
    border: 2upx solid #E8F5E9;

    .card-header {
        display: flex;
        align-items: center;
        margin-bottom: 30upx;

        .card-title {
            font-size: 32upx;
            font-weight: 600;
            color: #2E7D32;
            margin-left: 16upx;
        }
    }
}

/* 发布者信息 */
.publisher-info {
    display: flex;
    align-items: center;

    .publisher-avatar {
        margin-right: 30upx;

        .avatar-img {
            width: 100upx;
            height: 100upx;
            border-radius: 50upx;
            border: 6upx solid #E8F5E9;
        }

        .avatar-placeholder {
            width: 100upx;
            height: 100upx;
            border-radius: 50upx;
            background: #E8F5E9;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .publisher-details {
        flex: 1;

        .publisher-name {
            font-size: 36upx;
            font-weight: 600;
            color: #1B5E20;
            margin-bottom: 12upx;
        }

        .publish-meta {
            .meta-item {
                display: flex;
                align-items: center;

                .meta-text {
                    font-size: 28upx;
                    color: #4CAF50;
                    margin-left: 12upx;
                    font-weight: 500;
                }
            }
        }
    }
}



/* 媒体区域 */
.media-section {
    margin: 40upx 30upx;

    .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 30upx;

        .section-title {
            font-size: 36upx;
            font-weight: 600;
            color: #1B5E20;
            margin-left: 20upx;
        }
    }
}

/* 视频容器 */
.video-container {
    border-radius: 32upx;
    overflow: hidden;
    box-shadow: 0 16upx 64upx rgba(76, 175, 80, 0.15);

    .recipe-video {
        width: 100%;
        height: 440upx;
    }
}

/* 效果展示区域 */
.gallery-container {
    position: relative;
    border-radius: 40upx;
    overflow: hidden;
    background: linear-gradient(135deg, #ffffff 0%, #f8fffe 100%);
    box-shadow: 0 20upx 80upx rgba(76, 175, 80, 0.15);
    border: 3upx solid rgba(76, 175, 80, 0.1);

    /* 装饰性渐变边框 */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 8upx;
        background: linear-gradient(90deg, #4CAF50, #81C784, #A5D6A7, #4CAF50);
        z-index: 1;
    }

    .gallery-swiper {
        height: 600upx;
        position: relative;

        .gallery-item {
            position: relative;
            height: 100%;
            border-radius: 40upx;
            overflow: hidden;

            .gallery-image {
                width: 100%;
                height: 100%;
                transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* 悬停效果 */
            &:active .gallery-image {
                transform: scale(1.05);
            }

            .image-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
                padding: 60upx 40upx 40upx;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;

                .step-number {
                    color: #ffffff;
                    font-size: 32upx;
                    font-weight: 700;
                    background: linear-gradient(135deg, #4CAF50, #66BB6A);
                    padding: 16upx 32upx;
                    border-radius: 50upx;
                    box-shadow: 0 8upx 24upx rgba(76, 175, 80, 0.4);
                    backdrop-filter: blur(20upx);
                    border: 2upx solid rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 120upx;
                }

                /* 添加装饰性元素 */
                &::after {
                    content: '';
                    position: absolute;
                    top: 20upx;
                    right: 40upx;
                    width: 60upx;
                    height: 60upx;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    backdrop-filter: blur(10upx);
                    border: 1upx solid rgba(255, 255, 255, 0.2);
                }
            }
        }
    }

    /* 自定义轮播指示器样式 */
    ::v-deep .uni-swiper-dot {
        width: 16upx !important;
        height: 16upx !important;
        border-radius: 8upx !important;
        background-color: rgba(255, 255, 255, 0.3) !important;
        margin: 0 8upx !important;
        transition: all 0.3s ease !important;
    }

    ::v-deep .uni-swiper-dot-active {
        width: 40upx !important;
        background: linear-gradient(90deg, #4CAF50, #66BB6A) !important;
        box-shadow: 0 4upx 16upx rgba(76, 175, 80, 0.4) !important;
    }

    /* 轮播容器底部装饰 */
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100upx;
        height: 8upx;
        background: linear-gradient(90deg, transparent, #4CAF50, transparent);
        border-radius: 4upx 4upx 0 0;
        z-index: 2;
    }
}

/* 内容区域 */
.content-section {
    margin: 40upx 30upx;

    .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 30upx;

        .section-title {
            font-size: 36upx;
            font-weight: 600;
            color: #1B5E20;
            margin-left: 20upx;
        }
    }

    .content-card {
        background: #fff;
        border-radius: 32upx;
        padding: 50upx;
        box-shadow: 0 8upx 40upx rgba(76, 175, 80, 0.1);
        border: 2upx solid #E8F5E9;

        .rich-content {
            line-height: 1.8;
            color: #424242;
            font-size: 32upx;

            ::v-deep p {
                margin-bottom: 30upx;

                &:last-child {
                    margin-bottom: 0;
                }
            }

            ::v-deep strong {
                color: #2E7D32;
                font-weight: 600;
            }
        }
    }
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

/* 推荐食谱区域 */
.recommend-section {
    margin: 40upx 30upx;
    background: linear-gradient(135deg, #ffffff 0%, #f8fffe 100%);
    border-radius: 40upx;
    padding: 50upx 40upx;
    box-shadow: 0 16upx 64upx rgba(76, 175, 80, 0.12);
    border: 2upx solid rgba(76, 175, 80, 0.1);
    margin-bottom: 140upx;
    position: relative;
    overflow: hidden;
}

.recommend-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6upx;
    background: linear-gradient(90deg, #4CAF50, #81C784, #A5D6A7);
}

/* 推荐头部 */
.recommend-header {
    display: flex;
    align-items: center;
    margin-bottom: 50upx;
    position: relative;
}

.header-icon {
    margin-right: 24upx;
    padding: 16upx;
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(129, 199, 132, 0.1));
    border-radius: 24upx;
    border: 2upx solid rgba(76, 175, 80, 0.2);
}

.recommend-title {
    font-size: 40upx;
    font-weight: 700;
    color: #1B5E20;
    flex: 1;
}

.header-decoration {
    width: 80upx;
    height: 6upx;
    background: linear-gradient(90deg, #4CAF50, #81C784);
    border-radius: 4upx;
}

/* 推荐网格布局 */
.recommend-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30upx;
}

/* 推荐食谱卡片 */
.recommend-card {
    background: #ffffff;
    border-radius: 32upx;
    overflow: hidden;
    box-shadow: 0 8upx 32upx rgba(76, 175, 80, 0.08);
    border: 2upx solid rgba(76, 175, 80, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.recommend-card:active {
    transform: translateY(-4upx) scale(0.98);
    box-shadow: 0 16upx 50upx rgba(76, 175, 80, 0.15);
    border-color: #4CAF50;
}

/* 食谱封面区域 */
.card-image-wrapper {
    position: relative;
    height: 240upx;
    overflow: hidden;
}

.card-image {
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;
}

.recommend-card:active .card-image {
    transform: scale(1.05);
}

/* 图片覆盖层 */
.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20upx;
}

/* 浏览量显示 */
.view-count {
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    padding: 8upx 16upx;
    border-radius: 24upx;
    backdrop-filter: blur(10px);
}

.count-text {
    font-size: 22upx;
    color: #ffffff;
    margin-left: 8upx;
    font-weight: 500;
}

/* 食谱标签 */
.recipe-badge {
    background: linear-gradient(135deg, #4CAF50, #66BB6A);
    padding: 8upx 16upx;
    border-radius: 16upx;
    box-shadow: 0 4upx 16upx rgba(76, 175, 80, 0.3);
}

.badge-text {
    font-size: 20upx;
    color: #ffffff;
    font-weight: 600;
}

/* 卡片内容区域 */
.card-content {
    padding: 30upx 24upx 24upx;
}

/* 食谱标题 */
.recipe-title {
    font-size: 28upx;
    font-weight: 600;
    color: #1B5E20;
    line-height: 1.4;
    margin-bottom: 24upx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 76upx;
}

/* 作者信息区域 */
.author-section {
    display: flex;
    align-items: center;
    margin-bottom: 24upx;
}

.author-avatar {
    margin-right: 16upx;
}

.avatar-img {
    width: 48upx;
    height: 48upx;
    border-radius: 24upx;
    border: 4upx solid #E8F5E9;
}

.avatar-placeholder {
    width: 48upx;
    height: 48upx;
    border-radius: 24upx;
    background: linear-gradient(135deg, #E8F5E9, #F1F8E9);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2upx solid rgba(76, 175, 80, 0.2);
}

.author-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.author-name {
    font-size: 24upx;
    color: #2E7D32;
    font-weight: 500;
    line-height: 1.2;
}

.publish-time {
    font-size: 20upx;
    color: #81C784;
    margin-top: 4upx;
    line-height: 1.2;
}

/* 底部标签区域 */
.card-tags {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.status-tag {
    font-size: 20upx;
    color: #4CAF50;
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(129, 199, 132, 0.1));
    padding: 6upx 16upx;
    border-radius: 20upx;
    border: 2upx solid rgba(76, 175, 80, 0.2);
    font-weight: 500;
}

.like-indicator {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 138, 101, 0.1));
    padding: 6upx 12upx;
    border-radius: 20upx;
    border: 2upx solid rgba(255, 107, 53, 0.2);
}

.hot-text {
    font-size: 18upx;
    color: #FF6B35;
    margin-left: 6upx;
    font-weight: 600;
}

/* 响应式调整 */
@media (max-width: 800upx) {
    .recommend-grid {
        grid-template-columns: 1fr;
    }

    .card-image-wrapper {
        height: 280upx;
    }
}
</style>