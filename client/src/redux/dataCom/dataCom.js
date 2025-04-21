import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔄 Thunk pour ajouter un DataCom avec fichiers
export const addDataCom = createAsyncThunk(
  "dataCom/addDataCom",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/dataCom/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.msg || "Erreur serveur"
      );
    }
  }
);

export const getAllDataComs = createAsyncThunk(
  "dataCom/getAllDataComs",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:5000/dataCom/all");
      return res.data.dataComs;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erreur lors du chargement");
    }
  }
);
// dataCom.slice.js
export const updateDataComFiles = createAsyncThunk(
  "dataCom/updateFiles",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/dataCom/update-files/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Erreur serveur");
    }
  }
);
const dataComSlice = createSlice({
  name: "dataCom",
  initialState: {
    dataCom: null,
    allDataComs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addDataCom.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addDataCom.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.dataCom = action.payload;
            })
            .addCase(addDataCom.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(getAllDataComs.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getAllDataComs.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.allDataComs = action.payload;
            })
            .addCase(getAllDataComs.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(updateDataComFiles.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateDataComFiles.fulfilled, (state, action) => {
                state.status = "succeeded";
            })
            .addCase(updateDataComFiles.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

    }
});

export default dataComSlice.reducer;
