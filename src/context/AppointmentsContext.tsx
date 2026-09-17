import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export interface Appointment {
  id: number;
  patient_name: string;
  patient_id: number;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  treatment: string;
  appointment_type: "in-person" | "video";
  meet_link?: string;
  notes?: string;
  room?: string;
  fee?: number;
  patient_age?: number | string;
  patient_gender?: string;
  patient_phone?: string;
  patient_email?: string;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  specialty: string;
  patients: number;
  status: "active" | "pending";
  photo?: string;
  experience?: string;
  qualifications?: string;
  consultationFee?: number;
  rating?: number;
  about?: string;
  availableDays?: string[];
  roomNumber?: string;
}

export interface HospitalNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "appointment" | "prescription" | "general";
}

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 100,
    name: "Dr. James Wilson",
    email: "wilson@hospital.com",
    specialty: "Cardiology",
    patients: 45,
    status: "active",
    experience: "14 yrs",
    qualifications: "MD, FACC - Senior Cardiologist",
    consultationFee: 850,
    rating: 4.9,
    about: "Specializes in interventional cardiology, heart failure management, and preventive cardiovascular healthcare.",
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    roomNumber: "Opd 302, Block A",
  },
  {
    id: 101,
    name: "Dr. Maria Santos",
    email: "santos@hospital.com",
    specialty: "Dermatology",
    patients: 38,
    status: "active",
    experience: "10 yrs",
    qualifications: "MD, FAAD - Consultant Dermatologist",
    consultationFee: 700,
    rating: 4.8,
    about: "Expert in clinical dermatology, acne therapies, pediatric skin conditions, and aesthetic treatments.",
    availableDays: ["Mon", "Tue", "Wed", "Fri", "Sat"],
    roomNumber: "Opd 205, Block B",
  },
  {
    id: 102,
    name: "Dr. Robert Chen",
    email: "chen@hospital.com",
    specialty: "Orthopedics",
    patients: 52,
    status: "active",
    experience: "15 yrs",
    qualifications: "MS, MCh (Ortho) - Joint Specialist",
    consultationFee: 800,
    rating: 4.9,
    about: "Pioneering minimally invasive arthroscopic surgery, joint replacements, and sports injury recovery.",
    availableDays: ["Tue", "Wed", "Thu", "Fri", "Sat"],
    roomNumber: "Opd 104, Block C",
  },
  {
    id: 103,
    name: "Dr. Deepa Koduri",
    email: "deepa@trudent.com",
    specialty: "Endodontist",
    patients: 34,
    status: "active",
    experience: "Root Canal Specialist",
    qualifications: "Endodontist",
    consultationFee: 600,
    rating: 4.9,
    about: "Endodontist and Root Canal Specialist at TRUDENT Multispeciality Dental Hospital. Gentle, stress-free, and evidence-based care utilizing laser dentistry, implants, and aligners.",
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    roomNumber: "Dental Wing, Room 101",
  },
  {
    id: 104,
    name: "Dr. Priya Patel",
    email: "priya@hospital.com",
    specialty: "Dentistry",
    patients: 28,
    status: "active",
    experience: "8 yrs",
    qualifications: "BDS, MDS (Orthodontics)",
    consultationFee: 650,
    rating: 4.9,
    about: "Specialized in clear aligners, dental braces for children and adults, and smile design.",
    availableDays: ["Mon", "Wed", "Fri", "Sat"],
    roomNumber: "Dental Wing, Room 102",
  },
  {
    id: 105,
    name: "Dr. Lisa Park",
    email: "park@hospital.com",
    specialty: "Neurology",
    patients: 18,
    status: "active",
    experience: "11 yrs",
    qualifications: "MD, DM (Neurology) - Neurologist",
    consultationFee: 900,
    rating: 4.7,
    about: "Specialist in neurodegenerative diseases, epilepsy, sleep medicine, and chronic migraine therapies.",
    availableDays: ["Mon", "Wed", "Thu", "Fri"],
    roomNumber: "Opd 401, Block A",
  },
  {
    id: 106,
    name: "Dr. Ahmed Khan",
    email: "khan@hospital.com",
    specialty: "Pediatrics",
    patients: 24,
    status: "active",
    experience: "9 yrs",
    qualifications: "MD (Pediatrics), DCH - Pediatrician",
    consultationFee: 600,
    rating: 4.8,
    about: "Dedicated to newborn care, child development assessments, vaccination, and adolescent wellness.",
    availableDays: ["Tue", "Thu", "Sat"],
    roomNumber: "Pediatric Care, Room 201",
  },
  {
    id: 107,
    name: "Dr. Sunita Rao",
    email: "sunitarao@hospital.com",
    specialty: "General Medicine",
    patients: 0,
    status: "pending",
    experience: "7 yrs",
    qualifications: "MBBS, MD (General Medicine)",
    consultationFee: 500,
    rating: 4.6,
    about: "Preventive health screenings, lifestyle disease management, and internal diagnostic health checks.",
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    roomNumber: "Opd 108, Block B",
  },
];

