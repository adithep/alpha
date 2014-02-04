Package.describe({
  summary: "REPLACEME - What does this package (or the original one you're wrapping) do?"
});

Package.on_use(function (api, where) {
  api.add_files('human-insert-form.js', ['client', 'server']);
});

Package.on_test(function (api) {
  api.use('human-insert-form');

  api.add_files('human-insert-form_tests.js', ['client', 'server']);
});
