<template>
    <view class="recipe-detail">
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" title="食谱详情" />

        <!-- 内容区域 -->
        <view class="content-wrapper">
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
                    <text class="section-title">制作过程</text>
                </view>
                <view class="gallery-container">
                    <swiper class="gallery-swiper" indicator-dots circular indicator-color="#E8F5E9"
                        indicator-active-color="#4CAF50">
                        <swiper-item v-for="(image, index) in imageList" :key="index">
                            <view class="gallery-item">
                                <image :src="image" mode="aspectFill" class="gallery-image" @click="previewImage(index)">
                                </image>
                                <view class="image-overlay">
                                    <text class="step-number">步骤 {{ index + 1 }}</text>
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

</script>

<style scoped lang="scss">
.recipe-detail {
    background: linear-gradient(180deg, #E8F5E9 0%, #F1F8E9 50%, #F9FBE7 100%);
    min-height: 100vh;
}

.content-wrapper {
    padding-bottom: 30px;
}

/* 标题区域 */
.title-section {
    background: #fff;
    margin: 15px;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(76, 175, 80, 0.1);
    border: 1px solid #E8F5E9;

    .recipe-title {
        font-size: 24px;
        font-weight: bold;
        color: #1B5E20;
        margin-bottom: 12px;
        line-height: 1.4;
    }

    .recipe-stats {
        .stat-item {
            display: flex;
            align-items: center;

            .stat-text {
                color: #4CAF50;
                font-size: 14px;
                font-weight: 500;
                margin-left: 6px;
            }
        }
    }
}

/* 信息卡片区域 */
.info-cards {
    padding: 20px 15px 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.card {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(76, 175, 80, 0.1);
    border: 1px solid #E8F5E9;

    .card-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        .card-title {
            font-size: 16px;
            font-weight: 600;
            color: #2E7D32;
            margin-left: 8px;
        }
    }
}

/* 发布者信息 */
.publisher-info {
    display: flex;
    align-items: center;

    .publisher-avatar {
        margin-right: 15px;

        .avatar-img {
            width: 50px;
            height: 50px;
            border-radius: 25px;
            border: 3px solid #E8F5E9;
        }

        .avatar-placeholder {
            width: 50px;
            height: 50px;
            border-radius: 25px;
            background: #E8F5E9;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .publisher-details {
        flex: 1;

        .publisher-name {
            font-size: 18px;
            font-weight: 600;
            color: #1B5E20;
            margin-bottom: 6px;
        }

        .publish-meta {
            .meta-item {
                display: flex;
                align-items: center;

                .meta-text {
                    font-size: 14px;
                    color: #4CAF50;
                    margin-left: 6px;
                    font-weight: 500;
                }
            }
        }
    }
}



/* 媒体区域 */
.media-section {
    margin: 20px 15px;

    .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1B5E20;
            margin-left: 10px;
        }
    }
}

/* 视频容器 */
.video-container {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(76, 175, 80, 0.15);

    .recipe-video {
        width: 100%;
        height: 220px;
    }
}

/* 图片轮播 */
.gallery-container {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(76, 175, 80, 0.15);

    .gallery-swiper {
        height: 280px;

        .gallery-item {
            position: relative;
            height: 100%;

            .gallery-image {
                width: 100%;
                height: 100%;
            }

            .image-overlay {
                position: absolute;
                bottom: 15px;
                left: 15px;
                background: rgba(76, 175, 80, 0.9);
                padding: 6px 12px;
                border-radius: 12px;

                .step-number {
                    color: #fff;
                    font-size: 12px;
                    font-weight: 600;
                }
            }
        }
    }
}

/* 内容区域 */
.content-section {
    margin: 20px 15px;

    .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1B5E20;
            margin-left: 10px;
        }
    }

    .content-card {
        background: #fff;
        border-radius: 16px;
        padding: 25px;
        box-shadow: 0 4px 20px rgba(76, 175, 80, 0.1);
        border: 1px solid #E8F5E9;

        .rich-content {
            line-height: 1.8;
            color: #424242;
            font-size: 16px;

            ::v-deep p {
                margin-bottom: 15px;

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



/* 全局样式调整 */
::v-deep .uni-swiper-dot {
    background-color: rgba(255, 255, 255, 0.4) !important;
}

::v-deep .uni-swiper-dot-active {
    background-color: #4CAF50 !important;
}
</style>