import { Route, Routes } from 'react-router-dom';

import { Signin } from './Auth/Signin';

export const Routing = () => {
  return (
    <Routes>
      <Route path="signin" element={<Signin />} />
    </Routes>
  );
};
