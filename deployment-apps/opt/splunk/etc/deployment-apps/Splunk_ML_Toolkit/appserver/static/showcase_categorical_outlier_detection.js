webpackJsonp([5],{0:function(module,exports,__webpack_require__){var __WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__.p=function(){function make_url(){for(var seg,len,output="",i=0,l=arguments.length;i<l;i++)seg=arguments[i].toString(),len=seg.length,len>1&&"/"==seg.charAt(len-1)&&(seg=seg.substring(0,len-1)),output+="/"!=seg.charAt(0)?"/"+seg:seg;if("/"!=output){var segments=output.split("/"),firstseg=segments[1];if("static"==firstseg||"modules"==firstseg){var postfix=output.substring(firstseg.length+2,output.length);output="/"+firstseg+"/@"+window.$C.BUILD_NUMBER,window.$C.BUILD_PUSH_NUMBER&&(output+="."+window.$C.BUILD_PUSH_NUMBER),"app"==segments[2]&&(output+=":"+getConfigValue("APP_BUILD",0)),output+="/"+postfix}}var root=getConfigValue("MRSPARKLE_ROOT_PATH","/"),djangoRoot=getConfigValue("DJANGO_ROOT_PATH",""),locale=getConfigValue("LOCALE","en-US"),combinedPath="";return combinedPath=djangoRoot&&output.substring(0,djangoRoot.length)===djangoRoot?output.replace(djangoRoot,djangoRoot+"/"+locale.toLowerCase()):"/"+locale+output,""==root||"/"==root?combinedPath:root+combinedPath}function getConfigValue(key,defaultValue){if(window.$C&&window.$C.hasOwnProperty(key))return window.$C[key];if(void 0!==defaultValue)return defaultValue;throw new Error("getConfigValue - "+key+" not set, no default provided")}return make_url("/static/app/Splunk_ML_Toolkit/")+"/"}(),__WEBPACK_AMD_DEFINE_ARRAY__=[__webpack_require__("shim/jquery"),__webpack_require__(48),__webpack_require__("splunkjs/mvc/singleview"),__webpack_require__(229),__webpack_require__("splunkjs/mvc/utils"),__webpack_require__(230),__webpack_require__(234),__webpack_require__(236),__webpack_require__(240),__webpack_require__(231),__webpack_require__(242),__webpack_require__(243),__webpack_require__(241),__webpack_require__(244),__webpack_require__(249),__webpack_require__(235),__webpack_require__(239),__webpack_require__(250),__webpack_require__(251)],__WEBPACK_AMD_DEFINE_RESULT__=function(_jquery,_underscoreMltk,_singleview,_tableview,_utils,_Master,_DrilldownLinker,_QueryHistoryTable,_SearchStringDisplay,_Spinners,_compactTemplateString,_ShowcaseHistorySerializer,_ColorPalette,_CategoricalOutlierAlertModal,_EnhancedMultiDropdownView,_Forms,_Searches,_TableUtils,_BaseAssistantView){"use strict";function _interopRequireWildcard(obj){if(obj&&obj.__esModule)return obj;var newObj={};if(null!=obj)for(var key in obj)Object.prototype.hasOwnProperty.call(obj,key)&&(newObj[key]=obj[key]);return newObj["default"]=obj,newObj}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}function _taggedTemplateLiteral(strings,raw){return Object.freeze(Object.defineProperties(strings,{raw:{value:Object.freeze(raw)}}))}var _jquery2=_interopRequireDefault(_jquery),_underscoreMltk2=_interopRequireDefault(_underscoreMltk),_singleview2=_interopRequireDefault(_singleview),_tableview2=_interopRequireDefault(_tableview),_utils2=_interopRequireDefault(_utils),_Master2=_interopRequireDefault(_Master),DrilldownLinker=_interopRequireWildcard(_DrilldownLinker),_QueryHistoryTable2=_interopRequireDefault(_QueryHistoryTable),Spinners=_interopRequireWildcard(_Spinners),_compactTemplateString2=_interopRequireDefault(_compactTemplateString),_ShowcaseHistorySerializer2=_interopRequireDefault(_ShowcaseHistorySerializer),_CategoricalOutlierAlertModal2=_interopRequireDefault(_CategoricalOutlierAlertModal),_EnhancedMultiDropdownView2=_interopRequireDefault(_EnhancedMultiDropdownView),Forms=_interopRequireWildcard(_Forms),Searches=_interopRequireWildcard(_Searches),TableUtils=_interopRequireWildcard(_TableUtils),_BaseAssistantView2=_interopRequireDefault(_BaseAssistantView),_slicedToArray=function(){function sliceIterator(arr,i){var _arr=[],_n=!0,_d=!1,_e=void 0;try{for(var _s,_i=arr[Symbol.iterator]();!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{!_n&&_i["return"]&&_i["return"]()}finally{if(_d)throw _e}}return _arr}return function(arr,i){if(Array.isArray(arr))return arr;if(Symbol.iterator in Object(arr))return sliceIterator(arr,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_templateObject=_taggedTemplateLiteral(["| kvstorelookup ",'\n                               | eval "Search query"=search_query, "Field(s) to analyze"=anomaly_fields,\n                               "# of outliers"=outliers_count'],["| kvstorelookup ",'\n                               | eval "Search query"=search_query, "Field(s) to analyze"=anomaly_fields,\n                               "# of outliers"=outliers_count']),_templateObject2=_taggedTemplateLiteral(['| loadjob $searchBarSearchJobIdToken$\n                               | head 1\n                               | transpose\n                               | table column\n                               | search column != "column" AND column != "_*"'],['| loadjob $searchBarSearchJobIdToken$\n                               | head 1\n                               | transpose\n                               | table column\n                               | search column != "column" AND column != "_*"']),_templateObject3=_taggedTemplateLiteral(["| loadjob $searchBarSearchJobIdToken$ | stats count"],["| loadjob $searchBarSearchJobIdToken$ | stats count"]),CategoricalOutlierDetectionView=_BaseAssistantView2["default"].extend({headerOptions:{title:"Detect Categorical Outliers",description:"Find events that contain unusual combinations of values."},tabOptions:{primaryTabTitle:"Detect Outliers",historyTabTitle:"Load Existing Settings"},submitButtonText:"Detect Outliers",render:function(){function updateExperiment(){self.addBasicExperimentInfo();var fields={searchStages:[{type:"main",settings:{algorithm:"anomalydetection",params:[],targetVariable:"",featureVariables:Forms.getToken("rawAnomalyFieldsToken"),modelName:""}}]};self.model.experiment.set(fields)}function loadSavedSearch(sampleSearch){currentSampleSearch=sampleSearch,self.assistantFormView.searchBarControl.setProperties(sampleSearch.value,sampleSearch.earliestTime,sampleSearch.latestTime)}function getVizQuery(sharedSearchArray){var vizQueryArray=[self.model.searchInfo.get("baseSearchString")].concat(sharedSearchArray),vizQuerySearch=DrilldownLinker.createSearch(vizQueryArray,self.model.searchInfo.get("baseTimerange"));return[vizQueryArray,vizQuerySearch]}function updateForm(newIsRunningValue){if(null!=newIsRunningValue&&(isRunning=newIsRunningValue),anomalyFieldsControl.settings.set("disabled",isRunning),isRunning)self.assistantFormView.footer.setDisabled(!0,"Detecting Outliers...");else{var anomalyFieldsToken=Forms.getToken("anomalyFieldsToken"),fieldsValid=null!=anomalyFieldsToken&&anomalyFieldsToken.length>0;self.assistantFormView.footer.setDisabled(!fieldsValid)}}var _this=this,self=this;_BaseAssistantView2["default"].prototype.render.call(this);var _utils$getPageInfo=_utils2["default"].getPageInfo(),showcaseName=_utils$getPageInfo.page,currentSampleSearch=null,isRunning=!1,historyCollectionId=showcaseName+"_history",historySerializer=new _ShowcaseHistorySerializer2["default"](historyCollectionId,{_time:null,search_query:null,earliest_time:null,latest_time:null,anomaly_fields:null,outliers_count:null},function(){Searches.getSearchManager("queryHistorySearch").startSearch()});!function(){Searches.setSearch("queryHistorySearch",{searchString:(0,_compactTemplateString2["default"])(_templateObject,historyCollectionId)})}(),new _QueryHistoryTable2["default"](this.$el.find("#queryHistoryPanel"),"queryHistorySearch",historyCollectionId,["Actions","_time","Search query","Field(s) to analyze","# of outliers"],this.submitButtonText,function(params,autostart){var sampleSearch={value:params.data["row.search_query"],earliestTime:params.data["row.earliest_time"],latestTime:params.data["row.latest_time"],anomalyFields:"string"==typeof params.data["row.anomaly_fields"]?[params.data["row.anomaly_fields"]]:params.data["row.anomaly_fields"],autostart:autostart};loadSavedSearch(sampleSearch),self.assistantFormView.tabs.activate("primaryTab")}).render();var anomalyFieldsControl=function(){var control=new _EnhancedMultiDropdownView2["default"]({id:"anomalyFieldsControl",managerid:"anomalyFieldsSearch",el:_this.$el.find("#anomalyFieldsControl"),labelField:"column",valueField:"column",width:400});return control.$el.prev("label").tooltip({title:"Select the fields to consider. Events with fields taking on rare values, especially events with multiple such fields, may be considered outliers."}),control.on("datachange",function(){if(null!=currentSampleSearch){var choices=Forms.getChoiceViewChoices(control),validChoices=Forms.intersect(choices,currentSampleSearch.anomalyFields);control.val(validChoices),null!=currentSampleSearch&&currentSampleSearch.autostart!==!1?self.assistantFormView.footer.controls.submitButton.trigger("submit"):currentSampleSearch=null}}),control.on("change",function(values){null!=values&&values.length>0?(Forms.setToken("rawAnomalyFieldsToken",values),Forms.setToken("anomalyFieldsToken",values.map(Forms.escape).join(" "))):Forms.unsetToken("anomalyFieldsToken"),updateForm()}),control.render(),control}(),singleOutliersPanel=function(){return new _Master2["default"]({el:_this.$el.find("#singleOutliersPanel"),title:"Outlier(s)",tooltip:"Number of events that are outliers.",viz:_singleview2["default"],vizOptions:{id:"singleOutliersViz",managerid:"anomalousEventsCountSearch",underLabel:"Outlier(s)"},footerButtons:{scheduleAlertButton:!0}})}(),singleResultsPanel=function(){return new _Master2["default"]({el:_this.$el.find("#singleResultsPanel"),title:"Total Event(s)",viz:_singleview2["default"],vizOptions:{id:"singleResultsViz",managerid:"anomalyDetectionResultsCountSearch",underLabel:"Total Event(s)"}})}(),outliersTablePanel=function(){var assistantPanel=new _Master2["default"]({el:_this.$el.find("#outliersTablePanel"),title:"Data and Outliers",tooltip:"The input events with added fields to indicate whether each event is an outlier (isOutlier) and the field that most strongly contributed to this classification (probable_cause).",viz:_tableview2["default"],vizOptions:{id:"outliersTable",managerid:"anomalyDetectionResultsSearch",drilldown:"none"},footerButtons:{scheduleAlertButton:!0}}),outlierFieldIndexArray=[],fieldsCache=[],HighlightedTableRender=_tableview2["default"].BaseCellRenderer.extend({canRender:function(){return!0},render:function($td,cell){if(fieldsCache.push(cell.field),$td.text(cell.value),"probable_cause"===cell.field&&null!=cell.value)outlierFieldIndexArray.push(fieldsCache.indexOf(cell.value)),$td.addClass("outlier-event");else if("isOutlier"===cell.field){fieldsCache=[];var icon="check",colorIndex=7;"1"===cell.value&&(icon="alert",colorIndex=1),$td.addClass("icon-inline").html(_underscoreMltk2["default"].template('<i class="icon-<%-icon%>" style="color: <%-color%>"></i> &#160 <%- text %> ',{icon:icon,text:cell.value,color:(0,_ColorPalette.getColorByIndex)(colorIndex)}))}$td.addClass(TableUtils.columnTypeToClassName(cell.columnType))}});return assistantPanel.viz.addCellRenderer(new HighlightedTableRender),assistantPanel.viz.on("rendered",function(){assistantPanel.viz.$el.find("td.outlier-event.string").each(function(index){if(null!=outlierFieldIndexArray[index]){var fieldIndex=outlierFieldIndexArray[index];(0,_jquery2["default"])(this).parents("tr").find("td:eq("+fieldIndex+")").css("background-color",(0,_ColorPalette.getColorByIndex)(1))}}),outlierFieldIndexArray=[]}),assistantPanel}();return this.assistantFormView.searchBarControl.events.on("change",function(){Forms.clearChoiceView(anomalyFieldsControl,!0),Forms.unsetToken("anomalyFieldsToken","anomalyDetectionResultsToken"),updateForm()}),this.assistantFormView.footer.controls.submitButton.on("submit",function(){currentSampleSearch=null,self.model.experiment?(updateExperiment(),self.model.experiment.save({},{success:function(model,response){Searches.startSearch("anomalyDetectionResultsSearch")},error:function(model,response){self.showErrorMessage(response.responseText)}})):Searches.startSearch("anomalyDetectionResultsSearch")}),function(){var searchBarSearch=Searches.getSearchManager("searchBarSearch");searchBarSearch.on("onStartCallback",function(){self.hideErrorMessage(),self.hideResults()}),searchBarSearch.on("onErrorCallback",function(errorMessage){self.showErrorMessage(errorMessage),self.hideResults()})}(),function(){Searches.setSearch("anomalyFieldsSearch",{searchString:(0,_compactTemplateString2["default"])(_templateObject2),onStartCallback:function(){self.hideErrorMessage()},onErrorCallback:function(errorMessage){self.showErrorMessage(errorMessage),self.hideResults()}})}(),function(){function openInSearch(){var _getVizQuery=getVizQuery(sharedSearchArray),_getVizQuery2=_slicedToArray(_getVizQuery,2);vizQueryArray=_getVizQuery2[0],vizQuerySearch=_getVizQuery2[1],window.open(DrilldownLinker.getUrl("search",vizQuerySearch),"_blank")}function showSPL(){var _getVizQuery3=getVizQuery(sharedSearchArray),_getVizQuery4=_slicedToArray(_getVizQuery3,2);vizQueryArray=_getVizQuery4[0],vizQuerySearch=_getVizQuery4[1],(0,_SearchStringDisplay.showSearchStringModal)("anomalyDetectionResultsSearchModal","Display the outliers in search",vizQueryArray,[null,"compute the categorical outliers","add a field to identify the outliers","reorder the fields","sort the results to make outliers appear at the top"],self.model.searchInfo.get("baseTimerange"))}function scheduleAlert(){new _CategoricalOutlierAlertModal2["default"]({baseSearchString:self.model.searchInfo.get("baseSearchString"),anomalyFields:Forms.getToken("anomalyFieldsToken"),probableCauseList:anomalyFieldsControl.val()}).render().appendTo((0,_jquery2["default"])("body")).show()}var sharedSearchArray=["| anomalydetection $anomalyFieldsToken$ action=annotate",'| eval isOutlier = if(probable_cause != "", "1", "0")',"| table $anomalyFieldsToken$, probable_cause, isOutlier","| sort 100000 probable_cause"],vizQueryArray=[],vizQuerySearch=null;self.assistantFormView.footer.controls.openInSearchButton.on("click",openInSearch),self.assistantFormView.footer.controls.showSPLButton.on("click",showSPL),outliersTablePanel.openInSearchButton.on("click",openInSearch),outliersTablePanel.showSPLButton.on("click",showSPL),outliersTablePanel.scheduleAlertButton.on("click",scheduleAlert),singleOutliersPanel.scheduleAlertButton.on("click",scheduleAlert),Searches.setSearch("anomalyDetectionResultsSearch",{targetJobIdTokenName:"anomalyDetectionResultsToken",autostart:!1,searchString:["| loadjob $searchBarSearchJobIdToken$"].concat(sharedSearchArray),onStartCallback:function(){self.hideResults(),updateForm(!0);var jobId=Searches.getSid("anomalyDetectionResultsSearch"),baseTimerange=self.model.searchInfo.get("baseTimerange"),collection={_time:parseInt((new Date).valueOf()/1e3,10),search_query:self.model.searchInfo.get("baseSearchString"),earliest_time:baseTimerange.earliest_time,latest_time:baseTimerange.latest_time,anomaly_fields:Forms.getToken("rawAnomalyFieldsToken")};historySerializer.persist(jobId,collection);var _getVizQuery5=getVizQuery(sharedSearchArray),_getVizQuery6=_slicedToArray(_getVizQuery5,2);vizQueryArray=_getVizQuery6[0],vizQuerySearch=_getVizQuery6[1],DrilldownLinker.setSearchDrilldown(outliersTablePanel.title,vizQuerySearch)},onDoneCallback:function(){self.showResults()},onFinallyCallback:function(){updateForm(!1)}})}(),function(){var vizQueryArray=[],vizQuerySearch=null,vizOptions=DrilldownLinker.parseVizOptions({category:"singlevalue"});singleOutliersPanel.openInSearchButton.on("click",function(){window.open(DrilldownLinker.getUrl("search",vizQuerySearch,vizOptions),"_blank")}),singleOutliersPanel.showSPLButton.on("click",function(){(0,_SearchStringDisplay.showSearchStringModal)("anomalousEventsCountSearchModal","Display the number of outliers",vizQueryArray,[null,"compute the categorical outliers","count the outliers"],self.model.searchInfo.get("baseTimerange"),vizOptions)}),Searches.setSearch("anomalousEventsCountSearch",{targetJobIdTokenName:"anomalousEventsCountToken",searchString:"| loadjob $anomalyDetectionResultsToken$ | where isOutlier=1 | stats count",onStartCallback:function(){Spinners.showLoadingOverlay(singleOutliersPanel.viz.$el);var _getVizQuery7=getVizQuery(["| anomalydetection $anomalyFieldsToken$","| stats count"]),_getVizQuery8=_slicedToArray(_getVizQuery7,2);vizQueryArray=_getVizQuery8[0],vizQuerySearch=_getVizQuery8[1],DrilldownLinker.setSearchDrilldown(singleOutliersPanel.title,vizQuerySearch,vizOptions)},onDataCallback:function(data){var countIndex=data.fields.indexOf("count");if(data.rows.length>0&&countIndex>=0){var searchManager=Searches.getSearchManager("anomalyDetectionResultsSearch"),jobId=Searches.getSid(searchManager),collection={outliers_count:data.rows[0][countIndex]};historySerializer.persist(jobId,collection)}},onFinallyCallback:function(){Spinners.hideLoadingOverlay(singleOutliersPanel.viz.$el)}})}(),function(){var vizQueryArray=[],vizQuerySearch=null,vizOptions=DrilldownLinker.parseVizOptions({category:"singlevalue"});singleResultsPanel.openInSearchButton.on("click",function(){window.open(DrilldownLinker.getUrl("search",vizQuerySearch,vizOptions),"_blank")}),singleResultsPanel.showSPLButton.on("click",function(){(0,_SearchStringDisplay.showSearchStringModal)("anomalyDetectionResultsCountSearchModal","Display the number of results",vizQueryArray,[null,"annotate the results with categorical outliers","count the results"],self.model.searchInfo.get("baseTimerange"),vizOptions)}),Searches.setSearch("anomalyDetectionResultsCountSearch",{targetJobIdTokenName:"anomalyDetectionResultsCountToken",searchString:(0,_compactTemplateString2["default"])(_templateObject3),onStartCallback:function(){Spinners.showLoadingOverlay(singleResultsPanel.viz.$el);var _getVizQuery9=getVizQuery(["| stats count"]),_getVizQuery10=_slicedToArray(_getVizQuery9,2);vizQueryArray=_getVizQuery10[0],vizQuerySearch=_getVizQuery10[1],DrilldownLinker.setSearchDrilldown(singleResultsPanel.title,vizQuerySearch,vizOptions)},onFinallyCallback:function(data){Spinners.hideLoadingOverlay(singleResultsPanel.viz.$el)}})}(),this.sampleSearchDeferred.done(loadSavedSearch),setTimeout(updateForm,0),this},controlsTemplate:'\n        <div class="mlts-input">\n            <label>Field(s) to analyze</label>\n            <div id="anomalyFieldsControl"></div>\n        </div>\n    ',template:'            \n        <div class="mlts-row mlts-results-row">\n            <div class="mlts-cell">\n                <div class="mlts-panel" id="singleOutliersPanel"></div>                \n            </div>\n            <div class="mlts-cell">\n                <div class="mlts-panel"  id="singleResultsPanel"></div>                \n            </div>\n        </div>\n        <div class="mlts-row mlts-results-row">\n            <div class="mlts-cell">\n                <div class="mlts-panel" id="outliersTablePanel"></div>\n            </div>\n        </div>\n    '}),categoricalOutlierDetectionView=new CategoricalOutlierDetectionView;categoricalOutlierDetectionView.deferreds.viewReady.done(function(layout){layout.getContainerElement().appendChild(categoricalOutlierDetectionView.render().el)})}.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__),!(void 0!==__WEBPACK_AMD_DEFINE_RESULT__&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__))},244:function(module,exports,__webpack_require__){var __WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__;__WEBPACK_AMD_DEFINE_ARRAY__=[module,exports,__webpack_require__("shim/jquery"),__webpack_require__(48),__webpack_require__("splunkjs/mvc/checkboxview"),__webpack_require__("splunkjs/mvc/multidropdownview"),__webpack_require__("splunkjs/mvc/textinputview"),__webpack_require__(237),__webpack_require__(246),__webpack_require__(247),__webpack_require__(235),__webpack_require__("views/shared/Modal")],__WEBPACK_AMD_DEFINE_RESULT__=function(module,exports,_jquery,_underscoreMltk,_checkboxview,_multidropdownview,_textinputview,_Messages,_NumberValidator,_AlertModal,_Forms,_Modal){"use strict";function _interopRequireWildcard(obj){if(obj&&obj.__esModule)return obj;var newObj={};if(null!=obj)for(var key in obj)Object.prototype.hasOwnProperty.call(obj,key)&&(newObj[key]=obj[key]);return newObj["default"]=obj,newObj}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}Object.defineProperty(exports,"__esModule",{value:!0});var _jquery2=_interopRequireDefault(_jquery),_underscoreMltk2=_interopRequireDefault(_underscoreMltk),_checkboxview2=_interopRequireDefault(_checkboxview),_multidropdownview2=_interopRequireDefault(_multidropdownview),_textinputview2=_interopRequireDefault(_textinputview),Messages=_interopRequireWildcard(_Messages),NumberValidator=_interopRequireWildcard(_NumberValidator),_AlertModal2=_interopRequireDefault(_AlertModal),Forms=_interopRequireWildcard(_Forms),_Modal2=_interopRequireDefault(_Modal);exports["default"]=_Modal2["default"].extend({className:_Modal2["default"].CLASS_NAME+" "+_Modal2["default"].CLASS_MODAL_WIDE,initialize:function(options){this.options=_underscoreMltk2["default"].extend({onHiddenRemove:!0},this.options),_Modal2["default"].prototype.initialize.apply(this,arguments)},events:_jquery2["default"].extend({},_Modal2["default"].prototype.events,{"click .btn-primary":function(e){var _this=this;e.preventDefault();var submitButton=(0,_jquery2["default"])(e.target);this.removeAlert();var minOutliersCount=this.controls.count.val(),isValid=NumberValidator.validate(minOutliersCount,{min:0});if(Messages.setFormInputStatus(this.controls.count,isValid),isValid){var probableCauses=this.controls.probableCauseCheckbox.val()?this.controls.probableCause.val():[],probableCauseSearch=probableCauses.length>0?" | where "+probableCauses.map(function(probableCause){return"probable_cause = "+Forms.escape(probableCause)}).join(" OR "):"",searchString=this.options.baseSearchString+" | anomalydetection "+this.options.anomalyFields+" "+probableCauseSearch,submitButtonText=submitButton.text();submitButton.attr("disabled",!0).text("Loading..."),new _AlertModal2["default"]({searchString:searchString}).done(function(alertModal){_this.shown?(_this.hide(),alertModal.model.alert.entry.content.set("ui.scheduled.resultsinput",minOutliersCount),alertModal.render().appendTo((0,_jquery2["default"])("body")).show()):alertModal.remove()}).fail(function(message){_this.setAlert(message),submitButton.attr("disabled",!1).text(submitButtonText)})}else this.setAlert("Alert count must be a positive number.")},hide:function(){var _this2=this;Object.keys(this.controls).forEach(function(id){return _this2.controls[id].remove()})}}),render:function(){var _this3=this;return this.$el.html(_Modal2["default"].TEMPLATE),this.$el.addClass("categorical-outlier-alert-modal"),this.$(_Modal2["default"].HEADER_TITLE_SELECTOR).text("Schedule an alert"),this.alertWrapper=(0,_jquery2["default"])('<div class="mlts-modal-alert">'),this.$(_Modal2["default"].BODY_SELECTOR).prepend(this.alertWrapper),this.$(_Modal2["default"].BODY_SELECTOR).append(_Modal2["default"].FORM_HORIZONTAL),this.$(_Modal2["default"].BODY_FORM_SELECTOR).append('\n            <p>Alert me when the number of outliers is greater than</p>\n            <span class="categorical-outlier-alert-modal-count-control"></span>         \n            <br>\n            <label class="checkbox">\n                <span class="categorical-outlier-alert-modal-probable-cause-checkbox"></span>        \n                <span>Alert only for outliers with the following probable_cause:</span>\n            </label>\n            <span class="categorical-outlier-alert-modal-probable-cause-control"></span>\n        ').addClass("mlts-modal-form-inline"),this.controls={count:new _textinputview2["default"]({id:"categoricalOutliersAlertModalCountControl",el:this.$el.find(".categorical-outlier-alert-modal-count-control"),value:0}),probableCauseCheckbox:new _checkboxview2["default"]({id:"categoricalOutliersAlertModalProbableCauseCheckbox",el:this.$el.find(".categorical-outlier-alert-modal-probable-cause-checkbox"),"default":!1}),probableCause:new _multidropdownview2["default"]({id:"categoricalOutliersAlertModalProbableCauseControl",el:this.$el.find(".categorical-outlier-alert-modal-probable-cause-control"),width:300,choices:this.options.probableCauseList.map(function(choice){return{value:choice}}),disabled:!0})},this.controls.probableCauseCheckbox.on("change",function(checked){_this3.controls.probableCause.settings.set("disabled",!checked)}),Object.keys(this.controls).forEach(function(id){return _this3.controls[id].render()}),this.$(_Modal2["default"].FOOTER_SELECTOR).append(_Modal2["default"].BUTTON_CANCEL),this.$(_Modal2["default"].FOOTER_SELECTOR).append(_Modal2["default"].BUTTON_NEXT),this},setAlert:function(alertMessage,alertType){Messages.setAlert(this.alertWrapper,alertMessage,alertType,void 0,!0)},removeAlert:function(){Messages.removeAlert(this.alertWrapper,!0)}}),module.exports=exports["default"]}.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__),!(void 0!==__WEBPACK_AMD_DEFINE_RESULT__&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__))}});