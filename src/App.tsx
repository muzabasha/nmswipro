import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Topic from './pages/Topic';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="module/:moduleId/topic/:topicId" element={<Topic />} />
      </Route>
    </Routes>
  );
}

export default App;
