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