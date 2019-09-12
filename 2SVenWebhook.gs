function svenMain() {
  var talkingSub, talkingAdd;

  // Call the getLatest2SVResults function and save to results array
  var results = getLatest2SVResults();

  //Logger.log(results);

  // Split results
  var resultsSub = results[0];
  var resultsAdd = results[1];
  var resultsStat = results[2];

  // If getLatest2SVResults shows that any employees are no longer enrolled:
  if (resultsSub.length > 0) {
    var subMessage = compileSubMessage(resultsSub, resultsStat);
    svenMailer(subMessage);
  }

  if (resultsAdd.length > 0) {
    var addMessage = compileAddMessage(resultsAdd, resultsStat);
    svenMailer(addMessage);
  }
}
// [END svenMain]

// [ START getLatest2SVResults]
function getLatest2SVResults() {

  var pageToken;
  var page;

  var rows = [];
  var message = [];

  var date = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd"); // "yyyy-MM-dd'T'HH:mm:ss'Z'"

  var userCount = 0;
  var enrolledCount = 0;
  var enrolledPercentage = 0;

  do {
    page = AdminDirectory.Users.list({
      domain: 'leovegas.com',
      orderBy: 'givenName',
      maxResults: 500,
      query: 'isSuspended=FALSE',
      pageToken: pageToken
    });

    var users = page.users;

    if (users) {

      for (var i = 0; i < users.length; i++) {
        var user = users[i];

        userCount++;

        if (user.isEnrolledIn2Sv == true) {
          enrolledCount++;
          var row = [user.primaryEmail];
          rows.push(row);
        }
      }
    } else {
      Logger.log('No users found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);

  if (rows.length > 0) {

    //Compile spreadsheet
    var spreadsheet = SpreadsheetApp.openById("1J_jozmRSkUoJ-Wd1OsybwCOyGt6lgfEeJ2xw07bbePc");
    var sheet = spreadsheet.getActiveSheet();

    var formulaSubtractRange = sheet.getRange("C:C");
    var formulaAddRange = sheet.getRange("D:D");
    formulaSubtractRange.clearContent();
    formulaAddRange.clearContent();

    var oldRange = sheet.getRange("B:B");
    var oldRangeLength = sheet.getLastRow();

    oldRange.copyValuesToRange(0, 1, 1, 1, oldRangeLength);
    oldRange.clearContent();

    var newRange = sheet.getRange(1, 2, rows.length, 1).setValues(rows);
    var newRangeLength = sheet.getLastRow();

    formulaSubtractRange.setFormula('=IF((ISERROR(MATCH(A1,B:B,0))),A1, "")');
    var fillDownSubtract = formulaSubtractRange;
    formulaSubtractRange.copyTo(fillDownSubtract);

    formulaAddRange.setFormula('=IF((ISERROR(MATCH(B1,A:A,0))),B1, "")');
    var fillDownAdd = formulaAddRange;
    formulaAddRange.copyTo(fillDownAdd);

    var subArrayFromRng = formulaSubtractRange.getValues();
    var subList = subArrayFromRng.join().split(',').filter(Boolean);

    var addArrayFromRng = formulaAddRange.getValues();
    var addList = addArrayFromRng.join().split(',').filter(Boolean);

  }

  //Compile stats
  enrolledPercentage = enrolledCount / userCount * 100
  var ep = enrolledPercentage.toFixed(2);

  return [subList, addList, ep];

}

// [END getLatest2SVResults]

// [START compileSubMessage]
function compileSubMessage(resultsSub, resultsStat) {
  // Start compiling Slack message
  var subMessage = "Ugh! Elvis just left the 2SV building, and so did:\n";

  // For every item in result:
  for (var i = 0; i < resultsSub.length; i++) {
    var sub = resultsSub[i];
    if (sub) {
      // Continue compiling slack message
      subMessage = subMessage + "> " + sub + "\n";
    }
  }
  // Compile stats
  subMessage = subMessage + "2SV adoption status is now: " + resultsStat + "% :chart_with_downwards_trend:";
  //Logger.log(talkingSub);
  return (subMessage);

}
// [END compileSubMessage]

// [START compileAddMessage]
function compileAddMessage(resultsAdd, resultsStat) {

  // Start compiling Slack message
  addMessage = "Look who just joined the 2SV dream team:\n";

  // for every item in result:
  for (var i = 0; i < resultsAdd.length; i++) {
    var add = resultsAdd[i];

    if (add) {
      // Continue compiling message
      addMessage = addMessage + "> " + add + "\n";
    }
  }

  // Compile stats
  addMessage = addMessage + "2SV adoption status is now: " + resultsStat + "% :chart_with_upwards_trend:";
  //Logger.log(talkingAdd);
  return (addMessage);

}
// [END compileAddMessage]

function svenMailer(body) {

  var url = "https://hooks.slack.com/services/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";

  var payload = {
    //"channel" : "#test", // <-- optional parameter, use if you want to override default channel
    //"username" : "robot", // <-- optional parameter, use if you want to override default "robot" name
    "text": body, // <-- required parameter
    //"icon_emoji": ":robot_face:", // <-- optional parameter, use if you want to override default icon,
    //"icon_url" : "http://image" // <-- optional parameter, use if you want to override default icon
  }


  sendToSlack_(url, payload);
}


function sendToSlack_(url, payload) {
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };
  return UrlFetchApp.fetch(url, options)
}
