import { Http, HttpAuth } from "../../../../../app/config/Http";

export const UploadPublicFromAnywhere = ({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
    setIdReference
}: any, user_id: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("public", "temp");
    if (user_id) {
        formData.append("user_id", user_id);
    }
    console.log(formData);
    Http.post("/archives/up", formData, {
        onUploadProgress: (event: any) => {
            onProgress({ percent: Math.round((event.loaded / event.total) * 100).toFixed(2) }, file);
        },
    })
        .then(({ data: response }) => {
            setIdReference(response);
            onSuccess(response, file);
        })
        .catch(onError);
    return {
        abort() {
            console.log('upload progress is aborted.');
        },
    };
}

export const UploadRestricted = ({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
    setIdReference
}: any, user_id: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("public", "multiple");
    formData.append("user_id", user_id);
    Http.post("/archives/up-multiple", formData, {
        onUploadProgress: (event: any) => {
            onProgress({ percent: Math.round((event.loaded / event.total) * 100).toFixed(2) }, file);
        },
    })
        .then(({ data: response }) => {
            setIdReference(response);
            onSuccess(response, file);
        })
        .catch(onError);
    return {
        abort() {
            console.log('upload progress is aborted.');
        },
    };
}

export const UploadPrivate = ({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
    setIdReference
}: any, user_id: string, users: string[]) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "PRIVATE");
    formData.append("user_id", user_id);
    formData.append("user_owner", user_id);
    formData.append("users", users.toString());
    HttpAuth.post("/documents/up", formData, {
        onUploadProgress: (event: any) => {
            onProgress({ percent: Math.round((event.loaded / event.total) * 100).toFixed(2) }, file);
        },
    })
        .then(({ data: response }) => {
            setIdReference(response);
            onSuccess(response, file);
        })
        .catch(onError);
    return {
        abort() {
            console.log('upload progress is aborted.');
        }
    };
}