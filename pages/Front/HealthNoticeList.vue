<template>
    <view class="container">
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" title="健康提醒" />

        <!-- 内容区域 -->
        <view class="content">
            <!-- 健康提醒列表 -->
            <view class="notice-list" v-if="HealthNoticeList.length > 0">
                <view v-for="item in HealthNoticeList" :key="item.Id" class="notice-card" @click="goToEdit(item.Id)">
                    <!-- 卡片头部 -->
                    <view class="card-header">
                        <view class="title-row">
                            <view class="title-with-icon">
                                <uni-icons type="heart-filled" size="16" color="var(--primary-color)"></uni-icons>
                                <text class="notice-title">{{ item.Title }}</text>
                            </view>
                            <view class="status-badge" :class="{
                                'status-active': item.IsRemind == true,
                                'status-expired': item.IsRemind == false,
                                'status-pending': item.IsRemind == null
                            }">
                                {{ item.IsRemind ? '已提醒' : '未提醒' }}
                            </view>
                        </view>
                        <text class="notice-content">{{ item.Content }}</text>
                    </view>

                    <!-- 卡片信息 -->
                    <view class="card-info">
                        <view class="info-row">
                            <uni-icons type="calendar" size="14" color="var(--primary-color)"></uni-icons>
                            <text class="info-text">{{ formatDateTime(item.RemindTime) }}</text>
                        </view>
                        <view class="info-row">
                            <uni-icons type="notification" size="14" color="var(--primary-color)"></uni-icons>
                            <text class="info-text">{{ item.RemindType }}</text>
                        </view>
                    </view>

                    <!-- 操作按钮 -->
                    <view class="card-actions" @click.stop="">
                        <button class="action-btn edit-btn" size="mini" v-if="item.IsRemind == false"
                            @click="goToEdit(item.Id)">
                            <uni-icons type="compose" size="14" color="white"></uni-icons>
                        </button>
                        <button class="action-btn delete-btn" size="mini" @click="ShowDeleteModal(item.Id)">
                            <uni-icons type="trash" size="14" color="white"></uni-icons>
                        </button>
                    </view>
                </view>
            </view>

            <!-- 空数据提示 -->
            <view class="empty-state" v-else>
                <view class="empty-icon">
                    <uni-icons type="heart" size="80" color="var(--primary-color)"></uni-icons>
                </view>
                <text class="empty-title">暂无健康提醒</text>
                <text class="empty-desc">开始管理您的健康生活吧</text>
            </view>
        </view>

        <!-- 悬浮添加按钮 -->
        <view class="fab-button" @click="goToAdd">
            <uni-icons type="plus" size="24" color="white"></uni-icons>
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

// 健康提醒列表数据
const HealthNoticeList = ref([]);

// 查询条件
const where = reactive({
    PageIndex: 1,
    PageSize: 100
});

// 生命周期钩子
onLoad(async (option) => {
});

onShow(async () => {
    GetHealthNoticeListApi();
});

onReady(async () => {

});

// 方法
const goBack = () => {
    uni.navigateBack();
};

// 跳转到添加页面
const goToAdd = () => {
    uni.navigateTo({
        url: '/pages/Front/HealthNoticeForm'
    });
};

// 跳转到编辑页面
const goToEdit = (Id) => {
    uni.navigateTo({
        url: `/pages/Front/HealthNoticeForm?Id=${Id}`
    });
};

// 获取健康提醒列表
const GetHealthNoticeListApi = async () => {
    try {
        let {
            Data: {
                Items
            }
        } = await Post('/HealthNotice/List', where);
        HealthNoticeList.value = Items || [];
    } catch (error) {
        console.error('获取健康提醒列表失败:', error);
        HealthNoticeList.value = [];
    }
}

// 删除
const ShowDeleteModal = async (Id) => {
    uni.showModal({
        title: '确认删除',
        content: '确认删除该健康提醒吗？',
        confirmText: '删除',
        confirmColor: 'var(--primary-color)',
        success: async (res) => {
            if (res.confirm) {
                try {
                    const { Success } = await Post(`/HealthNotice/Delete`, { Id: Id });
                    if (Success) {
                        await GetHealthNoticeListApi();
                        uni.showToast({
                            title: '删除成功',
                            icon: 'success'
                        });
                    }
                } catch (error) {
                    console.error('删除失败:', error);
                    uni.showToast({
                        title: '删除失败',
                        icon: 'error'
                    });
                }
            }
        }
    })
};

