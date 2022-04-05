
/**
 * Global constants.
 */
const TOPIC_NAME = 'projects/<YOUR_TOPIC_PATH>';
const PS = PropertiesService.getDocumentProperties();


/**
 * Adds a custom menu to the active form.
 *
 */
function onOpen(e) {
  FormApp.getUi()
      .createAddonMenu()
      .addItem('Add edit watch', 'showAdd')
      .addItem('Remove edit watch', 'showRemove')
      .addToUi();
}

/**
 * Runs when the add-on is installed.
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Add a form watch
 */
function showAdd() {
  const response = addFormWatch();
  var ui = FormApp.getUi();
  ui.alert(response); 
}

/**  
 * Delete form watch and triggers
 */
function showRemove() {
  const response = deleteFormWatch();
  var ui = FormApp.getUi();
  ui.alert(response); 
}

/**
 * Example function for adding a Google Forms API watch
 */
function addFormWatch() {
  try {
    const form = FormApp.getActiveForm();
    const settings = PS.getProperties();

    // updated some settings
    settings.formId = form.getId();
    settings.eventType = 'SCHEMA'; // Options are SCHEMA or RESPONSES

    // create a watch and store the watchID and expire in settings
    const watchResp = createWatch(settings.formId, settings.eventType);
    settings.watchID = watchResp.id;
    settings.watchExpire = watchResp.expireTime;

    // create a trigger to renew the watch using the watch expiry date/time
    ScriptApp.newTrigger("renewWatchHandler")
      .timeBased()
      .at(new Date(settings.watchExpire))
      .create();

    // Save settings (required for when the watch is renewed)
    PS.setProperties(settings);
    return JSON.stringify(watchResp);
  } catch (e) {
    // TODO (Developer) - Handle exception
    Logger.log('Failed with error: %s', e);
    return e;
  }
}

/**
 * Renew the form watch and schedule another refresh.
 */
function renewWatchHandler(){
  try {
    const settings = PS.getProperties();

    // renew the existing watch on this form and store the watchID and expire in settings
    const watchResp = renewWatch(settings.formId, settings.watchID);
    settings.watchID = watchResp.id;
    settings.watchExpire = watchResp.expireTime;

    // create a trigger to renew the watch using the watch expiry date/time
    ScriptApp.newTrigger("renewWatchHandler")
      .timeBased()
      .at(new Date(settings.watchExpire))
      .create();
  
    PS.setProperties(settings);

  } catch (e) {
    // TODO (Developer) - Handle exception
    Logger.log('Failed with error: %s', e);
  }
}

/**
 * Delete the form watch and the scheduled trigger.
 */
function deleteFormWatch(){
  try {
    const settings = PS.getProperties();

    // get existing watches on this form
    const existingWatches = watchesList(settings.formId);
    // delete any existing watches
    if (existingWatches.watches) existingWatches.watches.map((w) => deleteWatch(settings.formId, w.id));
    // get any renewWatchHandler triggers 
    const triggers = getProjectTriggersByName('renewWatchHandler');
    // delete renewWatchHandler triggers 
    triggers.map((t) => ScriptApp.deleteTrigger(t));
    return "Done";
  } catch(e){
    // TODO (Developer) - Handle exception
    Logger.log('Failed with error: %s', e);
    return e;
  }
}

/**
 * Gets a list of triggers by handler function name.
 *
 * @param {String} name of handler function 
 * @return {Trigger}
 */
function getProjectTriggersByName(name) {
  // https://stackoverflow.com/a/52519799/1027723
  return ScriptApp.getProjectTriggers().filter((s) => s.getHandlerFunction() === name);
}





