import adapter from 'api/adapter';
import { isUndefOrNull } from 'lib/utils';

export default {
  create: function(params) {
    params = params || {};
    var instance = Object.create(this.instance);
    instance.class = this;
    instance.isNew = isUndefOrNull(params.id);
    instance.isDeleted = false;
    if (params.id) {
      instance.id = params.id;
    }
    return instance;
  },

  fetchAll: function(params) {
    return adapter.get(this.urlPath).then(this.bulkCreate.bind(this));
  },

  get: function(id) {
    return adapter.get(this.urlPath, { id: id }).then(this.create.bind(this));
  },

  // Helper fn, as Array.prototype.map will rebind the callback to window by default
  bulkCreate: function(dataForObjects) {
    return dataForObjects.map(this.create, this);
  },

  urlPath: null,

  toString: function() {
    return 'models.' + this.className;
  },

  instance: {
    class: null,
    isNew: null,
    isDeleted: null,

    save: function() {
      var self = this;
      this.isSaving = true;
      if (this.isNew) {
        return adapter.post(this.class.urlPath, this.toJSON()).then(function(data) {
          self.id = data.id;
          self.isNew = false;
          self.isSaving = false;
          return self;
        });
      } else {
        return adapter.put(this.class.urlPath, this.toJSON()).then(function() {
          self.isSaving = false;
          return self;
        });
      }
    },

    delete: function() {
      var self = this;
      this.isDeleting = true;
      return adapter.delete(this.class.urlPath, { id: this.id }).then(function() {
        self.isDeleting = false;
        self.isDeleted = true;
        return self;
      });
    },

    toJSON: function() {
      throw new Error('"toJSON" not implemented for ' + this.class.toString());
    }
  }
};
