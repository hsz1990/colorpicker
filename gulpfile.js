var gulp=require("gulp");
var extend = require('node.extend');
var argvs=require("minimist")(process.argv.slice(2));
var filter=require('gulp-filter');
var fs = require('fs');
var path=require("path");
var option={
	imgPath:"images/*.*"
};
option=extend(option,argvs);
gulp.task("init",function(){
	var conf={picPath:[],picNum:0};
	return gulp.src(option.imgPath)
	.pipe(filter(function(file){
		var p=path.relative(file.cwd,file.path).replace(/\\/g,"/");
		conf.picPath.push(p);
		return true;
	}))
	.on("end",function(){
		conf.picNum=conf.picPath.length;
		fs.writeFile(".conf.js","var conf="+JSON.stringify(conf));
	})
})