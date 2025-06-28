import { TypographyBold, TypographySize } from "./style.types"

export const lightColors = {
    text : {
        primary : '#0A2540',
        secondary : '#425466',
        tetiary : '#8E98A3',
    },
    bg : {
        primary : '#FFFFFF',
        secondary : '#F4F4F4',
        tetiary : '#EBEBEB',
        quantinary : "#D0D0D0"
    },
    border : {
        primary : "#E4E4E4",
        secondary : '#F2F2F2',
        tetiary : '#DDDDDD',
        quantinary : '#C6C6D0',
    },
    main : {
        primary : '#6060D0'
    }
}

export const darkColors = {
    text : {
        primary : '#F1FCFD',
        secondary : '#CDD6D7',
        tetiary : '#798586',
    },
    bg : {
        primary : '#0B0A0A',
        secondary : '#141515',
        tetiary : '#1B1E1E',
        quantinary : "#323737"
    },
    border : {
        primary : "#1D1D1D",
        secondary : '#2F2F2F',
        tetiary : '#4D4D4D',
        quantinary : '#909090',
    },
    main : {
        primary : '#6060D0'
    }
}

export const getColors = (): typeof lightColors => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' ? darkColors : lightColors;
    }
    return lightColors; // default fallback
  };

export const theme = {
    colors : getColors(),
    text: {
        size: { 
            SM: TypographySize.SM,
            body: TypographySize.body,
            body2 : TypographySize.body2,
            HL: TypographySize.HL,
            HM: TypographySize.HM,
        },
        bold: { 
            sm : TypographyBold.sm,
            sm2 : TypographyBold.sm2,
            md : TypographyBold.md,
            lg : TypographyBold.lg,
            md2 : TypographyBold.md2,
         },
      },
}

export default theme