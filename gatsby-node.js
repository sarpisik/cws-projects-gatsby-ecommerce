/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require("path")
const { mapEdgesToNodes } = require("./src/lib/helpers")

exports.createPages = async ({
  graphql,
  actions: { createPage, createRedirect },
}) => {
  try {
    // Category pages
    const {
      data: { categories, subCategories },
    } = await graphql(`
      query CategoryPagesQuery {
        categories: allCategory(filter: { parentId: { eq: "0" } }) {
          edges {
            node {
              name {
                pl
                en
              }
              slug {
                pl
                en
              }
              _id
            }
          }
        }
        subCategories: allCategory(filter: { parentId: { ne: "0" } }) {
          edges {
            node {
              name {
                pl
                en
              }
              slug {
                pl
                en
              }
              _id
              parentId
            }
          }
        }
      }
    `).catch(error => {
      throw new Error({ message: "Failed on querying categories." }, error)
    })
    buildPages(
      {
        edges: categories,
        subPrefixes: {
          pl: "kategoria",
          en: "category",
        },
        template: path.resolve(`src/templates/category.js`),
      },
      createPage
    )

    // Product pages
    const {
      data: { products },
    } = await graphql(`
      query ProductPagesQuery {
        products: allProduct {
          edges {
            node {
              _id
              name {
                en
                pl
              }
              slug {
                en
                pl
              }
            }
          }
        }
      }
    `).catch(error => {
      throw new Error({ message: "Failed on querying products." }, error)
    })
    buildPages(
      {
        edges: products,
        subPrefixes: {
          pl: "produkt",
          en: "product",
        },
        template: path.resolve(`src/templates/product.js`),
      },
      createPage
    )
  } catch (error) {
    throw new Error(error)
  }
}

exports.createResolvers = ({ createResolvers }) => {
  const translator = {
    translate: {
      type: `String!`,
      args: { language: { type: "String" } },
      resolve: (source, args) => {
        return source[args.language] || source["pl"]
      },
    },
  }
  createResolvers({
    CategoryName: translator,
    ProductName: translator,
  })
}

function buildPages({ edges, subPrefixes, template }, createPage) {
  const nodes = mapEdgesToNodes(edges)
  for (const node of nodes) {
    const languages = Object.keys(node.name)
    buildMultiLangPages(
      languages,
      node,
      pageResolver(template, subPrefixes),
      createPage
    )
  }
}

const buildMultiLangPages = (languages, node, pageResolver, createPage) => {
  const pages = languages.map(language => {
    const page = pageResolver(node, language)
    page.context.language = language
    return page
  })

  const alternateLinks = pages.map(({ path, context: { language } }) => ({
    language,
    path,
  }))

  for (const page of pages) {
    page.context.alternateLinks = alternateLinks
    createPage(page)
  }
}

function pageResolver(component, subPrefixes = {}) {
  return ({ slug, _id: pageId }, language) => {
    const basePath = "/"
    const languagePrefix = basePath.concat(
      language !== "pl" ? language + "/" : ""
    )
    const subPrefix = languagePrefix.concat(subPrefixes[language] || "")
    const path = subPrefix.concat("/" + slug[language])
    return {
      path,
      component,
      context: { pageId },
    }
  }
}
