const mapRange = (number, [inMin, inMax], [outMin, outMax]) => {
    // if you need an integer value use Math.floor or Math.ceil here
    return Math.round((number - inMin) / (inMax - inMin) * (outMax - outMin) + outMin);
}
export { mapRange }

