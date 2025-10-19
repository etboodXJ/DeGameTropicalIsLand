const pptxgen = require("pptxgenjs");

// 创建新的演示文稿
const ppt = new pptxgen();

// 设置演示文稿属性
ppt.title = "创意空间 - 去中心化创意交易平台";
ppt.author = "创意空间团队";
ppt.company = "创意空间项目";

// 添加封面页
const coverSlide = ppt.addSlide();
coverSlide.background = { color: "2962FF" };
coverSlide.addText("创意空间", {
  x: 0.5,
  y: 1.5,
  w: 9,
  h: 1.5,
  fontSize: 36,
  bold: true,
  color: "FFFFFF",
  align: "center"
});
coverSlide.addText("去中心化创意交易平台", {
  x: 0.5,
  y: 3,
  w: 9,
  h: 1,
  fontSize: 24,
  color: "FFFFFF",
  align: "center"
});
coverSlide.addText("以终为始，连接创意与需求", {
  x: 0.5,
  y: 4,
  w: 9,
  h: 1,
  fontSize: 18,
  color: "FFFFFF",
  align: "center"
});

// 添加项目概述页
const overviewSlide = ppt.addSlide();
overviewSlide.addText("项目概述", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
overviewSlide.addText([
  { text: "项目名称：", options: { bold: true } },
  { text: " 创意空间 v0.6\n" },
  { text: "核心理念：", options: { bold: true } },
  { text: " 以终为始，通过发布创意帮助创意者寻找真正需求\n" },
  { text: "平台定位：", options: { bold: true } },
  { text: " 去中心化的创意交易平台，让应用开发者、游戏开发者、团队可以上架自己的创意想法和游戏资源" }
], {
  x: 0.5,
  y: 1.5,
  w: 9,
  h: 3,
  fontSize: 16,
  lineSpacing: 24
});

// 添加市场痛点页
const 痛点Slide = ppt.addSlide();
痛点Slide.addText("市场痛点", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
痛点Slide.addText("• 传统开发流程效率低：先立项、计划、开发，再上架\n• 创意者难以验证想法的市场需求\n• 用户缺乏早期参与和支持创意的渠道\n• 资源配置不均衡，投资风险高", {
  x: 0.5,
  y: 1.5,
  w: 9,
  h: 3,
  fontSize: 16,
  lineSpacing: 24
});

// 添加解决方案页
const solutionSlide = ppt.addSlide();
solutionSlide.addText("解决方案", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
solutionSlide.addText("• 颠覆传统流程：先上架创意想法、找到需求、然后开发、接着迭代、最后盈利\n• 建立创意发布交易平台\n• 用户可通过积分投票支持创意，转换为\"观众期待值\"\n• 创意实现后，早期支持者获得积分奖励和优惠", {
  x: 0.5,
  y: 1.5,
  w: 9,
  h: 3,
  fontSize: 16,
  lineSpacing: 24
});

// 添加核心功能页
const featuresSlide = ppt.addSlide();
featuresSlide.addText("核心功能", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
featuresSlide.addText([
  { text: "创意者模块\n", options: { bold: true } },
  { text: "  上架创意想法、游戏资源（动画、角色、地图、demo等）\n\n" },
  { text: "用户模块\n", options: { bold: true } },
  { text: "  浏览、投票、购买、出售游戏资源\n\n" },
  { text: "积分模块\n", options: { bold: true } },
  { text: "  积分作为结算依据，作者可发行自己的积分币，换取\"观众期待值\"" }
], {
  x: 0.5,
  y: 1.5,
  w: 9,
  h: 3.5,
  fontSize: 16,
  lineSpacing: 20
});

// 添加商业价值页
const valueSlide = ppt.addSlide();
valueSlide.addText("商业价值", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
valueSlide.addText([
  { text: "为创意者\n", options: { bold: true } },
  { text: "  提供展示平台，验证市场需求，降低投资风险\n\n" },
  { text: "为用户\n", options: { bold: true } },
  { text: "  早期参与支持创意，获得积分奖励和优惠\n\n" },
  { text: "为平台\n", options: { bold: true } },
  { text: "  通过手续费和广告费实现盈利" }
], {
  x: 0.5,
  y: 1.5,
  w: 9,
  h: 3.5,
  fontSize: 16,
  lineSpacing: 20
});

// 添加盈利模式页
const profitSlide = ppt.addSlide();
profitSlide.addText("盈利模式", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
profitSlide.addText("• 用户资产存入/取出/借贷行为获得 CYKJ 积分\n• 平台盈利分配：10%平台、20%投资人、70%平台盈利金库", {
  x: 0.5,
  y: 1.5,
  w: 9,
  h: 1.5,
  fontSize: 16,
  lineSpacing: 24
});
profitSlide.addText("用户返利 = 创意盈利 × 观众期待值 / 创意总期待值", {
  x: 0.5,
  y: 3.2,
  w: 9,
  h: 0.5,
  fontSize: 16,
  bold: true
});

// 添加技术优势页
const techSlide = ppt.addSlide();
techSlide.addText("技术优势", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
techSlide.addText("• AI生成游戏资源，提高开发效率\n• AI vibe coding技术快速原型制作\n• 解决游戏精灵图片一致性问题，生成流畅动画\n• 关注AI赛道全流程的创意想法\n• 提供高效的创意实现工具", {
  x: 0.5,
  y: 1.5,
  w: 9,
  h: 2.5,
  fontSize: 16,
  lineSpacing: 24
});

// 添加愿景展望页
const visionSlide = ppt.addSlide();
visionSlide.addText("愿景展望", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
visionSlide.addText("• 改变创意产业生态，让创意价值得到更好体现\n• 扩展支持Unity package等更多资源类型\n• 构建完整的创意生态系统\n• 连接创意者与用户，实现价值共创\n• 以终为始的理念，降低创新风险", {
  x: 0.5,
  y: 1.5,
  w: 9,
  h: 2.5,
  fontSize: 16,
  lineSpacing: 24
});

// 添加总结页
const summarySlide = ppt.addSlide();
summarySlide.background = { color: "F5F5F5" };
summarySlide.addText("总结", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
summarySlide.addText([
  { text: "核心价值：", options: { bold: true } },
  { text: " 连接创意者与用户，实现价值共创\n" },
  { text: "理念优势：", options: { bold: true } },
  { text: " 以终为始的理念，降低创新风险\n" },
  { text: "技术支撑：", options: { bold: true } },
  { text: " 利用AI技术提升开发效率" }
], {
  x: 0.5,
  y: 1.5,
  w: 9,
  h: 2,
  fontSize: 16,
  lineSpacing: 24
});
summarySlide.addText("谢谢！", {
  x: 0.5,
  y: 4,
  w: 9,
  h: 1,
  fontSize: 24,
  bold: true,
  color: "2962FF",
  align: "center"
});

// 保存演示文稿
ppt.writeFile({ fileName: "创意空间项目商业价值与愿景.pptx" }).then(() => {
  console.log("演示文稿已成功生成！");
});