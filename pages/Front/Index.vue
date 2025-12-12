<template>
    <view>
        <uni-nav-bar dark :fixed="true" shadow background-color="var(--primary-color)" status-bar title="首页" />

       	<footer-bar/>
    </view>
</template>

<script setup>
import { useCommonStore } from "@/store";
import { onHide, onLoad, onShow, onUnload } from "@dcloudio/uni-app";

const commonStore = useCommonStore();

onLoad(() => {

});

onShow(() => {

    if (commonStore.CheckIsLogin()) {

    }
});
onHide(() => {

});
onUnload(() => {

});

</script>

<style scoped lang="scss"></style>