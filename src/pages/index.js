import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"
import { mapEdgesToNodes } from "../lib/helpers"

export const query = graphql`
  query HomePageQuery($language: String) {
    categories: allCategory {
      edges {
        node {
          id
          name {
            translate(language: $language)
          }
          slug {
            translate(language: $language)
          }
          parentId
        }
      }
    }
  }
`

const IndexPage = ({ data, errors, pageContext }) => {
  if (errors || !data || !pageContext) {
    console.error(errors || "Data invalid")
    return <Layout>Error</Layout>
  }

  const { language, alternateLinks, categorySubPrefixes } = pageContext
  const categories = mapEdgesToNodes(data.categories)
  const pathPrefix =
    alternateLinks.find(link => link.language === language).path +
    categorySubPrefixes[language] +
    "/"
  return (
    <Layout>
      <SEO title="Home" />
      {/* <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div> */}
      <ul>
        {categories.map(category => (
          <li key={category.name.translate}>
            <Link to={pathPrefix + category.slug.translate}>
              {category.name.translate}
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default IndexPage
