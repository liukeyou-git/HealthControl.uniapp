<template>
    <view>
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" title="官方健康指标" />

        <!-- 页面内容 -->
        <view class="page-content">
            <!-- 页面描述 -->
            <view class="page-description">
                <view class="description-text">
                    选择官方推荐的健康指标分类，科学管理您的健康数据
                </view>
            </view>

            <!-- 官方指标分类列表 -->
            <view class="category-list" v-if="CommHealthIndicatorTypeList.length > 0">
                <view class="category-item" v-for="(category, index) in CommHealthIndicatorTypeList" :key="category.Id">
                    <!-- 分类头部 -->
                    <view class="category-header" @click="toggleCategory(index)">
                        <!-- 分类图标 -->
                        <view class="category-icon">
                            <uni-icons type="heart" size="22" color="#4CAF50"></uni-icons>
                        </view>

                        <!-- 分类信息 -->
                        <view class="category-info">
                            <view class="category-name">{{ category.Name }}</view>
                            <view class="category-count">{{ category.HealthIndicatorDtoList.length }}项指标</view>
                        </view>

                        <!-- 展开箭头 -->
                        <view class="expand-arrow" :class="{ 'expanded': expandedCategories.includes(index) }">
                            <uni-icons type="arrowdown" size="16" color="#666"></uni-icons>
                        </view>
                    </view>

                    <!-- 子指标列表 -->
                    <view class="indicator-list" v-show="expandedCategories.includes(index)">
                        <view class="indicator-item" v-for="indicator in category.HealthIndicatorDtoList"
                            :key="indicator.Id" @click="selectIndicator(indicator)">
                            <!-- 指标封面图片 -->
                            <view class="indicator-cover">
                                <image v-if="indicator.Cover" :src="indicator.Cover" mode="aspectFill"
                                    class="cover-image" />
                                <view v-else class="cover-placeholder">
                                    <uni-icons type="image" size="20" color="#ccc"></uni-icons>
                                </view>
                            </view>

                            <!-- 指标内容 -->
                            <view class="indicator-content">
                                <view class="indicator-name">{{ indicator.Name }}</view>
                                <view class="indicator-description">{{ indicator.Content }}</view>
                                <view class="indicator-threshold">
                                    <text class="threshold-label">参考值：</text>
                                    <text class="threshold-value">{{ indicator.Threshold }}</text>
                                </view>
                            </view>

                            <!-- 选择按钮 -->
                            <view class="select-btn" :class="{ 'selected': indicator.IsSelected }">
                                <uni-icons v-if="indicator.IsSelected" type="checkmarkempty" size="18"
                                    color="#ffffff"></uni-icons>
                                <uni-icons v-else type="plus" size="18" color="#4CAF50"></uni-icons>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 空状态 -->
            <view class="empty-state" v-else>
                <view class="empty-icon">
                    <uni-icons type="info" size="60" color="#ccc"></uni-icons>
                </view>
                <view class="empty-text">暂无官方健康指标</view>
                <view class="empty-description">官方推荐的健康指标将在这里显示</view>
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

const TestInfoList = ref([]);

const where = reactive({

});

// 展开的分类索引数组
const expandedCategories = ref([]);

// 生命周期钩子
onLoad(async (option) => {
});
onShow(async () => {
    GetCommHealthIndicatorTypeListApi()
});

onReady(async () => {

});

// 方法
const goBack = () => {
    uni.navigateBack();
};

const CommHealthIndicatorTypeList = ref([]);
//得到官方公开的指标分类
const GetCommHealthIndicatorTypeListApi = async () => {
    let {
        Data: {
            Items
        }
    } = await Post('/HealthIndicatorType/CommUserHealthIndicatorList', {
        IsComm: true
    });
    CommHealthIndicatorTypeList.value = Items;
}

// 切换分类展开状态
const toggleCategory = (index) => {
    const expandIndex = expandedCategories.value.indexOf(index);
    if (expandIndex > -1) {
        // 如果已展开，则收起
        expandedCategories.value.splice(expandIndex, 1);
    } else {
        // 如果未展开，则展开
        expandedCategories.value.push(index);
    }
};

