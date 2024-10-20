"use server";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = "ap-northeast-1";
const BUCKET_NAME = "receipt-scanner";

// S3クライアントのインスタンスを作成
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const generatePreSignedURL = async (
  fileName: string,
  operation: "put" | "get" // "put" または "get" で動作を切り替える
): Promise<string> => {
  const params: {
    Bucket: string;
    Key: string;
    ContentType?: string;
  } = {
    Bucket: BUCKET_NAME,
    Key: fileName,
  };

  // PUTの場合はContentTypeを追加
  if (operation === "put") {
    params.ContentType = "image/*";
  }

  const command =
    operation === "put"
      ? new PutObjectCommand(params)
      : new GetObjectCommand(params);

  // Pre-signed URLを生成
  const preSignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5分有効
  return preSignedUrl;
};

export const uploadFileToS3 = async (
  fileData: string, // base64エンコードされた画像データ
  putPreSignedURL: string
): Promise<void> => {
  // base64の文字列からbase64部分を取り出し、デコード
  const byteString = atob(fileData.split(",")[1]);

  // 画像のタイプの取得
  const mimeString = fileData.split(",")[0].split(":")[1].split(";")[0];

  // ArrayBufferとUint8Arrayの作成
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // Blobデータの作成
  const blob = new Blob([ab], { type: mimeString });

  // putPreSigned URLを使ってファイルをアップロード
  const response = await fetch(putPreSignedURL, {
    method: "PUT",
    body: blob,
    headers: {
      "Content-Type": mimeString, // ファイルのタイプを指定
    },
  });

  if (!response.ok) {
    throw new Error("S3へのアップロードに失敗しました");
  }
};

export const downloadFileFromS3 = (downloadrePreSignedURL: string) => {
  return "imag_data";
};
