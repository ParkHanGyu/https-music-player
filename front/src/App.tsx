import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Container from "./layouts/Container";
import { MAIN_PATH, PLAY_LIST_PATH, TEST_PATH } from "./constant";
import PlayList from "./views/PlayList";
import Main from "./views/Main";
import TestView2 from "./views/TestView2";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Container />}>
          <Route path={MAIN_PATH()} element={<Main />} />
          <Route path={TEST_PATH()} element={<TestView2 />} />
          <Route path={PLAY_LIST_PATH()} element={<PlayList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
