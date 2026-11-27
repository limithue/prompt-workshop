const SCENES = {
  general:{
    label:"通用任务",
    role:"你是一位细致、专业的通用助手，善于把复杂需求拆解成清晰可执行的步骤，回答可靠且务实。",
    context:"用户希望得到可直接落地的帮助，而不是泛泛而谈。请结合常识与专业知识，给出有判断力的建议。",
    format:"请先给出一句话结论，再用编号分点说明关键内容，最后给出可操作的下一步建议。",
    example:"输入：帮我整理一下周末计划\n输出：一句话结论 → 1. 上午安排 → 2. 下午安排 → 3. 晚上安排 → 下一步建议",
    constraints:"不要编造不确定的事实；信息不足时主动说明并给出假设；语言简洁，避免空话套话。",
    raw:need=>"关于「"+need+"」，这个嘛，我觉得你可以多想想，上网查查资料，然后自己总结一下。其实这类问题挺常见的，你先试着做做看，遇到具体问题解决不了的话再来问我。希望能帮到你。",
    good:need=>"一句话结论：把「"+need+"」拆成目标、步骤和验证三部分，就能稳步推进。\n\n1. 明确目标：先定义清楚最终要交付什么，避免方向跑偏。\n2. 拆解步骤：把「"+need+"」拆成可以单独完成的小任务，排出先后顺序。\n3. 分配资源：估算每一步需要的时间和资料，找出关键依赖。\n4. 验证结果：对照目标逐项检查，发现问题及时回退修正。\n\n下一步建议：先写出第一版草稿，再按上面的清单逐条完善，不要追求一次到位。"
  },
  coding:{
    label:"编程开发",
    role:"你是一位资深软件工程师，代码风格规范，注重可读性、健壮性与可维护性。",
    context:"用户需要一个能跑通的技术方案，可能用于课程项目。技术选型应优先考虑成熟稳定、上手快的方案。",
    format:"请按以下结构输出：1) 需求拆解；2) 技术思路；3) 关键代码（用代码块）；4) 边界情况与测试建议。",
    example:"输入：写一个判断闰年的函数\n输出：需求拆解 → 思路（整除规则） → 代码（isLeapYear） → 测试（1900/2000/2024）",
    constraints:"代码需附必要注释；说明运行环境与依赖；不要使用已废弃的 API；不确定时明确说明假设。",
    raw:need=>"这个需求直接写代码就好了。你用 Python 或者 Java 都行，网上例子很多的，复制过来改一改就能跑。写完记得测试一下，有问题再调试。大概就是这样。",
    good:need=>"1. 需求拆解\n目标是实现「"+need+"」。核心包括：输入处理、主逻辑、结果输出三部分。\n\n2. 技术思路\n采用分层写法，主逻辑与界面分离，便于单独测试和后续扩展。优先使用标准库，减少外部依赖。\n\n3. 关键代码\n```python\ndef main(task):\n    # 参数校验\n    if not task:\n        raise ValueError(\"输入不能为空\")\n    # 核心处理\n    result = handle(task)\n    return result\n```\n\n4. 边界情况与测试建议\n- 空输入、异常格式要有兜底；\n- 正常值、边界值各测一组；\n- 建议写成单元函数，方便复用与自动测试。"
  },
  writing:{
    label:"文案写作",
    role:"你是一位资深品牌文案策划，擅长抓住受众心理，写出有温度、有传播力的文字。",
    context:"用户需要可直接发布的文案，重视标题吸引力、情绪共鸣与行动号召。",
    format:"请输出：3 个备选标题 + 正文（分短段）+ 一句行动号召，并说明每个标题适合的场景。",
    example:"输入：为校园跑步活动写宣传文案\n输出：标题A/B/C → 正文 → 行动号召 → 标题适用场景说明",
    constraints:"避免空泛口号和过度夸张；语气与目标受众匹配；控制篇幅，段落简短。",
    raw:need=>"帮你写一段关于"+need+"的文案。写得吸引人一点，有点意思就行，字数大概几百字吧。你自己看看哪里不满意再改改，可能需要多改几版。",
    good:need=>"【备选标题】\nA.《关于"+need+"，我想说的三件事》——适合正式推送\nB.《原来"+need+"可以这么简单》——适合社交平台\nC.《别再错过"+need+"了》——适合限时活动\n\n【正文】\n你有没有发现，很多事情难的不是开始，而是找不到一个值得开始的理由。\n\n"+need+"，就是这样一个理由。它不需要你做足准备，只要迈出第一步，后面的事会自然发生。\n\n我们把复杂的部分留给自己，把简单的体验交给你。\n\n【行动号召】\n现在就来试试，让改变从今天开始。\n\n【标题适用场景】A 强调内容价值，B 降低心理门槛，C 制造紧迫感。"
  },
  analysis:{
    label:"数据分析",
    role:"你是一位严谨的数据分析师，重视口径清晰、结论有据，善于把数据转化为可执行洞察。",
    context:"用户希望从数据中得到可靠结论，而非罗列数字。需要说明分析维度、方法与局限。",
    format:"请按结构输出：1) 分析目标；2) 数据维度与指标；3) 分析方法；4) 结论要点；5) 风险与局限。",
    example:"输入：分析本周步数变化\n输出：目标 → 维度（日期/时段） → 方法（环比） → 结论 → 数据局限",
    constraints:"明确数据口径与时间范围；不要过度解读相关关系为因果；指出样本局限。",
    raw:need=>"关于"+need+"这个分析，你可以先用 Excel 做做图表，看看趋势怎么样，然后写个报告。数据要注意准确，图表做得好看点，最后总结一下就行了。",
    good:need=>"1. 分析目标\n回答「"+need+"」的核心问题，并给出可执行的判断。\n\n2. 数据维度与指标\n- 时间维度：按日 / 周聚合，观察趋势；\n- 核心指标：总量、均值、环比变化；\n- 分组维度：按场景或人群拆分对比。\n\n3. 分析方法\n先做描述性统计看整体分布，再做趋势对比找异常点，最后对异常点做下钻分析。\n\n4. 结论要点\n- 整体走势平稳，个别时间点存在明显波动；\n- 波动与特定事件时间吻合，值得进一步验证；\n- 建议优先关注贡献最大的前 20% 样本。\n\n5. 风险与局限\n样本量有限，短期波动可能受偶然因素影响；相关关系不等于因果，结论需结合业务背景判断。"
  },
  study:{
    label:"学习辅导",
    role:"你是一位耐心的学科老师，善于用通俗类比解释抽象概念，循序渐进引导学习者理解。",
    context:"用户是在学习的学生，需要从零讲清楚，避免堆砌术语，最好配例子和自测题。",
    format:"请输出：1) 一句话理解；2) 生活化类比；3) 三个关键点；4) 一个小例子；5) 两道自测题（附答案）。",
    example:"输入：解释什么是递归\n输出：一句话理解 → 照镜子类比 → 关键点 → 阶乘例子 → 自测题",
    constraints:"先解释术语再使用；一次只讲一个概念；语气鼓励，不打击学习者；例子需贴近生活。",
    raw:need=>"这个概念你多读几遍课本，做几道题就明白了。不懂的地方可以问问老师或者同学。学习嘛，贵在坚持，慢慢来总会懂的。",
    good:need=>"1. 一句话理解\n「"+need+"」本质上就是：把一个复杂问题，转化成你更容易处理的形式。\n\n2. 生活化类比\n想象你在整理一箱乱衣服：不会一次全塞好，而是先按类别分开，再一叠叠放整齐。理解概念也是这样——先拆分，再逐个击破。\n\n3. 三个关键点\n- 先看整体：它要解决什么问题？\n- 再看结构：它由哪几部分组成？\n- 最后看联系：各部分之间怎么配合？\n\n4. 小例子\n以日常场景套用上面的三步，你会发现原本抽象的说法一下就具体了。\n\n5. 自测题\nQ1：这个概念主要解决什么问题？（答案：把复杂问题变简单）\nQ2：按哪三个步骤理解它？（答案：整体 → 结构 → 联系）\n\n先自己想一想再看答案，印象会更深。"
  },
  product:{
    label:"产品经理",
    role:"你是一位资深产品经理，擅长需求梳理、功能拆解与优先级判断，输出结构化、可落地的产品方案。",
    context:"用户要规划一个功能或产品，需要清晰的目标、用户价值与实施路径，避免拍脑袋决策。",
    format:"请输出：1) 一句话定位；2) 目标用户与核心痛点；3) 核心功能清单（按优先级）；4) 关键指标；5) 风险与建议。",
    example:"输入：做一个校园二手交易平台\n输出：定位 → 用户痛点 → 功能清单 → 指标 → 风险建议",
    constraints:"聚焦核心场景，不堆砌功能；优先级用 P0/P1/P2 标注；每个结论给出理由。",
    raw:need=>"做个"+need+"呗，现在大家都做这个，应该挺有市场的。你看着加些功能，最好功能多一点，界面好看点，能上线就行。",
    good:need=>"1. 一句话定位\n「"+need+"」是一个帮助目标用户解决核心痛点的产品，价值主张清晰可验证。\n\n2. 目标用户与核心痛点\n- 目标用户：有明确高频需求的人群；\n- 核心痛点：现有方案效率低、成本高或体验差。\n\n3. 核心功能清单\n- P0：最小可用闭环（能跑通主流程）；\n- P1：体验优化（降低使用门槛）；\n- P2：增值功能（留存与增长）。\n\n4. 关键指标\n- 北极星指标 + 转化率 + 留存率，先定一个主指标。\n\n5. 风险与建议\n先做小范围验证再铺开，避免过度设计；建议先出一版 MVP 收集真实反馈。"
  },
  translate:{
    label:"中英翻译",
    role:"你是一位专业的中英互译译员，译文准确、地道、符合目标语言习惯，保留原文语气与风格。",
    context:"用户需要高质量翻译，可能用于论文、邮件或文档，要求准确且不逐字硬译。",
    format:"请输出：1) 译文；2) 关键术语对照表；3) 翻译说明（处理了哪些难点）。",
    example:"输入：把「学而不思则罔」译成英文\n输出：译文 → 术语对照 → 翻译说明",
    constraints:"避免逐字直译与机翻腔；保留原文语气；专业术语需准确；必要时加括号注明。",
    raw:need=>"帮我翻译一下："+need+"。翻译成英文就行，尽量准确一点，别的没什么要求。",
    good:need=>"请将以下内容译成地道英文：\n「"+need+"」\n\n要求：\n1) 译文准确、自然，避免机翻腔，保留原文语气与风格；\n2) 提供关键术语的中英对照表；\n3) 简要说明你在翻译中处理的难点（如文化差异、专有名词）。\n\n请先给出译文，再给术语对照，最后说明。"
  }
};

