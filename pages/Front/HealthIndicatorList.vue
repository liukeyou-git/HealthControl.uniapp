<template>
    <view>
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar l title="健康指标" />

        <!-- 页面内容 -->
        <view class="page-content">
            <!-- 顶部入口区域 -->
            <view class="entry-section">
                <!-- 左侧卡片组 -->
                <view class="left-cards">
                    <!-- 官方选择指标入口 -->
                    <view class="entry-card small primary" @click="goToOfficialIndicators">
                        <!-- 卡片图标 -->
                        <view class="entry-icon">
                            <image :src="selectIcon" class="icon-image" mode="aspectFit"></image>
                        </view>
                        <!-- 卡片内容 -->
                        <view class="entry-content">
                            <view class="entry-title">官方选择指标</view>
                            <view class="entry-subtitle">从官方推荐的健康指标中选择</view>
                        </view>
                        <!-- 箭头图标 -->
                        <view class="entry-arrow">
                            <uni-icons type="arrowright" size="14" color="#ffffff"></uni-icons>
                        </view>
                    </view>

                    <!-- 自主添加指标入口 -->
                    <view class="entry-card small secondary" @click="goToCustomIndicators">
                        <!-- 卡片图标 -->
                        <view class="entry-icon">
                            <image :src="addIcon" class="icon-image" mode="aspectFit"></image>
                        </view>
                        <!-- 卡片内容 -->
                        <view class="entry-content">
                            <view class="entry-title">自主添加指标</view>
                            <view class="entry-subtitle">创建个性化的健康指标</view>
                        </view>
                        <!-- 箭头图标 -->
                        <view class="entry-arrow">
                            <uni-icons type="arrowright" size="14" color="#ffffff"></uni-icons>
                        </view>
                    </view>
                </view>

                <!-- 右侧大卡片 -->
                <view class="right-card">
                    <!-- 我的填写记录入口 -->
                    <view class="entry-card large tertiary" @click="goToRecordList">
                        <!-- 卡片图标 -->
                        <view class="entry-icon-large">
                            <image :src="recordIcon" class="icon-image-large" mode="aspectFit"></image>
                        </view>
                        <!-- 卡片内容 -->
                        <view class="entry-content-large">
                            <view class="entry-title-large">我的填写</view>
                            <view class="entry-subtitle-large">查看历史健康数据记录</view>
                        </view>
                        <!-- 箭头图标 -->
                        <view class="entry-arrow">
                            <uni-icons type="arrowright" size="16" color="#ffffff"></uni-icons>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 健康指标列表区域 -->
            <view v-if="UserHealthIndicatorTypeList.length > 0" class="indicator-section">
                <!-- 标题和操作区域 -->
                <view class="section-header">
                    <view class="section-title">
                        <uni-icons type="bars" size="18" color="#4CAF50"></uni-icons>
                        <text class="title-text">我的健康指标</text>
                    </view>

                    <!-- 操作按钮 -->
                    <view class="section-actions">
                        <button v-if="!isSelectionMode" class="action-btn select-btn" @click="toggleSelectionMode">
                            <uni-icons type="checkmarkempty" size="14" color="#ffffff"></uni-icons>
                            <text class="btn-text">选择指标</text>
                        </button>
                        <button v-else class="action-btn cancel-btn" @click="toggleSelectionMode">
                            <uni-icons type="close" size="14" color="#ffffff"></uni-icons>
                            <text class="btn-text">取消</text>
                        </button>
                    </view>
                </view>

                <!-- 选择状态提示 -->
                <view v-if="isSelectionMode" class="selection-status">
                    <view class="status-info">
                        <uni-icons type="info" size="16" color="#4CAF50"></uni-icons>
                        <text class="status-text">已选择 {{ selectedIndicators.length }} 项指标</text>
                    </view>
                    <button v-if="selectedIndicators.length > 0" class="batch-record-btn" @click="goToBatchRecord">
                        <uni-icons type="compose" size="14" color="#ffffff"></uni-icons>
                        <text class="btn-text">批量录入数据</text>
                    </button>
                </view>

                <!-- 指标分类列表 -->
                <view v-for="(category, categoryIndex) in UserHealthIndicatorTypeList" :key="category.Id"
                    class="category-wrapper">
                    <!-- 分类标题 -->
                    <view class="category-header">
                        <view class="category-title">{{ category.Name }}</view>
                        <view class="category-count">{{ category.HealthIndicatorDtoList.length }}项指标</view>
                    </view>

                    <!-- 指标列表 -->
                    <view class="indicators-grid">
                        <view v-for="(indicator, indicatorIndex) in category.HealthIndicatorDtoList" :key="indicator.Id"
                            class="indicator-card"
                            :class="{ 'selected': isIndicatorSelected(indicator.Id), 'selection-mode': isSelectionMode }"
                            @click="goToIndicatorDetail(indicator)">
                            <!-- 选择状态指示器 -->
                            <view v-if="isSelectionMode" class="selection-indicator">
                                <view class="checkbox" :class="{ 'checked': isIndicatorSelected(indicator.Id) }">
                                    <uni-icons v-if="isIndicatorSelected(indicator.Id)" type="checkmarkempty" size="16"
                                        color="#ffffff"></uni-icons>
                                </view>
                            </view>

                            <!-- 指标图标 -->
                            <view class="indicator-icon">
                                <image v-if="indicator.Cover" :src="indicator.Cover" class="icon-image" mode="aspectFit">
                                </image>
                                <uni-icons v-else type="pulse" size="24" color="#4CAF50"></uni-icons>
                            </view>

                            <!-- 指标信息 -->
                            <view class="indicator-info">
                                <view class="indicator-name">{{ indicator.Name }}</view>
                                <view class="indicator-threshold">正常值: {{ indicator.Threshold }}</view>
                                <view class="indicator-content">{{ indicator.Content }}</view>
                            </view>

                            <!-- 箭头 -->
                            <view v-if="!isSelectionMode" class="indicator-arrow">
                                <uni-icons type="arrowright" size="14" color="#cccccc"></uni-icons>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 空状态 -->
            <view v-else class="empty-state">
                <view class="empty-icon">
                    <uni-icons type="list" size="60" color="#cccccc"></uni-icons>
                </view>
                <view class="empty-text">暂无健康指标</view>
                <view class="empty-subtitle">点击上方按钮添加您的第一个健康指标</view>
            </view>

        </view>

        <footer-bar />
    </view>
