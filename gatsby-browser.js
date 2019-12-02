/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

const {
  withLanguageContext,
} = require("./src/components/hocs/withLanguageContext")
exports.wrapPageElement = withLanguageContext
