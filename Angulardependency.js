
var fs=require('fs')
var gutil = require('gulp-util');
var path = require('path');
var partnername="app";//Change Partner Name here
var fxparray=["a","d"];// fxp dependies 
var moduleRegex = /\.module\(\s*("app"|'app')\s*,\s*(\[[^\]]*\])/g;
//var contents = file.contents.toString();
var m=fxparray.length;

module.exports=function(file){
var results = moduleRegex.exec(file);

//console.log(results)
if(results==null)
 {
     console.log("No module of partner found");
     return;
 }
var arr=results[2];
arr=eval(arr)
var n= arr.length;
if(n==0)
{
     console.log("No dependency of partner found ");
     return;
}
for(var i=0;i<n;i++)
{
    for(var j=0;j<m;j++)
    {
        if(arr[i]===fxparray[j])
        console.log("Same dependendency : " +arr[i]);
    }
}
}