import axiosInstance from "@/services/api/axiosInstance";

export const updateChatUsers = (chatId: number, userIds: number[]) => {
    return axiosInstance.patch(`/chats/${chatId}/users`, { userIds });
  };
  
  export const editMessageInChat = (messageId: number, content: string) => {
    return axiosInstance.patch(`/chats/messages/${messageId}`, {
      content,
    });
  };
  
  export const deleteMessageInChat = async (messageId: number) => {
    return await axiosInstance.delete(`/chats/messages/${messageId}`);
  };
  
  export const markMessagesRead = (chatId: number, messageIds: number[]) => {
    return axiosInstance.patch(`/chats/${chatId}/messages/mark-as-read`, {
      messageIds,
    });
  };