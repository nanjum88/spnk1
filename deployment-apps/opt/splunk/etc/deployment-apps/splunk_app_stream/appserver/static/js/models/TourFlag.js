define([
    "jquery",
    "underscore",
    "backbone"
], function(
    $,
    _,
    Backbone
    ) {
    return Backbone.Model.extend({

        urlRoot: Splunk.util.make_url([
            "custom",
            "splunk_app_stream",
            "users",
            "current",
            "tour"
        ].join('/')),

        initialize: function () {

        },

        defaults: {},

    });
});