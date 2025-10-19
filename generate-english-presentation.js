const pptxgen = require("pptxgenjs");
const fs = require("fs");

// 创建新的演示文稿
const ppt = new pptxgen();

// 设置演示文稿属性
ppt.title = "SparkSpace - Decentralized Creative Trading Platform";
ppt.author = "SparkSpace Team";
ppt.company = "SparkSpace Project";

// 添加封面页
const coverSlide = ppt.addSlide();
coverSlide.background = { color: "2962FF" };
coverSlide.addText("SparkSpace", {
  x: 0.5,
  y: 1.5,
  w: 9,
  h: 1.5,
  fontSize: 36,
  bold: true,
  color: "FFFFFF",
  align: "center"
});
coverSlide.addText("Decentralized Creative Trading Platform", {
  x: 0.5,
  y: 3,
  w: 9,
  h: 1,
  fontSize: 24,
  color: "FFFFFF",
  align: "center"
});
coverSlide.addText("Start with the end in mind, connecting creativity with demand", {
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
overviewSlide.addText("Project Overview", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
overviewSlide.addText([
  { text: "Project Name: ", options: { bold: true } },
  { text: "SparkSpace v0.6\n" },
  { text: "Core Concept: ", options: { bold: true } },
  { text: "Start with the end in mind, helping creators find real demand through idea publishing\n" },
  { text: "Platform Positioning: ", options: { bold: true } },
  { text: "A decentralized creative trading platform where app developers, game developers, and teams can list their creative ideas and game resources" }
], {
  x: 0.5,
  y: 1.5,
  w: 5,
  h: 3,
  fontSize: 16,
  lineSpacing: 24
});

// 添加概念图
if (fs.existsSync("docs/img/生成游戏资源交易平台概念图.png")) {
  overviewSlide.addImage({
    path: "docs/img/生成游戏资源交易平台概念图.png",
    x: 6,
    y: 1.5,
    w: 3.5,
    h: 3
  });
}

// 添加市场痛点页
const 痛点Slide = ppt.addSlide();
痛点Slide.addText("Market Pain Points", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
痛点Slide.addText("• Inefficient traditional development process:立项, planning, development, then listing\n• Creators struggle to validate market demand for their ideas\n• Users lack channels to participate in and support creativity early on\n• Imbalanced resource allocation and high investment risks", {
  x: 0.5,
  y: 1.5,
  w: 9,
  h: 3,
  fontSize: 16,
  lineSpacing: 24
});

// 添加解决方案页
const solutionSlide = ppt.addSlide();
solutionSlide.addText("Solution", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
solutionSlide.addText("• Revolutionize the traditional process: List creative ideas first, find demand, then develop, iterate, and finally profit\n• Establish a creative publishing and trading platform\n• Users can support creativity with points, converted to \"Audience Expectation Value\"\n• Early supporters receive point rewards and discounts when the creative work is realized", {
  x: 0.5,
  y: 1.5,
  w: 5,
  h: 3,
  fontSize: 16,
  lineSpacing: 24
});

// 添加核心功能页
const featuresSlide = ppt.addSlide();
featuresSlide.addText("Core Features", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
featuresSlide.addText([
  { text: "Creator Module\n", options: { bold: true } },
  { text: "  List creative ideas and game resources (animations, characters, maps, demos, etc.)\n\n" },
  { text: "User Module\n", options: { bold: true } },
  { text: "  Browse, vote, buy, and sell game resources\n\n" },
  { text: "Points Module\n", options: { bold: true } },
  { text: "  Points as the basis for settlement; creators can issue their own point tokens to exchange for \"Audience Expectation Value\"" }
], {
  x: 0.5,
  y: 1.5,
  w: 5,
  h: 3.5,
  fontSize: 16,
  lineSpacing: 20
});

// 添加创意想法示例图
if (fs.existsSync("docs/img/创意想法.jpg")) {
  featuresSlide.addImage({
    path: "docs/img/创意想法.jpg",
    x: 6,
    y: 1.5,
    w: 3.5,
    h: 1.5
  });
}

// 添加AI蒙武动画示例图
if (fs.existsSync("docs/img/AI蒙武.gif")) {
  featuresSlide.addImage({
    path: "docs/img/AI蒙武.gif",
    x: 6,
    y: 3.2,
    w: 3.5,
    h: 1.8
  });
}

// 添加商业价值页
const valueSlide = ppt.addSlide();
valueSlide.addText("Business Value", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
valueSlide.addText([
  { text: "For Creators\n", options: { bold: true } },
  { text: "  Provide a platform to showcase work, validate market demand, and reduce investment risks\n\n" },
  { text: "For Users\n", options: { bold: true } },
  { text: "  Early participation in supporting creativity with point rewards and discounts\n\n" },
  { text: "For Platform\n", options: { bold: true } },
  { text: "  Generate revenue through transaction fees and advertising" }
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
profitSlide.addText("Profit Model", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});

// 添加积分机制图
if (fs.existsSync("docs/img/积分机制.jpg")) {
  profitSlide.addImage({
    path: "docs/img/积分机制.jpg",
    x: 0.5,
    y: 1.2,
    w: 5,
    h: 3
  });
}

profitSlide.addText("• Users earn CYKJ points through deposit/withdrawal/lending activities\n• Platform profit distribution: 10% to platform, 20% to investors, 70% to platform profit treasury", {
  x: 6,
  y: 1.5,
  w: 3.5,
  h: 1.5,
  fontSize: 16,
  lineSpacing: 24
});
profitSlide.addText("User Reward = Creative Profit × Audience Expectation Value / Total Creative Expectation Value", {
  x: 6,
  y: 3.2,
  w: 3.5,
  h: 0.5,
  fontSize: 16,
  bold: true
});

// 添加技术优势页
const techSlide = ppt.addSlide();
techSlide.addText("Technical Advantages", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
techSlide.addText("• AI-generated game resources to improve development efficiency\n• AI vibe coding technology for rapid prototyping\n• Solves game sprite image consistency issues to generate smooth animations\n• Focus on full-process creative ideas in the AI track\n• Provides efficient creative implementation tools", {
  x: 0.5,
  y: 1.5,
  w: 5,
  h: 2.5,
  fontSize: 16,
  lineSpacing: 24
});

// 添加导出格式示例图
if (fs.existsSync("docs/img/导出格式.jpg")) {
  techSlide.addImage({
    path: "docs/img/导出格式.jpg",
    x: 6,
    y: 1.5,
    w: 3.5,
    h: 2.5
  });
}

// 添加愿景展望页
const visionSlide = ppt.addSlide();
visionSlide.addText("Vision and Outlook", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
visionSlide.addText("• Transform the creative industry ecosystem to better reflect creative value\n• Expand support for more resource types like Unity packages\n• Build a complete creative ecosystem\n• Connect creators with users to achieve value co-creation\n• Reduce innovation risks with the \"start with the end in mind\" concept", {
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
summarySlide.addText("Summary", {
  x: 0,
  y: 0.5,
  w: "100%",
  h: 0.75,
  fontSize: 24,
  bold: true,
  color: "2962FF"
});
summarySlide.addText([
  { text: "Core Value: ", options: { bold: true } },
  { text: "Connect creators with users to achieve value co-creation\n" },
  { text: "Conceptual Advantage: ", options: { bold: true } },
  { text: "The \"start with the end in mind\" concept reduces innovation risks\n" },
  { text: "Technical Support: ", options: { bold: true } },
  { text: "Leverage AI technology to enhance development efficiency" }
], {
  x: 0.5,
  y: 1.5,
  w: 9,
  h: 2,
  fontSize: 16,
  lineSpacing: 24
});
summarySlide.addText("Thank You!", {
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
ppt.writeFile({ fileName: "SparkSpace_Project_Business_Value_and_Vision.pptx" }).then(() => {
  console.log("English presentation with images has been successfully generated!");
});