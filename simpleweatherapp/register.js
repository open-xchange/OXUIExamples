/*

  This example adds the "simpleweatherapp" to the OX AppSuite Portal.
  Please note that you have to click the "Add widget" button on the portal
  page and add the "Simple Weather App" in order to show it.

  You can now configure this widget within the portal settings

  More info:

  https://dev.ox.io

  and

  http://simpleweatherjs.com

*/

// Here we register this file and load our dependencies
define('simpleweatherapp/register', [
	'io.ox/core/extensions',
	'io.ox/core/tk/dialogs',
	'settings!io.ox/portal',
	'simpleweatherapp/jquery.simpleWeather.min',
	'css!simpleweatherapp/weather.css'
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

			// The next line defines our app playground for both, the OX UI (class) and the simpleWeather API (id)
			var content = $('<div id="weather_widget" class="content">');
			this.append(content);
			
			/*
				I'll open a feature request to set the background color of an widget as the next lines are not optimal
				but as we want to set a background color we have to accomplish this somehow :)
			*/
			
			var bg_color = '#1192d3';			
			content.css('background-color', bg_color ); 
			
			// we can even change the background color of the whole "tile" if we want, just uncomment the next line to check it out by yourself
			// content.prev().css('background-color', bg_color);
			
			$.simpleWeather({
				location: config_location,
				woeid: '',
				unit: 'f',
				success: function(weather) {

					/*
						Here comes the magic where we add the data from the weatherWeather API to our OX portal Widget
						We are now using jQuery to create and add all the different elements which is the
						equivalent to var content = '<h3><i class="icon-'+weather.code+'"></i>'+weather.alt.temp+'&deg;</h3><h4>'+this.location+'</h4>';
					*/

					var weather_content = $('<h3>');
					weather_content.append().text(weather.alt.temp+'°');

					var weather_icon = $('<i class="icon-'+weather.code+'">');
					weather_content.prepend(weather_icon);

					var h4_location = $('<h4>');
					h4_location.text(this.location);
					weather_content.append(h4_location);

					// we add our weather to the former created app playground
					content.append(weather_content);
				},
				error: function(error) {
				  $('#weather_widget').append($('<p>').text(error));
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
