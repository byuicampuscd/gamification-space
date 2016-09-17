/*jslint plusplus: true, browser: true, devel: true */
/*global Handlebars, context*/

document.querySelector('main').innerHTML = Handlebars.templates.uiInterface(context);
