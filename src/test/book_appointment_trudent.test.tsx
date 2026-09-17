import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BookAppointmentView from "@/components/patient/BookAppointmentView";
import { AppointmentsProvider } from "@/context/AppointmentsContext";

const renderBookAppointment = (onBooked = () => {}) => {
  return render(
    <MemoryRouter>
      <AppointmentsProvider>
        <BookAppointmentView onBooked={onBooked} />
      </AppointmentsProvider>
    </MemoryRouter>
  );
};

describe("TRUDENT Patient Dashboard - Book Appointment (Single Doctor Setup)", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("authToken", "test_token");
    localStorage.setItem("userRole", "patient");
    localStorage.setItem("username", "Sarah Johnson");
    localStorage.setItem("userId", "1");
    localStorage.setItem("userEmail", "sarah.johnson@example.com");
    localStorage.setItem("userPhone", "+91 98480 22338");
    localStorage.setItem("userAge", "32");
    localStorage.setItem("userGender", "Female");
  });

  it("renders Step 1 with Dr. Deepa Koduri informational card and consultation type cards without generic multi-doctor content", () => {
    renderBookAppointment();

    // Main Heading & Subtitle
    expect(screen.getByRole("heading", { name: /^Book an Appointment$/i })).toBeInTheDocument();
    expect(screen.getByText(/Schedule your dental consultation with Dr\. Deepa Koduri\./i)).toBeInTheDocument();

    // Informational Doctor Profile Card
    expect(screen.getAllByText("Dr. Deepa Koduri").length).toBeGreaterThan(0);
    expect(screen.getByText("Endodontist")).toBeInTheDocument();
    expect(screen.getByText("Root Canal Specialist")).toBeInTheDocument();
    expect(screen.getByText(/Gentle • Stress-free • Evidence-based/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced Technology: Laser Dentistry • Implants • Aligners/i)).toBeInTheDocument();
    expect(screen.getByText("Kakinada")).toBeInTheDocument();
    expect(screen.getByText("+91 9063584448")).toBeInTheDocument();

    // 2 Consultation Options
    expect(screen.getByText("1. In-Clinic Consultation")).toBeInTheDocument();
    expect(screen.getByText(/Visit TRUDENT Multispeciality Dental Hospital/i)).toBeInTheDocument();
    expect(screen.getByText("2. Online Consultation")).toBeInTheDocument();
    expect(screen.getByText(/Secure video consultation with Dr\. Deepa Koduri/i)).toBeInTheDocument();

    // ABSOLUTELY NO generic multi-doctor / multi-specialty content
    expect(screen.queryByText("Select Doctor")).toBeNull();
    expect(screen.queryByText("Choose Doctor")).toBeNull();
    expect(screen.queryByText("All Departments")).toBeNull();
    expect(screen.queryByText("Cardiology")).toBeNull();
    expect(screen.queryByText("Dermatology")).toBeNull();
    expect(screen.queryByText("Orthopedics")).toBeNull();
    expect(screen.queryByText("Neurology")).toBeNull();
    expect(screen.queryByText("Pediatrics")).toBeNull();
    expect(screen.queryByText("Dr. James Wilson")).toBeNull();
    expect(screen.queryByText("Dr. Maria Santos")).toBeNull();
    expect(screen.queryByText("Dr. Robert Chen")).toBeNull();
    expect(screen.queryByText("Dr. Priya Patel")).toBeNull();
    expect(screen.queryByText("Dr. Lisa Park")).toBeNull();
    expect(screen.queryByText("Dr. Ahmed Khan")).toBeNull();
    expect(screen.queryByText("Block A")).toBeNull();
    expect(screen.queryByText("Block B")).toBeNull();
    expect(screen.queryByText("Block C")).toBeNull();
  });

  it("navigates to Step 2 (Treatment & Date) and displays all dental-specific options", () => {
    renderBookAppointment();

    // Click Continue to Treatment & Date
    const continueBtn = screen.getByRole("button", { name: /Continue to Treatment & Date/i });
    fireEvent.click(continueBtn);

    // Step 2 Header
    expect(screen.getByText(/Select Dental Treatment \/ Reason/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Available Date/i)).toBeInTheDocument();

    // Dental treatments
    expect(screen.getByText("Dental Consultation")).toBeInTheDocument();
    expect(screen.getByText("Root Canal Consultation")).toBeInTheDocument();
    expect(screen.getByText("Tooth Pain")).toBeInTheDocument();
    expect(screen.getByText("Dental Cleaning")).toBeInTheDocument();
    expect(screen.getByText("Tooth Sensitivity")).toBeInTheDocument();
    expect(screen.getByText("Dental Examination")).toBeInTheDocument();
    expect(screen.getByText("Implant Consultation")).toBeInTheDocument();
    expect(screen.getByText("Aligners Consultation")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });

  it("navigates through Step 3 (Pick Time) and enforces single-doctor slot locking with disabled Booked badges", () => {
    renderBookAppointment();

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole("button", { name: /Continue to Treatment & Date/i }));

    // Select Treatment
    fireEvent.click(screen.getByText("Root Canal Consultation"));

    // Select Date (find first clickable calendar day button)
    const dayButtons = screen.getAllByRole("button").filter((b) => {
      const cls = b.className || "";
      const text = b.textContent?.trim() || "";
      return !b.hasAttribute("disabled") && /^[1-9][0-9]?$/.test(text);
    });
    expect(dayButtons.length).toBeGreaterThan(0);
    fireEvent.click(dayButtons[0]);

    // Step 2 -> Step 3
    const continueToTimeBtn = screen.getByRole("button", { name: /Continue to Pick Time/i });
    expect(continueToTimeBtn).not.toBeDisabled();
    fireEvent.click(continueToTimeBtn);

    // Step 3 Header
    expect(screen.getByText(/Select Appointment Time Slot/i)).toBeInTheDocument();
    expect(screen.getByText(/Morning Sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/Afternoon Sessions/i)).toBeInTheDocument();

    // Single doctor notice
    expect(screen.getByText(/TRUDENT operates with dedicated single-doctor availability/i)).toBeInTheDocument();

    // Check that booked slots display "Booked" and are disabled
    const bookedButtons = screen.getAllByRole("button").filter((b) => {
      return b.textContent?.includes("Booked");
    });

    bookedButtons.forEach((b) => {
      expect(b).toBeDisabled();
    });

    // Pick an available slot
    const availableSlots = screen.getAllByRole("button").filter((b) => {
      return b.textContent?.includes("Available") && !b.hasAttribute("disabled");
    });

    expect(availableSlots.length).toBeGreaterThan(0);
    fireEvent.click(availableSlots[0]);

    // Continue to Patient Details is now enabled
    const continueToDetailsBtn = screen.getByRole("button", { name: /Continue to Patient Details/i });
    expect(continueToDetailsBtn).not.toBeDisabled();
  });

  it("navigates to Step 4 (Patient Details), populates profile data, and NEVER displays password fields", () => {
    renderBookAppointment();

    // Navigate to Step 2
    fireEvent.click(screen.getByRole("button", { name: /Continue to Treatment & Date/i }));

    // Pick Date
    const dayButtons = screen.getAllByRole("button").filter((b) => {
      const text = b.textContent?.trim() || "";
      return !b.hasAttribute("disabled") && /^[1-9][0-9]?$/.test(text);
    });
    fireEvent.click(dayButtons[0]);

    // Navigate to Step 3
    fireEvent.click(screen.getByRole("button", { name: /Continue to Pick Time/i }));

    // Pick Time
    const availableSlots = screen.getAllByRole("button").filter((b) => {
      return b.textContent?.includes("Available") && !b.hasAttribute("disabled");
    });
    fireEvent.click(availableSlots[0]);

    // Navigate to Step 4
    fireEvent.click(screen.getByRole("button", { name: /Continue to Patient Details/i }));

    // Step 4 Header & Pre-filled details
    expect(screen.getByText(/Patient Information/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sarah Johnson")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+91 98480 22338")).toBeInTheDocument();
    expect(screen.getByDisplayValue("sarah.johnson@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("32")).toBeInTheDocument();

    // STRICT PRIVACY CHECK: NO password input anywhere in the form
    expect(document.querySelector('input[type="password"]')).toBeNull();
    expect(screen.queryByLabelText(/password/i)).toBeNull();
    expect(screen.queryByPlaceholderText(/password/i)).toBeNull();
    expect(screen.queryByText(/password/i)).toBeNull();
  });

  it("navigates to Step 5 (Review), verifies summary for Dr. Deepa Koduri, and confirms appointment", () => {
    let bookedCalled = false;
    renderBookAppointment(() => {
      bookedCalled = true;
    });

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole("button", { name: /Continue to Treatment & Date/i }));

    // Select Treatment: "Tooth Pain"
    fireEvent.click(screen.getByText("Tooth Pain"));

    // Select Date
    const dayButtons = screen.getAllByRole("button").filter((b) => {
      const text = b.textContent?.trim() || "";
      return !b.hasAttribute("disabled") && /^[1-9][0-9]?$/.test(text);
    });
    fireEvent.click(dayButtons[0]);

    // Step 2 -> Step 3
    fireEvent.click(screen.getByRole("button", { name: /Continue to Pick Time/i }));

    // Select first available time
    const availableSlots = screen.getAllByRole("button").filter((b) => {
      return b.textContent?.includes("Available") && !b.hasAttribute("disabled");
    });
    const chosenTime = availableSlots[0].textContent?.match(/\d{2}:\d{2}\s+(?:AM|PM)/)?.[0];
    fireEvent.click(availableSlots[0]);

    // Step 3 -> Step 4
    fireEvent.click(screen.getByRole("button", { name: /Continue to Patient Details/i }));

    // Step 4 -> Step 5 (Review)
    fireEvent.click(screen.getByRole("button", { name: /Continue to Review/i }));

    // Step 5 Review Content
    expect(screen.getByRole("heading", { name: /Review Appointment Details/i })).toBeInTheDocument();
    expect(screen.getAllByText("Dr. Deepa Koduri").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Endodontist").length).toBeGreaterThan(0);
    expect(screen.getByText("In-Clinic Consultation")).toBeInTheDocument();
    expect(screen.getByText("Tooth Pain")).toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
    expect(screen.getByText("+91 98480 22338")).toBeInTheDocument();
    expect(screen.getByText("sarah.johnson@example.com")).toBeInTheDocument();

    // Confirm appointment
    const confirmBtn = screen.getByRole("button", { name: /Confirm Appointment/i });
    fireEvent.click(confirmBtn);

    // Confirmation Screen Verification
    expect(screen.getAllByText("Appointment Confirmed").length).toBeGreaterThan(0);
    expect(screen.getByText(/#TRU-APT-/i)).toBeInTheDocument();
    expect(screen.getAllByText("Dr. Deepa Koduri").length).toBeGreaterThan(0);
    expect(screen.getByText("Tooth Pain")).toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();

    // In-Clinic verification: clinic address and directions
    expect(screen.getByText(/1st Floor, Avani Plaza, Ramayya Street, Kakinada/i)).toBeInTheDocument();
    const directionsLink = screen.getByRole("link", { name: /Get Directions on Google Maps/i });
    expect(directionsLink).toHaveAttribute("href", "https://maps.app.goo.gl/oS4FVYedV4wLi7vi9");

    // Action button
    const viewApptsBtn = screen.getByRole("button", { name: /View My Appointments/i });
    fireEvent.click(viewApptsBtn);
    expect(bookedCalled).toBe(true);
  });

  it("handles Online Consultation booking without fake URLs and displays proper fallback message", () => {
    renderBookAppointment();

    // Select Online Consultation in Step 1
    fireEvent.click(screen.getByText("2. Online Consultation"));

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole("button", { name: /Continue to Treatment & Date/i }));

    // Pick Date
    const dayButtons = screen.getAllByRole("button").filter((b) => {
      const text = b.textContent?.trim() || "";
      return !b.hasAttribute("disabled") && /^[1-9][0-9]?$/.test(text);
    });
    fireEvent.click(dayButtons[0]);

    // Step 2 -> Step 3
    fireEvent.click(screen.getByRole("button", { name: /Continue to Pick Time/i }));

    // Pick Time
    const availableSlots = screen.getAllByRole("button").filter((b) => {
      return b.textContent?.includes("Available") && !b.hasAttribute("disabled");
    });
    fireEvent.click(availableSlots[0]);

    // Step 3 -> Step 4
    fireEvent.click(screen.getByRole("button", { name: /Continue to Patient Details/i }));

    // Step 4 -> Step 5
    fireEvent.click(screen.getByRole("button", { name: /Continue to Review/i }));

    // Confirm
    fireEvent.click(screen.getByRole("button", { name: /Confirm Appointment/i }));

    // Confirmed state for online
    expect(screen.getAllByText("Online Consultation").length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Your consultation link will be available before the appointment\./i)
    ).toBeInTheDocument();

    // Ensure NO fake google meet link or placeholder URL was generated
    expect(screen.queryByRole("link", { name: /Join Consultation/i })).toBeNull();
  });
});
