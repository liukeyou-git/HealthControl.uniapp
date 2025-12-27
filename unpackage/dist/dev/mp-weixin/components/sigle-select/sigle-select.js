"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_comm = require("../../utils/comm.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  _easycom_uni_data_select2();
}
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
if (!Math) {
  _easycom_uni_data_select();
}
const _sfc_main = {
  __name: "sigle-select",
  props: {
    modelValue: {
      type: [Number, String],
      default: ""
    },
    url: {
      type: String,
      //默认的请求路径
      default: ""
    },
    columnName: {
      type: String,
      //需要绑定Name的值
      default: ""
    },
    columnValue: {
      type: String,
      //需要绑定Value的值
      default: ""
    },
    columnLabel: {
      type: String,
      //需要绑定Label的值
      default: ""
    },
    where: {
      type: Object,
      default: () => ({})
    },
    filterValue: {
      type: Array,
      //需要绑定Value的值
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "SelectCallBack"],
  setup(__props, { expose: __expose, emit: __emit }) {
    store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    common_vendor.computed(() => commonStore.UserId);
    const props = __props;
    const emit = __emit;
    const dataList = common_vendor.ref([]);
    const where_ = common_vendor.ref({});
    const searchWhere = common_vendor.ref({});
    const selectValue = common_vendor.ref();
    common_vendor.watch(() => props.modelValue, (newVal) => {
      if (newVal != null && newVal !== void 0) {
        selectValue.value = newVal.toString();
      }
    }, { immediate: true });
    common_vendor.onMounted(() => {
      where_.value = props.where;
      listApi();
    });
    const reload = async (where) => {
      let newSearchWhere = {};
      if (where) {
        newSearchWhere = Object.assign(newSearchWhere, where);
      }
      searchWhere.value = newSearchWhere;
      await listApi(newSearchWhere);
    };
    const listApi = async (customSearchWhere = {}) => {
      try {
        const { Data } = await utils_http.Post(props.url, {
          Limit: 999,
          ...where_.value,
          ...customSearchWhere
        });
        const items = Data.Items;
        const newDataList = [];
        items.forEach((item) => {
          if (!props.filterValue.find((x) => {
            var _a;
            return x == ((_a = utils_comm.GetObjectValue(item, props.columnValue)) == null ? void 0 : _a.toString());
          })) {
            newDataList.push({
              text: utils_comm.GetObjectValue(item, props.columnName),
              value: utils_comm.GetObjectValue(item, props.columnValue).toString()
            });
          }
        });
        if (props.filterValue.filter((x) => x.toString() == selectValue.value).length > 0) {
          selectValue.value = void 0;
        }
        dataList.value = newDataList;
      } catch (error) {
      }
    };
    const PickerChange = () => {
      emit("update:modelValue", selectValue.value);
      emit("SelectCallBack", selectValue.value);
    };
    __expose({
      reload
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(PickerChange),
        b: common_vendor.o(($event) => selectValue.value = $event),
        c: common_vendor.p({
          localdata: dataList.value,
          primaryColor: "var(--primary-color)",
          clear: true,
          disabled: __props.disabled,
          modelValue: selectValue.value
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3df986b3"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/sigle-select/sigle-select.js.map
