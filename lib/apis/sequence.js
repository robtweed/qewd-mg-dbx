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

  13 November 2019

*/

var registeredGlobal = require('./_getRegisteredGlobal');

module.exports = function(direction) {

    var node = this._node;
    var subscripts = node.subscripts;

    var parent_subscripts = [];
    var key = '';
    if (subscripts && subscripts.length > 0) {
      parent_subscripts = subscripts.slice(0, -1);
      key = subscripts[subscripts.length - 1];
    }

    var global = registeredGlobal.call(this, {useParent: true});

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
      subscripts: parent_subscripts
    };
};
