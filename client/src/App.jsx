import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TransactionDashboard from './TransactionDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TransactionDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;