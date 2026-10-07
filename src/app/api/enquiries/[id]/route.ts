import { NextResponse } from "next/server";
import { updateEnquiryStatus, deleteEnquiry } from "@/lib/enquiries";
import { EnquiryStatus } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const validStatuses: EnquiryStatus[] = ["New", "Contacted", "In Discussion", "Won", "Archived"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const updated = updateEnquiryStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update enquiry";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ok = deleteEnquiry(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete enquiry";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
