export function bookingCreatedTemplate({
  customerName,
  bookingNumber,
  serviceName,
  startDate,
  endDate,
  totalPrice,
  currency,
}) {
  return {
    subject: `TripSphere Booking Created - ${bookingNumber}`,

    text: `
Hello ${customerName},

Your TripSphere booking has been created successfully.

Booking Number: ${bookingNumber}
Service: ${serviceName}
Start Date: ${startDate}
End Date: ${endDate || "N/A"}
Total Price: ${currency} ${totalPrice}

Your booking is currently pending confirmation.

Thank you for choosing TripSphere.
`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>TripSphere Booking Created</h2>

        <p>Hello ${customerName},</p>

        <p>
          Your booking has been created successfully.
        </p>

        <table cellpadding="8" cellspacing="0" border="1">
          <tr>
            <td><strong>Booking Number</strong></td>
            <td>${bookingNumber}</td>
          </tr>

          <tr>
            <td><strong>Service</strong></td>
            <td>${serviceName}</td>
          </tr>

          <tr>
            <td><strong>Start Date</strong></td>
            <td>${startDate}</td>
          </tr>

          <tr>
            <td><strong>End Date</strong></td>
            <td>${endDate || "N/A"}</td>
          </tr>

          <tr>
            <td><strong>Total Price</strong></td>
            <td>${currency} ${totalPrice}</td>
          </tr>
        </table>

        <p>
          Your booking is currently <strong>pending confirmation</strong>.
        </p>

        <p>
          Thank you for choosing TripSphere.
        </p>
      </div>
    `,
  };
}

export function bookingConfirmedTemplate({
  customerName,
  bookingNumber,
  serviceName,
  startDate,
  endDate,
  totalPrice,
  currency,
}) {
  return {
    subject: `TripSphere Booking Confirmed - ${bookingNumber}`,

    text: `
Hello ${customerName},

Your TripSphere booking has been confirmed.

Booking Number: ${bookingNumber}
Service: ${serviceName}
Start Date: ${startDate}
End Date: ${endDate || "N/A"}
Total Price: ${currency} ${totalPrice}

We look forward to serving you.

Thank you for choosing TripSphere.
`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>TripSphere Booking Confirmed</h2>

        <p>Hello ${customerName},</p>

        <p>
          Your booking has been <strong>confirmed</strong>.
        </p>

        <table cellpadding="8" cellspacing="0" border="1">
          <tr>
            <td><strong>Booking Number</strong></td>
            <td>${bookingNumber}</td>
          </tr>

          <tr>
            <td><strong>Service</strong></td>
            <td>${serviceName}</td>
          </tr>

          <tr>
            <td><strong>Start Date</strong></td>
            <td>${startDate}</td>
          </tr>

          <tr>
            <td><strong>End Date</strong></td>
            <td>${endDate || "N/A"}</td>
          </tr>

          <tr>
            <td><strong>Total Price</strong></td>
            <td>${currency} ${totalPrice}</td>
          </tr>
        </table>

        <p>
          We look forward to serving you.
        </p>

        <p>Thank you for choosing TripSphere.</p>
      </div>
    `,
  };
}

