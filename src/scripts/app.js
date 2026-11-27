const SCENES = {
  general:{
    label:"通用任务",
    role:"你是一位细致、专业的通用助手，善于把复杂需求拆解成清晰可执行的步骤，回答可靠且务实。",
    context:"用户希望得到可直接落地的帮助，而不是泛泛而谈。请结合常识与专业知识，给出有判断力的建议。",
    format:"请先给出一句话结论，再用编号分点说明关键内容，最后给出可操作的下一步建议。",
    example:"输入：帮我整理一下周末计划\n输出：一句话结论 → 1. 上午安排 → 2. 下午安排 → 3. 晚上安排 → 下一步建议",
    constraints:"不要编造不确定的事实；信息不足时主动说明并给出假设；语言简洁，避免空话套话。",
    raw:need=>"关于「"+need+"」，这个嘛，我觉得你可以多想想，上网查查资料，然后自己总结一下。其实这类问题挺常见的，你先试着做做看，遇到具体问题解决不了的话再来问我。希望能帮到你。",
    good:need=>{
      const goals = splitGoals(need);
      return "一句话结论：这件事可以拆成 " + goals.length + " 个子目标逐个完成，不要指望一步做完。\n\n" +
        goalLines(need) +
        "\n\n执行步骤：\n1. 先定交付物：明确「" + goals[0] + "」最终要产出什么，标准写下来。\n2. 逐个完成：按上面顺序做，每完成一个就打勾确认。\n3. 回查修正：全部做完后对照目标检查，缺哪块补哪块。\n\n下一步建议：先动手做子目标 1，卡住时把具体问题记下来，不要停在原地空想。";
    }
  },
  coding:{
    label:"编程开发",
    role:"你是一位资深软件工程师，代码风格规范，注重可读性、健壮性与可维护性。",
    context:"用户需要一个能跑通的技术方案，可能用于课程项目。技术选型应优先考虑成熟稳定、上手快的方案。",
    format:"请按以下结构输出：1) 需求拆解；2) 技术思路；3) 关键代码（用代码块）；4) 边界情况与测试建议。",
    example:"输入：写一个判断闰年的函数\n输出：需求拆解 → 思路（整除规则） → 代码（isLeapYear） → 测试（1900/2000/2024）",
    constraints:"代码需附必要注释；说明运行环境与依赖；不要使用已废弃的 API；不确定时明确说明假设。",
    raw:need=>"这个需求直接写代码就好了。你用 Python 或者 Java 都行，网上例子很多的，复制过来改一改就能跑。写完记得测试一下，有问题再调试。大概就是这样。",
    good:need=>{
      const goals = splitGoals(need);
      return "1. 需求拆解\n目标：" + need + "\n可拆成 " + goals.length + " 个子目标：\n" + goalLines(need) +
        "\n\n2. 技术思路\n每个子目标各自独立成函数，主流程只负责编排与汇总；数据存取走标准库，避免额外依赖。\n\n3. 关键代码\n```python\n" +
        demoCode(need, goals) +
        "\n```\n\n4. 边界情况与测试建议\n" + demoEdgeCases(need);
    }
  },
  writing:{
    label:"文案写作",
    role:"你是一位资深品牌文案策划，擅长抓住受众心理，写出有温度、有传播力的文字。",
    context:"用户需要可直接发布的文案，重视标题吸引力、情绪共鸣与行动号召。",
    format:"请输出：3 个备选标题 + 正文（分短段）+ 一句行动号召，并说明每个标题适合的场景。",
    example:"输入：为校园跑步活动写宣传文案\n输出：标题A/B/C → 正文 → 行动号召 → 标题适用场景说明",
    constraints:"避免空泛口号和过度夸张；语气与目标受众匹配；控制篇幅，段落简短。",
    raw:need=>"帮你写一段关于"+need+"的文案。写得吸引人一点，有点意思就行，字数大概几百字吧。你自己看看哪里不满意再改改，可能需要多改几版。",
    good:need=>{
      const goals = splitGoals(need);
      return "【备选标题】\nA.《关于" + goals[0] + "，我想说的三件事》——适合正式推送\nB.《原来" + goals[0] + "可以这么简单》——适合社交平台\nC.《别再错过" + goals[0] + "了》——适合限时活动\n\n【正文】\n围绕「" + goals[0] + "」，先把读者最关心的一个点说清。\n\n接下来按这几点展开：\n" + goalLines(need) + "\n\n每一点都配一个具体场景，不用大词，读者能立刻对号入座。\n\n【行动号召】\n现在就试一次，把第一步走通。\n\n【标题适用场景】A 强调内容价值，B 降低心理门槛，C 制造紧迫感。";
    }
  },
  analysis:{
    label:"数据分析",
    role:"你是一位严谨的数据分析师，重视口径清晰、结论有据，善于把数据转化为可执行洞察。",
    context:"用户希望从数据中得到可靠结论，而非罗列数字。需要说明分析维度、方法与局限。",
    format:"请按结构输出：1) 分析目标；2) 数据维度与指标；3) 分析方法；4) 结论要点；5) 风险与局限。",
    example:"输入：分析本周步数变化\n输出：目标 → 维度（日期/时段） → 方法（环比） → 结论 → 数据局限",
    constraints:"明确数据口径与时间范围；不要过度解读相关关系为因果；指出样本局限。",
    raw:need=>"关于"+need+"这个分析，你可以先用 Excel 做做图表，看看趋势怎么样，然后写个报告。数据要注意准确，图表做得好看点，最后总结一下就行了。",
    good:need=>{
      const goals = splitGoals(need);
      const dims = goals.map((g,i)=>"- 维度 " + (i+1) + "：" + g + "（按日 / 周聚合，看趋势与占比）").join("\n");
      return "1. 分析目标\n回答「" + need + "」的核心问题，并给出可执行的判断。\n\n2. 数据维度与指标\n" + dims + "\n- 核心指标：总量、均值、环比变化。\n\n3. 分析方法\n先做描述性统计看整体分布，再按上述维度对比，最后对异常点下钻。\n\n4. 结论要点\n- 整体走势平稳，个别时间点存在明显波动；\n- 建议优先关注贡献最大的前 20% 样本。\n\n5. 风险与局限\n样本量有限，短期波动可能受偶然因素影响；相关关系不等于因果，结论需结合业务背景判断。";
    }
  },
  study:{
    label:"学习辅导",
    role:"你是一位耐心的学科老师，善于用通俗类比解释抽象概念，循序渐进引导学习者理解。",
    context:"用户是在学习的学生，需要从零讲清楚，避免堆砌术语，最好配例子和自测题。",
    format:"请输出：1) 一句话理解；2) 生活化类比；3) 三个关键点；4) 一个小例子；5) 两道自测题（附答案）。",
    example:"输入：解释什么是递归\n输出：一句话理解 → 照镜子类比 → 关键点 → 阶乘例子 → 自测题",
    constraints:"先解释术语再使用；一次只讲一个概念；语气鼓励，不打击学习者；例子需贴近生活。",
    raw:need=>"这个概念你多读几遍课本，做几道题就明白了。不懂的地方可以问问老师或者同学。学习嘛，贵在坚持，慢慢来总会懂的。",
    good:need=>{
      const goals = splitGoals(need);
      const topic = goals[0];
      const qs = goals.map((g,i)=>"Q" + (i+1) + "：「" + g + "」这件事最关键的一步是什么？（答案：先明确要解决的问题，再拆解步骤）").join("\n");
      return "1. 一句话理解\n「" + topic + "」本质上是把一个复杂问题，转化成你更容易处理的形式。\n\n2. 生活化类比\n想象整理一箱乱衣服：不会一次全塞好，而是先按类别分开，再一叠叠放整齐。理解" + topic + "也是这样——先拆分，再逐个击破。\n\n3. 三个关键点\n- 先看整体：它要解决什么问题？\n- 再看结构：它由哪几部分组成？\n- 最后看联系：各部分之间怎么配合？\n\n4. 小例子\n拿「" + topic + "」套用上面的三步，先问它解决什么问题，再看它的组成部分，最后看怎么串起来。\n\n5. 自测题\n" + qs + "\n\n先自己想一想再看答案，印象会更深。";
    }
  },
  product:{
    label:"产品经理",
    role:"你是一位资深产品经理，擅长需求梳理、功能拆解与优先级判断，输出结构化、可落地的产品方案。",
    context:"用户要规划一个功能或产品，需要清晰的目标、用户价值与实施路径，避免拍脑袋决策。",
    format:"请输出：1) 一句话定位；2) 目标用户与核心痛点；3) 核心功能清单（按优先级）；4) 关键指标；5) 风险与建议。",
    example:"输入：做一个校园二手交易平台\n输出：定位 → 用户痛点 → 功能清单 → 指标 → 风险建议",
    constraints:"聚焦核心场景，不堆砌功能；优先级用 P0/P1/P2 标注；每个结论给出理由。",
    raw:need=>"做个"+need+"呗，现在大家都做这个，应该挺有市场的。你看着加些功能，最好功能多一点，界面好看点，能上线就行。",
    good:need=>{
      const goals = splitGoals(need);
      const funcs = goals.map((g, i)=>"- " + (i < 2 ? "P0" : "P1") + "：" + g).join("\n");
      return "1. 一句话定位\n「" + need + "」面向有明确场景需求的用户，先用最小闭环验证价值，再谈扩展。\n\n2. 目标用户与核心痛点\n- 目标用户：愿意为解决这件事花时间的人；\n- 核心痛点：现有做法步骤多、反馈慢、结果不可复用。\n\n3. 核心功能清单\n" + funcs + "\n\n4. 关键指标\n- 主指标（北极星）：核心动作是否被完成；\n- 辅助指标：完成率、次日留存、单次耗时。\n\n5. 风险与建议\n先用两周小范围验证收集真实反馈，再决定是否追加功能，避免一开始就堆 P2。";
    }
  },
  translate:{
    label:"中英翻译",
    role:"你是一位专业的中英互译译员，译文准确、地道、符合目标语言习惯，保留原文语气与风格。",
    context:"用户需要高质量翻译，可能用于论文、邮件或文档，要求准确且不逐字硬译。",
    format:"请输出：1) 译文；2) 关键术语对照表；3) 翻译说明（处理了哪些难点）。",
    example:"输入：把「学而不思则罔」译成英文\n输出：译文 → 术语对照 → 翻译说明",
    constraints:"避免逐字直译与机翻腔；保留原文语气；专业术语需准确；必要时加括号注明。",
    raw:need=>"帮我翻译一下："+need+"。翻译成英文就行，尽量准确一点，别的没什么要求。",
    good:need=>{
      const terms = extractTerms(need);
      const rows = terms.map((t,i)=>{
        const en = DEMO_GLOSSARY[t] || "(待确认，建议切真实 API)";
        return (i+1) + ") " + t + " → " + en;
      }).join("\n");
      return "【译文】\n" + demoTranslation(need, terms[0] || need) +
        "\n\n【关键术语对照】\n" + rows +
        "\n\n【翻译说明】\n1. 主句语序按英文习惯重排，避免逐字硬译；\n2. 专有名词与术语保留原意，未强行意译；\n3. 语气与原文一致，正式程度不变。";
    }
  }
};

