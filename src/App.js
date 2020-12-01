import React from 'react';
import { Route } from 'react-router-dom';
import MultipleTable from './components/table/MultipleTable';
import TableComponent from './components/table/TableComponent';
import Home from './pages/Home/home';

function App() {
  return (
    <>
      <Home>
        <Route path="/option1" component={TableComponent} />
        <Route path="/option2" component={MultipleTable} />
      </Home>
    </>
  );
}

export default App;
