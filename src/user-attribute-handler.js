var helpers = require('./helpers');

function updateVWOVisitorAttributes(key, value) {
    var attributes = {};
    attributes[key] = value;
    var vwoMetaObject = {
        source: 'mparticle.web'
    }
    if (window.VWO) {
        window.VWO.visitor = window.VWO.visitor || function () {window.VWO.push(["visitor"].concat([].slice.call(arguments)))};
        window.VWO.visitor(attributes, vwoMetaObject);
    } else {
        console.error('Please use Event-Arch account only to proceed with VWO');
    }
}

function UserAttributeHandler(common) {
    this.common = common || {};
}

UserAttributeHandler.prototype.onSetUserAttribute = function(
    key,
    value,
    mParticleUser
) {
    var formatedKey = helpers.prependSource(key);
    updateVWOVisitorAttributes(formatedKey, value);
};

// Not required

UserAttributeHandler.prototype.onRemoveUserAttribute = function(
    key,
    mParticleUser
) {};

UserAttributeHandler.prototype.onConsentStateUpdated = function(
    oldState,
    newState,
    mParticleUser
) {};

module.exports = UserAttributeHandler;
