var each = require('./each');
    //basic mixin function, copy over object properties to provided object
    module.exports = function(destination,source){
        each(source,function(val,key){
            destination[key] = val;
        });
        return destination;
    };

