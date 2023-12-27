import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./app-layout";
import Home from "./home";
import Parties from "./parties";
import Elections from "./elections";
import Candidates from "./candidates";

function App() {
  return (
    <BrowserRouter>
      {/* <Layout/> */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/candidate" element={<Candidates />} />
          <Route path="/party" element={<Parties />} />
          <Route path="/election" element={<Elections />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
