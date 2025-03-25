
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { IngredientsPage } from './components/IngredientsPage'; // Updated import
import { MealsPage } from './components/MealsPage'; // New import
import { ChatWidget } from './components/ChatWidget';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-1 flex">
          <Routes>
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/" element={<MealsPage />} />
          </Routes>
        </main>
        <ChatWidget />
      </div>
    </Router>
  );
}