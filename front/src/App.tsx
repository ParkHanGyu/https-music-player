import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Container from "./layouts/Container";
import { MAIN_PATH } from "./constant";
import Main from "./views/Main";
import TestView from "./views/TestView";
import TestView2 from "./views/TestView2";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Container />}>
          {/* <Route path={MAIN_PATH()} element={<Main />} /> */}
          <Route path={MAIN_PATH()} element={<TestView2 />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