const FIELDS = [
  {key:"role", label:"角色设定", tip:"你是谁"},
  {key:"task", label:"任务指令", tip:"要做什么"},
  {key:"context", label:"背景上下文", tip:"补充信息"},
  {key:"format", label:"输出格式", tip:"怎么输出"},
  {key:"example", label:"参考示例", tip:"给个样板"},
  {key:"constraints", label:"约束条件", tip:"边界与禁忌"}
];

const PROVIDERS = {
  deepseek:{base:"https://api.deepseek.com/v1", model:"deepseek-chat"},
  qwen:{base:"https://dashscope.aliyuncs.com/compatible-mode/v1", model:"qwen-plus"},
  kimi:{base:"https://api.moonshot.cn/v1", model:"moonshot-v1-8k"},
  openai:{base:"https://api.openai.com/v1", model:"gpt-4o-mini"},
  custom:{base:"", model:""}
};
const CFG_KEY = "prompt_workshop_cfg_v1";

// 随机示例需求库：{need, scene}
const EXAMPLES = [
  {need:"帮我写一个能统计每天步数、并生成每周运动周报的功能，要能分享给朋友看。", scene:"coding"},
  {need:"为校园迎新晚会写一段吸引人的宣传文案。", scene:"writing"},
  {need:"用通俗的方式给我讲清楚什么是「梯度下降」。", scene:"study"},
  {need:"分析一下我这周的消费记录，看看钱都花在哪了。", scene:"analysis"},
  {need:"规划一个校园二手书交易小程序。", scene:"product"},
  {need:"把「读万卷书，行万里路」翻译成英文并解释。", scene:"translate"},
  {need:"帮我写一个判断一个数是否是质数的函数。", scene:"coding"},
  {need:"写一封给导师的邮件，申请延长作业提交时间。", scene:"writing"}
];

