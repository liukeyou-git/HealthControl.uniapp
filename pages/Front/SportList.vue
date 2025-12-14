<template>
    <view class="sport-list-container">
        <!-- 导航栏 -->
        <uni-nav-bar dark :fixed="true" shadow background-color="#4CAF50" status-bar left-icon="left" left-text="返回"
            @clickLeft="goBack" title="🏃‍♂️ 运动参考库" />

        <!-- 主要内容区域 -->
        <view class="content-wrapper">
            <!-- 运动列表 -->
            <view class="sport-content">
                <scroll-view class="sport-scroll" scroll-y>
                    <view class="sport-list">
                        <view v-for="sport in SportList" :key="sport.Id" class="sport-item" @click="selectSport(sport)">
                            <!-- 运动图片 -->
                            <view class="sport-image">
                                <image :src="sport.Cover" mode="aspectFill" class="sport-cover" />
                            </view>

                            <!-- 运动信息 -->
                            <view class="sport-info">
                                <view class="sport-name">{{ sport.Name }}</view>
                                <view class="sport-description">{{ sport.Content }}</view>

                                <!-- 运动单位选择 -->
                                <view class="sport-units" v-if="sport.SportUnits && sport.SportUnits.length > 0">
                                    <text class="units-label">常见单位：</text>
                                    <view class="units-list">
                                        <view v-for="unit in sport.SportUnits" :key="unit.Id" class="unit-item"
                                            @click.stop="selectUnit(sport, unit)">
                                            <text class="unit-name">{{ unit.UnitName }}</text>
                                            <text class="unit-calories">({{ unit.Calories }}kcal)</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>

        <!-- 运动量输入弹窗 -->
        <uni-popup ref="exercisePopup" type="center" background-color="rgba(0,0,0,0.5)">
            <view class="exercise-input-popup" v-if="selectedUnit">
                <view class="exercise-header">
                    <text class="exercise-title">🏃‍♂️ 添加运动记录</text>
                    <view class="exercise-close" @click="closeExercisePopup">
                        <uni-icons type="closeempty" size="24" color="#666"></uni-icons>
                    </view>
                </view>

                <view class="exercise-content">
                    <!-- 运动信息显示 -->
                    <view class="sport-summary">
                        <image :src="selectedUnit.sport.Cover" mode="aspectFill" class="summary-image" />
                        <view class="summary-info">
                            <text class="summary-name">{{ selectedUnit.sport.Name }}</text>
                            <text class="summary-unit">单位: {{ selectedUnit.unit.UnitName }} ({{ selectedUnit.unit.UnitValue
                            }})</text>
                        </view>
                    </view>

                    <!-- 运动量输入 -->
                    <view class="input-section">
                        <text class="input-label">🏃‍♂️ 请输入运动量</text>
                        <view class="input-wrapper">
                            <uni-easyinput v-model="exerciseAmount" type="number"
                                :placeholder="`请输入${selectedUnit.unit.UnitName}数量`" :styles="inputStyles"
                                @input="calculateCalories" />
                            <text class="input-unit">{{ selectedUnit.unit.UnitName }}</text>
                        </view>
                    </view>

                    <!-- 计算后的热量消耗 -->
                    <view class="calculated-calories" v-if="calculatedCalories">
                        <text class="calories-title">🔥 预计热量消耗</text>
                        <view class="calories-display">
                            <text class="calories-value">{{ calculatedCalories }}</text>
                            <text class="calories-unit">kcal</text>
                        </view>
                    </view>

                    <!-- 时间选择 -->
                    <view class="time-section">
                        <text class="time-label">⏰ 记录时间</text>
                        <uni-datetime-picker v-model="recordTime" type="datetime" :clear-icon="false" :border="false"
                            placeholder="选择记录时间">
                            <view class="time-display">
                                <text class="time-text">{{ formatTime(recordTime) }}</text>
                                <uni-icons type="calendar" size="20" color="#4CAF50"></uni-icons>
                            </view>
                        </uni-datetime-picker>
                    </view>

                    <!-- 操作按钮 -->
                    <view class="action-buttons">
                        <view class="cancel-btn" @click="closeExercisePopup">
                            <text class="btn-text">取消</text>
                        </view>
                        <view class="save-btn" @click="saveSportRecord" :class="{ disabled: !canSave }">
                            <text class="btn-text">💾 保存记录</text>
                        </view>
                    </view>
                </view>
            </view>
        </uni-popup>

        <!-- 运动详情弹窗 -->
        <uni-popup ref="sportPopup" type="bottom" background-color="#f8fdf8">
            <view class="sport-detail-popup" v-if="selectedSport">
                <view class="popup-header">
                    <text class="popup-title">{{ selectedSport.Name }}</text>
                    <view class="close-btn" @click="closeSportPopup">
                        <uni-icons type="closeempty" size="24" color="#999"></uni-icons>
                    </view>
                </view>

                <view class="popup-content">
                    <image :src="selectedSport.Cover" mode="aspectFill" class="popup-image" />

                    <view class="sport-description-detail">
                        <text class="detail-title">运动介绍</text>
                        <text class="description-text">{{ selectedSport.Content }}</text>
                    </view>

                    <view class="unit-selection" v-if="selectedSport.SportUnits && selectedSport.SportUnits.length > 0">
                        <text class="detail-title">选择单位</text>
                        <view class="unit-options">
                            <view v-for="unit in selectedSport.SportUnits" :key="unit.Id" class="unit-option"
                                @click="confirmSelectUnit(selectedSport, unit)">
                                <view class="unit-info">
                                    <text class="unit-main">{{ unit.UnitName }}</text>
                                    <text class="unit-value">({{ unit.UnitValue }})</text>
                                </view>
                                <view class="unit-calories-info">
                                    <text class="unit-cal">{{ unit.Calories }}kcal</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script setup>
