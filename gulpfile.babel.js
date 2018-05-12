import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import del from 'del';
import tasksFactory from './tasks';

let plugins = gulpLoadPlugins();

let util = plugins.util;

let config = {
	port: 3000,
	root: __dirname,
	clientPath: 'client',
	serverPath: 'server',
	dist: 'dist'
};

tasksFactory(gulp, plugins, config);

gulp.task('watch', ['watch:inject', 'watch:codebot']);

gulp.task('codebot', ['codebot:client', 'codebot:server'])

gulp.task('serve', cb => {
	runSequence(
			'codebot',
			[
					'clean:tmp', 
					'inject'
			],
			'webpack:dev',
			'start:server',
			'watch',
			cb
	);
});

gulp.task('serve:debug', cb => {
	runSequence(
			'codebot',
			[
					'clean:tmp', 
					'inject'
			],
			'webpack:dev',
			['start:server:debug'],
			'watch',
			cb
	);
});

gulp.task('build', cb => {
	runSequence(
			'codebot',
			[
					'clean:dist', 
					'inject'
			],
		//	'bump:build',
			'webpack:dist',
			'server:dist',
			'bump:inject',
			cb
	);
});

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {dot: true}));
gulp.task('clean:dist', () => del(['dist/**/*'], {dot: true}));