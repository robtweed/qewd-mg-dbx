/*

 ----------------------------------------------------------------------------
 | qewd-mg-dbx: Interface Wrapper to make mg_dbx behave like cache.node     |
 |                                                                          |
 | Copyright (c) 2019-21 M/Gateway Developments Ltd,                        |
 | Redhill, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  15 February 2021

*/


module.exports = function(params) {
  let mglobal;
  if (this.documentStore.db.params.database.type === 'BDB') {
    mglobal = require('mg-dbx-bdb').mglobal;
  }
  else {
    mglobal = require('mg-dbx').mglobal;
  }
  var global;
  var node;
  var documentStore = this.documentStore;
  var dbx = documentStore.db.dbx;
  //var mglobal = documentStore.db.dbx.mglobal;
  var dbx_reg = documentStore.dbx_reg;
  var key;

  if (params) {
    if (params.useParent) {
      var parent_subscripts = [];
      if (this._node.subscripts.length > 1) {
        parent_subscripts = this._node.subscripts.slice(0, -1);
      }
      node = {
        global: this._node.global,
        subscripts: parent_subscripts,
        initialise: this._node.initialise
      };
      key = node.global  + ';' + parent_subscripts.join();
    }
    else {
      node = this._node;
      key = this.key;
    }
  }
  else {
    node = this._node;
    key = this.key;
  }

  if (!node.initialise && dbx_reg[key]) {
    global = dbx_reg[key];
    //console.log('*** using cached registered global: ' + key);
  }
  else {
    delete node.initialise;
    //console.log('registering new global: ' + JSON.stringify(node)); 
    if (node.subscripts) {
      //global = dbx.mglobal(node.global, ...node.subscripts);
      global = new mglobal(dbx, node.global, ...node.subscripts);
    }
    else {
      //global = dbx.mglobal(node.global);
      global = new mglobal(dbx, node.global);
    }
    //dbx_reg[key] = global;
  }
  return global;
};
