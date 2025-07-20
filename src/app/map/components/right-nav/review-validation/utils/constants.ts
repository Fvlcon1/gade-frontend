import { Status } from "./types";

export const statusMapping: Record<Status, string> = {
    "Open": "OPEN",
    "In Review": "IN_REVIEW",
    "False Positive": "FALSE_POSITIVE",
    "Closed": "CLOSED"
}

export const reverseStatusMapping: Record<string, Status> = {
    "OPEN": "Open",
    "IN_REVIEW": "In Review",
    "FALSE_POSITIVE": "False Positive",
    "CLOSED": "Closed"
}