// —— 演示模式辅助：把需求拆成子目标，并生成与需求相关的示例代码 ——

// 从翻译需求里抽取真正的词条：优先取「书名号」里的内容，其次按逗号切短语
function extractTerms(need){
  const text = String(need || "");
  const quoted = [...text.matchAll(/[「「]([^」]+)[」」]/g)].map(m=>m[1].trim());
  if(quoted.length) return quoted.slice(0, 4);
  return text.split(/[，,、；;]/).map(s=>s.trim()).filter(s=>s.length>=2).slice(0, 4);
}

// 中英翻译场景的已知词条（演示用）；未收录的会显式标注"待确认"，不编
const DEMO_GLOSSARY = {
  "读万卷书": "Read ten thousand books",
  "行万里路": "Travel ten thousand miles",
  "学而不思则罔": "Learning without thought is labor lost",
  "学以致用": "Apply what one has learned"
};

// 已知谚语给译文，未知文本给英文占位并明确说明，避免伪造译文
function demoTranslation(need, topic){
  const known = DEMO_GLOSSARY[topic];
  if(known) return topic + " — " + known;
  if(/读万卷书|行万里路/.test(need)) return "Read ten thousand books; travel ten thousand miles.";
  if(/学而不思/.test(need)) return "Learning without thought is labor lost; thought without learning is perilous.";
  return "[演示模式说明] 该文本未内置参考译文，请切到「真实 API」获取真实翻译。";
}

