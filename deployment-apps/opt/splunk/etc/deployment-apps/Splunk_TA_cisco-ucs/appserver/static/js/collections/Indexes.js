define([
    'jquery',
    'underscore',
    'backbone',
    "splunk.util",
    'app/models/Index'],
function(
    $,
    _,
    Backbone,
    splunkdUtils,
    Index
) {
    return Backbone.Collection.extend({
        url: splunkdUtils.make_url('custom/Splunk_TA_cisco-ucs/manage_indexes/indexes'),
        model: Index

    });
});


