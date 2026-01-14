const gulp = require("gulp");
const sonarqubeScanner = require("sonarqube-scanner");

gulp.task("default", (callback: any) => {
  sonarqubeScanner(
    {
      serverUrl: "http://192.168.101.130:9000",
      token: "squ_c5b8c2e8fa4c85bec1dcd5d7dc593434753306b2",
      options: {},
    },
    callback,
  );
});

export {};
