import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:5000/dataCom";

// 🔄 Thunk لإضافة DataCom مع ملفات
export const addDataCom = createAsyncThunk(
  "dataCom/addDataCom",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_BASE}/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.msg || "Erreur serveur"
      );
    }
  }
);

// 🔄 Thunk لجلب كل DataComs
export const getAllDataComs = createAsyncThunk(
  "dataCom/getAllDataComs",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_BASE}/all`);
      return res.data.dataComs;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erreur lors du chargement");
    }
  }
);

// 🔄 Thunk لتحديث ملفات DataCom (preavisDarriver و avisDarriver)
export const updateDataComFiles = createAsyncThunk(
  "dataCom/updateFiles",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_BASE}/update-files/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Erreur serveur");
    }
  }
);

// 🔄 Thunk لتحديث الحقول العادية (statut، coments، وغيرها)
export const update = createAsyncThunk(
  "cours/update",
  async ({ id, fields }) => {
    try {
   ;
      let result = axios.put(
        `http://localhost:5000/dataCom/update/${id}`,
        fields
      );
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }
);

// Slice الرئيسي
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
      // addDataCom
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

      // getAllDataComs
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

      // updateDataComFiles
      .addCase(updateDataComFiles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateDataComFiles.fulfilled, (state, action) => {
        state.status = "succeeded";
        // تحديث العنصر الموجود في القائمة
        const index = state.allDataComs.findIndex(
          (item) => item._id === action.payload.dataCom._id
        );
        if (index !== -1) {
          state.allDataComs[index] = action.payload.dataCom;
        }
      })
      .addCase(updateDataComFiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // updateDataComFields
      .addCase(update.pending, (state) => {
        state.status = "loading";
      })
      .addCase(update.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.allDataComs.findIndex(
          (item) => item._id === action.payload.dataCom._id
        );
        if (index !== -1) {
          state.allDataComs[index] = action.payload.dataCom;
        }
      })
      .addCase(update.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default dataComSlice.reducer;
