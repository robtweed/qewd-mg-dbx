/*

 ----------------------------------------------------------------------------
 | qewd-mg-dbx: Interface Wrapper to make mg_dbx behave like cache.node     |
 |                                                                          |
 | Copyright (c) 2019 M/Gateway Developments Ltd,                           |
 | Reigate, Surrey UK.                                                      |
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

  7 October 2019

*/

var registeredGlobal = require('./_getRegisteredGlobal');

module.exports = function(node, direction) {

  if (node.global) {
    if (!node.subscripts || node.subscripts.length === 0) {
      node.subscripts = ['']
    }
    var node_parent = {
      global: node.global
    };
    if (node.parent_dbx_global) {
      node_parent.dbx_global = node.parent_dbx_global;
    }
    var parent_subscripts = [];
    if (node.subscripts.length > 1) {
      parent_subscripts = node.subscripts.slice(0, -1);
      node_parent.subscripts = parent_subscripts;
    }
    var key = node.subscripts[node.subscripts.length - 1];

    var global;
    ({node, global} = registeredGlobal.call(this, node_parent));

    var result;
    if (direction === 'previous') {
      result = global.previous(key);
    }
    else {
      result = global.next(key);
    }
    parent_subscripts.push(result);
    return {
      ok: 1,
      global: node.global,
      result: result,
      subscripts: parent_subscripts,
      parent_dbx_global: global
    };
  }
  else {
    return {ok: 0};
  }
};
