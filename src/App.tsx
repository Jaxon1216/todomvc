import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import ChapterPage from "./pages/ChapterPage"
import Guide from "./pages/Guide"
import DemoPage from "./pages/DemoPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chapter/:id" element={<ChapterPage />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/demo" element={<DemoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
