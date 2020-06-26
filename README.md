# ²SVen
![2SVen](https://github.com/[username]/[reponame]/blob/[branch]/image.jpg?raw=true)
²SVen stands for '2SV enable notifications'. It is a simple Slack Webhook service, written in Google Apps Script (gs) that posts updates in a Slack channel regarding changes to 2-Step Verification (2SV) enrollments in G Suite.


## Summary
**²SVen** leverages the Google AdminSDK to poll a list of current users enrolled in 2SV and correlates the results against a previous list. Any changes will be reported via a Slack message using the Custom Integrations service. The script is triggered every 10 minutes.

- **2SVenWebhook.gs** - Is the one-file service consisting of multiple functions working together.
    - *Hosted: catenamedia.com Google App Script*
    - *Trigger: Time Driven; Minutes Every 10 minutes*
- **2SVen-init.gs** - Is an assistant script used only for first-time run.

- **2SVen Workings.spreadsheet** - The spreadsheet is located on the leovegas.com domain and in Giannella's personal Drive. This sheet is used as a backend to the service for correlating results.

## Before you run 2SVen for the first time
Before you run 2SVen you need to have these things in order:
- Copy both gs files in a new Google App Script project, and save them.
- Create a new Google Drive spreadsheet, ensure the user who will be running the script also has access to read and edit the spreadsheet.
- Copy the Spreadsheet ID to the GAS global variables using the name 'SPREADSHEET_ID' from File -> Project Properties -> Script Properties
- Create a Slack Webhook on your Slack Workspace, https://api.slack.com/messaging/webhooks, call it 2SVen and copy the hook url to the GAS global variables as 'SLACK_HOOK'
- Create a new GAS global variable using the name 'DOMAIN' and add the value of the Google Domain in question.
- Under Resources -> Advanced Google Services, enable the 'Admin Directory API' service (make sure your domain admins have given you API permissions).
- Run **2Sven-init.gs**, you will be asked to allow google to access/post data on your behalf. It is a normal one-time permission request.
- 2SVen-init will prepare the Google Spreadsheet for first time run.
- Run **2SvenWebhook.gs** using the svenMain function. It should load with no errors.
- Under Edit -> Current Project Triggers, Create a Trigger to run 2SVenWebhook, svenMain function every 10 minutes.

To test the functionality of this tool, go to the spreadsheet and delete any one of the pre-filled values in "Column B" to simulate someone enrolling to 2SV and wait for the script to execute. If all has been done correctly you should receive a Slack notification in no time.

### Applications
- [Google App Script](https://script.google.com)

### Language
- [GS](https://developers.google.com/apps-script)  

### APIs
- [Google AdminSDK Directory API](https://developers.google.com/admin-sdk/directory/)
- [SLACK API](https://api.slack.com/)

# Release Notes
- ** ²SVen (App) v0.1 (2019.09.12) **
    - Beta Launch
