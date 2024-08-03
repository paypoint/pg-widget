import ReactDOM from "react-dom";
import PaymentGatewayComponent from "@/components/PaymentGateway";
import "./index.css";
import { PaymentGatewayProps } from "./types";

class PaymentGateway {
  private options: PaymentGatewayProps;
  private container: HTMLDivElement;

  constructor(options: PaymentGatewayProps) {
    this.options = options;
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
  }

  on(event: string, callback: (response: any) => void): void {
    if (event === "payment.failed") {
      this.options["payment.failed"] = callback;
    }
  }

  open(): void {
    ReactDOM.render(
      <PaymentGatewayComponent
        {...this.options}
        onClose={() => {
          ReactDOM.unmountComponentAtNode(this.container);
          document.body.removeChild(this.container);
          if (this.options.modal && this.options.modal.ondismiss) {
            this.options.modal.ondismiss();
          }
        }}
      />,
      this.container
    );
  }

  close(): void {
    document.body.removeChild(this.container);
  }
}

declare global {
  interface Window {
    PaymentGateway: typeof PaymentGateway;
  }
}

window.PaymentGateway = PaymentGateway;
