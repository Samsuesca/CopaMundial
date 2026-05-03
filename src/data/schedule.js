// Calendario oficial FIFA World Cup 2026 — fechas, kickoffs locales y sedes
// Sources:
//   - https://en.wikipedia.org/wiki/2026_FIFA_World_Cup
//   - https://inside.fifa.com/organisation/media-releases/updated-world-cup-2026-match-schedule
//   - https://worldcupwiki.com/schedule/
//   - https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026

export const STADIUMS = {
  // United States (11 sedes)
  ATL:  { stadium: "Mercedes-Benz Stadium",   city: "Atlanta",          country: "USA",    countryFlag: "🇺🇸", capacity: 75000 },
  BOS:  { stadium: "Gillette Stadium",        city: "Foxborough",       country: "USA",    countryFlag: "🇺🇸", capacity: 65000 },
  DAL:  { stadium: "AT&T Stadium",            city: "Arlington",        country: "USA",    countryFlag: "🇺🇸", capacity: 94000 },
  HOU:  { stadium: "NRG Stadium",             city: "Houston",          country: "USA",    countryFlag: "🇺🇸", capacity: 72000 },
  KAN:  { stadium: "Arrowhead Stadium",       city: "Kansas City",      country: "USA",    countryFlag: "🇺🇸", capacity: 73000 },
  LAX:  { stadium: "SoFi Stadium",            city: "Inglewood",        country: "USA",    countryFlag: "🇺🇸", capacity: 70000 },
  MIA:  { stadium: "Hard Rock Stadium",       city: "Miami Gardens",    country: "USA",    countryFlag: "🇺🇸", capacity: 65000 },
  NYNJ: { stadium: "MetLife Stadium",         city: "East Rutherford",  country: "USA",    countryFlag: "🇺🇸", capacity: 82500 },
  PHI:  { stadium: "Lincoln Financial Field", city: "Philadelphia",     country: "USA",    countryFlag: "🇺🇸", capacity: 69000 },
  SEA:  { stadium: "Lumen Field",             city: "Seattle",          country: "USA",    countryFlag: "🇺🇸", capacity: 69000 },
  SFO:  { stadium: "Levi's Stadium",          city: "Santa Clara",      country: "USA",    countryFlag: "🇺🇸", capacity: 71000 },
  // Mexico (3 sedes)
  MEX:  { stadium: "Estadio Azteca",          city: "Ciudad de México", country: "México", countryFlag: "🇲🇽", capacity: 83000 },
  GDL:  { stadium: "Estadio Akron",           city: "Guadalajara",      country: "México", countryFlag: "🇲🇽", capacity: 48000 },
  MTY:  { stadium: "Estadio BBVA",            city: "Monterrey",        country: "México", countryFlag: "🇲🇽", capacity: 53500 },
  // Canadá (2 sedes)
  TOR:  { stadium: "BMO Field",               city: "Toronto",          country: "Canadá", countryFlag: "🇨🇦", capacity: 45000 },
  VAN:  { stadium: "BC Place",                city: "Vancouver",        country: "Canadá", countryFlag: "🇨🇦", capacity: 54000 },
};

