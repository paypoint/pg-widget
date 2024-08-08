export type PaymentGatewayProps = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  image: string;
  order_id: string;
  merchantid: number;
  handler: (response: { payment_id: string }) => void;
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
  error: { code: string; description: string };
};
