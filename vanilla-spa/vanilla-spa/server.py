"""SPA fallback bilan static Python server.

Ishga tushirish:  python server.py   ->  http://localhost:8000

Oddiy `python -m http.server` /about so'ralganda "about" degan fayl qidiradi
va 404 qaytaradi. Bu server esa fayl topilmasa va yo'lda kengaytma (.js, .css)
bo'lmasa, index.html'ni qaytaradi. Router keyin URL'ga qarab sahifani chizadi.
"""
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
PORT = 8000


class SPAHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_head(self):
        file_path = self.translate_path(self.path)   # URL -> diskdagi yo'l (query olib tashlanadi)
        url_path = self.path.split("?")[0]
        has_extension = bool(Path(url_path).suffix)

        # Fayl yo'q va bu "sahifa" yo'li (kengaytmasiz) bo'lsa -> SPA fallback.
        if not os.path.exists(file_path) and not has_extension:
            self.path = "/index.html"

        return super().send_head()


if __name__ == "__main__":
    print(f"Serving on http://localhost:{PORT}  (Ctrl+C to stop)")
    ThreadingHTTPServer(("", PORT), SPAHandler).serve_forever()
