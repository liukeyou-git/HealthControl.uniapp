<template>
    <view class="login-container">
        <!-- 健康主题背景 -->
        <view class="bg-decoration">
            <view class="health-circle health-circle-1"></view>
            <view class="health-circle health-circle-2"></view>
        </view>

        <!-- 顶部Logo和标题区域 -->
        <view class="header-section">
            <view class="logo-wrapper">
                <view class="health-icon">🩺</view>
            </view>
            <text class="app-title">健康管理</text>
            <text class="app-subtitle">守护您的健康每一天</text>
        </view>

        <!-- 登录表单区域 -->
        <view class="form-section">
            <view class="form-container">
                <form class="login-form">
                    <!-- 用户名输入框 -->
                    <view class="form-group">
                        <view class="input-wrapper">
                            <view class="input-icon">👤</view>
                            <input type="text" v-model="formData.UserName" placeholder="请输入用户名" class="form-input" />
                        </view>
                    </view>

                    <!-- 密码输入框 -->
                    <view class="form-group">
                        <view class="input-wrapper">
                            <view class="input-icon">🔒</view>
                            <input type="password" v-model="formData.Password" placeholder="请输入密码" class="form-input"
                                password="true" />
                        </view>
                    </view>

                    <!-- 用户角色选择 -->
                    <view class="form-group">
                        <view class="role-wrapper">
                            <text class="role-label">用户角色</text>
                            <uni-data-checkbox v-model="formData.RoleType" :localdata="RoleTypeList"
                                class="role-checkbox" />
                        </view>
                    </view>

                    <!-- 登录按钮 -->
                    <button class="login-button" @click="Login">
                        <text class="button-text">登录</text>
                    </button>

                    <!-- 底部操作链接 -->
                    <view class="action-links">
                        <text class="link-text" @click="ForgetPassword">忘记密码？</text>
                        <text class="link-text register-text" @click="Reg">立即注册</text>
                    </view>
                </form>

                <!-- 其他登录方式 -->
                <view class="other-login-section">
                    <view class="divider-line">
                        <text class="divider-text">其他登录方式</text>
                    </view>
                    <view class="login-methods">
                        <view class="login-method" @click="otherLogin(0)">
                            <view class="method-icon-bg">
                                <image class="method-icon" src="/assets/wx.png"></image>
                            </view>
                            <text class="method-label">微信登录</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { useCommonStore } from "@/store";
import { Post } from "@/utils/http";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from 'vue';


// 响应式数据
const formData = ref({
    UserName: "",
    Password: "",
    RoleType: "2"
})
const RoleTypeList = ref([])
const commonStore = useCommonStore()


// 获取角色列表
const GetRoleTypeListApi = async () => {
    const { Data: { Items } } = await Post("/Select/RoleType")
    RoleTypeList.value = Items.filter(item => item.Code != 1).map(item => ({
        text: item.Name,
        value: item.Code
    }))
    console.log(RoleTypeList.value)
}

// 登录方法
const Login = async () => {
    if (!formData.value.UserName) {
        uni.showToast({
            title: "请输入账户",
            icon: "none"
        })
        return
    }
    if (!formData.value.Password) {
        uni.showToast({
            title: "请输入密码",
            icon: "none"
        })
        return
    }

    const { Data, Success } = await commonStore.Login(formData.value)

    if (Success) {
        await commonStore.GetInfo()
        uni.reLaunch({
            url: "/pages/Front/Index"
        })
    }
}

// 忘记密码
const ForgetPassword = () => {
    uni.redirectTo({
        url: "/pages/Front/ForgetPassword"
    })
}

// 注册方法
const Reg = () => {
    uni.redirectTo({
        url: "/pages/Front/Register"
    })
}

// 其他登录方式
const otherLogin = async (type) => {
    if (type == 0) {
        // #ifdef H5
        uni.$comm.ShowToast("H5不支持微信登录")
        return
        // #endif
        uni.$comm.ShowLoading("正在登录中~")
        let WxCode = null

        await uni.$comm.GetLoginCode().then(code => {
            WxCode = code
        })

        const { Data, Success } = await store.dispatch("Userlogin", {
            WxCode: WxCode,
        })

        uni.hideLoading()
        if (Success) {
            await store.dispatch("UserInfoByToken", {})
            uni.reLaunch({
                url: "/pages/Front/Index"
            })
        }
    } else {
        uni.$comm.ShowToast("该方式还未实现,尽情期待！")
    }
}


onLoad(() => {
    GetRoleTypeListApi()
})
</script>

<style scoped>
/* 全局页面样式 */
page {
    background-color: #f8fffe;
}

/* 登录容器 - 健康主题背景 */
.login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #e8f8f5 0%, #f0fdf4 50%, #ffffff 100%);
    position: relative;
    overflow: hidden;
}