</template>

<script setup>

import { useCommonStore } from '@/store';
import { Post } from '@/utils/http';
import { onLoad, onReady, onShow } from "@dcloudio/uni-app";
import { computed, reactive, ref } from 'vue';
import addIcon from "@/assets/添加.png";
import selectIcon from "@/assets/选择.png";
import recordIcon from "@/assets/记录.png";

// 获取store
const commonStore = useCommonStore();
const Token = computed(() => commonStore.Token)
const UserInfo = computed(() => commonStore.UserInfo)
const RoleType = computed(() => commonStore.RoleType)
const UserId = computed(() => commonStore.UserId)



const TestInfoList = ref([]);

const where = reactive({

});

// 生命周期钩子
onLoad(async (option) => {
});
onShow(async () => {

    GetUserHealthIndicatorTypeListApi();
});

onReady(async () => {


});
const UserHealthIndicatorTypeList = ref([]);
// 清单管理
const selectedIndicators = ref([]); // 已选择的指标清单
const isSelectionMode = ref(false); // 是否在选择模式

//得到用户的指标分类
const GetUserHealthIndicatorTypeListApi = async () => {
    let {
        Data: {
            Items
        }
    } = await Post('/HealthIndicatorType/UserHealthIndicatorList', {
        BelongUserId: UserId.value
    });
    UserHealthIndicatorTypeList.value = Items;
}

//移除指标
const UserRemoveIndicatorApi = async (Id) => {
    let { Success } = await Post('/HealthIndicator/UserRemoveIndicator', {
        Id: Id
    });
    if (Success) {
        await GetUserHealthIndicatorTypeListApi();
    }
}



// 跳转到健康指标归类页面
const goToHealthCategory = () => {

    uni.navigateTo({
        url: '/pages/Front/HealthIndicatorTypeList'
    });
};

// 跳转到官方选择指标页面
const goToOfficialIndicators = () => {
    uni.navigateTo({
        url: '/pages/Front/CommHealthIndicatorTypeList'
    });
};

// 跳转到自主添加指标页面
const goToCustomIndicators = () => {
    uni.navigateTo({
        url: '/pages/Front/HealthIndicatorForm?Id='
    });
};

// 跳转到我的填写记录页面
const goToRecordList = () => {
    uni.navigateTo({
        url: '/pages/Front/HealthIndicatorRecordList'
    });
};

// 跳转到指标详情页面
const goToIndicatorDetail = (indicator) => {
    if (isSelectionMode.value) {
        // 在选择模式下，点击切换选择状态
        toggleIndicatorSelection(indicator);
    } else {
        // 正常模式下显示操作选择框
        showActionModal(indicator);
    }
};

