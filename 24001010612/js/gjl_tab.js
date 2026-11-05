/* ============================================================
   作者：葛佳磊
   建立时间：2026-11-02 13:39
   使用模型：GLM-5.3-Flash
   功能名称及简介：gjl_tab.js —— 可复用的 Tab 选项卡组件
   说明：
     - 对外暴露 gjl_initTabs(选项卡容器id, 面板容器id) 一个工厂函数
     - 任何页面只要按约定写好选项卡按钮（带 data-gjl-tab 属性）
       与同数量的面板，即可调用本函数复用整套切换逻辑
     - 核心思路：事件监听（事件委托）→ 先清除所有选项卡的
       选中状态 → 再设置当前元素的选中状态
   ============================================================ */
"use strict";

/**
 * 作者：葛佳磊 | 建立时间：2026-11-02 13:39 | 使用模型：GLM-5.3-Flash
 * 功能：gjl_initTabs —— 初始化一组选项卡（可复用入口）
 * @param {string} gjl_tabBoxId   选项卡按钮容器 id
 * @param {string} gjl_panelBoxId 内容面板容器 id（子元素顺序与按钮一一对应）
 * @returns {{gjl_switchTo: Function}} 返回切换接口，供外部编程式控制
 */
function gjl_initTabs(gjl_tabBoxId, gjl_panelBoxId) {
  var gjl_tabBox = document.getElementById(gjl_tabBoxId);
  var gjl_panelBox = document.getElementById(gjl_panelBoxId);
  var gjl_tabs = gjl_tabBox.querySelectorAll("[data-gjl-tab]");
  var gjl_panels = gjl_panelBox.children;

  /**
   * 作者：葛佳磊 | 建立时间：2026-11-02 13:39 | 使用模型：GLM-5.3-Flash
   * 功能：gjl_clearActive —— 清除所有选项卡与面板的选中状态（移除 gjl_active 类）
   */
  function gjl_clearActive() {
    var gjl_i;
    for (gjl_i = 0; gjl_i < gjl_tabs.length; gjl_i++) {
      gjl_tabs[gjl_i].classList.remove("gjl_active");
    }
    for (gjl_i = 0; gjl_i < gjl_panels.length; gjl_i++) {
      gjl_panels[gjl_i].classList.remove("gjl_active");
    }
  }

  /**
   * 作者：葛佳磊 | 建立时间：2026-11-02 13:39 | 使用模型：GLM-5.3-Flash
   * 功能：gjl_setActive —— 设置第 gjl_index 个选项卡与对应面板为选中状态
   */
  function gjl_setActive(gjl_index) {
    gjl_tabs[gjl_index].classList.add("gjl_active");
    gjl_panels[gjl_index].classList.add("gjl_active");
  }

  /**
   * 作者：葛佳磊 | 建立时间：2026-11-02 13:39 | 使用模型：GLM-5.3-Flash
   * 功能：gjl_switchTo —— 切换到第 gjl_index 个选项卡
   *       核心模式：先清除所有选中状态，再设置当前元素的选中状态
   */
  function gjl_switchTo(gjl_index) {
    gjl_clearActive();
    gjl_setActive(gjl_index);
  }

  /* 事件监听（事件委托）：点击容器内任意 [data-gjl-tab] 按钮即触发切换 */
  gjl_tabBox.addEventListener("click", function (gjl_e) {
    var gjl_btn = gjl_e.target.closest("[data-gjl-tab]");
    if (!gjl_btn) { return; }                       // 点在按钮以外不处理
    gjl_switchTo(Number(gjl_btn.getAttribute("data-gjl-tab")));
  });

  /* 初始化：默认选中第 0 个选项卡（国内新闻） */
  gjl_switchTo(0);

  /* 返回接口，供外部（如自动轮播、键盘导航）复用 */
  return { gjl_switchTo: gjl_switchTo };
}
