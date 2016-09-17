/*jslint plusplus: true, browser: true, devel: true */
/*global Handlebars*/

/* beautify preserve:start */
var constant = {
    BARS_LEFT: 427,
    BARS_RIGHT: 877,
    HEALTH_RIGHT: 587,
    RANK_POINTS_LEFT: 717,
    MISSING_WIDTH: 0,
    RANKS: [
        {name: "Citizen",                           file: "RankingIcons/1.png"},
        {name: "Recruit",                           file: "RankingIcons/2.png"},
        {name: "4th Class",                         file: "RankingIcons/3.png"},
        {name: "3rd Class",                         file: "RankingIcons/4.png"},
        {name: "2nd Class",                         file: "RankingIcons/5.png"},
        {name: "1st Class",                         file: "RankingIcons/6.png"},
        {name: "3rd Class Spaceship",               file: "RankingIcons/7.png"},
        {name: "2nd Class Spaceship",               file: "RankingIcons/8.png"},
        {name: "1st Class Spaceship",               file: "RankingIcons/9.png"},
        {name: "3rd Class Hexagon",                 file: "RankingIcons/10.png"},
        {name: "2nd Class Hexagon",                 file: "RankingIcons/11.png"},
        {name: "1st Class Hexagon",                 file: "RankingIcons/12.png"},
        {name: "Chief",                             file: "RankingIcons/13.png"},
        {name: "Senior Chief",                      file: "RankingIcons/14.png"},
        {name: "Master Chief",                      file: "RankingIcons/15.png"},
        {name: "3rd Ensign",                        file: "RankingIcons/16.png"},
        {name: "2nd Ensign",                        file: "RankingIcons/17.png"},
        {name: "1st Ensign",                        file: "RankingIcons/18.png"},
        {name: "Lieutenant Junior Grade 2nd Class", file: "RankingIcons/19.png"},
        {name: "Lieutenant Junior Grade 1st Class", file: "RankingIcons/20.png"},
        {name: "3rd Class Lieutenant",              file: "RankingIcons/21.png"},
        {name: "2nd Class Lieutenant",              file: "RankingIcons/22.png"},
        {name: "1st Class Lieutenant",              file: "RankingIcons/23.png"},
        {name: "Lieutenant Commander",              file: "RankingIcons/24.png"},
        {name: "Commander",                         file: "RankingIcons/25.png"},
        {name: "Captain",                           file: "RankingIcons/26.png"},
        {name: "Rear Admiral",                      file: "RankingIcons/27.png"},
        {name: "Vice Admiral",                      file: "RankingIcons/28.png"},
        {name: "Admiral",                           file: "RankingIcons/29.png"},
        {name: "Delegate",                          file: "RankingIcons/30.png"},
        {name: "President",                         file: "RankingIcons/31.png"}
    ]
};
/* beautify preserve:end */

var contextModel = {
    studentName: "First Last",
    points: {
        earned: 80,
        attemped: 90,
        possible: 101
    },
    rank: {
        pointsTop: 75,
        pointsBot: 103,
        name: "CAPTAIN",
        file: "RankingIcons/26.png",
        width: 50
    },
    health: {
        pointsTop: 67,
        pointsBot: 100,
        width: 45
    },
    experience: {
        width: 87
    }
};

function makeWidth(top, bot, left, right) {
    "use strict";

    function isMissingOrZero(thing) {
        return thing === 0 || typeof thing === undefined || thing === null;
    }

    //error check
    if (isMissingOrZero(bot)) {
        return constant.MISSING_WIDTH;
    }

    var percent = top / bot,
        diff = right - left;
    if (percent > 1) {
        percent = 1;
    }
    return Math.round(percent * diff);
}

function addRank(context) {
    "use strict";

    var pointsPerRank, rankIndex, pointsTop;

    pointsPerRank = Math.floor(context.points.possible / constant.RANKS.length);
    rankIndex = Math.floor(context.points.earned / pointsPerRank);

    if (rankIndex > constant.RANKS.length - 1) {
        rankIndex = constant.RANKS.length - 1;
    }

    pointsTop = context.points.earned - (rankIndex * pointsPerRank);

    if (pointsTop > pointsPerRank) {
        pointsTop = pointsPerRank;
    }

    context.rank = {
        pointsTop: pointsTop,
        pointsBot: pointsPerRank,
        name: constant.RANKS[rankIndex].name,
        file: constant.RANKS[rankIndex].file,
        width: makeWidth(pointsTop, pointsPerRank, constant.RANK_POINTS_LEFT, constant.BARS_RIGHT)
    };
}

function addHealth(context) {
    "use strict";

    var pointsTop = Math.round(context.points.gradePer * 100);

    context.health = {
        pointsTop: pointsTop,
        pointsBot: 100,
        width: makeWidth(pointsTop, 100, constant.BARS_LEFT, constant.HEALTH_RIGHT)
    };
}

function addExp(context) {
    "use strict";

    var pointsTop = Math.round(context.points.earned / context.points.possible * 100);

    context.experience = {
        pointsTop: context.points.earned,
        pointsBot: context.points.possible,
        width: makeWidth(context.points.earned, context.points.possible, constant.BARS_LEFT, constant.BARS_RIGHT)
    };
}

/** make gradePer **/
var context = {
    studentName: "First Last",
    points: {
        earned: 101,
        possible: 100,
        gradePer: 0.92

    }
};

//call them all
addRank(context);
addHealth(context);
addExp(context);
console.log("context:", context);
