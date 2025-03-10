import { configureStore } from "@reduxjs/toolkit";
import storeSlice from "./slices/storeSlice";
import skuSlice from "./slices/skuSlice";
import chart from "./slices/chartSlice";

const store = configureStore({
    reducer: {
        storeSlice,
        skuSlice,
        chart
    }
})

export default store;