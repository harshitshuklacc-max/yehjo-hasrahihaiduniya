export type PersonToMatch = {
  userId: string;
  name: string;
  role: "STUDENT" | "TEACHER";
};

export type MatchedPerson = PersonToMatch & {
  matchedName: string;
};

function normalizeText(text: string) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function nameAppearsInText(name: string, pdfText: string) {
  const normalizedName = normalizeText(name);
  if (normalizedName.length < 2) return false;

  const normalizedPdf = normalizeText(pdfText);
  if (normalizedPdf.includes(normalizedName)) return true;

  const parts = normalizedName.split(" ").filter(Boolean);
  if (parts.length < 2) return false;

  const first = parts[0];
  const last = parts[parts.length - 1];
  if (first.length < 2 || last.length < 2) return false;

  const firstPattern = new RegExp(`\\b${escapeRegex(first)}\\b`, "i");
  const lastPattern = new RegExp(`\\b${escapeRegex(last)}\\b`, "i");
  return firstPattern.test(pdfText) && lastPattern.test(pdfText);
}

export function matchPeopleInPdfText(pdfText: string, people: PersonToMatch[]) {
  const matched: MatchedPerson[] = [];

  for (const person of people) {
    if (nameAppearsInText(person.name, pdfText)) {
      matched.push({ ...person, matchedName: person.name });
    }
  }

  return matched;
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatReportPeriod(month: number, year: number) {
  return `${MONTH_NAMES[month - 1] ?? month} ${year}`;
}
