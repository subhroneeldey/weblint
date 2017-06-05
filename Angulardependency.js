
var fs=require('fs')
var gutil = require('gulp-util');
var path = require('path');
var partnername="partnername";
var fxparray=["a","d"];
var file=fs.readFileSync('file.txt','');
var moduleRegex = /\.module\(\s*("partnername"|'partnername')\s*,\s*(\[[^\]]*\])/g;
//var contents = file.contents.toString();
var m=fxparray.length;
var results = moduleRegex.exec(file);

//console.log(results)
var arr=results[2];
arr=eval(arr)
var n= arr.length;
for(var i=0;i<n;i++)
{
    for(var j=0;j<m;j++)
    {
        if(arr[i]===fxparray[j])
        console.log("Same dependendency : " +arr[i]);
    }
}