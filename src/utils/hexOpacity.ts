export const hexOpacity = (percentage : number) => {
    if (percentage < 0 || percentage > 100) {
      throw new Error("Percentage must be between 0 and 100");
    }
    const opacity = Math.round(percentage * 2.55);
    const hexadecimalOpacity = opacity.toString(16).padStart(2, "0");
    return hexadecimalOpacity.toUpperCase()
}