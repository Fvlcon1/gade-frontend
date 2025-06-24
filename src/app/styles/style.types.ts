import { ReactNode } from "react";

export enum TypographySize {
  xs2 = "8px",
  xs = "10px",
  SM = "12px",
  body = "12px",
  body2 = "13px",
  HM = "16px",
  HL = "30px",
}

export interface AppTypographyProps {
  children? : ReactNode
  className? : string
  fontfamily? : 'montserrat' | 'greater-theory'
  bold?: TypographyBold;
  size?: TypographySize;
  textColor?: string;
  colorTheme? : string;
  wrap?: boolean;
  underline?: boolean
  clickable?: boolean
  clickableLink?: boolean
  italic?: boolean
  textAlign? : "center" | "end" | "left" | "right" | "start"
  display? : string
  ellipsis? : boolean
  maxLines? : number
  lineHeight? : number
  onClick? : ()=>void
  whiteSpace? : 'normal' | 'pre' | 'nowrap' | 'pre-wrap' | 'pre-line' | 'break-spaces' | 'white-space-collapse' | 'text-wrap' | 'white-space-trim'
}

export interface buttonProps {
  width : string,
  backgroundColor : string,
}

export enum TypographyBold {
  sm = "400",
  sm2 = "500",
  md = "600",
  md2 = "700",
  lg = "800",
}

export interface hrProps {
  size? : {
    width? : string,
    height? : string,
  },
  background? : string,
  margin? : string,
  padding? : string
}

export interface clickableProps {
  cursor? : string
  radius? : string
  padding? : string
  margin? : string
}