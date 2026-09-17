import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AppointmentsProvider } from "@/context/AppointmentsContext";
import { AppointmentPage } from "@/pages/AppointmentPage";
import Login from "@/components/Login";
import Register from "@/components/Register";
import DoctorAppointmentsTab from "@/components/doctor/DoctorAppointmentsTab";

describe("TRUDENT Unified Authentication and Appointment Booking Flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows 'Are you already a TRUDENT patient?' with 'Yes, Sign In' and 'I'm a New Patient' on /appointment when unauthenticated", () => {
    render(
      <MemoryRouter initialEntries={["/appointment"]}>
        <AppointmentsProvider>
          <AppointmentPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Are you already a TRUDENT patient\?/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Yes, Sign In/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /I'm a New Patient/i })).toBeInTheDocument();
  });

  it("authenticates existing patient and continues directly to appointment booking without redirecting to dashboard", async () => {
    render(
      <MemoryRouter initialEntries={["/appointment"]}>
        <AppointmentsProvider>
          <AppointmentPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Click [Yes, Sign In]
    fireEvent.click(screen.getByRole("button", { name: /Yes, Sign In/i }));

    expect(screen.getByText("Patient Sign In")).toBeInTheDocument();

    // Enter email & password
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    fireEvent.change(emailInput, { target: { value: "sarah@hospital.com" } });
    fireEvent.change(passwordInput, { target: { value: "secret123" } });

    // Submit inline login
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Sign In & Continue Booking/i }));
      await new Promise((r) => setTimeout(r, 600));
    });

    // Verify patient session established
    expect(localStorage.getItem("authToken")).toBeTruthy();
    expect(localStorage.getItem("userRole")).toBe("patient");

    // Must NOT have redirected out; must be at Step 1 of booking
    expect(screen.getByText(/Step 1: Consultation Type/i)).toBeInTheDocument();
    expect(screen.getByText(/🏥 In-Clinic Consultation/i)).toBeInTheDocument();
    expect(screen.getByText(/💻 Online Consultation/i)).toBeInTheDocument();
  });

  it("registers new patient and continues directly to appointment booking with profile pre-filled", async () => {
    render(
      <MemoryRouter initialEntries={["/appointment?auth=new"]}>
        <AppointmentsProvider>
          <AppointmentPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("New Patient Registration")).toBeInTheDocument();

    // Fill registration form
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "Rohan Gupta" } });
    fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: "29" } });
    fireEvent.click(screen.getByRole("button", { name: "Male" }));
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "9876543210" } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "rohan@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Min 8 chars, 1 number/i), { target: { value: "Password123" } });
    fireEvent.change(screen.getByPlaceholderText(/Repeat password/i), { target: { value: "Password123" } });

    // Submit registration
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Create Account & Continue Booking/i }));
      await new Promise((r) => setTimeout(r, 600));
    });

    // Verify session
    expect(localStorage.getItem("authToken")).toBeTruthy();
    expect(localStorage.getItem("username")).toBe("Rohan Gupta");

    // Must be directly in Step 1
    expect(screen.getByText(/Step 1: Consultation Type/i)).toBeInTheDocument();
  });

  it("standalone /register redirects to /appointment?auth=new", () => {
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/appointment" element={<div data-testid="appointment-page">Appointment Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("appointment-page")).toBeInTheDocument();
  });

  it("direct /login displays Patient and Doctor, with link to Book an Appointment for new patients", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("Patient")).toBeInTheDocument();
    expect(screen.getByText("Doctor")).toBeInTheDocument();
    expect(screen.getByText(/New patient\?/i)).toBeInTheDocument();
    const bookLinks = screen.getAllByRole("link", { name: /Book an Appointment/i });
    const newPatientLink = bookLinks.find((l) => l.getAttribute("href") === "/appointment?auth=new");
    expect(newPatientLink).toBeDefined();
    expect(newPatientLink).toHaveAttribute("href", "/appointment?auth=new");
  });

  it("doctor dashboard displays patient demographics (Age, Gender, Phone, Email)", () => {
    localStorage.setItem("userRole", "doctor");
    localStorage.setItem("username", "Dr. Deepa Koduri");

    render(
      <MemoryRouter>
        <AppointmentsProvider>
          <DoctorAppointmentsTab />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Dr. Deepa Koduri's appointments for today exist in initial state (e.g. Emma Davis, 26 yrs, Female)
    expect(screen.getByText(/Emma Davis/i)).toBeInTheDocument();
    expect(screen.getByText(/26 yrs · Female/i)).toBeInTheDocument();
    expect(screen.getByText(/9876501234/i)).toBeInTheDocument();
  });
});