export interface Prescription {
  id: number;
  doctor_name: string;
  patient_name: string;
  patient_id: number;
  diagnosis: string;
  medicines: { name: string; dosage: string; duration: string; frequency: string }[];
  notes: string;
  date: string;
}

const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 1, doctor_name: "Dr. Deepa Koduri", patient_name: "Sarah Johnson", patient_id: 1,
    diagnosis: "Root Canal Post-Op Review",
    medicines: [
      { name: "Amoxicillin", dosage: "500mg", duration: "5 days", frequency: "Three times daily" },
      { name: "Ibuprofen", dosage: "400mg", duration: "3 days", frequency: "As needed for pain" },
    ],
    notes: "Avoid chewing hard foods on treated tooth. Rinse with warm saline water twice daily. Follow up in 2 weeks.",
    date: "2026-04-10",
  },
  {
    id: 2, doctor_name: "Dr. Deepa Koduri", patient_name: "Sarah Johnson", patient_id: 1,
    diagnosis: "Dental Caries - Lower Molar",
    medicines: [
      { name: "Amoxicillin", dosage: "500mg", duration: "7 days", frequency: "Three times daily" },
      { name: "Ibuprofen", dosage: "400mg", duration: "5 days", frequency: "As needed" },
    ],
    notes: "Avoid hard foods for 48 hours. Schedule root canal follow-up.",
    date: "2026-04-12",
  },
  {
    id: 3, doctor_name: "Dr. Deepa Koduri", patient_name: "Ravi Kumar", patient_id: 7,
    diagnosis: "Gingivitis & Enamel Sensitivity",
    medicines: [
      { name: "Chlorhexidine Mouthwash", dosage: "0.2%", duration: "14 days", frequency: "Twice daily after brushing" },
      { name: "Potassium Nitrate Toothpaste", dosage: "5%", duration: "30 days", frequency: "Twice daily" },
    ],
    notes: "Use soft-bristled brush. Avoid extremely hot or cold beverages for 1 week.",
    date: "2026-04-11",
  },
];

