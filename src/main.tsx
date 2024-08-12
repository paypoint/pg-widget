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
        <svg
          width="150"
          height="150"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21"
            opacity="0"
            fill="#000080"
          >
            <animate
              id="spinner_id3C"
              begin="0;spinner_8AQx.end+0.2s"
              attributeName="opacity"
              dur="0.25s"
              values="0;1"
              fill="freeze"
            />
            <animate
              id="spinner_8AQx"
              begin="spinner_mMCl.end+0.5s"
              attributeName="opacity"
              dur="0.1s"
              values="1;0"
              fill="freeze"
            />
          </path>
          <path
            d="M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z"
            opacity="0"
            fill="#138808"
          >
            <animate
              id="spinner_J1bT"
              begin="spinner_id3C.end"
              attributeName="opacity"
              dur="0.25s"
              values="0;1"
              fill="freeze"
            />
            <animate
              begin="spinner_mMCl.end+0.5s"
              attributeName="opacity"
              dur="0.1s"
              values="1;0"
              fill="freeze"
            />
          </path>
          <path
            d="M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3"
            opacity="0"
            fill="#ff9933"
          >
            <animate
              id="spinner_mMCl"
              begin="spinner_J1bT.end"
              attributeName="opacity"
              dur="0.25s"
              values="0;1"
              fill="freeze"
            />
            <animate
              begin="spinner_mMCl.end+0.5s"
              attributeName="opacity"
              dur="0.1s"
              values="1;0"
              fill="freeze"
            />
          </path>
        </svg>
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
