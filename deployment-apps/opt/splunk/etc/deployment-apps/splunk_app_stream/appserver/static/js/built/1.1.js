webpackJsonp([1],{"api/layout":function(a,b,c){var d,e;d=[c("splunkjs/mvc/layoutview")],e=function(a){var b;return{create:function(c){if(b)throw new Error("Layout may only be created once");return b=new a(c).render(),{getContainerElement:function(){return b.getContainerElement()}}}}}.apply(b,d),!(void 0!==e&&(a.exports=e))},"splunkjs/mvc/layoutview":function(a,b,c){var d;d=function(a,b,d){var e=c("shim/jquery"),f=c("require/underscore"),g=c("require/backbone"),h=c("splunkjs/mvc/basesplunkview"),i=c("splunkjs/mvc/headerview"),j=c("splunkjs/mvc/footerview"),k=c(123),l=c("shim/splunk.util"),m=(c("splunkjs/mvc/sharedmodels"),h.extend({moduleId:d.id,el:"body",options:{hideChrome:!1,hideAppBar:!1,hideSplunkBar:!1,hideFooter:!1,hideAppsList:!1,layout:"scrolling"},initialize:function(a){this.configure(),h.prototype.initialize.apply(this,arguments),this.$el.removeAttr("class").removeAttr("id")},getContainerElement:function(){if(this._$main)return this._$main[0];throw new Error("Layout must be rendered before container can be accessed")},render:function(){var a=f.template(this.template);this.$el.append(a({_:f,make_url:l.make_url})),this._$main=e('<div role="main">'),this.$("#navSkip").after(this._$main),this._applyLayoutStyles();var b=this.$("header");if(!this.options.hideChrome&&(this._headerView=new i({id:"header",el:b,splunkbar:!this.options.hideSplunkBar,appbar:!this.options.hideAppBar,showAppsList:!this.options.hideAppsList}).render(),b.removeAttr("class").removeAttr("id"),!this.options.hideFooter)){var c=this.$("footer");this._footerView=new j({id:"footer",el:c}).render(),c.removeAttr("class").removeAttr("id")}return this},remove:function(){return this._$main=null,this._headerView.remove(),this._footerView.remove(),h.prototype.remove.apply(this,arguments)},setElement:function(){return g.View.prototype.setElement.apply(this,arguments)},_applyLayoutStyles:function(){this.$el.css({margin:0}),"fixed"===this.options.layout?(this._$main.css({flex:"1 0 0",position:"relative"}),this.$el.css({display:"flex",flexDirection:"column",position:"fixed",left:0,top:0,right:0,bottom:0,overflow:"hidden"}),this.$el.find("header, footer").css({flex:"0 0 auto"})):this._$main.css({position:"relative",minHeight:"500px"})},template:k}));return m}.call(b,c,b,a),!(void 0!==d&&(a.exports=d))},123:function(a,b){a.exports="<style>\n    /*  Fonts */\n    /*  ----------- */\n\n    /*  Regular */\n    @font-face {\n        font-family: 'Roboto';\n        src: url('<%- make_url(\"static/fonts/roboto-regular-webfont.woff\") %>') format('woff');\n        font-weight: normal;\n        font-style: normal;\n    }\n\n    /*  Bold */\n    @font-face {\n        font-family: 'Roboto';\n        src: url('<%- make_url(\"static/fonts/roboto-bold-webfont.woff\") %>') format('woff');\n        font-weight: bold;\n        font-style: normal;\n    }\n\n    /*  light */\n    @font-face {\n        font-family: 'Roboto';\n        src: url('<%- make_url(\"static/fonts/roboto-light-webfont.woff\") %>') format('woff');\n        font-weight: 200;\n        font-style: normal;\n    }\n\n    @font-face {\n      font-family: 'Architects Daughter';\n      font-style: normal;\n      font-weight: normal;\n      src: url('<%- make_url(\"static/fonts/ArchitectsDaughter.ttf\") %>') format('truetype');\n    }\n</style>\n<a style=\"position:absolute; top:-100px; left:-1000px\" href=\"#navSkip\" tabIndex=\"1\">\n    <%- _(\"Screen reader users, click here to skip the navigation bar\").t() %>\n</a>\n<header></header>\n<a id=\"navSkip\"></a>\n<footer></footer>'\n"}});
//# sourceMappingURL=1.1.js.map