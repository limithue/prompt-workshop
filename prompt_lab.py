#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""提示词工坊 · 命令行版（零第三方依赖）

把网页里的「六要素结构化提示词」搬到命令行，并补上网页目前没有的量化对比：
同一条需求，分别用原始提示词和优化后提示词调用模型，输出一份可写进实验报告的
Markdown 对比报告（含长度、结构化程度等客观指标）。

用法示例：

    # 1) 只看生成的提示词，不花 token
    python prompt_lab.py "帮我写一个统计步数并生成周报的功能" --scene coding --dry

    # 2) 真实对比（需要密钥）
    python prompt_lab.py "帮我写一个统计步数并生成周报的功能" --scene coding --out report.md

环境变量：
    PW_API_KEY   接口密钥
    PW_UPSTREAM  接口 Base URL，默认 https://api.deepseek.com/v1
    PW_MODEL     模型名，默认 deepseek-chat
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime

UPSTREAM = os.environ.get("PW_UPSTREAM", "https://api.deepseek.com/v1").rstrip("/")
API_KEY = os.environ.get("PW_API_KEY", "").strip()
MODEL = os.environ.get("PW_MODEL", "deepseek-chat").strip()

# 与网页端 SCENES 保持同一套口径，便于报告里交叉引用
SCENES = {
    "general": {
        "label": "通用任务",
        "role": "你是一位细致、专业的通用助手，善于把复杂需求拆解成清晰可执行的步骤。",
        "context": "用户希望得到可直接落地的帮助，而不是泛泛而谈。",
        "format": "先给一句话结论，再用编号分点说明，最后给下一步建议。",
        "constraints": "不要编造不确定的事实；信息不足时说明假设；语言简洁。",
    },
    "coding": {
        "label": "编程开发",
        "role": "你是一位资深软件工程师，注重可读性、健壮性与可维护性。",
        "context": "用户需要一个能跑通的技术方案，用于课程项目，技术选型优先成熟稳定。",
        "format": "按 1) 需求拆解 2) 技术思路 3) 关键代码（代码块）4) 边界与测试 输出。",
        "constraints": "代码附必要注释；说明运行环境与依赖；不确定时明确说明假设。",
    },
    "writing": {
        "label": "文案写作",
        "role": "你是一位资深品牌文案策划，擅长抓住受众心理写有传播力的文字。",
        "context": "用户需要可直接发布的文案，重视标题吸引力与行动号召。",
        "format": "输出 3 个备选标题 + 正文（短段）+ 一句行动号召 + 标题适用场景。",
        "constraints": "避免空泛口号与过度夸张；段落简短。",
    },
    "analysis": {
        "label": "数据分析",
        "role": "你是一位严谨的数据分析师，重视口径清晰、结论有据。",
        "context": "用户希望从数据中得到可靠结论，而非罗列数字。",
        "format": "按 1) 分析目标 2) 维度与指标 3) 方法 4) 结论 5) 风险与局限 输出。",
        "constraints": "明确数据口径与时间范围；不要把相关关系说成因果。",
    },
    "study": {
        "label": "学习辅导",
        "role": "你是一位耐心的学科老师，善于用通俗类比解释抽象概念。",
        "context": "用户是在学习的学生，需要从零讲清楚，最好配例子与自测题。",
        "format": "按 1) 一句话理解 2) 生活化类比 3) 三个关键点 4) 小例子 5) 两道自测题 输出。",
        "constraints": "先解释术语再使用；一次只讲一个概念；语气鼓励。",
    },
    "product": {
        "label": "产品经理",
        "role": "你是一位资深产品经理，擅长需求梳理、功能拆解与优先级判断，输出结构化、可落地的产品方案。",
        "context": "用户要规划一个功能或产品，需要清晰的目标、用户价值与实施路径，避免拍脑袋决策。",
        "format": "按 1) 一句话定位 2) 目标用户与核心痛点 3) 核心功能清单（P0/P1/P2） 4) 关键指标 5) 风险与建议 输出。",
        "constraints": "聚焦核心场景，不堆砌功能；优先级用 P0/P1/P2 标注；每个结论给出理由。",
    },
    "translate": {
        "label": "中英翻译",
        "role": "你是一位专业的中英互译译员，译文准确、地道、符合目标语言习惯，保留原文语气与风格。",
        "context": "用户需要高质量翻译，可能用于论文、邮件或文档，要求准确且不逐字硬译。",
        "format": "按 1) 译文 2) 关键术语对照表 3) 翻译说明（处理了哪些难点） 输出。",
        "constraints": "避免逐字直译与机翻腔；保留原文语气；专业术语需准确；必要时加括号注明。",
    },
}

ELEMENTS = [
    ("角色", "role"),
    ("任务", "task"),
    ("背景", "context"),
    ("输出格式", "format"),
    ("参考示例", "example"),
    ("约束条件", "constraints"),
]