// Group stage: indexado por matchId del simulator (`G{groupId}-{1..6}`)
// Mapping del simulator: índice 1=[0,1], 2=[2,3], 3=[0,2], 4=[1,3], 5=[0,3], 6=[1,2]
// (matchdays: 1-2=MD1, 3-4=MD2, 5-6=MD3)
export const GROUP_SCHEDULE = {
  // ===== Group A: MEX, RSA, KOR, PLAYOFF_UEFA_D (CZE) =====
  "GA-1": { date: "2026-06-11", kickoff: "12:00", venue: "MEX" },  // MEX vs RSA — apertura
  "GA-2": { date: "2026-06-11", kickoff: "21:00", venue: "GDL" },  // KOR vs CZE
  "GA-3": { date: "2026-06-18", kickoff: "20:00", venue: "GDL" },  // MEX vs KOR
  "GA-4": { date: "2026-06-18", kickoff: "12:00", venue: "ATL" },  // RSA vs CZE
  "GA-5": { date: "2026-06-24", kickoff: "20:00", venue: "MEX" },  // MEX vs CZE
  "GA-6": { date: "2026-06-24", kickoff: "21:00", venue: "MTY" },  // RSA vs KOR

  // ===== Group B: CAN, PLAYOFF_UEFA_A (BIH), QAT, SUI =====
  "GB-1": { date: "2026-06-12", kickoff: "15:00", venue: "TOR" },  // CAN vs BIH
  "GB-2": { date: "2026-06-13", kickoff: "12:00", venue: "SFO" },  // QAT vs SUI
  "GB-3": { date: "2026-06-18", kickoff: "15:00", venue: "VAN" },  // CAN vs QAT
  "GB-4": { date: "2026-06-18", kickoff: "12:00", venue: "LAX" },  // BIH vs SUI
  "GB-5": { date: "2026-06-24", kickoff: "12:00", venue: "VAN" },  // CAN vs SUI
  "GB-6": { date: "2026-06-24", kickoff: "12:00", venue: "SEA" },  // BIH vs QAT

  // ===== Group C: BRA, MAR, HAI, SCO =====
  "GC-1": { date: "2026-06-13", kickoff: "18:00", venue: "NYNJ" }, // BRA vs MAR
  "GC-2": { date: "2026-06-13", kickoff: "21:00", venue: "BOS" },  // HAI vs SCO
  "GC-3": { date: "2026-06-19", kickoff: "20:30", venue: "PHI" },  // BRA vs HAI
  "GC-4": { date: "2026-06-19", kickoff: "18:00", venue: "BOS" },  // MAR vs SCO
  "GC-5": { date: "2026-06-24", kickoff: "18:00", venue: "MIA" },  // BRA vs SCO
  "GC-6": { date: "2026-06-24", kickoff: "18:00", venue: "ATL" },  // MAR vs HAI

  // ===== Group D: USA, PAR, AUS, PLAYOFF_UEFA_C (TUR) =====
  "GD-1": { date: "2026-06-12", kickoff: "18:00", venue: "LAX" },  // USA vs PAR
  "GD-2": { date: "2026-06-13", kickoff: "21:00", venue: "VAN" },  // AUS vs TUR
  "GD-3": { date: "2026-06-19", kickoff: "12:00", venue: "SEA" },  // USA vs AUS
  "GD-4": { date: "2026-06-19", kickoff: "20:00", venue: "SFO" },  // PAR vs TUR
  "GD-5": { date: "2026-06-25", kickoff: "19:00", venue: "LAX" },  // USA vs TUR
  "GD-6": { date: "2026-06-25", kickoff: "19:00", venue: "SFO" },  // PAR vs AUS

  // ===== Group E: GER, CUW, CIV, ECU =====
  "GE-1": { date: "2026-06-14", kickoff: "12:00", venue: "HOU" },  // GER vs CUW
  "GE-2": { date: "2026-06-14", kickoff: "19:00", venue: "PHI" },  // CIV vs ECU
  "GE-3": { date: "2026-06-20", kickoff: "16:00", venue: "TOR" },  // GER vs CIV
  "GE-4": { date: "2026-06-20", kickoff: "19:00", venue: "KAN" },  // CUW vs ECU
  "GE-5": { date: "2026-06-25", kickoff: "16:00", venue: "NYNJ" }, // GER vs ECU
  "GE-6": { date: "2026-06-25", kickoff: "16:00", venue: "PHI" },  // CUW vs CIV

  // ===== Group F: NED, JPN, PLAYOFF_UEFA_B (SWE), TUN =====
  "GF-1": { date: "2026-06-14", kickoff: "15:00", venue: "DAL" },  // NED vs JPN
  "GF-2": { date: "2026-06-14", kickoff: "21:00", venue: "MTY" },  // SWE vs TUN
  "GF-3": { date: "2026-06-20", kickoff: "12:00", venue: "HOU" },  // NED vs SWE
  "GF-4": { date: "2026-06-20", kickoff: "21:00", venue: "MTY" },  // JPN vs TUN
  "GF-5": { date: "2026-06-25", kickoff: "19:00", venue: "KAN" },  // NED vs TUN
  "GF-6": { date: "2026-06-25", kickoff: "19:00", venue: "DAL" },  // JPN vs SWE

  // ===== Group G: BEL, EGY, IRN, NZL =====
  "GG-1": { date: "2026-06-15", kickoff: "12:00", venue: "SEA" },  // BEL vs EGY
  "GG-2": { date: "2026-06-15", kickoff: "18:00", venue: "LAX" },  // IRN vs NZL
  "GG-3": { date: "2026-06-21", kickoff: "12:00", venue: "LAX" },  // BEL vs IRN
  "GG-4": { date: "2026-06-21", kickoff: "18:00", venue: "VAN" },  // EGY vs NZL
  "GG-5": { date: "2026-06-26", kickoff: "20:00", venue: "VAN" },  // BEL vs NZL
  "GG-6": { date: "2026-06-26", kickoff: "20:00", venue: "SEA" },  // EGY vs IRN

  // ===== Group H: ESP, CPV, KSA, URU =====
  "GH-1": { date: "2026-06-15", kickoff: "12:00", venue: "ATL" },  // ESP vs CPV
  "GH-2": { date: "2026-06-15", kickoff: "18:00", venue: "MIA" },  // KSA vs URU
  "GH-3": { date: "2026-06-21", kickoff: "12:00", venue: "ATL" },  // ESP vs KSA
  "GH-4": { date: "2026-06-21", kickoff: "18:00", venue: "MIA" },  // CPV vs URU
  "GH-5": { date: "2026-06-26", kickoff: "20:00", venue: "GDL" },  // ESP vs URU
  "GH-6": { date: "2026-06-26", kickoff: "19:00", venue: "HOU" },  // CPV vs KSA

  // ===== Group I: FRA, SEN, PLAYOFF_IC_2 (IRQ), NOR =====
  "GI-1": { date: "2026-06-16", kickoff: "15:00", venue: "NYNJ" }, // FRA vs SEN
  "GI-2": { date: "2026-06-16", kickoff: "18:00", venue: "BOS" },  // IRQ vs NOR
  "GI-3": { date: "2026-06-22", kickoff: "17:00", venue: "PHI" },  // FRA vs IRQ
  "GI-4": { date: "2026-06-22", kickoff: "20:00", venue: "NYNJ" }, // SEN vs NOR
  "GI-5": { date: "2026-06-26", kickoff: "15:00", venue: "BOS" },  // FRA vs NOR
  "GI-6": { date: "2026-06-26", kickoff: "15:00", venue: "TOR" },  // SEN vs IRQ

  // ===== Group J: ARG, ALG, AUT, JOR =====
  "GJ-1": { date: "2026-06-16", kickoff: "20:00", venue: "KAN" },  // ARG vs ALG
  "GJ-2": { date: "2026-06-16", kickoff: "21:00", venue: "SFO" },  // AUT vs JOR
  "GJ-3": { date: "2026-06-22", kickoff: "12:00", venue: "DAL" },  // ARG vs AUT
  "GJ-4": { date: "2026-06-22", kickoff: "20:00", venue: "SFO" },  // ALG vs JOR
  "GJ-5": { date: "2026-06-27", kickoff: "21:00", venue: "DAL" },  // ARG vs JOR
  "GJ-6": { date: "2026-06-27", kickoff: "21:00", venue: "KAN" },  // ALG vs AUT

  // ===== Group K: POR, PLAYOFF_IC_1 (COD), UZB, COL =====
  "GK-1": { date: "2026-06-17", kickoff: "12:00", venue: "HOU" },  // POR vs COD
  "GK-2": { date: "2026-06-17", kickoff: "21:00", venue: "MEX" },  // UZB vs COL
  "GK-3": { date: "2026-06-23", kickoff: "12:00", venue: "HOU" },  // POR vs UZB
  "GK-4": { date: "2026-06-23", kickoff: "21:00", venue: "GDL" },  // COD vs COL
  "GK-5": { date: "2026-06-27", kickoff: "19:30", venue: "MIA" },  // POR vs COL
  "GK-6": { date: "2026-06-27", kickoff: "19:30", venue: "ATL" },  // COD vs UZB

  // ===== Group L: ENG, CRO, GHA, PAN =====
  "GL-1": { date: "2026-06-17", kickoff: "15:00", venue: "DAL" },  // ENG vs CRO
  "GL-2": { date: "2026-06-17", kickoff: "19:00", venue: "TOR" },  // GHA vs PAN
  "GL-3": { date: "2026-06-23", kickoff: "16:00", venue: "BOS" },  // ENG vs GHA
  "GL-4": { date: "2026-06-23", kickoff: "19:00", venue: "TOR" },  // CRO vs PAN
  "GL-5": { date: "2026-06-27", kickoff: "17:00", venue: "NYNJ" }, // ENG vs PAN
  "GL-6": { date: "2026-06-27", kickoff: "17:00", venue: "PHI" },  // CRO vs GHA
};

