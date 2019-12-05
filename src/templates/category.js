import React from "react"
import { graphql } from "gatsby"
import SEO from "../components/seo"
import Layout from "../components/layout"

export const query = graphql`
  query CategoryPageQuery($pageId: String, $language: String) {
    category: category(_id: { eq: $pageId }) {
      id
      name {
        translate(language: $language)
      }
    }
  }
`

const CategoryPage = ({ data: { category }, errors }) => {
  if (errors || !category) {
    console.error(errors)

    return <Layout>Error</Layout>
  }
  const { name } = category
  return (
    <Layout>
      <SEO title={name.translate} />
      <h1>{name.translate}</h1>
    </Layout>
  )
}

// export default localize(CategoryPage)
export default CategoryPage
