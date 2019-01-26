package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	var port, dir string
	flag.StringVar(&port, "p", "8080", "webserver port")
	flag.StringVar(&dir, "d", ".", "web root directory")
	flag.Parse()

	http.Handle("/", http.FileServer(http.Dir(dir)))

	var path string
	var err error
	if path, err = filepath.Abs(dir); err != nil {
		log.Fatal(err.Error())
	}
	if _, err := os.Stat(path); err != nil {
		log.Fatal(err.Error())
	}

	fmt.Printf("serving: %s\naddress: http://localhost:%s\n", path, port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
