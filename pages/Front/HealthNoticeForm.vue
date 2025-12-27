<template>
    <view>
        <!-- 顶部导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" title="健康提醒信息" />

        <!-- 主体内容 -->
        <view class="page-container">
            <view class="form-wrapper">
                <!-- 表单标题 -->
                <view class="form-title">
                    <text class="title-text">创建健康提醒</text>
                    <text class="subtitle-text">设置个性化的健康提醒计划</text>
                </view>

                <!-- 表单内容 -->
                <uni-forms ref="editModalForm" :model="formData" :rules="editModalFormRules" label-width='100'
                    label-position='top' class="custom-form">

                    <!-- 提醒标题 -->
                    <view class="form-item-wrapper">
                        <uni-forms-item label="提醒标题" required name="Title" class="custom-form-item">
                            <uni-easyinput v-model="formData.Title" placeholder="请输入提醒标题"
                                primaryColor="var(--primary-color)" class="custom-input" />
                        </uni-forms-item>
                    </view>

                    <!-- 提醒内容 -->
                    <view class="form-item-wrapper">
                        <uni-forms-item label="提醒内容" required name="Content" class="custom-form-item">
                            <uni-easyinput type="textarea" v-model="formData.Content" placeholder="请输入提醒内容"
                                primaryColor="var(--primary-color)" class="custom-textarea" />
                        </uni-forms-item>
                    </view>


                    <!-- 提醒时间 -->
                    <view class="form-item-wrapper">
                        <uni-forms-item label="提醒时间" required name="RemindTime" class="custom-form-item">
                            <uni-datetime-picker type="datetime" return-type="string" v-model="formData.RemindTime"
                                primaryColor="var(--primary-color)" class="custom-datetime" />
                        </uni-forms-item>
                    </view>

                    <!-- 提醒方式 -->
                    <view class="form-item-wrapper">
                        <uni-forms-item label="提醒方式" required name="RemindType" class="custom-form-item">
                            <uni-data-picker v-model="formData.RemindType" :localdata="[{ text: '邮件', value: '邮件' }]"
                                class="custom-picker" />
                        </uni-forms-item>
                    </view>
                </uni-forms>

                <!-- 提交按钮 -->
                <view class="button-wrapper">
                    <button class="submit-button" @click="createOrEditAsync">
                        <text class="button-text">创建提醒</text>
                    </button>
                </view>
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


// 表单数据和规则
const formData = reactive({
});
const editModalForm = ref(null);

const Id = ref(null);
const editModalFormRules = {
    Title: {
        rules: [
            {
                required: true,
                errorMessage: '该项为必填项'
            },

        ]
    },
    PublishUserId: {
        rules: [
            {
                required: true,
                errorMessage: '该项为必填项'
            },

        ]
    },
    Num: {
        rules: [
            {
                required: true,
                errorMessage: '该项为必填项'
            },

        ]
    },
    RemindTime: {
        rules: [
            {
                required: true,
                errorMessage: '该项为必填项'
            },

        ]
    },
    IsRemind: {
        rules: [
            {
                required: true,
                errorMessage: '该项为必填项'
            },

        ]
    },
    Content: {
        rules: [
            {
                required: true,
                errorMessage: '该项为必填项'
            },

        ]
    },
    RemindType: {
        rules: [
            {
                required: true,
                errorMessage: '该项为必填项'
            },

        ]
    },
};



// 生命周期钩子
onLoad(async (option) => {
    Id.value = option.Id;
    ShowEditModal(Id.value);


});

onShow(async () => {
    // 页面显示时的逻辑
});

onReady(async () => {


});

// 显示编辑对话框
const ShowEditModal = async (Id) => {

    const { Data } = await Post(`/HealthNotice/Get`, { Id: Id });
    if (!Id) {
        Data.IsRemind = false;
        Data.PublishUserId = UserId.value;
        Data.Num = 1;
    }
    Object.assign(formData, Data);




    nextTick(() => {
        // 设置自定义表单校验规则，必须在节点渲染完毕后执行
        editModalForm.value.setRules(editModalFormRules);
    });
};

// 方法
const goBack = () => {
    uni.navigateBack();
};

//地址选择回调
const AddressSelected = (data) => {
    formData.Address = data.fullAddress;

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
                    let { Data, Success } = await Post("/HealthNotice/CreateOrEdit", formData);
                    if (Success) {
                        uni.showToast({
                            title: "操作成功",
                            icon: "success"
                        });

                        uni.navigateBack();
                    }
                }
            }
        });

    }).catch(err => {
        uni.showToast({
            title: "请检测输入项是否正确",
            icon: "none"
        });

    });


};
</script>

