import APIService from "../Service/APIService";

export const reportYear = async (req, token) => {
    let result = null;
    try {
        const response = await APIService.report().reportByYear(req, token);
        if (response && response.data) {
            result = response.data;
        }
    } catch (error) {
        result = null;
    }
    return result;
}

export const reportMonth = async (req, token) => {
    let result = null;
    try {
        const response = await APIService.report().reportByMonth(req, token);
        if (response && response.data) {
            result = response.data;
        }
    } catch (error) {
        result = null;
    }
    return result;
}