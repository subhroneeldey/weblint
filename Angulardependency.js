var fs = require('fs')
var gutil = require('gulp-util');
var path = require('path');
var fxpModule = ["a", "d"];
var moduleRegex = /\.module\(\s*("partnername"|'partnername')\s*,\s*(\[[^\]]*\])/g;//Change Partnername here
var fxpModuleCount = fxpModule.length;
module.exports = function (file) {
    var moduleDependencies = getModuleDependencies();
    if (moduleDependencies == null) {
        console.log(" No partner module found");
        return;
    }
    var dependencies = getDependencies();
    var dependenciesCount = dependencies.length;
    if (dependenciesCount == 0) {
        console.log(" No dependency of partner found ");
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
                    console.log(" Same dependendency : " + dependencies[i]);
            }
        }
    }
}