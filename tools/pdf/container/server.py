#!/usr/bin/env python3
"""Stateless conversion server used by the pdf Worker (Cloudflare Container).

POST /convert with the raw file as body and headers:
  x-task: one of TASKS below
  x-filename: original filename (percent-encoded)
Response: converted file bytes. Files live only in a per-request temp dir.
"""
import shutil
import subprocess
import tempfile
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

MAX_BYTES = 50 * 1024 * 1024

# task -> (output extension, command builder)
def lo(fmt, infilter=None):
    def build(src, outdir):
        cmd = ["libreoffice", "--headless", "--norestore"]
        if infilter:
            cmd.append(f"--infilter={infilter}")
        cmd += ["--convert-to", fmt, "--outdir", str(outdir), str(src)]
        return cmd
    return build

TASKS = {
    "pdf-to-word": ("docx", lo("docx:MS Word 2007 XML", "writer_pdf_import")),
    "pdf-to-excel": ("xlsx", lo("xlsx:Calc MS Excel 2007 XML", "calc_pdf_import")),
    "pdf-to-powerpoint": ("pptx", lo("pptx:Impress MS PowerPoint 2007 XML", "impress_pdf_import")),
    "word-to-pdf": ("pdf", lo("pdf")),
    "excel-to-pdf": ("pdf", lo("pdf")),
    "powerpoint-to-pdf": ("pdf", lo("pdf")),
    "ocr-pdf": ("pdf", lambda src, outdir: ["ocrmypdf", "--force-ocr", str(src), str(outdir / "out.pdf")]),
    "pdf-to-pdfa": ("pdf", lambda src, outdir: ["ocrmypdf", "--skip-text", "--output-type", "pdfa", str(src), str(outdir / "out.pdf")]),
    "repair-pdf": ("pdf", lambda src, outdir: ["qpdf", str(src), str(outdir / "out.pdf")]),
}

MIMES = {
    "pdf": "application/pdf",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
}


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *args):  # no request logging: stateless & private
        pass

    def fail(self, code, msg):
        body = msg.encode()
        self.send_response(code)
        self.send_header("content-type", "text/plain")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/health":
            self.fail(200, "ok")
        else:
            self.fail(404, "not found")

    def do_POST(self):
        if self.path != "/convert":
            return self.fail(404, "not found")
        task = self.headers.get("x-task", "")
        spec = TASKS.get(task)
        if not spec:
            return self.fail(400, f"unknown task {task}")
        length = int(self.headers.get("content-length", 0))
        if length <= 0 or length > MAX_BYTES:
            return self.fail(413, "file too large (50 MB max)")
        raw_name = urllib.parse.unquote(self.headers.get("x-filename", "input"))
        safe_name = Path(raw_name).name or "input"

        out_ext, build = spec
        tmp = Path(tempfile.mkdtemp(prefix="conv-"))
        try:
            src = tmp / safe_name
            src.write_bytes(self.rfile.read(length))
            try:
                subprocess.run(
                    build(src, tmp),
                    check=True,
                    timeout=180,
                    capture_output=True,
                    env={"HOME": str(tmp), "PATH": "/usr/bin:/bin"},
                )
            except subprocess.TimeoutExpired:
                return self.fail(504, "conversion timed out")
            except subprocess.CalledProcessError as e:
                detail = (e.stderr or b"")[-400:].decode(errors="replace")
                return self.fail(422, f"conversion failed: {detail}")

            outputs = [p for p in tmp.glob(f"*.{out_ext}") if p.name != safe_name]
            if not outputs:
                return self.fail(422, "conversion produced no output")
            data = outputs[0].read_bytes()
            self.send_response(200)
            self.send_header("content-type", MIMES[out_ext])
            self.send_header("content-length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        finally:
            shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    import os

    port = int(os.environ.get("PORT", "8080"))
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()
