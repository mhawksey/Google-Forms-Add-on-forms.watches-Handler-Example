// Global constants. Customize as needed.
const formsAPIUrl = 'https://forms.googleapis.com/v1/forms/';
const topicName = TOPIC_NAME;

/**
 * Forms API Method: forms.get
 * GET https://forms.googleapis.com/v1/forms/{formId}/responses/{responseId}
 */
function get(formId) {
  const accessToken = ScriptApp.getOAuthToken();

  const options = {
    'headers': {
      Authorization: 'Bearer ' + accessToken,
      Accept: 'application/json'
    },
    'method': 'get'
  };

  try {
    let response = UrlFetchApp.fetch(formsAPIUrl + formId, options);
    Logger.log('Response from Forms API was: ' + response);
    return ('' + response);
  } catch (e) {
    Logger.log(JSON.stringify(e));
    return ('Error:' + JSON.stringify(e) +
      '<br/><br/>Unable to find Form with formId:<br/>' + formId);
  }
}

/**
 * Forms API Method: forms.watches.create
 * POST https://forms.googleapis.com/v1/forms/{formId}/watches
 */
function createWatch(formId, eventType = 'SCHEMA') {
  let accessToken = ScriptApp.getOAuthToken();

  var myWatch = {
    'watch': {
      'target': {
        'topic': {
          'topicName': topicName
        }
      },
      'eventType': eventType,
    }
  };
  Logger.log('createWatch myWatch is: ' + JSON.stringify(myWatch));

  var options = {
    'headers': {
      Authorization: 'Bearer ' + accessToken
    },
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(myWatch),
    'muteHttpExceptions': false,
  };
  Logger.log('options are: ' + JSON.stringify(options));
  Logger.log('createWatch formsAPIURL was: ' + formsAPIUrl);

  var response = UrlFetchApp.fetch(formsAPIUrl + formId + '/' + 'watches',
    options);
  Logger.log(response);
  return (JSON.parse(response));
}

/**
 * Forms API Method: forms.watches.delete
 * DELETE https://forms.googleapis.com/v1/forms/{formId}/watches/{watchId}
 */
function deleteWatch(formId, watchId) {
  let accessToken = ScriptApp.getOAuthToken();

  Logger.log('deleteWatch formsAPIUrl is: ' + formsAPIUrl);

  var options = {
    'headers': {
      Authorization: 'Bearer ' + accessToken,
      Accept: 'application/json'
    },
    'method': 'delete',
    'muteHttpExceptions': false,
  };

  try {
    var response = UrlFetchApp.fetch(formsAPIUrl + formId + '/' + 'watches/' +
      watchId, options);
    Logger.log(response);
    return (' ' + response);
  } catch (e) {
    Logger.log('API Error: ' + JSON.stringify(e));
    return (JSON.stringify(e));
  }

}

/** 
 * Forms API Method: forms.watches.list
 * GET https://forms.googleapis.com/v1/forms/{formId}/watches
 */
function watchesList(formId) {
  Logger.log('watchesList formId is: ' + formId);
  let accessToken = ScriptApp.getOAuthToken();
  var options = {
    'headers': {
      Authorization: 'Bearer ' + accessToken,
      Accept: 'application/json'
    },
    'method': 'get'
  };
  try {
    var response = UrlFetchApp.fetch(formsAPIUrl + formId + '/' + 'watches',
      options);
    Logger.log(response);
    return (JSON.parse(response));
  } catch (e) {
    Logger.log('API Error: ' + JSON.stringify(e));
    return (JSON.stringify(e));
  }
}

/**
 * Forms API Method: forms.watches.renew
 * POST https://forms.googleapis.com/v1/forms/{formId}/watches/{watchId}:renew
 */
function renewWatch(formId, watchId) {
  let accessToken = ScriptApp.getOAuthToken();

  var options = {
    'headers': {
      Authorization: 'Bearer ' + accessToken,
      Accept: 'application/json'
    },
    'method': 'post'
  };

  try {
    var response = UrlFetchApp.fetch(formsAPIUrl + formId + '/' + 'watches/' +
      watchId + ':renew', options);
    Logger.log(response);
    return ('' + response);
  } catch (e) {
    Logger.log('API Error: ' + JSON.stringify(e));
    return (JSON.stringify(e));
  }
}