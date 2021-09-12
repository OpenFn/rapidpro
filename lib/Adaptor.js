"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = execute;
exports.addContact = addContact;
exports.createPatient = createPatient;
Object.defineProperty(exports, "alterState", {
  enumerable: true,
  get: function () {
    return _languageCommon.alterState;
  }
});
Object.defineProperty(exports, "fn", {
  enumerable: true,
  get: function () {
    return _languageCommon.fn;
  }
});
Object.defineProperty(exports, "dataPath", {
  enumerable: true,
  get: function () {
    return _languageCommon.dataPath;
  }
});
Object.defineProperty(exports, "dataValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.dataValue;
  }
});
Object.defineProperty(exports, "each", {
  enumerable: true,
  get: function () {
    return _languageCommon.each;
  }
});
Object.defineProperty(exports, "field", {
  enumerable: true,
  get: function () {
    return _languageCommon.field;
  }
});
Object.defineProperty(exports, "fields", {
  enumerable: true,
  get: function () {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, "http", {
  enumerable: true,
  get: function () {
    return _languageCommon.http;
  }
});
Object.defineProperty(exports, "lastReferenceValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.lastReferenceValue;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function () {
    return _languageCommon.merge;
  }
});
Object.defineProperty(exports, "sourceValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.sourceValue;
  }
});

var _languageCommon = require("@openfn/language-common");

/** @module Adaptor */
const {
  axios
} = _languageCommon.http;
exports.axios = axios;
/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @function
 * @param {Operations} operations - Operations to be performed.
 * @returns {Operation}
 */

function execute(...operations) {
  const initialState = {
    references: [],
    data: null
  };
  return state => {
    return (0, _languageCommon.execute)(...operations)({ ...initialState,
      ...state
    });
  };
}
/**
 * Creates a fictional resource in a fictional destination system using a POST request
 * @public
 * @example
 * addContact({
 *   name: "Mamadou",
 *   language: "ENG",
 *   urns: ["tel:+250788123123"]
 * });
 * @function
 * @param {object} params - data to create the new resource
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */


function addContact(params, callback) {
  return state => {
    params = (0, _languageCommon.expandReferences)(params)(state);
    const {
      host,
      apiVersion,
      token
    } = state.configuration;
    const url = `${host}/api/${apiVersion || 'v2'}/contacts.json`;
    const config = {
      url,
      body: params,
      headers: {
        Authorization: `Token ${token}`
      }
    };
    return _languageCommon.http.post(config)(state).then(response => {
      const nextState = { ...(0, _languageCommon.composeNextState)(state, response.data),
        response
      };
      if (callback) return callback(nextState);
      return nextState;
    });
  };
}
/**
 * Create a fictional patient in a fictional universe with a fictional REST api
 * @public
 * @example
 * createPatient({"foo": "bar"})
 * @function
 * @param {object} params - data to create the new resource
 * @param {function} callback - (Optional) callback function
 * @returns {Operation}
 */


function createPatient(params, callback) {
  return state => {
    params = (0, _languageCommon.expandReferences)(params)(state);
    const {
      baseUrl,
      username,
      password
    } = state.configuration;
    const url = `${baseUrl}/patient`;
    const auth = {
      username,
      password
    };
    const config = {
      url,
      body: params,
      auth
    };
    return _languageCommon.http.post(config)(state).then(response => {
      const nextState = { ...(0, _languageCommon.composeNextState)(state, response.data),
        response
      };
      if (callback) return callback(nextState);
      return nextState;
    });
  };
} // What functions do you want from the common adaptor?