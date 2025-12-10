export interface Entity {
  id: string;
  name: string;
  type: "Private" | "Government" | "Public" | "Military";
  headquarters: string;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  tags: string[];
  founded: string;
  employees: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  logo?: string;
}

export const mockEntities: Entity[] = [
  {
    id: "1",
    name: "Palantir Technologies",
    type: "Private",
    headquarters: "Denver, Colorado, USA",
    coordinates: [39.7392, -104.9903],
    description: "Specializes in big data analytics, serving government agencies and financial institutions with predictive policing and surveillance tools.",
    tags: ["Big Data", "Predictive Policing", "Intelligence", "Defense"],
    founded: "2003",
    employees: "3,000+",
    riskLevel: "Critical"
  },
  {
    id: "2",
    name: "NSO Group",
    type: "Private",
    headquarters: "Herzliya, Israel",
    coordinates: [32.1624, 34.8447],
    description: "Cyber-intelligence firm known for developing the Pegasus spyware, capable of remote zero-click surveillance of smartphones.",
    tags: ["Spyware", "Cyber Intelligence", "Mobile Surveillance"],
    founded: "2010",
    employees: "700+",
    riskLevel: "Critical"
  },
  {
    id: "3",
    name: "Clearview AI",
    type: "Private",
    headquarters: "New York, USA",
    coordinates: [40.7128, -74.0060],
    description: "Facial recognition company that scrapes images from social media to build a massive biometric database for law enforcement.",
    tags: ["Facial Recognition", "Biometrics", "Scraping", "AI"],
    founded: "2017",
    employees: "50+",
    riskLevel: "High"
  },
  {
    id: "4",
    name: "Hikvision",
    type: "Public",
    headquarters: "Hangzhou, China",
    coordinates: [30.2741, 120.1551],
    description: "State-backed manufacturer of video surveillance equipment, implicated in mass surveillance programs.",
    tags: ["CCTV", "Hardware", "Facial Recognition", "Smart Cities"],
    founded: "2001",
    employees: "40,000+",
    riskLevel: "High"
  },
  {
    id: "5",
    name: "Cellebrite",
    type: "Public",
    headquarters: "Petah Tikva, Israel",
    coordinates: [32.0840, 34.8878],
    description: "Digital intelligence company providing tools for mobile forensics and data extraction to law enforcement agencies.",
    tags: ["Forensics", "Mobile Extraction", "Digital Intelligence"],
    founded: "1999",
    employees: "1,000+",
    riskLevel: "Medium"
  },
  {
    id: "6",
    name: "Axon Enterprise",
    type: "Public",
    headquarters: "Scottsdale, Arizona, USA",
    coordinates: [33.4942, -111.9261],
    description: "Develops Tasers, body cameras, and evidence management software (Evidence.com) for police forces worldwide.",
    tags: ["Body Cameras", "Law Enforcement", "Cloud Storage"],
    founded: "1993",
    employees: "2,000+",
    riskLevel: "Medium"
  },
  {
    id: "7",
    name: "SenseTime",
    type: "Public",
    headquarters: "Hong Kong",
    coordinates: [22.3193, 114.1694],
    description: "AI company focusing on computer vision and deep learning, providing technology for facial recognition and autonomous driving.",
    tags: ["AI", "Computer Vision", "Facial Recognition"],
    founded: "2014",
    employees: "5,000+",
    riskLevel: "High"
  },
  {
    id: "8",
    name: "Ring (Amazon)",
    type: "Private",
    headquarters: "Santa Monica, California, USA",
    coordinates: [34.0195, -118.4912],
    description: "Home security company known for its video doorbells and partnerships with police departments for video sharing.",
    tags: ["Home Security", "IoT", "Police Partnerships"],
    founded: "2013",
    employees: "1,000+",
    riskLevel: "Medium"
  },
  {
    id: "9",
    name: "Gaza Systems",
    type: "Military",
    headquarters: "Unknown",
    coordinates: [34.50, 69.20], // Random location (Kabulish) for visual interest
    description: "Hypothetical military contractor specializing in drone surveillance grids and autonomous perimeter defense.",
    tags: ["Drones", "Autonomous Systems", "Defense"],
    founded: "2018",
    employees: "200+",
    riskLevel: "Critical"
  },
  {
    id: "10",
    name: "Dataminr",
    type: "Private",
    headquarters: "New York, USA",
    coordinates: [40.7528, -73.9860], // Slightly offset from Clearview
    description: "AI platform that analyzes public social media data to provide real-time alerts to news, finance, and public sector clients.",
    tags: ["Social Media Intelligence", "Real-time Alerts", "AI"],
    founded: "2009",
    employees: "800+",
    riskLevel: "Medium"
  }
];