/* 健康主题背景装饰 */
.bg-decoration {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
}

.health-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.08;
    background: linear-gradient(45deg, #10b981, #34d399);
}

.health-circle-1 {
    width: 500rpx;
    height: 500rpx;
    top: -150rpx;
    right: -150rpx;
    animation: gentle-float 15s ease-in-out infinite;
}

.health-circle-2 {
    width: 300rpx;
    height: 300rpx;
    bottom: -100rpx;
    left: -100rpx;
    animation: gentle-float 20s ease-in-out infinite reverse;
}

/* 顶部标题区域 */
.header-section {
    padding: 120rpx 0 80rpx;
    text-align: center;
    position: relative;
    z-index: 1;
}

.logo-wrapper {
    margin-bottom: 40rpx;
}

.health-icon {
    font-size: 120rpx;
    background: linear-gradient(135deg, #10b981, #34d399);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 4rpx 8rpx rgba(16, 185, 129, 0.2));
}

.app-title {
    display: block;
    font-size: 48rpx;
    font-weight: 600;
    color: #065f46;
    margin-bottom: 16rpx;
    letter-spacing: 2rpx;
}

.app-subtitle {
    display: block;
    font-size: 28rpx;
    color: #6b7280;
    opacity: 0.8;
}

/* 表单区域 */
.form-section {
    position: relative;
    z-index: 1;
    padding: 0 40rpx;
}

.form-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 60rpx 40rpx;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.8);
}

/* 表单样式 */
.login-form {
    width: 100%;
}

.form-group {
    margin-bottom: 40rpx;
}

.input-wrapper {
    display: flex;
    align-items: center;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12rpx;
    padding: 0 24rpx;
    transition: all 0.3s ease;
}

.input-wrapper:focus-within {
    border-color: #10b981;
    background: #ffffff;
    box-shadow: 0 0 0 3rpx rgba(16, 185, 129, 0.1);
}

.input-icon {
    font-size: 32rpx;
    color: #6b7280;
    margin-right: 16rpx;
}

.form-input {
    flex: 1;
    height: 88rpx;
    font-size: 32rpx;
    color: #374151;
    background: transparent;
    border: none;
}

.form-input::placeholder {
    color: #9ca3af;
}

/* 角色选择区域 */
.role-wrapper {
    padding: 24rpx;
    background: #f9fafb;
    border-radius: 12rpx;
    border: 1px solid #e5e7eb;
}

.role-label {
    display: block;
    font-size: 28rpx;
    color: #374151;
    margin-bottom: 16rpx;
    font-weight: 500;
}

.role-checkbox {
    width: 100%;
}

/* 登录按钮 */
.login-button {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #10b981, #34d399);
    border: none;
    border-radius: 44rpx;
    margin: 40rpx 0 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 24rpx rgba(16, 185, 129, 0.3);
    transition: all 0.3s ease;
}

.login-button:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.2);
}

.button-text {
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
    letter-spacing: 2rpx;
}

/* 底部操作链接 */
.action-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30rpx;
    padding: 0 8rpx;
}

.link-text {
    font-size: 28rpx;
    color: #6b7280;
    transition: color 0.3s ease;
}

.register-text {
    color: #10b981;
    font-weight: 500;
}

.link-text:active {
    color: #10b981;
}

/* 其他登录方式 */
.other-login-section {
    margin-top: 60rpx;
    text-align: center;
}

.divider-line {
    position: relative;
    margin-bottom: 40rpx;
}

.divider-line::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1rpx;
    background: #e5e7eb;
}

.divider-text {
    display: inline-block;
    background: rgba(255, 255, 255, 0.95);
    padding: 0 20rpx;
    font-size: 24rpx;
    color: #9ca3af;
    position: relative;
    z-index: 1;
}

.login-methods {
    display: flex;
    justify-content: center;
}

.login-method {
    text-align: center;
    padding: 20rpx;
}

.method-icon-bg {
    width: 80rpx;
    height: 80rpx;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
    border: 1px solid #f3f4f6;
    transition: all 0.3s ease;
}

.method-icon-bg:active {
    transform: scale(0.95);
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.method-icon {
    width: 40rpx;
    height: 40rpx;
}

.method-label {
    font-size: 24rpx;
    color: #6b7280;
    display: block;
}

/* 动画效果 */
@keyframes gentle-float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-30rpx) rotate(3deg);
    }
}

/* 响应式适配 */
@media (max-width: 750rpx) {
    .form-container {
        margin: 0 20rpx;
        padding: 50rpx 30rpx;
    }

    .header-section {
        padding: 100rpx 0 60rpx;
    }

    .health-icon {
        font-size: 100rpx;
    }

    .app-title {
        font-size: 42rpx;
    }
}</style>