// 切换指标选择状态
const toggleIndicatorSelection = (indicator) => {
    const index = selectedIndicators.value.findIndex(item => item.Id === indicator.Id);
    if (index > -1) {
        // 已选择，移除
        selectedIndicators.value.splice(index, 1);
    } else {
        // 未选择，添加
        selectedIndicators.value.push({
            Id: indicator.Id,
            Name: indicator.Name,
            HealthIndicatorTypeId: indicator.HealthIndicatorTypeId,
            HealthIndicatorTypeName: getUserIndicatorTypeName(indicator.HealthIndicatorTypeId),
            Threshold: indicator.Threshold,
            Content: indicator.Content,
            Cover: indicator.Cover
        });
    }
};

// 检查指标是否已选择
const isIndicatorSelected = (indicatorId) => {
    return selectedIndicators.value.some(item => item.Id === indicatorId);
};

// 获取指标分类名称
const getUserIndicatorTypeName = (typeId) => {
    const type = UserHealthIndicatorTypeList.value.find(item => item.Id === typeId);
    return type ? type.Name : '';
};

// 切换选择模式
const toggleSelectionMode = () => {
    isSelectionMode.value = !isSelectionMode.value;
    if (!isSelectionMode.value) {
        // 退出选择模式时清空选择
        selectedIndicators.value = [];
    }
};

// 跳转到批量录入页面
const goToBatchRecord = () => {
    if (selectedIndicators.value.length === 0) {
        uni.showToast({
            title: '请先选择指标',
            icon: 'none'
        });
        return;
    }

    // 将选择的指标数据传递到录入页面

    uni.setStorageSync('selectedIndicators', JSON.stringify(selectedIndicators.value));
    uni.navigateTo({
        url: `/pages/Front/BatchRecordForm?`
    });
};

// 显示操作选择框
const showActionModal = (indicator) => {
    uni.showActionSheet({
        itemList: ['编辑指标', '删除指标'],
        itemColor: '#333333',
        success: (res) => {
            if (res.tapIndex === 0) {
                // 编辑指标
                editIndicator(indicator);
            } else if (res.tapIndex === 1) {
                // 删除指标
                confirmDeleteIndicator(indicator);
            }
        }
    });
};

// 编辑指标
const editIndicator = (indicator) => {
    uni.navigateTo({
        url: `/pages/Front/HealthIndicatorForm?Id=${indicator.Id}`
    });
};

// 确认删除指标
const confirmDeleteIndicator = (indicator) => {
    uni.showModal({
        title: '确认删除',
        content: `确定要删除指标"${indicator.Name}"吗？此操作不可恢复。`,
        confirmText: '删除',
        confirmColor: '#F44336',
        cancelText: '取消',
        success: async (res) => {
            if (res.confirm) {
                try {
                    await UserRemoveIndicatorApi(indicator.Id);
                    uni.showToast({
                        title: '删除成功',
                        icon: 'success'
                    });
                } catch (error) {
                    uni.showToast({
                        title: '删除失败',
                        icon: 'error'
                    });
                }
            }
        }
    });
};

const GetHealthIndicatorListApi = async () => {
    let {
        Data: {
            Items
        }
    } = await Post('/HealthIndicator/List', where);
    HealthIndicatorList.value = Items;
}
// 删除
const ShowDeleteModal = async (Id) => {
    uni.showModal({
        title: '提示',
        content: '确认删除该测试信息吗？',
        success: async (res) => {
            if (res.confirm) {
                const { Success } = await Post(`/HealthIndicator/Delete`, { Id: Id });
                if (Success) {
                    await GetHealthIndicatorListApi();
                    uni.showToast({
                        title: '删除成功',
                        icon: 'success'
                    });
                }
            }
        }
    })
};

</script>

<style scoped lang="scss">
/* 页面内容区域 */
.page-content {
    padding: 10rpx 24rpx 120rpx;
    min-height: 100vh;
    background-color: #f5f5f5;
}

/* 顶部入口区域 */
.entry-section {
    display: flex;
    gap: 16rpx;
    margin-bottom: 32rpx;
    height: 280rpx;
    /* 固定高度 */
}

/* 左侧卡片组 */
.left-cards {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    flex: 1;
}

/* 右侧大卡片 */
.right-card {
    flex: 1;
    height: 100%;
}

