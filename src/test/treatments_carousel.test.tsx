import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { AppointmentsProvider } from "@/context/AppointmentsContext";
import TreatmentsPage from "@/pages/TreatmentsPage";

describe("Treatments Page Horizontal Carousel / Slider", () => {
  beforeEach(() => {
    // Reset window width to standard desktop
    window.innerWidth = 1280;
  });

  it("keeps the existing 'Dental Treatments & Services' heading and section content", () => {
    render(
      <MemoryRouter initialEntries={["/treatments"]}>
        <AppointmentsProvider>
          <TreatmentsPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Dental Treatments & Services" })).toBeInTheDocument();
    expect(
      screen.getByText(/TRUDENT Multispeciality Dental Hospital provides comprehensive dental care/i)
    ).toBeInTheDocument();
  });

  it("renders a horizontal carousel with left and right navigation arrows and proper aria-labels", () => {
    render(
      <MemoryRouter initialEntries={["/treatments"]}>
        <AppointmentsProvider>
          <TreatmentsPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    const prevBtn = screen.getByRole("button", { name: "Previous treatments" });
    const nextBtn = screen.getByRole("button", { name: "Next treatments" });

    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();

    // At the beginning, left arrow is disabled
    expect(prevBtn).toBeDisabled();
    // Right arrow is enabled
    expect(nextBtn).not.toBeDisabled();
  });

  it("clicking next arrow advances the carousel horizontally and enables previous arrow", () => {
    render(
      <MemoryRouter initialEntries={["/treatments"]}>
        <AppointmentsProvider>
          <TreatmentsPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    const prevBtn = screen.getByRole("button", { name: "Previous treatments" });
    const nextBtn = screen.getByRole("button", { name: "Next treatments" });

    expect(prevBtn).toBeDisabled();

    // Click Next
    fireEvent.click(nextBtn);

    // After moving, previous arrow is now enabled
    expect(prevBtn).not.toBeDisabled();

    // Click Previous returns to start
    fireEvent.click(prevBtn);
    expect(prevBtn).toBeDisabled();
  });

  it("preserves all 8 existing treatment cards with their designs, texts, badges, and action buttons", () => {
    render(
      <MemoryRouter initialEntries={["/treatments"]}>
        <AppointmentsProvider>
          <TreatmentsPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // All 8 procedures are in the carousel
    expect(screen.getAllByText("Dental Implants").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Clear Aligners & Orthodontics").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Root Canal Treatment").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cosmetic Dentistry & Veneers").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Preventive & Pediatric Dentistry").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Periodontal Care & Gum Health").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Oral Surgery & Wisdom Tooth Care").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Professional Teeth Whitening").length).toBeGreaterThan(0);

    // View Details buttons remain accessible
    const viewDetailLinks = screen.getAllByRole("link", { name: /View Details/i });
    expect(viewDetailLinks.length).toBe(8);

    // Book Appointment buttons remain accessible
    const bookLinks = screen.getAllByRole("link", { name: /Book Appointment/i });
    expect(bookLinks.length).toBeGreaterThanOrEqual(8);
  });

  it("resets carousel index to 0 when category filter is selected without broken slides", () => {
    render(
      <MemoryRouter initialEntries={["/treatments"]}>
        <AppointmentsProvider>
          <TreatmentsPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    const nextBtn = screen.getByRole("button", { name: "Next treatments" });
    fireEvent.click(nextBtn);

    // Select a category with 1 procedure (e.g., Dental Implants)
    const implantCategoryPill = screen.getByRole("button", { name: /^Dental Implants$/i });
    fireEvent.click(implantCategoryPill);

    const prevBtn = screen.getByRole("button", { name: "Previous treatments" });
    expect(prevBtn).toBeDisabled();
  });

  it("supports keyboard arrow navigation on the carousel region", () => {
    render(
      <MemoryRouter initialEntries={["/treatments"]}>
        <AppointmentsProvider>
          <TreatmentsPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    const carouselRegion = screen.getByRole("region", {
      name: "Dental Treatments and Services Carousel",
    });
    const prevBtn = screen.getByRole("button", { name: "Previous treatments" });

    expect(prevBtn).toBeDisabled();

    // Press ArrowRight
    fireEvent.keyDown(carouselRegion, { key: "ArrowRight" });
    expect(prevBtn).not.toBeDisabled();

    // Press ArrowLeft
    fireEvent.keyDown(carouselRegion, { key: "ArrowLeft" });
    expect(prevBtn).toBeDisabled();
  });
});
