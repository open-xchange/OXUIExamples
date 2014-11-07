define('helloworld/app/main', ['io.ox/core/extensions'], function () {

	'use strict';

	var app = ox.ui.createApp({
		name: 'helloworld/app',
		title: 'Hello World App' // Can't be empty! This title appears if the user clicks on the App Launcher so it should be the same like in the manifest.json file
	});

	app.setLauncher(function () {

		console.log('hello world launcher init ...');

		var win = ox.ui.createWindow({
			name: 'helloworld/app'
		});
		app.setWindow(win);

		/*
			Acquire Token for external service to create a valid session for service authentication.

			More details:
			http://oxpedia.org/wiki/index.php?title=HTTP_API#Module_.22token.22_.28since_7.4.0.29
		*/

		$.getJSON( '/appsuite/api/token?action=acquireToken&session=' + ox.session, function( data ) {
		  $.each( data, function( key, value ) {
			if (key == 'data') {
				$.each( value, function( dkey, dvalue ) {
					var access_token = dvalue;
					console.log('got acess_token = '+access_token);
					init_window_and_show(win, access_token);
				 });
			}
		  });
		});

	});

	return { getApp: app.getInstance };

});

function init_window_and_show(win, access_token) {
	var ox_domain = 'https://dev.ox.io/helloworld-app-service/';
	var iframe =   $('<iframe>', { src: ox_domain, frameborder: 0 });
	iframe.css({
		width: '100%',
		height: '100%'
	});

	win.nodes.main.append(iframe);

	var url_with_ox_token = ox_domain + '?ox_token='+access_token;
	iframe.attr('src', url_with_ox_token);

	win.show();

	console.log('... done');
}

