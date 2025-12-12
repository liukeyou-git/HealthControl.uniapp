<template>
	<view class="register-container">
		<!-- 健康主题背景 -->
		<view class="bg-decoration">
			<view class="health-circle health-circle-1"></view>
			<view class="health-circle health-circle-2"></view>
		</view>

		<!-- 顶部Logo和标题区域 -->
		<view class="header-section">
			<view class="logo-wrapper">
				<view class="health-icon">🏥</view>
			</view>
			<text class="app-title">用户注册</text>
			<text class="app-subtitle">加入我们，开启健康管理之旅</text>
		</view>

		<!-- 注册表单区域 -->
		<view class="form-section">
			<view class="form-container">
				<form class="register-form">
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

					<!-- 手机号输入框 -->
					<view class="form-group">
						<view class="input-wrapper">
							<view class="input-icon">📱</view>
							<input type="text" v-model="formData.PhoneNumber" placeholder="请输入手机号" class="form-input" />
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

					<!-- 注册按钮 -->
					<button class="register-button" @click="Register">
						<text class="button-text">立即注册</text>
					</button>

					<!-- 底部操作链接 -->
					<view class="action-links">
						<text class="link-text" @click="ToLogin">已有账号？立即登录</text>
					</view>
				</form>

				<!-- 注册说明 -->
				<view class="register-tips">
					<view class="tips-title">注册说明：</view>
					<view class="tips-item">• 注册即表示您同意我们的服务条款</view>
					<view class="tips-item">• 请确保手机号真实有效，用于账户安全验证</view>
					<view class="tips-item">• 我们将保护您的个人隐私信息</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { GetLoginCode } from "@/utils/comm";
import { Post } from "@/utils/http";
import { reactive, ref } from 'vue';
import { onLoad, onShow, onHide, onUnload } from "@dcloudio/uni-app";

// 响应式数据
const formData = reactive({
	UserName: "",
	Password: "",
	RoleType: "2",
	PhoneNumber: "",
	Name: ""
})

const RoleTypeList = ref([])

// 获取角色列表
const GetRoleTypeListApi = async () => {
	const { Data: { Items } } = await Post("/Select/RoleType")
	RoleTypeList.value = Items.filter(item => item.Code != 1).map(item => ({
		text: item.Name,
		value: item.Code
	}))
}

// 注册方法
const Register = async () => {
	if (!formData.UserName) {
		uni.showToast({
			title: "请输入账户",
			icon: "none"
		})
		return
	}
	if (!formData.Password) {
		uni.showToast({
			title: "请输入密码",
			icon: "none"
		})
		return
	}

	if (!formData.PhoneNumber) {
		uni.showToast({
			title: "请输入手机号",
			icon: "none"
		})
		return
	}
	formData.Name = Math.random().toString(36).substring(2, 15);


	//正则表达式
	if (!/^\d{11}$/.test(formData.PhoneNumber)) {
		uni.showToast({
			title: "请输入正确的手机号",
			icon: "none"
		})
		return
	}

	let WxCode = null
	await GetLoginCode().then(code => {
		WxCode = code
	})

	const { Data, Success } = await Post("/User/Register", {
		...formData,
		WxCode
	})

	if (Success) {
		Object.assign(formData, {
			UserName: "",
			Password: "",
			RoleType: "2",
			Name: "",
			PhoneNumber: ""
		})

		uni.redirectTo({
			url: "/pages/Front/Login"
		})
	}
}

// 去登录
const ToLogin = () => {
	uni.redirectTo({
		url: "/pages/Front/Login"
	})
}

// 生命周期钩子
onLoad(() => {
	GetRoleTypeListApi()
})
</script>

<style scoped>
/* 全局页面样式 */
page {
	background-color: #f8fffe;
}

/* 注册容器 - 健康主题背景 */
.register-container {
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
	padding: 100rpx 0 60rpx;
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
.register-form {
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

/* 注册按钮 */
.register-button {
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

.register-button:active {
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
	justify-content: center;
	align-items: center;
	margin-top: 30rpx;
	padding: 0 8rpx;
}

.link-text {
	font-size: 28rpx;
	color: #10b981;
	font-weight: 500;
	transition: color 0.3s ease;
}

.link-text:active {
	color: #065f46;
}

/* 注册说明区域 */
.register-tips {
	margin-top: 50rpx;
	padding: 30rpx;
	background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
	border-radius: 16rpx;
	border: 1px solid rgba(16, 185, 129, 0.1);
}

.tips-title {
	font-size: 28rpx;
	color: #065f46;
	font-weight: 600;
	margin-bottom: 20rpx;
}

.tips-item {
	font-size: 24rpx;
	color: #374151;
	line-height: 2;
	opacity: 0.8;
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
		padding: 80rpx 0 50rpx;
	}

	.health-icon {
		font-size: 100rpx;
	}

	.app-title {
		font-size: 42rpx;
	}
}</style>