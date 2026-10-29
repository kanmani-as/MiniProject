import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EventItem } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function formatEventDateRange(startDate: string, endDate: string): string {
  if (startDate === endDate) {
    return formatDate(startDate);
  }
  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
}

// Generate .ics calendar download file
export function generateIcsFile(event: EventItem): string {
  const cleanStartDate = event.startDate.replace(/-/g, '');
  const cleanEndDate = (event.endDate || event.startDate).replace(/-/g, '');

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Local Event & Festival Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@localevents.gov`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;VALUE=DATE:${cleanStartDate}`,
    `DTEND;VALUE=DATE:${cleanEndDate}`,
    `SUMMARY:${event.title.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${event.shortDescription.replace(/\n/g, '\\n')}`,
    `LOCATION:${(event.venue + ', ' + event.address + ', ' + event.city).replace(/,/g, '\\,')}`,
    `ORGANIZER;CN="${event.organizerName}":MAILTO:${event.organizerEmail || 'contact@localevents.org'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  return icsLines.join('\r\n');
}

export function downloadCalendarIcs(event: EventItem) {
  const icsData = generateIcsFile(event);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${event.slug}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getGoogleCalendarUrl(event: EventItem): string {
  const cleanStartDate = event.startDate.replace(/-/g, '');
  const cleanEndDate = (event.endDate || event.startDate).replace(/-/g, '');
  
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(`${event.shortDescription}\n\nVenue: ${event.venue}\nOrganizer: ${event.organizerName}`);
  const location = encodeURIComponent(`${event.venue}, ${event.city}, ${event.state}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${cleanStartDate}/${cleanEndDate}&details=${details}&location=${location}`;
}
