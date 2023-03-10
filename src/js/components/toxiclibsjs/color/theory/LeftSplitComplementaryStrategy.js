var strategies = require('./strategies');
var ColorList = require('../ColorList');
var ComplementaryStrategy = require('./ComplementaryStrategy');

    var complementary;

    /**
     * creates an instance of a LeftSplitComplementaryStrategy
     * @constructor
     */
    module.exports = strategies.create('LeftSplitComplementary',{
        createListFromColor: function( src ){
            //first time create the instance, then just reuse it
            complementary = complementary || new ComplementaryStrategy();
            var left = src.getComplement().rotateRYB(-30).lighten(0.1),
                colors = complementary.createListFromColor(src),
                c;
            for( var i = 3; i < 6; i++){
                c = colors.get(i);
                c.setHue(left.hue());
            }
            return colors;
        }
    });

