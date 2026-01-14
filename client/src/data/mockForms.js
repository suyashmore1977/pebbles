
const generateMockGoogleFormHTML = (title, fields, themeColor) => {
    const fieldsHTML = fields.map(field => `
    <div class="field-card">
      <label>${field.label} <span style="color: red">*</span></label>
      ${field.type === 'textarea'
            ? `<textarea placeholder="Your answer"></textarea>`
            : `<input type="${field.type}" placeholder="Your answer">`
        }
    </div>
  `).join('');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Roboto', sans-serif; background-color: #f0ebf8; padding: 20px; margin: 0; }
        .container { max-width: 640px; margin: 0 auto; }
        .header-strip { height: 10px; background-color: ${themeColor}; border-top-left-radius: 8px; border-top-right-radius: 8px; }
        .card { background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); border: 1px solid #dadce0; overflow: hidden; margin-bottom: 12px; }
        .title-card { padding: 24px; border-top: 8px solid ${themeColor}; margin-bottom: 12px; }
        .title-card h1 { font-size: 32px; margin: 0 0 12px 0; font-weight: 400; }
        .title-card p { color: #5f6368; font-size: 14px; margin: 0; }
        .field-card { padding: 24px; background: white; border-radius: 8px; border: 1px solid #dadce0; margin-bottom: 12px; }
        .field-card label { display: block; font-size: 16px; margin-bottom: 16px; }
        input, textarea { width: 100%; border: none; border-bottom: 1px solid #dadce0; padding: 8px 0; font-size: 14px; outline: none; transition: 0.3s; }
        input:focus, textarea:focus { border-bottom: 2px solid ${themeColor}; }
        .submit-btn { background-color: ${themeColor}; color: white; border: none; padding: 10px 24px; border-radius: 4px; font-weight: bold; cursor: pointer; float: left; }
        .footer { font-size: 12px; color: #5f6368; text-align: center; margin-top: 20px; clear: both; }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="container">
        <div class="card title-card" style="border-top-color: ${themeColor}">
          <h1>${title}</h1>
          <p>This is a demo form for Pebbles.</p>
        </div>
        ${fieldsHTML}
        <div style="margin-top: 24px;">
           <button class="submit-btn">Submit</button>
           <div style="float: right; color: ${themeColor}; font-weight: 500; font-size: 14px; margin-top: 10px;">Clear form</div>
        </div>
        <div class="footer">
           Never submit passwords through Google Forms.
        </div>
      </div>
    </body>
    </html>
  `;
    return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
};

export const MOCK_FORMS = [
    {
        id: 1,
        title: "Job Application",
        description: "Apply for the Senior Developer role.",
        url: "", // Generated below
        fields: [
            { id: "entry.2005620554", label: "Full Name", type: "text" },
            { id: "entry.1045781291", label: "Email Address", type: "email" },
            { id: "entry.1065046570", label: "Phone Number", type: "text" },
            { id: "entry.1166974658", label: "Current Company", type: "text" },
            { id: "entry.839337160", label: "LinkedIn URL", type: "url" },
            { id: "entry.567890123", label: "Why do you want this job?", type: "textarea" }
        ],
        color: "bg-blue-500",
        themeColor: "#3b82f6"
    },
    {
        id: 2,
        title: "Tech Event Registration",
        description: "Register for the upcoming AI Summit.",
        url: "",
        fields: [
            { id: "entry.111222333", label: "Attendee Name", type: "text" },
            { id: "entry.444555666", label: "Organization", type: "text" },
            { id: "entry.777888999", label: "Dietary Restrictions", type: "text" }
        ],
        color: "bg-violet-500",
        themeColor: "#8b5cf6"
    },
    {
        id: 3,
        title: "Doctor Appointment",
        description: "Book a consultation with Dr. Smith.",
        url: "",
        fields: [
            { id: "entry.121212121", label: "Patient Name", type: "text" },
            { id: "entry.343434343", label: "Preferred Date", type: "date" },
            { id: "entry.565656565", label: "Symptoms", type: "textarea" }
        ],
        color: "bg-emerald-500",
        themeColor: "#10b981"
    },
    {
        id: 4,
        title: "Customer Feedback",
        description: "Rate your experience with our service.",
        url: "",
        fields: [
            { id: "entry.999000111", label: "Name (Optional)", type: "text" },
            { id: "entry.222333444", label: "Rating (1-5)", type: "number" },
            { id: "entry.555666777", label: "Comments", type: "textarea" }
        ],
        color: "bg-orange-500",
        themeColor: "#f97316"
    }
];

// Populate URLs dynamically
MOCK_FORMS.forEach(form => {
    form.url = generateMockGoogleFormHTML(form.title, form.fields, form.themeColor);
});
