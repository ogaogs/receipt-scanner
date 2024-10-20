"use server";

type PreSignedURL = {
  pre_signed_url: string;
};

type Error = {
  code: number;
  message: string;
};

type AnalyzedReceiptDetail = {
  store_name: string | null;
  amount: number;
  date: string | null;
  category: string | null;
};

type ReceiptAnalyzationResponse = {
  receipt_detail: AnalyzedReceiptDetail | null;
  error: Error | null;
};

export const getReceiptDetailFromModel = async (
  preSignedURL: string
): Promise<ReceiptAnalyzationResponse> => {
  const body: PreSignedURL = {
    pre_signed_url: preSignedURL,
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
    console.log(error);
    throw error;
  });

  const analyzationResponse: ReceiptAnalyzationResponse = await response.json();
  return analyzationResponse;
};
