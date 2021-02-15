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

module.exports = function(node, direction) {
  let mcursor;
  if (this.documentStore.db.params.database.type === 'BDB') {
    mcursor = require('mg-dbx-bdb').mcursor;
  }
  else {
    mcursor = require('mg-dbx').mcursor;
  }
  direction = direction || 'forwards';
  if (direction !== 'forwards' && direction !== 'backwards') direction = 'forwards';
  if (node.global) {
    var query;
    if (node.dbx_query) {
      //console.log('*** using cached dbx query object');
      query = node.dbx_query;
    }
    else {
      var options = {
        multilevel: true,
        getdata: true
      };
      var global = {
        global: node.global
      }
      if (node.subscripts) {
        global.key = [];
        node.subscripts.forEach(function(sub) {
          global.key.push(sub.toString());
        });
        //global.keys = node.subscripts;
      }
      else {
        global.key = [];
      }
      //console.log('registered global query: ' + JSON.stringify(global, null, 2));
      //query = this.documentStore.db.dbx.mglobalquery(global, options);
      query = new mcursor(this.documentStore.db.dbx, global, options);
      //node.dbx_query = query;
    }

    var result;
    if (direction === 'forwards') {
      result = query.next();
      //console.log('query.next result: ' + JSON.stringify(result, null, 2));
    }
    else {
      result = query.previous();
    }
    if (!result || result.key.length === 0) {
      return {
        global: node.global,
        defined: 0
      }
    }
    else {
      return {
        ok: 1,
        global: node.global,
        subscripts: result.key,
        data: result.data,
        defined: 1,
        dbx_query: query
      }
    }
  }
  else {
    return {
      ok: 0
    };
  }
};
