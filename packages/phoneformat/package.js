Package.describe({
  summary: "REPLACEME - What does this package (or the original one you're wrapping) do?"
});

Package.on_use(function (api, where) {
  api.add_files('phoneformat.js', ['client', 'server']);
  api.export(['countryForE164Number', 'formatNumberForMobileDialing', 'isValidNumber', 'formatE164', 'formatInternational', 'formatLocal', 'cleanPhone', 'countryCodeToName'], ['client', 'server']);
});

Package.on_test(function (api) {
  api.use('phoneformat');

  api.add_files('phoneformat_tests.js', ['client', 'server']);
});
