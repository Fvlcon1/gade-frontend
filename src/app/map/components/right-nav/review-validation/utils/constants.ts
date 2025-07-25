import { Status } from "./types";

export const statusMapping: Record<Status, string> = {
    "Open": "OPEN",
    "In Review": "UNDER_REVIEW",
    "False Positive": "FALSE_POSITIVE",
    "Verified": "VERIFIED"
}

export const reverseStatusMapping: Record<string, Status> = {
    "OPEN": "Open",
    "UNDER_REVIEW": "In Review",
    "FALSE_POSITIVE": "False Positive",
    "VERIFIED": "Verified"
}