import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const searchProduct = (query) =>
  API.get(`/products/search?q=${query}`);

export const getComparison = (id) =>
  API.get(`/products/compare/${id}`);

export const getSeller = (slug) =>
  API.get(`/seller/${slug}`);

export const getRandomProducts = () => 
  API.get("/v1/products/random");

export default API;
