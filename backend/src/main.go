package main

import (
	"gomusic/backend/src/rest"
	"log"
)

func main() {
	log.Println("Main log....")
	log.Fatal(rest.RunAPI("127.0.0.1:9090"))
}
