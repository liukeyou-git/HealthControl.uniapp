"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_http = require("../../utils/http.js");
const utils_comm = require("../../utils/comm.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_easyinput2 + _easycom_uni_datetime_picker2 + _easycom_uni_popup2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_uni_easyinput + _easycom_uni_datetime_picker + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "FoodList",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    const FoodTypeList = common_vendor.ref([]);
    const activeCategory = common_vendor.ref(0);
    const scrollTop = common_vendor.ref(0);
    const selectedFood = common_vendor.ref(null);
    const foodPopup = common_vendor.ref(null);
    const portionPopup = common_vendor.ref(null);
    const selectedUnit = common_vendor.ref(null);
    const portionAmount = common_vendor.ref("");
    const recordTime = common_vendor.ref(/* @__PURE__ */ new Date());
    const calculatedNutrition = common_vendor.ref(null);
    const inputStyles = {
      borderColor: "#4CAF50",
      borderRadius: "12rpx"
    };
    common_vendor.reactive({});
    const canSave = common_vendor.computed(() => {
      return portionAmount.value && parseFloat(portionAmount.value) > 0 && selectedUnit.value;
    });
    common_vendor.onLoad(async (option) => {
    });
    common_vendor.onShow(async () => {
      await GetFoodTypeListApi();
    });
    common_vendor.onReady(async () => {
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const GetFoodTypeListApi = async () => {
      let {
        Data: {
          Items
        }
      } = await utils_http.Post("/FoodType/List", { IsQueryChild: true });
      FoodTypeList.value = Items;
    };
    const selectCategory = async (index, categoryId) => {
      activeCategory.value = index;
      await common_vendor.nextTick$1();
      const query = common_vendor.index.createSelectorQuery();
      query.select(`#category-${categoryId}`).boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec((res) => {
        if (res[0]) {
          scrollTop.value = res[0].top - 100;
        }
      });
    };
    const onFoodScroll = (e) => {
      const scrollTop2 = e.detail.scrollTop;
      FoodTypeList.value.forEach((category, index) => {
        const query = common_vendor.index.createSelectorQuery();
        query.select(`#category-${category.Id}`).boundingClientRect();
        query.exec((res) => {
          if (res[0]) {
            const categoryTop = res[0].top;
            const categoryBottom = res[0].top + res[0].height;
            if (scrollTop2 >= categoryTop - 200 && scrollTop2 < categoryBottom - 200) {
              activeCategory.value = index;
            }
          }
        });
      });
    };
    const selectFood = (food) => {
      selectedFood.value = food;
      foodPopup.value.open();
    };
    const closeFoodPopup = () => {
      foodPopup.value.close();
      selectedFood.value = null;
    };
    const selectUnit = (food, unit) => {
      selectedUnit.value = { food, unit };
      portionAmount.value = "1";
      recordTime.value = /* @__PURE__ */ new Date();
      calculatedNutrition.value = null;
      calculateNutrition();
      portionPopup.value.open();
    };
    const confirmSelectUnit = (food, unit) => {
      closeFoodPopup();
      selectUnit(food, unit);
    };
    const closePortionPopup = () => {
      portionPopup.value.close();
      selectedUnit.value = null;
      portionAmount.value = "";
      calculatedNutrition.value = null;
    };
    const calculateNutrition = () => {
      if (!selectedUnit.value || !portionAmount.value) {
        calculatedNutrition.value = null;
        return;
      }
      const amount = parseFloat(portionAmount.value);
      if (isNaN(amount) || amount <= 0) {
        calculatedNutrition.value = null;
        return;
      }
      const { unit } = selectedUnit.value;
      calculatedNutrition.value = {
        calories: Math.round(unit.Calories * amount * 100) / 100,
        protein: Math.round(unit.Protein * amount * 100) / 100,
        carbs: Math.round(unit.Carbohydrates * amount * 100) / 100,
        fat: Math.round(unit.Fat * amount * 100) / 100
      };
    };
    const formatTime = (time) => {
      if (!time)
        return "选择时间";
      const date = new Date(time);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    const saveDietRecord = async () => {
      if (!canSave.value) {
        common_vendor.index.showToast({
          title: "请输入有效的分量",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.showLoading({
          title: "保存中..."
        });
        const { food, unit } = selectedUnit.value;
        const amount = parseInt(portionAmount.value);
        const dietRecordData = {
          FoodId: food.Id,
          RecordUserId: UserId.value,
          // 使用当前用户ID
          FoodUnitId: unit.Id,
          RecordTime: utils_comm.GetFormatFullDate(new Date(recordTime.value)),
          RecordValue: amount
        };
        const result = await utils_http.Post("/DietRecord/CreateOrEdit", dietRecordData);
        common_vendor.index.hideLoading();
        if (result.Success) {
          common_vendor.index.showToast({
            title: "记录保存成功！",
            icon: "success"
          });
          closePortionPopup();
        } else {
          common_vendor.index.showToast({
            title: result.Msg || "保存失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "网络错误，请重试",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/Front/FoodList.vue:445", "保存饮食记录失败:", error);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.p({
          dark: true,
          fixed: true,
          shadow: true,
          ["background-color"]: "#4CAF50",
          ["status-bar"]: true,
          ["left-icon"]: "left",
          ["left-text"]: "返回",
          title: "🥗 健康食物库"
        }),
        c: common_vendor.f(FoodTypeList.value, (category, index, i0) => {
          return {
            a: common_vendor.t(category.Name),
            b: category.Id,
            c: activeCategory.value === index ? 1 : "",
            d: common_vendor.o(($event) => selectCategory(index, category.Id), category.Id)
          };
        }),
        d: common_vendor.f(FoodTypeList.value, (category, k0, i0) => {
          return {
            a: common_vendor.t(category.Name),
            b: common_vendor.f(category.Foods, (food, k1, i1) => {
              return common_vendor.e({
                a: food.Cover,
                b: common_vendor.t(food.Name),
                c: common_vendor.t(food.Calories),
                d: common_vendor.t(food.Protein),
                e: common_vendor.t(food.Carbohydrates),
                f: common_vendor.t(food.Fat),
                g: food.FoodUnits && food.FoodUnits.length > 0
              }, food.FoodUnits && food.FoodUnits.length > 0 ? {
                h: common_vendor.f(food.FoodUnits, (unit, k2, i2) => {
                  return {
                    a: common_vendor.t(unit.UnitName),
                    b: common_vendor.t(unit.Calories),
                    c: unit.Id,
                    d: common_vendor.o(($event) => selectUnit(food, unit), unit.Id)
                  };
                })
              } : {}, {
                i: food.Id,
                j: common_vendor.o(($event) => selectFood(food), food.Id)
              });
            }),
            c: category.Id,
            d: `category-${category.Id}`
          };
        }),
        e: common_vendor.o(onFoodScroll),
        f: scrollTop.value,
        g: selectedUnit.value
      }, selectedUnit.value ? common_vendor.e({
        h: common_vendor.p({
          type: "closeempty",
          size: "24",
          color: "#666"
        }),
        i: common_vendor.o(closePortionPopup),
        j: selectedUnit.value.food.Cover,
        k: common_vendor.t(selectedUnit.value.food.Name),
        l: common_vendor.t(selectedUnit.value.unit.UnitName),
        m: common_vendor.t(selectedUnit.value.unit.UnitValue),
        n: common_vendor.o(calculateNutrition),
        o: common_vendor.o(($event) => portionAmount.value = $event),
        p: common_vendor.p({
          type: "number",
          placeholder: `请输入${selectedUnit.value.unit.UnitName}数量`,
          styles: inputStyles,
          modelValue: portionAmount.value
        }),
        q: common_vendor.t(selectedUnit.value.unit.UnitName),
        r: calculatedNutrition.value
      }, calculatedNutrition.value ? {
        s: common_vendor.t(calculatedNutrition.value.calories),
        t: common_vendor.t(calculatedNutrition.value.protein),
        v: common_vendor.t(calculatedNutrition.value.carbs),
        w: common_vendor.t(calculatedNutrition.value.fat)
      } : {}, {
        x: common_vendor.t(formatTime(recordTime.value)),
        y: common_vendor.p({
          type: "calendar",
          size: "20",
          color: "#4CAF50"
        }),
        z: common_vendor.o(($event) => recordTime.value = $event),
        A: common_vendor.p({
          type: "datetime",
          ["clear-icon"]: false,
          border: false,
          placeholder: "选择记录时间",
          modelValue: recordTime.value
        }),
        B: common_vendor.o(closePortionPopup),
        C: common_vendor.o(saveDietRecord),
        D: !canSave.value ? 1 : ""
      }) : {}, {
        E: common_vendor.sr(portionPopup, "05c655f0-1", {
          "k": "portionPopup"
        }),
        F: common_vendor.p({
          type: "center",
          ["background-color"]: "rgba(0,0,0,0.5)"
        }),
        G: selectedFood.value
      }, selectedFood.value ? common_vendor.e({
        H: common_vendor.t(selectedFood.value.Name),
        I: common_vendor.p({
          type: "closeempty",
          size: "24",
          color: "#999"
        }),
        J: common_vendor.o(closeFoodPopup),
        K: selectedFood.value.Cover,
        L: common_vendor.t(selectedFood.value.Calories),
        M: common_vendor.t(selectedFood.value.Protein),
        N: common_vendor.t(selectedFood.value.Carbohydrates),
        O: common_vendor.t(selectedFood.value.Fat),
        P: selectedFood.value.FoodUnits && selectedFood.value.FoodUnits.length > 0
      }, selectedFood.value.FoodUnits && selectedFood.value.FoodUnits.length > 0 ? {
        Q: common_vendor.f(selectedFood.value.FoodUnits, (unit, k0, i0) => {
          return {
            a: common_vendor.t(unit.UnitName),
            b: common_vendor.t(unit.UnitValue),
            c: common_vendor.t(unit.Calories),
            d: unit.Id,
            e: common_vendor.o(($event) => confirmSelectUnit(selectedFood.value, unit), unit.Id)
          };
        })
      } : {}) : {}, {
        R: common_vendor.sr(foodPopup, "05c655f0-6", {
          "k": "foodPopup"
        }),
        S: common_vendor.p({
          type: "bottom",
          ["background-color"]: "#f8fdf8"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-05c655f0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/FoodList.js.map
