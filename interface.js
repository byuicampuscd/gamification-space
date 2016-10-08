/*jslint plusplus: true, browser: true, devel: true */
/*global valence */

var data;

function startValence(callback) {
    "use strict";
    valence.run(function (err, res) {
        if (err === null) {
            console.log("No error");
            data = res;
        } else {
            console.log("ERROR");
            data = err;
        }

        callback(data);
    });
}
