import React from "react"
import { graphql } from "gatsby"
import SEO from "../components/seo"
import Layout from "../components/layout"
import { mapEdgesToNodes, filterOutDocsWithoutSlugs } from "../lib/helpers"
// import localize from '../components/localize'

export const query = graphql`
  query CategoryPageQuery($pageId: String, $language: String) {
    page: category(_id: { eq: $pageId }) {
      id
      name {
        translate(language: $language)
      }
    }
  }
`

const CategoryPage = props => {
  const { data, errors } = props

  if (errors) {
    console.error(errors)

    return <Layout>Error</Layout>
  }

  const page = data && data.page

  if (!page) {
    throw new Error(
      'Missing "Category" page data. Open the studio at http://localhost:3333 and add "Category" page data and restart the development server.'
    )
  }

  return (
    <Layout>
      <SEO title={page.name.translate} />
      <h1>{page.name.translate}</h1>
    </Layout>
  )
}

// export default localize(CategoryPage)
export default CategoryPage
