var assign = require('object-assign');
var factory = require('factory-girl');
var Adapter = factory.Adapter;

var ObjectionAdapter = function () { }
ObjectionAdapter.prototype = new Adapter();

ObjectionAdapter.prototype.save = function (doc, Model, cb) {
  Model.query().insert(doc.toJSON())
    .then(function (record) {
      assign(doc, record);
      cb(null, doc);
    }).catch(cb);
};

ObjectionAdapter.prototype.destroy = function (doc, Model, cb) {
  if (!doc[Model.idColumn]) return process.nextTick(cb);
  Model.query().deleteById(doc[Model.idColumn]).nodeify(cb);
}

var adapter = new ObjectionAdapter();

module.exports = function (models) {
  if (models && models.length) {
    for (var i = 0; i < models.length; i++) {
      factory.setAdapter(adapter, models[i]);
    }
  } else {
    factory.setAdapter(adapter);
  }

  return adapter;
}

module.exports.ObjectionAdapter = ObjectionAdapter;