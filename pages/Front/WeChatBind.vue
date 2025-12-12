<template>
    <view>
        <!-- 顶部导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" title="微信绑定" />

        <!-- 主体内容 -->
        <view class="container">
            <!-- 微信图标和标题 -->
            <view class="header-section">
                <uni-icons type="weixin" size="80" color="#07c160"></uni-icons>
                <text class="title">微信绑定</text>
                <text class="subtitle">绑定微信账号，享受更便捷的登录体验</text>
            </view>

            <!-- 绑定状态卡片 -->
            <view class="status-card">
                <view class="status-header">
                    <text class="status-title">绑定状态</text>
                    <uni-badge :text="bindStatus" :type="isWechatBound ? 'success' : 'warning'" size="normal">
                    </uni-badge>
                </view>

                <!-- OpenId 显示 -->
                <view class="openid-section" v-if="OpenId">
                    <text class="openid-label">微信OpenId:</text>
                    <text class="openid-value">{{ maskedOpenId }}</text>
                </view>

                <!-- 绑定信息 -->
                <view class="bind-info" v-if="isWechatBound">
                    <text class="bind-status">✅ 微信账号已绑定</text>
                </view>
            </view>

            <!-- 操作按钮 -->
            <view class="action-section">
                <button v-if="!isWechatBound" class="bind-btn" type="primary" size="default" :loading="isBinding"
                    :disabled="isBinding" @click="BindWechatApi">
                    {{ isBinding ? '绑定中...' : '绑定微信' }}
                </button>

                <button v-else class="unbind-btn" type="warn" size="default" :loading="isUnbinding"
                    @click="UnbindWechatApi">
                    {{ isUnbinding ? '解绑中...' : '解绑微信' }}
                </button>
            </view>

            <!-- 提示信息 -->
            <view class="tips-section">
                <uni-card :is-shadow="false" spacing="0">
                    <text slot="title" class="tips-title">温馨提示</text>
                    <view class="tips-content">
                        <view class="tip-item">
                            <uni-icons type="info-filled" size="16" color="#909399"></uni-icons>
                            <text>绑定后可使用微信快速登录</text>
                        </view>
                        <view class="tip-item">
                            <uni-icons type="info-filled" size="16" color="#909399"></uni-icons>
                            <text>解绑后将无法使用微信登录</text>
                        </view>
                        <view class="tip-item" v-if="!OpenId">
                            <uni-icons type="info-filled" size="16" color="#f56c6c"></uni-icons>
                            <text>需要先获取微信OpenId才能进行绑定</text>
                        </view>
                    </view>
                </uni-card>
            </view>
        </view>
    </view>
</template>

<script setup>

import { useCommonStore } from '@/store';
import { Post } from "@/utils/http";
import { onLoad, onReady, onShow } from "@dcloudio/uni-app";
import { computed, nextTick, reactive, ref } from 'vue';

// 获取store
const commonStore = useCommonStore();
const Token = computed(() => commonStore.Token)
const UserInfo = computed(() => commonStore.UserInfo)
const RoleType = computed(() => commonStore.RoleType)
const UserId = computed(() => commonStore.UserId)
const OpenId = computed(() => commonStore.UserInfo.OpenId)

// 响应式数据
const isBinding = ref(false);
const isUnbinding = ref(false);

// 计算属性
const isWechatBound = computed(() => {
    // 根据UserInfo中是否有OpenId来判断是否已绑定微信
    return OpenId.value && OpenId.value.trim() !== '';
});

const bindStatus = computed(() => {
    return isWechatBound.value ? '已绑定' : '未绑定';
});

const maskedOpenId = computed(() => {
    if (!OpenId.value) return '';
    const openId = OpenId.value;
    if (openId.length <= 8) return openId;

    // 显示前4位和后4位，中间用****替换
    const start = openId.substring(0, 4);
    const end = openId.substring(openId.length - 4);
    return `${start}****${end}`;
});

// 移除formatBindTime，因为我们只需要判断OpenId是否存在

// 生命周期钩子
onLoad(async (option) => {
    // 页面加载时可以刷新用户信息
    await commonStore.GetInfo();
});

onShow(async () => {
    // 页面显示时的逻辑
});

onReady(async () => {

});

const BindWechatApi = async () => {
    console.log('BindWechatApi', UserId.value);
    isBinding.value = true;
    //调用uniapp的微信登录接口 获取code
    uni.login({
        "provider": "weixin",
        "onlyAuthorize": true, // 微信登录仅请求授权认证
        success: async (res) => {

            const { Data } = await Post(`/User/BindWechat`, { WxCode: res.code, Id: UserId.value });
            //刷新store的getUserInfo
            await commonStore.GetInfo();
            isBinding.value = false;
        },
        fail: (res) => {
            isBinding.value = false;
            console.log(res);
        }
    });


}

const UnbindWechatApi = async () => {
    // 显示确认对话框

    uni.showModal({
        title: '确认解绑',
        content: '解绑后将无法使用微信快速登录，确定要解绑吗？',
        success: async (res) => {

            const { Data } = await Post(`/User/UnbindWechat`, { Id: UserId.value });
            //刷新store的getUserInfo
            await commonStore.GetInfo();
        }
    });



}




// 方法
const goBack = () => {
    uni.navigateBack();
};

</script>

<style scoped lang="scss">
.container {
    padding: 20upx;
    background-color: #f5f5f5;
    min-height: 100vh;
}

/* 头部区域样式 */
.header-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60upx 0 40upx 0;
    background-color: #fff;
    border-radius: 20upx;
    margin-bottom: 30upx;

    .title {
        font-size: 36upx;
        font-weight: bold;
        color: #333;
        margin-top: 20upx;
    }

    .subtitle {
        font-size: 28upx;
        color: #666;
        margin-top: 10upx;
        text-align: center;
    }
}

/* 状态卡片样式 */
.status-card {
    background-color: #fff;
    border-radius: 20upx;
    padding: 30upx;
    margin-bottom: 30upx;

    .status-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20upx;

        .status-title {
            font-size: 32upx;
            font-weight: bold;
            color: #333;
        }
    }

    .openid-section {
        margin-bottom: 20upx;

        .openid-label {
            font-size: 28upx;
            color: #666;
            display: block;
            margin-bottom: 10upx;
        }

        .openid-value {
            font-size: 30upx;
            color: #333;
            font-family: monospace;
            background-color: #f8f9fa;
            padding: 15upx 20upx;
            border-radius: 10upx;
            display: block;
        }
    }

    .bind-info {
        .bind-status {
            font-size: 28upx;
            color: #07c160;
            font-weight: 500;
        }
    }
}

/* 操作按钮样式 */
.action-section {
    margin-bottom: 30upx;

    .bind-btn,
    .unbind-btn {
        width: 100%;
        height: 88upx;
        border-radius: 44upx;
        font-size: 32upx;
        font-weight: bold;
    }

    .bind-btn {
        background: linear-gradient(135deg, #07c160, #06ad56);
        border: none;
    }

    .unbind-btn {
        background: linear-gradient(135deg, #f56c6c, #e85656);
        border: none;
    }
}

/* 提示信息样式 */
.tips-section {
    .tips-title {
        font-size: 30upx;
        font-weight: bold;
        color: #333;
    }

    .tips-content {
        .tip-item {
            display: flex;
            align-items: center;
            margin-bottom: 15upx;
            font-size: 26upx;
            color: #666;

            uni-icons {
                margin-right: 10upx;
                flex-shrink: 0;
            }

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>