/* 入口卡片通用样式 */
.entry-card {
    display: flex;
    align-items: center;
    border-radius: 16rpx;
    padding: 24rpx 20rpx;
    background-color: #ffffff;
    border: 2rpx solid #e0e0e0;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;

    /* 点击效果 */
    &:active {
        transform: scale(0.98);
        box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.12);
    }

    /* hover效果（触摸设备上的轻微变化） */
    &:hover {
        box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
        // border-color: #4CAF50;
    }

    /* 主色调卡片 - 官方选择指标 */
    &.primary {
        // border-color: #4CAF50;

        &:hover {
            border-color: #2E7D32;
            box-shadow: 0 8rpx 32rpx rgba(76, 175, 80, 0.2);
        }

        // .entry-icon {
        //     background: linear-gradient(135deg, #4CAF50, #2E7D32);
        // }

        .entry-title {
            color: #2E7D32;
        }

        .entry-arrow uni-icons {
            color: #4CAF50 !important;
        }
    }

    /* 副色调卡片 - 自主添加指标 */
    &.secondary {
        // border-color: #66BB6A;

        &:hover {
            border-color: #388E3C;
            box-shadow: 0 8rpx 32rpx rgba(102, 187, 106, 0.2);
        }

        // .entry-icon {
        //     background: linear-gradient(135deg, #66BB6A, #388E3C);
        // }

        .entry-title {
            color: #388E3C;
        }

        .entry-arrow uni-icons {
            color: #66BB6A !important;
        }
    }

    /* 第三色调卡片 - 我的填写记录 */
    &.tertiary {
        // border-color: #26A69A;

        &:hover {
            border-color: #00695C;
            box-shadow: 0 8rpx 32rpx rgba(38, 166, 154, 0.2);
        }

        .entry-icon-large {
            background: linear-gradient(135deg, #26A69A, #00695C);
        }

        .entry-title-large {
            color: #00695C;
        }

        .entry-arrow uni-icons {
            color: #26A69A !important;
        }
    }

    /* 小卡片样式 */
    &.small {
        padding: 20rpx 16rpx;
        height: 132rpx;
        /* 固定高度，保证两个小卡片总高度等于大卡片 */

        .entry-icon {
            width: 48rpx;
            height: 48rpx;
            margin-right: 12rpx;
        }

        .entry-content {
            .entry-title {
                font-size: 26rpx;
                font-weight: 600;
                margin-bottom: 4rpx;
            }

            .entry-subtitle {
                font-size: 20rpx;
                opacity: 0.9;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .entry-arrow {
            margin-left: 8rpx;
        }
    }

    /* 大卡片样式 */
    &.large {
        padding: 24rpx 20rpx;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .entry-icon-large {
            width: 64rpx;
            height: 64rpx;
            margin-right: 16rpx;
        }

        .entry-content-large {
            flex: 1;

            .entry-title-large {
                font-size: 30rpx;
                font-weight: 600;
                margin-bottom: 8rpx;
            }

            .entry-subtitle-large {
                font-size: 24rpx;
                opacity: 0.9;
                line-height: 1.4;
            }
        }

        .entry-arrow {
            margin-left: 12rpx;
        }
    }
}

/* 入口图标容器 */
.entry-icon {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

    .icon-image {
        width: 36rpx;
        height: 36rpx;
    }
}

/* 大卡片图标容器 */
.entry-icon-large {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

    .icon-image-large {
        width: 40rpx;
        height: 40rpx;
    }
}

/* 入口内容区域 */
.entry-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* 大卡片内容区域 */
.entry-content-large {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* 入口主标题 */
.entry-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 4rpx;
    line-height: 1.4;
}

/* 大卡片主标题 */
.entry-title-large {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 4rpx;
    line-height: 1.4;
}

/* 入口副标题 */
.entry-subtitle {
    font-size: 22rpx;
    color: #666666;
    line-height: 1.5;
}

/* 大卡片副标题 */
.entry-subtitle-large {
    font-size: 26rpx;
    color: #666666;
    line-height: 1.5;
}

/* 入口箭头 */
.entry-arrow {
    margin-left: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}



/* 卡片图标容器 */
.card-icon {
    width: 80rpx;
    height: 80rpx;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
    box-shadow: 0 4rpx 8rpx rgba(76, 175, 80, 0.3);
}

/* 卡片内容区域 */
.card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* 卡片主标题 */
.card-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 8rpx;
    line-height: 1.4;
}

/* 卡片副标题 */
.card-subtitle {
    font-size: 26rpx;
    color: #888888;
    line-height: 1.5;
}

/* 卡片箭头 */
.card-arrow {
    margin-left: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 健康指标区域样式 */
.indicator-section {
    margin-top: 16rpx;
}

/* 标题和操作区域 */
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    padding: 0 8rpx;
}

.section-title {
    display: flex;
    align-items: center;
}

.title-text {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    margin-left: 12rpx;
}

.section-actions {
    display: flex;
    gap: 16rpx;
}

/* 选择状态提示 */
.selection-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16rpx 20rpx;
    background-color: #ffffff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
    margin: 0 24rpx 16rpx 24rpx;
}

