import gulp from 'gulp'
import gulpSass from 'gulp-sass/legacy.js'
import * as sass from 'sass'

const sassCompiler = gulpSass(sass)

export function sassTaskDev() {
	return gulp
		.src(['src/styles/global.scss'], {
			sourcemaps: true,
		})
		.pipe(
			sassCompiler({
				includePaths: ['node_modules'],
			}).on('error', sassCompiler.logError)
		)
		.pipe(gulp.dest('./src/styles/build', { sourcemaps: '.' }))
}

export default gulp.series(sassTaskDev)
