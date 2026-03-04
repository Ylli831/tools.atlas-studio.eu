"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface FakeRecord {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
}

const FIRST_NAMES = [
  "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
  "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen", "Daniel", "Lisa", "Matthew", "Nancy",
  "Anthony", "Betty", "Mark", "Helen", "Donald", "Sandra", "Steven", "Ashley",
  "Andrew", "Emily", "Joshua", "Donna", "Kenneth", "Michelle", "Kevin", "Carol",
  "Brian", "Amanda", "George", "Melissa", "Timothy", "Deborah", "Ronald", "Stephanie",
  "Edward", "Rebecca", "Jason", "Laura", "Jeffrey", "Sharon", "Ryan", "Cynthia",
  "Jacob", "Kathleen", "Gary", "Amy", "Nicholas", "Angela", "Eric", "Shirley",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
  "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker",
];

const DOMAINS = [
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "protonmail.com",
  "company.com", "example.com", "email.org", "mail.com", "inbox.net",
];

const STREETS = [
  "Main St", "Oak Ave", "Cedar Ln", "Elm Dr", "Maple Rd", "Pine St",
  "Washington Blvd", "Park Ave", "Lake Dr", "River Rd", "Hill St",
  "Valley View Dr", "Forest Ln", "Sunset Blvd", "Broadway", "Highland Ave",
];

const CITIES = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
  "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
  "Fort Worth", "Columbus", "Charlotte", "Indianapolis", "Seattle", "Denver",
  "Boston", "Nashville", "Portland", "Las Vegas", "Memphis", "Louisville",
];

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Germany", "France",
  "Australia", "Netherlands", "Switzerland", "Sweden", "Norway",
];

const COMPANIES = [
  "Acme Corp", "Globex Inc", "Soylent Corp", "Initech", "Umbrella Corp",
  "Hooli", "Pied Piper", "Stark Industries", "Wayne Enterprises", "Cyberdyne",
  "Weyland-Yutani", "OsCorp", "LexCorp", "Massive Dynamic", "Dunder Mifflin",
  "Sterling Cooper", "Aperture Science", "Black Mesa", "Tyrell Corp", "GenCo",
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randPhone(): string {
  const area = Math.floor(Math.random() * 900) + 100;
  const mid = Math.floor(Math.random() * 900) + 100;
  const end = Math.floor(Math.random() * 9000) + 1000;
  return `(${area}) ${mid}-${end}`;
}

function randAddress(): string {
  return `${Math.floor(Math.random() * 9900) + 100} ${rand(STREETS)}`;
}

export default function FakeDataGeneratorTool() {
  const t = useTranslations("tools.fake-data-generator");
  const tc = useTranslations("common");
  const [count, setCount] = useState(10);
  const [fields, setFields] = useState({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    company: true,
    address: true,
    city: true,
    country: true,
  });
  const [records, setRecords] = useState<FakeRecord[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const toggleField = (key: keyof typeof fields) => {
    setFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const generateRecords = useCallback(() => {
    const newRecords: FakeRecord[] = [];
    for (let i = 0; i < count; i++) {
      const firstName = rand(FIRST_NAMES);
      const lastName = rand(LAST_NAMES);
      const record: FakeRecord = { id: i + 1 };
      if (fields.firstName) record.firstName = firstName;
      if (fields.lastName) record.lastName = lastName;
      if (fields.email)
        record.email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${rand(DOMAINS)}`;
      if (fields.phone) record.phone = randPhone();
      if (fields.company) record.company = rand(COMPANIES);
      if (fields.address) record.address = randAddress();
      if (fields.city) record.city = rand(CITIES);
      if (fields.country) record.country = rand(COUNTRIES);
      newRecords.push(record);
    }
    setRecords(newRecords);
  }, [count, fields]);

  const getActiveFields = () => {
    return (Object.keys(fields) as (keyof typeof fields)[]).filter(
      (k) => fields[k]
    );
  };

  const toJSON = () => {
    const active = getActiveFields();
    const data = records.map((r) => {
      const obj: Record<string, string | number> = {};
      active.forEach((f) => {
        if (r[f] !== undefined) obj[f] = r[f]!;
      });
      return obj;
    });
    return JSON.stringify(data, null, 2);
  };

  const toCSV = () => {
    const active = getActiveFields();
    const header = active.join(",");
    const rows = records.map((r) =>
      active
        .map((f) => {
          const val = r[f];
          if (typeof val === "string" && val.includes(",")) return `"${val}"`;
          return val ?? "";
        })
        .join(",")
    );
    return [header, ...rows].join("\n");
  };

  const copyAs = async (format: "json" | "csv") => {
    const text = format === "json" ? toJSON() : toCSV();
    await navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const fieldLabels: { key: keyof typeof fields; label: string }[] = [
    { key: "firstName", label: t("first_name_field") },
    { key: "lastName", label: t("last_name_field") },
    { key: "email", label: t("email_field") },
    { key: "phone", label: t("phone_field") },
    { key: "company", label: t("company_field") },
    { key: "address", label: t("address_field") },
    { key: "city", label: t("city_field") },
    { key: "country", label: t("country_field") },
  ];

  return (
    <ToolLayout toolSlug="fake-data-generator">
      <div className="space-y-6">
        {/* Configuration */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("count")} — {count}
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-teal"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1</span>
              <span>100</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("fields")}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {fieldLabels.map((f) => (
                <label
                  key={f.key}
                  className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 cursor-pointer hover:bg-border transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={fields[f.key]}
                    onChange={() => toggleField(f.key)}
                    className="accent-teal"
                  />
                  <span className="text-sm text-foreground">{f.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={generateRecords}
            className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            {t("generate")}
          </button>
        </div>

        {/* Results */}
        {records.length > 0 && (
          <>
            {/* Copy buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => copyAs("json")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  copied === "json"
                    ? "bg-success/10 text-success"
                    : "bg-surface text-foreground hover:bg-border"
                }`}
              >
                {copied === "json" ? tc("copied") : t("copy_json")}
              </button>
              <button
                onClick={() => copyAs("csv")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  copied === "csv"
                    ? "bg-success/10 text-success"
                    : "bg-surface text-foreground hover:bg-border"
                }`}
              >
                {copied === "csv" ? tc("copied") : t("copy_csv")}
              </button>
            </div>

            {/* Data table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface">
                      <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">
                        #
                      </th>
                      {getActiveFields().map((f) => (
                        <th
                          key={f}
                          className="text-left px-3 py-2 text-xs font-medium text-muted-foreground whitespace-nowrap"
                        >
                          {fieldLabels.find((fl) => fl.key === f)?.label ?? f}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, i) => (
                      <tr
                        key={i}
                        className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors"
                      >
                        <td className="px-3 py-2 text-xs text-muted-foreground">
                          {record.id}
                        </td>
                        {getActiveFields().map((f) => (
                          <td
                            key={f}
                            className="px-3 py-2 text-foreground whitespace-nowrap"
                          >
                            {record[f] ?? ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
