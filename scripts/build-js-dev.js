var browserify = require('browserify');
var path = require('path');
var fs = require('fs');

// browserify plugins & transforms
var babelify = require('babelify');

var ROOT_DIR = path.join(__dirname, '../');
var SRC_DIR = path.join(ROOT_DIR, 'www');
var OUTPATH = path.join(SRC_DIR, 'dist/bundle.js');

function initBrowserify(options) {
  var options = options || {};
  options.paths = [path.join(SRC_DIR, 'js')];
  options.debug = true;
  return browserify(path.join(SRC_DIR, 'js/init.js'), options);
}

function setupES6Transpile(b) {
  // Setup babelify
  b.transform(babelify, { 'presets': ['es2015'] });
}

function buildBundle(b) {
  b.bundle().pipe(fs.createWriteStream(OUTPATH));
}

// Execute the build if this script was run directly
if (require.main === module) {
  var b = initBrowserify();
  setupES6Transpile(b);
  buildBundle(b);
}

module.exports = {
  initBrowserify: initBrowserify,
  setupES6Transpile: setupES6Transpile,
  buildBundle: buildBundle,
  ROOT_DIR: ROOT_DIR,
  SRC_DIR: SRC_DIR,
  OUTPATH: OUTPATH
};
