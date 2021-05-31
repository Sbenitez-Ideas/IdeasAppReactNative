import { StyleSheet } from "react-native";

/**
 * Fontweight setting
 * - This font weight will be used for style of screens where needed
 * - Check more how to use font weight with url below
 * @url http://passionui.com/docs/felix-travel/theme
 */
export const FontWeight = {
  thin: "100",
  ultraLight: "200",
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  heavy: "800",
  black: "900"
};

/**
 * Typography setting
 * - This font weight will be used for all template
 * - Check more how to use typography in url below
 * @url http://passionui.com/docs/felix-travel/theme
 */
export const Typography = StyleSheet.create({
  header: {
    fontSize: 34,
    fontWeight: "400"
  },
  title1: {
    fontSize: 28,
    fontWeight: "400"
  },
  title2: {
    fontSize: 22,
    fontWeight: "400"
  },
  title3: {
    fontSize: 20,
    fontWeight: "400"
  },
  headline: {
    fontSize: 17,
    fontWeight: "400"
  },
  body1: {
    fontSize: 17,
    fontWeight: "400"
  },
  body2: {
    fontSize: 14,
    fontWeight: "400"
  },
  callout: {
    fontSize: 17,
    fontWeight: "400"
  },
  subhead: {
    fontSize: 15,
    fontWeight: "400"
  },
  footnote: {
    fontSize: 13,
    fontWeight: "400"
  },
  caption1: {
    fontSize: 12,
    fontWeight: "400"
  },
  caption2: {
    fontSize: 11,
    fontWeight: "400"
  },
  overline: {
    fontSize: 10,
    fontWeight: "400"
  }
});
