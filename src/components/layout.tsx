import "@/styles/globals.css"
export default function Layout({ children }) {
  return (
    <>
      <h2>Ceci est mon header</h2>
      <main>{children}</main>
      <h2>Ceci est mon footer</h2>
    </>
  )
}