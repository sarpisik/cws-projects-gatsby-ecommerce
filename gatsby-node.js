/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require("path")
const { mapEdgesToNodes } = require("./src/lib/helpers")
const categorySubPrefixes = {
  pl: "kategoria",
  en: "category",
}
const productSubPrefixes = {
  pl: "produkt",
  en: "product",
}

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
        subPrefixes: categorySubPrefixes,
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
        subPrefixes: productSubPrefixes,
        template: path.resolve(`src/templates/product.js`),
      },
      createPage
    )
  } catch (error) {
    throw new Error(error)
  }
}

exports.onCreatePage = ({ page, actions: { createPage, deletePage } }) => {
  if (page.path !== "/") return

  deletePage(page)

  const pathPrefixes = {
    pl: "/",
    en: "/en/",
  }

  const pages = Object.keys(pathPrefixes).map(language => {
    const path = pathPrefixes[language]
    return {
      ...page,
      context: { language, categorySubPrefixes },
      path,
    }
  })

  createPages(pages, createPage)
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
    CategorySlug: translator,
    ProductName: translator,
    ProductCategory: translator,
    ProductDescription: translator,
    ProductPriceBrut: translator,
    ProductPriceNet: translator,
    ProductSalePriceBrut: translator,
    ProductSalePriceNet: translator,
    ProductSlug: translator,
  })
}

function buildPages({ edges, subPrefixes, template }, createPage) {
  const nodes = mapEdgesToNodes(edges)
  for (const node of nodes) {
    const languages = Object.keys(node.name)
    setMultiLangPages(
      languages,
      node,
      pageResolver(template, subPrefixes),
      createPage
    )
  }
}

function setMultiLangPages(languages, node, pageResolver, createPage) {
  const pages = languages.map(language => {
    const page = pageResolver(node, language)
    page.context.language = language
    return page
  })
  createPages(pages, createPage)
}

function createPages(pages, createPage) {
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
