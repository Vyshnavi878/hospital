import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppointmentsProvider } from "@/context/AppointmentsContext";
import LandingPage from "@/pages/LandingPage";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AppointmentsProvider>{ui}</AppointmentsProvider>
    </BrowserRouter>
  );
};

describe("Featured Doctors, Patient Reviews & Footer on LandingPage", () => {
  it("renders Featured Doctors section with limited doctors and View All Doctors CTA", () => {
    renderWithProviders(<LandingPage />);

    // Check Featured Doctors heading
    const featuredHeading = screen.getByRole("heading", { name: /^Featured Doctors$/i });
    expect(featuredHeading).toBeTruthy();

    // Check View All Doctors CTA
    const viewAllBtn = document.getElementById("featured-view-all-cta");
    expect(viewAllBtn).toBeTruthy();
    expect(viewAllBtn?.textContent).toContain("View All Doctors");
  });

  it("renders Patient Reviews demo feedback cleanly with demo disclaimer", () => {
    renderWithProviders(<LandingPage />);

    // Check heading
    expect(screen.getByRole("heading", { name: /^Patient Experiences$/i })).toBeTruthy();

    // Check demo disclaimer
    expect(screen.getByText(/represent demonstration data for platform evaluation/i)).toBeTruthy();

    // Check testimonials
    expect(screen.getByText(/Rajesh Malhotra/i)).toBeTruthy();
    expect(screen.getByText(/Dr. James Wilson on CarePulse was straightforward/i)).toBeTruthy();
  });

  it("renders professional hospital footer with all required links and functional legal modals", async () => {
    renderWithProviders(<LandingPage />);

    const footer = screen.getByRole("contentinfo");
    const footerWithin = within(footer);

    // Quick links in footer
    const quickLinksHeading = footerWithin.getByRole("heading", { name: /^Quick Links$/i });
    expect(quickLinksHeading).toBeTruthy();

    // Patient portal section in footer
    expect(footerWithin.getByRole("heading", { name: /^Patient$/i })).toBeTruthy();
    expect(footerWithin.getByRole("button", { name: /^Book Appointment$/i })).toBeTruthy();
    expect(footerWithin.getByRole("link", { name: /^Sign In$/i })).toBeTruthy();

    // Emergency section in footer
    expect(footerWithin.getByRole("heading", { name: /^Emergency$/i })).toBeTruthy();
    expect(footerWithin.getByRole("button", { name: /^Emergency Information$/i })).toBeTruthy();
    expect(footerWithin.getByRole("link", { name: /^Hospital Contact$/i })).toBeTruthy();

    // Legal section in footer
    expect(footerWithin.getByRole("heading", { name: /^Legal$/i })).toBeTruthy();
    const privacyBtn = footerWithin.getByRole("button", { name: /^Privacy Policy$/i });
    const termsBtn = footerWithin.getByRole("button", { name: /^Terms$/i });
    expect(privacyBtn).toBeTruthy();
    expect(termsBtn).toBeTruthy();

    // Click Privacy Policy and verify modal opens without broken links
    fireEvent.click(privacyBtn);
    expect(await screen.findByRole("heading", { name: /Patient Privacy Policy/i })).toBeTruthy();
    expect(screen.getByText(/Health Record Confidentiality/i)).toBeTruthy();

    // Close privacy modal
    const closeBtns = screen.getAllByRole("button", { name: /^Close$/i });
    fireEvent.click(closeBtns[0]);

    // Click Terms and verify terms modal opens
    fireEvent.click(termsBtn);
    expect(await screen.findByRole("heading", { name: /Terms of Service & Booking/i })).toBeTruthy();
    expect(screen.getByText(/Appointment Scheduling & Tokens/i)).toBeTruthy();
  }, 15000);
});
