import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 15000,
});

export const wandikaUmwana = (data) => API.post("/registry/birth", data);
export const andikuzaUwapfuye = (data) => API.post("/registry/death", data);
export const shakishaByose = () => API.get("/registry/all");
export const sibaUmuntu = (id) => API.delete(`/registry/${id}`);
export const updateUmuntu = (id, data) => API.put(`/registry/${id}`, data);

export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);

export default API;