var helpers = require('./helpers');

function triggerVWOEvent(event) {
    
    var vwoMetaObject = {
        source: 'mparticle.web'
    }

    var attributes = event.EventAttributes || {};
    if (event.CustomFlags && Object.keys(event.CustomFlags).length) {
        attributes = {
            ...attributes,
            ...event.CustomFlags
        };
    } 

    if (window.VWO) {
        console.log(`Event Category: ${event.EventCategory}`)
        // mParticle.EventType.UserPreference, UserContent
        if (event.EventCategory === 6 || event.EventCategory === 5) { 
            window.VWO.visitor = window.VWO.visitor || function () {window.VWO.push(["visitor"].concat([].slice.call(arguments)))};
            var formattedAttributes = helpers.formatAttributes(attributes);
            console.log(formattedAttributes)
            window.VWO.visitor(formattedAttributes, vwoMetaObject);
        } else {
            window.VWO.event = window.VWO.event || function () {window.VWO.push(["event"].concat([].slice.call(arguments)))};
            vwoMetaObject['ogName'] = event.EventName;
            var formatedEventName = helpers.prependSource(event.EventName);
            console.log(`Formated Name: ${formatedEventName}`);
            window.VWO.event(formatedEventName, event.EventAttributes, vwoMetaObject);
        }
    } else {
        console.error('Please use Event-Arch account only to proceed with VWO');
    }
}

function EventHandler(common) {
    this.common = common || {};
}

EventHandler.prototype.logEvent = function(event) {
    triggerVWOEvent(event);
};

// Not required for our use case

EventHandler.prototype.logError = function(event) {};
EventHandler.prototype.logPageView = function(event) {};

module.exports = EventHandler;
