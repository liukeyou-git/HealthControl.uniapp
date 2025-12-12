<template>
    <view class="password-edit-container">
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" title="修改密码" />

        <view class="form-container">
            <uni-section title="修改密码">
                <view class="form-wrapper">
                    <uni-forms ref="editModalForm" :model="formData" :rules="rules" label-width="100" label-position="top">
                        <uni-forms-item label="原始密码" required name="OrginPassword">
                            <uni-easyinput type="password" v-model="formData.OrginPassword" placeholder="请输入原始密码" />
                        </uni-forms-item>

                        <uni-forms-item label="新密码" required name="NewPassword">
                            <uni-easyinput type="password" v-model="formData.NewPassword" placeholder="请输入新密码" />
                        </uni-forms-item>

                        <uni-forms-item label="确认密码" required name="TwoPassword">
                            <uni-easyinput type="password" v-model="formData.TwoPassword" placeholder="请再次输入新密码" />
                        </uni-forms-item>
                    </uni-forms>
                    <button class="btn-success" @click="createOrEdit">确定</button>
                </view>
            </uni-section>
        </view>
    </view>
</template>

<script setup>
import { useCommonStore } from '@/store';
import { computed, reactive, ref } from 'vue';
import { Post } from "@/utils/http";
const commonStore = useCommonStore();
const editModalForm = ref(null);

// 表单数据
const formData = reactive({
    OrginPassword: '',
    NewPassword: '',
    TwoPassword: ''
});

// 表单验证规则
const rules = {
    OrginPassword: {
        rules: [{
            required: true,
            errorMessage: '请输入原始密码'
        }]
    },
    NewPassword: {
        rules: [{
            required: true,
            errorMessage: '请输入新密码'
        }]
    },
    TwoPassword: {
        rules: [{
            required: true,
            errorMessage: '请再次输入新密码'
        }]
    }
};

const Token = computed(() => commonStore.Token)
const UserInfo = computed(() => commonStore.UserInfo)
const RoleType = computed(() => commonStore.RoleType)
const UserId = computed(() => commonStore.UserId)

// 方法
const goBack = () => {
    uni.navigateBack();
};

const createOrEdit = async () => {
    editModalForm.value.validate().then(async (res) => {
        const updatedUserInfo = {
            Id: UserId.value,
            OrginPassword: formData.OrginPassword,
            Password: formData.TwoPassword
        };

        const { Success } = await Post("/User/ChangePassword", updatedUserInfo);
        if (Success) {
            await commonStore.Logout();

        }

    });


};
</script>

<style scoped lang="scss">
/* 密码编辑页面容器 */
.password-edit-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
}

/* 表单容器 */
.form-container {
    padding: 30rpx 20rpx;
}

/* 表单包装器 */
.form-wrapper {
    padding: 30rpx;
    background-color: #fff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

/* 按钮样式 */
.btn-success {
    margin-top: 50rpx;
    background-color: var(--primary-color);
    color: #ffffff;
    border-radius: 8rpx;
    text-align: center;
    height: 90rpx;
    line-height: 90rpx;
    font-size: 32rpx;
    width: 100%;
    border: none;
    transition: opacity 0.3s;

    &:active {
        opacity: 0.8;
    }
}
</style>