.status-info {
    display: flex;
    align-items: center;
}

.status-text {
    font-size: 28rpx;
    font-weight: 600;
    color: #333333;
    margin-left: 8rpx;
}

.batch-record-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6rpx;
    padding: 8rpx 16rpx;
    border-radius: 24rpx;
    font-size: 24rpx;
    font-weight: 500;
    color: #ffffff;
    background-color: #4CAF50;
    box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.3);
    transition: background-color 0.3s ease;

    &:active {
        background-color: #45a049;
    }
}

/* 操作按钮样式 */
.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6rpx;
    padding: 8rpx 16rpx;
    border-radius: 24rpx;
    font-size: 24rpx;
    font-weight: 500;
    color: #ffffff;
    background-color: #4CAF50;
    box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.3);
    transition: background-color 0.3s ease;

    &:active {
        background-color: #45a049;
    }

    &.select-btn {
        background: linear-gradient(135deg, #4CAF50, #45a049);
    }

    &.clear-btn {
        background: linear-gradient(135deg, #FF9800, #F57C00);
    }

    &.cancel-btn {
        background: linear-gradient(135deg, #F44336, #D32F2F);
    }
}

.btn-text {
    font-size: 24rpx;
    font-weight: 500;
}

/* 分类包装器 */
.category-wrapper {
    margin-bottom: 32rpx;
}

/* 分类标题区域 */
.category-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 20rpx;
    background: #ffffff;
    border-radius: 16rpx 16rpx 0 0;
    border-bottom: 2rpx solid #f0f0f0;
}

.category-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #333333;
}

.category-count {
    font-size: 24rpx;
    color: #888888;
    background: #f5f5f5;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
}

/* 指标卡片 */
.indicator-card {
    display: flex;
    align-items: center;
    padding: 24rpx 20rpx;
    border-bottom: 2rpx solid #f8f8f8;
    transition: background-color 0.3s ease;

    &:last-child {
        border-bottom: none;
    }

    &:active {
        background-color: #f8f8f8;
    }

    /* 选择模式下的样式 */
    &.selection-mode {
        background-color: #f0f8f0;
        /* 浅绿色背景 */
        border-bottom: 2rpx solid #e0f0e0;
        /* 浅灰色边框 */
    }

    /* 已选择状态 */
    &.selected {
        background-color: #e8f5e9;
        /* 更深的浅绿色背景 */
        border-bottom: 2rpx solid #a5d6a7;
        /* 更深的浅绿色边框 */
    }
}

/* 选择状态指示器 */
.selection-indicator {
    position: absolute;
    top: 24rpx;
    left: 20rpx;
    z-index: 1;
}

.checkbox {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    border: 2rpx solid #4CAF50;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;

    &.checked {
        background-color: #4CAF50;
        border-color: #4CAF50;
    }
}

/* 指标图标容器 */
.indicator-icon {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f8f0;
    border-radius: 16rpx;
    margin-right: 20rpx;
}

.icon-image {
    width: 60rpx;
    height: 60rpx;
    border-radius: 12rpx;
}

/* 指标信息区域 */
.indicator-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.indicator-name {
    font-size: 28rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 8rpx;
    line-height: 1.4;
}

.indicator-threshold {
    font-size: 24rpx;
    color: #4CAF50;
    margin-bottom: 6rpx;
    font-weight: 500;
}

.indicator-content {
    font-size: 22rpx;
    color: #666666;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 指标箭头 */
.indicator-arrow {
    margin-left: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 空状态样式 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;
    text-align: center;
}

.empty-icon {
    margin-bottom: 24rpx;
    opacity: 0.6;
}

.empty-text {
    font-size: 32rpx;
    font-weight: 500;
    color: #666666;
    margin-bottom: 12rpx;
}

.empty-subtitle {
    font-size: 26rpx;
    color: #999999;
    line-height: 1.5;
}

/* 指标网格布局 */
.indicators-grid {
    background: #ffffff;
    border-radius: 0 0 16rpx 16rpx;
    overflow: hidden;
}
</style>