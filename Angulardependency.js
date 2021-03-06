var fs = require('fs');
var util = require('gulp-util');
var gutil = require('gulp-util');
var path = require('path');
var fxpModule = ["a", "d"];
var moduleRegex = /\.module\(\s*("partnername"|'partnername')\s*,\s*(\[[^\]]*\])/g;//Change Partnername here
var fxpModuleCount = fxpModule.length;
module.exports = function (file) {
    console.log(util.colors.blue("***********Checking partner module dependencies***********"));
    var moduleDependencies = getModuleDependencies();
    if (moduleDependencies == null) {
        console.log(util.colors.green(" No partner module found"));
        return;
    }
    var dependencies = getDependencies();
    var dependenciesCount = dependencies.length;
    if (dependenciesCount == 0) {
        console.log(util.colors.red(" No dependency of partner found "));
        return;
    }

    checkIfValidDependency();


    function getModuleDependencies() {
        return moduleRegex.exec(file);
    }

    function getDependencies() {
        return eval(moduleDependencies[2]);
    }
    function checkIfValidDependency() {
        for (var i = 0; i < dependenciesCount; i++) {
            for (var j = 0; j < fxpModuleCount; j++) {
                if (dependencies[i] === fxpModule[j])
                    console.log(util.colors.red(" Same dependendency : " + dependencies[i]));
            }
        }
    }
}