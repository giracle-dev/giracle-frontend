export default {
  sendMessage: async (channelId: string, message: string): Promise<void> => {
    const response = await fetch("/api/message/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ channelId, message }),
    });
    if (!response.ok)
      throw new Error("messageRepository :: sendMessage :: エラー");
    return await response.json();
  },
};
