// function prependSource(name) {
//     return `mparticle.${name}`;
// }

function formatAttributes(attributes, sanitizeName) {
    var formattedAttributes = {};
    for (var key in attributes) {
        var sanitisedAttributeKey = sanitizeName(key);
        formattedAttributes[sanitisedAttributeKey] = attributes[key]
    }
    return formattedAttributes;
}

function triggerVWOEvent(event, sanitizeName) {
    console.log(`Event:`, event)
    var attributes = {};
    var sourceObject = {
        source: 'mparticle.web'
    }
    if (event.CustomFlags && Object.keys(event.CustomFlags).length) {
        attributes = event.CustomFlags;
    } else {
        attributes = event.EventAttributes;
    }

    if (window.VWO) {
        console.log(`Event Category: ${event.EventCategory}`)
        // mParticle.EventType.UserPreference, UserContent
        if (event.EventCategory === 6 || event.EventCategory === 5) { 
            window.VWO.visitor = window.VWO.visitor || function () {window.VWO.push(["visitor"].concat([].slice.call(arguments)))};
            var formattedAttributes = formatAttributes(attributes, sanitizeName);
            console.log(formattedAttributes)
            window.VWO.visitor(formattedAttributes, sourceObject);
        } else {
            window.VWO.event = window.VWO.event || function () {window.VWO.push(["event"].concat([].slice.call(arguments)))};
            sourceObject['ogName'] =event.EventName;
            var formatedEventName = sanitizeName(event.EventName);
            console.log(`Formated Name: ${formatedEventName}`);
            window.VWO.event(formatedEventName, event.EventAttributes, sourceObject);
        }
    } else {
        console.error('Please use Event-Arch account only to proceed with VWO');
    }
}

function EventHandler(common) {
    this.common = common || {};
}

EventHandler.prototype.logEvent = function(event) {
    triggerVWOEvent(event, this.common.prependSource);
};

// Not required for our use case

EventHandler.prototype.logError = function(event) {};
EventHandler.prototype.logPageView = function(event) {};

module.exports = EventHandler;
