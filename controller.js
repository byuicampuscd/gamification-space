/*jslint plusplus: true, browser: true, devel: true */
/*global constant, Handlebars, valence, runNoValence*/

(function () {
  var useValence = true;

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

    var pointsPerRank,
        rankIndex,
        pointsTop;

    pointsPerRank = Math.floor(context.points.possible / constant.RANKS.length);
    rankIndex = Math.floor(context.points.earned / pointsPerRank);

    if (rankIndex > constant.RANKS.length - 1) {
      rankIndex = constant.RANKS.length - 1;
    }

    pointsTop = Math.floor(context.points.earned - (rankIndex * pointsPerRank));

    if (pointsTop > pointsPerRank) {
      pointsTop = pointsPerRank;
    }

    context.rank = {
      pointsTop: pointsTop,
      pointsBot: pointsPerRank,
      name: constant.RANKS[rankIndex].name,
      file: context.baseURL + constant.RANKS[rankIndex].file,
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

  if (useValence) {
    valence.run(function (err, data) {
      var i,
          grades,
          finalGrade;

      if (err === null) {
        console.log("No error");

        grades = data.getGrades();
        finalGrade = data.getFinalCalculatedGrade();

        /** make gradePer **/
        var context = {
          points: {
            earned: 0,
            possible: 0,
            attempted: 0,
            gradePer: 0
          },
          baseURL: "/content/enforced/10011-Joshua-McKinney-Sandbox-CO/gamificationSpace/",
          cssLoc: "uiInterface.css",
          backgroundLoc: "Nebula Background.jpg"
        };

/*
        for (i = 0; i < grades.length; ++i) {
          if (grades[i].weightedDenominator !== null) {
            context.points.possible += grades[i].weightedDenominator;
            context.points.earned += grades[i].weightedNumerator;
          } else if (grades[i].pointsDenominator !== null) {
            context.points.possible += grades[i].pointsDenominator;
            context.points.earned += grades[i].pointsNumerator;
          }
        }

        if (finalGrade.weightedDenominator !== null) {
          context.points.gradePer = finalGrade.weightedNumerator / 1000;
        } else if (finalGrade.pointsDenominator !== null) {
          context.points.gradePer = finalGrade.pointsNumerator / 1000;
        }
*/

        for (i = 0; i < grades.length; ++i) {
          if (grades[i].weightedDenominator !== null) {
            context.points.attempted += grades[i].weightedDenominator;
            context.points.earned += grades[i].weightedNumerator;
          } else if (grades[i].pointsDenominator !== null) {
            context.points.attempted += grades[i].pointsDenominator;
            context.points.earned += grades[i].pointsNumerator;
          }
        }

        if (context.points.attempted !== 0) {
          context.points.gradePer = context.points.earned / context.points.attempted;
        }
      
        if (context.points.gradePer > 1.0) {
          context.points.gradePer = 1.0;
        }

        if (finalGrade.weightedDenominator !== null) {
          context.points.possible = finalGrade.weightedDenominator;
          context.points.earned = finalGrade.weightedNumerator;
        } else if (finalGrade.pointsDenominator !== null) {
          context.points.possible = finalGrade.pointsDenominator;
          context.points.earned = finalGrade.pointsNumerator;
        }

        //call them all
        addRank(context);
        addHealth(context);
        addExp(context);
        console.log("context:", context);
        
        document.querySelector('#gamificationMain').innerHTML = Handlebars.templates.uiInterface(context);
      } else {
        console.log("ERROR");
        document.querySelector('#gamificationMain').innerHTML = "<h1>Error in loading the widget. Please let your professor know!</h1>";
      }
    });
  } else {
    runNoValence();
  }
}());