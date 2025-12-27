"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_nav_bar2 + _easycom_uni_tag2 + _easycom_uni_icons2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_tag + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "AiAnalyse",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    const loading = common_vendor.ref(false);
    const error = common_vendor.ref(false);
    const Data = common_vendor.ref(null);
    const analysisResult = common_vendor.ref(null);
    const activeTab = common_vendor.ref("overview");
    const scrollThrottleTimer = common_vendor.ref(null);
    const sectionPositions = common_vendor.ref([]);
    const recalcTimer = common_vendor.ref(null);
    const analysisData = common_vendor.reactive({
      UserId: "",
      Days: 7
    });
    const tabList = common_vendor.ref([
      { id: "overview", name: "总评", emoji: "🎯" },
      { id: "risks", name: "风险", emoji: "⚠️" },
      { id: "nutrition", name: "营养", emoji: "🥗" },
      { id: "sport", name: "运动", emoji: "🏃‍♂️" },
      { id: "indicators", name: "指标", emoji: "📊" },
      { id: "recommendations", name: "建议", emoji: "💡" }
    ]);
    common_vendor.onLoad(async (option) => {
      analysisData.UserId = UserId.value;
      getAiAnalyseApi();
    });
    const debouncedRecalculate = () => {
      if (recalcTimer.value) {
        clearTimeout(recalcTimer.value);
      }
      recalcTimer.value = setTimeout(() => {
        if (analysisResult.value) {
          calculateSectionPositions();
        }
      }, 300);
    };
    common_vendor.onShow(async () => {
      common_vendor.index.onWindowResize(() => {
        debouncedRecalculate();
      });
    });
    common_vendor.onPageScroll((e) => {
      if (!analysisResult.value)
        return;
      if (scrollThrottleTimer.value) {
        clearTimeout(scrollThrottleTimer.value);
      }
      scrollThrottleTimer.value = setTimeout(() => {
        updateActiveTab(e.scrollTop);
      }, 50);
    });
    common_vendor.onReady(async () => {
      if (analysisResult.value) {
        await common_vendor.nextTick$1();
        setTimeout(() => {
          calculateSectionPositions();
        }, 200);
      }
    });
    const getAiAnalyseApi = async () => {
      try {
        loading.value = true;
        error.value = false;
        analysisResult.value = null;
        let response = await utils_http.Post("/AiAnalyse/AnalyzeUserHealth", {
          UserId: UserId.value,
          Days: 7
        });
        Data.value = response.Data;
        analysisResult.value = response.Data.AnalysisResult;
        await common_vendor.nextTick$1();
        setTimeout(() => {
          calculateSectionPositions();
        }, 100);
      } catch (err) {
        error.value = true;
        common_vendor.index.__f__("error", "at pages/Front/AiAnalyse.vue:358", "AI分析失败:", err);
        common_vendor.index.showToast({
          title: "分析失败，请稍后重试",
          icon: "error"
        });
      } finally {
        loading.value = false;
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const getHealthLevelClass = () => {
      const level = analysisResult.value.HealthLevel;
      if (level === "优秀")
        return "level-excellent";
      if (level === "良好")
        return "level-good";
      if (level === "一般")
        return "level-average";
      return "level-poor";
    };
    const getRiskLevelType = (level) => {
      if (level === "高")
        return "error";
      if (level === "中")
        return "warning";
      return "success";
    };
    const getIndicatorStatusType = (status) => {
      if (status === "正常")
        return "success";
      if (status === "偏高" || status === "偏低")
        return "warning";
      return "error";
    };
    const getPriorityType = (priority) => {
      if (priority === "高")
        return "error";
      if (priority === "中")
        return "warning";
      return "primary";
    };
    const formatAnalysisTime = (timeString) => {
      const date = new Date(timeString);
      return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const getRiskEmoji = (riskType) => {
      if (riskType.includes("体重"))
        return "⚖️";
      if (riskType.includes("血糖"))
        return "🩸";
      if (riskType.includes("营养"))
        return "🥗";
      if (riskType.includes("运动"))
        return "🏃‍♂️";
      if (riskType.includes("心血管"))
        return "❤️";
      return "⚠️";
    };
    const getIndicatorEmoji = (indicatorName) => {
      if (indicatorName.includes("体重"))
        return "⚖️";
      if (indicatorName.includes("血糖"))
        return "🩸";
      if (indicatorName.includes("血氧"))
        return "🩸";
      if (indicatorName.includes("肺活量"))
        return "💨";
      if (indicatorName.includes("体温"))
        return "🌡️";
      if (indicatorName.includes("甲状腺"))
        return "🦋";
      return "📊";
    };
    const getRecommendationEmoji = (recommendationType) => {
      if (recommendationType === "医疗")
        return "🏥";
      if (recommendationType === "饮食")
        return "🍽️";
      if (recommendationType === "运动")
        return "🏃‍♂️";
      if (recommendationType === "生活习惯")
        return "🏡";
      return "💡";
    };
    const scrollToSection = async (sectionId) => {
      activeTab.value = sectionId;
      await common_vendor.nextTick$1();
      const query = common_vendor.index.createSelectorQuery();
      query.select(`#${sectionId}`).boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec((res) => {
        if (res[0]) {
          let targetScrollTop;
          targetScrollTop = res[0].top + res[1].scrollTop - 180;
          common_vendor.index.pageScrollTo({
            scrollTop: Math.max(0, targetScrollTop),
            // 确保不会滚动到负值
            duration: 300
          });
        }
      });
    };
    const calculateSectionPositions = async () => {
      if (!analysisResult.value)
        return;
      await common_vendor.nextTick$1();
      const sectionIds = ["overview", "risks", "nutrition", "sport", "indicators", "recommendations"];
      const positions = [];
      return new Promise((resolve) => {
        let completed = 0;
        sectionIds.forEach((sectionId, index) => {
          const query = common_vendor.index.createSelectorQuery();
          query.select(`#${sectionId}`).boundingClientRect();
          query.selectViewport().scrollOffset();
          query.exec((res) => {
            if (res[0] && res[1]) {
              positions[index] = {
                id: sectionId,
                top: res[0].top + res[1].scrollTop,
                bottom: res[0].top + res[1].scrollTop + res[0].height
              };
            }
            completed++;
            if (completed === sectionIds.length) {
              sectionPositions.value = positions.filter((p) => p).sort((a, b) => a.top - b.top);
              resolve();
            }
          });
        });
      });
    };
    const updateActiveTab = (scrollTop) => {
      if (!analysisResult.value || sectionPositions.value.length === 0)
        return;
      let offsetTop;
      offsetTop = 280;
      const adjustedScrollTop = scrollTop + offsetTop;
      for (let i = sectionPositions.value.length - 1; i >= 0; i--) {
        const section = sectionPositions.value[i];
        if (adjustedScrollTop >= section.top) {
          if (activeTab.value !== section.id) {
            activeTab.value = section.id;
          }
          break;
        }
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.p({
          dark: true,
          fixed: true,
          shadow: true,
          ["background-color"]: "var(--primary-color)",
          ["status-bar"]: true,
          ["left-icon"]: "left",
          ["left-text"]: "返回",
          title: "AI智能分析"
        }),
        c: analysisResult.value
      }, analysisResult.value ? {
        d: common_vendor.f(tabList.value, (tab, index, i0) => {
          return {
            a: common_vendor.t(tab.emoji),
            b: common_vendor.t(tab.name),
            c: index,
            d: activeTab.value === tab.id ? 1 : "",
            e: common_vendor.o(($event) => scrollToSection(tab.id), index)
          };
        })
      } : {}, {
        e: loading.value
      }, loading.value ? {
        f: common_vendor.t(analysisData.Days)
      } : analysisResult.value ? {
        h: common_vendor.t(analysisResult.value.OverallHealthScore),
        i: common_vendor.t(analysisResult.value.HealthLevel),
        j: common_vendor.n(getHealthLevelClass()),
        k: common_vendor.t(analysisResult.value.Summary),
        l: common_vendor.f(analysisResult.value.HealthRisks, (risk, index, i0) => {
          return {
            a: common_vendor.t(getRiskEmoji(risk.RiskType)),
            b: common_vendor.t(risk.RiskType),
            c: "3b5a3068-1-" + i0,
            d: common_vendor.p({
              text: risk.RiskLevel,
              type: getRiskLevelType(risk.RiskLevel),
              size: "mini"
            }),
            e: common_vendor.t(risk.Description),
            f: common_vendor.t(risk.Suggestions),
            g: index
          };
        }),
        m: analysisResult.value.NutritionAnalysis.NutritionBalanceScore + "%",
        n: common_vendor.t(analysisResult.value.NutritionAnalysis.NutritionBalanceScore),
        o: common_vendor.t(analysisResult.value.NutritionAnalysis.CalorieIntakeAssessment),
        p: common_vendor.t(analysisResult.value.NutritionAnalysis.ProteinAssessment),
        q: common_vendor.t(analysisResult.value.NutritionAnalysis.CarbohydrateAssessment),
        r: common_vendor.t(analysisResult.value.NutritionAnalysis.FatAssessment),
        s: common_vendor.f(analysisResult.value.NutritionAnalysis.DietaryRecommendations, (recommendation, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(recommendation),
            c: index
          };
        }),
        t: analysisResult.value.SportAnalysis.ExerciseFrequencyScore + "%",
        v: common_vendor.t(analysisResult.value.SportAnalysis.ExerciseFrequencyScore),
        w: common_vendor.t(analysisResult.value.SportAnalysis.ExerciseVolumeAssessment),
        x: common_vendor.t(analysisResult.value.SportAnalysis.CaloriesBurnedAssessment),
        y: common_vendor.t(analysisResult.value.SportAnalysis.ExerciseVarietyAssessment),
        z: common_vendor.f(analysisResult.value.SportAnalysis.ExerciseRecommendations, (recommendation, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(recommendation),
            c: index
          };
        }),
        A: common_vendor.f(analysisResult.value.IndicatorAnalyses, (indicator, index, i0) => {
          return {
            a: common_vendor.t(getIndicatorEmoji(indicator.IndicatorName)),
            b: common_vendor.t(indicator.IndicatorName),
            c: "3b5a3068-2-" + i0,
            d: common_vendor.p({
              text: indicator.Status,
              type: getIndicatorStatusType(indicator.Status),
              size: "mini"
            }),
            e: common_vendor.t(indicator.CurrentValue),
            f: common_vendor.t(indicator.NormalRange),
            g: common_vendor.t(indicator.Trend),
            h: common_vendor.t(indicator.Advice),
            i: index
          };
        }),
        B: common_vendor.f(analysisResult.value.Recommendations, (recommendation, index, i0) => {
          return {
            a: common_vendor.t(getRecommendationEmoji(recommendation.RecommendationType)),
            b: common_vendor.t(recommendation.Title),
            c: "3b5a3068-3-" + i0,
            d: common_vendor.p({
              text: recommendation.Priority,
              type: getPriorityType(recommendation.Priority),
              size: "mini"
            }),
            e: common_vendor.t(recommendation.RecommendationType),
            f: common_vendor.t(recommendation.Content),
            g: common_vendor.t(recommendation.ExpectedEffect),
            h: index
          };
        }),
        C: common_vendor.t(formatAnalysisTime(Data.value.AnalysisTime))
      } : error.value ? {
        E: common_vendor.p({
          type: "info",
          size: "60",
          color: "#ff6b6b"
        }),
        F: common_vendor.o(getAiAnalyseApi)
      } : {}, {
        g: analysisResult.value,
        D: error.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3b5a3068"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/AiAnalyse.js.map
