
# metalsmith-hierarchies

  A plugin for Metalsmith for consuming and using JSON navigation hierarchies. This plugin is in development.

## Installation

    $ npm install lrenhrda/metalsmith-hierarchies

## Description

  By default this plugin looks in the `./hierarchies/` directory for JSON files that describe hierarchies of navigation for a site. It processes each hierarchy it finds and injects additional data before making them all available to Metalsmith.

  Hierarchies are node-based structures that can be nested. Each node requires at least a `"name"` property, and optionally `"pages"`, which is an array of all child pages in the structure. As the tree is traversed, path segments are generated from the `"name"` field or from an optional overriding `"slug"` field, and the segment is used to construct the path to the node. One may also override the path of a node by defining a `"path"` segment manually on a node. The top-level begins with 0 and the name of the structure for the `"name"` field.

  Once these files are processed they are made available to Metalsmith under the `hierarchies` metadata property.

## Usage

### Via JavaScript

```
var hierarchies = require('metalsmith-hierarchies');

gulp.task('build', function() {
  return gulp.src('./content/**/*.*')
    .pipe(metalsmith({
      use: [
        hierarchies({
          ...
        })
      ]
    }))
    .pipe(gulp.dest('./build'));
});

```

### Options

`hierarchies: './hierarchies/'`;

The location where hierarchy JSON files should be looked for.

`metaProperty: 'hierarchy';`

The name of the property to use for the final compiled metadata.

## License

  MIT
