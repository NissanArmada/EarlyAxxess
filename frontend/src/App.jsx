import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PatientDashboard from "./pages/PatientDashboard";
import Summary from "./pages/Summary";
import Recording from "./pages/Recording";
import DoctorDashboard from "./pages/DoctorDashboard";

const client = new QueryClient(); 

function App() {
  return (
    <>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <Routes>
            <Route path="/patient_dashboard" element={<PatientDashboard />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/recording" element={<Recording />} />
            <Route path="/doctor_dashboard" element={<DoctorDashboard />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  )
}

export default App
