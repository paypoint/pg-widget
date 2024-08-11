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
    this.root.render(
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 24564736,
        }}
      >
        <div style={{ width: "12rem", height: "12rem" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
            <radialGradient
              id="a9"
              cx=".66"
              fx=".66"
              cy=".3125"
              fy=".3125"
              gradientTransform="scale(1.5)"
            >
              <stop offset="0" stop-color="#2563EB"></stop>
              <stop offset=".3" stop-color="#2563EB" stop-opacity=".9"></stop>
              <stop offset=".6" stop-color="#2563EB" stop-opacity=".6"></stop>
              <stop offset=".8" stop-color="#2563EB" stop-opacity=".3"></stop>
              <stop offset="1" stop-color="#2563EB" stop-opacity="0"></stop>
            </radialGradient>
            <circle
              transform-origin="center"
              fill="none"
              stroke="url(#a9)"
              stroke-width="9.6"
              stroke-linecap="round"
              stroke-dasharray="160 800"
              stroke-dashoffset="0"
              cx="80"
              cy="80"
              r="56"
            >
              <animateTransform
                type="rotate"
                attributeName="transform"
                calcMode="spline"
                dur="2"
                values="360;0"
                keyTimes="0;1"
                keySplines="0 0 1 1"
                repeatCount="indefinite"
              ></animateTransform>
            </circle>
            <circle
              transform-origin="center"
              fill="none"
              opacity=".2"
              stroke="#2563EB"
              stroke-width="9.6"
              stroke-linecap="round"
              cx="80"
              cy="80"
              r="56"
            ></circle>
          </svg>
        </div>
      </div>
    );

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
