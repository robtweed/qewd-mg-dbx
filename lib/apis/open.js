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

module.exports = function() {

  var params;
  if (!this.params) {
    this.params = {};
  }

  if (!this.params.database) {
    this.params.database = {};
  }
  var status = 'Invalid database type';
  var open_params;

  if (this.params.database.type === 'YottaDB') {
    if (!this.params.env) {
      this.params.env = {};
    }
    var arch = this.params.database.architecture;
    if (arch === 'x86') {
      arch = 'x86_64'
    }
    if (arch === 'arm') {
      arch = 'armv7l'
    }
    var release = this.params.database.release;
    var usrlib_dir = process.env.ydb_dist;
    if (!usrlib_dir && release) {
      var rp = release.split('.');
      usrlib_dir = '/usr/local/lib/yottadb/' + rp[0] + rp[1];
    }

    var home = process.env.HOME;
    var ydb_path;
    var ydb_dir = process.env.ydb_dir || this.params.env.ydb_dir;
    if (!ydb_dir && home) {
      ydb_dir = home + '/.yottadb';
    }
    if (!ydb_dir) {
      return {error: 'Unable to determine HOME environment variable'};
    }

    var ydb_rel = process.env.ydb_rel || this.params.env.ydb_dir;
    if (!ydb_rel && release && arch) {
      ydb_rel = release + '_' + arch;
    }
    if (!ydb_rel) {
      return {error: 'Unable to determine YottaDB release and/or architecture'};
    }

    if (home) {
      ydb_path = home + '/.yottadb' + '/' + ydb_rel;
    }

    var ydb_gbldir = process.env.ydb_gbldir || this.params.env.ydb_gbldir;
    if (!ydb_gbldir && ydb_path) {
      ydb_gbldir = ydb_path + '/g/yottadb.gld';
    }
    if (!ydb_gbldir) {
      return {error: 'Unable to determine HOME environment variable'};
    }

    var ydb_routines = process.env.ydb_routines || this.params.env.ydb_routines;
    if (!ydb_routines && ydb_path && usrlib_dir) {
      ydb_routines = ydb_path + '/o*(' + ydb_path + '/r ' + ydb_dir + '/r) ' + usrlib_dir + '/libyottadbutil.so';
    }
    if (!ydb_routines) {
      return {error: 'Unable to determine YottaDB release and/or architecture'};
    }
    // /home/rtweed/.yottadb/r1.22_x86_64/o*(/home/rtweed/.yottadb/r1.22_x86_64/r /home/rtweed/.yottadb/r) /usr/local/lib/yottadb/r122/libyottadbutil.so

    var ydb_ci;
    if (usrlib_dir) {
      ydb_cli = usrlib_dir + '/qewd.ci';
    }
    if (!ydb_cli) {
      return {error: 'Unable to determine YottaDB release'};
    }


    var envvars = '';
    envvars = envvars + 'ydb_dir=' + ydb_dir + '\n'
    envvars = envvars + 'ydb_rel=' + ydb_rel + '\n'
    envvars = envvars + 'ydb_gbldir=' + ydb_gbldir + '\n'
    envvars = envvars + 'ydb_routines=' + ydb_routines + '\n'
    envvars = envvars + 'ydb_ci=' + ydb_cli + '\n'
    envvars = envvars + "\n"

    open_params = {
      type: 'YottaDB',
      path: usrlib_dir,
      env_vars: envvars
    };

    if (this.params.database.multithreaded) {
      open_params.multithreaded = true;
    }

    console.log('dbx open params: ' + JSON.stringify(open_params, null, 2));

    status = this.dbx.open(open_params);
  }
  if (this.params.database.type === 'IRIS' || this.params.database.type === 'Cache') {

    open_params = {
      type: this.params.database.type,
      path: this.params.database.path,
      username: this.params.database.username,
      password: this.params.database.password,
      namespace: this.params.database.namespace
    };

    if (this.params.database.multithreaded) {
      open_params.multithreaded = true;
    }

    status = this.dbx.open(open_params);
  }

  if (status !== '') {
    return {error: status};
  }

  return {
    ok: true,
    status: status
  };

};
