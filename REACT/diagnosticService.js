import axios from "axios";
import { onGlobalSuccess, onGlobalError, API_HOST_PREFIX } from "./serviceHelpers";

var diagnosticsService = {
    endpoint: `${API_HOST_PREFIX}/api/diagnostics`,
};

const addDiagnostic = (payload) => {
    const config = {
        method: "POST",
        url: diagnosticsService.endpoint,
        data: payload,
        crossdomain: true,
        headers: {"Content-Type": "application/json"},
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const updateDiagnostic = (payload, id) => {
    const config = {
        method: "PUT",
        url: `${diagnosticsService.endpoint}/${id}`,
        data: payload,
        crossdomain: true,
        headers: {"Content-Type": "application/json"},
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const getDiagByHorseId = (pageIndex, pageSize, horseId) => {
    const config = {
        method: "GET",
        url: `${diagnosticsService.endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${horseId}`,
        crossdomain: true,
        headers: {"Content-Type": "application/json"},
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const getDiagByPracticeId = (practiceId) => {
    const config = {
        method: "GET",
        url: `${diagnosticsService.endpoint}/practice/${practiceId}`,
        crossdomain: true,
        headers: {"Content-Type": "application/json"},
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const getDiagById = (id) => {
    const config = {
        method: "GET",
        url: `${diagnosticsService.endpoint}/${id}`,
        crossdomain: true,
        headers: {"Content-Type": "application/json"}
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const updateIsArchivedById = (payload) => {
    const config = {
        method: "PUT",
        url: `${diagnosticsService.endpoint}/archived/${payload.id}/{true/false}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: {"Content-Type": "application/json"}
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const diagnosticServices = {
    addDiagnostic,
    updateDiagnostic,
    getDiagByHorseId,
    getDiagByPracticeId,
    getDiagById,
    updateIsArchivedById
};
export default diagnosticServices;