export const KNOCKOUT_SCHEDULE = {
  // Round of 32: jun 28 – jul 3
  "R32-1":  { date: "2026-06-28", kickoff: "15:00", venue: "LAX"  },
  "R32-2":  { date: "2026-06-29", kickoff: "16:30", venue: "BOS"  },
  "R32-3":  { date: "2026-06-29", kickoff: "21:00", venue: "MTY"  },
  "R32-4":  { date: "2026-06-29", kickoff: "13:00", venue: "HOU"  },
  "R32-5":  { date: "2026-06-30", kickoff: "17:00", venue: "NYNJ" },
  "R32-6":  { date: "2026-06-30", kickoff: "13:00", venue: "DAL"  },
  "R32-7":  { date: "2026-06-30", kickoff: "19:00", venue: "MEX"  },
  "R32-8":  { date: "2026-07-01", kickoff: "12:00", venue: "ATL"  },
  "R32-9":  { date: "2026-07-01", kickoff: "20:00", venue: "SFO"  },
  "R32-10": { date: "2026-07-01", kickoff: "16:00", venue: "SEA"  },
  "R32-11": { date: "2026-07-02", kickoff: "19:00", venue: "TOR"  },
  "R32-12": { date: "2026-07-02", kickoff: "15:00", venue: "LAX"  },
  "R32-13": { date: "2026-07-02", kickoff: "20:00", venue: "VAN"  },
  "R32-14": { date: "2026-07-03", kickoff: "18:00", venue: "MIA"  },
  "R32-15": { date: "2026-07-03", kickoff: "21:30", venue: "KAN"  },
  "R32-16": { date: "2026-07-03", kickoff: "14:00", venue: "DAL"  },

  // Round of 16: jul 4 – jul 7
  "R16-1": { date: "2026-07-04", kickoff: "17:00", venue: "PHI"  },
  "R16-2": { date: "2026-07-04", kickoff: "13:00", venue: "HOU"  },
  "R16-3": { date: "2026-07-05", kickoff: "16:00", venue: "NYNJ" },
  "R16-4": { date: "2026-07-05", kickoff: "19:00", venue: "MEX"  },
  "R16-5": { date: "2026-07-06", kickoff: "15:00", venue: "DAL"  },
  "R16-6": { date: "2026-07-06", kickoff: "17:00", venue: "SEA"  },
  "R16-7": { date: "2026-07-07", kickoff: "12:00", venue: "ATL"  },
  "R16-8": { date: "2026-07-07", kickoff: "13:00", venue: "VAN"  },

  // Quarterfinals: jul 9 – jul 11 (USA only)
  "QF-1": { date: "2026-07-09", kickoff: "16:00", venue: "BOS" },
  "QF-2": { date: "2026-07-10", kickoff: "15:00", venue: "LAX" },
  "QF-3": { date: "2026-07-11", kickoff: "17:00", venue: "MIA" },
  "QF-4": { date: "2026-07-11", kickoff: "21:00", venue: "KAN" },

  // Semifinals: jul 14 – jul 15
  "SF-1": { date: "2026-07-14", kickoff: "15:00", venue: "DAL" },
  "SF-2": { date: "2026-07-15", kickoff: "15:00", venue: "ATL" },

  // 3er Puesto: jul 18
  "3rdPlace": { date: "2026-07-18", kickoff: "17:00", venue: "MIA" },

  // Final: jul 19
  "Final": { date: "2026-07-19", kickoff: "15:00", venue: "NYNJ" },
};

// Helper: formatea fecha YYYY-MM-DD a "Jun 11" (es-MX)
export const formatMatchDate = (dateStr) => {
  if (!dateStr) return "";
  const [, m, d] = dateStr.split("-").map(Number);
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${d} ${months[m - 1]}`;
};

export const getMatchSchedule = (matchId) =>
  GROUP_SCHEDULE[matchId] || KNOCKOUT_SCHEDULE[matchId] || null;

export const getStadiumInfo = (venueKey) => STADIUMS[venueKey] || null;
