import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AppointmentsProvider } from "@/context/AppointmentsContext";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import DoctorsPage from "@/pages/DoctorsPage";
import TreatmentsPage from "@/pages/TreatmentsPage";
import TreatmentDetailPage from "@/pages/TreatmentDetailPage";
import ContactPage from "@/pages/ContactPage";
import AppointmentPage from "@/pages/AppointmentPage";
import Login from "@/components/Login";

describe("TRUDENT Multispeciality Dental Hospital Multi-Page Routing & Navigation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders PublicNavbar with strictly ONLY TRUDENT logo, 5 nav links, and right actions", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <PublicNavbar />
      </MemoryRouter>
    );

    // Brand and logo
    expect(screen.getAllByAltText(/TRUDENT Multispeciality Dental Hospital/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Healthy Smiles, Happy Hearts/i).length).toBeGreaterThan(0);

    // 5 Navigation links (check desktop nav)
    expect(screen.getAllByRole("link", { name: /^Home$/i })[0]).toHaveAttribute("href", "/");
    expect(screen.getAllByRole("link", { name: /^About Us$/i })[0]).toHaveAttribute("href", "/about");
    expect(screen.getAllByRole("link", { name: /^Doctors$/i })[0]).toHaveAttribute("href", "/doctors");
    expect(screen.getAllByRole("link", { name: /^Treatments$/i })[0]).toHaveAttribute("href", "/treatments");
    expect(screen.getAllByRole("link", { name: /^Contact$/i })[0]).toHaveAttribute("href", "/contact");

    // Right actions
    expect(screen.getAllByRole("link", { name: /Book Appointment/i })[0]).toHaveAttribute("href", "/appointment");
    expect(screen.getAllByRole("link", { name: /Sign In/i })[0]).toHaveAttribute("href", "/login");

    // Negative constraints: MUST NOT contain Gallery, Reviews, FAQs, Specialties in navbar
    expect(screen.queryByRole("link", { name: /Gallery/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /Reviews/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /FAQs/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /Specialties/i })).toBeNull();
  });

  it("renders HomePage at / with specified hero, 1 doctor, treatments preview, and location", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppointmentsProvider>
          <HomePage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Hero headline and messaging
    expect(screen.getByText(/Complete Dental Care for a/i)).toBeInTheDocument();
    expect(screen.getByText(/Healthier, Happier Smile/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Professional Dental Care/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Patient-Focused Treatment/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Modern Dental Services/i).length).toBeGreaterThan(0);

    // Primary & Secondary Hero CTAs
    const heroBookBtn = screen.getAllByRole("link", { name: /Book Appointment/i })[0];
    expect(heroBookBtn).toHaveAttribute("href", "/appointment");

    const meetDoctorBtn = screen.getByRole("link", { name: /Meet Our Doctor/i });
    expect(meetDoctorBtn).toHaveAttribute("href", "/doctors");

    // 1. Quick Introduction
    const aboutLinks = screen.getAllByRole("link", { name: /^About Us$/i });
    expect(aboutLinks.some((l) => l.getAttribute("href") === "/about")).toBe(true);

    // 2. Treatments Preview
    const treatmentsLinks = screen.getAllByRole("link", { name: /View All Treatments/i });
    expect(treatmentsLinks.some((l) => l.getAttribute("href") === "/treatments")).toBe(true);

    // 3. Meet Our Doctor: Only ONE single doctor (Dr. Deepa Koduri)
    expect(screen.getByText("Dr. Deepa Koduri")).toBeInTheDocument();
    expect(screen.queryByText("Dr. James Wilson")).toBeNull();
    expect(screen.queryByText("Dr. Maria Santos")).toBeNull();
    expect(screen.queryByText("Dr. Robert Chen")).toBeNull();

    const viewDoctorBtn = screen.getByRole("link", { name: /View Doctor Profile/i });
    expect(viewDoctorBtn).toHaveAttribute("href", "/doctors");

    // 4. Why Choose TRUDENT (genuine points, no fake stats)
    expect(screen.getByText(/Why Choose TRUDENT/i)).toBeInTheDocument();
    expect(screen.queryByText("15,000+")).toBeNull();
    expect(screen.queryByText("18+ Specialists")).toBeNull();

    // 5. Appointment CTA
    expect(screen.getByText(/Ready to Take Care of Your Smile\?/i)).toBeInTheDocument();

    // 6. Location Preview
    expect(screen.getByText(/Kakinada, Andhra Pradesh [–-] 533001/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get Directions/i })).toHaveAttribute(
      "href",
      "https://maps.app.goo.gl/oS4FVYedV4wLi7vi9"
    );
  }, 15000);

  it("renders AboutPage at /about with separate structure, genuine content, and single doctor", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <AppointmentsProvider>
          <AboutPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Hero
    expect(screen.getByRole("heading", { name: "About TRUDENT" })).toBeInTheDocument();

    // Section 1: Who We Are
    expect(screen.getByText(/Who We Are/i)).toBeInTheDocument();

    // Section 2: Our Approach to Dental Care
    expect(screen.getByText(/Our Approach to Dental Care/i)).toBeInTheDocument();
    expect(screen.getByText(/Patient-Focused Care/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional Consultation/i)).toBeInTheDocument();
    expect(screen.getByText(/Personalized Treatment/i)).toBeInTheDocument();
    expect(screen.getByText(/Comfortable Dental Experience/i)).toBeInTheDocument();

    // Section 3: Our Dental Care Philosophy
    expect(screen.getByText(/Our Dental Care Philosophy/i)).toBeInTheDocument();

    // Section 4: Why Patients Choose TRUDENT (no fake stats)
    expect(screen.getByText(/Why Patients Choose TRUDENT/i)).toBeInTheDocument();
    expect(screen.queryByText("15,000+")).toBeNull();
    expect(screen.queryByText("18+ Senior Specialists")).toBeNull();

    // Section 5: Meet Our Doctor
    expect(screen.getByText("Dr. Deepa Koduri")).toBeInTheDocument();
    expect(screen.getAllByText("@trudent_kakinada").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Meet Our Doctor/i })).toHaveAttribute("href", "/doctors");

    // Repeated CTA banner is removed from About page
    expect(screen.queryByText(/Need a Dental Consultation\?/i)).not.toBeInTheDocument();
    const ctaBookBtn = screen.getAllByRole("link", { name: /Book Appointment/i });
    expect(ctaBookBtn.some((b) => b.getAttribute("href") === "/appointment")).toBe(true);
  });

  it("renders DoctorsPage at /doctors with large single doctor profile for Dr. Deepa Koduri", () => {
    render(
      <MemoryRouter initialEntries={["/doctors"]}>
        <AppointmentsProvider>
          <DoctorsPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Page title
    expect(screen.getByRole("heading", { name: "Meet Our Doctor" })).toBeInTheDocument();

    // Doctor profile details
    expect(screen.getAllByText("Dr. Deepa Koduri").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Endodontist/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Root Canal Specialist/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("@trudent_kakinada").length).toBeGreaterThan(0);

    // Negative assertions: NO fake doctors
    expect(screen.queryByText("Dr. James Wilson")).toBeNull();
    expect(screen.queryByText("Dr. Maria Santos")).toBeNull();
    expect(screen.queryByText("Dr. Robert Chen")).toBeNull();
    expect(screen.queryByText("Dr. Lisa Park")).toBeNull();

    // CTA
    const bookBtn = screen.getAllByRole("link", { name: /Book Appointment/i });
    expect(bookBtn.some((b) => b.getAttribute("href")?.includes("/appointment"))).toBe(true);
  });

  it("renders TreatmentsPage at /treatments with supported categories and View Details links", () => {
    render(
      <MemoryRouter initialEntries={["/treatments"]}>
        <AppointmentsProvider>
          <TreatmentsPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Hero title
    expect(screen.getByRole("heading", { name: "Dental Treatments & Services" })).toBeInTheDocument();

    // Verify key treatments
    expect(screen.getAllByText("Dental Implants").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Clear Aligners & Orthodontics").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Root Canal Treatment").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cosmetic Dentistry & Veneers").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Preventive & Pediatric Dentistry").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Periodontal Care & Gum Health").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Oral Surgery & Wisdom Tooth Care").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Professional Teeth Whitening").length).toBeGreaterThan(0);

    // View Details buttons
    const detailLinks = screen.getAllByRole("link", { name: /View Details/i });
    expect(detailLinks.length).toBe(8);
    expect(detailLinks.some((l) => l.getAttribute("href") === "/treatments/dental-implants")).toBe(true);
    expect(detailLinks.some((l) => l.getAttribute("href") === "/treatments/root-canal")).toBe(true);
  });

  it("renders TreatmentDetailPage at /treatments/root-canal with clinical overview, suitability, process, considerations, and CTA", () => {
    render(
      <MemoryRouter initialEntries={["/treatments/root-canal"]}>
        <AppointmentsProvider>
          <Routes>
            <Route path="/treatments/:slug" element={<TreatmentDetailPage />} />
          </Routes>
        </AppointmentsProvider>
      </MemoryRouter>
    );

    expect(screen.getAllByRole("heading", { name: "Root Canal Treatment" }).length).toBeGreaterThan(0);
    expect(screen.getByText(/Treatment Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Who It May Be Suitable For/i)).toBeInTheDocument();
    expect(screen.getByText(/General Process/i)).toBeInTheDocument();
    expect(screen.getByText(/Important Considerations/i)).toBeInTheDocument();
    expect(screen.queryByText(/Need a Dental Consultation\?/i)).not.toBeInTheDocument();
    const bookBtn = screen.getAllByRole("link", { name: /Book Appointment/i });
    expect(bookBtn.some((b) => b.getAttribute("href")?.includes("/appointment"))).toBe(true);
  });

  it("renders ContactPage at /contact with verified Google Maps location, phone, hours, and CTA", () => {
    render(
      <MemoryRouter initialEntries={["/contact"]}>
        <AppointmentsProvider>
          <ContactPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Hero
    expect(screen.getByRole("heading", { name: "Contact TRUDENT" })).toBeInTheDocument();

    // Verified address, phone, and hours from Google Maps listing
    expect(screen.getByText(/Kakinada, Andhra Pradesh - 533001/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\+91 90635 84448/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/9:00 AM – 8:30 PM/i).length).toBeGreaterThan(0);

    // Get Directions button
    const getDirectionsBtn = screen.getByRole("link", { name: /Get Directions/i });
    expect(getDirectionsBtn).toHaveAttribute("href", "https://maps.app.goo.gl/oS4FVYedV4wLi7vi9");

    // Below Appointment CTA "Need a Dental Consultation?" must NOT be present
    expect(screen.queryByText(/Need a Dental Consultation\?/i)).not.toBeInTheDocument();
    // But navbar and footer Book Appointment links remain fully intact
    const bookBtn = screen.getAllByRole("link", { name: /Book Appointment/i });
    expect(bookBtn.some((b) => b.getAttribute("href") === "/appointment")).toBe(true);
  });

  it("renders AppointmentPage at /appointment with unified patient booking experience", async () => {
    // Authenticated patient flow
    localStorage.setItem("authToken", "patient_test_token");
    localStorage.setItem("userRole", "patient");
    localStorage.setItem("username", "Vikram Verma");
    localStorage.setItem("userEmail", "vikram@example.com");
    localStorage.setItem("userPhone", "9876543210");
    localStorage.setItem("userAge", "30");
    localStorage.setItem("userGender", "Male");

    render(
      <MemoryRouter initialEntries={["/appointment"]}>
        <AppointmentsProvider>
          <AppointmentPage />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Heading
    expect(screen.getByRole("heading", { name: /Book Your Dental Appointment/i })).toBeInTheDocument();

    // Step 1: Consultation Type (In-Clinic vs Online)
    expect(screen.getByText("Step 1: Consultation Type")).toBeInTheDocument();
    expect(screen.getAllByText(/In-Clinic Consultation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Online Consultation/i).length).toBeGreaterThan(0);

    // Select In-Clinic Consultation
    fireEvent.click(screen.getByText(/In-Clinic Consultation/i));
    const nextBtn1 = screen.getByRole("button", { name: /Next: Reason for Visit/i });
    fireEvent.click(nextBtn1);

    // Step 2: Reason for Visit
    expect(screen.getByText("Step 2: Reason for Visit")).toBeInTheDocument();
    const nextBtn2 = screen.getByRole("button", { name: /Next: Select Date/i });
    fireEvent.click(nextBtn2);

    // Step 3: Date
    expect(screen.getByText("Step 3: Select Date")).toBeInTheDocument();
    const nextBtn3 = screen.getByRole("button", { name: /Next: Select Time/i });
    fireEvent.click(nextBtn3);

    // Step 4: Time
    expect(screen.getByText("Step 4: Select Time")).toBeInTheDocument();
    // Select an available slot
    const slot0900 = screen.getByRole("button", { name: /09:00 AM/i });
    fireEvent.click(slot0900);
    const nextBtn4 = screen.getByRole("button", { name: /Next: Patient Details/i });
    fireEvent.click(nextBtn4);

    // Step 5: Patient Details (Pre-filled, NO password field)
    expect(screen.getByText("Step 5: Patient Details")).toBeInTheDocument();
    expect(screen.queryByLabelText(/Password/i)).toBeNull();
    const nameInput = screen.getByLabelText(/Full Name/i);
    expect(nameInput).toHaveValue("Vikram Verma");

    // Next to Step 6: Summary
    const nextBtn5 = screen.getByRole("button", { name: /Review Summary/i });
    fireEvent.click(nextBtn5);
    expect(screen.getByText("Step 6: Summary")).toBeInTheDocument();

    // Primary CTA: "Confirm Appointment"
    const confirmBtn = screen.getByRole("button", { name: /Confirm Appointment/i });
    expect(confirmBtn).toBeInTheDocument();

    // Click Confirm Appointment -> Step 7: Confirmation
    fireEvent.click(confirmBtn);
    expect(screen.getByText(/Your Appointment is Scheduled!/i)).toBeInTheDocument();
    expect(screen.getByText(/Appointment ID/i)).toBeInTheDocument();
  }, 15000);

  it("renders redesigned Login page at /login with TRUDENT logo, Sign In title, and Patient/Doctor options", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppointmentsProvider>
          <Login />
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // TRUDENT logo & Title
    expect(screen.getAllByAltText(/TRUDENT Multispeciality Dental Hospital/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Sign In" })).toBeInTheDocument();

    // Role options: Patient and Doctor ONLY (NO Admin)
    const patientRoleBtn = screen.getByRole("button", { name: /Patient/i });
    const doctorRoleBtn = screen.getByRole("button", { name: /Doctor/i });
    expect(patientRoleBtn).toBeInTheDocument();
    expect(doctorRoleBtn).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Admin/i })).toBeNull();

    // Small link for new patients to book appointment
    expect(screen.getAllByRole("link", { name: /Book an Appointment/i })[0]).toHaveAttribute("href", "/appointment?auth=new");

    // Click Patient role to reveal form
    fireEvent.click(patientRoleBtn);

    // Fields: Email and Password
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();

    // Primary CTA: [Sign In] submit button
    const submitBtns = screen.getAllByRole("button", { name: /^Sign In$/i });
    const signInSubmit = submitBtns.find((b) => b.getAttribute("type") === "submit")!;
    expect(signInSubmit).toBeInTheDocument();
  });

  it("handles authentication and stores credentials properly for patient and doctor", async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppointmentsProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/patientdashboard" element={<div>Patient Dashboard View</div>} />
            <Route path="/doctordashboard" element={<div>Doctor Dashboard View</div>} />
          </Routes>
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Select Patient role
    fireEvent.click(screen.getByRole("button", { name: /Patient/i }));

    // Patient login
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "sarah@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "Password123" } });
    const patientSubmit = screen.getAllByRole("button", { name: /^Sign In$/i }).find((b) => b.getAttribute("type") === "submit")!;
    await act(async () => {
      fireEvent.click(patientSubmit);
      await new Promise((r) => setTimeout(r, 600));
    });

    expect(localStorage.getItem("authToken")).toBeTruthy();
    expect(localStorage.getItem("userRole")).toBe("patient");
    expect(screen.getByText("Patient Dashboard View")).toBeInTheDocument();

    unmount();

    // Doctor login
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppointmentsProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/doctordashboard" element={<div>Doctor Dashboard View</div>} />
          </Routes>
        </AppointmentsProvider>
      </MemoryRouter>
    );

    // Select Doctor role
    fireEvent.click(screen.getByRole("button", { name: /Doctor/i }));

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "doctor@trudent.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "TrudentDoc2026!" } });
    const doctorSubmit = screen.getAllByRole("button", { name: /^Sign In$/i }).find((b) => b.getAttribute("type") === "submit")!;
    await act(async () => {
      fireEvent.click(doctorSubmit);
      await new Promise((r) => setTimeout(r, 600));
    });

    expect(localStorage.getItem("authToken")).toBeTruthy();
    expect(localStorage.getItem("userRole")).toBe("doctor");
    expect(localStorage.getItem("username")).toBe("Dr. Deepa Koduri");
    expect(screen.getByText("Doctor Dashboard View")).toBeInTheDocument();
  });
});