export function bookingCancelledTemplate({
  customerName,
  bookingNumber,
  serviceName,
  cancellationReason,
}) {
  return {
    subject: `TripSphere Booking Cancelled - ${bookingNumber}`,

    text: `
Hello ${customerName},

Your TripSphere booking has been cancelled.

Booking Number: ${bookingNumber}
Service: ${serviceName}

Cancellation Reason:
${cancellationReason || "No reason provided"}

If you believe this cancellation was made in error, please contact TripSphere support.

Thank you.
`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>TripSphere Booking Cancelled</h2>

        <p>Hello ${customerName},</p>

        <p>
          Your booking has been <strong>cancelled</strong>.
        </p>

        <p>
          <strong>Booking Number:</strong> ${bookingNumber}
        </p>

        <p>
          <strong>Service:</strong> ${serviceName}
        </p>

        <p>
          <strong>Cancellation Reason:</strong><br>
          ${cancellationReason || "No reason provided"}
        </p>

        <p>
          If you believe this cancellation was made in error,
          please contact TripSphere support.
        </p>
      </div>
    `,
  };
}

export function paymentSuccessfulTemplate({
  customerName,
  bookingNumber,
  paymentId,
  amount,
  currency,
}) {
  return {
    subject: `TripSphere Payment Successful - ${bookingNumber}`,

    text: `
Hello ${customerName},

Your TripSphere payment was successful.

Booking Number: ${bookingNumber}
Payment ID: ${paymentId}
Amount: ${currency} ${amount}

Your booking has been confirmed.

Thank you for choosing TripSphere.
`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>TripSphere Payment Successful</h2>

        <p>Hello ${customerName},</p>

        <p>
          Your payment was successfully processed.
        </p>

        <table cellpadding="8" cellspacing="0" border="1">
          <tr>
            <td><strong>Booking Number</strong></td>
            <td>${bookingNumber}</td>
          </tr>

          <tr>
            <td><strong>Payment ID</strong></td>
            <td>${paymentId}</td>
          </tr>

          <tr>
            <td><strong>Amount</strong></td>
            <td>${currency} ${amount}</td>
          </tr>
        </table>

        <p>
          Your booking has been confirmed.
        </p>

        <p>Thank you for choosing TripSphere.</p>
      </div>
    `,
  };
}

export function paymentFailedTemplate({
  customerName,
  bookingNumber,
  amount,
  currency,
  reason,
}) {
  return {
    subject: `TripSphere Payment Failed - ${bookingNumber}`,

    text: `
Hello ${customerName},

Unfortunately, your TripSphere payment could not be completed.

Booking Number: ${bookingNumber}
Amount: ${currency} ${amount}

Reason:
${reason || "Payment processing failed"}

Please try again or use another payment method.

Thank you.
`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>TripSphere Payment Failed</h2>

        <p>Hello ${customerName},</p>

        <p>
          Unfortunately, your payment could not be completed.
        </p>

        <p>
          <strong>Booking Number:</strong> ${bookingNumber}
        </p>

        <p>
          <strong>Amount:</strong> ${currency} ${amount}
        </p>

        <p>
          <strong>Reason:</strong><br>
          ${reason || "Payment processing failed"}
        </p>

        <p>
          Please try again or use another payment method.
        </p>
      </div>
    `,
  };
}

export function vendorNewBookingTemplate({
  vendorName,
  bookingNumber,
  customerName,
  serviceName,
  startDate,
  endDate,
  quantity,
  totalPrice,
  currency,
}) {
  return {
    subject: `New Booking Received - ${bookingNumber}`,

    text: `
Hello ${vendorName},

You have received a new booking on TripSphere.

Booking Number: ${bookingNumber}
Customer: ${customerName}
Service: ${serviceName}
Start Date: ${startDate}
End Date: ${endDate}
Quantity: ${quantity}
Total Price: ${totalPrice} ${currency}

Please log in to TripSphere to review and manage this booking.

Thank you,
TripSphere
`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Booking Received</h2>

        <p>Hello ${vendorName},</p>

        <p>
          You have received a new booking on TripSphere.
        </p>

        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">
              Booking Number
            </td>
            <td style="padding: 8px;">
              ${bookingNumber}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">
              Customer
            </td>
            <td style="padding: 8px;">
              ${customerName}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">
              Service
            </td>
            <td style="padding: 8px;">
              ${serviceName}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">
              Start Date
            </td>
            <td style="padding: 8px;">
              ${startDate}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">
              End Date
            </td>
            <td style="padding: 8px;">
              ${endDate}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">
              Quantity
            </td>
            <td style="padding: 8px;">
              ${quantity}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">
              Total Price
            </td>
            <td style="padding: 8px;">
              ${totalPrice} ${currency}
            </td>
          </tr>
        </table>

        <p>
          Please log in to TripSphere to review and manage this booking.
        </p>

        <p>
          Thank you,<br />
          TripSphere
        </p>
      </div>
    `,
  };
}