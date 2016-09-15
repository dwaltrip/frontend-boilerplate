import m from 'mithril';
import settings from 'settings';

// TODO: update this to integrate with json-api-store
export default {
  // this value should come from the config/environment
  domain: settings.API_URL,

  get: function(resource, data) {
    var data = data || {};
    return this.ajax('get', resource + '/' + (data.id || ''));
  },

  post: function(resource, data) {
    return this.ajax('post', resource + '/', data);
  },

  put: function(resource, data) {
    if (!data.id) {
      throw new Error("API.put requires 'data' obj to have the field 'id'");
    }
    return this.ajax('put', resource + '/' + data.id + '/', data);
  },

  delete: function(resource, data) {
    var data = data || {};
    return this.ajax('delete', resource + '/' + (data.id ? (data.id + '/') : ''));
  },

  ajax: function(method, relativeUrl, data) {
    var params = {
      method: method,
      url: this.domain + relativeUrl,
      unwrapSuccess: function(response) {
        if (response) {
          if (typeof response.data !== 'undefined') {
            return response.data;
          } else {
            return response;
          }
        } else {
          return null;
        }
      },
      config: xhrConfig
    };
    if (data) {
      params.data = data;
    }

    return m.request(params)
  }
};

function xhrConfig(xhr) {
  xhr.withCredentials = true;
}
