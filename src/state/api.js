import { createApi } from "@reduxjs/toolkit/query/react";
import { db } from "../firebase";

export const api = createApi({
  reducerPath: "adminApi",
  tagTypes: ["Brands"],
  endpoints: (build) => ({
    getBrands: build.query({
      query: () => db.collection("brands").get(),
      providesTags: ["Brands"],
    }),
  }),
});

export const { useGetBrandsQuery } = api;
