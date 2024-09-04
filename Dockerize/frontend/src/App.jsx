import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import FoodForm from './components/FoodForm'
import UpdateFoodForm from './components/UpdateFoodForm'
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';
import PrivteRoutes from './context/PrivteRoutes';

const App = () => {
  return (
    <React.Fragment>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            <Route element={<PrivteRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add_new" element={<FoodForm />} />
              <Route path="/update_food/:id" element={<UpdateFoodForm />} />
            </Route>

        
          </Routes>
        </Router>
      </AuthProvider>
    </React.Fragment>
  )
}

export default App
