import { $host } from ".";
import { FaceData } from "../store/FacesStore";

export const getAllUserIds = async (): Promise<number[]> => {
    const { data } = await $host.get('user-cars/all-users/');
    return data;
};


export const uploadFaces = async (faces: FaceData[]) => {
    console.log(faces)
    const formData = new FormData();
    faces.forEach((item) => {
        formData.append("file", item.file);
        // formData.append("detection", JSON.stringify(item.detection));
        // formData.append("description", item.description);
    });
    // formData.append('file', JSON.stringify(faces.map((item) => item.file)))
    formData.append('detections', JSON.stringify(faces.map((item) => item.detection)))
    formData.append('descriptions', JSON.stringify(faces.map((item) => item.description)))
    const { data } = await $host.post(`face`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
}

export const fetchFaces = async (userId: number): Promise<FaceData[]> => {
    const { data } = await $host.get(`user-cars/all-cars/${userId}`);
    return data;
}


export const deleteFaces = async (userId: number, carId: number) => {
    const { data } = await $host.delete(`user-cars/${userId}/cars/${carId}`);
    return data;
}

export const changeFaces = async (userId: number, carId: number, carMileage: number): Promise<FaceData[]> => {
    const { data } = await $host.put(`user-cars/${userId}/cars/${carId}`, { carMileage });
    return data;
}


export const addFaces = async (userId: number, carId: number, carMileage: number): Promise<FaceData> => {
    const { data } = await $host.post("user-cars/", { userId, carId, carMileage });
    return data;
};

