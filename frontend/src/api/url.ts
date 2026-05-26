import api from "./axios";

export const getMyUrls = async () => {
    const response = await api.get("my-urls")

    return response.data
}

export const createShortURL = async (
  url: string,
  customCode: string
) => {
  const response = await api.post("/shorten", {
    url,
    custom_code: customCode,
  })

  return response.data
}