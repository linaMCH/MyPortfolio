#!/usr/bin/env python3
"""HTTP server with no-cache headers for local portfolio development."""
import http.server
import functools

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        print(f"{self.address_string()} - {format % args}")

if __name__ == '__main__':
    PORT = 8000
    handler = functools.partial(NoCacheHTTPRequestHandler, directory='.')
    with http.server.HTTPServer(('', PORT), handler) as httpd:
        print(f"Serving on http://localhost:{PORT} (no-cache mode)")
        httpd.serve_forever()
