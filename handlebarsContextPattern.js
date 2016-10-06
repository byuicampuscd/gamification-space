/*jslint plusplus: true, browser: true, devel: true */
/*global Handlebars, constant*/

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