import { useCommonStore } from '@/store';
import { Post } from '@/utils/http';
import { onLoad, onReady, onShow } from "@dcloudio/uni-app";
import { computed, reactive, ref } from 'vue';
import { GetFormatFullDate } from '@/utils/comm';

// 获取store
const commonStore = useCommonStore();
const Token = computed(() => commonStore.Token)
const UserInfo = computed(() => commonStore.UserInfo)
const RoleType = computed(() => commonStore.RoleType)
const UserId = computed(() => commonStore.UserId)

// 响应式数据
const SportList = ref([]);
const selectedSport = ref(null); // 选中的运动
const sportPopup = ref(null); // 弹窗引用

// 运动量输入相关数据
const exercisePopup = ref(null); // 运动量输入弹窗引用
const selectedUnit = ref(null); // 选中的单位信息 { sport, unit }
const exerciseAmount = ref(''); // 输入的运动量
const recordTime = ref(new Date()); // 记录时间，默认当前时间
const calculatedCalories = ref(null); // 计算后的热量消耗

// 输入框样式
const inputStyles = {
    borderColor: '#4CAF50',
    borderRadius: '12rpx'
};

const where = reactive({
    IsQuerySportUnits: true
});

// 计算属性
const canSave = computed(() => {
    return exerciseAmount.value && parseFloat(exerciseAmount.value) > 0 && selectedUnit.value;
});

// 生命周期钩子
onLoad(async (option) => {
});

onShow(async () => {
    await GetSportListApi();
});

onReady(async () => {
});

// 方法
const goBack = () => {
    uni.navigateBack();
};

// 获取运动列表
const GetSportListApi = async () => {
    let {
        Data: {
            Items
        }
    } = await Post('/Sport/List', where);
    SportList.value = Items;
};

// 选择运动
const selectSport = (sport) => {
    selectedSport.value = sport;
    sportPopup.value.open();
};

// 关闭运动详情弹窗
const closeSportPopup = () => {
    sportPopup.value.close();
    selectedSport.value = null;
};

// 选择运动单位（在列表中直接选择）
const selectUnit = (sport, unit) => {
    selectedUnit.value = { sport, unit };
    exerciseAmount.value = '1'; // 默认数量为1
    recordTime.value = new Date(); // 重置为当前时间
    calculatedCalories.value = null;

    // 计算默认热量消耗
    calculateCalories();

    // 打开运动量输入弹窗
    exercisePopup.value.open();
};

// 确认选择单位（在弹窗中选择）
const confirmSelectUnit = (sport, unit) => {
    // 关闭运动详情弹窗
    closeSportPopup();

    // 打开运动量输入弹窗
    selectUnit(sport, unit);
};

