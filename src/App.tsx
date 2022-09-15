import { useState } from 'react';
import React from 'react';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedLayout } from './components/ProtectedLayout';
import { SignIn } from './screens/SignIn';
import Schedule from './screens/Schedules';
import { useAuth } from './context/AuthProvider/useAuth';
import { Teste } from './screens/Teste';
import { SnackbarProvider } from 'notistack';

function App() {

  
  //const auth = useAuth();
  //console.log(auth.name);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
   

            <Route path='/' element={<SignIn/> }></Route>
            <Route path='/signIn' element={<SignIn/> }></Route>
            <Route path='/teste' element={<Teste/> }></Route>

           <Route path='/Schedule' 
              element={
                <ProtectedLayout>
                  <Schedule/>
                </ProtectedLayout>
              }>
            </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
