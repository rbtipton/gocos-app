export const projects = [
  {
    id: '01', theme: 'pfas', status: 'active', progress: 75,
    title: 'Caribbean PFAS Distribution and Source Mapping',
    desc: 'Multi-station survey of PFAS compounds across the Lesser Antilles island arc, USVI, Puerto Rico, and the Bahamas. Peer-reviewed findings published.',
  },
  {
    id: '02', theme: 'pfas', status: 'active', progress: 45,
    title: 'PFAS Temporal Variability in the Eastern Caribbean',
    desc: 'Repeat sampling at six anchor stations to characterize seasonal and interannual variation in PFAS concentrations related to weather patterns and shipping.',
  },
  {
    id: '03', theme: 'pfas', status: 'active', progress: 30,
    title: 'PFAS Depth-Profile Analysis — Lesser Antilles',
    desc: 'Vertical water column sampling from surface to 200m at four stations to determine whether PFAS accumulates at thermocline boundaries.',
  },
  {
    id: '04', theme: 'pfas', status: 'planning', progress: 10,
    title: 'PFAS Bioaccumulation in Caribbean Marine Organisms',
    desc: 'Assessment of PFAS accumulation in fish tissue, coral mucus, and mangrove sediments. Partnership with regional fisheries agencies.',
  },
  {
    id: '05', theme: 'pfas', status: 'proposed', progress: 0,
    title: 'PFAS Source Attribution Using Isotopic Fingerprinting',
    desc: 'Advanced isotopic analysis to distinguish firefighting foam, industrial, and agricultural PFAS sources across the Eastern Caribbean basin.',
  },
  {
    id: '06', theme: 'bio', status: 'active', progress: 60,
    title: 'Lesser Antilles Coral Reef Health Monitoring',
    desc: 'Transect surveys at 12 reef sites correlating coral bleaching incidence and percent cover with PFAS and microplastics contamination levels.',
  },
  {
    id: '07', theme: 'bio', status: 'planning', progress: 15,
    title: 'Caribbean Seagrass and Mangrove Mapping',
    desc: 'Aerial and in-water survey of seagrass meadows and mangrove systems as contamination sinks and nursery habitat indicators.',
  },
  {
    id: '08', theme: 'bio', status: 'proposed', progress: 0,
    title: 'Marine Mammal Distribution and Contamination Exposure',
    desc: 'Opportunistic cetacean observation during R/V Dawn expeditions. Exposure risk modeling using PFAS distribution maps.',
  },
  {
    id: '09', theme: 'tech', status: 'active', progress: 40,
    title: 'Low-Cost Sensor Buoy Network',
    desc: 'Development and deployment of open-hardware oceanographic buoys transmitting real-time salinity, temperature, and optical turbidity data via satellite.',
  },
  {
    id: '10', theme: 'tech', status: 'active', progress: 65,
    title: 'MITgcm Contamination Transport Modeling',
    desc: 'UNC Charlotte undergraduate researchers developing open-source MIT General Circulation Model configurations for Caribbean PFAS and microplastics transport prediction.',
  },
  {
    id: '11', theme: 'edu', status: 'active', progress: 50,
    title: 'Caribbean Island Community Water Quality Citizen Science',
    desc: 'Mobile-based citizen science platform enabling island residents, fishing communities, and coastal agencies to report water quality observations feeding the GOCOS dataset.',
  },
  {
    id: '12', theme: 'edu', status: 'active', progress: 80,
    title: 'Undergraduate Research Expedition Immersion Program',
    desc: 'UNC Charlotte undergraduates participate in Caribbean expeditions aboard R/V Dawn, conducting real sampling and contributing to peer-reviewed publications.',
  },
  {
    id: '13', theme: 'tech', status: 'active', progress: 35,
    title: 'GOCOS Open-Source Software Platform',
    desc: 'Development of the Global Ocean Contamination Open-Source Ecosystem: mobile app, REST API, FAIR data repository, and model repository. NSF PESOSE Track 1 proposal submitted.',
  },
  {
    id: '14', theme: 'mp', status: 'active', progress: 70,
    title: 'Caribbean Surface Microplastics Density Mapping',
    desc: 'Manta trawl microplastics sampling across 18 stations. Particle size fractionation, polymer identification by FTIR, and density mapping. Publication in preparation.',
  },
  {
    id: '15', theme: 'mp', status: 'planning', progress: 20,
    title: 'Microplastics in Caribbean Fisheries and Seafood',
    desc: 'Tissue sampling of commercially important Caribbean fish species for microplastic ingestion. Public health relevance for island fishing communities.',
  },
  {
    id: '16', theme: 'mp', status: 'proposed', progress: 0,
    title: 'Plastic Debris Gyre Accumulation Modeling',
    desc: 'Integration of R/V Dawn surface density data with Caribbean current climatology to model plastic debris accumulation zones across the island arc.',
  },
  {
    id: '17', theme: 'mp', status: 'active', progress: 55,
    title: 'Vessel Antifouling and Gear as Microplastic Sources',
    desc: 'Quantification of microplastic fiber and paint particle release from antifouling hull coatings, synthetic fishing lines, and dock lines in Caribbean marinas.',
  },
  {
    id: '18', theme: 'edu', status: 'planning', progress: 25,
    title: 'Caribbean K–12 Ocean Science Curriculum',
    desc: 'Development of standards-aligned ocean contamination science modules for primary and secondary schools across eight Eastern Caribbean island nations.',
  },
]

export const themes = {
  pfas: { label: 'PFAS Research',     color: '#00B4D8' },
  mp:   { label: 'Microplastics',     color: '#A29BFE' },
  bio:  { label: 'Biodiversity',      color: '#55EFC4' },
  tech: { label: 'Technology',        color: '#74B9FF' },
  edu:  { label: 'Education',         color: '#FFA07A' },
}