<style scoped lang="scss">
/* 页面容器 */
.page-container {
    padding: 10upx 30upx 30upx; // 顶部留出导航栏空间
    min-height: 100vh;
    background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

/* 表单外包装 */
.form-wrapper {
    background: #ffffff;
    border-radius: 20upx;
    padding: 40upx 30upx;
    box-shadow: 0 4upx 20upx rgba(0, 0, 0, 0.08);
    margin-bottom: 30upx;
}

/* 表单标题区域 */
.form-title {
    text-align: center;
    margin-bottom: 60upx;

    .title-text {
        display: block;
        font-size: 36upx;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 16upx;
    }

    .subtitle-text {
        display: block;
        font-size: 26upx;
        color: #7f8c8d;
        line-height: 1.4;
    }
}

/* 自定义表单样式 */
.custom-form {
    .form-item-wrapper {
        margin-bottom: 40upx;

        &:last-child {
            margin-bottom: 20upx;
        }
    }
}

/* 表单项样式 */
.custom-form-item {

    /* 标签样式 */
    :deep(.uni-forms-item__label) {
        font-size: 30upx !important;
        color: #34495e !important;
        font-weight: 500 !important;
        margin-bottom: 20upx !important;
        padding: 0 !important;
    }

    /* 必填星号样式 */
    :deep(.is-required:before) {
        color: #e74c3c !important;
        margin-right: 8upx !important;
    }
}

/* 输入框样式 */
.custom-input {
    :deep(.uni-easyinput__content) {
        background: #f8f9fa !important;
        border: 2upx solid #e9ecef !important;
        border-radius: 16upx !important;
        padding: 24upx 20upx !important;
        transition: all 0.3s ease !important;

        &:focus-within {
            border-color: var(--primary-color) !important;
            background: #ffffff !important;
            box-shadow: 0 0 0 6upx rgba(52, 152, 219, 0.1) !important;
        }
    }

    :deep(.uni-easyinput__content-input) {
        font-size: 28upx !important;
        color: #2c3e50 !important;

        &::placeholder {
            color: #95a5a6 !important;
        }
    }
}

/* 文本域样式 */
.custom-textarea {
    :deep(.uni-easyinput__content) {
        background: #f8f9fa !important;
        border: 2upx solid #e9ecef !important;
        border-radius: 16upx !important;
        padding: 24upx 20upx !important;
        min-height: 120upx !important;
        transition: all 0.3s ease !important;

        &:focus-within {
            border-color: var(--primary-color) !important;
            background: #ffffff !important;
            box-shadow: 0 0 0 6upx rgba(52, 152, 219, 0.1) !important;
        }
    }

    :deep(.uni-easyinput__content-textarea) {
        font-size: 28upx !important;
        color: #2c3e50 !important;
        line-height: 1.6 !important;

        &::placeholder {
            color: #95a5a6 !important;
        }
    }
}

/* 数字输入框样式 */
.custom-number-box {
    :deep(.uni-numbox) {
        background: #f8f9fa;
        border: 2upx solid #e9ecef;
        border-radius: 16upx;
        overflow: hidden;
        height: 80upx;
    }

    :deep(.uni-numbox__minus),
    :deep(.uni-numbox__plus) {
        background: #ffffff !important;
        border: none !important;
        color: var(--primary-color) !important;
        font-weight: 600 !important;
        width: 60upx !important;
        height: 76upx !important;
        line-height: 76upx !important;

        &:active {
            background: #f8f9fa !important;
        }
    }

    :deep(.uni-numbox__value) {
        background: #ffffff !important;
        border: none !important;
        color: #2c3e50 !important;
        font-size: 28upx !important;
        text-align: center !important;
        height: 76upx !important;
        line-height: 76upx !important;
    }
}

/* 日期时间选择器样式 */
.custom-datetime {
    :deep(.uni-date-x) {
        background: #f8f9fa !important;
        border: 2upx solid #e9ecef !important;
        border-radius: 16upx !important;
        padding: 24upx 20upx !important;
        height: auto !important;

        .uni-date-x__input {
            font-size: 28upx !important;
            color: #2c3e50 !important;
        }
    }
}

/* 数据选择器样式 */
.custom-picker {
    :deep(.uni-data-picker) {
        background: #f8f9fa;
        border: 2upx solid #e9ecef;
        border-radius: 16upx;
        padding: 24upx 20upx;

        .input-value {
            font-size: 28upx !important;
            color: #2c3e50 !important;
        }

        .placeholder {
            color: #95a5a6 !important;
        }
    }
}

/* 按钮容器 */
.button-wrapper {
    margin-top: 60upx;
    padding: 0 20upx;
}

/* 提交按钮样式 */
.submit-button {
    width: 100%;
    height: 88upx;
    background: var(--primary-color);
    border: none;
    border-radius: 16upx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8upx 20upx rgba(52, 152, 219, 0.3);
    transition: all 0.3s ease;

    &:active {
        transform: translateY(2upx);
        box-shadow: 0 4upx 12upx rgba(52, 152, 219, 0.4);
        background: #2980b9;
    }

    .button-text {
        font-size: 32upx;
        color: #ffffff;
        font-weight: 600;
        letter-spacing: 2upx;
    }
}

/* 响应式适配 */
@media (max-width: 750upx) {
    .page-container {
        padding: 100upx 20upx 20upx;
    }

    .form-wrapper {
        padding: 30upx 20upx;
        border-radius: 16upx;
    }

    .form-title {
        margin-bottom: 40upx;

        .title-text {
            font-size: 32upx;
        }

        .subtitle-text {
            font-size: 24upx;
        }
    }

    .custom-form .form-item-wrapper {
        margin-bottom: 30upx;
    }
}
</style>