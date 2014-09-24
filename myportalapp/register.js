/*
  
  This example adds the "myPortalApp" to the OX AppSuite Portal.
  Please note that you have to click the "Add widget" button on the portal
  page and add the "Custom Portal Widget" in order to show it.
  
  More info:
  
  http://oxpedia.org/wiki/index.php?title=AppSuite:Writing_a_portal_plugin 
  
  and on 
  
  https://dev.ox.io
  
*/

define('myportalapp/register', ['io.ox/core/extensions'], function (ext) {

    'use strict';
	
    ext.point('io.ox/portal/widget').extend({
        id: 'myPortalApp'
    });

    ext.point('io.ox/portal/widget/myPortalApp').extend({
	
		title: 'Custom Portal Widget',
	
		preview: function () {
            var content = $('<div class="content">').text('My first portal widget.');
            this.append(content);
        },
		error: function (err) {
            console.log('error : '+err);
        }
		
    });

    ext.point('io.ox/portal/widget/myPortalApp/settings').extend({
        title: 'Custom Portal Widget',
        type: 'myPortalApp',
		unique: true
    });
	
});

