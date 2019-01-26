package photos

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"
	"time"
)

type item struct {
	// "id": "http://cleverangel.micro.blog/2019/01/06/snuggliest-puggliest.html",
	// "content_text": "<p>Snuggliest Puggliest. 😍💞</p>\n\n<p><img src=\"http://cleverangel.org/uploads/2019/0c374640e8.jpg\" width=\"600\" height=\"458\" alt=\"\" /></p>\n",
	// "date_published": "2019-01-06T14:12:01-08:00",
	// "url": "http://cleverangel.org/2019/01/06/snuggliest-puggliest.html",
	// "image": "http://cleverangel.org/uploads/2019/0c374640e8.jpg",
	// "_microblog": {
	// 	"thumbnail_url": "https://photos.micro.blog/400/http://cleverangel.org/uploads/2019/0c374640e8.jpg"
	// }

	ID            string    `json:"id"`
	ContentText   string    `json:"content_text"`
	DatePublished string    `json:"date_published"`
	URL           string    `json:"url"`
	Image         string    `json:"image"`
	MicroBlog     microblog `json:"_microblog"`
}

type microblog struct {
	// "thumbnail_url": "https://photos.micro.blog/400/http://cleverangel.org/uploads/2019/0c374640e8.jpg"
	ThumbnailURL string `json:"thumbnail_url"`
}

// Generate generates photo items for testing from photos.txt to photo-items.json
func Generate() {
	data, err := ioutil.ReadFile("photos.txt")
	if err != nil {
		log.Fatal(err)
	}

	items := []item{}
	start, err := time.Parse(time.RFC822, "15 Jan 19 12:00 GMT")
	if err != nil {
		log.Fatal(err)
	}

	buf := bytes.NewBuffer(data)
	scanner := bufio.NewScanner(buf)
	for scanner.Scan() {
		line := scanner.Text()
		name := strings.Replace(line, ".jpg", "", 1)
		it := item{}
		it.ContentText = "<p>This is " + name + ".</p>"
		it.DatePublished = start.Format("2006-01-02T15:04:05-07:00")
		it.ID = fmt.Sprintf("/%d/%d/%d/%s.html", start.Year(), start.Month(), start.Day(), name)
		it.URL = it.ID
		it.Image = fmt.Sprintf("/photos/full/%s", line)
		it.MicroBlog.ThumbnailURL = fmt.Sprintf("/photos/thumbs/%s", line)

		items = append(items, it)
		start = start.AddDate(0, 0, -1)
	}

	jsondata := &bytes.Buffer{}
	enc := json.NewEncoder(jsondata)
	enc.SetEscapeHTML(false)
	enc.SetIndent("", "    ")
	err = enc.Encode(items)

	err = ioutil.WriteFile("photos-items.json", jsondata.Bytes(), os.ModePerm)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("OK")

}
