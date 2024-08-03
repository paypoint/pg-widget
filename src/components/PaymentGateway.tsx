import { PaymentGatewayProps } from "@/types";
import React, { useState } from "react";

const PaymentGatewayComponent: React.FC<PaymentGatewayProps> = (props) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const apiCall = async (): Promise<void> => {
    const response = await fetch("/api");
    const json = await response.json();
    console.log(json);
  };

  const handlePayment = (): void => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (props.name.toLowerCase() === "viru") {
        props.handler({ payment_id: props.name + "SUCCESS" + Math.random() });
        props.onClose();
      } else if (props.amount < 1000) {
        if (props["payment.failed"]) {
          props["payment.failed"]({
            error: {
              description: "Payment failed: Amount should be at least 10 INR",
            },
          });
        }
      } else {
        if (Math.random() > 0.5) {
          props.handler({
            payment_id: props.name + "SUCCESS" + Math.random(),
          });
          props.onClose();
        } else {
          if (props["payment.failed"]) {
            props["payment.failed"]({
              error: { description: "Payment failed" },
            });
          }
        }
      }
    }, 2000);
  };

  return (
    <div className="payment-gateway-overlay">
      <div className="payment-gateway-modal">
        <h2>{props.name}</h2>
        <img src={props.image} alt={props.name} />
        <p>
          Amount: {props.amount / 100} {props.currency}
        </p>
        <p>Customer: {props.prefill.name}</p>
        <button onClick={handlePayment} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
        <button onClick={props.onClose}>Close</button>
      </div>
    </div>
  );
};

export default PaymentGatewayComponent;
