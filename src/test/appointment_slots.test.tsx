import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { TimeSlot } from "@/components/common/TimeSlot";
import {
  AppointmentsProvider,
  useAppointments,
  normalizeTime,
} from "@/context/AppointmentsContext";
import { AppointmentPage } from "@/pages/AppointmentPage";

describe("TimeSlot Component", () => {
  it("renders an available slot with clickable button and Available label", () => {
    const handleSelect = vi.fn();
    render(
      <TimeSlot
        time="09:00 AM"
        isBooked={false}
        isSelected={false}
        onSelect={handleSelect}
      />
    );

    const button = screen.getByRole("button", { name: /09:00 AM Available/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(screen.getByText("Available")).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleSelect).toHaveBeenCalledWith("09:00 AM");
  });

  it("renders a selected slot with Selected label and aria-pressed true", () => {
    const handleSelect = vi.fn();
    render(
      <TimeSlot
        time="10:00 AM"
        isBooked={false}
        isSelected={true}
        onSelect={handleSelect}
      />
    );

    const button = screen.getByRole("button", { name: /10:00 AM Selected/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Selected")).toBeInTheDocument();
  });

  it("renders a booked slot as disabled with Booked badge and prevents click", () => {
    const handleSelect = vi.fn();
    render(
      <TimeSlot
        time="09:30 AM"
        isBooked={true}
        isSelected={false}
        onSelect={handleSelect}
      />
    );

    const button = screen.getByRole("button", { name: /09:30 AM Booked/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(screen.getByText("Booked")).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleSelect).not.toHaveBeenCalled();
  });
});

describe("Real Slot Availability Logic (20 September 2026 requirement)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Test component to consume context helpers
  const TestConsumer = ({ onReady }: { onReady: (ctx: ReturnType<typeof useAppointments>) => void }) => {
    const ctx = useAppointments();
    React.useEffect(() => {
      onReady(ctx);
    }, [ctx, onReady]);
    return null;
  };

  it("normalizes time formats consistently (9:00 AM vs 09:00 AM)", () => {
    expect(normalizeTime("9:00 AM")).toBe("09:00 AM");
    expect(normalizeTime("09:00 AM")).toBe("09:00 AM");
    expect(normalizeTime("2:30 PM")).toBe("02:30 PM");
    expect(normalizeTime("02:30 PM")).toBe("02:30 PM");
  });

  it("evaluates 20 September 2026 slots exactly as required: 09:00 AM available, 09:30 AM booked, 10:00 AM available, 10:30 AM booked", () => {
    let capturedCtx!: ReturnType<typeof useAppointments>;

    render(
      <AppointmentsProvider>
        <TestConsumer onReady={(ctx) => (capturedCtx = ctx)} />
      </AppointmentsProvider>
    );

    expect(capturedCtx.isSlotBooked("2026-09-20", "09:00 AM")).toBe(false);
    expect(capturedCtx.isSlotBooked("2026-09-20", "09:30 AM")).toBe(true);
    expect(capturedCtx.isSlotBooked("2026-09-20", "10:00 AM")).toBe(false);
    expect(capturedCtx.isSlotBooked("2026-09-20", "10:30 AM")).toBe(true);
  });

  it("updates availability immediately after booking an appointment", () => {
    let capturedCtx!: ReturnType<typeof useAppointments>;

    render(
      <AppointmentsProvider>
        <TestConsumer onReady={(ctx) => (capturedCtx = ctx)} />
      </AppointmentsProvider>
    );

    // Initial check: 10:00 AM is available
    expect(capturedCtx.isSlotBooked("2026-09-20", "10:00 AM")).toBe(false);

    // Book 10:00 AM
    act(() => {
      capturedCtx.addAppointment({
        patient_name: "Test Patient",
        patient_id: 99,
        doctor_name: "Dr. Deepa Koduri",
        appointment_date: "2026-09-20",
        appointment_time: "10:00 AM",
        status: "confirmed",
        treatment: "Teeth Cleaning",
        appointment_type: "in-person",
      });
    });

    // Now 10:00 AM must be booked
    expect(capturedCtx.isSlotBooked("2026-09-20", "10:00 AM")).toBe(true);
  });

  it("restores slot availability when an appointment is cancelled", () => {
    let capturedCtx!: ReturnType<typeof useAppointments>;

    render(
      <AppointmentsProvider>
        <TestConsumer onReady={(ctx) => (capturedCtx = ctx)} />
      </AppointmentsProvider>
    );

    // 09:30 AM is initially booked by demo appointment id 30
    expect(capturedCtx.isSlotBooked("2026-09-20", "09:30 AM")).toBe(true);

    const appt = capturedCtx.appointments.find(
      (a) => a.appointment_date === "2026-09-20" && a.appointment_time === "09:30 AM"
    );
    expect(appt).toBeDefined();

    // Cancel the appointment
    act(() => {
      capturedCtx.cancelAppointment(appt!.id);
    });

    // 09:30 AM should now be available again!
    expect(capturedCtx.isSlotBooked("2026-09-20", "09:30 AM")).toBe(false);
  });

  it("updates both slots when an appointment is rescheduled", () => {
    let capturedCtx!: ReturnType<typeof useAppointments>;

    render(
      <AppointmentsProvider>
        <TestConsumer onReady={(ctx) => (capturedCtx = ctx)} />
      </AppointmentsProvider>
    );

    const appt = capturedCtx.appointments.find(
      (a) => a.appointment_date === "2026-09-20" && a.appointment_time === "09:30 AM"
    );
    expect(appt).toBeDefined();

    // Reschedule from 09:30 AM to 03:00 PM
    act(() => {
      capturedCtx.rescheduleAppointment(appt!.id, "2026-09-20", "03:00 PM");
    });

    // Previous slot is now available
    expect(capturedCtx.isSlotBooked("2026-09-20", "09:30 AM")).toBe(false);
    // New slot is now booked
    expect(capturedCtx.isSlotBooked("2026-09-20", "03:00 PM")).toBe(true);
  });
});

describe("AppointmentPage Step 4 Slot UI", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("authToken", "demo_token");
    localStorage.setItem("userRole", "patient");
    localStorage.setItem("username", "Sarah Johnson");
  });

  it("disables booked slots and allows selecting available slots", () => {
    render(
      <MemoryRouter initialEntries={["/appointment"]}>
        <AppointmentsProvider>
          <AppointmentPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Step 1 -> Next (In-Clinic default)
    const nextToReason = screen.getByRole("button", { name: /Next: Reason for Visit/i });
    fireEvent.click(nextToReason);

    // Step 2 -> Next (General Dental default selected)
    const nextToDate = screen.getByRole("button", { name: /Next: Select Date/i });
    fireEvent.click(nextToDate);

    // Step 3 -> Select "20 Sep 2026"
    const quick20Sep = screen.getByRole("button", { name: /20 Sep 2026/i });
    fireEvent.click(quick20Sep);

    const nextToTime = screen.getByRole("button", { name: /Next: Select Time/i });
    fireEvent.click(nextToTime);

    // Step 4: Verify slots on 20 Sep 2026
    const slot0900 = screen.getByTestId("time-slot-09-00-AM");
    const slot0930 = screen.getByTestId("time-slot-09-30-AM");
    const slot1000 = screen.getByTestId("time-slot-10-00-AM");
    const slot1030 = screen.getByTestId("time-slot-10-30-AM");

    // 09:00 AM is available and clickable
    expect(slot0900).not.toBeDisabled();
    expect(slot0900).toHaveAttribute("data-slot-status", "available");

    // 09:30 AM is booked and disabled
    expect(slot0930).toBeDisabled();
    expect(slot0930).toHaveAttribute("data-slot-status", "booked");

    // 10:00 AM is available and clickable
    expect(slot1000).not.toBeDisabled();
    expect(slot1000).toHaveAttribute("data-slot-status", "available");

    // 10:30 AM is booked and disabled
    expect(slot1030).toBeDisabled();
    expect(slot1030).toHaveAttribute("data-slot-status", "booked");

    // Clicking booked slot does NOT select it
    fireEvent.click(slot0930);
    expect(slot0930).toHaveAttribute("data-slot-status", "booked");

    // Clicking available slot selects it
    fireEvent.click(slot0900);
    expect(slot0900).toHaveAttribute("data-slot-status", "selected");
  });
});