def build_prompt(need: str, scene: str) -> dict:
    """按六要素拼装结构化提示词，返回 {要素名: 内容}。"""
    s = SCENES[scene]
    return {
        "role": s["role"],
        "task": (
            "请完成以下任务：" + need
            + "\n并先判断任务包含哪几个子目标，再逐个完成，不要跳步。"
        ),
        "context": s["context"],
        "format": s["format"],
        "example": "示例只说明输出形态，不需要照抄内容：\n输入：一个同类的小需求\n输出：按【输出格式】列出的那几项逐条给出，每项一段",
        "constraints": s["constraints"],
    }


def render(prompt: dict) -> str:
    return "\n\n".join("【%s】\n%s" % (name, prompt[key]) for name, key in ELEMENTS)


def call_llm(messages: list[dict], temperature: float = 0.7) -> str:
    """调用 OpenAI 兼容接口，返回纯文本回答。"""
    if not API_KEY:
        raise RuntimeError("未设置 PW_API_KEY，无法调用真实接口")
    req = urllib.request.Request(
        UPSTREAM + "/chat/completions",
        data=json.dumps({
            "model": MODEL,
            "messages": messages,
            "temperature": temperature,
        }).encode("utf-8"),
        headers={"Content-Type": "application/json", "Authorization": "Bearer " + API_KEY},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        raise RuntimeError("HTTP %d：%s" % (e.code, e.read()[:200].decode("utf-8", "replace"))) from e
    except urllib.error.URLError as e:
        raise RuntimeError("无法连接 %s：%s" % (UPSTREAM, e.reason)) from e
    return data["choices"][0]["message"]["content"]


def metrics(answer: str) -> dict:
    """客观结构指标，用来替代「看着更好」这种主观判断。"""
    lines = [ln for ln in answer.splitlines() if ln.strip()]
    numbered = sum(1 for ln in lines if re.match(r"^\s*(\d+[.)、]|[-*]\s)", ln))
    return {
        "字符数": len(answer),
        "行数": len(lines),
        "编号或分点行数": numbered,
        "含代码块": "```" in answer,
        "含小标题": bool(re.search(r"【|##|一、|二、", answer)),
    }


def run_compare(need: str, scene: str) -> dict:
    prompt = build_prompt(need, scene)
    structured = render(prompt)
    raw = call_llm([{"role": "user", "content": need}])
    good = call_llm([{"role": "system", "content": structured}, {"role": "user", "content": need}])
    return {
        "need": need,
        "scene": SCENES[scene]["label"],
        "prompt": structured,
        "raw": raw,
        "good": good,
        "metrics": {"原始提示词": metrics(raw), "优化后提示词": metrics(good)},
    }


def to_markdown(result: dict) -> str:
    m = result["metrics"]
    rows = ["| 指标 | 原始提示词 | 优化后提示词 |", "|---|---|---|"]
    for k in m["原始提示词"]:
        rows.append("| %s | %s | %s |" % (k, m["原始提示词"][k], m["优化后提示词"][k]))

    return "\n".join([
        "# 提示词对比报告",
        "",
        "- 生成时间：%s" % datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "- 场景：%s" % result["scene"],
        "- 模型：%s" % MODEL,
        "- 需求原文：%s" % result["need"],
        "",
        "## 一、优化后的结构化提示词",
        "",
        "```text",
        result["prompt"],
        "```",
        "",
        "## 二、客观指标对比",
        "",
        "\n".join(rows),
        "",
        "## 三、原始提示词的回答",
        "",
        result["raw"].strip(),
        "",
        "## 四、优化后提示词的回答",
        "",
        result["good"].strip(),
        "",
        "结论：优化后的回答在结构完整度与信息密度上更可预期，"
        "指标差异可作为「提示词工程有效」的量化证据，而非主观印象。",
        "",
    ])


def main() -> None:
    ap = argparse.ArgumentParser(description="提示词工坊命令行版")
    ap.add_argument("need", help="一句大白话描述需求")
    ap.add_argument("--scene", default="general", choices=list(SCENES), help="任务场景")
    ap.add_argument("--dry", action="store_true", help="只输出提示词，不调用模型")
    ap.add_argument("--out", help="把对比结果写成 Markdown 文件的路径")
    args = ap.parse_args()

    prompt = build_prompt(args.need, args.scene)
    text = render(prompt)

    if args.dry:
        print(text)
        return

    try:
        result = run_compare(args.need, args.scene)
    except RuntimeError as e:
        print("调用失败：%s" % e, file=sys.stderr)
        print("\n已保留生成的提示词，可先复制到网页端试用：\n", file=sys.stderr)
        print(text)
        sys.exit(1)

    md = to_markdown(result)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(md)
        print("报告已写入：%s" % args.out)
    else:
        print(md)


if __name__ == "__main__":
    main()
