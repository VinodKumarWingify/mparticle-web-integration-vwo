function updateVWOVisitorAttributes(key, value) {
    console.log(`Key: ${key} / Value: ${value}`);
    var attributes = {};
    attributes[key] = value;
    var sourceObject = {
        source: 'mparticle.web'
    }
    if (window.VWO) {
        window.VWO.visitor = window.VWO.visitor || function () {window.VWO.push(["visitor"].concat([].slice.call(arguments)))};
        console.log(attributes)
        window.VWO.visitor(attributes, sourceObject);
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
    var formatedKey = this.common.prependSource(key);
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
