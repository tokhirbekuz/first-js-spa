// SPA fallback bilan static Go server.
//
// Ishga tushirish:  go run server.go   ->  http://localhost:8000
package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

const root = "."

func main() {
	files := http.FileServer(http.Dir(root))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Yo'lni xavfsiz tozalaymiz ("../" hujumlaridan himoya).
		clean := filepath.Clean("/" + r.URL.Path)
		info, err := os.Stat(filepath.Join(root, clean))

		switch {
		case clean == "/":
			files.ServeHTTP(w, r) // "/" -> index.html

		case err == nil && !info.IsDir():
			files.ServeHTTP(w, r) // haqiqiy fayl: /css/style.css, /js/app.js ...

		case filepath.Ext(clean) == "":
			// Fayl yo'q, kengaytma ham yo'q: bu "sahifa" yo'li (/about, /contact).
			// Hammasiga index.html qaytaramiz — qolganini router hal qiladi.
			http.ServeFile(w, r, filepath.Join(root, "index.html"))

		default:
			http.NotFound(w, r) // yo'q .js/.css fayl: haqiqiy 404
		}
	})

	log.Println("Serving on http://localhost:8000 (Ctrl+C to stop)")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
