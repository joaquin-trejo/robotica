// rename this file to secret.js
module.exports = function() {
	if (process.env.NODE_ENV === 'production'){
		return {
			SESSION_SECRET: 'topsecretvalue',
			GOOGLE_ID: '239792274098-ipovv37ljvj9r6rf488g2ujsb9ek45gb.apps.googleusercontent.com',
			GOOGLE_SECRET: '45GinA8NbrEy_h78pbwIoOso'
		};
	}
	return {
		SESSION_SECRET: 'topsecretvalue',
		GOOGLE_ID: '239792274098-ipovv37ljvj9r6rf488g2ujsb9ek45gb.apps.googleusercontent.com',
		GOOGLE_SECRET: '45GinA8NbrEy_h78pbwIoOso'
	};
};