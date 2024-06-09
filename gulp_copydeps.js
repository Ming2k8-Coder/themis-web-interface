import gulp from 'gulp';
import debug from 'debug';
import logger from 'gulp-util';
import vfs from 'vinyl-fs';
import merge from 'merge-stream';
gulp.task('copy-deps', () => {
	logger.log("Copydeps called");
	if (process.env.NODE_ENV === 'production') {
		debug('In production, nothing to do');
		return;
	}
	logger.log("merging");
	return merge(
		vfs.src('./node_modules/bootstrap/dist/css/**/*.min.*').pipe(gulp.dest('./public/css/bootstrap')),
		vfs.src('./node_modules/bootstrap/dist/fonts/**/*').pipe(gulp.dest('./public/css/fonts')),
		vfs.src('./node_modules/bootstrap/dist/js/**/*.min.*').pipe(gulp.dest('./public/js/bootstrap')),
		vfs.src('./node_modules/jquery/dist/**/*.min.*').pipe(gulp.dest('./public/js/jquery')),
		vfs.src('./node_modules/cldr-data/main/en/numbers.json').pipe(gulp.dest('./controls/cldr-data/main/en')),
		vfs.src('./node_modules/cldr-data/main/vi/numbers.json').pipe(gulp.dest('./controls/cldr-data/main/vi')),
		vfs.src('./node_modules/cldr-data/supplemental/numberingSystems.json').pipe(gulp.dest('./controls/cldr-data/supplemental')),
		vfs.src('./node_modules/cldr-data/supplemental/likelySubtags.json').pipe(gulp.dest('./controls/cldr-data/supplemental'))
	);
}); 