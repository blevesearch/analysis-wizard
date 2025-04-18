//  Copyright (c) 2014 Couchbase, Inc.
//  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
//  except in compliance with the License. You may obtain a copy of the License at
//    http://www.apache.org/licenses/LICENSE-2.0
//  Unless required by applicable law or agreed to in writing, software distributed under the
//  License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
//  either express or implied. See the License for the specific language governing permissions
//  and limitations under the License.

// +build !appengine

package main

import (
	"flag"
	"log"
	"net/http"

	_ "github.com/blevesearch/bleve/v2/config"
)

var bindAddr = flag.String("addr", ":443", "https listen address")
var staticEtag = flag.String("staticEtag", "", "A static etag value.")
var staticPath = flag.String("static", "static/", "Path to the static content")

func main() {

	flag.Parse()

	// create a router to serve static files
	router := staticFileRouter()

	// add the API

	router.HandleFunc("/api/_analyzerNames", ListAnalyzerNames).Methods("POST")
	router.HandleFunc("/api/_charFilterNames", ListCharFilterNames).Methods("POST")
	router.HandleFunc("/api/_charFilterTypes", ListCharFilterTypes).Methods("GET")
	router.HandleFunc("/api/_tokenizerNames", ListTokenizerNames).Methods("POST")
	router.HandleFunc("/api/_tokenizerTypes", ListTokenizerTypes).Methods("GET")
	router.HandleFunc("/api/_tokenFilterNames", ListTokenFilterNames).Methods("POST")
	router.HandleFunc("/api/_tokenFilterTypes", ListTokenFilterTypes).Methods("GET")
	router.HandleFunc("/api/_tokenMapNames", ListTokenMapNames).Methods("POST")
	router.HandleFunc("/api/_analyze", AnalyzerText).Methods("POST")
	router.HandleFunc("/api/_validateMapping", ValidateMapping).Methods("POST")

	// start the HTTPs server
	http.Handle("/", router)
	log.Printf("Listening on %v", *bindAddr)
	log.Fatal(http.ListenAndServeTLS(*bindAddr, "cert.pem", "key.pem", nil))
}
