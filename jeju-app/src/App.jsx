import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Characters from './pages/Characters.jsx';
import Play from './pages/Play.jsx';
import Game from './pages/Game.jsx';
import Shop from './pages/Shop.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Forgot from './pages/Forgot.jsx';
import Reset from './pages/Reset.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const immersive = pathname.startsWith('/play/'); // 게임 화면은 푸터 없이 꽉 차게

  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main className={immersive ? 'main immersive' : 'main'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/play" element={<Play />} />
          <Route path="/play/:id" element={<ProtectedRoute><Game /></ProtectedRoute>} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/me" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!immersive && <Footer />}
    </div>
  );
}
