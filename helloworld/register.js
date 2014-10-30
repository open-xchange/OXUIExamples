define('helloworld/register', ['io.ox/core/extensions'], function (ext) {

    'use strict';
	
	console.log('hello world app launcher registration in coming next...');
	
	ext.point('io.ox/core/apps/favorites/allFavorites').extend({
        id: 'helloworld',
        index: 'last',
        customize: function () { this.push('helloworld/app'); }
    });
	
});


