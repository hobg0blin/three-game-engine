

var extend = require('../../internals').extend,
	AbstractWave = require('./AbstractWave');

/**
 * @module toxi/math/waves/SineWave
 * @augments toxi/math/wave/AbstractWave
 * member toxi
 * @augments AbstractWave
 * @param {Number} [phase] phase
 * @param {Number} [freq] frequency
 * @param {Number} [amp] amplitude
 * @param {Number} [offset] offset
 */
var	SineWave = function(phase,freq,amp,offset) {
    AbstractWave.call(this, phase, freq, amp, offset);
};

extend(SineWave,AbstractWave);

SineWave.prototype.getClass = function(){
	return "SineWave";
};

SineWave.prototype.update = function() {
   this.value = (Math.sin(this.phase) * this.amp) + this.offset;
   this.cyclePhase(this.frequency);
   return this.value;
};

module.exports = SineWave;

