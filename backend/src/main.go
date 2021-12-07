package main

import (
	"gomusic/backend/src/rest"
	"log"
)

func main() {
	log.Println("Main log....")
	rest.RunAPI(":9090")
}
