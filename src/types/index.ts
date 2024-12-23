export type PaymentGatewayProps = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  image: string;
  order_id: string;
  merchantid: number;
  location: { latitude: number; longitude: number };
  handler: (response: {
    TransactionId?: string;
    CustomerRefNo?: string;
    message: string;
    payment_id: string;
  }) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  modal: {
    ondismiss: () => void;
  };
  onClose: () => void;
  "payment.failed"?: (response: FailedPaymentResponseType) => void;
};

export type FailedPaymentResponseType = {
  error: { code: string; message: string };
};
