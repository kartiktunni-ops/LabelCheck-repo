export const HOME_STATS = [
  { value: '12,480+', label: 'Products Verified' },
  { value: '2,150+', label: 'Violations Detected' },
  { value: '34', label: 'States & UTs Covered' },
  { value: '98.6%', label: 'Detection Accuracy' },
]

export const HERO_QUICK_FEATURES = [
  { icon: 'shield', title: 'Rule-Based', description: 'Verification per Legal Metrology Rules' },
  { icon: 'scan', title: 'AI-Powered OCR', description: 'Reads every label field automatically' },
  { icon: 'bolt', title: 'Instant Results', description: 'Compliant / Non-compliant, right away' },
  { icon: 'download', title: 'Detailed Report', description: 'Download & share the findings' },
]

export const HERO_SAMPLE_RESULT = {
  name: 'Sample Product',
  status: 'Compliant',
  note: 'All mandatory declarations present',
  rows: [
    { label: 'MRP', value: '₹58.00' },
    { label: 'Net Qty', value: '500 g' },
    { label: 'Mfg. Date', value: '02/2026' },
    { label: 'Batch No.', value: 'C19K02' },
  ],
}

export const HOME_FEATURES = [
  {
    title: 'AI-Powered Label Reading',
    description:
      'Computer vision extracts every declaration from a product label image — no manual data entry required.',
    icon: 'scan',
  },
  {
    title: 'Rule-Based Compliance Engine',
    description:
      'Every extracted field is checked against the Legal Metrology (Packaged Commodities) Rules, 2011 in real time.',
    icon: 'shield',
  },
  {
    title: 'Instant Violation Reports',
    description:
      'Get a clear, rule-referenced breakdown of what is missing or incorrect — ready to act on immediately.',
    icon: 'flag',
  },
  {
    title: 'Built for Everyone',
    description:
      'Designed for consumers, retailers, manufacturers and enforcement officers alike, in one shared system.',
    icon: 'users',
  },
]

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Upload the Product Label',
    description:
      'Take a photo or upload an image of the packaged commodity label — front and back panels supported.',
  },
  {
    step: '02',
    title: 'AI Extracts Declarations',
    description:
      'Our OCR + vision model identifies MRP, net quantity, dates, batch numbers and all other mandatory fields.',
  },
  {
    step: '03',
    title: 'Cross-Check Against Rules',
    description:
      'Each field is validated against the Legal Metrology (Packaged Commodities) Rules, 2011, clause by clause.',
  },
  {
    step: '04',
    title: 'Get an Actionable Report',
    description:
      'Receive a compliant / non-compliant verdict with exact rule references for any violation found.',
  },
]

export const RULE_SECTIONS = [
  {
    rule: 'Rule 6',
    title: 'Mandatory Declarations on Every Package',
    points: [
      'Name and address of the manufacturer / packer / importer',
      'Common or generic name of the commodity',
      'Net quantity in standard units (weight, volume or number)',
      'Month and year of manufacture, packing or import',
      'Retail sale price, inclusive of all taxes (MRP)',
      'Consumer care name, address, telephone number / email',
    ],
  },
  {
    rule: 'Rule 8',
    title: 'Manner of Declaration of Net Quantity',
    points: [
      'Net quantity must be declared in metric units',
      'Where the commodity is sold by number, the number must be stated',
      'Declaration must be in a single, uninterrupted line, distinct from other information',
    ],
  },
  {
    rule: 'Rule 18',
    title: 'Size, Placement & Legibility of Declarations',
    points: [
      'Minimum font size scales with the maximum package dimension',
      'Declarations must be in a conspicuous, contrasting location',
      'No mandatory declaration may be obscured by other printed matter or the price sticker',
    ],
  },
  {
    rule: 'Rule 27',
    title: 'Additional Declarations for Imported Packages',
    points: [
      'Country of origin / manufacture / assembly',
      'Name and address of the importer',
      'Conversion of imported units into Indian standard units',
    ],
  },
]

export const GUIDELINES = [
  {
    title: 'For Manufacturers & Packers',
    items: [
      'Verify all eight mandatory declarations before final packaging approval',
      'Use a minimum 1mm font height for packages up to 100 sq. cm of label area',
      'Keep MRP and net quantity declarations in the same field of vision',
      'Update batch numbers for every production run without exception',
    ],
  },
  {
    title: 'For Retailers',
    items: [
      'Do not accept stock with missing or tampered declarations',
      'Re-verify labels seasonally using the Compliance Checker scanner',
      'Report suspected violations through the in-app grievance flow',
    ],
  },
  {
    title: 'For Consumers',
    items: [
      'Scan any packaged product before purchase to confirm compliance',
      'MRP shown must always be inclusive of all taxes — no exceptions',
      'Use the Contact Us page to escalate unresolved violations',
    ],
  },
]
