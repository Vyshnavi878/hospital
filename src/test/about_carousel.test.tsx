import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AboutPage } from "../pages/AboutPage";
import { AppointmentsProvider } from "../context/AppointmentsContext";

describe("About Page 'Why Patients Choose TRUDENT' Horizontal Carousel", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderAboutPage = () => {
    return render(
      <MemoryRouter initialEntries={["/about"]}>
        <AppointmentsProvider>
          <AboutPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );
  };

  it("keeps the existing 'Why Patients Choose TRUDENT' heading and supporting text unchanged", () => {
    renderAboutPage();

    expect(screen.getByRole("heading", { name: /Why Patients Choose TRUDENT/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Verified clinical standards, hygienic facilities, and sincere patient care that you can count on\./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/AUTHENTIC STANDARDS/i)).toBeInTheDocument();
  });

  it("renders a horizontal carousel with left and right navigation arrows and exact required aria-labels", () => {
    renderAboutPage();

    const prevBtn = screen.getByRole("button", {
      name: "Previous reasons patients choose TRUDENT",
    });
    const nextBtn = screen.getByRole("button", {
      name: "Next reasons patients choose TRUDENT",
    });

    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();

    // At index 0, previous button is disabled
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();
  });

  it("preserves ALL 6 existing cards with their original titles and descriptions", () => {
    renderAboutPage();

    const reasons = [
      {
        title: "Multispeciality Care Under One Roof",
        snippet: /Access a full spectrum of dental treatments/i,
      },
      {
        title: "Dedicated Doctor Attention",
        snippet: /Patients receive direct, uninterrupted consultations/i,
      },
      {
        title: "Hospital-Grade Sterilization",
        snippet: /We adhere strictly to hospital autoclave sterilization protocols/i,
      },
      {
        title: "Transparent Treatment Plans",
        snippet: /You will always receive clear diagnostic explanations and written fee breakdowns/i,
      },
      {
        title: "Modern Clinical Equipment",
        snippet: /Our operatories are equipped with contemporary digital imaging/i,
      },
      {
        title: "Convenient Central Location",
        snippet: /Located at 1st Floor, Avani Plaza, Ramayya Street/i,
      },
    ];

    reasons.forEach(({ title, snippet }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(snippet)).toBeInTheDocument();
    });
  });

  it("clicking next arrow advances the carousel horizontally and enables previous arrow", () => {
    renderAboutPage();

    const prevBtn = screen.getByRole("button", {
      name: "Previous reasons patients choose TRUDENT",
    });
    const nextBtn = screen.getByRole("button", {
      name: "Next reasons patients choose TRUDENT",
    });

    // Initially at start
    expect(prevBtn).toBeDisabled();

    // Advance 1 step
    fireEvent.click(nextBtn);
    expect(prevBtn).not.toBeDisabled();

    // Go back 1 step
    fireEvent.click(prevBtn);
    expect(prevBtn).toBeDisabled();
  });

  it("supports keyboard arrow navigation on the carousel region", () => {
    renderAboutPage();

    const carouselRegion = screen.getByRole("region", {
      name: "Why Patients Choose TRUDENT Carousel",
    });
    const prevBtn = screen.getByRole("button", {
      name: "Previous reasons patients choose TRUDENT",
    });

    expect(prevBtn).toBeDisabled();

    // Press ArrowRight to move forward
    fireEvent.keyDown(carouselRegion, { key: "ArrowRight" });
    expect(prevBtn).not.toBeDisabled();

    // Press ArrowLeft to move back
    fireEvent.keyDown(carouselRegion, { key: "ArrowLeft" });
    expect(prevBtn).toBeDisabled();
  });
});
