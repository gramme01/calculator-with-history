const { src, dest, task, watch, series, parallel } = require("gulp");

//Plug-ins for CSS
var autoprefixer = require("gulp-autoprefixer");

//Plug-ins for JS
var babelify = require("babelify"),
	browserify = require("browserify"),
	source = require("vinyl-source-stream"),
	buffer = require("vinyl-buffer"),
	stripDebug = require("gulp-strip-debug");

//Other Plug-ins
var rename = require("gulp-rename"),
	sourcemaps = require("gulp-sourcemaps"),
	notify = require("gulp-notify"),
	options = require("gulp-options"),
	gulpif = require("gulp-if");

//Browser Plug-ins
var browserSync = require("browser-sync");

//Paths
const stylePaths = {
	src: "./src/css/style.css",
	dist: "./dist/css/",
	map: "./"
};

const jsPaths = {
	srcFolder: "./src/js/",
	dist: "./dist/js/",
	src: ["calc.js"]
};

const watchPaths = {
	style: "./src/css/*.css",
	js: "./src/js/*.js"
};

/**
|--------------------------------------------------
| TASKS
|--------------------------------------------------
*/
//Tasks
function browser_sync() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
}

function reload(done) {
	browserSync.reload();
	done();
}

function css(done) {
	src(stylePaths.src)
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({ cascade: false }))
		.pipe(sourcemaps.write(stylePaths.map))
		.pipe(dest(stylePaths.dist))
		.pipe(browserSync.stream());
	done();
}

function js(done) {
	jsPaths.src.map(function(entry) {
		return browserify({
			entries: [jsPaths.srcFolder + entry]
		})
			.transform(babelify, { presets: ["@babel/preset-env"] })
			.bundle()
			.pipe(source(entry))
			.pipe(
				rename({
					basename: "script",
					extname: ".js"
				})
			)
			.pipe(buffer())
			.pipe(gulpif(options.has("production"), stripDebug()))
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(sourcemaps.write("./"))
			.pipe(dest(jsPaths.dist))
			.pipe(browserSync.stream());
	});
	done();
}

function watch_files() {
	watch(watchPaths.style, series(css, reload));
	watch(watchPaths.js, series(js, reload));
	src(jsPaths.dist + "script.js").pipe(
		notify({ message: "Gulp is Watching, Happy Coding Emmanuel" })
	);
}

task("css", css);
task("js", js);

task("default", parallel(browser_sync, watch_files));
