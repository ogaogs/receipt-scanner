export const generatePutPreSignedURL = async (
  selectedImage: string,
  fileName: string
) => {
  console.log("ここでurlを発行");
  return "url";
};

export const uploadFileToS3 = async (
  fileName: string,
  putPreSignedURL: string
) => {
  console.log("ここでs3へのアップロード");
};
