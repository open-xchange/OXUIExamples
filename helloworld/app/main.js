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
		
		var content =   $('<iframe>', { src: 'https://dev.ox.io/helloworld-app-service/', frameborder: 0 });
		content.css({
			width: '100%',
            height: '100%'
        });
		
        win.nodes.main.append(content);

		console.log('... done');
		
        win.show();
    });
    
    return { getApp: app.getInstance };
	
});


