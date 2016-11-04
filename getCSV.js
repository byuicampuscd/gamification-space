/*jslint plusplus: true, browser: true, devel: true */
/*global $, d3*/

var getCSV = (function () {
    "use strict";

    function getFileNameFromURL() {
        //This assumes that there will only be one parameter and it doesn't matter what it is
        var fileName = window.location.search
            .substr(1)
            .split("=")[1];
        return fileName;
    }

    function ajaxFile(fileName, ajaxCallback) {
        $.ajax(fileName + ".csv", {
            dataType: 'text',
            success: function (fileText) {
                ajaxCallback(null, fileText);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ajaxCallback("Ajax Error", textStatus, ':', errorThrown, null);
                //console.log("Ajax Error", textStatus, ':', errorThrown);
            }

        });
    }

    return function (callBack) {
        var fileName;

        fileName = "https://byui.brightspace.com" + jamGamifiction + "gamificationSpace/ranks";
        ajaxFile(fileName, function (error, fileText) {
            if (error) {
                callBack(error, null);
                return;
            }

            var fileData = d3.csvParse(fileText, function (d) {
                return {
                    index: parseInt(d.index),
                    rankName: d.rankName,
                    lowerBound: parseInt(d.lowerBound),
                    imgLoc: d.imgLoc
                };
            });

            callBack(null, fileData);
        });

    };
}());
