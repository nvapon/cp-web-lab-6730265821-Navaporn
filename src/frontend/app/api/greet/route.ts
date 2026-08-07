import { NextResponse } from "next/server";

type GreetResponse = {
  message: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") ?? "";
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured." },
      { status: 500 },
    );
  }

  const query = name ? `?name=${encodeURIComponent(name)}` : "";

  try {
    const response = await fetch(`${backendUrl}/greet${query}`);
    const data: GreetResponse = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the greeting service." },
      { status: 502 },
    );
  }
}
