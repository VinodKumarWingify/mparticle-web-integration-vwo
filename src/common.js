function Common() {}

Common.prototype.prependSource = function (name) {
    return `mparticle.${name}`;
}

module.exports = Common;