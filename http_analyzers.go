//  Copyright (c) 2014 Couchbase, Inc.
//  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
//  except in compliance with the License. You may obtain a copy of the License at
//    http://www.apache.org/licenses/LICENSE-2.0
//  Unless required by applicable law or agreed to in writing, software distributed under the
//  License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
//  either express or implied. See the License for the specific language governing permissions
//  and limitations under the License.

package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"sort"

	"github.com/blevesearch/bleve"
	"github.com/blevesearch/bleve/analysis"
	"github.com/blevesearch/bleve/mapping"
	"github.com/blevesearch/bleve/registry"
)

func ListAnalyzerNames(w http.ResponseWriter, req *http.Request) {

	indexMapping := bleve.NewIndexMapping()

	// read the request body
	requestBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		showError(w, req, fmt.Sprintf("error reading request body: %v", err), 400)
		return
	}

	// interpret request body as index mapping
	if len(requestBody) > 0 {
		err := json.Unmarshal(requestBody, &indexMapping)
		if err != nil {
			showError(w, req, fmt.Sprintf("error parsing index mapping: %v", err), 400)
			return
		}
	}

	// built in analyzer names
	_, analyzerNames := registry.AnalyzerTypesAndInstances()
	// add custom analyzer names
	for name := range indexMapping.CustomAnalysis.Analyzers {
		analyzerNames = append(analyzerNames, name)
	}

	sort.Strings(analyzerNames)

	rv := struct {
		Status    string   `json:"status"`
		Analyzers []string `json:"analyzers"`
	}{
		Status:    "ok",
		Analyzers: analyzerNames,
	}
	mustEncode(w, rv)
}

func AnalyzerText(w http.ResponseWriter, req *http.Request) {
	// read the request body
	requestBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		showError(w, req, fmt.Sprintf("error reading request body: %v", err), 400)
		return
	}

	m := bleve.NewIndexMapping()
	var analyzeRequest = struct {
		Analyzer string                    `json:"analyzer"`
		Text     string                    `json:"text"`
		Mapping  *mapping.IndexMappingImpl `json:"mapping"`
	}{}

	err = json.Unmarshal(requestBody, &analyzeRequest)
	if err != nil {
		showError(w, req, fmt.Sprintf("error parsing index mapping: %v", err), 400)
		return
	}

	if analyzeRequest.Mapping != nil {
		m = analyzeRequest.Mapping
	}

	ts, err := m.AnalyzeText(analyzeRequest.Analyzer, []byte(analyzeRequest.Text))
	if err != nil {
		showError(w, req, fmt.Sprintf("error analyzing text: %v", err), 400)
		return
	}

	rv := struct {
		Status      string               `json:"status"`
		Text        string               `json:"text"`
		TokenStream analysis.TokenStream `json:"token_stream"`
	}{
		Status:      "ok",
		Text:        analyzeRequest.Text,
		TokenStream: ts,
	}
	mustEncode(w, rv)
}

func ListCharFilterNames(w http.ResponseWriter, req *http.Request) {

	indexMapping := bleve.NewIndexMapping()

	// read the request body
	requestBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		showError(w, req, fmt.Sprintf("error reading request body: %v", err), 400)
		return
	}

	// interpret request body as index mapping
	if len(requestBody) > 0 {
		err := json.Unmarshal(requestBody, &indexMapping)
		if err != nil {
			showError(w, req, fmt.Sprintf("error parsing index mapping: %v", err), 400)
			return
		}
	}

	// built in char filter names
	_, charFilterNames := registry.CharFilterTypesAndInstances()
	// add custom char filter names
	for name := range indexMapping.CustomAnalysis.CharFilters {
		charFilterNames = append(charFilterNames, name)
	}

	sort.Strings(charFilterNames)

	rv := struct {
		Status      string   `json:"status"`
		CharFilters []string `json:"char_filters"`
	}{
		Status:      "ok",
		CharFilters: charFilterNames,
	}
	mustEncode(w, rv)
}

func ListCharFilterTypes(w http.ResponseWriter, req *http.Request) {

	// built in char filter names
	charFilterTypes, _ := registry.CharFilterTypesAndInstances()

	sort.Strings(charFilterTypes)

	rv := struct {
		Status          string   `json:"status"`
		CharFilterTypes []string `json:"char_filter_types"`
	}{
		Status:          "ok",
		CharFilterTypes: charFilterTypes,
	}
	mustEncode(w, rv)
}

