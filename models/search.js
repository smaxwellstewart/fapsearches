var Joi = require('joi');
var extend = require('extend-object');
var BaseModel = require('./base');

var Search = BaseModel.extend({
    constructor: function (attrs) {

        extend(this, attrs);
    }
});


Search._collection = 'searches';


Search.schema = Joi.object().keys({
    _id: Joi.object(),
    text: Joi.string().required(),
    _ts: Joi.date()
});


Search.indexes = [
    [{ keyword: 'text' }, { default_language: "english", background: true }],
    [{ segment: 1 }, { background: true }]
];


Search.create = function (doc, callback) {

    var document = doc;
    doc._ts = new Date();

    this.insert(document, function (err, searches) {

        if (err) {
            return callback(err);
        }

        callback(null, searches[0]);
    });
};


// Search.summary = function (agg, callback) {
//     this.aggregate(agg, callback);
// };


module.exports = Search;
