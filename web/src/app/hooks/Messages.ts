const Message = (api:any, message:string, type: string) => {
    api.open({
        type: type,
        content: message
    });
};

export default Message;