// 质量评分维度（六要素自检）
const QUALITY_DIMS = [
  {key:"role", name:"角色设定", weight:15},
  {key:"task", name:"任务指令", weight:25},
  {key:"context", name:"背景上下文", weight:15},
  {key:"format", name:"输出格式", weight:20},
  {key:"example", name:"参考示例", weight:15},
  {key:"constraints", name:"约束条件", weight:10}
];

// 对比评分维度
const CMP_DIMS = [
  {name:"结构完整度", raw:30, good:95},
  {name:"具体可执行", raw:35, good:92},
  {name:"信息充分度", raw:40, good:90},
  {name:"结果可用性", raw:38, good:94}
];

let currentScene = "general";
let mode = "demo";
let built = false;

const $ = id => document.getElementById(id);
const els = {};
FIELDS.forEach(f=>{ els[f.key] = null; });

function toast(msg){
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>t.classList.remove("show"), 2200);
}

function renderScenes(){
  const box = $("scenes");
  box.innerHTML = "";
  Object.keys(SCENES).forEach(k=>{
    const b = document.createElement("button");
    b.className = "chip" + (k===currentScene ? " on":"");
    b.textContent = SCENES[k].label;
    b.type = "button";
    b.onclick = ()=>{
      currentScene = k;
      renderScenes();
      buildPrompt();
    };
    box.appendChild(b);
  });
}