// 选择具体指标
const selectIndicator = async (indicator) => {

    if (indicator.IsSelected) {
        let { Success } = await Post('/HealthIndicator/UserCancelCommIndicator', {
            Name: indicator.Name,
            BelongUserId: UserId.value,
        });
        if (Success) {
            indicator.IsSelected = false;
            uni.showToast({
                title: `已取消选择：${indicator.Name}`,
                icon: 'none'
            });
        }
    }
    else {

        let { Success } = await Post('/HealthIndicator/UserAddCommIndicator', {
            Name: indicator.Name,
            Content: indicator.Content,
            Threshold: indicator.Threshold,
            HealthIndicatorTypeId: indicator.HealthIndicatorTypeId,
            Cover: indicator.Cover,
            BelongUserId: UserId.value,
        });

        if (Success) {
            // 添加成功后，更新该指标的IsSelected状态
            indicator.IsSelected = true;

            uni.showToast({
                title: `已选择：${indicator.Name}`,
                icon: 'none'
            });
        }
    }
};

</script>

<style scoped lang="scss">
/* 页面内容区域 */
.page-content {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 20rpx;
}

/* 页面描述区域 */
.page-description {
    background-color: #ffffff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.description-text {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.6;
    text-align: center;
}

/* 分类列表 */
.category-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

/* 分类项 */
.category-item {
    background-color: #ffffff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

/* 分类头部 */
.category-header {
    display: flex;
    align-items: center;
    padding: 24rpx;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:active {
        background-color: #f8f8f8;
    }
}

/* 分类图标 */
.category-icon {
    width: 52rpx;
    height: 52rpx;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16rpx;
    box-shadow: 0 2rpx 6rpx rgba(76, 175, 80, 0.3);
}

/* 分类信息 */
.category-info {
    flex: 1;
}

.category-name {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 4rpx;
}

.category-count {
    font-size: 24rpx;
    color: #999999;
}

/* 展开箭头 */
.expand-arrow {
    transition: transform 0.3s ease;

    &.expanded {
        transform: rotate(180deg);
    }
}

/* 指标列表 */
.indicator-list {
    border-top: 1rpx solid #f0f0f0;
    background-color: #fafafa;
}

/* 指标项 */
.indicator-item {
    display: flex;
    align-items: center;
    padding: 20rpx 24rpx;
    border-bottom: 1rpx solid #f0f0f0;
    transition: background-color 0.3s ease;

    &:last-child {
        border-bottom: none;
    }

    &:active {
        background-color: #f0f0f0;
    }
}

/* 指标封面 */
.indicator-cover {
    width: 64rpx;
    height: 64rpx;
    border-radius: 12rpx;
    overflow: hidden;
    margin-right: 16rpx;
    background-color: #f5f5f5;
}

.cover-image {
    width: 100%;
    height: 100%;
}

.cover-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
}

/* 指标内容 */
.indicator-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.indicator-name {
    font-size: 28rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 6rpx;
}

.indicator-description {
    font-size: 24rpx;
    color: #666666;
    line-height: 1.4;
    margin-bottom: 8rpx;
}

.indicator-threshold {
    font-size: 22rpx;
    display: flex;
    align-items: center;
}

.threshold-label {
    color: #999999;
    margin-right: 4rpx;
}

.threshold-value {
    color: #4CAF50;
    font-weight: 600;
}

/* 选择按钮 */
.select-btn {
    width: 48rpx;
    height: 48rpx;
    border: 2rpx solid #4CAF50;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    transition: all 0.3s ease;

    &:active {
        background-color: #4CAF50;
        transform: scale(0.9);
    }

    /* 已选择状态样式 */
    &.selected {
        background-color: #4CAF50;
        border-color: #4CAF50;
    }
}

/* 空状态 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80rpx 24rpx;
    text-align: center;
}

.empty-icon {
    margin-bottom: 24rpx;
    opacity: 0.6;
}

.empty-text {
    font-size: 32rpx;
    font-weight: 600;
    color: #999999;
    margin-bottom: 12rpx;
}

.empty-description {
    font-size: 26rpx;
    color: #cccccc;
    line-height: 1.5;
}
</style>
