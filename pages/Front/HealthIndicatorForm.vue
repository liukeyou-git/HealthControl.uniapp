<template>
    <view>
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" :title="pageTitle" />

        <uni-section title="请填写健康指标信息">
            <view class="form-container">

                <uni-forms ref="editModalForm" :model="formData" :rules="editModalFormRules" label-width='100'
                    label-position='top'>
                    <uni-forms-item label="指标名称" required name="Name">
                        <uni-easyinput v-model="formData.Name" placeholder="请输入指标名称" primaryColor="var(--primary-color)" />
                    </uni-forms-item>

                    <uni-forms-item label="指标归类" required name="HealthIndicatorTypeName">
                        <!-- 现有指标归类标签 -->
                        <view class="indicator-types-container">
                            <view class="existing-types">
                                <uni-tag v-for="item in UserHealthIndicatorTypeList" :key="item.Id" :text="item.Name"
                                    :type="formData.HealthIndicatorTypeId === item.Id ? 'primary' : 'default'"
                                    :inverted="formData.HealthIndicatorTypeId === item.Id" size="normal"
                                    @click="selectExistingType(item)" class="type-tag" />
                            </view>
                            <!-- 自定义输入框 -->
                            <view class="custom-input-container">
                                <uni-easyinput v-model="customTypeName" placeholder="输入新的指标归类"
                                    primaryColor="var(--primary-color)" @input="onCustomTypeInput" @blur="onCustomTypeBlur"
                                    class="custom-input" />
                                <button v-if="customTypeName && customTypeName.trim()" @click="selectCustomType"
                                    class="btn-select-custom" size="mini">
                                    选择
                                </button>
                            </view>
                        </view>
                        <!-- 当前选择显示 -->
                        <view v-if="formData.HealthIndicatorTypeName" class="selected-type">
                            <text class="selected-label">已选择：</text>
                            <text class="selected-name">{{ formData.HealthIndicatorTypeName }}</text>
                        </view>
                    </uni-forms-item>
                    <uni-forms-item label="封面" required name="Cover">
                        <upload-images v-model="formData.Cover" :limit="1">
                        </upload-images>
                    </uni-forms-item>

                    <uni-forms-item label="阈值" required name="Threshold">
                        <uni-easyinput v-model="formData.Threshold" placeholder="范围格式：3.4-17.1 或 >1.04 或 <3.4"
                            primaryColor="var(--primary-color)" />
                        <view class="threshold-tips">
                            <text class="tips-text">支持格式：</text>
                            <text class="tips-item">范围格式：3.4-17.1</text>
                            <text class="tips-item">大于格式：>1.04</text>
                            <text class="tips-item">小于格式：&lt;3.4</text>
                        </view>
                    </uni-forms-item>
                    <uni-forms-item label="描述内容" required name="Content">
                        <uni-easyinput type="textarea" v-model="formData.Content" placeholder="请输入描述内容"
                            primaryColor="var(--primary-color)" />
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
import { onLoad, onReady, onShow } from "@dcloudio/uni-app";
import { computed, nextTick, reactive, ref } from 'vue';

// 获取store
const commonStore = useCommonStore();
const Token = computed(() => commonStore.Token)
const UserInfo = computed(() => commonStore.UserInfo)
const RoleType = computed(() => commonStore.RoleType)
const UserId = computed(() => commonStore.UserId)

// 页面标题
const pageTitle = computed(() => {
    return Id.value ? '编辑健康指标信息' : '新建健康指标信息';
});


// 表单数据和规则
const formData = reactive({
});
const editModalForm = ref(null);

