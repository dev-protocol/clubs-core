import { src, dest, series } from 'gulp'
import glss from 'gulp-sass/legacy'
import sas from 'sass'

const sass = glss(sas)

function sassTaskDev() {
	return src(['src/styles/global.scss'], {
		sourcemaps: true,
	})
		.pipe(
			sass({
				includePaths: ['node_modules'],
			}).on('error', sass.logError)
		)
		.pipe(dest('./src/styles/build', { sourcemaps: '.' }))
}

exports.default = series(sassTaskDev)
