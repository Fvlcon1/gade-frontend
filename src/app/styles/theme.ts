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
        secondary : '#F7F7F7',
        tetiary : '#DDDDDD',
    },
    main : {
        primary : '#6060D0'
    }
}

export const theme = {
    colors,
    text: {
        size: { 
            body: TypographySize.body,
            HL: TypographySize.HL,
            HM: TypographySize.HM,
        },
        bold: { sm: TypographyBold.sm, md: TypographyBold.md, lg: TypographyBold.lg },
      },
}

export default theme