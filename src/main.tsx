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

  async open() {
    // Show loader immediately
    this.root.render(<h1>Loading...</h1>);

    try {
      const location = await this.getLocation();
      const props = { ...this.options, location };

      this.root.render(
        <PaymentGatewayComponent {...props} onClose={this.handleClose} />
      );
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  close(): void {
    this.handleClose();
  }

  private handleClose = (): void => {
    this.root.unmount();
    document.body.removeChild(this.container);
    if (this.options.modal?.ondismiss) {
      this.options.modal.ondismiss();
    }
  };

  private handleError(error: Error): void {
    if (this.options["payment.failed"]) {
      this.options["payment.failed"]({
        error: {
          code: "LOCATION_ERROR",
          message: error.message,
        },
      });
    }
    this.handleClose();
  }

  private getLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  }
}

declare global {
  interface Window {
    PaymentGateway: typeof PaymentGateway;
  }
}

window.PaymentGateway = PaymentGateway;
