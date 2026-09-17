import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ContactSection } from "@/components/common/ContactSection";
import { EmergencyInfoModal } from "@/components/common/EmergencyInfoModal";

describe("ContactSection Component", () => {
  it("renders verified hospital contact information accurately", () => {
    render(<ContactSection />);

    // Address verification
    expect(screen.getAllByText(/123 Healthcare Boulevard/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Central Mumbai, PIN 400001/i)).toBeTruthy();

    // Phone verification
    expect(screen.getAllByText(/\+91 90635 84448/i).length).toBeGreaterThan(0);

    // Working hours verification
    expect(screen.getByText(/Mon – Sat: 8:00 AM – 8:00 PM/i)).toBeTruthy();
    expect(screen.getByText(/Open 24 Hours \/ 7 Days/i)).toBeTruthy();

    // Email verification
    expect(screen.getByText(/info@carepulsehealth.com/i)).toBeTruthy();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<ContactSection />);

    const submitBtn = screen.getByRole("button", { name: /Send Hospital Inquiry/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Full name is required/i)).toBeTruthy();
    expect(await screen.findByText(/Email address is required/i)).toBeTruthy();
    expect(await screen.findByText(/Please select an inquiry category or department/i)).toBeTruthy();
    expect(await screen.findByText(/Subject is required/i)).toBeTruthy();
    expect(await screen.findByText(/Message content is required/i)).toBeTruthy();
  });

  it("validates email format correctly", async () => {
    render(<ContactSection />);

    const emailInput = screen.getByPlaceholderText(/rahul@example.com/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email-string" } });
    fireEvent.blur(emailInput);

    expect(await screen.findByText(/Please enter a valid email address/i)).toBeTruthy();
  });
});

describe("EmergencyInfoModal Component", () => {
  it("renders triage information and direct call link", () => {
    const handleClose = vi.fn();
    render(<EmergencyInfoModal open={true} onOpenChange={handleClose} />);

    expect(screen.getByText(/Emergency & Urgent Care Guidance/i)).toBeTruthy();
    expect(screen.getByText(/Level 1: Critical/i)).toBeTruthy();
    expect(screen.getByText(/Level 2: Emergent/i)).toBeTruthy();
    expect(screen.getByText(/Level 3: Urgent/i)).toBeTruthy();
    expect(screen.getByText(/\+91 90635 84448/i)).toBeTruthy();
  });
});
