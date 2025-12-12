<template>
	<view>
		<uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
			left-text="返回" @clickLeft="goBack" title="修改个人信息" />

		<uni-section title="请填写用户信息">
			<view class="form-container">
				<!-- 基础用法，不包含校验规则 -->
				<uni-forms ref="editModalForm" :model="formData" :rules="editModalFormRules" label-width='100'
					label-position='top'>
					<uni-forms-item label="名称" required name="Name">
						<uni-easyinput v-model="formData.Name" placeholder="请输入姓名" primaryColor="var(--primary-color)" />
					</uni-forms-item>
					<uni-forms-item label="邮箱" required name="Email">
						<uni-easyinput v-model="formData.Email" placeholder="请输入邮箱" primaryColor="var(--primary-color)" />
					</uni-forms-item>
					<uni-forms-item label="手机号码" required name="PhoneNumber">
						<uni-easyinput v-model="formData.PhoneNumber" placeholder="请输入手机号码"
							primaryColor="var(--primary-color)" />
					</uni-forms-item>
					<uni-forms-item label="出生时间" required name="Birth">
						<uni-datetime-picker type="datetime" return-type="string" v-model="formData.Birth"
							format="yyyy-MM-dd HH:mm:ss" primaryColor="var(--primary-color)" />
					</uni-forms-item>
					<uni-forms-item label="上传头像" name="ImageUrls">
						<upload-images :limit="1" v-model="formData.ImageUrls" />
					</uni-forms-item>
				</uni-forms>
				<button class="btn-primary" @click="createOrEditAsync">提交</button>
			</view>

		</uni-section>


	</view>
</template>

<script setup>

import { useCommonStore } from '@/store';
import { Post } from "@/utils/http";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { computed, reactive, ref } from 'vue';

// 获取store
const commonStore = useCommonStore();
const Token = computed(() => commonStore.Token)
const UserInfo = computed(() => commonStore.UserInfo)
const RoleType = computed(() => commonStore.RoleType)
const UserId = computed(() => commonStore.UserId)


// 表单数据和规则
const formData = reactive({
});
const editModalForm = ref(null);

const editModalFormRules = {
	Name: {
		rules: [{
			required: true,
			errorMessage: '该项为必填项'
		}]
	},
	Email: {
		rules: [{
			required: true,
			errorMessage: '该项为必填项'
		}]
	},
	PhoneNumber: {
		rules: [{
			required: true,
			errorMessage: '该项为必填项'
		}]
	},
	Birth: {
		rules: [{
			required: true,
			errorMessage: '该项为必填项'
		}]
	},
	ImageUrls: {
		rules: [{
			required: true,
			errorMessage: '该项为必填项'
		}]
	},
};


// 生命周期钩子
onLoad(async () => {
	let { Data } = await commonStore.GetInfo();
	Object.assign(formData, Data);
	// 设置自定义表单校验规则，必须在节点渲染完毕后执行
	editModalForm.value.setRules(editModalFormRules);
});

onShow(async () => {
	// 页面显示时的逻辑
});

// 方法
const goBack = () => {
	uni.navigateBack();
};

// 创建或修改方法
const createOrEditAsync = async () => {
	editModalForm.value.validate().then(res => {
		uni.showModal({
			title: "提示",
			content: "你确定要操作吗?",
			showCancel: true,
			cancelText: "取消",
			confirmText: "确定",
			success: async (res) => {
				if (res.confirm) {
					let { Data, Success } = await Post("/User/CreateOrEdit", formData);
					if (Success) {
						uni.showToast({
							title: "操作成功",
							icon: "success"
						});
						await commonStore.GetInfo();
						uni.navigateBack();
					}
				}
			}
		});

	}).catch(err => {
		
	});


};
</script>

<style scoped lang="scss"></style>