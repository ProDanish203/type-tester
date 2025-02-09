import api from "./middleware";

export const fetchWords = async (wordCount: number) => {
  try {
    const { data } = await api.get(`/words?count=${wordCount}`);
    if (!data.success) {
      return {
        success: false,
        response: data.message,
      };
    }
    return {
      success: true,
      response: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};