func ListTokenizerNames(w http.ResponseWriter, req *http.Request) {

	indexMapping := bleve.NewIndexMapping()

	// read the request body
	requestBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		showError(w, req, fmt.Sprintf("error reading request body: %v", err), 400)
		return
	}

	// interpret request body as index mapping
	if len(requestBody) > 0 {
		err := json.Unmarshal(requestBody, &indexMapping)
		if err != nil {
			showError(w, req, fmt.Sprintf("error parsing index mapping: %v", err), 400)
			return
		}
	}

	// built in char filter names
	_, tokenizerNames := registry.TokenizerTypesAndInstances()
	// add custom char filter names
	for name := range indexMapping.CustomAnalysis.Tokenizers {
		tokenizerNames = append(tokenizerNames, name)
	}

	sort.Strings(tokenizerNames)

	rv := struct {
		Status     string   `json:"status"`
		Tokenizers []string `json:"tokenizers"`
	}{
		Status:     "ok",
		Tokenizers: tokenizerNames,
	}
	mustEncode(w, rv)
}

func ListTokenizerTypes(w http.ResponseWriter, req *http.Request) {

	// built in char filter names
	tokenizerTypes, _ := registry.TokenizerTypesAndInstances()

	sort.Strings(tokenizerTypes)

	rv := struct {
		Status         string   `json:"status"`
		TokenizerTypes []string `json:"tokenizer_types"`
	}{
		Status:         "ok",
		TokenizerTypes: tokenizerTypes,
	}
	mustEncode(w, rv)
}

func ListTokenFilterNames(w http.ResponseWriter, req *http.Request) {

	indexMapping := bleve.NewIndexMapping()

	// read the request body
	requestBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		showError(w, req, fmt.Sprintf("error reading request body: %v", err), 400)
		return
	}

	// interpret request body as index mapping
	if len(requestBody) > 0 {
		err := json.Unmarshal(requestBody, &indexMapping)
		if err != nil {
			showError(w, req, fmt.Sprintf("error parsing index mapping: %v", err), 400)
			return
		}
	}

	// built in char filter names
	_, tokenFilterNames := registry.TokenFilterTypesAndInstances()
	// add custom char filter names
	for name := range indexMapping.CustomAnalysis.TokenFilters {
		tokenFilterNames = append(tokenFilterNames, name)
	}

	sort.Strings(tokenFilterNames)

	rv := struct {
		Status       string   `json:"status"`
		TokenFilters []string `json:"token_filters"`
	}{
		Status:       "ok",
		TokenFilters: tokenFilterNames,
	}
	mustEncode(w, rv)
}

func ListTokenFilterTypes(w http.ResponseWriter, req *http.Request) {

	// built in char filter names
	tokenFilterTypes, _ := registry.TokenFilterTypesAndInstances()

	sort.Strings(tokenFilterTypes)

	rv := struct {
		Status           string   `json:"status"`
		TokenFilterTypes []string `json:"token_filter_types"`
	}{
		Status:           "ok",
		TokenFilterTypes: tokenFilterTypes,
	}
	mustEncode(w, rv)
}

func ListTokenMapNames(w http.ResponseWriter, req *http.Request) {

	indexMapping := bleve.NewIndexMapping()

	// read the request body
	requestBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		showError(w, req, fmt.Sprintf("error reading request body: %v", err), 400)
		return
	}

	// interpret request body as index mapping
	if len(requestBody) > 0 {
		err := json.Unmarshal(requestBody, &indexMapping)
		if err != nil {
			showError(w, req, fmt.Sprintf("error parsing index mapping: %v", err), 400)
			return
		}
	}

	// built in char filter names
	_, tokenMapNames := registry.TokenMapTypesAndInstances()
	// add custom char map names
	for name := range indexMapping.CustomAnalysis.TokenMaps {
		tokenMapNames = append(tokenMapNames, name)
	}

	sort.Strings(tokenMapNames)

	rv := struct {
		Status    string   `json:"status"`
		TokenMaps []string `json:"token_maps"`
	}{
		Status:    "ok",
		TokenMaps: tokenMapNames,
	}
	mustEncode(w, rv)
}

func ValidateMapping(w http.ResponseWriter, req *http.Request) {

	indexMapping := bleve.NewIndexMapping()

	// read the request body
	requestBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		showError(w, req, fmt.Sprintf("error reading request body: %v", err), 400)
		return
	}

	// interpret request body as index mapping
	if len(requestBody) > 0 {
		err := json.Unmarshal(requestBody, &indexMapping)
		if err != nil {
			showError(w, req, fmt.Sprintf("error parsing index mapping: %v", err), 400)
			return
		}
	}

	rv := struct {
		Status string `json:"status"`
	}{
		Status: "ok",
	}
	mustEncode(w, rv)

}
