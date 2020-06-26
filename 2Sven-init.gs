// This init script serves as a first time run for 2SVen.

function firstTimeRun() {
  var DOMAIN = PropertiesService.getScriptProperties().getProperty('DOMAIN');
  var SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  
  var pageToken;
  var page;
  var rows = [];
  
  do {
    page = AdminDirectory.Users.list({
      domain: DOMAIN,
      orderBy: 'givenName',
      maxResults: 500,
      query: 'isSuspended=FALSE',
      pageToken: pageToken
    });
    
    var users = page.users;
    
    if (users) {
        for (var i = 0; i < users.length; i++) {
          var user = users[i];
          if (user.isEnrolledIn2Sv == true) {
            Logger.log('%s', user.primaryEmail);
            var row = [user.primaryEmail];
            rows.push(row);
            
            var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
            var sheet = spreadsheet.getActiveSheet();
            var firstRange = sheet.getRange(1, 1, rows.length, 1).setValues(rows);
            var secondRange = sheet.getRange(1, 2, rows.length, 1).setValues(rows);
          }
      }
    } else {
      Logger.log('No users found.');
    }
    
    pageToken = page.nextPageToken;
  } while (pageToken);
  
}