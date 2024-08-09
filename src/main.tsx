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
    await this.getLocation()
      .then((location) => {
        const props = { ...this.options, location };
        this.root.render(
          <PaymentGatewayComponent
            {...props}
            onClose={() => {
              this.root.unmount();
              document.body.removeChild(this.container);
              if (this.options.modal && this.options.modal.ondismiss) {
                this.options.modal.ondismiss();
              }
            }}
          />
        );
      })
      .catch((error) => {
        if (this.options["payment.failed"]) {
          this.options["payment.failed"]({
            error: {
              code: "LOCATION_ERROR",
              message: error.message,
            },
          });
        }
      });
  }

  close(): void {
    this.root.unmount();
    document.body.removeChild(this.container);
  }

  private getLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => {
            reject(error);
          }
        );
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
