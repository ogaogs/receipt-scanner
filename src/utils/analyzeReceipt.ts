"use server";

type RequestBody = {
  filename: string;
};

type Error = {
  code: number;
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
    console.log(error);
    throw error;
  });

  if (!response.ok) {
    throw new Error("レシートの解析に失敗しました");
  }

  const receiptDetail: AnalyzedReceiptDetail = await response.json();
  
  return receiptDetail;
};