function renderFields(){
  const box = $("eltList");
  box.innerHTML = "";
  FIELDS.forEach(f=>{
    const item = document.createElement("div");
    item.className = "elt-item";
    const head = document.createElement("div");
    head.className = "elt-head";
    head.innerHTML = '<span class="dot"></span><span></span><span style="margin-left:auto;color:#9aa2b1;font-weight:400"></span>';
    head.children[1].textContent = f.label;
    head.children[2].textContent = f.tip;
    const ta = document.createElement("textarea");
    ta.id = "f_" + f.key;
    ta.spellcheck = false;
    ta.addEventListener("input", updateAssembled);
    item.appendChild(head);
    item.appendChild(ta);
    box.appendChild(item);
    els[f.key] = ta;
  });
}

function getNeed(){
  return $("need").value.trim();
}

function buildPrompt(){
  const need = getNeed();
  if(!need){
    toast("请先写下你的需求");
    $("need").focus();
    return false;
  }
  const s = SCENES[currentScene];
  els.role.value = s.role;
  els.task.value = "请完成以下任务：" + need;
  els.context.value = s.context;
  els.format.value = s.format;
  els.example.value = s.example;
  els.constraints.value = s.constraints;
  updateAssembled();
  built = true;
  $("compareHint").textContent = "提示词已生成，点击左侧按钮开始对比";
  toast("已按「" + s.label + "」场景生成六要素提示词");
  return true;
}

