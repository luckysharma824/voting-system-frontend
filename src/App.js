import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./app-layout";
import Home from './home';
import Party from './party';
import Election from './election';
import Candidate from './candidate';

function App() {
  return (
    <BrowserRouter>
    {/* <Layout/> */}
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/party" element={<Party />} />
        <Route path="/election" element={<Election />} />
        <Route path="/candidate" element={<Candidate />} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
