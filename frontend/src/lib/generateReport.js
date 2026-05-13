import html2pdf from 'html2pdf.js';

const generateReport = (record) => {
  // Determine if it's a Prescription or a MedicalRecord
  const isPrescription = record.medications && !record.appointment;
  const appt = record.appointment;
  const rx = isPrescription ? record : appt?.prescription;
  
  const consultDate = record.date ? new Date(record.date) : (record.createdAt ? new Date(record.createdAt) : new Date());
  const reportId = 'MCR/' + (record._id?.slice(-6)?.toUpperCase() || Math.random().toString(36).slice(-6).toUpperCase());
  
  const doctorName = record.doctor?.name || 'MediCloud Doctor';
  const patientName = record.patient?.name || 'MediCloud Patient';
  const patientEmail = record.patient?.email || '';
  
  const dateStr = consultDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = appt?.timeSlot || consultDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const typeStr = (appt?.type || record.type || 'consultation').replace('-', ' ');

  const medications = rx?.medications || record.medicines || [];
  const medsRows = medications.map((m, i) => `
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:8px 10px;color:#0d9488;font-weight:700;">${i+1}</td>
      <td style="padding:8px 10px;font-weight:600;">${m.name}</td>
      <td style="padding:8px 10px;">${m.dosage}</td>
      <td style="padding:8px 10px;">${m.frequency || m.dosage}</td>
      <td style="padding:8px 10px;">${m.duration || 'N/A'}</td>
    </tr>
    ${m.instructions ? `<tr style="background:#f0fdfa;"><td></td><td colspan="4" style="padding:3px 10px 8px;font-size:10px;color:#0d9488;">→ ${m.instructions}</td></tr>` : ''}
  `).join('');

  const html = `
<div style="font-family:'Segoe UI',Arial,sans-serif;width:794px;min-height:1123px;position:relative;display:flex;color:#1e293b;font-size:12px;background:white;">
  <!-- LEFT SIDEBAR -->
  <div style="width:220px;background:linear-gradient(180deg,#0f4c75 0%,#1b6b93 50%,#0d9488 100%);color:white;padding:0;flex-shrink:0;">
    <!-- Logo -->
    <div style="padding:28px 20px 20px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.15);">
      <div style="width:60px;height:60px;background:white;border-radius:16px;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:28px;font-weight:900;color:#0f4c75;">M+</span>
      </div>
      <div style="font-size:18px;font-weight:800;letter-spacing:1px;">MEDICLOUD</div>
      <div style="font-size:8px;letter-spacing:2px;opacity:0.7;margin-top:2px;">SMART HEALTHCARE</div>
      <div style="font-size:7px;opacity:0.5;margin-top:4px;">Care · Connect · Cure</div>
    </div>

    <!-- Patient Info -->
    <div style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.12);">
      <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;opacity:0.6;margin-bottom:12px;">PATIENT INFORMATION</div>
      <div style="margin-bottom:10px;">
        <div style="font-size:8px;opacity:0.5;">Patient Name</div>
        <div style="font-size:13px;font-weight:600;">${patientName}</div>
      </div>
      <div style="margin-bottom:10px;">
        <div style="font-size:8px;opacity:0.5;">Email</div>
        <div style="font-size:10px;">${patientEmail}</div>
      </div>
    </div>

    <!-- Hospital Details -->
    <div style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.12);">
      <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;opacity:0.6;margin-bottom:12px;">HOSPITAL DETAILS</div>
      <div style="margin-bottom:10px;">
        <div style="font-size:8px;opacity:0.5;">Hospital</div>
        <div style="font-size:11px;font-weight:600;">MediCloud Hospital</div>
      </div>
      <div style="margin-bottom:10px;">
        <div style="font-size:8px;opacity:0.5;">Doctor</div>
        <div style="font-size:11px;font-weight:600;">Dr. ${doctorName}</div>
      </div>
      <div style="margin-bottom:10px;">
        <div style="font-size:8px;opacity:0.5;">Consultation Type</div>
        <div style="font-size:11px;font-weight:500;text-transform:capitalize;">${typeStr}</div>
      </div>
      ${appt?.duration ? `
      <div style="margin-bottom:10px;">
        <div style="font-size:8px;opacity:0.5;">Call Duration</div>
        <div style="font-size:11px;font-weight:600;">${appt.duration} min</div>
      </div>` : ''}
    </div>

    <!-- Contact -->
    <div style="padding:18px 20px;">
      <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;opacity:0.6;margin-bottom:12px;">CONTACT US</div>
      <div style="font-size:10px;opacity:0.8;line-height:1.8;">
        support@medicloud.health<br>
        www.medicloud.health<br>
        +91 1800-MEDI-CLOUD
      </div>
    </div>
  </div>

  <!-- MAIN CONTENT -->
  <div style="flex:1;padding:0;display:flex;flex-direction:column;">
    <!-- Header -->
    <div style="padding:24px 30px 16px;border-bottom:2px solid #0d9488;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div style="font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">MEDICAL REPORT</div>
          <div style="font-size:11px;color:#0d9488;font-weight:500;margin-top:2px;">Your Health, Our Priority</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:10px;color:#64748b;">Report Date: <strong style="color:#0f172a;">${dateStr}</strong></div>
          <div style="font-size:10px;color:#64748b;margin-top:3px;">Report ID: <strong style="color:#0f172a;">${reportId}</strong></div>
        </div>
      </div>
    </div>

    <div style="padding:20px 30px;flex:1;">
      <!-- Chief Complaint & Appointment -->
      <div style="display:flex;gap:16px;margin-bottom:20px;">
        <div style="flex:1;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px;">
          <div style="font-size:10px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">⊕ Chief Complaint</div>
          <div style="font-size:13px;color:#1e293b;line-height:1.5;">${appt?.reason || record.title || 'General Consultation'}</div>
        </div>
        <div style="flex:1;background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px;">
          <div style="font-size:10px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">⊕ Appointment Info</div>
          <div style="font-size:11px;line-height:2;">
            <strong>Date:</strong> ${consultDate.toLocaleDateString('en-IN', { weekday:'short', day:'2-digit', month:'long', year:'numeric' })}<br>
            <strong>Time:</strong> ${timeStr}<br>
            <strong>Status:</strong> <span style="color:#16a34a;font-weight:600;text-transform:capitalize;">${appt?.status || 'Completed'}</span>
            ${appt?.type === 'teleconsult' && appt?.duration ? `<br><strong>Video Call Duration:</strong> <span style="color:#2563eb;font-weight:600;">${appt.duration} minutes</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Diagnosis -->
      <div style="display:flex;gap:16px;margin-bottom:20px;">
        <div style="flex:1;background:#fef9c3;border:1px solid #fde68a;border-radius:10px;padding:14px;">
          <div style="font-size:10px;font-weight:700;color:#b45309;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">⊕ Diagnosis</div>
          <div style="font-size:14px;font-weight:700;color:#92400e;">${record.diagnosis || rx?.diagnosis || 'Pending Evaluation'}</div>
        </div>
        <div style="flex:1;background:#fdf2f8;border:1px solid #fbcfe8;border-radius:10px;padding:14px;">
          <div style="font-size:10px;font-weight:700;color:#be185d;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">⊕ Doctor's Notes</div>
          <div style="font-size:11px;color:#1e293b;line-height:1.5;">${record.description || appt?.notes || 'Consultation completed successfully.'}</div>
        </div>
      </div>

      ${record.findings ? `
      <div style="margin-bottom:20px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;">
        <div style="font-size:10px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">⊕ Clinical Findings</div>
        <div style="font-size:12px;line-height:1.6;">${record.findings}</div>
      </div>` : ''}

      <!-- Prescription Table -->
      ${medications.length > 0 ? `
      <div style="margin-bottom:20px;">
        <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
          <span style="color:#0d9488;">℞</span> TREATMENT PLAN / PRESCRIPTION
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
          <thead>
            <tr style="background:linear-gradient(90deg,#0f4c75,#0d9488);color:white;">
              <th style="padding:9px 10px;text-align:left;width:30px;">#</th>
              <th style="padding:9px 10px;text-align:left;">Medication</th>
              <th style="padding:9px 10px;text-align:left;">Dosage</th>
              <th style="padding:9px 10px;text-align:left;">Frequency</th>
              <th style="padding:9px 10px;text-align:left;">Duration</th>
            </tr>
          </thead>
          <tbody>${medsRows}</tbody>
        </table>
        ${rx?.notes || record.notes ? `<div style="margin-top:8px;padding:8px 12px;background:#f0fdfa;border-radius:6px;font-size:10px;color:#0d9488;"><strong>Rx Notes:</strong> ${rx?.notes || record.notes}</div>` : ''}
      </div>` : `
      <div style="margin-bottom:20px;padding:14px;background:#fef9c3;border:1px solid #fde68a;border-radius:8px;font-size:11px;color:#92400e;">No prescription was issued for this consultation.</div>`}
    </div>

    <!-- Signature & Footer -->
    <div style="border-top:2px solid #e2e8f0;padding:16px 30px;margin-top:auto;">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;">
        <!-- Signature -->
        <div style="text-align:center;">
          <div style="font-size:8px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Doctor's Digital Signature</div>
          <div style="font-family:'Brush Script MT',cursive;font-size:26px;color:#0f4c75;margin-bottom:2px;">Dr. ${doctorName}</div>
          <div style="width:160px;border-top:1px solid #94a3b8;padding-top:4px;font-size:9px;color:#64748b;">Dr. ${doctorName}<br>MediCloud Healthcare</div>
        </div>
        <!-- Seal -->
        <div style="text-align:center;">
          <div style="width:70px;height:70px;border:3px solid #0d9488;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto;">
            <div style="text-align:center;">
              <div style="font-size:7px;font-weight:800;color:#0d9488;letter-spacing:1px;">VERIFIED</div>
              <div style="font-size:14px;font-weight:900;color:#0f4c75;">M+</div>
              <div style="font-size:6px;color:#0d9488;">DIGITAL</div>
            </div>
          </div>
          <div style="font-size:7px;color:#94a3b8;margin-top:4px;">Seal / Stamp</div>
        </div>
        <!-- Message -->
        <div style="max-width:180px;text-align:right;">
          <div style="font-size:18px;color:#0d9488;font-weight:300;line-height:1;">"</div>
          <div style="font-size:9px;color:#64748b;font-style:italic;line-height:1.4;">Wishing you a speedy recovery and good health. Take care!</div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div style="background:#0f4c75;color:white;padding:8px 30px;font-size:8px;display:flex;justify-content:space-between;opacity:0.9;">
      <span>This is a digitally signed and verified document from MediCloud Healthcare Systems.</span>
      <span>© ${new Date().getFullYear()} MediCloud</span>
    </div>
  </div>
</div>`;

  const el = document.createElement('div');
  el.innerHTML = html;

  html2pdf().set({
    margin: 0,
    filename: `MediCloud_Report_${patientName.replace(/\s+/g,'_')}_${consultDate.toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, width: 794 },
    jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }
  }).from(el).save();
};

generateReport.prescription = (p) => generateReport(p);

export default generateReport;
