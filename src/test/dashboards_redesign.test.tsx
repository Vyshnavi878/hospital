import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PatientDashboard from "@/components/patient/PatientDashboard";
import DoctorDashboard from "@/components/doctor/DoctorDashboard";
import { AppointmentsProvider } from "@/context/AppointmentsContext";

describe("TRUDENT Patient Dashboard Redesign", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("authToken", "test_patient_token");
    localStorage.setItem("userRole", "patient");
    localStorage.setItem("username", "Sarah Johnson");
    localStorage.setItem("userId", "1");
  });

  it("renders patient sidebar with TRUDENT logo, MAIN and HEALTH groups, and profile/logout controls", () => {
    render(
      <MemoryRouter>
        <AppointmentsProvider>
          <PatientDashboard />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Official branding
    expect(screen.getAllByText(/TRUDENT/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Patient Portal/i).length).toBeGreaterThan(0);

    // MAIN navigation group
    expect(screen.getByText("MAIN")).toBeInTheDocument();
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Book Appointment").length).toBeGreaterThan(0);
    expect(screen.getAllByText("My Appointments").length).toBeGreaterThan(0);

    // HEALTH navigation group
    expect(screen.getByText("HEALTH")).toBeInTheDocument();
    expect(screen.getAllByText("Medical Documents").length).toBeGreaterThan(0);
    expect(screen.getAllByText("My Profile").length).toBeGreaterThan(0);

    // Bottom profile and logout
    expect(screen.getAllByText(/Logout/i).length).toBeGreaterThan(0);
  });

  it("renders top header, dynamic greeting for Sarah Johnson, and 4 quick stat cards without fake care plans", () => {
    render(
      <MemoryRouter>
        <AppointmentsProvider>
          <PatientDashboard />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Dynamic greeting
    expect(screen.getByText(/Sarah Johnson 👋/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome to your TRUDENT patient portal. Manage your appointments, prescriptions, and clinical records./i)
    ).toBeInTheDocument();

    // 4 quick stat cards
    expect(screen.getByText("Upcoming Appointments")).toBeInTheDocument();
    expect(screen.getByText("Total Appointments")).toBeInTheDocument();
    expect(screen.getAllByText("Medical Documents").length).toBeGreaterThan(0);
    expect(screen.getByText("Next Appointment")).toBeInTheDocument();

    // Ensure no generic "Care Plan Status" card exists
    expect(screen.queryByText("Care Plan Status")).toBeNull();
  });

  it("renders prominent Upcoming Appointment with Dr. Deepa Koduri, Endodontist, and directions for in-clinic", () => {
    render(
      <MemoryRouter>
        <AppointmentsProvider>
          <PatientDashboard />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Doctor details on prominent card
    expect(screen.getAllByText("Dr. Deepa Koduri").length).toBeGreaterThan(0);
    expect(screen.getByText("Endodontist · Root Canal Specialist")).toBeInTheDocument();

    // In-Clinic hospital directions
    expect(screen.getByText("TRUDENT Multispeciality Dental Hospital")).toBeInTheDocument();
    expect(screen.getByText("Get Directions")).toBeInTheDocument();

    // Prominent actions
    expect(screen.getAllByText("View Details").length).toBeGreaterThan(0);
    expect(screen.getByText("Reschedule")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("renders recent appointments, recent documents, and quick actions", () => {
    render(
      <MemoryRouter>
        <AppointmentsProvider>
          <PatientDashboard />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Recent Appointments section
    expect(screen.getByText("Recent Appointments")).toBeInTheDocument();

    // Recent Documents section
    expect(screen.getByText("Recent Documents")).toBeInTheDocument();

    // Patient Quick Actions
    expect(screen.getByText("TRUDENT Patient Quick Actions")).toBeInTheDocument();
    expect(screen.getByText("View Documents")).toBeInTheDocument();
  });
});

describe("TRUDENT Doctor Dashboard Redesign", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("authToken", "test_doctor_token");
    localStorage.setItem("userRole", "doctor");
    localStorage.setItem("username", "Dr. Deepa Koduri");
    localStorage.setItem("userId", "103");
  });

  it("renders doctor sidebar with TRUDENT logo, Doctor Portal, MAIN items, and Dr. Deepa Koduri profile footer", () => {
    render(
      <MemoryRouter>
        <AppointmentsProvider>
          <DoctorDashboard />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Sidebar branding
    expect(screen.getAllByText(/TRUDENT/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Doctor Portal/i).length).toBeGreaterThan(0);

    // MAIN nav items
    expect(screen.getByText("MAIN")).toBeInTheDocument();
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Appointment Management").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Prescriptions").length).toBeGreaterThan(0);
    expect(screen.getAllByText("My Profile").length).toBeGreaterThan(0);

    // Profile footer
    expect(screen.getAllByText("Dr. Deepa Koduri").length).toBeGreaterThan(0);

    // Confirm no doctor registration
    expect(screen.queryByText(/Register as Doctor/i)).toBeNull();
    expect(screen.queryByText(/Doctor Registration/i)).toBeNull();
  });

  it("renders welcome header for Dr. Deepa Koduri and 4 meaningful stat cards", () => {
    render(
      <MemoryRouter>
        <AppointmentsProvider>
          <DoctorDashboard />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Welcome
    expect(screen.getByText(/Welcome, Dr. Deepa Koduri 👋/i)).toBeInTheDocument();
    expect(screen.getByText(/Here’s your schedule and patient activity for today./i)).toBeInTheDocument();

    // 4 quick stat cards
    expect(screen.getByText("Today's Appointments")).toBeInTheDocument();
    expect(screen.getByText("Pending Appointments")).toBeInTheDocument();
    expect(screen.getByText("Completed Today")).toBeInTheDocument();
    expect(screen.getAllByText("Upcoming Appointments").length).toBeGreaterThan(0);
  });

  it("renders Today's Schedule as the primary section with chronological appointments and clinical actions", () => {
    render(
      <MemoryRouter>
        <AppointmentsProvider>
          <DoctorDashboard />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Primary section heading
    expect(screen.getByText("Today's Schedule")).toBeInTheDocument();

    // Sarah Johnson appointment for today at 09:00 AM
    expect(screen.getAllByText("Sarah Johnson").length).toBeGreaterThan(0);
    expect(screen.getAllByText("09:00 AM").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Root Canal Consultation").length).toBeGreaterThan(0);

    // Actions
    expect(screen.getAllByText("View Patient").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Write Rx").length).toBeGreaterThan(0);

    // Quick Actions bar
    expect(screen.getByText("Clinical Management Actions")).toBeInTheDocument();
  });

  it("opens patient record modal with demographic details without exposing passwords", () => {
    render(
      <MemoryRouter>
        <AppointmentsProvider>
          <DoctorDashboard />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Click View Patient on Sarah Johnson's appointment (09:00 AM is first)
    const viewButtons = screen.getAllByText("View Patient");
    fireEvent.click(viewButtons[0]);

    // Modal opens
    expect(screen.getByText("Clinical Patient Record")).toBeInTheDocument();
    expect(screen.getByText(/Patient ID: #PAT-/i)).toBeInTheDocument();
    expect(screen.getAllByText(/32 yrs · Female/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\+91 98480 22338/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/sarah\.j@gmail\.com/i)).toBeInTheDocument();

    // Ensure password is never exposed
    expect(screen.queryByText(/password/i)).toBeNull();
  });
});
