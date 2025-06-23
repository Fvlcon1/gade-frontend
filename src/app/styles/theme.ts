import { TypographyBold, TypographySize } from "./style.types"

export const colors = {
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

export const theme = {
    colors,
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
            md : TypographyBold.md,
            lg : TypographyBold.lg,
            md2 : TypographyBold.md2,
         },
      },
}

export default theme