const today = new Date().toISOString().split("T")[0];

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 1, patient_name: "Sarah Johnson", patient_id: 1, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-04-05", appointment_time: "10:00 AM", status: "completed", treatment: "Dental Consultation", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 600, patient_age: 32, patient_gender: "Female", patient_phone: "+91 98480 22338", patient_email: "sarah.j@gmail.com" },
  { id: 2, patient_name: "Michael Brown", patient_id: 2, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-04-05", appointment_time: "10:30 AM", status: "completed", treatment: "Teeth Whitening", appointment_type: "video", fee: 650, patient_age: 38, patient_gender: "Male", patient_phone: "+91 91234 56780", patient_email: "michael.b@gmail.com" },
  { id: 3, patient_name: "Emma Davis", patient_id: 3, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-04-06", appointment_time: "11:00 AM", status: "completed", treatment: "Laser Dentistry Consult", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 600, patient_age: 26, patient_gender: "Female", patient_phone: "+91 98765 01234", patient_email: "emma.d@gmail.com" },
  { id: 4, patient_name: "John Smith", patient_id: 4, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-04-04", appointment_time: "2:00 PM", status: "cancelled", treatment: "Dental Cleaning", appointment_type: "video", fee: 600, patient_age: 42, patient_gender: "Male", patient_phone: "+91 96543 21098", patient_email: "john.s@gmail.com" },
  { id: 5, patient_name: "Alice Wang", patient_id: 5, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-04-07", appointment_time: "9:00 AM", status: "completed", treatment: "Dental Checkup", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 600, patient_age: 31, patient_gender: "Female", patient_phone: "+91 97654 32109", patient_email: "alice.w@gmail.com" },
  { id: 6, patient_name: "Bob Lee", patient_id: 6, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-04-08", appointment_time: "3:00 PM", status: "completed", treatment: "Crown & Bridge Consult", appointment_type: "video", fee: 700, patient_age: 50, patient_gender: "Male", patient_phone: "+91 95432 10987", patient_email: "bob.l@gmail.com" },
  { id: 7, patient_name: "Sarah Johnson", patient_id: 1, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-04-11", appointment_time: "10:00 AM", status: "confirmed", treatment: "Teeth Cleaning", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 600, patient_age: 32, patient_gender: "Female", patient_phone: "+91 98480 22338", patient_email: "sarah.j@gmail.com" },
  { id: 8, patient_name: "Michael Brown", patient_id: 2, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-04-12", appointment_time: "02:30 PM", status: "confirmed", treatment: "Root Canal", appointment_type: "video", fee: 650, patient_age: 38, patient_gender: "Male", patient_phone: "+91 91234 56780", patient_email: "michael.b@gmail.com" },
  { id: 9, patient_name: "Emma Davis", patient_id: 3, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-04-11", appointment_time: "11:00 AM", status: "completed", treatment: "Dental Checkup", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 600, patient_age: 26, patient_gender: "Female", patient_phone: "+91 98765 01234", patient_email: "emma.d@gmail.com" },
  { id: 10, patient_name: "John Smith", patient_id: 4, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-04-13", appointment_time: "04:00 PM", status: "confirmed", treatment: "Teeth Whitening", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 650, patient_age: 42, patient_gender: "Male", patient_phone: "+91 96543 21098", patient_email: "john.s@gmail.com" },
  { id: 11, patient_name: "Ravi Kumar", patient_id: 7, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-04-11", appointment_time: "09:30 AM", status: "confirmed", treatment: "Dental Scaling", appointment_type: "video", meet_link: "https://meet.google.com/abc-defg-hij", fee: 600, patient_age: 45, patient_gender: "Male", patient_phone: "+91 98765 43210", patient_email: "ravi.k@gmail.com" },
  { id: 12, patient_name: "Sneha Reddy", patient_id: 8, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-04-11", appointment_time: "11:30 AM", status: "confirmed", treatment: "Root Canal Review", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 650, patient_age: 29, patient_gender: "Female", patient_phone: "+91 99887 76655", patient_email: "sneha.r@gmail.com" },
  // Today's appointments for doctor dashboard and patient dashboard
  { id: 13, patient_name: "Sarah Johnson", patient_id: 1, doctor_name: "Dr. Deepa Koduri", appointment_date: today, appointment_time: "09:00 AM", status: "confirmed", treatment: "Root Canal Consultation", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 650, patient_age: 32, patient_gender: "Female", patient_phone: "+91 98480 22338", patient_email: "sarah.j@gmail.com" },
  { id: 14, patient_name: "Ravi Kumar", patient_id: 7, doctor_name: "Dr. Deepa Koduri", appointment_date: today, appointment_time: "10:30 AM", status: "pending", treatment: "Dental Scaling & Consultation", appointment_type: "video", fee: 600, patient_age: 45, patient_gender: "Male", patient_phone: "+91 98765 43210", patient_email: "ravi.k@gmail.com" },
  { id: 15, patient_name: "Sneha Reddy", patient_id: 8, doctor_name: "Dr. Deepa Koduri", appointment_date: today, appointment_time: "11:30 AM", status: "pending", treatment: "Aligners Progress Review", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 600, patient_age: 29, patient_gender: "Female", patient_phone: "+91 99887 76655", patient_email: "sneha.r@gmail.com" },
  { id: 16, patient_name: "Michael Brown", patient_id: 2, doctor_name: "Dr. Deepa Koduri", appointment_date: today, appointment_time: "02:00 PM", status: "completed", treatment: "Crown Follow-up", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 650, patient_age: 38, patient_gender: "Male", patient_phone: "+91 91234 56780", patient_email: "michael.b@gmail.com" },
  { id: 17, patient_name: "Emma Davis", patient_id: 3, doctor_name: "Dr. Deepa Koduri", appointment_date: today, appointment_time: "03:30 PM", status: "confirmed", treatment: "Cavity Filling", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 600, patient_age: 26, patient_gender: "Female", patient_phone: "9876501234", patient_email: "emma.d@gmail.com" },
  { id: 18, patient_name: "Alice Wang", patient_id: 5, doctor_name: "Dr. Deepa Koduri", appointment_date: today, appointment_time: "04:30 PM", status: "pending", treatment: "Wisdom Tooth Consult", appointment_type: "video", fee: 600, patient_age: 31, patient_gender: "Female", patient_phone: "+91 97654 32109", patient_email: "alice.w@gmail.com" },
  { id: 19, patient_name: "John Smith", patient_id: 4, doctor_name: "Dr. Deepa Koduri", appointment_date: today, appointment_time: "05:30 PM", status: "confirmed", treatment: "Laser Gum Therapy", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 700, patient_age: 42, patient_gender: "Male", patient_phone: "+91 96543 21098", patient_email: "john.s@gmail.com" },
  // Upcoming appointments
  { id: 21, patient_name: "Sarah Johnson", patient_id: 1, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-09-24", appointment_time: "10:00 AM", status: "pending", treatment: "Root Canal Final Restoration", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 650, patient_age: 32, patient_gender: "Female", patient_phone: "+91 98480 22338", patient_email: "sarah.j@gmail.com" },
  { id: 22, patient_name: "Ravi Kumar", patient_id: 7, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-09-25", appointment_time: "02:00 PM", status: "pending", treatment: "Dental Cleaning", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 600, patient_age: 45, patient_gender: "Male", patient_phone: "+91 98765 43210", patient_email: "ravi.k@gmail.com" },
  { id: 23, patient_name: "Michael Brown", patient_id: 2, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-09-26", appointment_time: "11:00 AM", status: "pending", treatment: "Aligners Scan", appointment_type: "video", fee: 650, patient_age: 38, patient_gender: "Male", patient_phone: "+91 91234 56780", patient_email: "michael.b@gmail.com" },
  // Demo appointments
  { id: 30, patient_name: "Rahul Verma", patient_id: 10, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-09-20", appointment_time: "09:30 AM", status: "confirmed", treatment: "Dental Scaling & Polishing", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 600, patient_age: 28, patient_gender: "Male", patient_phone: "+91 98480 11223", patient_email: "rahul.v@gmail.com" },
  { id: 31, patient_name: "Anita Deshmukh", patient_id: 11, doctor_name: "Dr. Deepa Koduri", appointment_date: "2026-09-20", appointment_time: "10:30 AM", status: "confirmed", treatment: "Root Canal Consultation", appointment_type: "in-person", room: "TRUDENT Multispeciality Dental Hospital, Room 101", fee: 650, patient_age: 34, patient_gender: "Female", patient_phone: "+91 97654 09876", patient_email: "anita.d@gmail.com" },
];

const INITIAL_NOTIFICATIONS: HospitalNotification[] = [
  {
    id: 1,
    title: "Appointment Confirmed",
    message: "Your appointment with Dr. Deepa Koduri has been confirmed for today at 09:00 AM.",
    time: "10 mins ago",
    read: false,
    type: "appointment",
  },
  {
    id: 2,
    title: "Prescription Issued",
    message: "Dr. Deepa Koduri has uploaded a new prescription for Dental Caries follow-up.",
    time: "2 hours ago",
    read: false,
    type: "prescription",
  },
  {
    id: 3,
    title: "Welcome to TRUDENT",
    message: "Welcome to TRUDENT Multispeciality Dental Hospital. Access your clinical records anytime.",
    time: "1 day ago",
    read: true,
    type: "general",
  },
];

function generateMeetLink(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const seg = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * 26)]).join("");
  return `https://meet.google.com/${seg(3)}-${seg(4)}-${seg(3)}`;
}

export function normalizeTime(t: string): string {
  if (!t) return "";
  const cleaned = t.trim().toUpperCase();
  const match = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return cleaned;
  const hours = match[1].padStart(2, "0");
  const minutes = match[2];
  const meridiem = match[3];
  return `${hours}:${minutes} ${meridiem}`;
}

const APPOINTMENTS_STORAGE_KEY = "trudent_appointments";

const getSavedAppointments = (): Appointment[] => {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(APPOINTMENTS_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure initial demo appointments are present if not in storage
        const existingIds = new Set(parsed.map((a: Appointment) => a.id));
        const missing = INITIAL_APPOINTMENTS.filter((a) => !existingIds.has(a.id));
        return [...parsed, ...missing];
      }
    }
  } catch (e) {
    console.error("Error reading saved appointments from localStorage:", e);
  }
  return INITIAL_APPOINTMENTS;
};

interface AppointmentsContextType {
  appointments: Appointment[];
  addAppointment: (appt: Omit<Appointment, "id">) => void;
  updateStatus: (id: number, status: Appointment["status"]) => void;
  cancelAppointment: (id: number) => void;
  rescheduleAppointment: (id: number, newDate: string, newTime: string) => void;
  doctors: Doctor[];
  updateDoctorStatus: (id: number, status: Doctor["status"]) => void;
  prescriptions: Prescription[];
  addPrescription: (p: Omit<Prescription, "id">) => void;
  notifications: HospitalNotification[];
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
  isSlotBooked: (date: string, time: string, doctorName?: string) => boolean;
  getBookedSlots: (date: string, doctorName?: string) => string[];
  getAvailableSlots: (date: string, allSlots: string[], doctorName?: string) => string[];
}

const AppointmentsContext = createContext<AppointmentsContextType | null>(null);

export const useAppointments = () => {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error("useAppointments must be used within AppointmentsProvider");
  return ctx;
};

export const AppointmentsProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(getSavedAppointments);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [notifications, setNotifications] = useState<HospitalNotification[]>(INITIAL_NOTIFICATIONS);

  // Sync appointments with localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
      }
    } catch (e) {
      console.error("Error saving appointments to localStorage:", e);
    }
  }, [appointments]);

  const addAppointment = useCallback((appt: Omit<Appointment, "id">) => {
    const newId = Date.now();
    setAppointments((prev) => [...prev, { ...appt, id: newId }]);
    // Add notification
    setNotifications((prev) => [
      {
        id: Date.now(),
        title: "Appointment Scheduled",
        message: `Your appointment request with ${appt.doctor_name} on ${appt.appointment_date} has been submitted.`,
        time: "Just now",
        read: false,
        type: "appointment",
      },
      ...prev,
    ]);
  }, []);

  const updateStatus = useCallback((id: number, status: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return { ...a, status };
      })
    );
  }, []);

  const cancelAppointment = useCallback((id: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
    );
    setNotifications((prev) => [
      {
        id: Date.now(),
        title: "Appointment Cancelled",
        message: "Your appointment has been cancelled successfully.",
        time: "Just now",
        read: false,
        type: "appointment",
      },
      ...prev,
    ]);
  }, []);

  const rescheduleAppointment = useCallback((id: number, newDate: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, appointment_date: newDate, appointment_time: newTime, status: "pending" } : a))
    );
    setNotifications((prev) => [
      {
        id: Date.now(),
        title: "Appointment Rescheduled",
        message: `Your visit has been rescheduled to ${newDate} at ${newTime}. Awaiting confirmation.`,
        time: "Just now",
        read: false,
        type: "appointment",
      },
      ...prev,
    ]);
  }, []);

  const updateDoctorStatus = useCallback((id: number, status: Doctor["status"]) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  }, []);

  const addPrescription = useCallback((p: Omit<Prescription, "id">) => {
    setPrescriptions((prev) => [...prev, { ...p, id: Date.now() }]);
  }, []);

  const markNotificationAsRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // ─── Slot Availability Helpers ──────────────────────────────────────────
  const isSlotBooked = useCallback(
    (date: string, time: string, doctorName?: string): boolean => {
      if (!date || !time) return false;
      const normTargetTime = normalizeTime(time);

      return appointments.some((a) => {
        if (a.status === "cancelled") return false;
        if (a.appointment_date !== date) return false;
        if (normalizeTime(a.appointment_time) !== normTargetTime) return false;

        // TRUDENT single-doctor setup: Dr. Deepa Koduri
        if (doctorName) {
          const aDoc = (a.doctor_name || "").toLowerCase();
          const target = doctorName.toLowerCase();
          if (
            aDoc.includes("deepa") ||
            target.includes("deepa") ||
            aDoc.includes("koduri") ||
            target.includes("koduri") ||
            aDoc.includes("akshay") ||
            target.includes("akshay") ||
            aDoc === target
          ) {
            return true;
          }
          return aDoc === target;
        }
        return true;
      });
    },
    [appointments]
  );

  const getBookedSlots = useCallback(
    (date: string, doctorName?: string): string[] => {
      if (!date) return [];
      return appointments
        .filter((a) => {
          if (a.status === "cancelled") return false;
          if (a.appointment_date !== date) return false;

          if (doctorName) {
            const aDoc = (a.doctor_name || "").toLowerCase();
            const target = doctorName.toLowerCase();
            if (
              aDoc.includes("deepa") ||
              target.includes("deepa") ||
              aDoc.includes("koduri") ||
              target.includes("koduri") ||
              aDoc.includes("akshay") ||
              target.includes("akshay") ||
              aDoc === target
            ) {
              return true;
            }
            return aDoc === target;
          }
          return true;
        })
        .map((a) => normalizeTime(a.appointment_time));
    },
    [appointments]
  );

  const getAvailableSlots = useCallback(
    (date: string, allSlots: string[], doctorName?: string): string[] => {
      const bookedSet = new Set(getBookedSlots(date, doctorName));
      return allSlots.filter((slot) => !bookedSet.has(normalizeTime(slot)));
    },
    [getBookedSlots]
  );

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        addAppointment,
        updateStatus,
        cancelAppointment,
        rescheduleAppointment,
        doctors,
        updateDoctorStatus,
        prescriptions,
        addPrescription,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isSlotBooked,
        getBookedSlots,
        getAvailableSlots,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

