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

