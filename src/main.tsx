import ReactDOM from "react-dom/client";
import PaymentGatewayComponent from "./components/PaymentGateway";
import { PaymentGatewayProps, FailedPaymentResponseType } from "./types";

class PaymentGateway {
  private options: PaymentGatewayProps;
  private container: HTMLDivElement;
  private root: ReactDOM.Root;

  constructor(options: PaymentGatewayProps) {
    this.options = options;
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.root = ReactDOM.createRoot(this.container);
  }

  on(
    event: "payment.failed" | string,
    callback: (response: FailedPaymentResponseType) => void
  ): void {
    if (event === "payment.failed") {
      this.options[event] = callback;
    }
  }

  open(): void {
    this.root.render(
      <PaymentGatewayComponent
        {...this.options}
        onClose={() => {
          this.root.unmount();
          document.body.removeChild(this.container);
          if (this.options.modal && this.options.modal.ondismiss) {
            this.options.modal.ondismiss();
          }
        }}
      />
    );
  }

  close(): void {
    this.root.unmount();
    document.body.removeChild(this.container);
  }
}

declare global {
  interface Window {
    PaymentGateway: typeof PaymentGateway;
  }
}

window.PaymentGateway = PaymentGateway;
