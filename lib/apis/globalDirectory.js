/*

 ----------------------------------------------------------------------------
 | qewd-mg-dbx: Interface Wrapper to make mg_dbx behave like cache.node     |
 |                                                                          |
 | Copyright (c) 2019-20 M/Gateway Developments Ltd,                        |
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

  18 June 2020

*/

let mcursor = require('mg-dbx').mcursor;

module.exports = function() {
  var results = [];
  var result;
  //var query = this.dbx.mglobalquery({global: ''}, {globaldirectory: true});
  var query = new mcursor(this.dbx, {global: ''}, {globaldirectory: true});
  while ((result = query.next()) !== null) {
    results.push(result);  
  }
  return results;
};
