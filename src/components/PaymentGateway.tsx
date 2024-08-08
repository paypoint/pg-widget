import { PaymentGatewayProps } from "../types";
import React, { useEffect, useRef } from "react";

const PaymentGatewayComponent: React.FC<PaymentGatewayProps> = (props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeUrl = "http://localhost:5173";

  useEffect(() => {
    const sendMessageToChild = () => {
      console.log("Parent: Sending message to child");
      const data = {
        url: window.location.href,
        ...props,
      };
      iframeRef.current!.contentWindow!.postMessage(
        { type: "SET_CONFIG", message: JSON.stringify(data) },
        iframeUrl
      );
    };

    const handleMessageFromChild = (event: {
      data: { type: string; payment_id: any };
    }) => {
      // In production, you should check event.origin
      console.log("Parent: Received message", event.data);
      if (event.data.type === "USER_DISMISSED_HOME_PAGE") {
        props.onClose();
        // setMessageFromChild(event.data.message);
      } else if (event.data.type === "TXN_SUCCESS") {
        props.handler({ payment_id: event.data.payment_id });
      } else if (
        event.data.type === "ERROR" ||
        event.data.type === "AMOUNT_ERROR"
      ) {
        props?.["payment.failed"]?.({
          error: {
            code: event.data.type,
            description: event.data.payment_id,
          },
        });
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", sendMessageToChild);
    }

    window.addEventListener("message", handleMessageFromChild);

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", sendMessageToChild);
      }
      window.removeEventListener("message", handleMessageFromChild);
    };
  }, [props]);

  return (
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
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        height="600px"
        width="400px"
        style={{
          opacity: 1,
          position: "relative",
          background: "none",
          display: "block",
          border: "0px none transparent",
          margin: "0px",
          padding: "0px",
          zIndex: 2,
        }}
      />
    </div>
  );
};

export default PaymentGatewayComponent;
