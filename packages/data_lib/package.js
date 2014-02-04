Package.describe({
  summary: "REPLACEME - What does this package (or the original one you're wrapping) do?"
});

Package.on_use(function (api, where) {
  api.add_files('data_lib.js', ['client', 'server']);
});

Package.on_test(function (api) {
  api.use('data_lib');

  api.add_files('data_lib_tests.js', ['client', 'server']);
});
