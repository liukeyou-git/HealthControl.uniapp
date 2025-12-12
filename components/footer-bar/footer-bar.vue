<template>
	<view class="footer-bar" :style="{ height: `${tabbarHeight}px`, paddingBottom: `${safeAreaBottom}px` }">

		<template v-for="(item, index) in footerBarList" :key="index">
			<view class="footer-item" :class="{ 'footer-item-active': currentIndex === index }" @click="skip(item.url)">
				<view class="footer-icon-wrapper">
					<image :src="item.icon" class="footer-icon" :class="{ 'footer-icon-active': currentIndex === index }">
					</image>

				</view>
				<text class="footer-label" :class="{ 'footer-label-active': currentIndex === index }">{{ item.label
				}}</text>
			</view>
		</template>
	</view>
</template>

<script>
import { useCommonStore } from '@/store';
import { computed, onMounted, ref } from 'vue';

export default {
	name: 'fb',
	options: {
		// 在微信小程序中将组件节点渲染为虚拟节点
		virtualHost: true,
		// 使其成为纯数据组件
		pureDataPattern: /^_/
	},
	setup() {
		// 获取store
		const store = useCommonStore();

		// 定义响应式数据
		const currentIndex = ref(0)
		const tabbarHeight = ref(50) // 默认底部导航栏高度
		const safeAreaBottom = ref(0) // 安全区域底部高度

		// 从store获取数据
		const footerBarList = computed(() => store.FooterBarList)

		// 生命周期钩子
		onMounted(() => {
	
			let pages = getCurrentPages()
			let currentPageRoute = pages[pages.length - 1].route
			let mapFooterBarList = footerBarList.value.map(x => x.url.replace('/', ''))
			let position = mapFooterBarList.indexOf(currentPageRoute)
			currentIndex.value = position

			// 获取系统信息
			getSystemInfo()
		})

		// 获取系统信息并设置底部安全区域
		const getSystemInfo = () => {
			uni.getSystemInfo({
				success: (res) => {
					// 基础底部导航栏高度
					const baseHeight = 50

					// 判断是否为iOS设备
					const isIOS = res.platform === 'ios'

					// 获取安全区域
					if (res.safeArea) {
						// 计算底部安全区域高度
						safeAreaBottom.value = res.screenHeight - res.safeArea.bottom
					}

					// 设置底部导航栏高度（基础高度）
					tabbarHeight.value = baseHeight

					// 如果是iPhone并且有底部安全区域（刘海屏）
					if (isIOS && safeAreaBottom.value > 0) {
						// 不需要额外增加tabbarHeight，因为我们使用paddingBottom来适配安全区域
					} else if (!isIOS) {
						// 安卓设备可能需要轻微调整
						safeAreaBottom.value = Math.max(safeAreaBottom.value, 8)
					}
				}
			})
		}

		// 方法
		const skip = (url) => {
			uni.redirectTo({
				url: url
			})
		}

		return {
			currentIndex,
			tabbarHeight,
			safeAreaBottom,
			footerBarList,
			skip
		}
	}
}
</script>

<style lang="scss" scoped>
/* 底部导航栏容器 */
.footer-bar {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
	background-color: var(--bg-color);
	box-shadow: var(--box-shadow-sm);
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
	border-top: 1upx solid var(--border-color-lighter);
	box-sizing: content-box;
	/* 确保padding不影响总高度计算 */
}

/* 底部导航项 */
.footer-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex: 1;
	height: 100%;
	transition: var(--transition-base);
	position: relative;
	padding: var(--spacing-xs) 0;

	/* 点击效果 */
	&:active {
		opacity: var(--opacity-medium);
		transform: scale(0.98);
	}

	/* 图标包装器 */
	.footer-icon-wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: var(--spacing-xs);

		/* 图标样式 */
		.footer-icon {
			width: var(--img-size-sm);
			height: var(--img-size-sm);
			transition: var(--transition-base);
			opacity: 0.8;
		}

		/* 激活状态的图标 */
		.footer-icon-active {
			opacity: 1;
			transform: scale(1.1);
		}


	}

	/* 标签文字 */
	.footer-label {
		font-size: var(--font-size-sm);
		color: var(--text-color-light);
		transition: var(--transition-base);
		line-height: 1.2;
	}

	/* 激活状态的标签 */
	.footer-label-active {
		color: var(--primary-color);
		font-weight: 500;
		font-size: var(--font-size-base);
	}
}

/* 动画效果 */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: scale(0);
	}

	to {
		opacity: 1;
		transform: scale(1);
	}
}
</style>