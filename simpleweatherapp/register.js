/*
  
  This example adds the "simpleweatherapp" to the OX AppSuite Portal.
  Please note that you have to click the "Add widget" button on the portal
  page and add the "Simple Weather App" in order to show it.
  
  You can now configure this widget within the portal settings 
  
  More info:
  
  http://oxpedia.org/wiki/index.php?title=AppSuite:Writing_a_portal_plugin 
  
  and  
  
  https://dev.ox.io
  
  and 
  
  http://simpleweatherjs.com
  
*/

// Here we register this file and load our dependencies
define('simpleweatherapp/register', [
	'io.ox/core/extensions',
    'io.ox/core/tk/dialogs',
    'settings!io.ox/portal',
	'simpleweatherapp/jquery.simpleWeather.min'
	], function (ext, dialogs) {

	'use strict';
	
    ext.point('io.ox/portal/widget').extend({
        id: 'simpleweatherapp'
    });

    ext.point('io.ox/portal/widget/simpleweatherapp').extend({
	
		title: 'Simple Weather App',
		
		preview: function (baton) {
		
			// load the custom location stored in the settings
		    var config_location = baton.model.get('props').location;
			if (config_location === undefined || config_location.length === 0) {
				config_location = 'Olpe, NRW'; // This is our standard location settings!
			}
		
			// The next line defines our playground for both, the OX UI (cöass) and the simpleWeather API (id)
			var content = $('<div id=\'weather_widget\' class=\'content\'></div>');
			this.append(content);
			
			// ugly hack, would be better the widgets itself could be initialed with a background color
			$('#weather_widget').css('background-color', '#1192d3');

			// This adds dynamically the necessary styles to our widget
			var style = document.createElement('style');
			style.type = 'text/css';
			style.innerHTML = '#weather_widget h3 { color: #fff;   font-size: 100px;   font-weight: 300;   text-align: center;  } #weather_widget h4 {  color: #CCC;   font-size: 50px;   font-weight: 300;   text-align: center;  } #weather_widget i { color: #fff; font-family: weather; font-size: 90px;  font-weight: normal;   font-style: normal;   line-height: 1.0; } @font-face {  font-family: \'weather\'; src: url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/93/artill_clean_icons-webfont.eot\');   src: url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/93/artill_clean_icons-webfont.eot?#iefix\') format(\'embedded-opentype\'),      url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/93/artill_clean_icons-webfont.woff\') format(\'woff\'),       url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/93/artill_clean_icons-webfont.ttf\') format(\'truetype\'),      url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/93/artill_clean_icons-webfont.svg#artill_clean_weather_iconsRg\') format(\'svg\');     font-weight: normal; font-style: normal; } .icon-0:before { content: ":"; } .icon-1:before { content: "p"; } .icon-2:before { content: "S"; } .icon-3:before { content: "Q"; } .icon-4:before { content: "S"; } .icon-5:before { content: "W"; } .icon-6:before { content: "W"; } .icon-7:before { content: "W"; } .icon-8:before { content: "W"; } .icon-9:before { content: "I"; } .icon-10:before { content: "W"; } .icon-11:before { content: "I"; } .icon-12:before { content: "I"; } .icon-13:before { content: "I"; } .icon-14:before { content: "I"; } .icon-15:before { content: "W"; } .icon-16:before { content: "I"; } .icon-17:before { content: "W"; } .icon-18:before { content: "U"; } .icon-19:before { content: "Z"; } .icon-20:before { content: "Z"; } .icon-21:before { content: "Z"; } .icon-22:before { content: "Z"; } .icon-23:before { content: "Z"; } .icon-24:before { content: "E"; } .icon-25:before { content: "E"; } .icon-26:before { content: "3"; } .icon-27:before { content: "a"; } .icon-28:before { content: "A"; } .icon-29:before { content: "a"; } .icon-30:before { content: "A"; } .icon-31:before { content: "6"; } .icon-32:before { content: "1"; } .icon-33:before { content: "6"; } .icon-34:before { content: "1"; } .icon-35:before { content: "W"; } .icon-36:before { content: "1"; } .icon-37:before { content: "S"; } .icon-38:before { content: "S"; } .icon-39:before { content: "S"; } .icon-40:before { content: "M"; } .icon-41:before { content: "W"; } .icon-42:before { content: "I"; } .icon-43:before { content: "W"; } .icon-44:before { content: "a"; } .icon-45:before { content: "S"; } .icon-46:before { content: "U"; } .icon-47:before { content: "S"; } ';
			document.getElementsByTagName('head')[0].appendChild(style);
		
			$.simpleWeather({
				location: config_location,
				woeid: '',
				unit: 'f',
				success: function(weather) {
					// Here comes the magic where we add the data from the weatherWeather API to our OX portal Widget
					var content = '<h3><i class="icon-'+weather.code+'"></i>'+weather.alt.temp+'&deg;</h3><h4>'+this.location+'</h4>'; 
					$('#weather_widget').html(content);
				},
				error: function(error) {
				  $('#weather_widget').html('<p>'+error+'</p>');
				}
			});
        }
		
    });

	// This function manages our settings
    function edit(model, view) {
	
		// the dialog is a helper class for modal dialogs
        var dialog = new dialogs.ModalDialog({ async: true, width: 400 }),
            $location = $('<input id="simpleweatherapp_location" type="text" class="form-control">'),
            $error = $('<div>').addClass('alert alert-danger').css('margin-top', '15px').hide(),
            props = model.get('props') || {};

			
		// set the header and add our custom location field	
        dialog.header($('<h4>').text('Where are you?'))
            .build(function () {
                this.getContentNode().append(
                    $('<div class="row">').append(
                        $('<div class="col-sm-12">').append(
                            $('<label for="simpleweatherapp_location">').text('Location'),
                            $location.val(props.location) // props.location now contains our custom location and in case we have already an location we fill the value of the text field
                        )
                    )
                );
            })
            .addPrimaryButton('save', 'Save')
            .addButton('cancel', 'Cancel')
            .show(function () {
                $location.focus();
            });

        dialog.on('cancel', function () {
            if (model.has('candidate')) {
                view.removeWidget();
            }
        });

		// If the users saves our settings we check for errors but currently the error does not show up!
        dialog.on('save', function () {
			
            $error.hide();
			
            var location = String($.trim($location.val()));

            if (location.length === 0) {
				$error.text('Please enter a location');
				$error.show();
				dialog.idle();
            } else {
                    props = { location: location };
                    model.set({ props: props }, {validate: true});
                    model.unset('candidate');
                    dialog.close();
            }
    
            return; 
        });
    }

	// This section makes sure that our widget is available in the Portal settings and has custom settings as well
    ext.point('io.ox/portal/widget/simpleweatherapp/settings').extend({
        title: 'Simple Weather Widget',
        type: 'simpleweatherapp',
		unique: true,
		editable: true,
        edit: edit
    });
	
});

// Here we define the jquery.simpleWeather.min.js file itself to make sure we can use it afterwards.
define('simpleweatherapp/jquery.simpleWeather.min', function () {
	console.log('loading jquery.simpleWeather.min.js');
});
