import { TypographyBold, TypographySize } from "./style.types"

export const lightColors = {
    text: {
        primary: '#283A52',
        secondary: '#3F5B83',
        tetiary: '#95A3B7',
        danger: '#b93b36',
        success: '#29a333',
    },
    bg: {
        primary: '#FFFFFF',
        secondary: '#F4F4F4',
        tetiary: '#EBEBEB',
        quantinary: "#D0D0D0"
    },
    border: {
        primary: "#EBEDF1",
        secondary: '#E0E4EB',
        tetiary: '#D7DCE5',
        quantinary: '#CED3DF',
    },
    main: {
        primary: '#5A87C7'
    }
}

export const darkColors = {
    text: {
        primary: '#F1FCFD',
        secondary: '#CDD6D7',
        tetiary: '#798586',
        danger: '#b93b36',
        success: '#29a333',
    },
    bg: {
        primary: '#0B0A0A',
        secondary: '#1B1E1E',
        tetiary: '#323737',
        quantinary: "#373D3E"
    },
    border: {
        primary: "#1D1D1D",
        secondary: '#2F2F2F',
        tetiary: '#4D4D4D',
        quantinary: '#909090',
    },
    main: {
        primary: '#5A87C7'
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
    colors: getColors(),
    text: {
        size: {
            xs: TypographySize.xs,
            xs2: TypographySize.xs2,
            body: TypographySize.body,
            body2: TypographySize.body2,
            HL: TypographySize.HL,
            HM: TypographySize.HM,
        },
        bold: {
            sm: TypographyBold.sm,
            sm2: TypographyBold.sm2,
            md: TypographyBold.md,
            lg: TypographyBold.lg,
            md2: TypographyBold.md2,
        },
    },
}

export default theme