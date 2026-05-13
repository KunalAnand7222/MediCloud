# Cloud-Native Hospital Management System

A highly scalable, secure, and interoperable medical platform based on the "Cloud-Native Hospital Management and Telemedicine Platform" research paper. This project demonstrates modern enterprise architecture applied to healthcare systems.

## Key Cloud-Native Features Simulated Setup

1. **Edge Processing Layer**: An AWS IoT Greengrass simulation (`/api/v1/telemetry/sync`) handles offline telemetry ingestion from wearable medical devices (glucose sensors, oximeters, etc.).
2. **Serverless Cloud Core Integration**: Mocked through independent architectural controllers and event-based handlers representing decoupled serverless functions.
3. **FHIR & HL7 APIs**: Standardized APIs (`/api/v1/fhir/Patient` and `/api/v1/fhir/Encounter`) to allow seamless data interoperability with insurance providers and laboratories.
4. **Blockchain Data Integrity**: Simulated hybrid security model via chained SHA-256 hashes ensuring Internet of Medical Things (IoMT) data remains untampered in transit and storage.
5. **Amazon Chime Video SDK (UI/UX Mock)**: Enterprise-grade teleconsultation interface featuring secure E2E-styled real-time video chat.

## Running the Application Locally

The frontend relies on Vite (React) and the backend utilizes Express with MongoDB.
Both servers have been integrated with real-time WebSocket tracing for the **Developer Dashboard**.

### Requirements
- Node.js (v16+)
- MongoDB running locally or on Atlas.

### Start the Backend
```bash
cd backend
npm install
npm run dev
```

### Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

## Developer Dashboard

To view the real-time architectural events:
1. Run both servers.
2. Navigate to `http://localhost:5173/developer` in your web browser.
3. Use the application on another device or tab to trigger API logs or telemetry syncing. Watch the real-time trace in action.
