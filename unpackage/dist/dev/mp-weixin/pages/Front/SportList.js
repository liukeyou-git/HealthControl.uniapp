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
  __name: "SportList",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    const SportList = common_vendor.ref([]);
    const selectedSport = common_vendor.ref(null);
    const sportPopup = common_vendor.ref(null);
    const exercisePopup = common_vendor.ref(null);
    const selectedUnit = common_vendor.ref(null);
    const exerciseAmount = common_vendor.ref("");
    const recordTime = common_vendor.ref(/* @__PURE__ */ new Date());
    const calculatedCalories = common_vendor.ref(null);
    const inputStyles = {
      borderColor: "#4CAF50",
      borderRadius: "12rpx"
    };
    const where = common_vendor.reactive({
      IsQuerySportUnits: true
    });
    const canSave = common_vendor.computed(() => {
      return exerciseAmount.value && parseFloat(exerciseAmount.value) > 0 && selectedUnit.value;
    });
    common_vendor.onLoad(async (option) => {
    });
    common_vendor.onShow(async () => {
      await GetSportListApi();
    });
    common_vendor.onReady(async () => {
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const GetSportListApi = async () => {
      let {
        Data: {
          Items
        }
      } = await utils_http.Post("/Sport/List", where);
      SportList.value = Items;
    };
    const selectSport = (sport) => {
      selectedSport.value = sport;
      sportPopup.value.open();
    };
    const closeSportPopup = () => {
      sportPopup.value.close();
      selectedSport.value = null;
    };
    const selectUnit = (sport, unit) => {
      selectedUnit.value = { sport, unit };
      exerciseAmount.value = "1";
      recordTime.value = /* @__PURE__ */ new Date();
      calculatedCalories.value = null;
      calculateCalories();
      exercisePopup.value.open();
    };
    const confirmSelectUnit = (sport, unit) => {
      closeSportPopup();
      selectUnit(sport, unit);
    };
    const closeExercisePopup = () => {
      exercisePopup.value.close();
      selectedUnit.value = null;
      exerciseAmount.value = "";
      calculatedCalories.value = null;
    };
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
      calculatedCalories.value = Math.round(unit.Calories * amount * 100) / 100;
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
    const saveSportRecord = async () => {
      if (!canSave.value) {
        common_vendor.index.showToast({
          title: "请输入有效的运动量",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.showLoading({
          title: "保存中..."
        });
        const { sport, unit } = selectedUnit.value;
        const amount = parseInt(exerciseAmount.value);
        const sportRecordData = {
          SportId: sport.Id,
          RecordUserId: UserId.value,
          // 使用当前用户ID
          SportUnitId: unit.Id,
          RecordTime: utils_comm.GetFormatFullDate(new Date(recordTime.value)),
          RecordValue: amount
        };
        const result = await utils_http.Post("/SportRecord/CreateOrEdit", sportRecordData);
        common_vendor.index.hideLoading();
        if (result.Success) {
          common_vendor.index.showToast({
            title: "记录保存成功！",
            icon: "success"
          });
          closeExercisePopup();
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
        common_vendor.index.__f__("error", "at pages/Front/SportList.vue:343", "保存运动记录失败:", error);
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
          title: "🏃‍♂️ 运动参考库"
        }),
        c: common_vendor.f(SportList.value, (sport, k0, i0) => {
          return common_vendor.e({
            a: sport.Cover,
            b: common_vendor.t(sport.Name),
            c: common_vendor.t(sport.Content),
            d: sport.SportUnits && sport.SportUnits.length > 0
          }, sport.SportUnits && sport.SportUnits.length > 0 ? {
            e: common_vendor.f(sport.SportUnits, (unit, k1, i1) => {
              return {
                a: common_vendor.t(unit.UnitName),
                b: common_vendor.t(unit.Calories),
                c: unit.Id,
                d: common_vendor.o(($event) => selectUnit(sport, unit), unit.Id)
              };
            })
          } : {}, {
            f: sport.Id,
            g: common_vendor.o(($event) => selectSport(sport), sport.Id)
          });
        }),
        d: selectedUnit.value
      }, selectedUnit.value ? common_vendor.e({
        e: common_vendor.p({
          type: "closeempty",
          size: "24",
          color: "#666"
        }),
        f: common_vendor.o(closeExercisePopup),
        g: selectedUnit.value.sport.Cover,
        h: common_vendor.t(selectedUnit.value.sport.Name),
        i: common_vendor.t(selectedUnit.value.unit.UnitName),
        j: common_vendor.t(selectedUnit.value.unit.UnitValue),
        k: common_vendor.o(calculateCalories),
        l: common_vendor.o(($event) => exerciseAmount.value = $event),
        m: common_vendor.p({
          type: "number",
          placeholder: `请输入${selectedUnit.value.unit.UnitName}数量`,
          styles: inputStyles,
          modelValue: exerciseAmount.value
        }),
        n: common_vendor.t(selectedUnit.value.unit.UnitName),
        o: calculatedCalories.value
      }, calculatedCalories.value ? {
        p: common_vendor.t(calculatedCalories.value)
      } : {}, {
        q: common_vendor.t(formatTime(recordTime.value)),
        r: common_vendor.p({
          type: "calendar",
          size: "20",
          color: "#4CAF50"
        }),
        s: common_vendor.o(($event) => recordTime.value = $event),
        t: common_vendor.p({
          type: "datetime",
          ["clear-icon"]: false,
          border: false,
          placeholder: "选择记录时间",
          modelValue: recordTime.value
        }),
        v: common_vendor.o(closeExercisePopup),
        w: common_vendor.o(saveSportRecord),
        x: !canSave.value ? 1 : ""
      }) : {}, {
        y: common_vendor.sr(exercisePopup, "e9ac9fcf-1", {
          "k": "exercisePopup"
        }),
        z: common_vendor.p({
          type: "center",
          ["background-color"]: "rgba(0,0,0,0.5)"
        }),
        A: selectedSport.value
      }, selectedSport.value ? common_vendor.e({
        B: common_vendor.t(selectedSport.value.Name),
        C: common_vendor.p({
          type: "closeempty",
          size: "24",
          color: "#999"
        }),
        D: common_vendor.o(closeSportPopup),
        E: selectedSport.value.Cover,
        F: common_vendor.t(selectedSport.value.Content),
        G: selectedSport.value.SportUnits && selectedSport.value.SportUnits.length > 0
      }, selectedSport.value.SportUnits && selectedSport.value.SportUnits.length > 0 ? {
        H: common_vendor.f(selectedSport.value.SportUnits, (unit, k0, i0) => {
          return {
            a: common_vendor.t(unit.UnitName),
            b: common_vendor.t(unit.UnitValue),
            c: common_vendor.t(unit.Calories),
            d: unit.Id,
            e: common_vendor.o(($event) => confirmSelectUnit(selectedSport.value, unit), unit.Id)
          };
        })
      } : {}) : {}, {
        I: common_vendor.sr(sportPopup, "e9ac9fcf-6", {
          "k": "sportPopup"
        }),
        J: common_vendor.p({
          type: "bottom",
          ["background-color"]: "#f8fdf8"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e9ac9fcf"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/SportList.js.map
