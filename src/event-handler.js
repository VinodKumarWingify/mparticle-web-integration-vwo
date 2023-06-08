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
        window.VWO.event = window.VWO.event || function () {window.VWO.push(["event"].concat([].slice.call(arguments)))};
        vwoMetaObject['ogName'] = event.EventName;
        var formatedEventName = helpers.prependSource(event.EventName);
        window.VWO.event(formatedEventName, event.EventAttributes, vwoMetaObject);
        
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
