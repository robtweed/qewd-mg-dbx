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

  6 October 2019

*/

module.exports = function(node) {
  var global;
  if (node.dbx_global) {
    global = node.dbx_global;
    console.log('*** using cached registered global');
  }
  else {
    if (node.subscripts) {
      global = this.dbx.mglobal(node.global, ...node.subscripts);
    }
    else {
      global = this.dbx.mglobal(node.global);
    }
    node.dbx_global = global;
  }
  return {
    global: global,
    node: node
  }

};
