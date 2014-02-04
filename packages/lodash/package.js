Package.describe({
  summary: "REPLACEME - What does this package (or the original one you're wrapping) do?"
});

Package.on_use(function (api, where) {
  api.add_files('lodash.js', ['client', 'server']);
  api.export('_', ['client', 'server']);
});

Package.on_test(function (api) {
  api.use('lodash');

  api.add_files('lodash_tests.js', ['client', 'server']);
});