function assembleText(){
  const parts = FIELDS.map(f=>{
    const name = {role:"角色",task:"任务",context:"背景",format:"输出格式",example:"参考示例",constraints:"约束条件"}[f.key];
    return "【" + name + "】\n" + (els[f.key] ? els[f.key].value.trim() : "");
  });
  return parts.join("\n\n");
}

function updateAssembled(){
  $("assembled").value = assembleText();
  renderQuality();
}

// 提示词质量自检：基于六要素填写完整度打分
function renderQuality(){
  const box = $("qualityBox");
  if(!box) return;
  box.style.display = built ? "" : "none";
  if(!built) return;
  const items = $("qualityItems");
  items.innerHTML = "";
  let total = 0;
  QUALITY_DIMS.forEach(d=>{
    const val = (els[d.key] ? els[d.key].value.trim() : "");
    // 内容越丰富得分越高（按长度+是否含关键标记粗略估计）
    const filled = val.length > 0;
    const rich = val.length > 40;
    const score = filled ? (rich ? Math.min(100, 70 + Math.round(val.length/4)) : 50) : 0;
    const wScore = Math.round(score * d.weight / 100);
    total += wScore;
    const item = document.createElement("div");
    item.className = "q-item";
    item.innerHTML =
      '<div class="q-row"><span class="q-name">'+d.name+'</span><span class="q-bar"><span class="q-fill" style="width:'+score+'%"></span></span><span class="q-score">'+score+'</span></div>';
    items.appendChild(item);
  });
  $("qualityTotal").textContent = total;
}

function computeCmpScores(){
  return {
    raw: CMP_DIMS.map(d=>({name:d.name, score:d.raw})),
    good: CMP_DIMS.map(d=>({name:d.name, score:d.good}))
  };
}

function renderCmpScore(){
  const panel = $("cmpScore");
  if(!panel) return;
  panel.style.display = built ? "" : "none";
  if(!built) return;
  const scores = computeCmpScores();
  fillScorePanel("rawScoreItems", "rawScoreTotal", scores.raw);
  fillScorePanel("goodScoreItems", "goodScoreTotal", scores.good);
  renderDiffHl();
}

function fillScorePanel(itemsId, totalId, dims){
  const box = $(itemsId);
  box.innerHTML = "";
  let total = 0;
  dims.forEach(d=>{
    total += d.score;
    const item = document.createElement("div");
    item.className = "s-item";
    item.innerHTML =
      '<span class="s-name">'+d.name+'</span><span class="s-bar"><span class="s-fill" style="width:'+d.score+'%"></span></span><span class="s-val">'+d.score+'</span>';
    box.appendChild(item);
  });
  $(totalId).textContent = total;
}

function renderDiffHl(){
  const hl = $("diffHl");
  if(!hl) return;
  hl.style.display = built ? "" : "none";
  if(!built) return;
  const s = SCENES[currentScene];
  const rawLen = s.raw(getNeed()).length;
  const goodLen = s.good(getNeed()).length;
  hl.innerHTML = "<b>差异一目了然：</b>原始问法只有 " + rawLen + " 字、结构松散；优化后提示词达到 " + goodLen + " 字，且按六要素组织，模型能给出更具体、更结构化的回答。这就是提示词工程的直接价值。";
}

function getResultText(){
  const need = getNeed();
  const s = SCENES[currentScene];
  const rawText = s.raw(need);
  const goodText = s.good(need);
  const prompt = assembleText();
  return "【需求】\n" + need + "\n\n" +
    "【场景】" + s.label + "\n\n" +
    "【原始提示词（大白话）】\n" + need + "\n\n" +
    "【优化后提示词（六要素）】\n" + prompt + "\n\n" +
    "【原始问法的回答】\n" + rawText + "\n\n" +
    "【优化后提示词的回答】\n" + goodText + "\n";
}

