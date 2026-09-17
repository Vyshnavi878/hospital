import {
  ShieldCheck,
  Smile,
  Microscope,
  Sparkles,
  Baby,
  Activity,
  Zap,
  Flame,
  LucideIcon,
} from "lucide-react";

export interface TreatmentProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface DentalTreatment {
  slug: string;
  name: string;
  category:
    | "Dental Implants"
    | "Orthodontics"
    | "Root Canal Treatment"
    | "Cosmetic Dentistry"
    | "Preventive Dentistry"
    | "Periodontal Care"
    | "Oral Surgery"
    | "Restorative Dentistry";
  shortDescription: string;
  overview: string;
  suitableFor: string[];
  generalProcess: TreatmentProcessStep[];
  considerations: string[];
  icon: LucideIcon;
  estimatedDuration: string;
}

export const TREATMENTS_DATA: DentalTreatment[] = [
  {
    slug: "dental-implants",
    name: "Dental Implants",
    category: "Dental Implants",
    shortDescription:
      "Permanent titanium tooth root replacement designed to restore natural chewing function, jawbone support, and smile aesthetics.",
    overview:
      "Dental implants are biocompatible titanium posts surgically placed into the jawbone beneath your gumline. Once integrated with the bone tissue through osseointegration, they act as stable anchors for custom crowns, bridges, or full-arch dental prosthetics.",
    suitableFor: [
      "Individuals with one or multiple missing teeth",
      "Patients wanting a permanent, fixed alternative to removable dentures",
      "Adults with adequate jawbone density and healthy gums",
      "Patients seeking to restore natural chewing strength and facial balance",
    ],
    generalProcess: [
      {
        step: "01",
        title: "Comprehensive Clinical & 3D Imaging Assessment",
        description:
          "Digital oral examination and 3D radiographic assessment to evaluate bone volume, nerve proximity, and surgical positioning.",
      },
      {
        step: "02",
        title: "Precise Implant Placement",
        description:
          "Gentle placement of the titanium implant post under local anesthesia into the designated site.",
      },
      {
        step: "03",
        title: "Osseointegration & Healing",
        description:
          "A biological healing period allowing bone cells to securely bond with the implant surface for lasting stability.",
      },
      {
        step: "04",
        title: "Custom Crown Attachment",
        description:
          "Crafting and securing your custom ceramic crown matched precisely to the shade and contour of adjacent natural teeth.",
      },
    ],
    considerations: [
      "Sufficient bone support is essential; bone grafting may be recommended in areas of bone loss.",
      "Good daily oral hygiene and regular checkups are required to ensure long-term implant health.",
      "General healing periods vary depending on individual bone physiology and overall health.",
    ],
    icon: ShieldCheck,
    estimatedDuration: "60 – 90 mins per procedure",
  },
  {
    slug: "clear-aligners",
    name: "Clear Aligners & Orthodontics",
    category: "Orthodontics",
    shortDescription:
      "Discreet orthodontic alignment using custom clear removable trays for comfortable, progressive teeth straightening.",
    overview:
      "Clear aligners provide a modern, nearly invisible method for correcting teeth crowding, spacing, and mild-to-moderate bite discrepancies. Each set of transparent polymer trays applies gentle, calibrated force to move teeth systematically into alignment.",
    suitableFor: [
      "Teens and adults looking for an aesthetic alternative to traditional metal braces",
      "Individuals with mild to moderate tooth crowding, gaps, or rotations",
      "Patients prioritizing easy brushing, flossing, and zero food restrictions",
      "Professionals desiring a subtle, discreet orthodontic treatment plan",
    ],
    generalProcess: [
      {
        step: "01",
        title: "Digital Orthodontic Scanning",
        description:
          "High-precision digital intraoral scans capture exact dental arches without messy impression pastes.",
      },
      {
        step: "02",
        title: "Custom 3D Movement Plan",
        description:
          "A computerized simulation showing the projected progression of your teeth from initial position to final result.",
      },
      {
        step: "03",
        title: "Tray Wear & Sequential Progression",
        description:
          "Patients wear clear trays for 20-22 hours daily, switching to the next set every 1-2 weeks as advised.",
      },
      {
        step: "04",
        title: "Retention Phase",
        description:
          "Custom retainers provided to stabilize teeth in their new positions once active alignment is complete.",
      },
    ],
    considerations: [
      "Aligners must be worn consistently for 20-22 hours per day to achieve planned results.",
      "Must be removed during eating, hot beverage consumption, and teeth brushing.",
      "Periodic progress monitoring ensures tooth movements stay on track.",
    ],
    icon: Smile,
    estimatedDuration: "30 – 45 mins per checkup",
  },
  {
    slug: "root-canal",
    name: "Root Canal Treatment",
    category: "Root Canal Treatment",
    shortDescription:
      "Endodontic cleaning and disinfection to eliminate deep pulp infection, relieve toothache, and preserve natural tooth structure.",
    overview:
      "Root canal therapy is performed when the internal pulp of a tooth becomes inflamed or infected due to deep decay, repeated dental procedures, or traumatic injury. The procedure removes bacteria and damaged tissue, cleanses the root canals, and seals them hermetically.",
    suitableFor: [
      "Severe or lingering tooth pain, especially when chewing or applying pressure",
      "Prolonged sensitivity to hot or cold temperatures",
      "Discoloration or darkening of an injured tooth",
      "Swelling, tenderness in the nearby gum, or deep cavities approaching the nerve",
    ],
    generalProcess: [
      {
        step: "01",
        title: "Targeted Diagnosis & Local Anesthesia",
        description:
          "Digital periapical radiographs identify the infection, followed by precise local anesthesia for comfort.",
      },
      {
        step: "02",
        title: "Canal Cleaning & Disinfection",
        description:
          "Microscopic rotary instruments thoroughly clean infected pulp tissue, shape the root canals, and disinfect the space.",
      },
      {
        step: "03",
        title: "Biocompatible Canal Sealing",
        description:
          "Canals are filled and sealed with gutta-percha to prevent bacterial re-entry.",
      },
      {
        step: "04",
        title: "Protective Crown Restoration",
        description:
          "A durable dental crown is placed to reinforce the treated tooth and restore full chewing capability.",
      },
    ],
    considerations: [
      "Most root-canal-treated back teeth require a crown to protect against future fracture.",
      "Mild tenderness for 24-48 hours post-treatment is normal and easily managed with standard analgesics.",
      "Preserving your natural tooth helps maintain normal biting force and jaw alignment.",
    ],
    icon: Microscope,
    estimatedDuration: "45 – 60 mins",
  },
  {
    slug: "cosmetic-dentistry",
    name: "Cosmetic Dentistry & Veneers",
    category: "Cosmetic Dentistry",
    shortDescription:
      "Ceramic veneers, composite bonding, and smile architecture designed to repair minor chips, spacing, and tooth discoloration.",
    overview:
      "Cosmetic dentistry combines artistic smile design with conservative dental materials to enhance the visual harmony of your teeth. Ultra-thin porcelain veneers and composite bonding correct imperfections while preserving maximum natural enamel.",
    suitableFor: [
      "Teeth that are chipped, worn down, or irregularly shaped",
      "Persistent internal staining that does not respond to surface whitening",
      "Minor gaps or slight asymmetry between front teeth",
      "Patients seeking an individualized, natural-looking smile enhancement",
    ],
    generalProcess: [
      {
        step: "01",
        title: "Aesthetic Smile Consultation",
        description:
          "Discussion of your aesthetic goals, smile line evaluation, and digital photo analysis.",
      },
      {
        step: "02",
        title: "Conservative Preparation & Mockup",
        description:
          "Minimal conservative enamel adjustment and temporary mockup to preview shape and contour.",
      },
      {
        step: "03",
        title: "Ceramic Fabrication",
        description:
          "Custom laboratory fabrication of ultra-thin, hand-finished ceramic veneers.",
      },
      {
        step: "04",
        title: "Permanent Adhesive Bonding",
        description:
          "Precision bonding of the veneers with specialized resin cements for a seamless, natural finish.",
      },
    ],
    considerations: [
      "Veneers require a thin layer of enamel removal to fit seamlessly.",
      "Avoiding biting directly into very hard items (like ice or hard shells) helps prolong longevity.",
      "Proper oral hygiene and night guards (if you grind your teeth) protect cosmetic restorations.",
    ],
    icon: Sparkles,
    estimatedDuration: "60 mins per visit",
  },
  {
    slug: "preventive-dentistry",
    name: "Preventive & Pediatric Dentistry",
    category: "Preventive Dentistry",
    shortDescription:
      "Gentle professional cleanings, fluoride applications, pit & fissure sealants, and routine monitoring for patients of all ages.",
    overview:
      "Preventive dentistry is the cornerstone of lifelong oral health. Routine scaling, polish, cavity detection, and child-friendly dental assessments help eliminate plaque, prevent decay, and intercept oral health issues before they become complex.",
    suitableFor: [
      "Children, adolescents, and adults needing routine 6-month checkups",
      "Patients wanting to prevent dental decay, gum inflammation, and enamel erosion",
      "Young patients benefiting from preventive sealants and friendly dental habit coaching",
      "Individuals experiencing mild plaque buildup or surface stain accumulation",
    ],
    generalProcess: [
      {
        step: "01",
        title: "Visual & Diagnostic Examination",
        description:
          "Thorough evaluation of teeth surfaces, gum margins, and bite relations.",
      },
      {
        step: "02",
        title: "Ultrasonic Scaling & Plaque Removal",
        description:
          "Gentle removal of hardened calculus (tartar) and bacterial plaque from above and below the gumline.",
      },
      {
        step: "03",
        title: "Polishing & Fluoride Application",
        description:
          "Polishing teeth surfaces to remove superficial stains, followed by enamel-strengthening fluoride varnish.",
      },
      {
        step: "04",
        title: "Personalized Home Care Guidance",
        description:
          "Practical recommendations on brushing technique, flossing, and diet for optimal dental wellness.",
      },
    ],
    considerations: [
      "Regular appointments every 6 months are strongly recommended for sustained oral health.",
      "Preventive cleanings are non-invasive, quick, and comfortable.",
      "Early cavity detection saves natural tooth enamel and prevents future pain.",
    ],
    icon: Baby,
    estimatedDuration: "30 – 40 mins",
  },
  {
    slug: "periodontal-care",
    name: "Periodontal Care & Gum Health",
    category: "Periodontal Care",
    shortDescription:
      "Targeted scaling, deep root planning, and microbial pocket cleaning to treat gum inflammation and restore tissue health.",
    overview:
      "Periodontal care addresses conditions affecting the supporting structures of the teeth, including gums and periodontal ligaments. Through non-surgical deep cleaning (scaling and root planing), bacterial colonies are cleared from deep periodontal pockets to arrest bone loss.",
    suitableFor: [
      "Individuals experiencing bleeding gums when brushing or flossing",
      "Persistent bad breath (halitosis) or tender, swollen gums",
      "Patients diagnosed with gingivitis or mild-to-moderate periodontitis",
      "Receding gumlines or loose teeth feeling unstable",
    ],
    generalProcess: [
      {
        step: "01",
        title: "Periodontal Pocket Charting",
        description:
          "Measurement of gum pocket depths around each tooth to identify specific areas of inflammation.",
      },
      {
        step: "02",
        title: "Subgingival Scaling",
        description:
          "Thorough removal of subgingival calculus and bacterial colonies beneath the gum margins.",
      },
      {
        step: "03",
        title: "Root Planing & Smoothing",
        description:
          "Smoothing rough root surfaces to encourage the gum tissue to firmly reattach to the tooth roots.",
      },
      {
        step: "04",
        title: "Maintenance & Re-Evaluation",
        description:
          "Follow-up visit 4-6 weeks later to re-measure pocket depths and verify gum healing.",
      },
    ],
    considerations: [
      "Managing gum disease requires active home oral hygiene alongside clinical care.",
      "Smokers and diabetic patients may require specialized periodontal maintenance intervals.",
      "Untreated gum infection can lead to gradual bone loss and premature tooth mobility.",
    ],
    icon: Activity,
    estimatedDuration: "45 mins",
  },
  {
    slug: "oral-surgery",
    name: "Oral Surgery & Wisdom Tooth Care",
    category: "Oral Surgery",
    shortDescription:
      "Safe, comfortable surgical extraction of impacted third molars and damaged teeth under gentle local anesthesia.",
    overview:
      "Oral surgery at TRUDENT focuses on the gentle removal of problematic teeth, particularly impacted or partially erupted wisdom teeth that cause recurring pain, crowding, or pericoronitis. Procedures follow strict surgical protocols to minimize trauma and promote fast recovery.",
    suitableFor: [
      "Impacted or misaligned wisdom teeth causing facial swelling, pain, or difficulty opening the jaw",
      "Third molars pushing against adjacent molars or trapping food debris",
      "Severely damaged or fractured teeth that cannot be restored through conservative means",
      "Patients needing orthodontic space creation under specialist direction",
    ],
    generalProcess: [
      {
        step: "01",
        title: "Radiographic Surgical Evaluation",
        description:
          "Digital panoramic imaging to assess the roots, angulation, and proximity to mandibular nerves.",
      },
      {
        step: "02",
        title: "Local Anesthesia & Site Preparation",
        description:
          "Administration of effective local anesthesia ensuring complete numbness of the surgical area.",
      },
      {
        step: "03",
        title: "Gentle Tooth Removal",
        description:
          "Careful sectioning and removal of the tooth while preserving surrounding bone and soft tissue.",
      },
      {
        step: "04",
        title: "Hemostasis & Post-Op Guidance",
        description:
          "Placement of sterile gauze or dissolvable sutures, followed by comprehensive oral instructions and follow-up support.",
      },
    ],
    considerations: [
      "Following post-extraction care instructions (ice packs, soft diet, avoiding straws) ensures swift healing.",
      "Mild post-procedure swelling typically peaks within 48 hours and resolves steadily.",
      "Arranging convenient transportation on the day of surgical extraction is helpful.",
    ],
    icon: Zap,
    estimatedDuration: "45 – 60 mins",
  },
  {
    slug: "teeth-whitening",
    name: "Professional Teeth Whitening",
    category: "Cosmetic Dentistry",
    shortDescription:
      "Safe, in-office dental whitening formulated to lighten enamel and lift deep stains without weakening tooth structure.",
    overview:
      "Professional dental whitening uses controlled concentrations of dental-grade whitening agents applied in an isolated clinical setting. Protective barriers shield the gums, ensuring a safe, comfortable procedure that noticeably brightens stained or yellowed enamel.",
    suitableFor: [
      "Teeth discolored by coffee, tea, red wine, tobacco, or natural aging",
      "Patients preparing for special events, weddings, or professional milestones",
      "Adults with healthy gums and intact enamel wanting a brighter smile",
      "Individuals desiring faster, safer, and more noticeable results than drugstore strips",
    ],
    generalProcess: [
      {
        step: "01",
        title: "Shade Analysis & Polish",
        description:
          "Recording baseline tooth shade and lightly polishing tooth surfaces to remove external debris.",
      },
      {
        step: "02",
        title: "Gingival Barrier Protection",
        description:
          "Applying a light-cured barrier along the gumline to protect delicate soft tissues from the whitening gel.",
      },
      {
        step: "03",
        title: "Whitening Gel Application",
        description:
          "Application of whitening gel in 15-minute intervals with LED light illumination.",
      },
      {
        step: "04",
        title: "Final Shade Evaluation & Desensitizing",
        description:
          "Rinsing, evaluating the brightened shade, and applying a soothing desensitizing treatment to protect enamel.",
      },
    ],
    considerations: [
      "Whitening only affects natural tooth enamel; existing composite fillings and ceramic crowns do not change shade.",
      "Mild transient sensitivity may occur for 24 hours following treatment.",
      "Maintaining good brushing habits and minimizing stain-causing foods helps retain brightness longer.",
    ],
    icon: Flame,
    estimatedDuration: "45 mins",
  },
];
