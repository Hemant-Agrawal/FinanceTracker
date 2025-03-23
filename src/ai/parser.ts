import { convert } from 'html-to-text';

interface PaymentMethod {
  id: string;
  name: string;
  details: string;
}

type Result = {
  description: string,
  amount: number,
  date: string,
  type: "income" | "expense" | "transfer",
  paymentMethod: {
    id: string,
    name: string,
    details: string
  },
  tags: string[],
  notes: string,
  category: string
}

export const parseEmail = async (email: string, paymentMethods: PaymentMethod[]): Promise<Result> => {
  const prompt = `
  Extract transaction details from the following email text and return the result as a JSON object. Use the provided "paymentMethods" array to map the payment method. Ensure the JSON follows this structure:
{
  "description": string,
  "amount": number,
  "date": string,
  "type": "income" | "expense" | "transfer",
  "paymentMethod": {
    "id": string,
    "name": string,
    "details": string
  },
  "tags": string[],
  "notes": string,
  "category": string
}
**Instructions:**
- "description": Extract the merchant/store/recipient name.
- "amount": Extract the transaction amount as a number.
- "date": Extract the transaction date in "DD-MM-YYYY" format.
- "type": Identify the transaction type: "expense" for debits, "income" for credits, "transfer" for fund transfers.
- "paymentMethod": Match against the provided "paymentMethods" array based on "name" and "details" fields. If no match is found, return an empty object \`{}\`.
- "tags": Assign tags like ["UPI", "Shopping", "Food"] based on context.
- "category": Classify as "Shopping", "Food", "Travel", "Bills", or other relevant categories.
- "notes": Include any additional details, such as the UPI reference number, transaction reference, last 4 digits of the card, or other identifying info found in the email.
**Payment Methods:**
${JSON.stringify(paymentMethods)}
**Email Text:**  
"${email}" 
Return only the JSON. No introductory text, no extra output — just the JSON object.`;
  const response = await fetch(process.env.OLLAMA_URL + "/api/generate", {
    method: "POST",
    body: JSON.stringify({
      model: "gemma3",
      prompt,
      stream: false,
      format: "json",
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();
  return JSON.parse(data.response);
};

export function parseHtmlToText(html: string) {
  const plainText = convert(html, {
    selectors: [
      { selector: 'a', format: 'skip' },
      { selector: 'img', format: 'skip' },
    ],
  });
  return plainText;
}