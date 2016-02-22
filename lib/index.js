var S = require('string');
var P = require('path');
var fs = require('fs');
var read = require('fs-readdir-recursive');
var extend = require('extend');

/** HIERARCHIES: Metalsmith plugin to consume
  * nav hierarchy files written in JSON and make
  * them available to Metalsmith.
  *
  * @param {Object} options (optional)
  * @return {Function}
  */

module.exports = function(opts) {

  // Plugin Options

  var opts = extend({
    directory: './hierarchies/',
    metaProperty: 'hierarchies',
  }, opts || {});

  /** This function fleshes out the config file with
    * more information about each page on the site.
    */

  var traverseConfig = function(config, path, depth) {
    var path = path || [];
    var depth = depth || 0;

    // Set the depth of the node...
    config.depth = depth;

    // Determine the path of the node...
    if (config.path !== false) {
      if (config.path == "" || config.path == null) {
        if (typeof config.name == 'string') {
          // Set the slug if it's missing...
          config.slug = (config.slug == null ? S(config.name).slugify().s : config.slug)
          path.push(config.slug)
        }
      } else {
        path.push(config.path)
      }
      config.path = path.join('/');
    }

    // Dive into any child pages...
    if(config.pages) {
      depth = depth + 1;
      config.pages.forEach(function(e) {
        traverseConfig(e, path, depth);
      });
    }

    // If we're not skipping this node in the path,
    // pop it off the end as we ascend back up...
    if (config.path !== false) path.pop();

    return config;
  };

  return function(files, metalsmith, done) {
    var meta = metalsmith.metadata();
    var navs = {};

    var files = read(opts.directory);

    if (files.length === 0) {
      meta[opts.metaProperty] = {};
      done();
    }

    files.forEach(function(file, i) {
      var ext = P.extname(file);
      var name = file.replace(ext, '');
      var filePath = opts.directory + file;

      var fileContents = fs.readFileSync(filePath).toString('utf8').trim();

      try {
        fileContents = JSON.parse(fileContents);
      } catch(e) {
        console.log("Bad JSON in " + filePath + ".");
      }

      navs[S(name).camelize().s] = traverseConfig(fileContents);
    });

    meta[opts.metaProperty] = navs;

    done();
  }
}