const Id = ref(null);
const editModalFormRules = {
    Name: {
        rules: [
            {
                required: true,
                errorMessage: '该项为必填项'
            },

        ]
    },
    BelongUserId: {
        rules: [
            {
                required: true,
                errorMessage: '该项为必填项'
            },

        ]
    },
    HealthIndicatorTypeId: {
        rules: [
            {
                required: true,
                errorMessage: '该项为必填项'
            },

        ]
    },
    HealthIndicatorTypeName: {
        rules: [
            {
                required: true,
                errorMessage: '请选择或输入指标归类'
            },
            {
                validator: (rule, value, callback) => {
                    if (!value || value.trim() === '') {
                        callback(new Error('指标归类不能为空'));
                        return;
                    }
                    callback();
                },
                errorMessage: '指标归类不能为空'
            }
        ]
    },
    Cover: {
        rules: [
            {
                required: true,
                errorMessage: '该项为必填项'
            },

        ]
    },
    IsComm: {
        rules: [
            {
                required: true,
                errorMessage: '该项为必填项'
            },

        ]
    },
    Threshold: {
        rules: [
            {
                required: true,
                errorMessage: '该项为必填项'
            },
            {
                validator: (rule, value, callback) => {
                    if (!value) {
                        callback();
                        return;
                    }
                    // 阈值格式验证：支持三种格式
                    // 1. 范围格式：数字-数字 (如: 3.4-17.1)
                    // 2. 大于格式：>数字 (如: >1.04)  
                    // 3. 小于格式：<数字 (如: <3.4)
                    const rangePattern = /^\d+(\.\d+)?-\d+(\.\d+)?$/; // 范围格式
                    const greaterPattern = /^>\d+(\.\d+)?$/; // 大于格式
                    const lessPattern = /^<\d+(\.\d+)?$/; // 小于格式

                    if (rangePattern.test(value) || greaterPattern.test(value) || lessPattern.test(value)) {
                        // 如果是范围格式，需要验证前面的数字小于后面的数字
                        if (rangePattern.test(value)) {
                            const [start, end] = value.split('-').map(Number);
                            if (start >= end) {
                                callback(new Error('范围格式中前面的数值应小于后面的数值'));
                                return;
                            }
                        }
                        callback();
                    } else {
                        callback(new Error('格式错误，请输入：范围(3.4-17.1) 或 大于(>1.04) 或 小于(<3.4)'));
                    }
                },
                errorMessage: '阈值格式不正确'
            }
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
};



// 生命周期钩子
onLoad(async (option) => {
    Id.value = option.Id;

    // 先加载指标类型列表
    await GetUserHealthIndicatorTypeApi();

    // 如果有Id，则显示编辑对话框；否则初始化新建表单
    if (Id.value) {
        await ShowEditModal(Id.value);
    } else {
        // 新建模式，初始化表单数据
        Object.assign(formData, {
            BelongUserId: UserId.value,
            IsComm: false
        });

        nextTick(() => {
            editModalForm.value.setRules(editModalFormRules);
        });
    }
});

onShow(async () => {
    // 页面显示时的逻辑
});

onReady(async () => {


});
const UserHealthIndicatorTypeList = ref([]);
// 自定义指标归类名称
const customTypeName = ref('');

// 选择现有指标归类
const selectExistingType = (item) => {
    formData.HealthIndicatorTypeId = item.Id;
    formData.HealthIndicatorTypeName = item.Name;
    // 清空自定义输入
    customTypeName.value = '';
};

// 选择自定义指标归类
const selectCustomType = () => {
    if (customTypeName.value && customTypeName.value.trim()) {
        formData.HealthIndicatorTypeId = null; // 表示需要创建新的
        formData.HealthIndicatorTypeName = customTypeName.value.trim();
    }
};

// 自定义输入处理
const onCustomTypeInput = (value) => {
    customTypeName.value = value;
};

// 自定义输入失焦处理
const onCustomTypeBlur = () => {
    // 可以在这里添加额外的处理逻辑
};

const GetUserHealthIndicatorTypeApi = async () => {
    const { Data: { Items } } = await Post(`/HealthIndicatorType/List`, {
        BelongUserId: UserId.value
    });
    UserHealthIndicatorTypeList.value = Items;
}

// 显示编辑对话框
const ShowEditModal = async (Id) => {

    const { Data } = await Post(`/HealthIndicator/Get`, { Id: Id });

    Object.assign(formData, Data);

    // 设置指标归类名称用于combox显示
    if (Data.HealthIndicatorTypeId && UserHealthIndicatorTypeList.value.length > 0) {
        const healthIndicatorType = UserHealthIndicatorTypeList.value.find(item => item.Id === Data.HealthIndicatorTypeId);
        if (healthIndicatorType) {
            formData.HealthIndicatorTypeName = healthIndicatorType.Name;
        }
    }



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
    editModalForm.value.validate().then(async res => {
        uni.showModal({
            title: "提示",
            content: "你确定要操作吗?",
            showCancel: true,
            cancelText: "取消",
            confirmText: "确定",
            success: async (res) => {
                if (res.confirm) {
                    try {


                        let { Data, Success } = await Post("/HealthIndicator/UserCreateOrEditIndicator", formData);
                        if (Success) {
                            uni.showToast({
                                title: "操作成功",
                                icon: "success"
                            });

                            uni.navigateBack();
                        }
                    } catch (error) {
                        uni.showToast({
                            title: "操作失败",
                            icon: "none"
                        });
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
/* 表单容器样式 */
.form-container {
    padding: 24rpx;
    background-color: #ffffff;
    margin: 20rpx;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 提交按钮样式 */
.btn-primary {
    width: 100%;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: #ffffff;
    border: none;
    border-radius: 16rpx;

    font-size: 32rpx;
    font-weight: 600;
    margin-top: 40rpx;
    box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
    transition: all 0.3s ease;

    &:active {
        transform: scale(0.98);
        opacity: 0.9;
    }
}

/* 阈值提示样式 */
.threshold-tips {
    margin-top: 16rpx;
    padding: 16rpx;
    background-color: #f8f9fa;
    border-radius: 12rpx;
    border-left: 6rpx solid #4CAF50;
}

.tips-text {
    font-size: 26rpx;
    font-weight: 600;
    color: #333333;
    display: block;
    margin-bottom: 8rpx;
}

.tips-item {
    font-size: 24rpx;
    color: #666666;
    display: block;
    margin-bottom: 4rpx;
    margin-left: 16rpx;

    &::before {
        content: "• ";
        color: #4CAF50;
        font-weight: bold;
        margin-right: 8rpx;
    }

    &:last-child {
        margin-bottom: 0;
    }
}

/* 指标归类选择器样式 */
.indicator-types-container {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.existing-types {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    margin-bottom: 8rpx;
}

.type-tag {
    cursor: pointer;
    transition: all 0.3s ease;
}

.custom-input-container {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 16rpx;
    background-color: #f8f9fa;
    border-radius: 12rpx;
    border: 2rpx dashed #ddd;
}

.custom-input {
    flex: 1;
}

.btn-select-custom {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: #ffffff;
    border: none;
    border-radius: 8rpx;
    padding: 8rpx 16rpx;
    font-size: 24rpx;
    font-weight: 500;
    box-shadow: 0 2rpx 6rpx rgba(76, 175, 80, 0.3);
    transition: all 0.3s ease;
}

.btn-select-custom:active {
    transform: scale(0.95);
    opacity: 0.9;
}

.selected-type {
    margin-top: 16rpx;
    padding: 12rpx 16rpx;
    background-color: #e8f5e8;
    border-radius: 8rpx;
    border-left: 4rpx solid #4CAF50;
}

.selected-label {
    font-size: 24rpx;
    color: #666666;
    margin-right: 8rpx;
}

.selected-name {
    font-size: 26rpx;
    color: #4CAF50;
    font-weight: 600;
}
</style>