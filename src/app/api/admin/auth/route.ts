import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const SESSION_COOKIE = "growbroo_admin_session";
const SESSION_SECRET = "growbroo_auth_token_secure_2026";

/**
 * Dynamically retrieves credentials from .env,
 * allowing live updates without needing to restart the dev server.
 */
function getExpectedCredentials(): { loginId: string; password: string } {
  let envLoginId = process.env.ADMIN_LOGIN_ID || "";
  let envPassword = process.env.ADMIN_PASSWORD || "";

  // Check .env on disk for live edits
  const candidateFiles = [".env", ".env.local"]
    .map((filename) => {
      const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), filename);
      try {
        if (fs.existsSync(fullPath)) {
          return { fullPath, mtime: fs.statSync(fullPath).mtimeMs };
        }
      } catch {
        // ignore
      }
      return null;
    })
    .filter(Boolean) as { fullPath: string; mtime: number }[];

  candidateFiles.sort((a, b) => b.mtime - a.mtime);

  for (const { fullPath } of candidateFiles) {
    try {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (key === "ADMIN_LOGIN_ID") {
            envLoginId = val;
          }
          if (key === "ADMIN_PASSWORD") {
            envPassword = val;
          }
        }
      }
      if (envLoginId && envPassword) break;
    } catch {
      // ignore
    }
  }

  return {
    loginId: envLoginId.trim(),
    password: envPassword.trim(),
  };
}

function checkCredentials(loginId: string, pass: string): boolean {
  const { loginId: expectedId, password: expectedPass } = getExpectedCredentials();

  if (!expectedId || !expectedPass) {
    return false;
  }

  // Exact comparison against environment variables (no hardcoded credentials)
  const idMatch = loginId.trim().toLowerCase() === expectedId.toLowerCase();
  const passMatch = pass.trim() === expectedPass;

  return idMatch && passMatch;
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (session && session.value === SESSION_SECRET) {
    const { loginId } = getExpectedCredentials();
    return NextResponse.json({
      authenticated: true,
      user: {
        loginId: loginId || "Admin",
      },
    });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { loginId, password } = body;

    if (!loginId || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both Login ID and Password" },
        { status: 400 }
      );
    }

    const isValid = checkCredentials(loginId, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid Login ID or Password. Please check and try again." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, SESSION_SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: { loginId: loginId.trim() },
      message: "Authentication successful",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Authentication error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
