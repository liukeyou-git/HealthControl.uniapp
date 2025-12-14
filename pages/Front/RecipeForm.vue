<template>
    <view>
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar left-icon="left"
            left-text="返回" @clickLeft="goBack" title="食谱信息" />

        <uni-section title="请填写食谱信息">
            <view class="form-container">

                <uni-forms ref="editModalForm" :model="formData" :rules="editModalFormRules" label-width='100'
                    label-position='top'>
                    <uni-forms-item label="标题" required name="Title">
                        <uni-easyinput v-model="formData.Title" placeholder="请输入标题" primaryColor="var(--primary-color)" />
                    </uni-forms-item>

                    <uni-forms-item label="封面" required name="Cover">
                        <upload-images v-model="formData.Cover">
                        </upload-images>
                    </uni-forms-item>
                    <uni-forms-item label="详细图" name="ImageUrls">
                        <upload-images v-model="formData.ImageUrls">
                        </upload-images>
                    </uni-forms-item>
                    <uni-forms-item label="视频" name="VideoUrl">
                        <upload-video v-model="formData.VideoUrl">
                        </upload-video>
                    </uni-forms-item>

                    <uni-forms-item label="内容" name="Content">
                        <rich-text-edit ref="ContentRichTextEditRef" v-model="formData.Content"></rich-text-edit>
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
    RecipeTypeId: {
        rules: [
            {
                required: true,
                errorMessage: '该项为必填项'
            },

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

};

const ContentRichTextEditRef = ref(null);


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

    const { Data } = await Post(`/Recipe/Get`, { Id: Id });
    if (!Id) {
        Data.PublishUserId = UserId.value;
        Data.AuditStatus = 1;
        Data.ViewCount = 0;
    }
    Object.assign(formData, Data);



    if (ContentRichTextEditRef.value) {
        ContentRichTextEditRef.value.setContent(Data.Content);
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
    editModalForm.value.validate().then(res => {
        uni.showModal({
            title: "提示",
            content: "你确定要操作吗?",
            showCancel: true,
            cancelText: "取消",
            confirmText: "确定",
            success: async (res) => {
                if (res.confirm) {
                    formData.Content = await ContentRichTextEditRef.value.getContent();
                    if (!formData.Content) {
                        uni.showToast({
                            title: "请输入内容",
                            icon: "none"
                        });
                        return;
                    }
                    let { Data, Success } = await Post("/Recipe/CreateOrEdit", formData);
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

<style scoped lang="scss"></style>