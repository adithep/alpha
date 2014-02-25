Package.describe({
  summary: "REPLACEME - What does this package (or the original one you're wrapping) do?"
});

Package.on_use(function (api, where) {
  api.use(['spacebars', 'ui', 'standard-app-packages', 'data-lib', 'phoneformat', 'observe-sequence', 'minimongo'], 'client');
  api.add_files(['core-layout.html', 'schema.html', 'foundation.min.css', 'core-layout.css', 'normalize.css', 'echa.js', 'core-layout.js'], 'client');
  
});

Package.on_test(function (api) {
  api.use('core-layout');

  api.add_files('core-layout_tests.js', 'client');
});
