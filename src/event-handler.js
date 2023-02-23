/*
A non-ecommerce event has the following schema:

{
    DeviceId: "a80eea1c-57f5-4f84-815e-06fe971b6ef2",
    EventAttributes: {test: "Error", t: 'stack trace in string form'},
    EventName: "Error",
    MPID: "123123123123",
    UserAttributes: {userAttr1: 'value1', userAttr2: 'value2'},
    UserIdentities: [{Identity: 'email@gmail.com', Type: 7}]
    User Identity Types can be found here:
}

*/
function formatAttributes(attributes) {
    var formattedAttributes = {};
    var keys = Object.keys(attributes);
    for (var index=0; index < keys.length; index++) {
      formattedAttributes['mparticle.'+keys[index]] = attributes[keys[index]];
    }
    return formattedAttributes;
}

function triggerVWOEvent(event) {
    var attributes = {};
    if (event.CustomFlags && Object.keys(event.CustomFlags).length) {
        attributes = event.CustomFlags;
    }
    else {
        attributes = event.EventAttributes;
    }
    if (window.VWO && (window.VWO.event && window.VWO.visitor)) {
        if (event.EventCategory === 6 || event.EventCategory === 5) { // mParticle.EventType.UserPreference, UserContent
            var formattedAttributes = formatAttributes(attributes);
            window.VWO.visitor(formattedAttributes, { source: 'mparticle.web' });
        }
        else {
            window.VWO.event(event.EventName, event.EventAttributes);
        }
    }
    else {
        console.error('Please use Event-Arch account only to proceed with VWO');
    }
}

function EventHandler(common) {
    this.common = common || {};
}
EventHandler.prototype.logEvent = function(event) {
    triggerVWOEvent(event);
};
EventHandler.prototype.logError = function(event) {
    // The schema for a logError event is the same, but noteworthy differences are as follows:
    // {
    //     EventAttributes: {m: 'name of error passed into MP', s: "Error", t: 'stack trace in string form if applicable'},
    //     EventName: "Error"
    // }
    triggerVWOEvent(event);
};
EventHandler.prototype.logPageView = function(event) {
    /* The schema for a logPagView event is the same, but noteworthy differences are as follows:
        {
            EventAttributes: {hostname: "www.google.com", title: 'Test Page'},  // These are event attributes only if no additional event attributes are explicitly provided to mParticle.logPageView(...)
        }
        */
    triggerVWOEvent(event);
};

module.exports = EventHandler;
