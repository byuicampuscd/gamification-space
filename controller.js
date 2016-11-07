/*jslint plusplus: true, browser: true, devel: true */
/*global constant, Handlebars, valence, runNoValence, getCSV*/

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

  /**
   * ADD_RANK_AND_FINISH:
   * NOTE: Call this last!
   *    This will add the rank to the context and then add the rest to the HTML doc. Because the
   *   call to the CSV is async, a simple solution to the problem that presents is to call this
   *   function at the very end.
   */
  function addRankAndFinish(context) {
    "use strict";

    var pointsPerRank,
        pointsForRank,
        rankIndex,
        pointsTop,
        length = 0;

    getCSV(function(error, scenario)
    {
      var i,
          opacity = 1,
          healthPics;

      if (error)
      {
        console.log("error:", error);
        return;
      }
      console.log("scenario:", scenario);

      for (i = 0; i < scenario.length; ++i) {
        constant.RANKS[i] = scenario[i];
        length += 1;
        if (context.points.earned > constant.RANKS[i].lowerBound) {
          rankIndex = i;
        }
      }

      if (rankIndex != length - 1) {
        pointsForRank = constant.RANKS[rankIndex+1].lowerBound - constant.RANKS[rankIndex].lowerBound;
        pointsTop = context.points.earned - constant.RANKS[rankIndex].lowerBound;
      } else {
        // If on the last rank, just put 0
        pointsForRank = 0;
        pointsTop = 0;
      }

      // pointsPerRank = Math.floor(context.points.possible / constant.RANKS.length);
      // rankIndex = Math.floor(context.points.earned / pointsPerRank);

      //if (rankIndex > constant.RANKS.length - 1) {
      //rankIndex = constant.RANKS.length - 1;
      //}

      if (pointsTop > pointsForRank) {
        pointsTop = pointsForRank;
      }

      context.rank = {
        pointsTop: pointsTop,
        pointsBot: pointsForRank,
        name: constant.RANKS[rankIndex].name,
        file: context.baseURL + constant.RANKS[rankIndex].file,
        width: makeWidth(pointsTop, pointsForRank, constant.RANK_POINTS_LEFT, constant.BARS_RIGHT),
        curRank: rankIndex,
        totalRanks: constant.RANKS.length
      };

      document.querySelector('#gamificationMain').innerHTML = Handlebars.templates.uiInterface(context);
      
      healthPics = document.getElementsByClassName('healthOpacity')
      opacity = context.health.pointsTop / context.health.pointsBot;

      if (opacity <= 0.6) {
        opacity = .1
      } else {
        opacity = 2.25 * opacity - 1.25;
      }

      for(i = 0; i < healthPics.length; i++) {
        healthPics[i].style.opacity = opacity;
      }
    });
  }

  /**
   * ADD_HEALTH:
   *     This will add health to the context
   */
  function addHealth(context) {
    "use strict";

    var pointsTop = Math.round(context.points.gradePer * 100);
    
    context.health = {
      pointsTop: pointsTop,
      pointsBot: 100,
      width: makeWidth(pointsTop, 100, constant.BARS_LEFT, constant.HEALTH_RIGHT)
    };
  }

  /**
   * ADD_EXP:
   *     This will experience information to the context
   */
  function addExp(context) {
    "use strict";

    context.points.earned = Math.round(context.points.earned);
    var pointsTop = Math.round(context.points.earned / context.points.possible * 100);

    context.experience = {
      pointsTop: context.points.earned,
      pointsBot: context.points.possible,
      width: makeWidth(context.points.earned, context.points.possible, constant.BARS_LEFT, constant.BARS_RIGHT)
    };
  }

  if (useValence) {
    valence.run(function (err, data) {
      var grades,
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

        for (i = 0; i < grades.length; ++i) {
          if (grades[i].gradeType === "Numeric") {
            if (grades[i].weightedDenominator !== null) {
              context.points.attempted += grades[i].weightedDenominator;
              context.points.earned += grades[i].weightedNumerator;
            } else if (grades[i].pointsDenominator !== null) {
              context.points.attempted += grades[i].pointsDenominator;
              context.points.earned += grades[i].pointsNumerator;
            }
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
        addHealth(context);
        addExp(context);
        addRankAndFinish(context);
      } else {
        document.querySelector('#gamificationMain').innerHTML = "<h1>Error in loading the widget. Please let your professor know!</h1>";
      }
    });
  } else {
    runNoValence();
  }
}());