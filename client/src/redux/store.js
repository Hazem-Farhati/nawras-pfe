import {configureStore} from '@reduxjs/toolkit' 
import userSlice from './userSlice/userSlice';
import dataComSlice from "./dataCom/dataCom";

 
export const store = configureStore({
  reducer: {
    user: userSlice,
    dataCom: dataComSlice,
  },
});