async function copyTextToClipboard(text, okMsg){
  try{
    await navigator.clipboard.writeText(text);
  }catch(e){
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  toast(okMsg || "已复制到剪贴板");
}

function exportMarkdown(){
  if(!built){ toast("请先生成提示词并完成对比"); return; }
  const text = getResultText();
  const blob = new Blob([text], {type:"text/markdown;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "提示词工坊对比结果.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
  toast("已导出 Markdown 文件");
}

function loadCfg(){
  try{
    const raw = localStorage.getItem(CFG_KEY);
    return raw ? Object.assign({}, PROVIDERS.deepseek, JSON.parse(raw)) : Object.assign({}, PROVIDERS.deepseek);
  }catch(e){ return Object.assign({}, PROVIDERS.deepseek); }
}
function saveCfg(cfg){
  localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
}

function openSetting(){
  const c = loadCfg();
  $("cfgProvider").value = c.provider || "deepseek";
  $("cfgBase").value = c.base || "";
  $("cfgKey").value = c.key || "";
  $("cfgModel").value = c.model || "";
  $("modalBg").classList.add("show");
}
function closeSetting(){ $("modalBg").classList.remove("show"); }

function setMode(m){
  mode = m;
  $("tabDemo").classList.toggle("on", m==="demo");
  $("tabApi").classList.toggle("on", m==="api");
  $("tabDemo").setAttribute("aria-selected", m==="demo");
  $("tabApi").setAttribute("aria-selected", m==="api");
  const st = $("status");
  if(m==="demo"){
    st.className = "status";
    st.innerHTML = "当前为<b>演示模式</b>：使用内置规则引擎生成结构化提示词并模拟两种回答，无需 API Key 即可完整演示。切换到「真实 API」可调用大模型。";
  }else{
    const c = loadCfg();
    if(!c.key){
      st.className = "status warn";
      st.innerHTML = "当前为<b>真实 API 模式</b>，但尚未配置密钥。请先点右上角「设置」填写 API Key；或切回演示模式。";
    }else{
      st.className = "status api";
      st.innerHTML = "当前为<b>真实 API 模式</b>：将使用 " + escapeHtml(c.model||"默认模型") + " 分别回答原始提示词与优化后提示词。";
    }
  }
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function renderAnswer(text){
  let h = escapeHtml(text);
  h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/\n/g, "<br>");
  return h;
}

async function callAPI(messages){
  const c = loadCfg();
  if(!c.key) throw new Error("未配置 API Key");
  const url = (c.base||"").replace(/\/$/,"") + "/chat/completions";
  const resp = await fetch(url,{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":"Bearer " + c.key},
    body:JSON.stringify({model:c.model, messages:messages, temperature:0.7})
  });
  const text = await resp.text();
  let data;
  try{ data = JSON.parse(text); }catch(e){ throw new Error("接口返回非 JSON：" + text.slice(0,160)); }
  if(!resp.ok) throw new Error("HTTP " + resp.status + "：" + (data.error && data.error.message ? data.error.message : text.slice(0,160)));
  if(!data.choices || !data.choices[0]) throw new Error("接口返回格式异常");
  return data.choices[0].message.content;
}

async function runCompare(){
  if(!built){
    if(!buildPrompt()) return;
  }
  const need = getNeed();
  const prompt = assembleText();
  const s = SCENES[currentScene];
  const rawBox = $("rawAns"), goodBox = $("goodAns");
  rawBox.innerHTML = '<span class="spin"></span>模型正在思考…';
  goodBox.innerHTML = '<span class="spin"></span>模型正在思考…';
  $("btnCompare").disabled = true;
  $("compareHint").textContent = "正在生成两份回答，请稍候…";

  try{
    if(mode === "demo"){
      await new Promise(r=>setTimeout(r, 700));
      const raw = s.raw(need);
      const good = s.good(need);
      await typeIn(rawBox, raw);
      await typeIn(goodBox, good);
    }else{
      const c = loadCfg();
      if(!c.key){
        throw new Error("请先在右上角「设置」中配置 API Key，或切换到演示模式");
      }
      const [a,b] = await Promise.all([
        callAPI([{role:"user",content:need}]),
        callAPI([{role:"system",content:prompt},{role:"user",content:need}])
      ]);
      rawBox.innerHTML = renderAnswer(a);
      goodBox.innerHTML = renderAnswer(b);
    }
    $("compareHint").textContent = "对比完成：右侧回答通常更有结构、更具体";
    renderCmpScore();
    $("exportRow").style.display = "";
  }catch(err){
    rawBox.innerHTML = '<div class="empty">生成失败：' + escapeHtml(err.message) + '</div>';
    goodBox.innerHTML = '<div class="empty">生成失败：' + escapeHtml(err.message) + '</div>';
    $("compareHint").textContent = "生成失败，请检查设置后重试";
    toast("生成失败：" + err.message);
  }finally{
    $("btnCompare").disabled = false;
  }
}

function typeIn(box, text){
  return new Promise(resolve=>{
    const lines = text.split("\n");
    let i = 0;
    box.innerHTML = "";
    const timer = setInterval(()=>{
      if(i >= lines.length){
        clearInterval(timer);
        resolve();
        return;
      }
      box.innerHTML += (i ? "<br>" : "") + renderAnswer(lines[i]);
      i++;
    }, 45);
  });
}

async function copyText(){
  const text = $("assembled").value;
  if(!text){ toast("还没有可复制的提示词"); return; }
  try{
    await navigator.clipboard.writeText(text);
  }catch(e){
    const ta = $("assembled");
    ta.removeAttribute("readonly");
    ta.select();
    document.execCommand("copy");
    ta.setAttribute("readonly","");
  }
  toast("提示词已复制到剪贴板");
}

function init(){
  renderScenes();
  renderFields();
  $("need").value = "帮我写一个能统计每天步数、并生成每周运动周报的功能，要能分享给朋友看。";
  setMode("demo");
  buildPrompt();

  $("btnBuild").onclick = buildPrompt;
  $("btnCopy").onclick = copyText;
  $("btnCompare").onclick = runCompare;
  $("btnExample").onclick = ()=>{
    const ex = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
    $("need").value = ex.need;
    currentScene = ex.scene;
    renderScenes();
    buildPrompt();
    toast("已填入随机示例（" + SCENES[ex.scene].label + "）");
  };
  $("btnExportMd").onclick = exportMarkdown;
  $("btnCopyResult").onclick = ()=>{
    if(!built){ toast("请先生成提示词并完成对比"); return; }
    copyTextToClipboard(getResultText(), "对比结果已复制");
  };
  $("tabDemo").onclick = ()=>setMode("demo");
  $("tabApi").onclick = ()=>setMode("api");
  $("btnSetting").onclick = openSetting;
  $("btnCancelCfg").onclick = closeSetting;
  $("modalBg").onclick = e=>{ if(e.target === $("modalBg")) closeSetting(); };
  $("cfgProvider").onchange = e=>{
    const p = PROVIDERS[e.target.value];
    if(p){ $("cfgBase").value = p.base; $("cfgModel").value = p.model; }
  };
  $("btnSaveCfg").onclick = ()=>{
    const cfg = {
      provider:$("cfgProvider").value,
      base:$("cfgBase").value.trim(),
      key:$("cfgKey").value.trim(),
      model:$("cfgModel").value.trim()
    };
    if(!cfg.base){ toast("请填写接口地址 Base URL"); return; }
    if(!cfg.key){ toast("请填写 API Key"); return; }
    saveCfg(cfg);
    closeSetting();
    setMode("api");
    toast("设置已保存到本机浏览器");
  };
}

init();