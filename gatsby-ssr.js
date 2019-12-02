/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const {
  withLanguageContext,
} = require("./src/components/hocs/withLanguageContext")
exports.wrapPageElement = withLanguageContext