// 按「并 / 、 / ， / 和 / 且」等连接词把需求切成子目标，避免所有需求得到同一段回答
function splitGoals(need){
  const cleaned = String(need || "").replace(/[。？！?!]/g, "").trim();
  const parts = cleaned.split(/并|、|，|,|；|;|和|且|然后/)
    .map(s=>s.trim())
    .filter(s=>s.length >= 2);
  return parts.length >= 2 ? parts.slice(0, 5) : [cleaned];
}

function goalLines(need){
  return splitGoals(need).map((g, i)=>"- 子目标 " + (i + 1) + "：" + g).join("\n");
}

// 按需求关键词给出真正可运行的示例代码；没命中关键词时，把子目标写进 TODO 骨架
function demoCode(need, goals){
  if(/步数|计步|运动|周报|健康/.test(need)){
    return [
      "from collections import defaultdict",
      "from datetime import date",
      "",
      "def weekly_report(records):",
      '    """records: [{"date": "2026-11-20", "steps": 8300}, ...]"""',
      "    by_week = defaultdict(int)",
      "    for r in records:",
      '        y, w, _ = date.fromisoformat(r["date"]).isocalendar()',
      '        by_week[(y, w)] += r["steps"]',
      '    return [{"week": f"{y}-W{w}", "total": t} for (y, w), t in sorted(by_week.items())]',
      "",
      'if __name__ == "__main__":',
      '    demo = [{"date": "2026-11-16", "steps": 7200}, {"date": "2026-11-17", "steps": 9300}]',
      "    print(weekly_report(demo))"
    ].join("\n");
  }
  if(/质数|素数/.test(need)){
    return [
      "def is_prime(n):",
      "    if n < 2:",
      "        return False",
      "    if n % 2 == 0:",
      "        return n == 2",
      "    i = 3",
      "    while i * i <= n:",
      "        if n % i == 0:",
      "            return False",
      "        i += 2",
      "    return True"
    ].join("\n");
  }
  const todos = goals.map((g, i)=>"    # 步骤 " + (i + 1) + "：" + g).join("\n");
  return [
    "def solve(payload):",
    '    """按需求依次完成下面几步，返回汇总结果。"""',
    todos,
    "    result = {}",
    "    return result"
  ].join("\n");
}

