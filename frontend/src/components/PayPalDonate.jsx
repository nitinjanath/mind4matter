import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

function Message({ content }) {
  return <p>{content}</p>;
}

function PayPalDonate({ amount }) {
  const [message, setMessage] = useState("");

  return (
    <div>
      <PayPalButtons
        style={{
          shape: "rect",
          layout: "vertical",
          color: "gold",
          label: "paypal",
        }}
        createOrder={async () => {
          try {
            const response = await fetch("http://localhost:8000/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount, // Send dynamic amount
              }),
            });

            const orderData = await response.json();

            if (orderData.id) {
              return orderData.id;
            } else {
              const errorDetail = orderData?.details?.[0];
              const errorMessage = errorDetail
                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                : JSON.stringify(orderData);

              throw new Error(errorMessage);
            }
          } catch (error) {
            console.error(error);
            setMessage(`Could not initiate PayPal Checkout...${error}`);
          }
        }}
        onApprove={async (data, actions) => {
          try {
            const response = await fetch(
              `http://localhost:8000/orders/${data.orderID}/capture`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const orderData = await response.json();

            const errorDetail = orderData?.details?.[0];

            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
              return actions.restart();
            } else if (errorDetail) {
              throw new Error(
                `${errorDetail.description} (${orderData.debug_id})`
              );
            } else {
              const transaction =
                orderData.purchase_units[0].payments.captures[0];
              setMessage(
                `Transaction ${transaction.status}: ${transaction.id}`
              );
              console.log("Capture result", orderData);
            }
          } catch (error) {
            console.error(error);
            setMessage(`Transaction could not be processed: ${error}`);
          }
        }}
      />
      <Message content={message} />
    </div>
  );
}

export default PayPalDonate;
