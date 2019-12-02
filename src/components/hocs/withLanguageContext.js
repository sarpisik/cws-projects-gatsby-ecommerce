import React from "react"
import { Helmet } from "react-helmet"

export const AlternateLinksContext = React.createContext([])
export const LanguageContext = React.createContext()

export const withLanguageContext = ({ element, props }) => (
  <LanguageContext.Provider value={(props.pageContext || {}).language}>
    <AlternateLinksContext.Provider
      value={props.pageContext && props.pageContext.alternateLinks}
    >
      <Helmet htmlAttributes={{ lang: props.pageContext.language }}>
        {props.pageContext &&
          props.pageContext.alternateLinks &&
          props.pageContext.alternateLinks.map(link => (
            <link rel="alternate" hrefLang={link.language} href={link.path} />
          ))}
      </Helmet>
      {element}
    </AlternateLinksContext.Provider>
  </LanguageContext.Provider>
)
