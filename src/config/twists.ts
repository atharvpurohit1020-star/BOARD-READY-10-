export interface Twist {
  id: string;
  name: string;
  description: string;
  exampleContext: string;
}

export const TWISTS: Twist[] = [
  {
    id: 'real_life_indian',
    name: 'Real-Life Indian Context',
    description: 'Ground the scenario in authentic Indian contexts: ISRO missions, Vande Bharat trains, UPI transactions, rooftop solar subsidies, monsoon rainfall data, Diwali electric lighting, farming crop cycles, or cricket analytics.',
    exampleContext: 'e.g. A farmer in Punjab designing drip irrigation; ISRO calculating satellite orbit time.',
  },
  {
    id: 'data_table',
    name: 'Data Table & Tabular Analysis',
    description: 'Present data in a neat table requiring the student to extract patterns, ratios, or trends before computing the answer.',
    exampleContext: 'e.g. Table of resistance vs temperature, or demographic transition rates in three Indian states.',
  },
  {
    id: 'graph_reading',
    name: 'Graph / Circuit / Geometric Diagram Reading',
    description: 'Require visual interpretation of an SVG circuit diagram, ray diagram, velocity-time graph, or coordinate plane.',
    exampleContext: 'e.g. Reading I-V characteristic curve or Snell’s law refraction boundary.',
  },
  {
    id: 'reverse_problem',
    name: 'Reverse Problem',
    description: 'Provide the final result or output, and ask for the initial parameters, boundary value, or missing coefficient.',
    exampleContext: 'e.g. Given the mode and median of a frequency table, find missing frequencies $x$ and $y$.',
  },
  {
    id: 'multi_concept_link',
    name: 'Multi-Concept Link',
    description: 'Connect two distinct syllabus topics in a single problem (e.g. Arithmetic Progression with Coordinate Geometry, or Ohm’s law with Joule’s heating).',
    exampleContext: 'e.g. Coordinates of vertices forming an AP of distances.',
  },
  {
    id: 'error_spotting',
    name: 'Error-Spotting / Student Work Analysis',
    description: 'Show an incorrect step or reasoning made by a fictitious student (e.g. "Rohan solved the quadratic equation as follows...") and ask to spot the misconception and rectify it.',
    exampleContext: 'e.g. Rohan forgot that distance cannot be negative; identify the flaw in step 3.',
  },
  {
    id: 'what_if_change',
    name: 'What-If Parameter Change',
    description: 'Ask what happens to the output when one physical parameter or geometric property is doubled, halved, or reversed.',
    exampleContext: 'e.g. If wire length is doubled and radius is halved, how does resistance change?',
  },
  {
    id: 'assertion_misconception',
    name: 'Assertion Built on Common Misconception',
    description: 'Design the Reason or distractor around the exact intuitive mistake Class 10 students frequently make.',
    exampleContext: 'e.g. Confusing focal length sign convention for convex vs concave mirror.',
  },
];
