import APIService from "../Service/APIService";
import { createSlice } from "@reduxjs/toolkit";

export const reportDate = async (req, token) => {
    let result = null;
    try {
        const response = await APIService.reportByDate().reportByDate(req, token);
        if (response && response.data) {
            result = response.data;
        }
    } catch (error) {
        result = null;
    }
    return result;
}