function AnalysisCtrl($scope, $http, $routeParams, $log, $sce, $modal) {

    $scope.hasCustomMappings = false;
    $scope.building = false;
    $scope.buildingCharFilter = false;
    $scope.buildingTokenizer = false;
    $scope.buildingTokenFilter = false;
    $scope.txt = "";
	$scope.selectedAnalyzer = "standard";
	$scope.analyzers = [];
    $scope.charFilters = [];
    $scope.charFilterTypes = [];
    $scope.tokenizers = [];
    $scope.tokenizerTypes = [];
    $scope.tokenFilters = [];
    $scope.tokenFilterTypes = [];
    $scope.tokenMaps = [];
	$scope.errorMessage = null;

    // custom built
    $scope.customAnalyzers = {};
    $scope.customCharFilters = {};
    $scope.customTokenizers = {};
    $scope.customTokenFilters = {};
    $scope.customTokenMaps = {};

    resetNewAnalyzer = function() {
        $scope.analyzer = {};
        $scope.analyzer.charFilters = [];
        $scope.analyzer.tokenFilters = [];
        $scope.analyzer.tokenizer = "whitespace";
        $scope.analyzer.name = "";
        $scope.analyzer.errorMessage = "";
    };
    resetNewAnalyzer();

    resetNewCharFilter = function() {
        $scope.charfilter = {};
        $scope.charfilter.name = "";
        $scope.charfilter.type = "";
        $scope.charfilter.formpath = "";
        $scope.charfilter.config = {};
        $scope.charfilter.errorMessage = "";
    };
    resetNewCharFilter();

    resetNewTokenizer = function() {
        $scope.tokenizer = {};
        $scope.tokenizer.name = "";
        $scope.tokenizer.type = "";
        $scope.tokenizer.formpath = "";
        $scope.tokenizer.config = {};
        $scope.tokenizer.errorMessage = "";
    };
    resetNewTokenizer();

    resetNewTokenFilter = function() {
        $scope.tokenfilter = {};
        $scope.tokenfilter.name = "";
        $scope.tokenfilter.type = "";
        $scope.tokenfilter.formpath = "";
        $scope.tokenfilter.config = {};
        $scope.tokenfilter.errorMessage = "";
        $scope.tokenfilter.showCustomWords = false;
        $scope.tokenfilter.word_map = "";
        $scope.tokenfilter.custom_words = "";
        $scope.tokenfilter.output_original = false;
    };
    resetNewTokenFilter();
	
    updateAnalyzers = function() {
        mapping = {
            "analysis": {
                "char_filters": $scope.customCharFilters,
                "tokenizers": $scope.customTokenizers,
                "analyzers": $scope.customAnalyzers,
                "token_filters": $scope.customTokenFilters,
                "token_maps": $scope.customTokenMaps
            }
        };
        $http.post('/api/_analyzerNames',mapping).success(function(data) {
            $scope.analyzers = data.analyzers;
            $scope.analyzers.push("Build your own...");
        }).
        error(function(data, code) {
			$scope.errorMessage = data;
        });
    };

    updateCharFilters = function() {
        mapping = {
            "analysis": {
                "char_filters": $scope.customCharFilters,
                "tokenizers": $scope.customTokenizers,
                "analyzers": $scope.customAnalyzers,
                "token_filters": $scope.customTokenFilters,
                "token_maps": $scope.customTokenMaps
            }
        };
        $http.post('/api/_charFilterNames',mapping).success(function(data) {
            $scope.charFilters = data.char_filters;
            $scope.charFilters.push("Build your own...");
        }).
        error(function(data, code) {
            $scope.errorMessage = data;
        });
    };

    updateCharFilterTypes = function() {
        $http.get('/api/_charFilterTypes').success(function(data) {
            $scope.charFilterTypes = data.char_filter_types;
        }).
        error(function(data, code) {
            $scope.errorMessage = data;
        });
    };

    updateTokenizers = function() {
        mapping = {
            "analysis": {
                "char_filters": $scope.customCharFilters,
                "tokenizers": $scope.customTokenizers,
                "analyzers": $scope.customAnalyzers,
                "token_filters": $scope.customTokenFilters,
                "token_maps": $scope.customTokenMaps
            }
        };
        $http.post('/api/_tokenizerNames',mapping).success(function(data) {
            $scope.tokenizers = data.tokenizers;
            $scope.tokenizers.push("Build your own...");
        }).
        error(function(data, code) {
            $scope.errorMessage = data;
        });
    };

    updateTokenizerTypes = function() {
        $http.get('/api/_tokenizerTypes').success(function(data) {
            $scope.tokenizerTypes = data.tokenizer_types;
        }).
        error(function(data, code) {
            $scope.errorMessage = data;
        });
    };

    updateTokenFilters = function() {
        mapping = {
            "analysis": {
                "char_filters": $scope.customCharFilters,
                "tokenizers": $scope.customTokenizers,
                "analyzers": $scope.customAnalyzers,
                "token_filters": $scope.customTokenFilters,
                "token_maps": $scope.customTokenMaps
            }
        };
        $http.post('/api/_tokenFilterNames',mapping).success(function(data) {
            $scope.tokenFilters = data.token_filters;
            $scope.tokenFilters.push("Build your own...");
        }).
        error(function(data, code) {
            $scope.errorMessage = data;
        });
    };

    updateTokenFilterTypes = function() {
        $http.get('/api/_tokenFilterTypes').success(function(data) {
            $scope.tokenFilterTypes = data.token_filter_types;
        }).
        error(function(data, code) {
            $scope.errorMessage = data;
        });
    };

    updateTokenMaps = function() {
        mapping = {
            "analysis": {
                "char_filters": $scope.customCharFilters,
                "tokenizers": $scope.customTokenizers,
                "analyzers": $scope.customAnalyzers,
                "token_filters": $scope.customTokenFilters,
                "token_maps": $scope.customTokenMaps
            }
        };
        $http.post('/api/_tokenMapNames',mapping).success(function(data) {
            $scope.tokenMaps = data.token_maps;
            $scope.tokenMaps.push("Custom Word List...");
        }).
        error(function(data, code) {
            $scope.errorMessage = data;
        });
    };

    updateAnalyzers();
    updateCharFilters();
    updateCharFilterTypes();
    updateTokenizers();
    updateTokenizerTypes();
    updateTokenFilters();
    updateTokenFilterTypes();
    updateTokenMaps();

    $scope.analyzeText = function() {
        $scope.building = false;
        $scope.results = null;
        mapping = {
            "analysis": {
                "char_filters": $scope.customCharFilters,
                "tokenizers": $scope.customTokenizers,
                "analyzers": $scope.customAnalyzers,
                "token_filters": $scope.customTokenFilters,
                "token_maps": $scope.customTokenMaps
            }
        };
		analyzeRequest = {
			"analyzer": $scope.selectedAnalyzer,
			"text": $scope.txt,
            "mapping": mapping
		};
        $http.post('/api/_analyze',analyzeRequest).success(function(data) {
            $scope.processResults(data);
        }).
        error(function(data, code) {
			$scope.errorMessage = data;
        });
    };

    $scope.processResults = function(data) {
		$scope.errorMessage = null;
        $scope.results = data;
        for(var i in $scope.results.token_stream) {
			$scope.results.token_stream[i].termDecoded = UTF8ArrToStr(base64DecToArr($scope.results.token_stream[i].term));
        }
    };

    $scope.analyzerChanged = function() {
        if($scope.selectedAnalyzer === "Build your own...") {
            $scope.errorMessage = null;
            $scope.results = null;
            $scope.building = true;
            return;
        }
        if($scope.txt !== "") {
            $scope.analyzeText();
        }
    };

    $scope.addCharFilterChanged = function() {
        if($scope.analyzer.addCharacterFilters === "Build your own...") {
            $scope.buildingCharFilter = true;
            $scope.buildingTokenizer = false;
            $scope.buildingTokenFilter = false;
        }
    };

    $scope.addCharFilter = function() {
        filter = $scope.analyzer.addCharacterFilters;
        if (filter !== undefined && filter !== "") {
            $scope.analyzer.charFilters.push(filter);
        }
    };

    $scope.removeCharFilter = function(index) {
        $scope.analyzer.charFilters.splice(index, 1);
    };

    $scope.addTokenFilterChanged = function() {
        if($scope.analyzer.addTokenFilters === "Build your own...") {
            $scope.buildingCharFilter = false;
            $scope.buildingTokenizer = false;
            $scope.buildingTokenFilter = true;
        }
    };

    $scope.addTokenFilter = function() {
        filter = $scope.analyzer.addTokenFilters;
        if (filter !== undefined && filter !== "") {
            $scope.analyzer.tokenFilters.push(filter);
        }
    };

    $scope.removeTokenFilter = function(index) {
        $scope.analyzer.tokenFilters.splice(index, 1);
    };

    $scope.tokenizerChanged = function() {
        if($scope.analyzer.tokenizer === "Build your own...") {
            $scope.buildingCharFilter = false;
            $scope.buildingTokenizer = true;
            $scope.buildingTokenFilter = false;
        }
    };

    $scope.charFilterTypeChange = function() {
        if($scope.charfilter.type === "") {
            return;
        }
        if($scope.charfilter.type === "regexp") {
            $scope.charfilter.formpath = "/static/partials/analysis/charfilter-regexp.html";
        } else {
            $scope.charfilter.formpath = "/static/partials/analysis/charfilter-generic.html";
        }
    };

    $scope.tokenizerTypeChange = function() {
        if($scope.tokenizer.type === "") {
            return;
        }
        if($scope.tokenizer.type === "regexp") {
            $scope.tokenizer.formpath = "/static/partials/analysis/tokenizer-regexp.html";
        } else {
            $scope.tokenizer.formpath = "/static/partials/analysis/tokenizer-generic.html";
        }
    };

    $scope.tokenFilterTypeChange = function() {
        if($scope.tokenfilter.type === "") {
            return;
        }
        if($scope.tokenfilter.type === "ngram") {
            $scope.tokenfilter.formpath = "/static/partials/analysis/tokenfilter-ngram.html";
        } else if ($scope.tokenfilter.type === "edge_ngram") {
            $scope.tokenfilter.formpath = "/static/partials/analysis/tokenfilter-edge-ngram.html";
        } else if ($scope.tokenfilter.type === "length") {
            $scope.tokenfilter.formpath = "/static/partials/analysis/tokenfilter-length.html";
        } else if ($scope.tokenfilter.type === "truncate_token") {
            $scope.tokenfilter.formpath = "/static/partials/analysis/tokenfilter-truncate.html";
        } else if ($scope.tokenfilter.type === "normalize_unicode") {
            $scope.tokenfilter.formpath = "/static/partials/analysis/tokenfilter-normalize-unicode.html";
        } else if ($scope.tokenfilter.type === "stem") {
            $scope.tokenfilter.formpath = "/static/partials/analysis/tokenfilter-stem.html";
        } else if ($scope.tokenfilter.type === "elision") {
            $scope.tokenfilter.formpath = "/static/partials/analysis/tokenfilter-elision.html";
        } else if ($scope.tokenfilter.type === "keyword_marker") {
            $scope.tokenfilter.formpath = "/static/partials/analysis/tokenfilter-keyword-marker.html";
        } else if ($scope.tokenfilter.type === "stop_tokens") {
            $scope.tokenfilter.formpath = "/static/partials/analysis/tokenfilter-stop-tokens.html";
        } else if ($scope.tokenfilter.type === "shingle") {
            $scope.tokenfilter.formpath = "/static/partials/analysis/tokenfilter-shingle.html";
        } else if ($scope.tokenfilter.type === "dict_compound") {
            $scope.tokenfilter.formpath = "/static/partials/analysis/tokenfilter-compound.html";
        } else {
            $scope.tokenfilter.formpath = "/static/partials/analysis/tokenfilter-generic.html";
        }
    };

    $scope.tokenFilterWordMapChanged = function() {
        if($scope.tokenfilter.word_map === "Custom Word List...") {
            $scope.tokenfilter.showCustomWords = true;
        } else {
            $scope.tokenfilter.showCustomWords = false;
            $scope.tokenfilter.custom_words = "";
        }
    };

    validAnalyzerName = function(name) {
        if (name === "") {
            $scope.analyzer.errorMessage = "Analyzer name cannot be empty";
            return false;
        }
        for(var i in $scope.analyzers) {
            if (name === $scope.analyzers[i]) {
                $scope.analyzer.errorMessage = "Analyzer name '" + name + "' is already in use";
                return false;
            }
        }
        return true;
    };

    validCharFilterName = function(name) {
        if (name === "") {
            $scope.charfilter.errorMessage = "Char Filter name cannot be empty";
            return false;
        }
        for(var i in $scope.charFilters) {
            if (name === $scope.charFilters[i]) {
                $scope.charfilter.errorMessage = "Char Filter name '" + name + "' is already in use";
                return false;
            }
        }
        return true;
    };

    validTokenizerName = function(name) {
        if (name === "") {
            $scope.tokenizer.errorMessage = "Tokenizer name cannot be empty";
            return false;
        }
        for(var i in $scope.tokenizers) {
            if (name === $scope.tokenizers[i]) {
                $scope.tokenizer.errorMessage = "Tokenizer name '" + name + "' is already in use";
                return false;
            }
        }
        return true;
    };

    validTokenFilterName = function(name) {
        if (name === "") {
            $scope.tokenfilter.errorMessage = "Token Filter name cannot be empty";
            return false;
        }
        for(var i in $scope.tokenFilters) {
            if (name === $scope.tokenFilters[i]) {
                $scope.tokenfilter.errorMessage = "Token Filter name '" + name + "' is already in use";
                return false;
            }
        }
        return true;
    };

    $scope.buildAnalyzer = function() {
        if (!validAnalyzerName($scope.analyzer.name)) {
            return;
        }
        candidateAnalyzer = {
            "type": "custom",
            "char_filters": $scope.analyzer.charFilters,
            "tokenizer": $scope.analyzer.tokenizer,
            "token_filters": $scope.analyzer.tokenFilters
        };
        mapping = {
            "analysis": {
                "char_filters": $scope.customCharFilters,
                "tokenizers": $scope.customTokenizers,
                "analyzers": {},
                "token_filters": $scope.customTokenFilters,
                "token_maps": $scope.customTokenMaps
            }
        };
        mapping.analysis.analyzers[$scope.analyzer.name] = candidateAnalyzer;
        $http.post('/api/_validateMapping',mapping).success(function(data) {
            $scope.customAnalyzers[$scope.analyzer.name] = candidateAnalyzer;
            $scope.hasCustomMappings = true;
            $scope.building = false;
            updateAnalyzers();
            $scope.selectedAnalyzer = $scope.analyzer.name;
            resetNewAnalyzer();
        }).
        error(function(data, code) {
            $scope.analyzer.errorMessage = data;
        });
    };

    $scope.buildCharFilter = function() {
        if (!validCharFilterName($scope.charfilter.name)) {
            return;
        }
        candidateCharFilter = $scope.charfilter.config;
        candidateCharFilter.type = $scope.charfilter.type;
        mapping = {
            "analysis": {
                "char_filters": {
                }
            }
        };
        mapping.analysis.char_filters[$scope.charfilter.name] = candidateCharFilter;
        $http.post('/api/_validateMapping',mapping).success(function(data) {
            $scope.customCharFilters[$scope.charfilter.name] = candidateCharFilter;
            $scope.hasCustomMappings = true;
            $scope.buildingCharFilter = false;
            updateCharFilters();
            $scope.analyzer.addCharacterFilters = $scope.charfilter.name;
            resetNewCharFilter();
        }).
        error(function(data, code) {
            $scope.charfilter.errorMessage = data;
        });
    };

    $scope.buildTokenizer = function() {
        if (!validTokenizerName($scope.tokenizer.name)) {
            return;
        }
        candidateTokenizer = $scope.tokenizer.config;
        candidateTokenizer.type = $scope.tokenizer.type;
        mapping = {
            "analysis": {
                "tokenizers": {
                }
            }
        };
        mapping.analysis.tokenizers[$scope.tokenizer.name] = candidateTokenizer;
        $http.post('/api/_validateMapping',mapping).success(function(data) {
            $scope.customTokenizers[$scope.tokenizer.name] = candidateTokenizer;
            $scope.hasCustomMappings = true;
            $scope.buildingTokenizer = false;
            updateTokenizers();
            $scope.analyzer.tokenizer = $scope.tokenizer.name;
            resetNewTokenizer();
        }).
        error(function(data, code) {
            $scope.tokenizer.errorMessage = data;
        });
    };

    $scope.buildTokenFilter = function() {
        if (!validTokenFilterName($scope.tokenfilter.name)) {
            return;
        }
        if ($scope.tokenfilter.type === "") {
            $scope.tokenfilter.errorMessage = "Select a Token Filter Type";
            return;
        }
        candidateTokenFilter = $scope.tokenfilter.config;
        candidateTokenFilter.type = $scope.tokenfilter.type;
        mapping = {
            "analysis": {
                "token_maps": {
                },
                "token_filters": {
                }
            }
        };
        candidateWordMap = null;
        wordMapName = "";
        if ($scope.tokenfilter.word_map === "Custom Word List...") {
            candidateWordMap = {
                "type": "custom",
                "tokens": $scope.tokenfilter.custom_words.split(',')
            };
            wordMapName = $scope.tokenfilter.name + "_wordmap";
            mapping.analysis.token_maps[wordMapName] = candidateWordMap;
            if (candidateTokenFilter.type === "elision") {
                candidateTokenFilter.articles_token_map = wordMapName;
            } else if (candidateTokenFilter.type === "keyword_marker") {
                candidateTokenFilter.keywords_token_map = wordMapName;
            } else if (candidateTokenFilter.type === "stop_tokens") {
                candidateTokenFilter.stop_token_map = wordMapName;
            } else if (candidateTokenFilter.type === "dict_compound") {
                candidateTokenFilter.dict_token_map = wordMapName;
            }
        } else {
            if (candidateTokenFilter.type === "elision") {
                if ($scope.tokenfilter.word_map === "") {
                    $scope.tokenfilter.errorMessage = "Select a Article Word List";
                    return;
                }
                candidateTokenFilter.articles_token_map = $scope.tokenfilter.word_map;
            } else if (candidateTokenFilter.type === "keyword_marker") {
                if ($scope.tokenfilter.word_map === "") {
                    $scope.tokenfilter.errorMessage = "Select a Key Word List";
                    return;
                }
                candidateTokenFilter.keywords_token_map = $scope.tokenfilter.word_map;
            } else if (candidateTokenFilter.type === "stop_tokens") {
                if ($scope.tokenfilter.word_map === "") {
                    $scope.tokenfilter.errorMessage = "Select a Stop Word List";
                    return;
                }
                candidateTokenFilter.stop_token_map = $scope.tokenfilter.word_map;
            } else if (candidateTokenFilter.type === "shingle") {
                if ($scope.tokenfilter.config.separator === undefined) {
                    candidateTokenFilter.separator = "";
                }
                if ($scope.tokenfilter.output_original) {
                    candidateTokenFilter.output_original = true;
                }
            }
        }
        mapping.analysis.token_filters[$scope.tokenfilter.name] = candidateTokenFilter;
        $http.post('/api/_validateMapping',mapping).success(function(data) {
            $scope.customTokenFilters[$scope.tokenfilter.name] = candidateTokenFilter;
            if (candidateWordMap !== null) {
                $scope.customTokenMaps[wordMapName] = candidateWordMap;
            }
            $scope.hasCustomMappings = true;
            $scope.buildingTokenFilter = false;
            updateTokenFilters();
            updateTokenMaps();
            $scope.analyzer.addTokenFilters = $scope.tokenfilter.name;
            resetNewTokenFilter();
        }).
        error(function(data, code) {
            $scope.tokenfilter.errorMessage = data;
        });
    };

    buildGoMapping = function() {
        result = "func buildIndexMapping() (*bleve.IndexMapping, error) {\n";
        result += "\tindexMapping := bleve.NewIndexMapping()";
        result += "\n\n";
        result += "\tvar err error\n";
        for(var charFilterName in $scope.customCharFilters) {
            result += "\terr = indexMapping.AddCustomCharFilter(";
            result += '"' + charFilterName + '"';
            result += ",\n\t\t";
            result += jsToGo($scope.customCharFilters[charFilterName],3);
            result += ")\n";
            result += "\tif err != nil {\n";
            result += "\t\treturn nil, err\n";
            result += "\t}\n\n";
        }
        for(var tokenizerName in $scope.customTokenizers) {
            result += "\terr = indexMapping.AddCustomTokenizer(";
            result += '"' + tokenizerName + '"';
            result += ",\n\t\t";
            result += jsToGo($scope.customTokenizers[tokenizerName],3);
            result += ")\n";
            result += "\tif err != nil {\n";
            result += "\t\treturn nil, err\n";
            result += "\t}\n\n";
        }
        for(var tokenMapName in $scope.customTokenMaps) {
            result += "\terr = indexMapping.AddCustomTokenMap(";
            result += '"' + tokenMapName + '"';
            result += ",\n\t\t";
            result += jsToGo($scope.customTokenMaps[tokenMapName],3);
            result += ")\n";
            result += "\tif err != nil {\n";
            result += "\t\treturn nil, err\n";
            result += "\t}\n\n";
        }
        for(var tokenFilterName in $scope.customTokenFilters) {
            result += "\terr = indexMapping.AddCustomTokenFilter(";
            result += '"' + tokenFilterName + '"';
            result += ",\n\t\t";
            result += jsToGo($scope.customTokenFilters[tokenFilterName],3);
            result += ")\n";
            result += "\tif err != nil {\n";
            result += "\t\treturn nil, err\n";
            result += "\t}\n\n";
        }
        for(var analyzerName in $scope.customAnalyzers) {
            result += "\terr = indexMapping.AddCustomAnalyzer(";
            result += '"' + analyzerName + '"';
            result += ",\n\t\t";
            result += jsToGo($scope.customAnalyzers[analyzerName],3);
            result += ")\n";
            result += "\tif err != nil {\n";
            result += "\t\treturn nil, err\n";
            result += "\t}\n\n";
            result += "\treturn indexMapping, nil\n";
            result += "}\n";
        }
        return result;
    };

    jsToGo = function(obj, depth) {
        result = "";
        if (typeof obj === 'boolean') {
            if (obj) {
                return result + "true";
            } else {
                return result + "false";
            }
        } else if (typeof obj === 'string') {
            return result+'`' + obj + '`';
        } else if (typeof obj === 'number') {
            return result+obj.toString();
        } else if (typeof obj === 'object') {
            if (obj instanceof Array) {
                result += "[]interface{}{";
                indexCount = 0;
                for(var index in obj) {
                    if (index !== 0) {
                        result += "\n";
                    }
                    // indent
                    for(i=0;i<depth;i++) {
                        result += "\t";
                    }
                    result += jsToGo(obj[index],depth+1);
                    result += ',';
                    indexCount++;
                }
                if (indexCount > 0) {
                    result += "\n";
                    // indent
                    depth--;
                    for(i=0;i<depth;i++) {
                        result += "\t";
                    }
                }
                result += "}";
            } else {
                result += "map[string]interface{}{\n";
                nameCount = 0;
                for(var key in obj) {
                    if (nameCount !== 0) {
                        result += "\n";
                    }
                    // indent
                    for(i=0;i<depth;i++) {
                        result += "\t";
                    }
                    result += '"' + key + '": ' + jsToGo(obj[key], depth+1);
                    result += ',';
                    nameCount++;
                }
                if (nameCount > 0) {
                    result += "\n";
                    // indent
                    depth--;
                    for(i=0;i<depth;i++) {
                        result += "\t";
                    }
                }
                
                result += "}";
            }
            return result;
        } else {
            return result+"unknown";
        }
    };

    $scope.exportSource = function(size) {
        mapping = {
            "analysis": {
                "char_filters": $scope.customCharFilters,
                "tokenizers": $scope.customTokenizers,
                "analyzers": $scope.customAnalyzers,
                "token_filters": $scope.customTokenFilters,
                "token_maps": $scope.customTokenMaps
            }
        };
        
        $scope.mappingFormatted = JSON.stringify(mapping, undefined, 2);
        $scope.mappingGo = buildGoMapping();
        var modalInstance = $modal.open({
          templateUrl: '/static/partials/analysis/export.html',
          controller: ModalInstanceCtrl,
          size: size,
          resolve: {
            mappingFormatted: function () {
              return $scope.mappingFormatted;
            },
            mappingGo: function () {
                return $scope.mappingGo;
            }
          }
        });

    };
}

var ModalInstanceCtrl = function ($scope, $modalInstance, mappingFormatted, mappingGo) {
  $scope.mappingFormatted = mappingFormatted;
  $scope.mappingGo = mappingGo;
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};