// 格式化日期时间
const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
};

// 获取状态文本
const getStatusText = (remindTime) => {
    if (!remindTime) return '待设置';
    const now = new Date();
    const remind = new Date(remindTime);

    if (remind <= now) {
        return '已过期';
    } else {
        return '待提醒';
    }
};


</script>

<style scoped lang="scss">
.container {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-lighter) 100%);
}

.content {
    padding: 10upx 24upx 40upx;
    /* 导航栏高度 + 内边距 */
}

/* 健康提醒列表样式 */
.notice-list {
    .notice-card {
        background: white;
        border-radius: 24upx;
        margin-bottom: 24upx;
        padding: 32upx;
        box-shadow: 0 8upx 32upx rgba(var(--primary-rgb), 0.12);
        position: relative;
        transition: all 0.3s ease;
        border: 2upx solid var(--primary-light);

        &:active {
            transform: scale(0.98);
        }

        .card-header {
            margin-bottom: 24upx;

            .title-row {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                margin-bottom: 16upx;

                .title-with-icon {
                    display: flex;
                    align-items: center;
                    gap: 12upx;
                    flex: 1;
                    margin-right: 16upx;
                }

                .notice-title {
                    font-size: 32upx;
                    font-weight: 600;
                    color: var(--primary-dark);
                    line-height: 1.3;
                }

                .status-badge {
                    padding: 8upx 16upx;
                    border-radius: 20upx;
                    font-size: 22upx;
                    font-weight: 500;

                    &.status-active {
                        background: var(--primary-light);
                        color: white;
                    }

                    &.status-expired {
                        background: #FFEBEE;
                        color: #E57373;
                    }

                    &.status-pending {
                        background: var(--primary-lighter);
                        color: var(--primary-dark);
                    }
                }
            }

            .notice-content {
                font-size: 28upx;
                color: var(--primary-dark);
                line-height: 1.5;
            }
        }

        .card-info {
            display: flex;
            gap: 32upx;
            margin-bottom: 24upx;

            .info-row {
                display: flex;
                align-items: center;
                gap: 8upx;

                .info-text {
                    font-size: 24upx;
                    color: var(--primary-color);
                    font-weight: 500;
                }
            }
        }

        .card-actions {
            display: flex;
            gap: 16upx;
            justify-content: flex-end;

            .action-btn {
                width: 64upx;
                height: 64upx;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: none;
                transition: all 0.3s ease;

                &:active {
                    transform: scale(0.9);
                }
            }

            .edit-btn {
                background: var(--primary-color);
                box-shadow: 0 4upx 16upx rgba(var(--primary-rgb), 0.3);
            }

            .delete-btn {
                background: #E57373;
                box-shadow: 0 4upx 16upx rgba(229, 115, 115, 0.3);
            }
        }
    }
}

/* 空数据状态 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120upx 40upx;
    text-align: center;

    .empty-icon {
        margin-bottom: 32upx;
        opacity: 0.7;
    }

    .empty-title {
        font-size: 36upx;
        color: var(--primary-dark);
        font-weight: 600;
        margin-bottom: 16upx;
    }

    .empty-desc {
        font-size: 28upx;
        color: var(--primary-color);
    }
}

/* 悬浮添加按钮 */
.fab-button {
    position: fixed;
    right: 40upx;
    bottom: 40upx;
    width: 120upx;
    height: 120upx;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 16upx 40upx rgba(var(--primary-rgb), 0.4);
    z-index: 100;
    transition: all 0.3s ease;

    &:active {
        transform: scale(0.9);
    }

    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        animation: pulse 2s infinite;
    }
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    70% {
        transform: scale(1.3);
        opacity: 0;
    }

    100% {
        transform: scale(1.3);
        opacity: 0;
    }
}
</style>
