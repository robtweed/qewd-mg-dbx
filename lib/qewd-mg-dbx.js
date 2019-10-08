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

  20 September 2019

*/

var mg_dbx = require('mg-dbx').dbx;

var buildNo = '0.1';

var apis = {
      version: require('./apis/version'),
      open: require('./apis/open'),
      close: require('./apis/close'),
      set: require('./apis/set'),
      get: require('./apis/get'),
      data: require('./apis/data'),
      increment: require('./apis/increment'),
      kill: require('./apis/kill'),
      leafNodes: require('./apis/leafNodes'),
      lock: require('./apis/lock'),
      unlock: require('./apis/unlock'),
      sequence: require('./apis/sequence'),

      //global_directory: require('./apis/globalDirectory'),

      //setAsync: require('./apis/setAsync'),
      //getAsync: require('./apis/getAsync'),
      //killAsync: require('./apis/killAsync'),
      //openAsync: require('./apis/openAsync'),
      //closeAsync: require('./apis/closeAsync'),
      //versionAsync: require('./apis/versionAsync'),
      //sequenceAsync: require('./apis/sequenceAsync')
};

function db(params) {
  this.build = 'qewd-mg-dbx ' + buildNo;
  this.dbx = new mg_dbx();
  this.params = params;
}

proto = db.prototype;

proto.buildNo = function() {
  return buildNo;
};

proto.about = function() {
  return 'qewd-mg-dbx: Normalising interface around mg_dbx to make it compatible with cache.node and NodeM';
};

proto.close = apis.close;
proto.data = apis.data;
proto.get = apis.get;
proto.kill = apis.kill;
proto.open = apis.open;
proto.set = apis.set;
proto.increment = apis.increment;
proto.lock = apis.lock;
proto.unlock = apis.unlock;
proto.version = apis.version;

proto.next_node = function(node) {
  return apis.leafNodes.call(this, node, 'forwards');
};

proto.previous_node = function(node) {
  return apis.leafNodes.call(this, node, 'backwards');
};

proto.next = function(node) {
  return apis.sequence.call(this, node, 'next');
};

proto.order = function(node) {
  return apis.sequence.call(this, node, 'next');
};

proto.previous = function(node) {
  return apis.sequence.call(this, node, 'previous');
};

/*
proto.openAsync = apis.openAsync;
proto.closeAsync = apis.closeAsync;
proto.setAsync = apis.setAsync;
proto.getAsync = apis.getAsync;
proto.killAsync = apis.killAsync;
proto.sequenceAsync = apis.sequenceAsync;
proto.versionAsync = apis.versionAsync;


proto.global_directory = apis.global_directory;



*/


module.exports = db;
