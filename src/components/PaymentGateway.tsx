import { PaymentGatewayProps } from "../types";
import React, { useEffect, useRef } from "react";

const PaymentGatewayComponent: React.FC<PaymentGatewayProps> = (props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeUrl = "https://jssdk.digikhata.in/v1/";

  useEffect(() => {
    const sendMessageToChild = () => {
      setTimeout(() => {
        const data = {
          url: window.location.href,
          ...props,
        };
        if (iframeRef.current) {
          if (iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              { type: "SET_CONFIG", message: JSON.stringify(data) },
              iframeUrl
            );
          } else {
            console.log("iframeRef.current.contentWindow is null");
          }
        } else {
          console.log("iframeRef.current is null");
        }
      }, 500);
    };

    const handleMessageFromChild = (event: {
      data: {
        type: string;
        payment_id: string;
        message: string;
        TransactionId?: string;
        CustomerRefNo?: string;
      };
    }) => {
      // In production, you should check event.origin
      console.log("Parent: Received message", event.data);
      if (event.data.type === "USER_DISMISSED_HOME_PAGE") {
        props.onClose();
        // setMessageFromChild(event.data.message);
      } else if (event.data.type === "TXN_SUCCESS") {
        props.handler({
          message: event.data.message,
          payment_id: event.data.payment_id,
          TransactionId: event.data.TransactionId,
          CustomerRefNo: event.data.CustomerRefNo,
        });
        props.onClose();
      } else if (
        event.data.type === "ERROR" ||
        event.data.type === "AMOUNT_ERROR"
      ) {
        props["payment.failed"]?.({
          error: {
            code: event.data.type,
            message: event.data.message,
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
  }, [props, iframeRef.current]);

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
        style={{
          opacity: 1,
          position: "relative",
          background: "none",
          display: "block",
          border: "0px none transparent",
          margin: "0px",
          padding: "0px",
          zIndex: 2,
          height: "40.5rem",
          width: "25rem",
          minHeight: "100% !important",
        }}
      />
    </div>
  );
};

export default PaymentGatewayComponent;
