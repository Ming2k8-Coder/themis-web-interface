import gulp from "gulp";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import uglify from "gulp-uglify";
import browserify from "browserify";
import envify from "envify";
import watchify from "watchify";
import debug from "debug";
import gulpDebug from "gulp-debug";
import vfs from "vinyl-fs";
import yarn from "gulp-yarn";
import { deleteSync as dels } from "del";
import logger from "gulp-util";
import merge from "merge-stream";
import fs from "fs";
import gzip from "gulp-gzip";
import grename from "gulp-rename";
import timemoment from "moment";
import gulpYarn from "gulp-yarn";

// gulp.task("default", () => {
//   gulp.series("build")();
// });

// core task

function jsxRender(entry, filename) {
	let b = browserify({
		entries: entry,
		debug: false,
	})
		.transform("babelify", {
			presets: ["@babel/preset-env", "@babel/preset-react"],
		})
		.transform(envify, { global: true })
		.bundle()
		.pipe(source(filename))
		.pipe(buffer());
	if (process.env.NODE_ENV === "production") b = b.pipe(uglify());
	return b
		.pipe(gulp.dest("public/js"))
		.pipe(gzip({ level: 9 }))
		.pipe(gulp.dest("public/js"));
}

function jsxWatch(entry, filename) {
	let a = browserify({
		entries: entry,
		debug: true,
		cache: {},
		packageCache: {},
		plugin: [watchify],
		transform: [
			[
				"babelify",
				{
					presets: ["@babel/preset-react", "@babel/preset-env"],
				},
			],
		],
	});
	a.transform(envify, { global: true });
	a.on("update", () => {
		a.bundle()
			.pipe(source(filename))
			.pipe(buffer())
			.pipe(gulp.dest("public/js"));
	});
	a.bundle().pipe(source(filename)).pipe(buffer()).pipe(gulp.dest("public/js"));
	a.on("log", debug);
}

gulp.task("verify-npm", () => {
	if (process.env.npm_package_version === undefined)
		throw new Error("Script must be run from yarn / npm!");
	logger.log("yarn / npm found");
	return Promise.resolve();
});

gulp.task("clean", (done) => {
	fs.stat(".build", (err) => {
		if (err) {
			logger.log("No need clean");
			return done();
		} else {
			logger.log("Cleaning up old build");
			dels("./.build", "./.build/**/*");
			return done();
		}
	})
});

// function
gulp.task("render-jsx-index", () => {
	return jsxRender("jsx-src/index.jsx", "index.js");
});

gulp.task("render-jsx-scoreboard", () => {
	return jsxRender("jsx-src/scoreboard.jsx", "scoreboard.js");
});

gulp.task("render-jsx", () => {
	gulp.parallel("render-jsx-index", "render-jsx-scoreboard")();
});

gulp.task("watch", () => {
	jsxWatch("jsx-src/index.jsx", "index.js");
	jsxWatch("jsx-src/scoreboard.jsx", "scoreboard.js");
});

// caller first stage

gulp.task("build-copy-files", (done) => {
	gulp.series("render-jsx");
	merge(
		vfs
			.src(
				[
					"./package.json",
					"./**/*",
					"!./dist",
					"!./dist/**/*",
					"!./jsx-src",
					"!./jsx-src/**/*",
					"!./node_modules",
					"!./node_modules/**/*",
					"!./.*",
					"!./.*/**/*",
					"!./gulpfile.js",
					"!./config.sample.js",
					"!./config.js",
					"!./data/submit/*",
					"!./data/submit/logs/*",
					"!./data/files/*",
					"!./data/account.xml",
					"!./data/account.sample.xml",
					"!./tests/**/*",
					"!./public/js/*.js",
				],
				{ follow: true },
				{ allowEmpty: true }
			)
			.pipe(gulpDebug())
			.pipe(gulp.dest("./.build")),
		vfs
			.src(["./config.sample.js"])
			.pipe(grename("config.js"))
			.pipe(gulpDebug())
			.pipe(gulp.dest("./.build")),
		vfs
			.src(["./data/account.sample.xml"])
			.pipe(grename("data/account.xml"))
			.pipe(gulpDebug())
			.pipe(gulp.dest("./.build"))
	); done();
});

gulp.task("yarn-build", () => {
	return gulp
		.src(["./.build/package.json"])
		.pipe(gulp.dest("./.build"))
		.pipe(gulpYarn({ production: true }));
});

gulp.task("version-info", (cb) => {
	fs.writeFileSync(
		"./.build/twi.version",
		`v${process.env.npm_package_version}`
	);
	cb();
});

gulp.task("clean-yarn-files", () => {
	gulp.series("yarn-build");
	return gulp
		.src(
			[
				// forced to run yarn, not npm anymore
				"./.build/package.json",
				"./.build/yarn.lock",
				"./.build/gulp_copydeps.js",
			],
			{ read: false }
		)
		.pipe(clean());
});

gulp.task("zip", () => {
	gulp.series("clean-yarn-files");
	return gulp
		.src("./.build/**/*")
		.pipe(gulpDebug())
		.pipe(
			gzip(
				`${process.env.npm_package_name}_v${process.env.npm_package_version
				}_${timemoment().format("YYYYMMDD-HHmmss")}.zip`
			)
		)
		.pipe(gulp.dest("./dist"));
});

gulp.task("post-build", () => {
	gulp.series("zip");
	return vfs.src(["./.build"], { read: false }).pipe(clean());
});
// gulp update fix, task caller must be put end of file

gulp.task("render-jsx-only", () => {
	gulp.series("render-jsx")();
});

gulp.task("build",
	gulp.series(
		"verify-npm", "clean",
		"build-copy-files",
		"version-info",
		"yarn-build",
		"clean-yarn-files",
		"zip",
		"post-build")
);

gulp.task('copy-deps', () => {
	logger.log("Copydeps called");
	if (process.env.NODE_ENV === 'production') {
		debug('In production, nothing to do');
		return null;
	}
	logger.log("merging");
	return merge(
		vfs.src(['./node_modules/bootstrap/dist/css/**/*.min.*']).pipe(gulp.dest('./public/css/bootstrap')),
		vfs.src(['./node_modules/bootstrap/dist/fonts/**/*']).pipe(gulp.dest('./public/css/fonts')),
		vfs.src(['./node_modules/bootstrap/dist/js/**/*.min.*']).pipe(gulp.dest('./public/js/bootstrap')),
		vfs.src(['./node_modules/jquery/dist/**/*.min.*']).pipe(gulp.dest('./public/js/jquery')),
		vfs.src(['./node_modules/cldr-data/main/en/numbers.json']).pipe(gulp.dest('./controls/cldr-data/main/en')),
		vfs.src(['./node_modules/cldr-data/main/vi/numbers.json']).pipe(gulp.dest('./controls/cldr-data/main/vi')),
		vfs.src(['./node_modules/cldr-data/supplemental/numberingSystems.json']).pipe(gulp.dest('./controls/cldr-data/supplemental')),
		vfs.src(['./node_modules/cldr-data/supplemental/likelySubtags.json']).pipe(gulp.dest('./controls/cldr-data/supplemental'))
	);
}); 
