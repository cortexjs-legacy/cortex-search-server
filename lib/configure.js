function Config() {

}

Config.prototype.load = function(config) {
    var self = this;
    self.config = {};
    Object.keys(config).forEach(function(key) {
        Object.defineProperty(self.config, key, {
            enumerable: true,
            get: function() {
                return config[key];
            }
        });
    });
};

module.exports = new Config();