// 边界与测试建议：跟着需求走，避免「质数函数」也提示跨周跨年
function demoEdgeCases(need){
  if(/质数|素数/.test(need)){
    return "- 0、1、2 与负数边界要先处理；\n- 偶数可快速返回，大数只试到平方根；\n- 建议对 2、3、17、99、1000003 各测一次。";
  }
  if(/步数|计步|运动|周报|健康/.test(need)){
    return "- 空记录、字段缺失要有兜底；\n- 单日、跨周、跨年三种情况各测一组；\n- 建议对 0 步与异常大值各测一次。";
  }
  return "- 空输入、字段缺失要有兜底；\n- 正常值与边界值各测一组；\n- 每个子目标单独写单元测试，出问题能直接定位。";
}

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

// 对比评分维度：按回答文本的真实特征计算，不使用固定分数
const CMP_DIMS = ["结构完整度", "具体可执行", "信息充分度", "结果可用性"];

let currentScene = "general";
let mode = "demo";
let built = false;
// 上一次对比的原文回答，用于按真实文本打分
let lastRun = {raw:"", good:""};

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

// 按回答文本本身打分：结构、具体性、信息量、可用性，四项各 0-100，综合分取四项均值
function scoreAnswer(text){
  const body = String(text || "");
  const lines = body.split("\n").filter(l=>l.trim());
  const len = body.length;
  const pointLines = lines.filter(l=>/^\s*(\d+[.)、]|[-*]\s|Q\d|【)/.test(l)).length;
  const bullets = (body.match(/^\s*[-*]\s/gm) || []).length;
  const hasCode = /```/.test(body);
  const hasHead = /【|##|\d+\)/.test(body);
  const numberCount = (body.match(/\d+/g) || []).length;
  const verbCount = (body.match(/先|再|然后|建议|执行|运行|测试|检查|配置|输出|安装|导入/g) || []).length;

  const structure = Math.min(100, Math.round(pointLines * 11 + (hasHead ? 25 : 0) + (hasCode ? 20 : 0)));
  const concrete = Math.min(100, Math.round((hasCode ? 45 : 0) + Math.min(30, numberCount * 4) + Math.min(25, verbCount * 5)));
  const info = Math.min(100, Math.round(len / 3.2));
  const usable = Math.min(100, Math.round(pointLines * 9 + bullets * 3 + (hasCode ? 25 : 0) + Math.min(25, Math.round(len / 18))));

  return [
    {name:CMP_DIMS[0], score:structure},
    {name:CMP_DIMS[1], score:concrete},
    {name:CMP_DIMS[2], score:info},
    {name:CMP_DIMS[3], score:usable}
  ];
}

function computeCmpScores(){
  return {
    raw: scoreAnswer(lastRun.raw),
    good: scoreAnswer(lastRun.good)
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
  // 四项各 100 分，综合分取平均，保证与界面上的「/ 100」一致
  $(totalId).textContent = dims.length ? Math.round(total / dims.length) : 0;
}

function renderDiffHl(){
  const hl = $("diffHl");
  if(!hl) return;
  hl.style.display = built ? "" : "none";
  if(!built) return;
  const s = SCENES[currentScene];
  const rawLen = lastRun.raw.length;
  const goodLen = lastRun.good.length;
  hl.innerHTML = "<b>差异一目了然：</b>原始问法的回答 " + rawLen + " 字、结构松散；优化后提示词的回答 " + goodLen +
    " 字，且按六要素组织。这就是提示词工程的直接价值。<br><span class=\"hl-note\">说明：演示模式的回答由本地模板生成（已按当前需求拆解子目标），用于呈现结构差异；真实模型效果请切换到「真实 API」。</span>";
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
      lastRun = {raw: raw, good: good};
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
      lastRun = {raw: a, good: b};
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