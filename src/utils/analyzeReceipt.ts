"use server";

import {
  PYTHON_API_ERROR_CODES,
  type PythonAPIErrorCode,
} from "@/constants/errors";

type RequestBody = {
  filename: string;
};

type PythonAPIError = {
  error_type_code: string;
  message: string;
};

type AnalyzedReceiptDetail = {
  store_name: string | null;
  amount: number | null;
  date: string | null;
  category: string | null;
};

export const getReceiptDetailFromModel = async (
  fileName: string
): Promise<AnalyzedReceiptDetail> => {
  const body: RequestBody = {
    filename: fileName,
  };

  const response = await fetch(
    `${process.env.PYTHON_API_SERVER}/receipt-analyze`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ここでContent-Typeを指定
      },
      body: JSON.stringify(body), // bodyをheadersの外に移動
    }
  ).catch((error) => {
    console.error(
      "レシート解析中にエラーが発生しました:Python_API_Serverへのfetchで予期せぬエラーが発生しました。",
      {
        message: error.message,
        fileName,
      }
    );
    throw new Error(
      "レシート解析中にエラーが発生しました。サポートまでお問い合わせください。"
    );
  });

  if (!response.ok) {
    const errorResponse: PythonAPIError = await response.json().catch(() => ({
      error_type_code: "UNKNOWN",
      message: "不明なエラーが発生しました",
    }));

    console.error("レシート解析中にエラーが発生しました - Python API Error:", {
      status: response.status,
      statusText: response.statusText,
      error_type_code: errorResponse.error_type_code,
      message: errorResponse.message,
      fileName,
    });

    let userMessage: string;

    switch (errorResponse.error_type_code.toUpperCase() as PythonAPIErrorCode) {
      case PYTHON_API_ERROR_CODES.SIZE_ERROR:
        userMessage =
          "レシート解析中にエラーが発生しました。アップロードする画像は5MB以下にしてください。";
        break;
      case PYTHON_API_ERROR_CODES.INVALID_TYPE:
        userMessage =
          "レシート解析中にエラーが発生しました。画像はpngもしくはjpegのみ対応しています。";
        break;
      case PYTHON_API_ERROR_CODES.CLIENT_ERROR:
        userMessage =
          "レシート解析中にエラーが発生しました。サポートまでお問い合わせください。";
        break;
      case PYTHON_API_ERROR_CODES.SERVER_ERROR:
        if (response.status === 503) {
          userMessage =
            "レシート解析中にエラーが発生しました。しばらく時間をおいてから再度お試しください。";
        } else {
          userMessage =
            "レシート解析中にエラーが発生しました。サポートまでお問い合わせください。";
        }
        break;
      default:
        userMessage =
          "レシート解析中にエラーが発生しました。サポートまでお問い合わせください。";
        break;
    }

    throw new Error(userMessage);
  }

  const receiptDetail: AnalyzedReceiptDetail = await response.json();

  return receiptDetail;
};
