#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""提示词工坊 · 本地代理服务（零第三方依赖）

解决两个问题：
1) 页面用 file:// 直接打开时，部分浏览器会限制 fetch 跨域；由本服务托管页面可避免。
2) 真实 API 模式的密钥原本存在浏览器 localStorage，任何人打开开发者工具都能看到；
   改成本服务持有密钥，前端只填一个本地地址即可，密钥不再下发到浏览器。

用法：
    设置环境变量后启动
        Windows PowerShell:
            $env:PW_API_KEY="sk-xxxx"
            python server.py
        Linux / macOS:
            PW_API_KEY="sk-xxxx" python server.py

    浏览器打开 http://127.0.0.1:8000
    右上角「设置」中：Base URL 填 http://127.0.0.1:8000/v1，API Key 随便填（例如 local）

环境变量：
    PW_API_KEY   上游真实密钥（必需，仅在服务端使用，不会返回给前端）
    PW_UPSTREAM  上游 Base URL，默认 https://api.deepseek.com/v1
    PW_MODEL     默认模型名，请求未带 model 时使用，默认 deepseek-chat
    PW_HOST      监听地址，默认 127.0.0.1（只允许本机访问）
    PW_PORT      监听端口，默认 8000
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
UPSTREAM = os.environ.get("PW_UPSTREAM", "https://api.deepseek.com/v1").rstrip("/")
API_KEY = os.environ.get("PW_API_KEY", "").strip()
DEFAULT_MODEL = os.environ.get("PW_MODEL", "deepseek-chat").strip()
HOST = os.environ.get("PW_HOST", "127.0.0.1").strip()
PORT = int(os.environ.get("PW_PORT", "8000"))

# 允许被托管的静态文件扩展名，避免误把 .git / .env 之类暴露出去
ALLOWED_STATIC = {".html", ".css", ".js", ".png", ".jpg", ".svg", ".ico", ".woff2"}


def _json_bytes(obj) -> bytes:
    return json.dumps(obj, ensure_ascii=False).encode("utf-8")


class Handler(BaseHTTPRequestHandler):
    server_version = "PromptWorkshop/1.1"
    protocol_version = "HTTP/1.1"

    # ---------- 工具方法 ----------

    def _send(self, status: int, body: bytes, ctype: str = "application/json; charset=utf-8") -> None:
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _send_json(self, status: int, obj) -> None:
        self._send(status, _json_bytes(obj))

    def log_message(self, fmt: str, *args) -> None:  # 覆盖默认日志，去掉时间戳噪音
        sys.stderr.write("[server] %s - %s\n" % (self.address_string(), fmt % args))

    # ---------- GET ----------

    def do_GET(self) -> None:
        path = self.path.split("?", 1)[0]

        if path == "/healthz":
            self._send_json(200, {
                "ok": True,
                "upstream": UPSTREAM,
                "model": DEFAULT_MODEL,
                "key_configured": bool(API_KEY),
            })
            return

        if path in ("/", "/index.html"):
            self._serve_file(ROOT / "index.html")
            return

        # 其他静态资源（当前项目只有 index.html，保留扩展能力）
        target = (ROOT / path.lstrip("/")).resolve()
        if ROOT in target.parents and target.suffix.lower() in ALLOWED_STATIC and target.is_file():
            self._serve_file(target)
            return

        self._send_json(404, {"error": {"message": "not found"}})

    def _serve_file(self, f: Path) -> None:
        if not f.is_file():
            self._send_json(404, {"error": {"message": "file missing: %s" % f.name}})
            return
        ctype = {
            ".html": "text/html; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".js": "application/javascript; charset=utf-8",
            ".svg": "image/svg+xml",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".ico": "image/x-icon",
        }.get(f.suffix.lower(), "application/octet-stream")
        self._send(200, f.read_bytes(), ctype)

    # ---------- POST ----------

    def do_POST(self) -> None:
        path = self.path.split("?", 1)[0]
        if path != "/v1/chat/completions":
            self._send_json(404, {"error": {"message": "unsupported endpoint: %s" % path}})
            return

        try:
            length = int(self.headers.get("Content-Length") or 0)
            payload = json.loads(self.rfile.read(length) or b"{}")
        except (ValueError, json.JSONDecodeError):
            self._send_json(400, {"error": {"message": "请求体不是合法 JSON"}})
            return

        if not isinstance(payload, dict) or "messages" not in payload:
            self._send_json(400, {"error": {"message": "缺少 messages 字段"}})
            return

        # 前端传来的 key 一律忽略，只认服务端环境变量
        payload.pop("api_key", None)
        payload.setdefault("model", DEFAULT_MODEL)
        payload.setdefault("temperature", 0.7)

        if not API_KEY:
            self._send_json(400, {
                "error": {
                    "message": "服务端未配置 PW_API_KEY，无法转发真实请求。"
                               "请在启动前设置环境变量，或前端切回演示模式。"
                }
            })
            return

        self._forward(payload)

    def _forward(self, payload: dict) -> None:
        url = UPSTREAM + "/chat/completions"
        req = urllib.request.Request(
            url,
            data=_json_bytes(payload),
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY,
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                body = resp.read()
                self._send(resp.status, body)
        except urllib.error.HTTPError as e:
            detail = e.read()[:600].decode("utf-8", "replace")
            self._send_json(e.code, {
                "error": {"message": "上游返回 HTTP %d：%s" % (e.code, detail)}
            })
        except urllib.error.URLError as e:
            self._send_json(502, {
                "error": {"message": "无法连接上游 %s：%s" % (url, e.reason)}
            })
        except TimeoutError:
            self._send_json(504, {"error": {"message": "上游响应超时（120s）"}})

    def do_OPTIONS(self) -> None:  # 便于以后把页面与后端分端口部署
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Content-Length", "0")
        self.end_headers()


def main() -> None:
    if not (ROOT / "index.html").is_file():
        sys.exit("找不到 index.html，请把 server.py 放在项目根目录后运行")

    print("提示词工坊本地服务")
    print("  页面地址 : http://%s:%d" % (HOST, PORT))
    print("  上游接口 : %s" % UPSTREAM)
    print("  默认模型 : %s" % DEFAULT_MODEL)
    print("  密钥状态 : %s" % ("已配置" if API_KEY else "未配置（仅演示模式可用）"))
    if HOST not in ("127.0.0.1", "localhost"):
        print("  注意：当前监听 %s，局域网内其他设备可访问本服务" % HOST)

    srv = ThreadingHTTPServer((HOST, PORT), Handler)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止")
    finally:
        srv.server_close()


if __name__ == "__main__":
    main()
