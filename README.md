# ²SVen
²SVen is a simple Slack Webhook service, written in Google Apps Script (gs) that posts updates in a Slack channel regarding changes to 2-Step Verification (2SV) enrollments in GSuite.


## Summary
**²SVen** leverages the Google AdminSDK to poll a list of current users enrolled in 2SV and correlates the results against a previous list. Any changes will be reported via a Slack message using the Custom Integrations service. The script is triggered every 10 minutes.

- **2SVenWebhook.gs** - Is the one-file service consisting of multiple functions working together.
    - *Hosted: leovegas.net Google App Script*
    - *Trigger: Time Driven; Minutes Every 10 minutes*

- **SVen-Diff.spreadsheet** - The spreadsheet is located on the leovegas.com domain and in Giannella's personal Drive. This sheet is used as a backend to the service for correlating results.


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