// 关闭运动量输入弹窗
const closeExercisePopup = () => {
    exercisePopup.value.close();
    selectedUnit.value = null;
    exerciseAmount.value = '';
    calculatedCalories.value = null;
};

// 计算热量消耗
const calculateCalories = () => {
    if (!selectedUnit.value || !exerciseAmount.value) {
        calculatedCalories.value = null;
        return;
    }

    const amount = parseFloat(exerciseAmount.value);
    if (isNaN(amount) || amount <= 0) {
        calculatedCalories.value = null;
        return;
    }

    const { unit } = selectedUnit.value;

    // 根据输入的运动量计算热量消耗
    calculatedCalories.value = Math.round(unit.Calories * amount * 100) / 100;
};

// 格式化时间显示
const formatTime = (time) => {
    if (!time) return '选择时间';

    const date = new Date(time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 保存运动记录
const saveSportRecord = async () => {
    if (!canSave.value) {
        uni.showToast({
            title: '请输入有效的运动量',
            icon: 'none'
        });
        return;
    }

    try {
        uni.showLoading({
            title: '保存中...'
        });

        const { sport, unit } = selectedUnit.value;
        const amount = parseInt(exerciseAmount.value);

        // 构建请求数据，对应后端SportRecord实体
        const sportRecordData = {
            SportId: sport.Id,
            RecordUserId: UserId.value, // 使用当前用户ID
            SportUnitId: unit.Id,
            RecordTime: GetFormatFullDate(new Date(recordTime.value)),
            RecordValue: amount
        };

        // 调用后端API保存运动记录
        const result = await Post('/SportRecord/CreateOrEdit', sportRecordData);

        uni.hideLoading();

        if (result.Success) {
            uni.showToast({
                title: '记录保存成功！',
                icon: 'success'
            });

            // 关闭弹窗
            closeExercisePopup();
        } else {
            uni.showToast({
                title: result.Msg || '保存失败',
                icon: 'none'
            });
        }

    } catch (error) {
        uni.hideLoading();
        uni.showToast({
            title: '网络错误，请重试',
            icon: 'none'
        });
        console.error('保存运动记录失败:', error);
    }
};
</script>

<style scoped lang="scss">
.sport-list-container {
    height: 100vh;
    width: 100vw;
    /* 限制容器宽度 */
    overflow-x: hidden;
    /* 禁止横向滚动 */
    background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
    box-sizing: border-box;
    /* 包含边距在宽度计算内 */
}

/* 主要内容区域 */
.content-wrapper {
    height: calc(100vh - 44px);
    width: 100vw;
    /* 限制宽度为视窗宽度 */
    overflow-x: hidden;
    /* 禁止横向滚动 */
}

/* 运动内容 */
.sport-content {
    height: 100%;
    width: 100%;
    /* 确保宽度不超出父容器 */
    box-sizing: border-box;
    /* 包含padding在宽度计算内 */

    .sport-scroll {
        height: 100%;
        width: 100%;
        padding: 20rpx;
        box-sizing: border-box;
        /* 包含padding在宽度计算内 */
    }
}

/* 运动列表 */
.sport-list {
    background: linear-gradient(135deg, #ffffff 0%, #fafffe 100%);
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.1);
    border: 1rpx solid rgba(76, 175, 80, 0.1);
    width: 100%;
    /* 确保不超出父容器 */
    box-sizing: border-box;
    /* 包含边框在宽度计算内 */
}

/* 运动项 */
.sport-item {
    display: flex;
    padding: 24rpx;
    border-bottom: 1rpx solid #f0f0f0;
    transition: background-color 0.2s;
    width: 100%;
    /* 确保不超出父容器 */
    box-sizing: border-box;
    /* 包含padding在宽度计算内 */
    overflow: hidden;
    /* 防止内容溢出 */

    &:last-child {
        border-bottom: none;
    }

    &:active {
        background: linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 100%);
    }

    .sport-image {
        width: 120rpx;
        height: 120rpx;
        margin-right: 24rpx;

        .sport-cover {
            width: 100%;
            height: 100%;
            border-radius: 12rpx;
        }
    }

    .sport-info {
        flex: 1;
        min-width: 0;
        /* 允许flex项目收缩到内容宽度以下 */
        overflow: hidden;
        /* 防止内容溢出 */

        .sport-name {
            font-size: 32rpx;
            font-weight: bold;
            color: #2E7D32;
            margin-bottom: 12rpx;
            display: flex;
            align-items: center;

            &::after {
                content: '🍃';
                margin-left: 8rpx;
                font-size: 20rpx;
                opacity: 0.7;
            }
        }

        .sport-description {
            font-size: 26rpx;
            color: #666;
            margin-bottom: 16rpx;
            line-height: 1.4;
            word-wrap: break-word;
            /* 长文本自动换行 */
            overflow-wrap: break-word;
            /* 兼容性更好的换行 */
        }

        .sport-units {
            .units-label {
                font-size: 24rpx;
                color: #999;
                margin-bottom: 8rpx;
            }

            .units-list {
                display: flex;
                flex-wrap: wrap;
                gap: 12rpx;
                width: 100%;
                /* 确保不超出父容器 */
                box-sizing: border-box;
                /* 包含边距在宽度计算内 */

                .unit-item {
                    background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
                    border: 1rpx solid #4CAF50;
                    border-radius: 8rpx;
                    padding: 8rpx 16rpx;
                    transition: all 0.2s;

                    &:active {
                        background: linear-gradient(135deg, #d4f4d4 0%, #e0f0e0 100%);
                        transform: scale(0.98);
                        box-shadow: 0 2rpx 4rpx rgba(76, 175, 80, 0.3);
                    }

                    .unit-name {
                        font-size: 22rpx;
                        color: #2E7D32;
                        margin-right: 8rpx;
                        font-weight: 600;
                    }

                    .unit-calories {
                        font-size: 20rpx;
                        color: #999;
                    }
                }
            }
        }
    }
}

/* 运动量输入弹窗样式 */
.exercise-input-popup {
    width: 600rpx;
    background: linear-gradient(135deg, #f8fdf8 0%, #ffffff 100%);
    border-radius: 24rpx;
    box-shadow: 0 8rpx 32rpx rgba(76, 175, 80, 0.2);

    .exercise-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 32rpx;
        border-bottom: 1rpx solid #e0f0e0;
        background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
        border-radius: 24rpx 24rpx 0 0;

        .exercise-title {
            font-size: 32rpx;
            font-weight: bold;
            color: #2E7D32;
        }

        .exercise-close {
            padding: 8rpx;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            transition: all 0.2s;

            &:active {
                background: rgba(76, 175, 80, 0.1);
                transform: scale(0.95);
            }
        }
    }

    .exercise-content {
        padding: 32rpx;

        .sport-summary {
            display: flex;
            align-items: center;
            margin-bottom: 32rpx;
            padding: 20rpx;
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
            border-radius: 16rpx;
            border: 1rpx solid rgba(76, 175, 80, 0.2);

            .summary-image {
                width: 80rpx;
                height: 80rpx;
                border-radius: 12rpx;
                margin-right: 20rpx;
            }

            .summary-info {
                flex: 1;

                .summary-name {
                    display: block;
                    font-size: 28rpx;
                    font-weight: bold;
                    color: #2E7D32;
                    margin-bottom: 8rpx;
                }

                .summary-unit {
                    font-size: 24rpx;
                    color: #558B2F;
                }
            }
        }

        .input-section {
            margin-bottom: 32rpx;

            .input-label {
                display: block;
                font-size: 28rpx;
                font-weight: bold;
                color: #2E7D32;
                margin-bottom: 16rpx;
            }

            .input-wrapper {
                display: flex;
                align-items: center;

                .input-unit {
                    margin-left: 16rpx;
                    font-size: 24rpx;
                    color: #558B2F;
                    font-weight: 600;
                    background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
                    padding: 12rpx 20rpx;
                    border-radius: 12rpx;
                    border: 1rpx solid rgba(76, 175, 80, 0.3);
                }
            }
        }

        .calculated-calories {
            margin-bottom: 32rpx;
            text-align: center;

            .calories-title {
                display: block;
                font-size: 28rpx;
                font-weight: bold;
                color: #2E7D32;
                margin-bottom: 16rpx;
            }

            .calories-display {
                background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
                padding: 20rpx;
                border-radius: 16rpx;
                border: 1rpx solid rgba(76, 175, 80, 0.2);

                .calories-value {
                    font-size: 36rpx;
                    font-weight: bold;
                    color: #2E7D32;
                    margin-right: 8rpx;
                }

                .calories-unit {
                    font-size: 24rpx;
                    color: #558B2F;
                }
            }
        }

        .time-section {
            margin-bottom: 32rpx;

            .time-label {
                display: block;
                font-size: 28rpx;
                font-weight: bold;
                color: #2E7D32;
                margin-bottom: 16rpx;
            }

            .time-display {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20rpx;
                background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
                border-radius: 12rpx;
                border: 1rpx solid rgba(76, 175, 80, 0.3);

                .time-text {
                    font-size: 26rpx;
                    color: #2E7D32;
                }
            }
        }

        .action-buttons {
            display: flex;
            gap: 16rpx;

            .cancel-btn,
            .save-btn {
                flex: 1;
                height: 80rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 16rpx;
                transition: all 0.2s;

                .btn-text {
                    font-size: 28rpx;
                    font-weight: 600;
                }
            }

            .cancel-btn {
                background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
                border: 1rpx solid #ccc;

                .btn-text {
                    color: #666;
                }

                &:active {
                    transform: scale(0.98);
                    background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%);
                }
            }

            .save-btn {
                background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
                border: 1rpx solid #4CAF50;

                .btn-text {
                    color: #fff;
                }

                &:active {
                    transform: scale(0.98);
                    background: linear-gradient(135deg, #388E3C 0%, #4CAF50 100%);
                }

                &.disabled {
                    background: linear-gradient(135deg, #ccc 0%, #999 100%);
                    border-color: #ccc;
                    opacity: 0.6;

                    .btn-text {
                        color: #666;
                    }
                }
            }
        }
    }
}

/* 运动详情弹窗样式 */
.sport-detail-popup {
    max-height: 70vh;
    background: linear-gradient(135deg, #f8fdf8 0%, #ffffff 100%);
    border-radius: 24rpx 24rpx 0 0;

    .popup-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 32rpx;
        border-bottom: 1rpx solid #e0f0e0;
        background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
        border-radius: 24rpx 24rpx 0 0;

        .popup-title {
            font-size: 36rpx;
            font-weight: bold;
            color: #2E7D32;
            display: flex;
            align-items: center;

            &::before {
                content: '🏃‍♂️';
                margin-right: 12rpx;
                font-size: 32rpx;
            }
        }

        .close-btn {
            padding: 8rpx;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            transition: all 0.2s;

            &:active {
                background: rgba(76, 175, 80, 0.1);
                transform: scale(0.95);
            }
        }
    }

    .popup-content {
        padding: 32rpx;

        .popup-image {
            width: 100%;
            height: 300rpx;
            border-radius: 16rpx;
            margin-bottom: 32rpx;
        }

        .sport-description-detail {
            margin-bottom: 32rpx;

            .detail-title {
                font-size: 28rpx;
                font-weight: bold;
                color: #2E7D32;
                margin-bottom: 16rpx;
                display: flex;
                align-items: center;

                &::before {
                    content: '📝';
                    margin-right: 12rpx;
                    font-size: 24rpx;
                }
            }

            .description-text {
                font-size: 26rpx;
                color: #666;
                line-height: 1.6;
            }
        }

        .unit-selection {
            .detail-title {
                font-size: 28rpx;
                font-weight: bold;
                color: #2E7D32;
                margin-bottom: 16rpx;
            }

            .unit-options {
                .unit-option {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24rpx;
                    background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
                    border-radius: 12rpx;
                    margin-bottom: 16rpx;
                    border: 1rpx solid rgba(76, 175, 80, 0.2);
                    transition: all 0.2s;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    &:active {
                        background: linear-gradient(135deg, #d4f4d4 0%, #e0f0e0 100%);
                        transform: scale(0.98);
                    }

                    .unit-info {
                        .unit-main {
                            font-size: 28rpx;
                            font-weight: bold;
                            color: #2E7D32;
                            margin-right: 12rpx;
                        }

                        .unit-value {
                            font-size: 24rpx;
                            color: #558B2F;
                        }
                    }

                    .unit-calories-info {
                        .unit-cal {
                            font-size: 24rpx;
                            color: #2E7D32;
                            font-weight: bold;
                            background: rgba(76, 175, 80, 0.1);
                            padding: 4rpx 12rpx;
                            border-radius: 8rpx;
                        }
                    }
                }
            }
        }
    }
}</style>