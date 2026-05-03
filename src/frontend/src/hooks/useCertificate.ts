import { useEffect, useState } from "react";
import type { Certificate } from "../types/course";
import { useAuth } from "./useAuth";
import { useCourse } from "./useCourse";

const CERT_KEY = "codex_python_certificate";

function loadCertificate(): Certificate | null {
  try {
    const stored = localStorage.getItem(CERT_KEY);
    return stored ? (JSON.parse(stored) as Certificate) : null;
  } catch {
    return null;
  }
}

export function useCertificate() {
  const { isCompleted } = useCourse();
  const { principal } = useAuth();
  const [certificate, setCertificate] = useState<Certificate | null>(
    loadCertificate,
  );

  useEffect(() => {
    if (isCompleted && !certificate && principal) {
      const now = BigInt(Date.now()) * BigInt(1_000_000); // nanoseconds
      const cert: Certificate = {
        id: `cert-${principal.slice(0, 8)}-${Date.now()}`,
        userId: principal,
        learnerName: "Python Graduate",
        courseTitle: "Python Mastery: Beginner to Advanced",
        completedAt: now,
        issuedAt: now,
      };
      localStorage.setItem(
        CERT_KEY,
        JSON.stringify(cert, (_k, v) =>
          typeof v === "bigint" ? v.toString() : v,
        ),
      );
      setCertificate(cert);
    }
  }, [isCompleted, certificate, principal]);

  const clearCertificate = () => {
    localStorage.removeItem(CERT_KEY);
    setCertificate(null);
  };

  return {
    certificate,
    isCompleted,
    clearCertificate,
  };
}
