/*jslint plusplus: true, browser: true, devel: true */
/*global constant, Handlebars, valence, getCSV*/

(function () {

    /**
     * MAKE_WIDTH:
     *     This will get the width of the progress bar
     */
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
            pointsUntilPromotion = 0;

        // This will get the CSV and put it into the context
        getCSV(function (error, csvData) {
            var i,
                opacity = 1,
                healthPics;

            if (error) {
                console.log("error:", error);
                return;
            }
            console.log("csvData:", csvData);


            // Set rank based on points earned in course.
            for (i = 0; i < csvData.length; ++i) {
                constant.RANKS[i] = csvData[i];
                if (context.points.earned >= constant.RANKS[i].lowerBound) {
                    rankIndex = i;
                }
            }

            //If not highest rank
            if (rankIndex !== constant.RANKS.length) {
                pointsForRank = constant.RANKS[rankIndex + 1].lowerBound - constant.RANKS[rankIndex].lowerBound; // Points required for next rank
                pointsTop = context.points.earned - constant.RANKS[rankIndex].lowerBound; // Earned in current rank
                pointsUntilPromotion = pointsForRank - pointsTop; //Points needed to move up a rank
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
                pointsBot: pointsForRank, //DOES NOT DISPLAY pointsForRank: issue #15
                name: constant.RANKS[rankIndex].name,
                file: context.baseURL + constant.RANKS[rankIndex].file,
                width: makeWidth(pointsTop, pointsForRank, constant.RANK_POINTS_LEFT, constant.BARS_RIGHT),
                curRank: rankIndex,
                totalRanks: constant.RANKS.length,
                pointsUntilPromotion: pointsUntilPromotion //Will display beneath "POINTS TO PROMOTION" see handlebarsTemplate.js line #33
            };

            document.querySelector('#gamificationMain').innerHTML = Handlebars.templates.uiInterface(context);

            // This is called AFTER the previous statement because there needs to exist elements with the class name 'healthOpacity'
            healthPics = document.getElementsByClassName('healthOpacity')
            opacity = context.health.pointsTop / context.health.pointsBot;

            if (opacity <= 0.6) {
                opacity = .1
            } else {
                opacity = 2.25 * opacity - 1.25;
            }

            for (i = 0; i < healthPics.length; i++) {
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

        //if the student has not attemped anything then they should have a 100 health
        if(context.points.attempted === 0){
             pointsTop = 100;
        }

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

    /******* THIS IS WHERE IT STARTS! *********/

        valence.run(function (err, data) {
            var grades,
                finalGrade;

            if (err !== null) {
                document.querySelector('#gamificationMain').innerHTML = "<h1>Error in loading the widget. Please let your professor know!</h1>";
                return;
            }

            console.log("No error");

            grades = data.getGrades();
            //print out grades
            console.log("grades:", grades);
            finalGrade = data.getFinalCalculatedGrade();

            /** make gradePer **/
            var context = {
                points: {
                    earned: 0,
                    possible: 0,
                    attempted: 0,
                    gradePer: null
                },
                baseURL: gamificationPath + constant.PATH,
                cssLoc: "uiInterface.css",
                backgroundLoc: "Nebula Background.jpg"
            };

            // Go through all grades and add up the numerator and denominator
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

            // The percentage represents the health
            if (context.points.attempted !== 0) {
                context.points.gradePer = context.points.earned / context.points.attempted;
            }

            // Health should not be over 100%
            if (context.points.gradePer > 1.0) {
                context.points.gradePer = 1.0;
            }

            // Use the final grade for experience
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
        });

}());
