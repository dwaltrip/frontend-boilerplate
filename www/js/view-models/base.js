import m from 'mithril';
import { isUndefOrNull } from 'lib/utils';

export default {
  create: function(model, index) {
    var vm = Object.create(this.instance);
    vm.model = model;

    vm.initFields();
    // TODO: remove this when DB has the index field for all appropriate sub-models
    if (vm.fields.indexOf('index') > -1 && !isUndefOrNull(index)) {
      vm.index(index);
    }

    return vm;
  },

  instance: {
    fields: [],

    initFields: function() {
      this.fields.forEach(name => {
        this[name] = m.prop(this.model[name]);
      });
    },

    rollback: function() {
      this.initFields();
    },

    toJSON: function() {
      return this.fields.reduce((data, name) => {
        data[name] = this[name]();
        return data;
      }, {});
    }
  }
};
