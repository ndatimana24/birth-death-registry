import { rwandaLocation } from "@devrw/rwanda-location";

// ===== PROVINCES =====
export const getProvinces = () => {
  return rwandaLocation.getProvinces();
  // [{ code: 1, name: 'KIGALI' }, { code: 2, name: 'SOUTH' }, ...]
};

// ===== DISTRICTS =====
export const getDistricts = (provinceCode) => {
  return rwandaLocation.getDistricts(provinceCode);
  // [{ code: 101, name: 'Nyarugenge', provinceCode: 1, ... }, ...]
};

export const getAllDistricts = () => {
  return rwandaLocation.getDistricts();
};

// ===== SECTORS =====
export const getSectors = (districtCode) => {
  return rwandaLocation.getSectors(districtCode);
};

// ===== CELLS =====
export const getCells = (sectorCode) => {
  return rwandaLocation.getCells(sectorCode);
};

// ===== VILLAGES =====
export const getVillages = (cellCode) => {
  return rwandaLocation.getVillages(cellCode);
};

// ===== FIND BY NAME (case-insensitive) =====
export const findProvinceByName = (name) => {
  return rwandaLocation.getProvinceByName(name);
};

export const findDistrictByName = (name) => {
  const all = rwandaLocation.getDistricts();
  return all.find((d) => d.name.toLowerCase() === name.toLowerCase());
};